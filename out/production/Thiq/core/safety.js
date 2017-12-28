function safety() {
    this.isSafe = function(input) {
        if (input.contains('eval')) return false;
        return true;
    }

    return this;
}
