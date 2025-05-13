import { click, tap } from '@ember/test-helpers';

function clickTrigger(scope = undefined, options = {}) {
  let selector = '.ember-basic-dropdown-trigger';
  if (scope) {
    const element = document.querySelector(scope);
    if (element && element.classList.contains('ember-basic-dropdown-trigger')) {
      selector = scope;
    } else {
      selector = scope + ' ' + selector;
    }
  }
  return click(selector, options);
}
function tapTrigger(scope = undefined, options = {}) {
  let selector = '.ember-basic-dropdown-trigger';
  if (scope) {
    selector = scope + ' ' + selector;
  }
  return tap(selector, options);
}

export { clickTrigger, tapTrigger };
//# sourceMappingURL=helpers.js.map
