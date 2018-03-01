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
var path = require('path');
var File = require('@java.io.File');
libraryConfig = new Config('./plugins/Thiq/thiq.json');
libraryConfig.load();

// since event handlers are now set, we can create the class loading hook.
// If you don't like hacks, don't watch.
/**
 * This registers all classes of the loaded plugin and adds them to the JS environment.
 * Hackish, but it works without external dependencies.
 */
eventHandler('server', 'pluginEnable', function(e) {
    var pClass = e.getPlugin().getClass();
    var pCl = pClass.getClassLoader();
    var pf = java.lang.ClassLoader.class.getDeclaredField('classes');
    pf.setAccessible(true);
    var classes = pf.get(pCl);
    for (var i = 0; i < classes.length; i++) {
        var clazz = classes[i];
        try {
            var methods = clazz.methods;
            var hasInit = false;
            for (var j = 0; j < methods.length; j++) {
                methods[j].setAccessible(true);
                if (methods[j].getName() == '<init>') hasInit = true;
            }
            if (clazz == pClass) {
                createGlobalObjectFromClass(clazz, e.getPlugin());
            } else if (clazz.isInterface() || !hasInit) {
                createGlobalObjectFromClass(clazz, clazz);
            } else {
                createGlobalObjectFromClass(clazz);
            }
        } catch (ex) {
            console.log('Failed to load class ' + clazz.getName());
        }
    }
});

function createGlobalObjectFromClass(type, instance) {
    var ns = type.getName();
    var sects = ns.split('.');
    var lastNs = global;
    for (var i = 0; i < sects.length - 1; i++) {
        var check = sects[i];
        if (!lastNs[check]) lastNs[check] = {};
        lastNs = lastNs[check];
    }
    if (!lastNs[type.getSimpleName()]) {
        try {
            lastNs[type.getSimpleName()] = instance || type.newInstance();
        } catch(e) {
            console.log('Failed to register type ' + type.getName());
        }
    }
}

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
            $DIR = new File('./plugins/Thiq/libs/' + name).getParent();
            var module = {
                name: name,
                exports: {}
            }
            var result = loader.exports.compileFn(_readFile('./plugins/Thiq/libs/' + name));
            callFn(result, { module: module, exports: module.exports });
            addModule(module);
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
    var stdlib = fs.readFileSync((libraryConfig.objects.modulesDir || './plugins/Thiq/modules/') + '.bin/stdlib.json');
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
    // reset the require modules, just because we need to
    unregisterModules();
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
    // cancel all pending async tasks
    cancelAllIntervals();
    // ensure all of the core STDLIB modules exist. These are defined in 'modules/.bin/stdlib.json'
    initializeCoreModules();
    // load databases
    reloadBlockData();
    require('ender-chest').initialize();

    log('Loading libraries...', 'd');
    // load the lib files
    for (var i = 0; i < libraryConfig.objects.libraries.length; i++) {
        var value = libraryConfig.objects.libraries[i];
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

global.__reloadJs = function() {
    initializeThiq();
}