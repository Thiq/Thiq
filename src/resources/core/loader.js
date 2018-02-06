var BufferedReader = Java.type('java.io.BufferedReader');
var InputStreamReader = Java.type('java.io.InputStreamReader');
var FileInputStream = Java.type('java.io.FileInputStream');
var BufferedWriter = Java.type('java.io.BufferedWriter');
var OutputStreamWriter = Java.type('java.io.OutputStreamWriter');
var FileOutputStream = Java.type('java.io.FileOutputStream');
var File = Java.type('java.io.File');

var registeredLoaders = registeredLoaders || {};
var Bukkit = org.bukkit.Bukkit;

function _readFile(location) {
    var fIn = new BufferedReader(new InputStreamReader(new FileInputStream(location), "UTF8"));

    var line;
    var string = "";
    while ((line = fIn.readLine()) != null) {
        string += line + '\n';
    }

    fIn.close();
    return string;
}

(function() {


    function initialize() {
        var config = JSON.parse(_readFile('./plugins/Thiq/loaders/.config'));
        var loaders = config._map;
        for (var name in loaders) {
            if (loaders.hasOwnProperty(name)) {
                var _ext = loaders[name];
                if (registeredLoaders[name] != undefined) {
                    // the loader has already been loaded
                    continue;
                }
                registeredLoaders[name] = {
                    ext: _ext
                }
                var loaderBody = _readFile('./plugins/Thiq/loaders/' + name + '/loader.js');
                var loaderHead = '(function(module){';
                var loaderTail = '})';
                var loader = {
                    exports: true
                }
                console.log('Registering ' + name + ' loader', 'd');
                try {
                    eval(loaderHead + loaderBody + loaderTail).apply(null, [loader]);
                    registeredLoaders[name].exports = loader.exports;
                    if (!loader.exports.compileFn) {
                        console.log('Loader ' + name + ' has no compile function. This loader will be invalid for use', 'c');
                    }
                } catch (e) {
                    console.log('An error occured when registering loader ' + name + ': ' + e, 'c');
                }
            }
        }
        registeredLoaders.js = {
            ext: '.js',
            exports: {
                compileFn: function(input) {
                    return input;
                }
            }
        }
    
        console.log('WARNING: when using loaders, a heap overflow may occur with the command /reload depending on the size of the loader file.', 'c');
    }

    function findLoaderForFile(filename) {
        for (var l in registeredLoaders) {
            var loader = registeredLoaders[l];
            if (filename.endsWith(loader.ext)) return loader;
        }
        return registeredLoaders.js;
    }

    global.createWrapperFunction = function(body, argsObject) {
        var argNames = [], argValues = [];
        for (var arg in argsObject) {
            if (!argsObject.hasOwnProperty(arg)) continue;
            argNames.push(arg);
            argValues.push(argsObject[arg]);
        }
        var wrapperHead = '(function(' + arrayToString(argNames) + '){';
        var wrapperBody = body;
        var wrapperTail = '})';
        return wrapperHead + wrapperBody + wrapperTail;
    }

    global.callFn = function(js, argsObject) {
        var wrapper = createWrapperFunction(js, argsObject);
        var fn = eval(wrapper);
        return fn.apply(null, argValues);
    }
    
    // set to global so all scripts can use it. Tho idk if that's a good idea :think:
    global.loadFromFile = function(file, wrapperArgs) {
        try {
            var input = _readFile(file);
            if (wrapperArgs != undefined) {
                input = createWrapperFunction(input, wrapperArgs);
            }
    
        } catch (exception) {
            log('Failed to load file ' + file + ': ' + exception, 'c');
        }
    }

    initialize();
})();