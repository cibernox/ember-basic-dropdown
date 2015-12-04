import Ember from 'ember';
import focus from './native-focus';

const { run } = Ember;

function triggerMouseEvent(node, eventType) {
  let clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
}

export default Ember.Test.registerAsyncHelper('nativeClick', function(app, selector, context) {
  let $el = app.testHelpers.findWithAssert(selector, context);
  let el = $el[0];

  run(() => triggerMouseEvent(el, 'mousedown'));

  focus(el);

  run(() => triggerMouseEvent(el, 'mouseup'));
  run(() => triggerMouseEvent(el, 'click'));

  return app.testHelpers.wait();
});
