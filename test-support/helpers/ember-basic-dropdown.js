import Ember from 'ember';
import run from 'ember-runloop';
import $ from 'jquery';
import { click } from 'ember-native-dom-helpers/test-support/helpers';

export const nativeClick = click;

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
    let $element = $(scope);
    if ($element.hasClass('ember-basic-dropdown-trigger')) {
      selector = scope;
    } else {
      selector = scope + ' ' + selector;
    }
  }
  click(selector, options);
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
  $.extend(oEvent, {
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
  Ember.Test.registerAsyncHelper('clickDropdown', function(app, cssPath, options = {}) {
    clickTrigger(cssPath, options);
  });

  Ember.Test.registerAsyncHelper('tapDropdown', function(app, cssPath, options = {}) {
    tapTrigger(cssPath, options);
  });
}
