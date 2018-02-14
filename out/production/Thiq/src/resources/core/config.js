var fs = require('fs');

function Config(location) {
    this.objects = {};
    this.location = location;
}

Config.prototype.load = function() {
    if (!fs.exists(this.location)) {
        file.createNewFile();
    }

    try {
        var fdata = fs.readFileSync(this.location);
        this.objects = JSON.parse(fdata || {});
        
    } catch (ex) {
        log('Failed to load config at ' + this.location + ': ' + ex, 'c');
    }
}

Config.prototype.save = function() {
    try {
        fs.writeFileSync(this.location, JSON.stringify(this.objects, null, '\t'));
        return true;
    } catch (ex) { 
        return false; 
    }
}