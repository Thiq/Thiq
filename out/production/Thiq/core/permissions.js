/**
 * Registers a permission. 
 * @param {string} permission 
 * @param {*} perm_default: Can be true for anybody to use it, false for permission only, or 'op' for operator only.
 * @param {string[]} parents 
 */
function registerPermission(permission, perm_default, parents) {
    try {
        if (loader.server.pluginManager.getPermission(permission)) {
            loader.server.pluginManager.removePermission(loader.server.pluginManager.getPermission(permission));
        }

        var perm_default = org.bukkit.permissions.PermissionDefault[perm_default.toUpperCase()]
        var permission = new org.bukkit.permissions.Permission(permission, perm_default);

        if (parents) {
            for (var i in parents) {
                permission.addParent(parents[i].permission, parents[i].value);
            }
        }

        loader.server.pluginManager.addPermission(permission);
        return permission;
    } catch (ex) {
        log(ex);
        return null;
    }
}
