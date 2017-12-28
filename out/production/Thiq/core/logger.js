Object.prototype.toString = function() { try { return JSON.stringify(this, ' ', '\t').replace(/\t/g, "  "); } catch (e) { return "[object Object]" } }
Array.prototype.toString = function() { try { return JSON.stringify(this, ' ', '\t').replace(/\t/g, "  "); } catch (e) { return "[object Array]" } }

Logger = (function() {
    this.debugMessages = false;
    this.log = function(msg, level, verbose) {
        if (verbose && !this.debugMessages) return;
        if (!level) level = "f";
        if (msg instanceof Array) {
            for (var i in msg) {
                loader.server.consoleSender.sendMessage("\xA7" + level + "[Thiq] " + msg[i]);
            }
        } else {
            loader.server.consoleSender.sendMessage("\xA7" + level + "[Thiq] " + msg);
        }
    }

    return this;
}());

function log(msg, level, verbose) {
    Logger.log(msg.toString(), level, verbose);
}

var console = {
    log: log,
    warning: log,
    debug: log,
    trace: log
};