Riddle.js
=======

Riddle.js is simple and stupid selector-based JavaScript library mainly for iPhone and Android devices ( currently alpha-quality )

* riddle.js (20k) -> original Riddle.js source code, for development
* riddle.min.js (4.9k) -> Riddle.js minified with Closure Compiler
* riddle-all.min.js (9.7k) -> Riddle.js and all included plugins combined and minified


Riddle.js is:
-------

* to be thin
* to be simple
* to be small


Riddle.js is not:
-------

* to do all for you
* take you to library lock-in
* for people who like dreaming in ever-lasting DSL


Features
-------

* wait DOMContentLoaded with r({fucntion})
* jQuery-like selector with r({string})
* DOM manipulation ( html, add, remove ) for selector result
* Attribute modifier ( attr, css, addClass, removeClass ) for selector result
* Event bindings ( bind, unbind, click, sunmit, focus, ... ) for selector result
* Array++ functions ( detect, invoke, pluck ) for selector result
* xhr wrapper with r.ajax
* select with id or class ( r.id, r.cls )


More
-------

* Riddle uses selector backend for document.querySelectorAll. document.querySelectorAll is flxible DOM interface but not so fast. So please use r.id or r.cls if you want the speed. They uses more specialized functions like document.getElementById and document.getElementsByClassName internally.
* To extend selector result, add function to r.fn. Get access the results with "this".


Included Plugins
-------

* storage.js ( Simple wrapper for localStorage and sessionStorage )
* touch.js ( Currently supports swipeLeft and swipeRight only )
* loader.js ( simple script loader with callback )
* animate.js ( transition-based animation support )
* backward.js ( for old browsers like Android =< 1.6 )
