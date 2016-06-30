
- [BUGFIX] Apply enter animation after render. Otherwise it take place before the component
  gains the `--above` or `--below` class, which is needed to know how to animate.

# 0.12.0-beta.19
- [BUGFIX] Allow `to` property of the content component to be undefined

# 0.12.0-beta.18
- [BUGFIX] Fix positioning of dropdowns rendered in-place due to a typo

# 0.12.0-beta.17
- [BUGFIX] Ensure the `disabled` property of the public API is updated properly

# 0.12.0-beta.13
- [BUGFIX] Ensure reposition is not applied in destroyed components

# 0.12.0-beta.12
- [BUGFIX] Fix animations

# 0.12.0-beta.11
- [INTERNAL] Update ember-cli to 2.6
- [INTERNAL] Update ember-wormhole to 0.4.0 (fastboot support)
- [BUGFIX] Correct behaviour of `aria-disabled`, `aria-expanded`, `aria-invalid`, `aria-pressed`
  and `aria-required` in Ember 2.7+
- [ENHANCEMENT] Allow to customize componets for the trigger and the content, with the `triggerComponent`
  and `contentComponent` properties.
- [BUGFIX] Stop relying in `this.elementId`, since it is not present in Ember 2.7+ on tagless components.
- [ENHANCEMENT] Add an `onBlur` action to the trigger
- [BUGFIX] Change repositioning logic so it doesn't sets properties from inside the `didInsertElement`,
  which is deprecated and causes a performance penalty.

# 0.12-beta.6
- [ENHANCEMENT] Although the component is tagless by default, if the user passes `renderInPlace=true`,
  a wrapper element with class `.ember-basic-dropdown` is added to be able to position the content
  properly.
- [BUGFIX] The reposition function no longer sets any observable state, so it can be called at
  any time without worring about the runloop and double renders. More performant and fixes a bug
  when something inside gains the focus faster than the reposition.

# 0.12-beta.5

- [BUGFIX] Don't focus the trigger again when the dropdown is closed as consecuence of clicking outside it.
- [ENHANCEMENT] Allow to add focusin/out events to the trigger

# 0.12-beta.4

- [BUGFIX] Ensure that if the trigger receives `tabindex=null` it still defaults to 0.

# 0.12-beta.3

- [BUGFIX] Ensure that the `aria-controls` attribute of the trigger points to the content by default.

# 0.12-beta.2

- [BUGFIX] Focus the trigger when the component is closed
- [BUGFIX] Allow to attach `onFocusIn` and `onFocusOut` event the the dropdown content component.

# 0.12-beta.1

- [BUGFIX] Around half a docen regressions and changes, including add the proper classes to trigger
  and content when the component is rendered above/below/right/left/center/in-place. Now those cases
  are different between trigger and content for better granularity.

# 0.12-beta.0

- [BREAKING CHANGE] Brand new API