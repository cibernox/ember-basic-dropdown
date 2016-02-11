# Ember-basic-dropdown

This is a very minimal dropdown. That means that it is agnostic about what it is going to contain.

It is intended to be a building block for more complex components but is perfectly usable.

### Installation

```
ember install ember-basic-dropdown
```

### Usage

```hbs
{{#basic-dropdown as |dropdown|}}
  Content of the dropdown once it appears
{{else}}
  Content of the trigger
{{/basic-dropdown}}
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

You can force the component to be fixed in one position by passing `verticalPosition = above | below` and/or `horizontalPosition = right | left`.

#### Closed automatically when click outside the component

You don't need to care about adding or removing events, it does that for you.

#### Keyboard support

The trigger of the component is focusable by default, and when focused can be triggered using enter.
