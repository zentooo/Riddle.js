module("test for r()");

is = strictEqual;
isnt = notStrictEqual;

test("r with function -> DOMContentLoaded", function() {
  r(function() {
    ok(window.domLoaded, "function called after DOMContentLoaded");
  });
});

test("r with String -> select and wrap", function() {
  var lis = r("ul li");
  ok( Array.isArray(lis), "wrapped Object is a subtype of Array" );
  is( lis.__proto__, r.fn, "__proto__ of wrapped Object is r.fn" );
  is( lis.length, 3, "returns 3 items");

  var none = r("abbr");
  ok( Array.isArray(none), "wrapped Object is a subtype of Array" );
  is( none.__proto__, r.fn, "__proto__ of wrapped Object is r.fn" );
  is( none.length, 0, "returns empty Array with no result set" );
});

test("r with String and HTMLElement -> select and wrap with context", function() {
  var ul = r("ul");
  var items = r("li", ul[0]);
  is( items.length, 3, "select with context" );
});

test("r with String and instance of r.fn -> use r.fn instance as context", function() {
  var parents = r(".parent");
  var children = r(".child", parents);
  is ( children.__proto__, r.fn, "returned value inherirs r.fn" );
  is ( children.length, 2, "got only children of parent, not of not-parent" );

  var notparent = r(".not-parent");
  children = r(".child", notparent);
  is ( children.__proto__, r.fn, "returned value inherirs r.fn" );
  is ( children.length, 1, "got only children of notparent, so he is lonely." );
});

test("r with HTMLElement -> wrap it", function() {
  var ul = document.getElementById("list");
  ok ( ul instanceof HTMLElement, "ul is instance of HTMLElement" );
  ok( ul.__proto__ !== r.fn, "__proto__ of ul is not r.fn" );

  var wrapped = r(ul);
  ok( Array.isArray(wrapped), "wrapped Object is subtype of Array");
  is( wrapped.__proto__, r.fn, "__proto__ of wrapped Object is r.fn" );
});
