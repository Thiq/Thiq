var fs = require('fs');

function config(location) {
    var self = this;
    this.objects = {};
    this.location = location;
    this.load = function() {
        if (!fs.exists(self.location)) {
            file.createNewFile();
        }

        try {
            var fdata = fs.readFileSync(location);
            self.objects = JSON.parse(fdata);
            self.objects.save = self.save();
            return self.objects;
        } catch (ex) {
            log('Failed to load config at ' + self.location + ': ' + ex, 'c');
            return false;
        }
    }

    this.save = function() {
        try {
            fs.writeFileSync(file, JSON.stringify(self.objects, null, '\t'));
        } catch (ex) { return false; }
    }

    return this;
}