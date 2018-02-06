function arrayClone(arr, length) {
    if (length) {
        return arr.slice(0, length);
    } else {
        return arra.slice(0);
    }
}

function _s(str) {
    return "" + new String(str);
}

function arrayToString(array) {
    var s = '';
    for (var i = 0; i < array.length; i++) {
        s += array[i] + ',';
    }
    return s.replace(/\,$/, '');
}

function arrayToDictionary(array, keySelector) {
    var dictionary = {};
    var keyFn = keySelector;
    if (typeof keySelector == 'string') {
        keyFn = function(item) { return item[keySelector]; }
    }
    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        dictionary[keyFn(item)] = item;
    }
    return dictionary;
}

function arrayContains(array, element) {
    for (var i in array) {
        if (array[i] == element) {
            return true;
        }
    }
    return false;
}

function enumContains(enu, name) {
    for (var i in enu) {
        if (i == name) return true;
    }
    return false;
}

function _a(ja) {
    var newarray = [];
    if (ja instanceof java.lang.Iterable) {
        var iter = ja.iterator();
        while (iter.hasNext()) {
            newarray.push(iter.next());
        }
        return newarray;
    } else if (_a instanceof java.util.Map) {
        ja = ja.values().toArray();
    }

    for (var i = 0; i < ja.length; ++i) {
        newarray.push(ja[i]);
    }

    return newarray;
}

function stringArray(array) {
    var _new = [];
    for (var i in array) {
        _new[i] = _s(array[i]);
    }
    return _new;
}

function numArr(start, end) {
    var res = [];
    for (var i = start; i <= end; ++i) {
        res.push(i);
    }
    return res;
}

function sleep(milliseconds) {
    milliseconds = milliseconds || 0
    java.lang.Thread.sleep(milliseconds);
}

function listMembers(obj) {
    var results = [];
    for (var i in obj) {
        results.push(i);
    }
    return results;
}

function parseNum(num) {
    return 0 + num;
}

function setTimeout(func, time) {
    return async(function() {
        sleep(time);
        func();
    });
}

var scheduler = Bukkit.getScheduler();
var thiqPlugin = Bukkit.getPluginManager().getPlugin('Thiq');

function runnable(fn) {
    var Runnable = require('@java.lang.Runnable');
    return new Runnable({
        run: fn
    });
}

function setInterval(fn, time) {
    var task = scheduler.scheduleSyncRepeatingTask(thiqPlugin, runnable(fn), 1, time / 50);
    if (task == -1) throw 'Could not schedule interval';
    return task;
}

function setTimeout(fn, time) {
    var task = scheduler.scheduleSyncDelayedTask(thiqPlugin, runnable(fn), time / 50);
    if (task == -1) throw 'Could not schedule timeout';
    return task;
}

function cancelInterval(id) {
    scheduler.cancelTask(id);
}

function cancelAllIntervals() {
    scheduler.cancelTasks(thiqPlugin);
}

function evalInContext(code, context) {
    with(context) {
        eval(_s(code));
    }
}

function numToEnum(enumObject, value) {
    return enumObject.values()[value];
}

String.isNullOrEmpty = function(input) {
    return input == undefined || input == null || input == '';
}

function constructObject(constructor, args) {
    function F() {
        return constructor.apply(this, args);
    }
    F.prototype = constructor.prototype;
    return new F();
}

Function.prop('new', {
    get: function() {
        return function() {
            return constructObject(this, arguments);
        }
    }
});

function unwrapObject(target) {
    var value = {};
    for (var field in target) {
        value[field] = target[field];
    }
    return value;
}

function extend(javaObject, options) {
    var result = Java.extend(javaObject);
    for (var property in result) {
        result[property] = options[property] || Java.super(result)[property];
    }
    return result;
}

Boolean.prototype.toUpperCase = function() {
    if (this === true) {
        return 'TRUE';
    } else {
        return 'FALSE';
    }
}

var eolReg = /[\!\$\%\^\&\*\(-\+\=\{\[\:\"\'\<\,\>\.\?\/]$/;
var contEolReg = /^[\)\]\}]/;

String.prototype.minify = function() {
    var lines = this.split('\n');
    var result = '';
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].split('//')[0].trim();
        var nextLine = lines[i + 1];
        if (line.length == 0) continue;
        if ((eolReg.test(line) === true) || line.endsWith(';')) {
            result += line;
        } else {
            result += (line + ';');
        }
    }
    return result;
}