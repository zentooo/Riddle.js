module("test for r.fn.animate");

is = strictEqual;

asyncTest("animate default", function() {

  var red = r("#red");

  red.animate({
    "width": "100px",
    "height": "100px",
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
    "width": "100px",
    "height": "100px",
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
    "width": "100px",
    "height": "100px"
  }, {
    callback: spy
  });

});

asyncTest("r.fn.fadeIn", function() {

  var spy = sinon.spy(function() {
    ok ( spy.calledOnce, "callback called just once" );
    start();
  });

  r("#magenta").fadeIn( { callback: spy, duration: 2 } );
});

asyncTest("r.fn.fadeOut", function() {

  var spy = sinon.spy(function() {
    ok ( spy.calledOnce, "callback called just once" );
    r("#brown").show();
    start();
  });

  r("#brown").fadeOut( { callback: spy, duration: 2 } );
});

asyncTest("r.fn.scale", function() {
  var black = r("#black");

  black.scale(0.8, 1.0, {
    duration: 1,
    callback: function() {
      ok(true);
      start();
    }
  });
});

asyncTest("r.fn.move", function() {
  var aqua = r("#aqua");

  aqua.move(100, 100, {
    duration: 1,
    callback: function() {
      ok(true);
      start();
    }
  });
});
