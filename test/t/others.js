module("test for others");

is = strictEqual;

function emit(el, eventName) {
  var event = document.createEvent("Event");
  event.initEvent(eventName, true, true);
  ( el.__proto__ === r.fn ) ? el[0].dispatchEvent(event) : el.dispatchEvent(event);
}

test("r.id", function() {
  var div = r.id("div1");
  is ( div.__proto__, r.fn, "__proto__ of wrapped object is r.fn" );
  ok ( div[0] instanceof HTMLDivElement, "first item of wrapped object is HTMLDivElement" );
});

test("r.cls", function() {
  var divs = r.cls("div");
  is ( divs.__proto__, r.fn, "__proto__ of wrapped object is r.fn" );

  divs.forEach(function(div) {
    ok ( div instanceof HTMLDivElement, "all items of wrapped object is HTMLDivElement" );
  });
});

test("r.fn.addClass", function() {
  var none = r("#div1");
  none.addClass("red");
  is ( none.css("float"), "left", "normal got red" );
});

test("r.fn.removeClass", function() {
  var red = r("#div2");

  red.addClass("redmine");
  red.removeClass("red");
  is ( red.css("float"), "none", "red lost red" );
  is ( red.css("visibility"), "hidden", "red did not lost redmine" );

  red.addClass("green");
  red.addClass("green");
  is ( red.css("float"), "right", "red got green * 2" );

  red.removeClass("green");
  is ( red.css("float"), "none", "red lost green * 2" );

  red.addClass("red");
  is ( red.css("float"), "left", "red got red" );
});

test("chain r.fn functions", function() {
  var blue = r("#div4"),
      spy = sinon.spy(function() {});

  blue.html("hoge").removeClass("blue").css("visibility", "hidden").unbind().bind("click", spy);

  ok ( blue.html().indexOf("hoge") !== -1, "innerHTML inserted...");
  is ( blue.css("float"), "none", "class removed...");
  is ( blue.css("visibility"), "hidden", "style added...");

  emit(blue, "click");

  ok ( spy.called, "and event bound.");
});
