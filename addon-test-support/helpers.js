import { click, tap } from '@ember/test-helpers';

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
  return click(selector, options);
}

export function tapTrigger(scope, options = {}) {
  let selector = '.ember-basic-dropdown-trigger';
  if (scope) {
    selector = scope + ' ' + selector;
  }
  return tap(selector, options);
}
