
/**
 * Registers a command for usage. All scripts can use this.
 * @param {{name:string,usage:string,permission:Permission,permissionMessage:string,description:string,aliases:string[]}} data 
 * @param {function(Object,string,string)} func 
 */
function registerCommand(data, func) {
    var commandExecClass = plugin["class"].classLoader.loadClass("net.conji.thiq.JsCommandExecutor");
    var newCommand = function() {
        var commandClass = plugin["class"].classLoader.loadClass("net.conji.thiq.JsCommand");
        var commandEx = (function(__func__) {
            var state = { func: __func__, permTest: function(p) { return true; } };
            var object = {
                execute: function(sender, label, args) {
                    if (!this.getState().permTest(sender)) {
                        return true;
                    }
                    try {
                        label = _s(label);
                        args = stringArray(_a(args));
                        var flags = [];
                        if (data.flags) {
                            for (var i in args) {
                                if (/^\-([a-z]+)/i.test(args[i])) {
                                    for (var k = 1; k < args[i].length; ++k) {
                                        flags.push(args[i][k]);
                                    }
                                    args.splice(i--, 1);
                                }
                            }
                        }
                        var result = this.getState().func(sender, label, args, flags);
                        if (result == false) {
                            sender.sendMessage(data.usage.replace(/\<command\>/g, _s(label)));
                        };
                        return true;
                    } catch (ex) {
                        if (typeof(ex) == 'string') {
                            sender.sendMessage("\xA7c" + ex);
                        } else {
                            sender.sendMessage("\xA7cAn error occured executing your command");
                            log(ex, 'c');
                        }
                        return true;
                    }
                },
                getState: function() { return state; }
            };
            return loader.Interface(object, commandClass);
        })(func);

        data.description = data.description || "";
        data.usage = data.usage || "";
        data.aliases = data.aliases || [];

        var cmd = plugin.createCommand(data.name, data.description, data.usage, data.aliases, commandEx);

        if (data.permission) {
            cmd.permission = data.permission;
            if (data.permissionMessage) {
                cmd.executor.state.permTest = function(p) {
                    if (cmd.testPermissionSilent(p)) {
                        return true;
                    } else {
                        p.sendMessage(data.permissionMessage);
                        return false;
                    }
                }
            } else {
                cmd.executor.state.permTest = function(p) {
                    return cmd.testPermission(p);
                }
            }
        }

        return cmd;
    }

    var command;
    if ((command = loader.server.commandMap.getCommand(data.name)) && command["class"].equals(commandExecClass)) {
        log("Unregistering old command '" + data.name + "'", 'e', 'verbose');

    }
    log("Registering new command '" + data.name + "'", 'e', 'verbose');
    loader.server.commandMap.register("js", newCommand());
}

/**
 * Unregisters a command within Spigot. All plugins can use this.
 * @param {string} name 
 */
function unregisterCommand(name) {
    var cmdMap = loader.server.commandMap;
    var cmd = cmdMap.getCommand(name);
    try {
        cmd.unregister(cmdMap);
        return true;
    } catch (ex) {
        log('Failed to unregister command ' + name + ': ' + ex);
        return false;
    }
}
