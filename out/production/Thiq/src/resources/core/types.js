function Version(args) {
    this.major = 0;
    this.minor = 0;
    this.sub = 0;
    this.modifiers = '';

    if (!args || args.length == 0) return this;
    if (typeof args == 'string') {
        var argsArray = args.split('.');
        this.major = parseInt(args[0]);
        this.minor = parseInt(args[1]);
        this.sub = parseInt(args[2].split(/\+\=\-\<\>\?/)[0]);
        this.modifiers = args[2].split(/\+\=\-\<\>\?/)[1];
    } else if (typeof args == 'Array') {
        this.major = parseInt(args[0]);
        this.minor = parseInt(args[1]);
        this.sub = parseInt(args[2]);
        this.modifiers = args[3];
    } else {
        this.major = args.major;
        this.minor = args.minor;
        this.sub = args.sub;
        this.modifiers = args.modifiers;
    }

    return this;
}

Version.prototype.isBefore = function(version) {
    if (this.major < version.major) return true;
    else if (this.major == version.major) {
        if (this.minor < version.minor) return true;
        else if (this.minor == version.minor) {
            if (this.sub < version.sub) return true;
        }
    }

    return false;
}

Version.prototype.isAfter = function(version) {
    return version.isBefore(this);
}

var ServerType = {
    unknown: -1,
    vanilla: 0,
    spigot: 1,
    bukkit: 2,
    glowstone: 3
}

function ModulePackageInfo(json) {

}