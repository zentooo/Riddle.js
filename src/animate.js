(function() {

    var has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
        open = 'translate' + (has3d ? '3d(' : '('),
        close = has3d ? ',0)' : ')',
        DEFAULT_DURATION = "0.3s",
        DEFAULT_EASING_FUNCTION = "ease-in-out";

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

    function asMilliSecond(duration) {
        var m = duration.match(/(\d+(?:\.\d+)?)(m?)(s?)/);
        if ( m[2] === "" && m[3] === "s" ) {
            return Number(m[1]) * 1000;
        }
        else if ( m[2] === "m" && m[3] === "s" ) {
            return Number(m[1]);
        }
        else {
            return 300;
        }
    }


    function single(wrapped, properties, options) {
        var opts = options || {},
            dur = opts.duration || DEFAULT_DURATION,
            ease = opts.easing || DEFAULT_EASING_FUNCTION,
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

        if ( typeof options.callback === "function" ) {
            wrapped.waitTransitionEnd(dur, function() {
                ++endCall;
                if ( transNum === endCall ) {
                    options.callback();
                }
            });
        }

        cssParams["-webkit-transition"] = dur + " " + ease;
        cssParams["-webkit-backface-visibility"] = "hidden";
        cssParams["-webkit-perspective"] = "1000";

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

    function scaleJoin(xScale, yScale) {
        return "scale(" + xScale + "," + yScale + ")";
    }

    function trnJoin(xMove, yMove) {
        if ( typeof xMove === "number" && typeof yMove === "number" ) {
            return open + xMove + "px," + yMove + "px" + close;
        }
        else if ( typeof xMove === "string" && typeof yMove === "string" ) {
            return open + xMove + "," + yMove + close;
        }
    }

    r.fn.animate = function animate(properties, options) {
        var count = 0, all = this.length,
            opts = options || {},
            callback = opts.callback || function() {};

        opts.callback = function() {
            ++count;
            if ( count === all ) {
                callback();
            }
        };

        this.each(function(wrapped) {
            single(wrapped, properties, opts);
        });
    };

    r.fn.scale = function scale(xScale, yScale, options) {
        this.animate([scaleJoin(xScale, yScale)], options);
    };

    r.fn.scaleR = function scaleR(xScale, yScale, options) {
        var current = getScale(this);
        this.animate([scaleJoin(current.x * xScale, current.y * yScale)], options);
    };

    r.fn.scaleX = function scaleX(xScale, options) {
        var current = getScale(this);
        this.animate([scaleJoin(xScale, current.y)], options);
    };

    r.fn.scaleRX = function scaleRX(xScale, options) {
        var current = getScale(this);
        this.animate([scaleJoin(current.x * xScale, current.y)], options);
    };

    r.fn.scaleY = function scaleY(xScale, options) {
        var current = getScale(this);
        this.animate([scaleJoin(current.x, yScale)], options);
    };

    r.fn.scaleRY = function scaleRY(yScale, options) {
        var current = getScale(this);
        this.animate([scaleJoin(current.x, current.y * yScale)], options);
    };

    r.fn.move = function move(xMove, yMove, options) {
        this.animate([trnJoin(xMove, yMove)], options);
    };

    r.fn.moveR = function moveR(xMove, yMove, options) {
        var current = getTranslate(this), rx = current.x + xMove, ry = current.y + yMove;
        this.animate([trnJoin(rx, ry)], options);
    };

    r.fn.moveX = function moveX(xMove, options) {
        var current = getTranslate(this);
        this.animate([trnJoin(xMove, current.y)], options);
    };

    r.fn.moveRX = function moveRX(xMove, yMove, options) {
        var current = getTranslate(this), rx = current.x + xMove;
        this.animate([trnJoin(rx, current.y)], options);
    };

    r.fn.moveY = function moveY(yMove, options) {
        var current = getTranslate(this);
        this.animate([trnJoin(current.x, yMove)], options);
    };

    r.fn.moveRY = function moveRY(yMove, options) {
        var current = getTranslate(this), ry = current.y + yMove;
        this.animate([trnJoin(current.x, ry)], options);
    };

    r.fn.fadeIn = function fadeIn(options) {
        var that = this;
        this.show();
        setTimeout(function() {
            that.animate({ opacity: 1 }, options);
        }, 0);
    };

    r.fn.fadeOut = function fadeOut(options) {
        var that = this;
        this.animate({ opacity: 0 }, options);
        this.waitTransitionEnd((typeof options === "object") ? options.duration : null, function() {
            that.hide();
        }, true);
    };

    r.fn.show = function show(options) {
        this.animate({ "display": "block" }, options);
    };

    r.fn.hide = function hide(options) {
        this.animate({ "display": "none" }, options);
    };

    r.fn.waitTransitionEnd = function waitTransitionEnd(duration, callback, unbind) {
        var that = this, cb, timerId;

        duration = duration || DEFAULT_DURATION;

        cb = function(evt, id) {
            clearTimeout(id);
            callback();
            if ( unbind ) {
                that.unbind("webkitTransitionEnd");
            }
        };

        timerId = setTimeout(function() {
            cb(null, timerId);
        }, asMilliSecond(duration) + 200);

        that.bind("webkitTransitionEnd", cb);
    };

})();
