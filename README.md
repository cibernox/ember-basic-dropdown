# Ember-basic-dropdown

This is a very minimal dropdown. That means that it is agnostic about what it is going to contain.

It is intended to be a building block for more complex components but is perfectly usable.

### Compatibility

**Warning**. This component suffered a full re-write of its public API in 0.12.
Until 0.11.X, the compatiblity was 1.13+
Starting in 0.12, the compatibility is 2.3.1+.

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

### Features

#### Renders on the body or in place

By default this component will render the dropdown in the body using ember-wormhole and absolutely
position it to place it in the proper coordinates.

You can opt out to this behavior by passing `renderInPlace=true`. That will add the dropdown just
below the trigger.

#### Intelligent dropdown position

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
The return value must be an object with this interface: `{ horizontalPosition, verticalPosition, styles }` where `styles` in an object with CSS properties, typically `top` and `left`/`right`.

#### Closed automatically when click outside the component

You don't need to care about adding or removing events, it does that for you.

#### Keyboard support

The trigger of the component is focusable by default, and when focused can be triggered using enter.
