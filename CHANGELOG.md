- [ENHANCEMENT] Update to ember-wormhole 0.5.1, which maximises Glimmer2 compatibility

# 0.17.3
- [BUGFIX] The fix in 0.17.2 that removed `e.preventDefault()` cause both `touchend` and a synthetic `mousedown`
  events to be fired, which basically made the component to be opened and immediatly closed in touch devises.

# 0.17.2
- [BUGFIX] Remove `e.preventDefault()` that caused inputs inside the trigger to not be focusable in touch screens

# 0.17.1
- [BUGFIX] The positioning strategy takes into account the horizontal scroll and it's generally smarter.
- [BUGFIX] Fixed bug when a dropdown with `horizontalPosition="auto"` passed from left to right, it keeped
  both properties, modifiying its width implicitly.

# 0.17.0
- [BREAKING] The object returned by `calculatePosition` now contains the offsets
  of the dropdown as numbers instead of strings with "px" as unit. This makes easier for people
  to modify those values in their own functions.

# 0.16.4
- [ENHANCEMENT] The default `calculatePosition` method is now inside `addon/utils/calculate-position`, so users can import it
  to perhaps reuse some of the logic in their own positioning functions.

# 0.16.3
- [BUGFIX] Add forgotten `uniqueId` property to the publicAPI yielded to the block. The `publicAPI` object passes to actions had it
  but the one in the block didn't.

# 0.16.2
- [ENHANCEMENT] Allows to customize how the dropdown is positioned by passing a `calculatePosition` function.

# 0.16.1
- [BUGFIX] Remove automatic transition detection. It never worked properly. It's fundamentally flawed. CSS animations are OK tho.

# 0.16.0
- [TESTING] Ensure the addon is tested in 2.4LTS
- [BUGFIX] Fix bug in versions of ember <= 2.6

# 0.16.0-beta.6
- [BUGFIX] Remove `ember-get-config` entirely. It turns that there is a less hacky way of doing this.

# 0.16.0-beta.5
- [BUGFIX] Update `ember-get-config` to fix Fastboot compatibility.

# 0.16.0-beta.4
- [BUGFIX] Guard agains a possible action invocation after the component has been destroyed.

# 0.16.0-beta.3
- [BUGFIX] Fix broken `horizontalPosition="center"`.

# 0.16.0-beta.2
- [BUGFIX] Bind `title` attribute in the trigger.

# 0.16.0-beta.1
- [BUGFIX] Revert glimmer2 compatibility

# 0.16.0-beta.0
- [BUGFIX] Compatibility with glimmer2.

# 0.15.0-beta.6
- [BUGFIX] Fix bug detaching event in IE10.

# 0.15.0-beta.5
- [BUGFIX] The correct behaviour when a dropdown is disabled or the tabindex is `false` should be
  to not have `tabindex` attribute, not to have a `tabindex` of -1.

# 0.15.0-beta.4
- [BUGFIX] Don't import `guidFor` from the shims.

# 0.15.0-beta.3
- [BUGFIX] Preventing the default behaviour from an event doesn't prevent the component from doing
  the usual thing.

# 0.15.0-beta.2
- [BUGFIX] Fix edge case that made the component leak memory  if the component is removed after a
  mousedown but before the mouseup events of the trigger. This situation probably almost impossible
  outside testing.

# 0.15.0-beta.1
- [ENHANCEMENT] The dropdown can have an overlay element if it receives `overlay=true`.

# 0.15.0-beta.0
- [BREAKING] `dropdown.uniqueId` is not a string like `ember1234` instead of the number `1234`.

# 0.14.0-beta.1
- [BUGFIX] Consider the scope of the select the entire body, even if the app is rendered inside an
  specific element.

# 0.14.0-beta.0
- [BREAKING] Rename the `dropdown._id` to `dropdown.uniqueId` and promote it to public API.

# 0.13.0-beta.6
- [BUGFIX] Make the first reposition faster by applying the styles directly instead of using bindings.
  This allows the dropdown to have components with autofocus inside without messing with the scroll.

# 0.13.0-beta.5
- [BUGFIX] Enabling the component after it has been disabled should trigger the `registerAPI` action.

# 0.13.0-beta.4
- [BUGFIX] Fix bug when the consumer app has a version of `ember-cli-shims` older than 0.1.3

# 0.13.0-beta.3
- [BUGFIX] Stop importing `getOwner` from the shim, since many people doesn't have shims up to date
  and it's trolling them.

# 0.13.0-beta.2
- [BUGFIX] Render more than one component with `renderInPlace=true` cases an exception and after that
  mayhem happens.

# 0.13.0-beta.1
- [BUGFIX] Use `requestAnimationFrame` to wait one frame before checking if the component is being
  animated. This makes this component fully compatible with Glimmer 2.

# 0.13.0-beta.0
- [ENHANCEMENT/BREAKING] Now the publicAPI object received sub-components and passed to actions is
  immutable. That means that each change in the internal state of this component will generate a new
  object. This allows userts to get rid of `Ember.Observe` to use some advanced patterns and makes
  possible some advanced time-travel debugging.

# 0.12.0-beta.26
- [ENHANCEMENT] Allow to customize the classes used for animations with `transitioningInClass`,
  `transitionedInClass` and `transitioningOutClass`.
- [BUGFIX] Property detect space on the right when `horizontalPosition="auto"` (the default) and
  position the element anchored to the right of the dropdown if there is no enough space for it
  to fit.

# 0.12.0-beta.23
- [BUGFIX] Correctly remove touchmove event on touch ends.
- [BUGFIX] Prevent DOM access in fastboot mode.

# 0.12.0-beta.22
- [ENHANCEMENT] If the component gets disabled while it's opened, it is closed automatically.

# 0.12.0-beta.21
- [ENHANCEMENT] Expose `clickDropdown` and `tapDropdown` acceptance helpers.
- [BUGFIX] Allow to nest a dropdown inside another dropdown without the second being rendered in place.

# 0.12.0-beta.20
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