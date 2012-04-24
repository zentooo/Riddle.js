/** @license Naosuke Yokoe - http://github.com/zentooo/Riddle.js - MIT Licensed */
(function(global, doc, isArray, toArray, enc, undefined) {
    'use strict';

    r.listeners = {};
    r.__nid = 1;
    r.domReady = false;

    doc.addEventListener("DOMContentLoaded", function(e) {
        r.domReady = true;
    }, false);

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
            return wrap(toArray.call((second || doc).querySelectorAll(first)));
        }
        else if ( typeof first === "object" && first !== null && typeof first.addEventListener === "function" ) {
            return wrap([first]);
        }
        else if ( isArray(first) ) {
            return wrap(first);
        }
        else if ( typeof first === "function" ) {
            if ( r.domReady ) {
                first(r);
            }
            else {
                doc.addEventListener("DOMContentLoaded", function() {
                    first(r);
                }, false);
            }
            r.init = first;
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
        /**
         * iterate with auto-wrapping
         * @name each
         * @function
         * @memberOf r.fn
         * @param f {function}
         * @example
         * var values = r("select#fruits option").each(function(wrapepd) { wrapped.css("color", "red"); });
        */
        each: function(f) {
            return this.forEach(function(el) {
                f(wrap([el]));
            });
        },

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
        html: function(item) {
            if ( item === undefined ) {
                return this[0].innerHTML;
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
                else if ( r.isR(item) ) {
                    this.forEach(function(elem) {
                        elem.innerHTML = item[0].outerHTML;
                    });
                }
                return this;
            }
        },

        /**
         * Remove elements from document tree
         * @name remove
         * @function
         * @memberOf r.fn
         * @return {NodeArray} removed Elements
         * @example
         * r("#mami .head").remove();
        */
        remove: function() {
            this.forEach(function(elem) {
                if ( elem.parentNode ) {
                    elem.parentNode.removeChild(elem);
                }
            });
            return this;
        },

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
        add: function(item, position) {
            var fragment;

            if ( typeof item === "string" || typeof item === "number" ) {
                this.forEach(function(elem) {
                    elem.insertAdjacentHTML("beforeEnd", item);
                });
            }
            else if ( item instanceof HTMLElement ) {
                this.forEach(function(elem) {
                    elem.appendChild(item);
                });
            }
            else if ( r.isR(item) ) {
                fragment = doc.createDocumentFragment();
                item.forEach(function(el) {
                    fragment.appendChild(el);
                });

                this.forEach(function(elem) {
                    elem.appendChild(fragment);
                });
            }
            return this;
        },

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
        attr: function(first, second) {
            if ( typeof first === "string" ) {
                if ( second === undefined ) {
                    return this[0].getAttribute(first);
                }
                else {
                    if ( second === null ) {
                        this.forEach(function(elem) {
                            elem.removeAttribute(first);
                        });
                    }
                    else {
                        this.forEach(function(elem) {
                            elem.setAttribute(first, String(second));
                        });
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
        },

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
        css: function(first, second) {
            if ( typeof first === "string" ) {
                if ( second === undefined ) {
                    return getComputedStyle(this[0], null).getPropertyValue(first);
                }
                else {
                    if ( second === null ) {
                        this.forEach(function(elem) {
                            elem.style.removeProperty(first);
                        });
                    }
                    else {
                        this.forEach(function(elem) {
                            elem.style.setProperty(first, second, null);
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
        },

        /**
         * set class to elements
         * @name addClass
         * @function
         * @memberOf r.fn
         * @param className {string}
        */
        addClass: function(name) {
            this.forEach(function(elem) {
                var currents;
                if ( r(elem).hasClass(name) ) {
                    return;
                }
                currents = elem.className.split(" ");
                currents.push(name);
                elem.className = currents.join(" ");
            });
            return this;
        },

        /**
         * remove class from elements
         * @name removeClass
         * @function
         * @memberOf r.fn
         * @param className {string}
        */
        removeClass: function(name) {
            this.forEach(function(elem) {
                var currents = elem.className.split(" ");
                elem.className = currents.filter(function(c) {
                    return c !== name;
                }).join(" ");
            });
            return this;
        },

        /**
         * return elements have that class or not
         * @name hasClass
         * @function
         * @memberOf r.fn
         * @param className {string}
         * @return {(boolean|Array.<boolean>)}
        */
        hasClass: function(name) {
            var regex = new RegExp("(?:^|\\b)" + name + "(?:\\b|$)");
            return !!this[0].className.match(regex);
        },

        /**
         * toggle one class as on/off or toggle two classes as A/B
         * @name toggleClass
         * @function
         * @memberOf r.fn
         * @param classA {string}
         * @param classB {string}
        */
        toggleClass: function(name) {
            if ( this.hasClass(name) ) {
                this.removeClass(name);
            } else {
                this.addClass(name);
            }
        },

        /**
         * bind callback function to elements
         * @name bind
         * @function
         * @memberOf r.fn
         * @param events {string}
         * @param callback {function(e: Object)}
         * @param useCapture {?boolean}
         * @example
         * r("#button").bind("click", function(e) {
         *   alert("button clicked on" + e.target.tagName);
         * });
        */
        bind: function(eventNames, callback, useCapture) {
            var events = eventNames.split(" ");

            this.forEach(function(elem) {
                var id = r.nodeId(elem),
                bounds = r.listeners[id] || (r.listeners[id] = []);
                events.forEach(function(event) {
                    bounds.push({
                        event: event,
                        callback: callback,
                        index: bounds.length,
                        useCapture: useCapture || false
                    });
                    elem.addEventListener(event, callback, useCapture || false);
                });
            });
            return this;
        },

        /**
         * unbind alreaedy-bound callback function from elements
         * @name unbind
         * @function
         * @memberOf r.fn
         * @param event {string}
         * @example
         * r("#button").unbind("click");
        */
        unbind: function(event) {
            function findBoundsByEvent(bounds, event) {
                return bounds.filter(function(bound) {
                    return bound.event === event;
                });
            }
            this.forEach(function(elem) {
                var id = r.nodeId(elem),
                bounds = event ? findBoundsByEvent(r.listeners[id] || [], event) : r.listeners[id];
                bounds && bounds.forEach(function(bound) {
                    delete bounds[bound.index];
                    elem.removeEventListener(bound.event, bound.callback, bound.useCapture);
                });
            });
            return this;
        },

        /**
         * trigger events
         * @name trigger
         * @function
         * @memberOf r.fn
         * @param event {string}
         * @example
         * r("#button").trigger("click");
        */
        trigger: function(eventName) {
            var evt = doc.createEvent("Event");
            evt.initEvent(eventName, true, true);
            this.forEach(function(elem) {
                elem.dispatchEvent(evt);
            });
            return this;
        }
    };

    r.fn.__proto__ = [];


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
    r.ajax = function(url, success, error, options) {
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
        return xhr;

        function encode(obj) {
            var set = [], key;
            for ( key in obj ) {
                set.push(enc(key) + "=" + enc(obj[key]));
            }
            return set.join("&");
        }
    };


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
    r.id = function(identifier, context) {
        var elem = (context || doc).getElementById(identifier);
        return elem ? wrap([elem]) : wrap([]);
    };

    /**
     * select elements by class and wrap it as NodeArray
     * @name cls
     * @function
     * @memberOf r
     * @param name {string}
     * @param context [HTMLElement]
     * @return NodeArray
    */
    r.cls = function(name, context) {
        return wrap((context || doc).getElementsByClassName(name));
    };

    /**
     * select elements by tag name and wrap it as NodeArray
     * @name tag
     * @function
     * @memberOf r
     * @param name {string}
     * @param context [HTMLElement]
     * @return NodeArray
    */
    r.tag = function(name, context) {
        return wrap((context || doc).getElementsByTagName(name));
    };

    r.nodeId = function(elem) {
        return elem.__nid || (elem.__nid = r.__nid++);
    };

    /**
     * check if given object is wrapped by r.fn
     * @name isR
     * @function
     * @memberOf r
     * @param obj {object}
     * @return Boolean
    */
    r.isR = function(obj) { return obj.__proto__ === r.fn; };

    r.version = "0.4.0";
    global.r = r;
})(
    this,
    document,
    Array.isArray,
    Array.prototype.slice,
    encodeURIComponent
);
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
(function() {

    var has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
        open = 'translate' + (has3d ? '3d(' : '('),
        close = has3d ? ',0)' : ')',
        DEFAULT_DURATION = "0.3s",
        DEFAULT_EASING_FUNCTION = "ease-in-out";

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

    function asMilliSecond(duration) {
        var m = String(duration).match(/(\d+(?:\.\d+)?)(m?)(s?)/);
        if ( m[2] === "" && m[3] === "s" ) {
            return Number(m[1]) * 1000;
        }
        else if ( m[2] === "m" && m[3] === "s" ) {
            return Number(m[1]);
        }
        else {
            return 300;
        }
    }


    function single(wrapped, properties, options) {
        var opts = options || {},
            dur = opts.duration || DEFAULT_DURATION,
            ease = opts.easing || DEFAULT_EASING_FUNCTION,
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

        if ( typeof options.callback === "function" ) {
            wrapped.waitTransitionEnd(dur, function() {
                ++endCall;
                if ( transNum === endCall ) {
                    options.callback();
                }
            });
        }

        cssParams["-webkit-transition"] = dur + " " + ease;
        cssParams["-webkit-backface-visibility"] = "hidden";
        cssParams["-webkit-perspective"] = "1000";

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

    function scaleJoin(xScale, yScale) {
        return "scale(" + xScale + "," + yScale + ")";
    }

    function trnJoin(xMove, yMove) {
        if ( typeof xMove === "number" && typeof yMove === "number" ) {
            return open + xMove + "px," + yMove + "px" + close;
        }
        else if ( typeof xMove === "string" && typeof yMove === "string" ) {
            return open + xMove + "," + yMove + close;
        }
    }

    r.fn.animate = function animate(properties, options) {
        var count = 0, all = this.length,
            opts = options || {},
            callback = opts.callback || function() {};

        opts.callback = function() {
            ++count;
            if ( count === all ) {
                callback();
            }
        };

        this.each(function(wrapped) {
            single(wrapped, properties, opts);
        });
    };

    r.fn.scale = function scale(xScale, yScale, options) {
        this.animate([scaleJoin(xScale, yScale)], options);
    };

    r.fn.scaleR = function scaleR(xScale, yScale, options) {
        var current = getScale(this);
        this.animate([scaleJoin(current.x * xScale, current.y * yScale)], options);
    };

    r.fn.scaleX = function scaleX(xScale, options) {
        var current = getScale(this);
        this.animate([scaleJoin(xScale, current.y)], options);
    };

    r.fn.scaleRX = function scaleRX(xScale, options) {
        var current = getScale(this);
        this.animate([scaleJoin(current.x * xScale, current.y)], options);
    };

    r.fn.scaleY = function scaleY(xScale, options) {
        var current = getScale(this);
        this.animate([scaleJoin(current.x, yScale)], options);
    };

    r.fn.scaleRY = function scaleRY(yScale, options) {
        var current = getScale(this);
        this.animate([scaleJoin(current.x, current.y * yScale)], options);
    };

    r.fn.move = function move(xMove, yMove, options) {
        this.animate([trnJoin(xMove, yMove)], options);
    };

    r.fn.moveR = function moveR(xMove, yMove, options) {
        var current = getTranslate(this), rx = current.x + xMove, ry = current.y + yMove;
        this.animate([trnJoin(rx, ry)], options);
    };

    r.fn.moveX = function moveX(xMove, options) {
        var current = getTranslate(this);
        this.animate([trnJoin(xMove, current.y)], options);
    };

    r.fn.moveRX = function moveRX(xMove, yMove, options) {
        var current = getTranslate(this), rx = current.x + xMove;
        this.animate([trnJoin(rx, current.y)], options);
    };

    r.fn.moveY = function moveY(yMove, options) {
        var current = getTranslate(this);
        this.animate([trnJoin(current.x, yMove)], options);
    };

    r.fn.moveRY = function moveRY(yMove, options) {
        var current = getTranslate(this), ry = current.y + yMove;
        this.animate([trnJoin(current.x, ry)], options);
    };

    r.fn.fadeIn = function fadeIn(options) {
        var that = this;
        this.show();
        setTimeout(function() {
            that.animate({ opacity: 1 }, options);
        }, 0);
    };

    r.fn.fadeOut = function fadeOut(options) {
        var that = this;
        this.animate({ opacity: 0 }, options);
        this.waitTransitionEnd((typeof options === "object") ? options.duration : null, function() {
            that.hide();
        }, true);
    };

    r.fn.show = function show(options) {
        this.animate({ "display": "block" }, options);
    };

    r.fn.hide = function hide(options) {
        this.animate({ "display": "none" }, options);
    };

    r.fn.waitTransitionEnd = function waitTransitionEnd(duration, callback, unbind) {
        var that = this, cb, timerId;

        duration = duration || DEFAULT_DURATION;

        cb = function(evt, id) {
            clearTimeout(id);
            callback();
            if ( unbind ) {
                that.unbind("webkitTransitionEnd");
            }
        };

        timerId = setTimeout(function() {
            cb(null, timerId);
        }, asMilliSecond(duration) + 200);

        that.bind("webkitTransitionEnd", cb);
    };

})();
(function() {
    /**
     * delegate event handling
     * @name delegate
     * @function
     * @memberOf r
     * @param selector {string}
     * @param event {string}
     * @param callback {function(e: Object)}
     * @example
     * r(document.body).delegate(".button", "click", function(e) {
     *   alert("button clicked on" + e.target.tagName);
     * });
    */
    r.fn.delegate = function delegate(selector, event, callback) {
        this.bind(event, function(evt) {
            var match = r(selector, this).detect(function(el) {
                var res = el.compareDocumentPosition(evt.target);
                return (res === 0 || (res & Node.DOCUMENT_POSITION_CONTAINED_BY));
            });
            if ( match ) {
                callback.call(match, evt);
            }
        });
    };

     /**
     * bind callback function to elements
     * @name bind
     * @function
     * @memberOf r.fn
     * @param events {string}
     * @param callback {function(e: Object)}
     * @param useCapture {?boolean}
     * @example
     * r("#button").bind("click", function(e) {
     *   alert("button clicked on" + e.target.tagName);
     * });
    */
    r.fn.bind = function(eventNames, callback, useCapture) {
        var events = eventNames.split(" ");

        this.forEach(function(elem) {
            var id = getNodeId(elem),
            bounds = listeners[id] || (listeners[id] = []);
            events.forEach(function(event) {
                bounds.push({
                    event: event,
                    callback: callback,
                    index: bounds.length,
                    useCapture: useCapture || false
                });
                elem.addEventListener(event, callback, useCapture || false);
            });
        });
        return this;
    };

    function getStructs(namespace) {
        var structs = [], current = [];

        namespace.split(".").forEach(function(t) {
            current.push(t);
            structs.push(current.join("."));
        });

        return structs;
    }

    function bind(el, name, nid, struct, callback, useCapture) {
        r.listeners[nid] = r.listeners[nid] || {};
        var bounds = r.listeners[nid][struct] || (r.listeners[nid][struct] = []);

        bounds.push({
            name: name,
            actor: el,
            callback: callback,
            index: bounds.length,
            useCapture: useCapture || false
        });
    }


    r.fn.bind = function(wrapped, name, callback, useCapture) {
        this.forEach(function(elem) {
            var nid = r.nodeId(elem);
            events.forEach(function(event) {
                var structs = getStructs(event);
                structs.forEach(function(struct) {
                    bind(el, structs[0], nid, struct, callback, useCapture);
                });
                elem.addEventListener(structs[0], callback, useCapture || false);
            });
        });
    };


})();
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
r(function() {

    var body = document.body,
        moveThreshold = 30,
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
            scroll = calcScroll(evt.target, dx, dy);

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

    function calcScroll(target, dx, dy) {
        var pos = parseMatrix(r(target).css("-webkit-transform"));
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
