(function() {

    var has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
        open = 'translate' + (has3d ? '3d(' : '('),
        close = has3d ? ',0)' : ')';

    // CSS3 transition/transform based-animation

    function getTranslate(wrapped) {
        var transform = wrapped.css("-webkit-transform"),
            m = ( typeof transform === "string" ) ? transform.match(/matrix\([\-\d.]+,\s[\-\d.]+,\s[\-\d.]+,\s[\-\d.]+,\s([\-\d.]+),\s([\-\d.]+)\)/) : null;

        if ( m !== null && m.length === 3 ) {
            return { x: Number(m[1]), y: Number(m[2]) };
        }
        else {
            return { x: 0, y: 0 };
        }
    }

    function getScale(wrapped) {
        var transform = wrapped.css("-webkit-transform"),
            m = ( typeof transform === "string" ) ? transform.match(/matrix\(([\d.]+),\s[\d.]+,\s[\d.]+,\s([\d.]+),\s[\d.]+,\s[\d.]+\)/) : null;

        if ( m !== null && m.length === 3 ) {
            return { x: Number(m[1]), y: Number(m[2]) };
        }
        else {
            return { x: 1.0, y: 1.0 };
        }
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


    r.fn.animate = function animate(properties, opts) {
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
    };

    r.fn.scale = function scale(xScale, yScale, options) {
        this.animate(["scale(" + xScale + "," + yScale + ")" ], options);
    };

    r.fn.scaleR = function scaleR(xScale, yScale, options) {
        var current = getScale(this);
        this.animate(["scale(" + current.x * xScale + "," + current.y * yScale + ")" ], options);
    };

    r.fn.scaleX = function scaleX(xScale, options) {
        var current = getScale(this);
        this.animate(["scale(" + xScale + "," + current.y + ")"], options);
    };

    r.fn.scaleRX = function scaleRX(xScale, options) {
        var current = getScale(this);
        this.animate(["scale(" + current.x * xScale + "," + current.y + ")"], options);
    };

    r.fn.scaleY = function scaleY(xScale, options) {
        var current = getScale(this);
        this.animate(["scale(" + current.x  + "," + yScale + ")"], options);
    };

    r.fn.scaleRY = function scaleRY(yScale, options) {
        var current = getScale(this);
        this.animate(["scale(" + current.x  + "," + current.y * yScale + ")"], options);
    };

    r.fn.move = function move(xMove, yMove, options) {
        if ( typeof xMove === "number" && typeof yMove === "number" ) {
            this.animate([open + xMove + "px," + yMove + "px" + close], options);
        }
        else if ( typeof xMove === "string" && typeof yMove === "string" ) {
            this.animate([open + xMove + "," + yMove + close], options);
        }
    };

    r.fn.moveR = function moveR(xMove, yMove, options) {
        var current = getTranslate(this), rx = current.x + xMove, ry = current.y + yMove;
        this.animate([open + rx + "px," + ry + "px" + close], options);
    };

    r.fn.moveX = function moveX(xMove, options) {
        var current = getTranslate(this);
        if ( typeof xMove === "number" ) {
            this.animate([open + xMove + "px," + current.y + "px" + close], options);
        }
        else if ( typeof xMove === "string" ) {
            this.animate([open + xMove + "," + current.y + close], options);
        }
    };

    r.fn.moveRX = function moveRX(xMove, yMove, options) {
        var current = getTranslate(this), rx = current.x + xMove;
        this.animate([open + rx + "px," + current.y + "px" + close], options);
    };

    r.fn.moveY = function moveY(yMove, options) {
        var current = getTranslate(this);
        if ( typeof yMove === "number" ) {
            this.animate([open + current.x + "px," + yMove  + "px" + close], options);
        }
        else if ( typeof yMove === "string" ) {
            this.animate([open + current.x + "px," + yMove + close], options);
        }
    };

    r.fn.moveRY = function moveRY(yMove, options) {
        var current = getTranslate(this), ry = current.y + yMove;
        this.animate([open + current.x + "px," + ry + "px" + close], options);
    };

    r.fn.fadeIn = function fadeIn(options) {
        this.animate({ opacity: 1 }, options);
    };

    r.fn.fadeOut = function fadeOut(options) {
        this.animate({ opacity: 0 }, options);
    };

    r.fn.show = function show(options) {
        this.animate({ "visibility": "visible" }, options);
    };

    r.fn.hide = function hide(options) {
        this.animate({ "visibility": "hidden" }, options);
    };

})();
