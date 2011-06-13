test("animation", function() {
  r(function() {
    r("#foo").animate({
      "width": "200px",
      "height": "200px",
      "opacity": 0
    }, 1, null, function() {
      alert("complete!");
    });
  });
});
