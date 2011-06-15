module("test for r.fn.animate");

is = strictEqual;

asyncTest("animate default", function() {

  var red = r("#red");

  red.animate({
    "width": "200px",
    "height": "200px",
    "opacity": 0.5
  }, {
    callback: function() {
      is( red.css("opacity"), "0.5", "opacity changes to 0.5");
      start();
    }
  });
});

asyncTest("animate with duration", function() {

  var green = r("#green");
  var before = Date.now();

  green.animate({
    "width": "200px",
    "height": "200px",
    "opacity": 0.5
  }, {
    duration: 2,
    callback: function() {
      ok( Date.now() - before > 1900, "fire after at least 1900 msec after");
      is( green.css("opacity"), "0.5", "opacity changes to 0.5");
      start();
    }
  });
});

asyncTest("animation callback should be called just once", function() {

  var spy = sinon.spy(function() {
    start();
    ok ( spy.calledOnce, "callback called just once" );
  });

  r("#blue").animate({
    "width": "200px",
    "height": "200px"
  }, {
    callback: spy
  });

});

asyncTest("animate with transform", function() {

  var black = r("#black");

  black.animate([
    "rotate(30deg)",
    "scale(0.5)"
  ], {
    duration: 2,
    callback: function() {
      ok(true);
      start();
    }
  });
});
