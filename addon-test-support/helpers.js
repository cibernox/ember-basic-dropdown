import { registerAsyncHelper } from '@ember/test';
import { run } from '@ember/runloop';
import { merge } from '@ember/polyfills';
import { click } from 'ember-native-dom-helpers';
import wait from 'ember-test-helpers/wait';

export function nativeTap(selector, options = {}) {
  let touchStartEvent = new window.Event('touchstart', { bubbles: true, cancelable: true, view: window });
  Object.keys(options).forEach(key => touchStartEvent[key] = options[key]);
  run(() => document.querySelector(selector).dispatchEvent(touchStartEvent));
  let touchEndEvent = new window.Event('touchend', { bubbles: true, cancelable: true, view: window });
  Object.keys(options).forEach(key => touchEndEvent[key] = options[key]);
  run(() => document.querySelector(selector).dispatchEvent(touchEndEvent));
}

export function clickTrigger(scope, options = {}) {
  let selector = '.ember-basic-dropdown-trigger';
  if (scope) {
    let element = document.querySelector(scope);
    if (element.classList.contains('ember-basic-dropdown-trigger')) {
      selector = scope;
    } else {
      selector = scope + ' ' + selector;
    }
  }
  click(selector, options);
  return wait();
}

export function tapTrigger(scope, options = {}) {
  let selector = '.ember-basic-dropdown-trigger';
  if (scope) {
    selector = scope + ' ' + selector;
  }
  nativeTap(selector, options);
}

export function fireKeydown(selector, k) {
  let oEvent = document.createEvent('Events');
  oEvent.initEvent('keydown', true, true);
  merge(oEvent, {
    view: window,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    keyCode: k,
    charCode: k
  });
  run(() => document.querySelector(selector).dispatchEvent(oEvent));
}

// acceptance helpers
export default function() {
  registerAsyncHelper('clickDropdown', function(app, cssPath, options = {}) {
    clickTrigger(cssPath, options);
  });

  registerAsyncHelper('tapDropdown', function(app, cssPath, options = {}) {
    tapTrigger(cssPath, options);
  });
}
