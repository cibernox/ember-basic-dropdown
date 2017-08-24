# 0.33.5
- [ENHANCEMENT] Allow `transitioningInClass` and `transitioningOutClass` to be several classes by
  passing a string with spaces in it.

# 0.33.4
- [BUGFIX] Allow to use `horizontalPosition="center"` along with `renderInPlace=true`.

# 0.33.3
- [BUGFIX] When the component is rendered in-place, it still has to have the `--below` class
  needed. While not used for positioning, it was used for animations.

# 0.33.2
- [BUGFIX] Fix positioning problem when the body has position relative.

# 0.33.1
- [BUGFIX] Move test helpers to `/addon-test-support` and use `/test-support` only for reexporting
  so apps don't require babel 6.6.0+ to work.

# 0.33.0
- [INTERNAL] Stop relying in `Ember.testing` to decide the wormhole destination. Not just uses
  the environment.
- [ENHANCEMENT] This component by default opens with `mousedown` events, not with `click`. This
  behavior has its reasons but it's also surprising for some users and it might not be adequate
  sometimes. Now the trigger accepts an `eventType="mousedown" | "click"` (defaults to `"mousedown"` as today). This doesn't affect touch devices, as those are opened/closed
  with the `touchend` event.
- [INTERNAL] Use the new import paths (e.g: `import Component from '@ember/component`)

# 0.32.9
- [ENHANCEMENT] Add `auto-right` option for horizontal position. It's like `auto`, but it defaults to
  being anchored to the right unless there is not enough room towards the left for the content.

# 0.32.8
- [ENHANCEMENT] Update `ember-native-dom-helpers` to `^0.5.0`.

# 0.32.7
- [BUGFIX] Guard agains edge case where positioning could fail if the select close and opened extremely fast

# 0.32.6
- [BUGFIX] Add global events to the `document` instead of the `body`, so the dropdown works
  even if the body is smaller than the height of the window

# 0.32.5
- [ENHANCEMENT] Update `ember-native-dom-helpers` to 0.4.0

# 0.32.4
- [BUGFIX] Fix broken render in place after refactor for allowing dropdowns in scrollable
  elements.

# 0.32.3
- [ENHANCEMENTE] Allow to nest dropdowns infinitely. Thanks to @alexander-alvarez

# 0.32.2
- [BUGFIX] Stop looking for scrollable ancestors on the BODY or HTML

# 0.32.1
- [BUGFIX] Allow to work if the container has no offsetParent. This happens if the body
  is relative.

# 0.32.0
- No changes in previous beta

# 0.32.0-beta.0
- [ENHANCEMENT] Dropdowns inside elements with their own scroll are finally supported! It works
  even inside elements with scroll inside another element with scroll inside pages with scroll.
- [BREAKING/BUGFIX] Closes #233. The positioning logic now accounts for the position of the
  parent of container if it has position relative or absolute. The breaking part is that
  custom `calculatePosition` functions now take the destination element as third arguments,
  and the object with the options has now been moved to thr forth position.
- [BREAKING] Passing `to="id-of-elmnt"` to the `{{#dropdown.content}}` component is deprecated.
  The way to specify a different destination for `ember-wormhole` is now by passing `destination=id-of-elmnt`
  to the top-level `{{#basic-dropdown}}` component. The old method works but shows a deprecation message.

# 0.31.5
- [INTERNAL] Update ember-concurrency to a version that uses babel 6.

# 0.31.4
- [BUGFIX] Fix calculation of the screen's width when browser shows a scrollbar, which
  affected dropdowns with `horizontalPosition="right"`.
- [BUGFIX] Fix initial CSS positioning flickering caused by refactor that removed jQuery.

# 0.31.2
- Now the addon is 100% jQuery-free. Docs page doesn't use jQuery either. Tests in CI run
  without jquery so if anyone inadvertenly relies on it, tests will fail.
- Rewrite tests to use `async/await` with the latest `ember-native-dom-helpers`

# 0.31.1
- Update to ember-native-dom-helpers 0.3.4, which contains a new & simpler import path.

# 0.31.0
- [INTERNAL/BREAKING???] Update to Babel 6. This **shouldn't** be breaking, but you
  never know.

# 0.30.3
- [BUFGIX] Fix unnecesary line break caused by the wormhole empty div. Solved
  by making that div be `display: inline`.

# 0.30.1
- [ENHANCEMENT] Allow the `calculatePosition` function to also determine the height of the
  dropdown's content.

# 0.30.0
- [BREAKING] Unify `calculatePosition` and `calculateInPlacePosition`. Now the function receives
  an `renderInPlace` flag among its options, and based on that it uses a different logic.
  This reduces the public API surface. This new function is the default export of `/utils/calculate-position`.
  The individual functions used to reposition when rendered in the wormhole or in-place are
  available as named exports: `calculateWormholedPosition` and `calculateInPlacePosition`

# 0.24.5
- [INTERNAL] Use `ember-native-dom-helpers`.

# 0.24.4
- [ENHANCEMENT] The trigger component now has a bound style property.

# 0.24.3
- [ENHANCEMENT] Rely on the new `ember-native-dom-helpers` to fire native events instead
  or rolling out my own solution.

# 0.24.2
- [BUGFIX] Fix synthetic click on the trigger when happens in SVG items.

# 0.24.1
- [ENHANCEMENT] Bind `aria-autocomplete` and `aria-activedescendant`.
- [BUGFIX] Check if the component is destroyed after calling the `onClose` action, as it
  might have been removed.

# 0.24.0
- [BREAKING] It is a problem for a11y to have `aria-owns/controls` to an element that it's not
  in the DOM, so now there is a stable div with the right ID that gets moved to the root
  of the body when the component opens.
- [BUGFIX] Fix `clickDropdown` test helper when the given selector is already the selector
  of the trigger.

# 0.23.0
- [BREAKING] Don't display `aria-pressed` when the component is opened. The attribute is not
  present by default, but can be bound from the outside.
- [BREAKING] Don't display `aria-haspopup` by default, but display it if passed in a truthy value.
- [BREAKING] Use `aria-owns` instead of `aria-controls` to link trigger and content together.

# 0.22.3
- [FEATURE] The `dropdown.content` now accepts a `defaultClass` property as a secondary way
  of adding a class in contextual components that doesn't pollute the `class` property.

# 0.22.2
- [FEATURE] `clickTrigger` test helper also works when the given selector is the one of
  the trigger (before it had to be an ancestor of the trigger).

# 0.22.1
- [FEATURE] It accepts an `onInit` action passed from the outside. Private-ish for now.

# 0.22.0
- [FEATURE/BREAKING] Allow to customize the ID of the trigger component. Now the dropdown
  uses a new `data-ebd-id` attribute for query the trigger reliably. Unlikely to be
  breaking tho.

# 0.21.0
- [FEATURE] Add LESS support, on pair with the SASS one.
- [FEATURE] Added `$ember-basic-dropdown-overlay-pointer-events` SASS variable.

# 0.20.0
- [BREAKING CHANGE] Renamed `onKeydown` event to `onKeyDown` to be consistent with the naming
  of every other action in the component

# 0.19.4
- [FEATURE] Allow to pass `onMouseDown` and `onTouchEnd` options actions to subscribe to those
  events. If the handler for those events returns `false`, the default behaviour (toggle the component)
  is prevented.

# 0.19.3
- [FEATURE] Allow to pass `onMouseEnter` and `onMouseLeave` actions to the content, like
  we allow with the trigger.

# 0.19.2
- [BUGFIX] Prevent the `touchend` that opens the trigger to trigger a click on the dropdown's content
  when this appears over the trigger. Copied from hammertime.

# 0.19.1
- [CLEANUP] Update to `ember-cli-sass` ^6.0.0 and remove `node-sass` from dependencies.

# 0.19.0
- [BUGFIX] Call `registerAPI` will `null` on `willDestroy` to avoid memory leaks.

# 0.18.1
- [ENHANCEMENT] Pass the dropdown itself as an option to `calculatePosition` and `calculateInPlacePosition`,
  so users have pretty much total freedom on that function.

# 0.18.0
- [ENHANCEMENT] Allow downdowns rendered in place to be positioned above the trigger,
  and also to customize how they are positioned.

# 0.17.4
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
