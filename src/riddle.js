/** @license Naosuke Yokoe - http://github.com/zentooo/Riddle.js - MIT Licensed */
(function(doc, toArray, enc) {

    var listeners = {},
        nodeId = 1,
        domLoaded = false;

    doc.addEventListener("DOMContentLoaded", function(e) {
        domLoaded = true;
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
            return queryWithContext(first, second, "querySelectorAll");
        }
        else if ( first instanceof Array ) {
            return wrap(first);
        }
        else if ( typeof first === "object" && first !== null && typeof first.addEventListener === "function" ) {
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
        var result = [];

        if ( context === void 0 || context instanceof HTMLElement ) {
            return wrap(elementAsArray((context || doc)[functionName](selector)));
        }
        else if ( r.isR(context) ) {
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
        if ( el === null || el === void 0 ) {
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

    function getNodeId(elem) {
        return elem.__nid || (elem.__nid = nodeId++);
    }


    /**
     * Base class of HTMLElement Array collected by selector.
     * @name r.fn
     * @class base class of HTMLElement Array collected by selector.
    */
    r.fn = {
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
        detect: function detect(pred) {
            return this.filter(pred)[0];
        },

        /**
         * Invoke function for each element and produce result Array
         * @name invoke
         * @function
         * @memberOf r.fn
         * @param functionName {string}
         * @return {Array} Array of produced results
        */
        invoke: function invoke() {
            var args = toArray.call(arguments), func = args.shift();
            return this.map(function(item) {
                return item[func].apply(item, args);
            });
        },

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
        pluck: function pluck(key) {
            return this.map(function(item) {
                return item[key];
            });
        },

        /**
         * iterate with auto-wrapping
         * @name each
         * @function
         * @memberOf r.fn
         * @param f {function}
         * @example
         * var values = r("select#fruits option").each(function(wrapepd) { wrapped.css("color", "red"); });
        */
        each: function each(f) {
            return this.forEach(function(el) {
                f(wrap(elementAsArray(el)));
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
        html: function html(item) {
            var outers;

            if ( item === void 0 ) {
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
                else if ( r.isR(item) ) {
                    outers = item.map(function(el) {
                        return el.outerHTML;
                    }).join("");

                    this.forEach(function(elem) {
                        elem.innerHTML = outers;
                    });
                }
            }
            return this;
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
        remove: function remove() {
            this.forEach(function(elem) {
                if ( elem.parentNode instanceof HTMLElement ) {
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
        add: function add(item, position) {
            var fragment;

            if ( typeof item === "string" ) {
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
        attr: function attr(first, second) {
            if ( typeof first === "string" ) {
                if ( second === void 0 ) {
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
        css: function css(first, second) {
            if ( typeof first === "string" ) {
                if ( second === void 0 ) {
                    if ( this.length === 1 ) {
                        return getComputedStyle(this[0], null).getPropertyValue(first);
                    }
                    else {
                        return this.map(function(elem) {
                            return getComputedStyle(elem, null).getPropertyValue(first);
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
        addClass: function addClass(name) {
            this.forEach(function(elem) {
                ( elem.className === "" ) ? elem.className = name : elem.className += " " + name;
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
        removeClass: function removeClass(name) {
            var regex = new RegExp("(?:^|\\b)" + name + "(?:\\b|$)\\s?", "g");
            this.forEach(function(elem) {
                var replaced = elem.className.replace(regex, "");
                elem.className = replaced.replace(/\s+$/, "");
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
        hasClass: function hasClass(name) {
            var regex = new RegExp("(?:^|\\b)" + name + "(?:\\b|$)");
            if ( this.length === 1 ) {
                return !!this[0].className.match(regex);
            }
            else {
                return this.map(function(el) {
                    return !!el.className.match(regex);
                });
            }
        },

        /**
         * toggle one class as on/off or toggle two classes as A/B
         * @name toggleClass
         * @function
         * @memberOf r.fn
         * @param classA {string}
         * @param classB {string}
        */
        toggleClass: function toggleClass(classA, classB) {
            if ( classB === void 0 ) {
                if ( this.hasClass(classA) ) {
                    this.removeClass(classA);
                }
                else {
                    this.addClass(classA);
                }
            }
            else {
                if ( this.hasClass(classA) ) {
                    this.removeClass(classA);
                    this.addClass(classB);
                } else {
                    this.removeClass(classB);
                    this.addClass(classA);
                }
            }
            return this;
        },

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
        bind: function bind(event, callback, useCapture) {
            this.forEach(function(elem) {
                var id = getNodeId(elem),
                bounds = listeners[id] || (listeners[id] = []);
                bounds.push( { event: event, callback: callback, index: bounds.length, useCapture: useCapture || false } );
                elem.addEventListener(event, callback, useCapture || false);
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
        unbind: function unbind(event) {
            function findBoundsByEvent(bounds, event) {
                return bounds.filter(function(bound) {
                    return bound.event === event;
                });
            }
            this.forEach(function(elem) {
                var id = getNodeId(elem),
                bounds = event ? findBoundsByEvent(listeners[id] || [], event) : listeners[id];
                bounds && bounds.forEach(function(bound) {
                    delete bounds[bound.index];
                    elem.removeEventListener(bound.event, bound.callback, bound.useCapture);
                });
            });
            return this;
        },

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
        delegate: function delegate(selector, event, callback) {
            this.bind(event, function(evt) {
                var match = r(selector, this).detect(function(el) {
                    var res = el.compareDocumentPosition(evt.target);
                    return (res === 0 || (res & Node.DOCUMENT_POSITION_CONTAINED_BY));
                });
                if ( match ) {
                    callback.call(match, evt);
                }
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
    r.ajax = function ajax(url, success, error, options) {
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
    r.id = function id(identifier, context) {
        return queryWithContext(identifier, context, "getElementById");
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
    r.cls = function cls(name, context) {
        return queryWithContext(name, context, "getElementsByClassName");
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
    r.tag = function tag(name, context) {
        return queryWithContext(name, context, "getElementsByTagName");
    };

    /**
     * check if given object is wrapped by r.fn
     * @name isR
     * @function
     * @memberOf r
     * @param obj {object}
     * @return Boolean
    */
    r.isR = function isR(obj) { return obj.__proto__ === r.fn; };


    r.version = "0.3.0";
    window.r = r;

})(document, Array.prototype.slice, encodeURIComponent);
