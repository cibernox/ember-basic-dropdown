# 5.0.0
- [BREAKING] Co-locate component templates. This is breaking for anyone overriding the component's templates with their own, as the location of the template has changed.
- Typescript fix for configuration.
# 4.0.4
- [FEATURE] Improve compatibility with Embroider/Ember 4
# 4.0.3
- Fix animation when component is not rendered in place.
  
# 4.0.2
- Update dependency in @ember/render-modifiers to 2.0.2 with fixes a bug with unnecessary recomputations.
# 4.0.1

- (#628) Fix issue, The `@animationClass` class don't get reset after the first render.
  When the dropdown content first renders, it animates correctly, but on subsequent renders there is no animation -
  cause `@animationClass` not being reset back to transitioning--in state.
# 4.0.0

- (#633) A11y improvements, changing aria-controls instead of aria-owns, which seems to be more correct.
- [BREAKING] Stop using a polyfill for `Object.assign`, which effectively removes support for Internet Exporer. But it's 2022, its about time.
# 3.0.19

- Update `ember-element-helper` to fix issues with CI.

# 3.0.18

- Relax dependencies on embroider packages

# 3.0.17

- Update ember-element-helper for better embroider compatibility

# 3.0.16

- Update ember and many other dependencies

# 3.0.15

- Fix conditional import for Embroider compatibility, using @embroider/macros.

# 3.0.14

- Import `htmlSafe` from `@ember/template` to fix deprecation warning.
- Migrate to github actions and fix stuff to make CI green again.

# 3.0.13

- Use `ember-style-modifier` in one more place.
- Migrate to github actions and fix CI on beta and canary. This was done by relaxing a dependency
  on the embroider utils.

# 3.0.12

- Use `ember-style-modifier` for setting styles on element instead of using inline styles. This allows to
  use the addon on webs that forbid inline styles on they CSP config.

# 3.0.11

- Relax dependency on ember-truth-helpers

# 3.0.10

- More IE11 fixes.

# 3.0.9

- Use `assign` polyfill for IE11 support.

# 3.0.8

- Update `ember-maybe-in-element` to 2.0.1, which fixes deprecation about `{{-in-element}}` usage.

# 3.0.7

- Add back `onXXX` event handlers to the trigger and content components, removed in the transition to angle bracket components,
  because make some patterns easier as it allows to set handlers to those events when defining the contextual component, instead of
  in invocation time

# 3.0.6

- [BUGFIX] Restore ability to change `horizontalPosition` and `verticalPosition` after initialization, lost
  at some point in the transition to glimmer components.

# 3.0.5

- TS: Fix type definition: Allow touch events in `handleRootMouseDown` on another location.

# 3.0.4

- TS: Fix type definition: Allow touch events in `handleRootMouseDown`.

# 3.0.3

- A11y fix: When the component is not expanded, it must have `aria-expanded="false"`.

# 3.0.2

- Ensure `this._super` in invoked in the `included` hooks.

# 3.0.0-beta.8

- [BUGFIX] Ensure the `otherStyles` is initialized with a copied object.

# 3.0.0-beta.7

- [CHORE] Update to `@glimmer/component` 1.0.0
- [BUGFIX] If there's no enough space for the dropdown above nor below the trigger, put it below.

# 3.0.0-beta.6

- [CHORE] Improve exported types

# 3.0.0-beta.5

- [BUGFIX] Don't use typescript in /app folder

# 3.0.0-beta.4

- [CHORE] Convert to typescript

# 3.0.0-beta.3

- [BUGFIX] Fix reposition of dropdown after scroll or window resize events

# 3.0.0-beta.2

- [CHORE] Update to @glimmer/component 1.0.0-beta.2

# 3.0.0-beta.1

- No changes since alpha 1

# 3.0.0-alpha.1

- [MAYBE-BREAKING] Update to glimmer components

# 2.0.10

- [BUGFIX] Use `set` when changing `previousVerticalPosition` and `previousHorizontalPosition`.

# 2.0.9

- [CHORE] Update some dependencies. More importantly `ember-element-modifiers` to 1.0.2 which changes its behavior.

# 2.0.8

- [BUGFIX] Correct condition in which the development assertion added in 2.0.6 is thrown. Logic was reversed.

# 2.0.7

- [BUGFIX] Update `ember-element-helper` to 0.2.0 to fix bug in engines

# 2.0.6

- [ENHANCEMENT] Add development assertion to help people understand the somewhat cryptic error message that
  appeared when there was no element with id `ember-basic-dropdown-wormhole` in the document

# 2.0.5

- [CHORE] Update npm packages to tests pass in beta and canary
- [BUGFIX] Ensure Ember doesn't complain about not using `set` to update values.

# 2.0.4

- [ENHANCEMENT] Allow to pass a `@defaultClass` argument to the content. This is necessary to be able to
  assign classes while the `{{component}}` helper does not allow to pass attributes like in angle-bracket syntax.

# 2.0.3

- [ENHANCEMENT] Allow to pass a `@defaultClass` argument to the trigger. This is necessary to be able to
  assign classes while the `{{component}}` helper does not allow to pass attributes like in angle-bracket syntax.

# 2.0.2

- [BUGFIX] Move `ember-truth-helpers` to `dependencies`.

# 2.0.1

- [ENHANCEMENT] Expose `ember-basic-dropdown/utils/calculate-position` as public API.

# 2.0.0

- [CHORE] Setup/teardown mutation observer using dedicated element modifiers.
- [CHORE] Refactor animation logic to use `{{did-insert}}`/`{{will-destroy}}` element modifiers.

# 2.0.0-beta.3

- [BREAKING] Remove `onMouseDown`,`onClick`,`onKeyDown` and `onTouchEnd` attributes from the `<dropdown.Trigger>` component.
  Users can just use the `{{on}}` modifier to attach events now, although that means that to prevent the default event handler from being called for those events,
  instead of `return false`, they must call `event.stopImmediatePropagation()` like they would with regular events.

# 2.0.0-beta.2

- [BREAKING] Remove `onMouseEnter`,`onMouseLeave`,`onFocus`,`onBlur`,`onFocusIn`,`onFocusOut` and `onKeyUp` from the `<dropdown.Trigger>` component.
  Users can just use the `{{on}}` modifier to attach any event they want.
- [BREAKING] Remove `onFocusIn`, `onFocusOut`, `onMouseEnter`, `onMouseLeave` and `onKeyDown` from the `<dropdown.Content>` component. Users
  can just use the `{{on}}` modifier to attach any event they want.

# 2.0.0-beta.1

- [CHORE] Now that Ember 3.11 is released, this can go to beta.

# 2.0.0-alpha.X

- Because of some limitation of splattributes in AngleBracket components, the addons requires Ember 3.11+
- Public API changed: Previously the contextual component of this addon were invoked with `{{#dd.trigger}}` and `{{#dd.content}}`.
  Now they are expected to be invoked with `<dd.Trigger>` and `<dd.Content>`. Note that the names are capitalized. This is done
  because the new convention that components start with a capital letter.
- Passing `@class`, `@defaultClass`, `aria-*` and most of those properties doesn't work anymore. This addon
  now expects to be used with angle-bracket syntax. In angle bracket syntax there is a distinction between
  component arguments (those preceded with an `@` sign) and html attributes, and the latter are a much
  better way of passing any arbitrary attribute to any of the components and sub-components of this addon.
- The default `eventType` of the trigger changed from `"mousedown"` to `"click"`. That means that dropdown
  used to open with the `mousedown` events will now open with `click` events, which is a saner default.
  Since most of the time those events are fired together most people won't notice any difference, but
  in testing if someone was explicitly firing mouseodown events tests would have to be updated.
- The default `rootEventType` has changed from `"mousedown"` to `"click"`. That means that before dropdowns would close
  as soon as the user mousedowns outside the dropdown, but not it will listed to click events by default.
  It's unlikely this change will be noticed by anyone.

# 1.1.2

- [ENHANCEMENT] Allow to bind the type attribute of the trigger.

# 1.1.1

- [ENHANCEMENT] Allow to customize the root event the component listens to in order to close when you
  click outside it. It has historically been `mousedown`, but now it can be `click`.
  This allows to scroll the page using a scrollbar.
  In a future version `click` will become the default.

# 1.1.0

- [REAPPLY] Revert the revert in 1.0.6. Technically identical to 1.0.5

# 1.0.6

- [REVERT] Revert change in 1.0.5 as it is a breaking change for Ember Power Select. Will fix EPS and apply again.

# 1.0.5

- [BUGFIX] A11y improvement: The trigger doesn't have an `aria-owns` attribute until the dropdown
  is open, because it's illegal for an aria-owns to reference an element (the content) that it's not
  in the page (yet).

# 1.0.4

- [BUGFIX] Fix code to find the destination element in fastboot.

# 1.0.3

- [FEATURE] Allow `onKeyUp` action to added to the trigger.

# 1.0.2

- [FEATURE] Allow `onKeyDown` action to the content component

# 1.0.1

- [DOCS] Document `eventType` option that has existed for a while now.
- [FEATURE] Add `stopPropagation` option to the trigger to prevent the propagation of the event

# 1.0.0

- NO NEW CHANGES, just version 1.0. It was about time.

# 1.0.0-beta.8

- [CLEANUP] Remove another reduntad `self.` prefix.

# 1.0.0-beta.7

- [CLEANUP] Remove unnecessary `self.` prefix to access a few globals like `document` or `window`.

# 1.0.0-beta.6

- [CLEANUP] Remove passing `to="id-of-destination"` that has been deprecated for a long time.

# 1.0.0-beta.5

- [BUGFIX] Fix event being fired on destroyed trigger in Ember 3.2 and beyond.

# 1.0.0-beta.4

- [FEATURE] Allow dropdowns with a custom `calculatePosition` function to return in the `styles` object
  css properties other than `top`, `left`, `right`, `height` and `width`. Now users can set any arbitrary
  properties. P.e. `max-height`, `z-index`, `transform`....

# 1.0.0-beta.3

- [INTERNAL] Stop depending internally on `ember-native-dom-helpers`. Now the utilities in `ember-test-helpers`
  have been ported to `@ember/test-helpers`, so they are not needed anymore.

# 1.0.0-beta.0

- [DEPRECATION] Deprecate global acceptance helpers `clickDropdown` and `tapDropdown`. Suggest to
  explicitly import `clickTrigger`/`tapTrigger` or even better, just use `click`/`tap` from `@ember/test-helpers`.
- [BREAKING] Drop ember-wormhole addon, use `#-in-element` built-in instead. Less size, more performance.
- [BREAKING] Drop support for Ember <= 2.9. This addon will require Ember 2.10 or greater to work.

# 0.34.0

- [BREAKING] Delete the `/test-support` folder, use `addon-test-support` instead. That means people
  should import helpers from `ember-basic-dropdown/test-support/helpers` instead of using relative paths
  like `../../helpers/ember-basic-dropdown`, as they are brittle and change with nesting.
- [BUGFIX] Ensure that the dropdown is not open by the right button of the mouse.

# 0.33.10

- [ENHANCEMENT] Allow `horizontalPosition` to work when `renderInPlace=true`

# 0.33.9

- [ENHANCEMENT] Allow to bind the role attribute of the trigger
- [ENHANCEMENT] Added `preventScroll=true` option to the `dropdown.content` component to "frezze" all
  mousewheel-triggered scrolling happening outside the component. Scrolling on touch devices using
  touchmove can still occur.

# 0.33.7

- [ENHANCEMENT] Enable `renderInPlace=true` dropdowns to be dynamically repositioned. (#350)
- [BUGFIX] Ensure the inline `style` attribute does not output `undefinedpx` when some style is
  undefined. Also, ensure that both `left` and `right` cannot be applied simultaneous, as it doesn't
  make sense.

# 0.33.6

- [BUGFIX] Prevent dropdowns with `renderInPlace=true` from being incorrectly opened twice. This had
  no evident effects, but lead to the events in the `dd.Content` component to be added twice.
- [BREAKING] Remove support for IE9/IE10.

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

- [BUGFIX] Fix edge case that made the component leak memory if the component is removed after a
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
