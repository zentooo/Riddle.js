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

test("r.tag", function() {
  var lis = r.tag("li");
  is ( lis.__proto__, r.fn, "__proto__ of wrapped object is r.fn" );

  lis.forEach(function(li) {
    ok ( li instanceof HTMLLIElement, "all items of wrapped object is HTMLLIElement" );
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

test("r.fn.hasClass", function() {
  var green = r("#div3");
  ok ( green.hasClass("green"), "green green");
  ok ( green.hasClass("div"), "green has div class");

  green.removeClass("green");
  ok ( ! green.hasClass("green"), "green lost green");
  ok ( green.hasClass("div"), "green has div class");

  green.removeClass("div");
  ok ( ! green.hasClass("green"), "green lost green");
  ok ( ! green.hasClass("div"), "green lost green");

  green.addClass("green");
  green.addClass("div");

  ok ( green.hasClass("green"), "green green again");
  ok ( green.hasClass("div"), "green got div class");

  var lis = r("#div3 ul li");
  var bools = lis.hasClass("red");

  is ( bools[0], true, "first li has red class" );
  is ( bools[1], false, "first li does not have red class" );
  is ( bools[2], true, "first li has red class" );
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
