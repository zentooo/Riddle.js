module("test for touch event");

test("just touch with your iPhone/Android devices", function() {
    ["tap", "doubletap", "swiperight", "swipeleft", "swipeup", "swipedown"].forEach(function(event) {
        var ts = r("#touchspace");
        ts.bind(event, function() {
            alert(event);
        });
        var touchspace = document.getElementById("touchspace");
        touchspace.addEventListener("touchstart", function(evt) {
            var t = evt.touches[0];
            if ( Math.random() > 0.7 ) {
                r(touchspace).add("touchstart: " + t.pageX + ", " + t.pageY + "<br />");
            }
        }, false);

        touchspace.addEventListener("touchmove", function(evt) {
            var t = evt.touches[0];
            if ( Math.random() > 0.9 ) {
                r(touchspace).add("touchmove: " + t.pageX + ", " + t.pageY + "<br />");
            }
        }, false);

        touchspace.addEventListener("touchend", function(evt) {
            var t = evt.touches[0];
            r(touchspace).add("touchend: " + t.pageX + ", " + t.pageY + "<br />");
        }, false);

        touchspace.addEventListener("touchcancel", function(evt) {
            var t = evt.touches[0];
            r(touchspace).add("touchcancel: " + t.pageX + ", " + t.pageY + "<br />");
        }, false);

        r("#button").bind(event, function() {
            ts.html("");
        });
    });
});
