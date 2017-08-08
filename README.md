# Ember-basic-dropdown

[![Build Status](https://travis-ci.org/cibernox/ember-basic-dropdown.svg?branch=master)](https://travis-ci.org/cibernox/ember-basic-dropdown)

This is a very minimal dropdown. That means that it is agnostic about what it is going to contain.

It is intended to be a building block for more complex components but is perfectly usable. It is
by example the addon on which [ember-power-select](https://www.ember-power-select.com)
or `ember-paper`'s [menu component](http://miguelcobain.github.io/ember-paper/release-1/#/components/menu) are built upon.


### Installation

```
ember install ember-basic-dropdown
```

If you are using this addon in an application that uses ember-cli-sass, you need to import the
styles explicitly.

Add to your `app.scss` this line:

```scss
@import 'ember-basic-dropdown';
```

If you are using [ember-power-select](https://github.com/cibernox/ember-power-select) you don't need
any of those steps because you already have this addon :D

### Usage

This component leverages contextual components for its API:

```hbs
{{#basic-dropdown as |dropdown|}}
  {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
  {{#dropdown.content}}Content of the trigger{{/dropdown.content}}
{{/basic-dropdown}}
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

Check the full documentation with live examples in https://www.ember-basic-dropdown.com

### Features

#### Renders on the body or in place

By default this component will render the dropdown in the body using ember-wormhole and absolutely
position it to place it in the proper coordinates.

You can opt out to this behavior by passing `renderInPlace=true`. That will add the dropdown just
below the trigger.

#### Close automatically when clicking outside the component

You don't need to care about adding or removing events, it does that for you.

You can make the dropdown content standout a little more by adding `overlay=true` to the content options, see example below. This will add a semi transparent overlay covering the whole screen. Also this will stop bubbling the click/touch event which closed the dropdown.

```hbs
    {{#basic-dropdown as |dd|}}
      {{#dd.trigger}}Click me!{{/dd.trigger}}
      {{#dd.content overlay=true}} {{!-- here! --}}
        content!
      {{/dd.content}}
    {{/basic-dropdown}}
```

NOTE: If for some reason clicking outside a dropdown doesn't work, you might want to make sure the `<body>` spans the entire viewport. Adding a css rule like `body {min-height: 100vh;}` would do the trick. It ensures that wherever you click on the page, it will close the dropdown.

#### Close automatically when clicking inside the component
If you'd like the dropdown to close itself after a user clicks on it, you can use `dd.actions.close` from our public API.

```hbs
{{#basic-dropdown as |dd|}}
  {{#dd.trigger}}Click me!{{/dd.trigger}}
  {{#dd.content}}
    <div {{action dd.actions.close}}>
      {{yield dd}}
    </div>
  {{/dd.content}}
{{/basic-dropdown}}
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
resized, scrolled, the device changes it orientation or the content of the dropdown changes
(implemented with MutationObservers in modern browsers with fallback to DOM events in IE 9/10).

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
