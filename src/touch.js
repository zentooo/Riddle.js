r(function() {

    var body = document.body,
        moveThreshold = 30,
        touchEvents = ["swipeleft", "swiperight", "swipeup", "swipedown"],
        SCROLL_BOOST = 1.6,
        touch = {};

    function trigger(elem, event, dx, dy) {
        var evt = document.createEvent("MouseEvent");
        evt.initMouseEvent(event, true, true, window, null, dx, dy);
        elem.dispatchEvent(evt);
    }

    r(body).bind("touchstart", function(evt) {
        touch.x1 = evt.changedTouches[0].clientX;
        touch.y1 = evt.changedTouches[0].clientY;

        touch.position = {
            x: evt.changedTouches[0].clientX,
            y: evt.changedTouches[0].clientY
        };

        touch.target = evt.changedTouches[0].target;
        touch.startTime = Date.now();
    }, true);

    r(body).bind("touchmove", function(evt) {
        var dx = evt.changedTouches[0].clientX - touch.position.x,
            dy = evt.changedTouches[0].clientY - touch.position.y,
            scroll = calcScroll(dx, dy);

        trigger(touch.target, "drag", SCROLL_BOOST * scroll.x, SCROLL_BOOST * scroll.y);

        touch.position.x = evt.changedTouches[0].clientX;
        touch.position.y = evt.changedTouches[0].clientY;

        touch.x2 = evt.changedTouches[0].clientX;
        touch.y2 = evt.changedTouches[0].clientY;

        evt.preventDefault();
    }, true);

    r(body).bind("touchend", function(evt) {
        var dx = touch.x1 - touch.x2, dy = touch.y1 - touch.y2,
            adx = Math.abs(dx), ady = Math.abs(dy);

        if ( touch.startTime && Date.now() - touch.startTime > 1000 ) {
            touch = {};
            return;
        }

        if ( ady > moveThreshold && ady > adx ) {
            evt.preventDefault();
            if ( dy >= 0 ) {
                trigger(touch.target, "swipeup", dx, dy);
            }
            else {
                trigger(touch.target, "swipedown", dx, dy);
            }
        }
        else if ( adx > moveThreshold && adx > ady ) {
            evt.preventDefault();
            if ( dx >= 0 ) {
                trigger(touch.target, "swipeleft", dx, dy);
            }
            else {
                trigger(touch.target, "swiperight", dx, dy);
            }
        }

        touch = { x1: 0, x2: 0, y1: 0, y2: 0, target: null };
    }, true);

    r(body).bind("touchcancel", function(evt) {
        touch = { x1: 0, x2: 0, y1: 0, y2: 0, target: null };
    }, true);

    touchEvents.forEach(function(event) {
        r.fn[event] = function(callback, useCapture) {
            this.bind(event, callback, useCapture);
        };
    });

    function calcScroll(dx, dy) {
        var pos = parseMatrix(r(touch.target).css("-webkit-transform"));
        return { x: pos.x + dx, y: pos.y + dy };
    }

    function parseMatrix(matrix) {
        var m = matrix.match(/matrix\(\d+, \d+, \d+, (-?\d+), (-?\d+), (-?\d+)\)/);
        if ( m === null ) {
            return { x: 0, y: 0, z: 0 };
        }
        else {
            return { x: Number(m[1]), y: Number(m[2]), z: Number(m[3]) };
        }
    }
});
