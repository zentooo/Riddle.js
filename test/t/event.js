module("test for event-binding functions");

var events = ["click", "focus", "blur", "scroll", "select", "change"];

is = strictEqual;

function emit(el, eventName) {
  var event = document.createEvent("MouseEvents");
  event.initEvent(eventName, true, true);
  ( el.__proto__ === r.fn ) ? el[0].dispatchEvent(event) : el.dispatchEvent(event);
}

function testBind(wrapped, eventName) {
  var spy = sinon.spy(function(e) {
    ok ( e.target === wrapped[0], "event target original element");
    ok ( e.type === eventName, "event type should be " + eventName);
  });
  wrapped.bind(eventName, spy);
  emit(wrapped, eventName);
  ok( spy.calledOnce, eventName + " emitted and callback function called successfully");
}

function testUnbind(wrapped, eventName) {
  var spy = sinon.spy(function(e) {});
  wrapped.bind(eventName, spy);
  wrapped.unbind(eventName);

  emit(wrapped, eventName);
  ok( ! spy.called, eventName + " emitted but callback function not called");
}

function testShortCut(wrapped, eventName) {
  var spy = sinon.spy(function(e) {
    ok ( e.target === wrapped[0], "event target original element");
    ok ( e.type === eventName, "event type should be " + eventName);
  });
  wrapped[eventName](spy);
  emit(wrapped, eventName);
  ok( spy.calledOnce, eventName + " emitted and callback function called successfully");
}

test("r.fn.bind", function() {
  var button = r("#button1");

  events.forEach(function(event) {
    testBind(button, event);
  });

  button.bind("click", function(e) {
    is ( this, e.target, "this === e.target");
  });

  emit(button, "click");
});

test("r.fn.unbind", function() {
  var button = r("#button2");

  events.forEach(function(event) {
    testUnbind(button, event);
  });
});

test("r.fn.unbind should unbind given event handler only", function() {
  var button = r("#button3"),
      clickSpy = sinon.spy(function() { alert("hoge"); }),
      focusSpy = sinon.spy(function() {});
      blurSpy = sinon.spy(function() {});

  button.bind("click", clickSpy);
  button.bind("focus", focusSpy);
  button.bind("blur", blurSpy);

  // unbind other than blur
  button.unbind("click");
  button.unbind("focus");

  emit(button, "click");
  emit(button, "focus");
  emit(button, "blur");

  ok( ! clickSpy.called, "click emitted but callback function not called");
  ok( ! focusSpy.called, "focus emitted but callback function not called");
  ok( blurSpy.called, "blur emitted but callback function not called");
});

test("r.fn.unbind for all", function() {
  var button = r("#button4"),
      clickSpy = sinon.spy(function() { alert("hoge"); }),
      focusSpy = sinon.spy(function() {});
      blurSpy = sinon.spy(function() {});

  button.bind("click", clickSpy);
  button.bind("focus", focusSpy);
  button.bind("blur", blurSpy);

  // unbind all
  button.unbind();

  emit(button, "click");
  emit(button, "focus");
  emit(button, "blur");

  ok( ! clickSpy.called, "click emitted but callback function not called");
  ok( ! focusSpy.called, "focus emitted but callback function not called");
  ok( ! blurSpy.called, "blur emitted but callback function not called");
});


test("r.fn.trigger", function() {
    var button = r("#button5"),
        clickSpy = sinon.spy(function() {}),
        focusSpy = sinon.spy(function() {});
        blurSpy = sinon.spy(function() {});

    button.bind("click", clickSpy);
    button.bind("focus", clickSpy);
    button.bind("blur", clickSpy);

    button.trigger("click");
    button.trigger("focus");
    button.trigger("blur");

    ok(clickSpy.called, "click triggered");
    ok(focusSpy.called, "focus triggered");
    ok(blurSpy.called, "blur triggered");
});
