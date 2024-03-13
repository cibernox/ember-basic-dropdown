import { click, tap } from '@ember/test-helpers';

export function clickTrigger(
  scope: string | undefined = undefined,
  options: MouseEventInit = {},
): Promise<void> {
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

export function tapTrigger(
  scope: string | undefined = undefined,
  options: TouchEventInit = {},
): Promise<void> {
  let selector = '.ember-basic-dropdown-trigger';
  if (scope) {
    selector = scope + ' ' + selector;
  }
  return tap(selector, options);
}
