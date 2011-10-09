module("test for class manipulation features");

is = strictEqual;


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


test("r.fn.toggleClass", function() {
    var blue = r("#div4");
    blue.toggleClass("blue");
    ok ( ! blue.hasClass("blue") );
    blue.toggleClass("blue");
    ok ( blue.hasClass("blue") );

    blue.toggleClass("blue", "green");
    ok ( blue.hasClass("green") );
    ok ( ! blue.hasClass("blue") );

    blue.toggleClass("blue", "green");
    ok ( ! blue.hasClass("green") );
    ok ( blue.hasClass("blue") );
});
