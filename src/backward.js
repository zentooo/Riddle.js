// for old Androids <= 1.6
(function(ap, sp) {

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


  if ( typeof sp.trim !== "function" ) {
    sp.trim = trim;
  }

  function trim() {
    return this.replace(/(^\s+)|(\s+$)/g, "");
  }

})(Array.prototype, String.prototype);
