(function() {

    // CSS3 transition based-animation.
    // Easy and smooth but not flexible.

    // Can we stop (undo) animation with saving original css properties?

    function animate(properties, options) {
        var dur = options.duration || 0.5,
        ease = options.easing || "ease-in-out",
        transNum,
        endCall = 0,
        cssParams = { "-webkit-transition": dur + "s " + ease };

        if ( properties instanceof Array ) {
            cssParams["-webkit-transform"] = properties.join(" ");
            transNum = 1;
        }
        else if ( typeof properties === "object" ) {
            transNum = copy(properties, cssParams);
        }

        if ( typeof options.callback === "function" ) {
            var that = this;
            this.bind("webkitTransitionEnd", function(e) {
                ++endCall;
                if ( transNum === endCall ) {
                    options.callback(e);
                    that.unbind("webkitTransitionEnd");
                }
            });
        }

        this.css(cssParams);
    }

    function copy(from, to) {
        var key, count = 0;
        for ( key in from ) {
            to[key] = from[key];
            count++;
        }
        return count;
    }

    r.fn.animate = animate;

})();
