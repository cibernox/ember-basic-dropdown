export function clickTrigger(scope, options = {}) {
  let selector = '.ember-basic-dropdown-trigger';
  if (scope) {
    selector = scope + ' ' + selector;
  }
  let event = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
  Object.keys(options).forEach(key => event[key] = options[key]);
  Ember.run(() => Ember.$(selector)[0].dispatchEvent(event));
}
