module("test for r.load");

is = strictEqual;

asyncTest("test for waiting all scripts to be loaded.", function() {
  r.load(["../resource/a.js", "../resource/b.js", "../resource/c.js"], function() {
    is ( r("script").length, 7, "we have seven script files now" );
    is ( window.a, "a", "resource/a.js loaded" );
    is ( window.b, "b", "resource/b.js loaded" );
    is ( window.c, "c", "resource/c.js loaded" );
    start();
  });
});
