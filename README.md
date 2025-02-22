# Ember-basic-dropdown

[![Build Status](https://github.com/cibernox/ember-basic-dropdown/actions/workflows/ci.yml/badge.svg?branch=master)](https://travis-ci.org/cibernox/ember-basic-dropdown)

This is a very minimal dropdown. That means that it is agnostic about what it is going to contain.

It is intended to be a building block for more complex components but is perfectly usable. It is
by example the addon on which [ember-power-select](https://www.ember-power-select.com)
or `ember-paper`'s [menu component](http://miguelcobain.github.io/ember-paper/#/components/menu) are built upon.

### Compatibility

- Ember.js v3.28 or above
- Ember CLI v3.28 or above

Versions 1.X require Ember 2.16 or greater

Version 2.X requires Ember 3.13 or greater

Version 3.X - 6.X requires Ember 3.24 or greater

Version 7.X - 8.X requires Ember 3.28 or greater

### Installation

```
ember install ember-basic-dropdown
```

For more installation details see [documentation](https://ember-basic-dropdown.com/docs/installation)

### Usage

This component leverages contextual components for its API:

```hbs
<BasicDropdown as |dd|>
  <dd.Trigger>Click me</dd.Trigger>
  <dd.Content>Content of the trigger</dd.Content>
</BasicDropdown>
```

The yielded `dropdown` object is the public API of the component, and contains
properties and actions that you can use to control the component.

```js
{
  uniqueId: <string>,
  isOpen: <boolean>,
  disabled: <boolean>,
  actions: {
    open: <action>,
    close: <action>,
    toggle: <action>,
    reposition: <action>
  }
}
```

Check the full documentation with live examples in http://ember-basic-dropdown.com

### Features

#### Renders on the body or in place

By default this component will render the dropdown in the body using `#-in-element` and absolutely
position it to place it in the proper coordinates.

You can opt out to this behavior by passing `renderInPlace=true`. That will add the dropdown just
below the trigger.

#### Close automatically when clicking outside the component

You don't need to care about adding or removing events, it does that for you.

You can make the dropdown content standout a little more by adding `overlay=true` to the content options, see example below. This will add a semi transparent overlay covering the whole screen. Also this will stop bubbling the click/touch event which closed the dropdown.

```hbs
<BasicDropdown as |dd|>
  <dd.Trigger>Click me!</dd.Trigger>
  <dd.Content @overlay={{true}}>
    {{! here! }}
    content!
  </dd.Content>
</BasicDropdown>
```

NOTE: If for some reason clicking outside a dropdown doesn't work, you might want to make sure the `<body>` spans the entire viewport. Adding a css rule like `body {min-height: 100vh;}` would do the trick. It ensures that wherever you click on the page, it will close the dropdown.

#### Close automatically when clicking inside the component

If you'd like the dropdown to close itself after a user clicks on it, you can use `dd.actions.close` from our public API.

```hbs
<BasicDropdown as |dd|>
  <dd.Trigger>Click me!</dd.Trigger>
  <dd.Content>
    <div {{action dd.actions.close}}>
      {{yield dd}}
    </div>
  </dd.Content>
</BasicDropdown>
```

#### Keyboard and touchscreen support

The trigger of the component is focusable by default, and when focused can be triggered using `Enter` or `Space`.
It also listen to touch events so it works in mobile.

#### Easy to extend

The components provide hooks like `onFocus`, `onBlur`, `onKeydown`, `onMouseEnter` and more so
you can do pretty much anything you want.

#### Easy to animate.

You can animate it, in an out, with just CSS3 animations.
Check the example in the [Ember Power Select documentation](http://www.ember-power-select.com/cookbook/css-animations)

#### Intelligent and customizable positioning

This component is smart about where to position the dropdown. It will detect the best place to render
it based on the space around the trigger, and also will take care of reposition if if the screen is
resized, scrolled, the device changes it orientation or the content of the dropdown changes.

You can force the component to be fixed in one position by passing `verticalPosition = above | below` and/or `horizontalPosition = right | center | left`.

If even that doesn't match your preferences and you feel brave enough, you can roll your own positioning logic if you pass a `calculatePosition`
function. It's signature is:

```
calculatePosition(trigger, dropdown, { previousHorizontalPosition, horizontalPosition, previousVerticalPosition, verticalPosition, matchTriggerWidth })
```

The return value must be an object with this interface: `{ horizontalPosition, verticalPosition, style }` where
where `horizontalPosition` is a string (`"right" | "center" | "left"`), `verticalPosition` is also a string
(`"above" | "below"`) and `style` is an object with CSS properties, typically `top` and `left`/`right`.

#### Test helpers

It has a handy collection of test helpers to make interaction with the component seamless in your
test suite.

### Providing an Ember Twiddle

If you want to provide an [Ember Twiddle](https://www.ember-twiddle.com) with an issue/reproduction **you need to add the following to the end of your template**:
`<div id="ember-basic-dropdown-wormhole"></div>`

Since `Ember Twiddle` does not run `EmberCLI's` hooks this `div` won't be added to the application and it's required (There's an issue in [Ember Twiddle](https://github.com/joostdevries/twiddle-backend/issues/35) tracking this).

In order to create the Ember Twiddle you'll also need to add a reference to `ember-basic-dropdown: version` in the `addons` section of `twiddle.json`
