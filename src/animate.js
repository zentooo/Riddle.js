(function() {

    // CSS3 transition/transform based-animation

    function animate(properties, opts) {
        var count = 0, all = this.length,
            options = opts || {}, 
            callback =  ( typeof options.callback === "function" ) ? options.callback : function() {};

        options.callback = function() {
            ++count;
            if ( count === all ) {
                callback();
            }
        };

        this.each(function(wrapped) {
            single(wrapped, properties, options);
        });
    }

    function single(wrapped, properties, options) {
        var dur = "0.3s",
            ease = "ease-in-out",
            transNum,
            endCall = 0,
            cssParams = {};

        if ( properties instanceof Array ) {
            cssParams["-webkit-transform"] = properties.join(" ");
            transNum = 1;
        }
        else if ( typeof properties === "object" ) {
            transNum = copy(properties, cssParams);
        }

        if ( typeof options === "object" ) {

            if ( typeof options.duration === "string" ) {
                dur = options.duration;
            }
            else if ( typeof options.duration === "number" ) {
                dur = options.duration + "s";
            }

            if ( typeof options.easing === "string" ) {
                ease = options.easing;
            }

            if ( typeof options.callback === "function" ) {
                wrapped.bind("webkitTransitionEnd", function(evt) {
                    ++endCall;
                    if ( transNum === endCall ) {
                        options.callback(evt);
                        wrapped.unbind("webkitTransitionEnd");
                    }
                });
            }

        }

        cssParams["-webkit-transition"] = dur + " " + ease;
        cssParams["-webkit-backface-visibility"] = "hidden";
        cssParams["-webkit-perspective"] = "1000";
        cssParams["-webkit-transform-origin"] = "0 0";

        wrapped.css(cssParams);
    }

    function copy(from, to) {
        var key, count = 0;
        for ( key in from ) {
            to[key] = from[key];
            count++;
        }
        return count;
    }


    function scale(xScale, yScale, options) {
        this.animate([ "scale(" + xScale + "," + yScale + ")" ], options);
    }

    function scaleX(xScale, options) {
        this.animate([ "scale(" + xScale + ",1.0)" ], options);
    }

    function scaleY(xScale, options) {
        this.animate([ "scale(1.0," + yScale + ")" ], options);
    }

    function move(xMove, yMove, options) {
        if ( typeof xMove === "number" && typeof yMove === "number" ) {
            this.animate([ "translate3d(" + xMove + "px," + yMove + "px,0px)" ], options);
        }
        else if ( typeof xMove === "string" && typeof yMove === "string" ) {
            this.animate([ "translate(" + xMove + "," + yMove + ",0px)" ], options);
        }
    }

    function moveX(xMove, options) {
        if ( typeof xMove === "number" ) {
            this.animate([ "translate3d(" + xMove + "px,0px,0px)" ], options);
        }
        else if ( typeof xMove === "string" ) {
            this.animate([ "translate3d(" + xMove + ",0px,0px)" ], options);
        }
    }

    function moveY(yMove, options) {
        if ( typeof yMove === "number" ) {
            this.animate([ "translate3d(0px," + yMove + "px,0px)" ], options);
        }
        else if ( typeof yMove === "string" ) {
            this.animate([ "translate3d(0px," + yMove + ",0px)" ], options);
        }
    }

    function fadeIn(options) {
        this.animate({ opacity: 1 }, options);
    }

    function fadeOut(options) {
        this.animate({ opacity: 0 }, options);
    }

    function show(options) {
        this.animate({ "visibility": "visible" }, options);
    }

    function hide(options) {
        this.animate({ "visibility": "hidden" }, options);
    }

    r.fn.animate = animate;

    r.fn.scale = scale;
    r.fn.scaleX = scaleX;
    r.fn.scaleY = scaleY;

    r.fn.move = move;
    r.fn.moveX = moveX;
    r.fn.moveY = moveY;

    r.fn.fadeIn = fadeIn;
    r.fn.fadeOut = fadeOut;

    r.fn.show = show;
    r.fn.hide = hide;
})();
