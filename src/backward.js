// for old Androids <= 1.6
(function(global, ap, sp) {

    // for Array.prototype

    if ( typeof ap.reduce !== "function" ) {
        ap.reduce = reduce;
    }

    function reduce(iterator, initial) {
        var sum = initial;
        if ( typeof iterator !== "function" ) {
            throw new Error("First parameter should be function");
        }
        if ( typeof initial === "undefined" ) {
            throw new Error("Second parameter should not be undefined");
        }
        this.forEach(function(current) {
            sum = iterator(sum, current);
        });
        return sum;
    }


    // for String.prototype

    if ( typeof sp.trim !== "function" ) {
        sp.trim = trim;
    }

    function trim() {
        return this.replace(/(^\s+)|(\s+$)/g, "");
    }


    // for JSON

    if ( typeof global.JSON !== "object" ) {
        global.JSON = {};
        global.JSON.parse = parse;
    }

    // WARNING: Should be used with *only* trusted JSON string.
    function parse(trustedJson) {
        return eval("(" + trustedJson + ")");
    }

})(window, Array.prototype, String.prototype);
