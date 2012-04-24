/**
 * map with auto-wrapping
 * @name collect
 * @function
 * @memberOf r.fn
 * @param f {function}
*/
r.fn.collect = function(f) {
    return this.map(function(el) {
        return f(r.wrap([el]));
    });
};

/**
 * some with auto-wrapping
 * @name any
 * @function
 * @memberOf r.fn
 * @param f {function}
*/
r.fn.any = function(f) {
    return this.some(function(el) {
        return f(r.wrap([el]));
    });
};

/**
 * every with auto-wrapping
 * @name all
 * @function
 * @memberOf r.fn
 * @param f {function}
*/
r.fn.all = function(f) {
    return this.every(function(el) {
        return f(r.wrap([el]));
    });
};

/**
 * reduce with auto-wrapping
 * @name fold
 * @function
 * @memberOf r.fn
 * @param f {function}
*/
r.fn.fold = function(f, i) {
    return this.reduce(function(el) {
        return f(r.wrap([el]));
    }, i);
};

/**
 * reduceRight with auto-wrapping
 * @name fold
 * @function
 * @memberOf r.fn
 * @param f {function}
*/
r.fn.foldRight = function(f, i) {
    return this.reduceRight(function(el) {
        return f(r.wrap([el]));
    }, i);
};
