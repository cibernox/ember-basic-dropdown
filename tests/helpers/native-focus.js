import run from 'ember-runloop';

function fireEvent(node, eventType) {
  let event = document.createEvent('HTMLEvents');
  event.initEvent(eventType, true, true);
  node.dispatchEvent(event);
}

export default function(el) {
  if (!el) {
    return;
  }
  let $el = $(el);
  if ($(el).is(':input, [contenteditable=true]')) {
    let type = $el.prop('type');
    if (type !== 'checkbox' && type !== 'radio' && type !== 'hidden') {
      run(el, function() {
        // Firefox does not trigger the `focusin` event if the window
        // does not have focus. If the document doesn't have focus just
        // use trigger('focusin') instead.
        if (!document.hasFocus || document.hasFocus()) {
          this.focus();
        } else {
          fireEvent(this, 'focusin');
        }
      });
    }
  }
}
