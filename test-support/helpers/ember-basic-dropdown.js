import Ember from 'ember';

// integration helpers

export function clickTrigger(scope, options = {}) {
  let selector = '.ember-basic-dropdown-trigger';
  if (scope) {
    selector = scope + ' ' + selector;
  }
  let event = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
  Object.keys(options).forEach(key => event[key] = options[key]);
  Ember.run(() => Ember.$(selector)[0].dispatchEvent(event));
}

export function tapTrigger(scope, options = {}) {
  let selector = '.ember-basic-dropdown-trigger';
  if (scope) {
    selector = scope + ' ' + selector;
  }
  let touchStartEvent = new window.Event('touchstart', { bubbles: true, cancelable: true, view: window });
  Object.keys(options).forEach(key => touchStartEvent[key] = options[key]);
  Ember.run(() => Ember.$(selector)[0].dispatchEvent(touchStartEvent));
  let touchEndEvent = new window.Event('touchend', { bubbles: true, cancelable: true, view: window });
  Object.keys(options).forEach(key => touchEndEvent[key] = options[key]);
  Ember.run(() => Ember.$(selector)[0].dispatchEvent(touchEndEvent));
}

// acceptance helpers

export default function() {
  Ember.Test.registerAsyncHelper('clickDropdown', function(app, cssPath, options = {}) {
    clickTrigger(cssPath, options);
  });

  Ember.Test.registerAsyncHelper('tapDropdown', function(app, cssPath, options = {}) {
    tapTrigger(cssPath, options);
  });
}
