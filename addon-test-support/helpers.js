import { registerAsyncHelper } from '@ember/test';
import { run } from '@ember/runloop';
import { merge } from '@ember/polyfills';
import { click as _nativeDomClick } from 'ember-native-dom-helpers';
import { click, settled } from '@ember/test-helpers';
import { deprecate } from '@ember/debug';
import hasEmberVersion from 'ember-test-helpers/has-ember-version';

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

  // `click` from `@ember/test-helpers` doesn't play well on Ember version < 3.0
  hasEmberVersion(3, 0) ? click(selector, options) : _nativeDomClick(selector, options);

  return settled();
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
    deprecate('Using the global `clickDropdown` acceptance helper from ember-basic-dropdown is deprecated. Please, explicitly import the `clickTrigger` or just use `click` helper from `@ember/test-helpers`.',
      false,
      { until: '1.0.0', id: 'ember-basic-dropdown-click-dropdown' }
    );
    clickTrigger(cssPath, options);
  });

  registerAsyncHelper('tapDropdown', function(app, cssPath, options = {}) {
    deprecate('Using the global `tapDropdown` acceptance helper from ember-basic-dropdown is deprecated. Please, explicitly import the `tapTrigger` or just use `tap` helper from `@ember/test-helpers`.',
      false,
      { until: '1.0.0', id: 'ember-basic-dropdown-click-dropdown' }
    );
    tapTrigger(cssPath, options);
  });
}
