// TTS: Thiq Test Suite
/*
This file is in charge of executing JS tests on a Spigot server while only loading the necessary files for 
the test. 
args:
--module {modulename}: skips loading the libraries folder and thiq.js to test the module then closes the server 
with a log of the server opened in a text editor.
--library {libraryname}: skips the loading of all libraries except for the one being tested.
*/

(function() {
    var fs = require('fs');

    function beginExecTests() {
        var testargs = global.__testargs;
        if (testargs['--module'] != undefined) {
            var module = rmodule(testargs['--module']);
            doModuleTest(module, testargs);
        } else if (testargs['--library'] != undefined) {
            doLibTest(testargs['--library']);
        } else {
            throw new Error('Expected test param of --module|--library');
        }

        if (!testargs['--runindef']) {
            Bukkit.shutdown();
        }
    }

    function doModuleTest(module, args) {
        var scripts = module.__packageinfo.scripts;
        var moduledir = module.root;
        for (var script in scripts) {
            if (args[script] != undefined) {
                var file = args[script];
                var filec = fs.readFileSync(moduledir + file);
                callFn(filec, { expect: _expect, handle: fakeHandles });
            }
        }
    }

    function doLibTest(lib) {
        var filec = fs.readFileSync('./plugins/Thiq/lib/' + lib);
        callFn(filec, { expect: _expect, handle: fakeHandles });
    }

    function _expect() {
        var target = arguments[0];
        if (typeof target == 'function') {
            return expectFn(target, arguments[1], arguments[2]);
        } else if (typeof target == 'Object') {
            return expectValue(target, arguments[1]);
        } else {
            return expectEvent(target, arguments[1]);
        }
    }

    function expectFn(fn, args, result) {
        var wrapperFn = function() {
            return fn.apply(null, args);
        }
        var expect = new ExpectResult(wrapperFn, result);
        return expect;
    }

    function expectValue(target, result) {
        var wrapperFn = function() {
            return target;
        }
        var expect = new ExpectResult(wrapperFn, result);
        return expect;
    }

    function expectEvent(targetEvent, handler) {

    }

    var fakeHandles = {
        player: {

        },
        server: {

        },
        world: {

        },
        block: {

        },
        entity: {

        }
    };

    function ExpectResult(fn, expect) {
        this._fn = fn;
        this.isSuccessful = true;
        this.lastError = undefined;
        this.expect = expect;

        try {
            this.result = fn();
            if (this.result != this.expect) throw new Error('Expected "' + this.expect + '" but got "' + this.result + '"');
            this.isSuccessful = true;
        } catch (ex) {
            this.lastError = ex;
            this.isSuccessful = false;
        }
    }

    ExpectResult.prototype.success = function(data) {
        if (typeof data == 'function') {
            data(this.result);
        } else {
            log('[TEST-RESULT#SUCCESS]: ' + data);
        }
    }

    ExpectResult.prototype.error = function(data) {
        if (typeof data == 'function') {
            data(this.lastError);
        } else {
            log('[TEST_RESULT#FAILURE]:  + data');
        }
    }
})();

(function() {
    // example test
    var fs = require('fs');

    expect(fs.readFileSync, [ './test.txt' ], 'Hello world')
        .success('Passed readfile')
        .error('Failed readfile');

    expect(fs.mkdirs, [ './test/' ])
        .success('Passed mkdirs')
        .error('Failed mkdirs');

    expect(handle[player]['join'], function(e) {
        e.getPlayer().sendMessage('Hello');
    })
        .success('Passed player join')
        .error('Failed player join');
})