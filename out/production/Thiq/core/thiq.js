/**
 * Returns a plugin with the passed name. If no argument, then it returns Thiq.
 * @param {string=} name 
 */
function getPlugin(name) {
    if (typeof(name) !== 'string') {
        name = "Thiq";
    }
    return loader.server.pluginManager.getPlugin(name);
}

var plugin = getPlugin();
var fs = require('fs');

function read_proc() {
    var pb = new java.lang.ProcessBuilder["(java.lang.String[])"](_a(arguments));
    pb.redirectErrorStream(true);
    var proc = pb.start();
    var out = proc.inputStream;
    var reader = new java.io.BufferedReader(new java.io.InputStreamReader(out));
    var output = "";
    var line;
    while ((line = reader.readLine()) != null) {
        output += line + "\n";
    }
    return output;
}

function evalScript(javascript) {
    try {
        return eval(javascript);
    } catch (exception) {
        var ex = exception;
        if (ex.sciptExcetion) {
            ex = ex.sciptExcetion;
            while (ex && ex.unwrap) {
                ex = ex.unwrap().cause;
            }
            ex = (ex || { message: "Unknown error" }).message;
        }

        log(ex);
        if (/syntax error/i.test(ex)) {
            throw "\n" + javascript;
        } else {
            throw exception;
        }
    }
}

function callEvent(handler, event, data) {
    if (handler[event]) {
        handler[event](data);
    }
}

function cmdEval(message, sender, type) {
    currEvalPlr = sender;
    try {
        var event = {
            sender: sender,
            type: type,
            ext: {}
        }
        callEvent(js, "extensions", event);
        var result;
        with(event.ext) {
            result = evalScript(message);
        }
        callEvent(js, "evalComplete", {
            sender: sender,
            result: result
        });
        if (result === undefined) {
            result = "undefined";
        } else if (result === null) {
            result = "null";
        }
        sender.sendMessage("\xA7a=> " + result);
        return result;
    } catch (ex) {
        sender.sendMessage("\xA7c" + ex);
        return undefined;
    }
}
var currEvalPlr;

function loadLibraryScript(name, loader) {
    log('Loading library script ' + name, 'd');
    try {
        if (fs.exists('./plugins/Thiq/libs/' + name)) {
            var paramsObject = {
                exports: {},
                __filename: name,
                __dirname: './plugins/Thiq/libs/'
            };
            var contents = loader.exports.compileFn(_readFile(paramsObject.__dirname + paramsObject.__filename));
            for (var e in paramsObject.exports) {
                var globalExport = paramsObject.exports[e];
                if (paramsObject.exports.hasOwnProperty(e)) {
                    eval(e + ' = ' + globalExport);
                }
            }
            callFn(contents, paramsObject);
        } else {
            log('Could not locate library script ' + name, 'c');
        }
    } catch (ex) {
        log('An error occured when loading the script ' + name + ': ' + ex, 'c');
    }
}

registerCommand({
    name: "js",
    description: "Executes javascript in the server",
    usage: "\xA7cUsage: /<command> [javascript code]",
    permission: registerPermission("thiq.js", "op"),
    permissionMessage: "\xA7cYou don't have permission to use that!",
    aliases: ["javascript"]
}, function(sender, label, args) {
    var message = args.join(" ");

    if (message.length < 1) {
        return false;
    }

    message = message.replace(/\{clipboard\}/i, sender.clipboardText);

    sender.sendMessage("\xA77>> " + message);

    cmdEval(message, sender, "js");
});

function reloadBlockData() {
    loader.loadCoreData();
}

function initializeCoreModules() {
    // event handler objects
    global.block = {};
    global.enchantment = {};
    global.entity = {};
    global.inventory = {};
    global.hanging = {};
    global.player = {};
    global.server = {};
    global.vehicle = {};
    global.weather = {};
    global.world = {};
    global.js = {};
    var stdlib = fs.readFileSync('./plugins/Thiq/modules/.bin/stdlib.json');
    var moduleJSON = JSON.parse(stdlib);
    for (var i = 0; i < moduleJSON.length; i++) {
        try {
            require(moduleJSON[i]);
        } catch (ex) {
            log('Error loading core package ' + moduleJSON[i] + ': ' + ex, 'c');
            throw 'To validate your package, use `tpm validate packages`.';
        }
    }
    log('Successfully loaded core packages.', 'd');
}

function initializeThiq() {
    // cancel all pending async tasks
    cancelAllIntervals();
    // ensure all of the core STDLIB modules exist. These are defined in 'modules/.bin/stdlib.json'
    initializeCoreModules();
    // load databases
    reloadBlockData();
    require('ender-chest').initialize();

    libraryConfig = new config('./plugins/Thiq/thiq.json').load();
    log('Loading libraries...', 'd');
    // load the lib files
    for (var i = 0; i < libraryConfig.libraries.length; i++) {
        var value = libraryConfig.libraries[i];
        if (typeof value == 'string') {
            loadLibraryScript(value, findLoaderForFile(value));
        } else if (typeof value == 'object') {
            loadLibraryScript(value.file, value.loader);
        }
    }
    log('Calling startup...', 'd');
    var startupContents = fs.readFileSync('./plugins/Thiq/startup.js');
    callFn(startupContents, {});
    log('Startup complete.', 'd');
}

function initializeTests() {
    // cancel all pending async tasks
    cancelAllIntervals();
    // ensure all of the core STDLIB modules exist. These are defined in 'modules/.bin/stdlib.json'
    initializeCoreModules();
    // load databases
    reloadBlockData();
    require('ender-chest').initialize();
    log('Beginning test loads. Awaiting startup completion for tests to begin.');
    loadCore('tts');
}

if (global.__exectests != undefined) {
    initializeTests();
} else {
    initializeThiq();
}