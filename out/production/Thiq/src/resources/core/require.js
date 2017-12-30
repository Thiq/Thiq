/*

A CommonJS style require module for Thiq, it behaves like NodeJS requiring and importing.
While it uses NodeJS style modules, it does not work with NodeJS currently. Work is being
done to replicate V8 STDLIB for Thiq and for Nashorn usage, but it is incomplete. The current
module system loads using the following scheme:
```
// music.js
function getNote() {
    return 'B#';
}

// create a function in the export object
exports.getNote = getNote;

// main.js
var music = require('music');
console.log(exports.getNote());

// To use a function as the exports, you instead need to set module.exports as the function.
module.exports = function() { return 'And I will always love you!'; }
var dion = require('dion');
console.log(dion());
```
In order for Thiq to find music.js, we need to use a module structure for the directory.
/Thiq
    -/core
    -/libs
    -/modules
        -/music
            -index.js

Thiq will load the index.js as the module's entry point. If you have a specific file, you 
can specify it in a packages.json file.

/Thiq
...-/modules
    -/music
        -package.json
        -music.js

// package.json
{
    main: 'music.js'
}

If you want to reference a file directly, you must prefix the file with './'.
Example:
`require('./libs/music')`
The file extension is not required for these, as it will attempt to load with both JS and JSON.
*/

(function(__global__, __root__) {
    var jFile = importClass('java.io.File');
    var jPath = importClass('java.nio.file.Paths');
    var cachedModules = {};
    var $root = __root__;

    function __module(name) {
        if (!cachedModules[name]) {
            require(name);
        }
        return cachedModules[name].__packageinfo;
    }

    /**
     * 
     * @param {string} lib The name of the lib.
     * @param {string} root The root of the require function.
     * @param {*} module The parent module being passed in. If being called from inside of a module,
     * then it references the parent module.
     */
    function __require(lib, options, root, module) {
        // since Java types are allowed, we need to create a way for Java types to be required. 
        // You can prepend a full class location with '@' to tell require that it's a Java class.
        if (lib.startsWith('@')) {
            try {
                return eval(lib.substring(1));
            } catch (ex) {
                return Java.type(lib.substring(1));
            }
        }

        // You can use require on multiple file types with multiple goals.
        // One of the main ones is to load a module. This is done by passing
        // a lib like 'net/http' or 'os'. 
        // Another goal is to load a single file. This can be done by passing
        // the file's location relative to the root folder currently loading.
        // This is done like './lib/my-file.js'. The '.js' can be omitted as it
        // only checks if the start of the lib is './'.
        // Finally, two different file types can be loaded. JS and JSON. If JS is
        // passed, than it'll process the JS as a module. If it is JSON, then the
        // module's exports will be defined as the JSON's contents.

        // first we canonize the lib being called so we have consistency.
        lib = lib.replace('\\\\', '/');
        // we can do a check if the module already exists.
        if (cachedModules[lib] != undefined) {
            if (cachedModules[lib].isLiveReload !== true) {
                return cachedModules[lib].exports.default || cachedModules[lib].exports;
            }
        }
        // next we determine if lib is a file or a module
        var isModule = !(/^\.\//.test(lib));
        var parentOptions = options;
        if (!options.loader) options.loader = 'js';
        // now we determine the file location of what we're trying to load.
        // This is the file location in relation to the module. The root will be plugged in
        // at the end.
        if (!module) {
            module = {
                exports: {},
                root: root,
                name: lib,
                isLoaded: false
            };
        }

        var _loader;
        if (isModule) {
            // reset root to global root
            root = __root__;
            // reset the module object locally
            module = cachedModules[lib] || {
                exports: {},
                root: root,
                name: lib,
                isLoaded: false
            };
            // reset the loader to JS loader for a separate module
            _loader = registeredLoaders.js;
            parentOptions.loader = 'js';
            // if we're loading a module, we need to determine the entry point for the module.
            // first we look for the package.json file to determine the main field.
            // Also load the settings while we're at it
            if (fileExists(root + '/modules/' + lib + '/package.json')) {
                var packageData = _readFile(root + '/modules/' + lib + '/package.json');
                var packageJSON = JSON.parse(packageData);
                module.__packageinfo = packageJSON;

                if (packageJSON.main != undefined) {
                    module.__filename = packageJSON.main;
                }
                module.loader = packageJSON.loader;
                module.isLiveReload = packageJSON.liveReload;
                if (!(!packageJSON.loader)) parentOptions.loader = packageJSON.loader;
            }
            _loader = registeredLoaders[parentOptions.loader];
            // this covers is both the package.json is not found and if the main field doesn't exist
            // in the package.json
            if (module.__filename == undefined) {
                if (fileExists(root + '/modules/' + lib + '/index.json')) {
                    module.__filename = 'index.json';
                } else {
                    if (fileExists(root + '/modules/' + lib + '/index' + _loader.ext)) {
                        module.__filename = 'index' + _loader.ext;
                    } else if (fileExists(root + '/modules/' + lib + '/index.js')) {
                        _loader = registeredLoaders.js;
                        module.__filename = 'index.js';
                    } else {
                        throw 'An error occured when loading module ' + lib + ': Could not locate entry point (' + root + '/modules/' + lib + ')';
                    }
                }
            }

            module.root += '/modules/' + lib;
        } else {
            _loader = registeredLoaders[parentOptions.loader];
            if (!lib.endsWith(_loader.ext)) {
                lib += _loader.ext;
            }
            if (fileExists(root + '/' + lib)) {
                module.__filename = '/' + lib;
            } else {
                // TODO: hook into loaders
                throw 'An error occured when loading module ' + lib + ': Could not locate file ' + root + lib;
            }
        }
        if (_loader == undefined) throw 'Invalid loader for ' + lib + ': ' + parentOptions.loader;
        // if we've gotten this far, we've located the file location. Now we need to process it.
        var fileContents = _readFile(normalizePath(module.root + '/' + module.__filename));
        if (/\.json$/.test(module.__filename)) {
            var moduleJSON = JSON.parse(fileContents);
            module.exports = moduleJSON;
        } else {
            var compiledContents = _loader.exports.compileFn(fileContents);
            var paramsObject = {
                module: module,
                exports: module.exports,
                require: function(lib, options) {
                    // the local require is the same as the global require, except where the 
                    // root of the function is at. Globally, it's set to the entire app directory.
                    // Locally, it needs to be set to the module's base directory.
                    return __require(lib, parentOptions || {}, module.root, module);
                },
                __filename: module.__filename
            };
            module.isLoaded = true;
            callFn(compiledContents, paramsObject);
        }
        // set the module into the cache for later usage.
        cachedModules[lib] = module;
        return module.exports.default || module.exports;
    }

    function fileExists(file) {
        return new jFile(file).exists();
    }

    function normalizePath(path) {
        return jPath.get(path).normalize().toString();
    }

    __global__.require = function(lib, options) {
        return __require(lib, options || {}, __root__);
    }
    __global__.rmodule = function(lib) {
        return __module(lib);
    }
}).call(null, global, './plugins/Thiq');