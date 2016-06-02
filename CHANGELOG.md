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