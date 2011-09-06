/** @license Naosuke Yokoe - http://github.com/zentooo/Riddle.js - MIT Licensed */
(function(doc, toArray, enc) {

    var listeners = {}, 
        nodeId = 1,
        body,
        domLoaded = false;

    /**
     * <p> Select HTMLElements, wait DOMContentLoaded or wrap HTMLElement with r.fn <br /> Usages are:
     * <ul>
     * <li>Select and wrap HTML Elements with r(selector: String, [context: HTMLElement]).
     * <li>Wait DOMContentLoaded with r(func: Function). <br/>
     * <li>Just to wrap HTMLElement with r(elem: HTMLElement)
     * <ul/>
     * @name r
     * @namespace
     * @function
     * @param first {(string|function|HTMLElement)}
     * @param second {?(HTMLElement|NodeArray)}
     * @return {NodeArray} On Selector or wrapper usage
     * @example
     * var elementsById = r("#id");
     * var elementsByClass = r(".class");
     * var elementsByTag = r("tag");
     * @example
     * r(function() {
     *   // put initialization process here, which you want to run after DOMContentLoaded event
     * });
     * @example
     * r("#id").bind(function(e) {
     *   var wrapped = r(e.target);
     * });
    */
    function r(first, second) {
        if ( typeof first === "string" ) {
            return queryWithContext(first, second, "querySelectorAll");
        }
        else if ( first instanceof HTMLElement ) {
            return wrap(elementAsArray(first));
        }
        else if ( typeof first === "function" ) {
            if ( domLoaded ) {
                first(r);
            }
            else {
                doc.addEventListener("DOMContentLoaded", function() {
                    first(r);
                }, false);
            }
        }
    }

    function queryWithContext(selector, context, functionName) {
        if ( typeof context === "undefined" || context instanceof HTMLElement ) {
            return wrap(elementAsArray((context || doc)[functionName](selector)));
        }
        else if ( context.__proto__ === r.fn ) {
            var result = [];
            context.map(function(el) {
                return elementAsArray(el[functionName](selector));
            }).forEach(function(array) {
                array.forEach(function(el) {
                    result.push(el);
                });
            });
            return wrap(result);
        }
    }

    function elementAsArray(el) {
        if ( el === null ) {
            return [];
        }
        else if ( el instanceof HTMLElement ) {
            return [el];
        }
        else if ( typeof el.length === "number" && typeof el.item === "function" ) {
            return toArray.call(el);
        }
    }

    function wrap(ary) {
        ary.__proto__ = r.fn;
        return ary;
    }

    /**
     * Base class of HTMLElement Array collected by selector.
     * @name r.fn
     * @class base class of HTMLElement Array collected by selector.
    */
    r.fn = {
        // Array++
        detect: detect,
        invoke: invoke,
        pluck: pluck,
        each: each,

        // DOM
        html: html,
        add: add,
        remove: remove,

        // attribute
        attr: attr,
        css: css,
        addClass: addClass,
        removeClass: removeClass,
        hasClass: hasClass,
        swapClass: swapClass,

        // event
        bind: bind,
        unbind: unbind
    };

    doc.addEventListener("DOMContentLoaded", function(e) {
        body = r(doc.body);
        domLoaded = true;
    }, false);

    r.fn.__proto__ = [];


    // Array++

    /**
     * Get the first Element which returns true with given predicate
     * @name detect
     * @function
     * @memberOf r.fn
     * @param pred {function}
     * @return {HTMLElement} HTMLElement if found
     * @example
     * var apple = r("select#fruits option").detect(function(option) { return option.value === "apple"; });
    */
    function detect(pred) {
        return this.filter(pred)[0];
    }

    /**
     * Invoke function for each element and produce result Array
     * @name invoke
     * @function
     * @memberOf r.fn
     * @param functionName {string}
     * @return {Array} Array of produced results
    */
    function invoke() {
        var args = toArray.call(arguments), func = args.shift();
        return this.map(function(item) {
            return item[func].apply(item, args);
        });
    }

    /**
     * Collect properties of all elements with given key
     * @name pluck
     * @function
     * @memberOf r.fn
     * @param key {string}
     * @return {Array} Array of properties
     * @example
     * var values = r("select#fruits option").pluck("value");
    */
    function pluck(key) {
        return this.map(function(item) {
            return item[key];
        });
    }

    /**
     * iterate with auto-wrapping
     * @name each
     * @function
     * @memberOf r.fn
     * @param f {function}
     * @example
     * var values = r("select#fruits option").each(function(wrapepd) { wrapped.css("color", "red"); });
    */
    function each(f) {
        return this.forEach(function(el) {
            f(wrap(elementAsArray(el)));
        });
    }


    // DOM

    /**
     * <p> Get/Set innerHTML of elements </p>
     * <ul>
     * <li> html(): returns html: String if selector has just one element
     * <li> html(): returns htmls: Array[String] if selector has more than two elements
     * <li> html(str): set string as innerHTML for all elements
     * <li> html(elem): set HTMLElement as innerHTML for all elements
     * <li> html(nodeArray): set NodeArray as innerHTML for all elements
     * <ul/>
     * @name html
     * @function
     * @memberOf r.fn
     * @param html {(string|HTMLElement|NodeArray)}
     * @return {(string|Array.<string>)}
     * @example
     * var story = r("p#story").html();
     * @example
     * var colors = r("li.colors").html();
     * @example
     * r("li.colors").html("black");
     * @example
     * r("li.colors").html(document.getElementById("#my-color"));
     * @example
     * r("#story").html(r("li#stories"));
    */
    function html(item) {
        var outers;

        if ( typeof item === "undefined" ) {
            if ( this.length === 1 ) {
                return this[0].innerHTML;
            }
            else {
                return this.pluck("innerHTML").map(function(html) {
                    return html;
                });
            }
        }
        else {
            if ( typeof item === "string" || typeof item === "number" ) {
                this.forEach(function(elem) {
                    elem.innerHTML = item;
                });
            }
            else if ( item instanceof HTMLElement ) {
                this.forEach(function(elem) {
                    elem.innerHTML = item.outerHTML;
                });
            }
            else if ( item.__proto__ === r.fn ) {
                outers = item.map(function(el) {
                    return el.outerHTML;
                }).join("");

                this.forEach(function(elem) {
                    elem.innerHTML = outers;
                });
            }
        }
        return this;
    }

    /**
     * Remove elements from document tree
     * @name remove
     * @function
     * @memberOf r.fn
     * @return {NodeArray} removed Elements
     * @example
     * r("#mami .head").remove();
    */
    function remove() {
        this.forEach(function(elem) {
            elem.parentNode.removeChild(elem);
        });
        return this;
    }

    /**
     * Append elements to selected NodeArray. <br />
     * @name add
     * @function
     * @memberOf r.fn
     * @param elem {(HTMLElement|NodeArray|string)}
     * @example
     * r(".magical-girl").add(document.getElementById("#madoka"));
     * @example
     * r(".magical-girl").add(r("#madoka, #homura"));
     * @example
     * r("#madoka").add("homuhomu");
    */
    function add(item, position) {
        var fragment;

        if ( typeof item === "string" ) {
            this.forEach(function(elem) {
                elem.insertAdjacentHTML("beforeEnd");
            });
        }
        else if ( item instanceof HTMLElement ) {
            this.forEach(function(elem) {
                elem.appendChild(item);
            });
        }
        else if ( item.__proto__ === r.fn ) {
            fragment = doc.createDocumentFragment();
            item.forEach(function(el) {
                fragment.appendChild(el);
            });

            this.forEach(function(elem) {
                elem.appendChild(fragment);
            });
        }
        return this;
    }


    // attributes

    /**
     * <p> Get/Set attribute(s) of elements </p>
     * <ul>
     * <li> attr(name): returns attribute: String if selector has just one element
     * <li> attr(name): returns attributes: Array[String] if selector has more than two elements
     * <li> attr(name, value): set value to element's attribute. Remove attribute if value === null
     * <li> attr(hash): set values to element's attribute. Remove attribute if hash.value === null
     * <ul/>
     * @name attr
     * @function
     * @memberOf r.fn
     * @param first {(string|Object)}
     * @param second {?string}
     * @return {(string|Array.<string>)}
     * @example
     * var value = r("#age").attr("value");
     * @example
     * var values = r("option.age").attr("value");
     * @example
     * r(".links-change").attr("href", "http://example.com");
     * @example
     * r(".links-change").attr("href", null);
     * @example
     * r(".links-change").attr( { href: "http://example.com", target: "_blank" } );
     * @example
     * r(".links-change").attr( { href: null } );
    */
    function attr(first, second) {
        if ( typeof first === "string" ) {
            if ( typeof second === "undefined" ) {
                if ( this.length === 1 ) {
                    return this[0].getAttribute(first);
                }
                else {
                    return this.invoke("getAttribute", first);
                }
            }
            else {
                if ( second === null ) {
                    this.invoke("removeAttribute", first);
                }
                else {
                    this.invoke("setAttribute", first, String(second));
                }
            }
        }
        else if ( typeof first === "object" ) {
            this.forEach(function(elem) {
                for ( var k in first ) {
                    if ( first[k] === null ) {
                        elem.removeAttribute(k);
                    }
                    else {
                        elem.setAttribute(k, String(first[k]));
                    }
                }
            });
        }
        return this;
    }

    /**
     * <p> Get/Set css property(properties) of elements </p>
     * <ul>
     * <li> css(key): returns css style value: String if selector has just one element
     * <li> css(key): returns css style values: Array[String] if selector has more than two elements
     * <li> css(key, value): set css style value. Remove css attribute if value === null
     * <li> css(hash): set css style values. Remove css attribute if hash.value === null
     * <ul/>
     * @name css
     * @function
     * @memberOf r.fn
     * @param first {(string|Object)}
     * @param second {?string}
     * @return {(string|Array.<string>)}
     * @example
     * var bodyHeight = r("body").css("height");
     * @example
     * var listHeights = r("li.familiar").css("height");
     * @example
     * r("#hyde").css("height", "156px");
     * @example
     * r("#hyde").css("height", null);
     * @example
     * r(".monster").css( { visibility: "visible", background-color: "red" } );
     * @example
     * r(".monster").css( { visibility: null } );
    */
    function css(first, second) {
        if ( typeof first === "string" ) {
            if ( typeof second === "undefined" ) {
                if ( this.length === 1 ) {
                    return getComputedStyle(this[0], "").getPropertyValue(first);
                }
                else {
                    return this.map(function(elem) {
                        return getComputedStyle(elem, "").getPropertyValue(first);
                    });
                }
            }
            else {
                if ( second === null ) {
                    this.forEach(function(elem) {
                        elem.style.removeProperty(first);
                    });
                }
                else {
                    this.forEach(function(elem) {
                        elem.style.setProperty(first, second, "");
                    });
                }
            }
        }
        else if ( typeof first === "object" ) {
            this.forEach(function(elem) {
                var text = ";";
                for ( var key in first ) {
                    if ( first[key] === null ) {
                        elem.style.removeProperty(key);
                    }
                    else {
                        text += key + ":" + first[key] + ";";
                    }
                }
                elem.style.cssText += text;
            });
        }
        return this;
    }

    /**
     * set class to elements
     * @name addClass
     * @function
     * @memberOf r.fn
     * @param className {string}
    */
    function addClass(name) {
        this.forEach(function(elem) {
            ( elem.className === "" ) ? elem.className = name : elem.className += " " + name;
        });
        return this;
    }

    /**
     * remove class from elements
     * @name removeClass
     * @function
     * @memberOf r.fn
     * @param className {string}
    */
    function removeClass(name) {
        var regex = new RegExp("(?:^|\\b)" + name + "(?:\\b|$)\\s?", "g");
        this.forEach(function(elem) {
            var replaced = elem.className.replace(regex, "");
            elem.className = replaced.replace(/\s+$/, "");
        });
        return this;
    }

    /**
     * return elements have that class or not
     * @name hasClass
     * @function
     * @memberOf r.fn
     * @param className {string}
     * @return {(boolean|Array.<boolean>)}
    */
    function hasClass(name) {
        var regex = new RegExp("(?:^|\\b)" + name + "(?:\\b|$)");
        if ( this.length === 1 ) {
            return !!this[0].className.match(regex);
        }
        else {
            return this.map(function(el) {
                return !!el.className.match(regex);
            });
        }
    }

    /**
     * swap two class
     * @name swapClass
     * @function
     * @memberOf r.fn
     * @param from {string}
     * @param to {string}
    */
    function swapClass(from, to) {
        this.removeClass(from);
        this.addClass(to);
    }


    // event handling

    function getNodeId(elem) {
        return elem.nid || (elem.nid = nodeId++);
    }

    function findBoundsByEvent(bounds, event) {
        return bounds.filter(function(bound) {
            return bound.event === event;
        });
    }

    /**
     * bind callback function to elements
     * @name bind
     * @function
     * @memberOf r.fn
     * @param event {string}
     * @param callback {function(e: Object)}
     * @param useCapture {?boolean}
     * @example
     * r("#button").bind("click", function(e) {
     *   alert("button clicked on" + e.target.tagName);
     * });
    */
    function bind(event, callback, useCapture) {
        this.forEach(function(elem) {
            var id = getNodeId(elem),
            bounds = listeners[id] || (listeners[id] = []);
            bounds.push( { event: event, callback: callback, index: bounds.length } );
            elem.addEventListener(event, callback, useCapture || false);
        });
        return this;
    }

    /**
     * unbind alreaedy-bound callback function from elements
     * @name unbind
     * @function
     * @memberOf r.fn
     * @param event {string}
     * @example
     * r("#button").unbind("click");
    */
    function unbind(event) {
        this.forEach(function(elem) {
            var id = getNodeId(elem),
            bounds = event ? findBoundsByEvent(listeners[id], event) : listeners[id];
            bounds && bounds.forEach(function(bound) {
                delete bounds[bound.index];
                elem.removeEventListener(bound.event, bound.callback, false);
            });
        });
        return this;
    }

    /**
     * delegate event handling
     * @name delegate
     * @function
     * @memberOf r
     * @param selector {string}
     * @param event {string}
     * @param callback {function(e: Object)}
     * @example
     * r.delegate(".button", "click", function(e) {
     *   alert("button clicked on" + e.target.tagName);
     * });
    */
    function delegate(selector, event, callback) {
        body.bind(event, function(evt) {
            if ( r(selector).detect(function(el) { return el === evt.target; }) ) {
                callback(evt);
            }
        });
    }


    // ajax

    function encode(obj) {
        var set = [], key;

        for ( key in obj ) {
            set.push(enc(key) + "=" + enc(obj[key]));
        }

        return set.join("&");
    }

    /**
     * send XMLHttpRequest to given URL to get data
     * @name ajax
     * @memberOf r
     * @function
     * @param url {string}
     * @param success {function(string, Object)}
     * @param error {?function(Object)}
     * @param options {?{method: string, header: Object, ctype: string, data: Object}}
     * @example
     * r.ajax("http://example.com/people/get", function(data, xhr) {
     *   r("#people").html(data);
     * });
     * @example
     * r.ajax("http://example.com/articles", function(data, xhr) {
     *   r("#article").html(data.result);
     * }, function(xhr) {
     *   r("#article").html("Oops! Something is wrong!");
     *   console.dir(xhr);
     * }, {
     *   method: "POST",
     *   data: {
     *     foo: "bar",
     *     bar: "baz",
     *   },
     *   header: {
     *     "X-FooBar": "baz"
     *   },
     * });
    */
    function ajax(url, success, error, options) {
        var xhr = new XMLHttpRequest(),
            options = options || {},
            success = success || function() {},
            error = error || function() {},
            method = options.method || "GET",
            header = options.header || {},
            ctype = options.ctype || (( method === "POST" ) ? "application/x-www-form-urlencoded" : ""),
            data = options.data || "",
            key;

        xhr.onreadystatechange = function() {
            if ( xhr.readyState === 4 ) {
                if ( xhr.status >= 200 && xhr.status < 300 ) {
                    success(xhr.responseText, xhr);
                } else {
                    error(xhr);
                }
            }
        };

        if ( typeof data === "object" ) {
            data = encode(data);
        }

        xhr.open(method, url, true);

        if ( ctype ) {
            xhr.setRequestHeader("Content-Type", ctype);
        }
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        for ( key in header ) {
            xhr.setRequestHeader(key, header[key]);
        }

        xhr.send(data);
    }


    // shorthand and fast query

    /**
     * select a element by id and wrap it as NodeArray
     * @name id
     * @function
     * @memberOf r
     * @param identifier {string}
     * @param context [HTMLElement]
     * @return NodeArray
    */
    function id(identifier, context) {
        return queryWithContext(identifier, context, "getElementById");
    }

    /**
     * select elements by class and wrap it as NodeArray
     * @name cls
     * @function
     * @memberOf r
     * @param name {string}
     * @param context [HTMLElement]
     * @return NodeArray
    */
    function cls(name, context) {
        return queryWithContext(name, context, "getElementsByClassName");
    }

    /**
     * select elements by tag name and wrap it as NodeArray
     * @name tag
     * @function
     * @memberOf r
     * @param name {string}
     * @param context [HTMLElement]
     * @return NodeArray
    */
    function tag(name, context) {
        return queryWithContext(name, context, "getElementsByTagName");
    }


    // add public method to r

    r.id = id;
    r.cls = cls;
    r.tag = tag;

    r.ajax = ajax;

    r.delegate = delegate;

    r.version = "0.2.8";

    window.r = r;

 })(document, Array.prototype.slice, encodeURIComponent);
(function(global, doc, head) {

    function load(srcs, callback) {
        var current = 0, all = srcs.length;

        srcs.forEach(function(src) {
            var script = doc.createElement("script");

            script.src = src;
            script.onload = function() {
                script.removeAttribute("onload");

                if ( ++current === all ) {
                    callback();
                }
            };
            head.appendChild(script);
        });
    }

    global.r.load = load;

})(window, document, document.getElementsByTagName("head")[0]);
// for old Androids <= 1.6
(function(global, ap, sp) {

    // for Array.prototype

    if ( typeof ap.reduce !== "function" ) {
        ap.reduce = reduce;
    }

    function reduce(iterator, initial) {
        var sum = initial;
        if ( typeof iterator !== "function" ) {
            throw new Error("First parameter should be function");
        }
        if ( typeof initial === "undefined" ) {
            throw new Error("Second parameter should not be undefined");
        }
        this.forEach(function(current) {
            sum = iterator(sum, current);
        });
        return sum;
    }


    // for String.prototype

    if ( typeof sp.trim !== "function" ) {
        sp.trim = trim;
    }

    function trim() {
        return this.replace(/(^\s+)|(\s+$)/g, "");
    }


    // for JSON

    if ( typeof global.JSON !== "object" ) {
        global.JSON = {};
        global.JSON.parse = parse;
    }

    // WARNING: Should be used with *only* trusted JSON string.
    function parse(trustedJson) {
        return eval("(" + trustedJson + ")");
    }

})(window, Array.prototype, String.prototype);
(function() {

    var has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
        open = 'translate' + (has3d ? '3d(' : '('),
        close = has3d ? ',0)' : ')';

    // CSS3 transition/transform based-animation

    function getTranslate(wrapped) {
        var transform = wrapped.css("-webkit-transform"),
            m = ( typeof transform === "string" ) ? transform.match(/matrix\([\-\d.]+,\s[\-\d.]+,\s[\-\d.]+,\s[\-\d.]+,\s([\-\d.]+),\s([\-\d.]+)\)/) : null;

        if ( m !== null && m.length === 3 ) {
            return { x: Number(m[1]), y: Number(m[2]) };
        }
        else {
            return { x: 0, y: 0 };
        }
    }

    function getScale(wrapped) {
        var transform = wrapped.css("-webkit-transform"),
            m = ( typeof transform === "string" ) ? transform.match(/matrix\(([\d.]+),\s[\d.]+,\s[\d.]+,\s([\d.]+),\s[\d.]+,\s[\d.]+\)/) : null;

        if ( m !== null && m.length === 3 ) {
            return { x: Number(m[1]), y: Number(m[2]) };
        }
        else {
            return { x: 1.0, y: 1.0 };
        }
    }

    function single(wrapped, properties, options) {
        var dur = "0.3s",
            ease = "ease-in-out",
            transNum,
            endCall = 0,
            cssParams = {};

        if ( properties instanceof Array ) {
            cssParams["-webkit-transform"] = properties.join(" ");
            transNum = 1;
        }
        else if ( typeof properties === "object" ) {
            transNum = copy(properties, cssParams);
        }

        if ( typeof options === "object" ) {

            if ( typeof options.duration === "string" ) {
                dur = options.duration;
            }
            else if ( typeof options.duration === "number" ) {
                dur = options.duration + "s";
            }

            if ( typeof options.easing === "string" ) {
                ease = options.easing;
            }

            if ( typeof options.callback === "function" ) {
                wrapped.bind("webkitTransitionEnd", function(evt) {
                    ++endCall;
                    if ( transNum === endCall ) {
                        options.callback(evt);
                        wrapped.unbind("webkitTransitionEnd");
                    }
                });
            }

        }

        cssParams["-webkit-transition"] = dur + " " + ease;
        cssParams["-webkit-backface-visibility"] = "hidden";
        cssParams["-webkit-perspective"] = "1000";
        cssParams["-webkit-transform-origin"] = "0 0";

        wrapped.css(cssParams);
    }

    function copy(from, to) {
        var key, count = 0;
        for ( key in from ) {
            to[key] = from[key];
            count++;
        }
        return count;
    }


    r.fn.animate = function animate(properties, opts) {
        var count = 0, all = this.length,
            options = opts || {},
            callback =  ( typeof options.callback === "function" ) ? options.callback : function() {};

        options.callback = function() {
            ++count;
            if ( count === all ) {
                callback();
            }
        };

        this.each(function(wrapped) {
            single(wrapped, properties, options);
        });
    };

    r.fn.scale = function scale(xScale, yScale, options) {
        this.animate(["scale(" + xScale + "," + yScale + ")" ], options);
    };

    r.fn.scaleR = function scaleR(xScale, yScale, options) {
        var current = getScale(this);
        this.animate(["scale(" + current.x * xScale + "," + current.y * yScale + ")" ], options);
    };

    r.fn.scaleX = function scaleX(xScale, options) {
        var current = getScale(this);
        this.animate(["scale(" + xScale + "," + current.y + ")"], options);
    };

    r.fn.scaleRX = function scaleRX(xScale, options) {
        var current = getScale(this);
        this.animate(["scale(" + current.x * xScale + "," + current.y + ")"], options);
    };

    r.fn.scaleY = function scaleY(xScale, options) {
        var current = getScale(this);
        this.animate(["scale(" + current.x  + "," + yScale + ")"], options);
    };

    r.fn.scaleRY = function scaleRY(yScale, options) {
        var current = getScale(this);
        this.animate(["scale(" + current.x  + "," + current.y * yScale + ")"], options);
    };

    r.fn.move = function move(xMove, yMove, options) {
        if ( typeof xMove === "number" && typeof yMove === "number" ) {
            this.animate([open + xMove + "px," + yMove + "px" + close], options);
        }
        else if ( typeof xMove === "string" && typeof yMove === "string" ) {
            this.animate([open + xMove + "," + yMove + close], options);
        }
    };

    r.fn.moveR = function moveR(xMove, yMove, options) {
        var current = getTranslate(this), rx = current.x + xMove, ry = current.y + yMove;
        this.animate([open + rx + "px," + ry + "px" + close], options);
    };

    r.fn.moveX = function moveX(xMove, options) {
        var current = getTranslate(this);
        if ( typeof xMove === "number" ) {
            this.animate([open + xMove + "px," + current.y + "px" + close], options);
        }
        else if ( typeof xMove === "string" ) {
            this.animate([open + xMove + "," + current.y + close], options);
        }
    };

    r.fn.moveRX = function moveRX(xMove, yMove, options) {
        var current = getTranslate(this), rx = current.x + xMove;
        this.animate([open + rx + "px," + current.y + "px" + close], options);
    };

    r.fn.moveY = function moveY(yMove, options) {
        var current = getTranslate(this);
        if ( typeof yMove === "number" ) {
            this.animate([open + current.x + "px," + yMove  + "px" + close], options);
        }
        else if ( typeof yMove === "string" ) {
            this.animate([open + current.x + "px," + yMove + close], options);
        }
    };

    r.fn.moveRY = function moveRY(yMove, options) {
        var current = getTranslate(this), ry = current.y + yMove;
        this.animate([open + current.x + "px," + ry + "px" + close], options);
    };

    r.fn.fadeIn = function fadeIn(options) {
        this.animate({ opacity: 1 }, options);
    };

    r.fn.fadeOut = function fadeOut(options) {
        this.animate({ opacity: 0 }, options);
    };

    r.fn.show = function show(options) {
        this.animate({ "visibility": "visible" }, options);
    };

    r.fn.hide = function hide(options) {
        this.animate({ "visibility": "hidden" }, options);
    };

})();
r(function() {

    var body = document.body,
        moveThreshold = 30,
        touchEvents = ["swipeleft", "swiperight", "swipeup", "swipedown"],
        SCROLL_BOOST = 1.6,
        touch = {};

    function trigger(elem, event, dx, dy) {
        var evt = document.createEvent("MouseEvent");
        evt.initMouseEvent(event, true, true, window, null, dx, dy);
        elem.dispatchEvent(evt);
    }

    r(body).bind("touchstart", function(evt) {
        touch.x1 = evt.changedTouches[0].clientX;
        touch.y1 = evt.changedTouches[0].clientY;

        touch.position = {
            x: evt.changedTouches[0].clientX,
            y: evt.changedTouches[0].clientY
        };

        touch.target = evt.changedTouches[0].target;
        touch.startTime = Date.now();
    }, true);

    r(body).bind("touchmove", function(evt) {
        var dx = evt.changedTouches[0].clientX - touch.position.x,
            dy = evt.changedTouches[0].clientY - touch.position.y,
            scroll = calcScroll(dx, dy);

        trigger(touch.target, "drag", SCROLL_BOOST * scroll.x, SCROLL_BOOST * scroll.y);

        touch.position.x = evt.changedTouches[0].clientX;
        touch.position.y = evt.changedTouches[0].clientY;

        touch.x2 = evt.changedTouches[0].clientX;
        touch.y2 = evt.changedTouches[0].clientY;

        evt.preventDefault();
    }, true);

    r(body).bind("touchend", function(evt) {
        var dx = touch.x1 - touch.x2, dy = touch.y1 - touch.y2,
            adx = Math.abs(dx), ady = Math.abs(dy);

        if ( touch.startTime && Date.now() - touch.startTime > 1000 ) {
            touch = {};
            return;
        }

        if ( ady > moveThreshold && ady > adx ) {
            evt.preventDefault();
            if ( dy >= 0 ) {
                trigger(touch.target, "swipeup", dx, dy);
            }
            else {
                trigger(touch.target, "swipedown", dx, dy);
            }
        }
        else if ( adx > moveThreshold && adx > ady ) {
            evt.preventDefault();
            if ( dx >= 0 ) {
                trigger(touch.target, "swipeleft", dx, dy);
            }
            else {
                trigger(touch.target, "swiperight", dx, dy);
            }
        }

        touch = { x1: 0, x2: 0, y1: 0, y2: 0, target: null };
    }, true);

    r(body).bind("touchcancel", function(evt) {
        touch = { x1: 0, x2: 0, y1: 0, y2: 0, target: null };
    }, true);

    touchEvents.forEach(function(event) {
        r.fn[event] = function(callback, useCapture) {
            this.bind(event, callback, useCapture);
        };
    });

    function calcScroll(dx, dy) {
        var pos = parseMatrix(r(touch.target).css("-webkit-transform"));
        return { x: pos.x + dx, y: pos.y + dy };
    }

    function parseMatrix(matrix) {
        var m = matrix.match(/matrix\(\d+, \d+, \d+, (-?\d+), (-?\d+), (-?\d+)\)/);
        if ( m === null ) {
            return { x: 0, y: 0, z: 0 };
        }
        else {
            return { x: Number(m[1]), y: Number(m[2]), z: Number(m[3]) };
        }
    }
});
(function() {

    function RStorage(storage) {
        this.storage = storage;
    }

    function set(key, value) {
        if ( typeof key === "number" || typeof key === "string" ) {
            this.storage.setItem(key, JSON.stringify(value));
        }
        else if ( typeof value === "undefined" ) {
            throw Error("typeof value is 'undefined'. Maybe you're doing something wrong");
        }
        else {
            throw Error("Given value as key is OK but seems not a good manner");
        }
    }

    function get(key) {
        if ( typeof this.storage[key] === "undefined" ) {
            return null;
        }
        else {
            return JSON.parse(this.storage.getItem(key));
        }
    }

    function clear() {
        this.storage.clear();
    }

    function size() {
        return this.storage.length;
    }

    function keys() {
        var result = [], k;

        for ( k in this.storage ) {
            result.push(k);
        }

        return result;
    }

    function values() {
        var result = [], k;

        for ( k in this.storage ) {
            result.push(this.get(k));
        }

        return result;
    }

    RStorage.prototype.set = set;
    RStorage.prototype.get = get;
    RStorage.prototype.clear = clear;
    RStorage.prototype.size = size;
    RStorage.prototype.keys = keys;
    RStorage.prototype.values = values;


    function storage(name) {
        return storage.sname || (storage.sname = new RStorage(window[name + "Storage"]));
    }

    r.storage = storage;

})();
