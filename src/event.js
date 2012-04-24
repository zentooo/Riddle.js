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
