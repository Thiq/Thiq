var BufferedReader = importClass('java.io.BufferedReader');
var InputStreamReader = importClass('java.io.InputStreamReader');
var FileInputStream = importClass('java.io.FileInputStream');
var BufferedWriter = importClass('java.io.BufferedWriter');
var OutputStreamWriter = importClass('java.io.OutputStreamWriter');
var FileOutputStream = importClass('java.io.FileOutputStream');
var File = importClass('java.io.File');

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

function importClass(javaClass) {
    return Java.type(javaClass);
}

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

// the loader will first use all preprocessors before evaluating the script.
// if the preprocessor arg is not undefined, it will process only using that one.
function load(javascript) {
    try {
        eval(javascript);
    } catch (exception) {
        log('Failed to process JavaScript: ' + exception, 'c');
    }
}

function loadFromFile(file) {
    try {
        loader.load(file);
    } catch (exception) {
        log('Failed to load file ' + file + ': ' + exception, 'c');
    }
}

function findLoaderForFile(filename) {
    for (var l in registeredLoaders) {
        var loader = registeredLoaders[l];
        if (filename.endsWith(loader.ext)) return loader;
    }
    return registeredLoaders.js;
}

function callFn(js, argsObject) {
    var argNames = [],
        argValues = [];
    for (var arg in argsObject) {
        if (!argsObject.hasOwnProperty(arg)) continue;
        argNames.push(arg);
        argValues.push(argsObject[arg]);
    }
    var wrapperHead = '(function(' + arrayToString(argNames) + '){';
    var wrapperBody = js;
    var wrapperTail = '})';
    var fn = eval(wrapperHead + wrapperBody + wrapperTail);
    return fn.apply(null, argValues);
}

initialize();