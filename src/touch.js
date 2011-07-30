r(function() {

    var body = document.body,
        moveThreshold = 30,
        touchEvents = ["swipeleft", "swiperight", "swipeup", "swipedown"],
        touch = { x1: 0, x2: 0, y1: 0, y2: 0, target: null };

    function trigger(elem, event) {
        var evt = document.createEvent("Event");
        evt.initEvent(event, true, true);
        elem.dispatchEvent(evt);
    }

    r(body).bind("touchstart", function(evt) {
        touch.x1 = evt.touches[0].clientX;
        touch.y1 = evt.touches[0].clientY;

        touch.target = evt.touches[0].target;
    });

    r(body).bind("touchmove", function(evt) {
        touch.x2 = evt.touches[0].clientX;
        touch.y2 = evt.touches[0].clientY;
    });

    r(body).bind("touchend", function(evt) {
        var dx = touch.x1 - touch.x2, dy = touch.y1 - touch.y2,
            adx = Math.abs(dx), ady = Math.abs(dy);

        if ( ady > moveThreshold && ady > adx ) {
            evt.preventDefault();
            if ( dy >= 0 ) {
                trigger(touch.target, "swipeup");
            }
            else {
                trigger(touch.target, "swipedown");
            }
        }
        else if ( adx > moveThreshold && adx > ady ) {
            evt.preventDefault();
            if ( dx >= 0 ) {
                trigger(touch.target, "swipeleft");
            }
            else {
                trigger(touch.target, "swiperight");
            }
        }

        touch = { x1: 0, x2: 0, y1: 0, y2: 0, target: null };
    });

    r(body).bind("touchcancel", function(evt) {
        touch = { x1: 0, x2: 0, y1: 0, y2: 0, target: null };
    });

    touchEvents.forEach(function(event) {
        r.fn[event] = function(callback, useCapture) {
            this.bind(event, callback, useCapture);
        };
    });
});
