(function(global, doc, head) {

  function load(srcs, callback) {
    var current = 0, all = srcs.length;

    srcs.forEach(function(src) {
      var script = doc.createElement("script");

      script.src = src;
      script.onload = function() {
        script.removeAttribute("onload");

        if ( ++current === all ) {
          global.r.load = load;
          callback();
        }
      };
      head.appendChild(script);
    });
  }

  if ( typeof global.r !== "function" ) {
    global.r = {};
  }

  global.r.load = load;

})(window, document, document.getElementsByTagName("head")[0]);
