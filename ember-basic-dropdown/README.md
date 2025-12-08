[![NPM](https://badge.fury.io/js/ember-basic-dropdown.svg)](https://www.npmjs.com/package/ember-basic-dropdown)
[![Ember Observer Score](https://emberobserver.com/badges/ember-basic-dropdown.svg)](https://emberobserver.com/addons/ember-basic-dropdown)
![Ember Version](https://img.shields.io/badge/ember-%3E%3D3.28-brightgreen?logo=emberdotjs&logoColor=white)
[![Discord](https://img.shields.io/badge/chat-discord-blue?style=flat&logo=discord)](https://discord.com/channels/480462759797063690/486202731766349824)
[![Build Status](https://github.com/cibernox/ember-basic-dropdown/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/cibernox/ember-basic-dropdown)

# ember-basic-dropdown

This is a very minimal dropdown. That means that it is agnostic about what it is going to contain.

It is intended to be a building block for more complex components but is perfectly usable.

### Features

- 🖊 **TypeScript support** – ships with type definitions for smooth TypeScript integration.
- ✨ **Glint support** – template type-checking out of the box for safer templates.
- 🚀 **FastBoot compatible** – works in server-rendered Ember apps.
- 🕶 **Shadow DOM support** – can be rendered inside shadow roots without breaking positioning or events.
- 🛠 **Addon v2 ready** – modern Ember Addon v2 format.
- 🎯 **Headless & lightweight** – provides dropdown logic and accessibility without forcing styles.
- 🔧 **Flexible API** – fully customizable trigger and content; you control the markup and styling.
- 🧩 **Composable** – integrates seamlessly with other Ember addons (e.g. [ember-power-select](https://www.ember-power-select.com)).
- ♿ **Accessible by default** – full keyboard navigation, ARIA attributes, and focus management built-in.
- 📱 **Responsive positioning** – automatic repositioning on scroll and viewport boundaries.

### Compatibility

- Embroider or ember-auto-import v2
- Ember.js v4.12 or above

### Installation

```
pnpm install ember-basic-dropdown
```

For more installation details see [documentation](https://ember-basic-dropdown.com/docs/installation)

### Usage

This component leverages contextual components for its API:

```glimmer-ts
import BasicDropdown from "ember-basic-dropdown/components/basic-dropdown";

<template>
  <BasicDropdown as |dd|>
    <dd.Trigger>Click me</dd.Trigger>
    <dd.Content>Content of the trigger</dd.Content>
  </BasicDropdown>
</template>
```

The yielded `dropdown` object is the public API of the component, and contains
properties and actions that you can use to control the component.

```js
{
  uniqueId: <string>,
  disabled: <boolean>,
  isOpen: <boolean>,
  actions: {
    open: <action>,
    close: <action>,
    toggle: <action>,
    reposition: <action>,
    registerTriggerElement: <action>,
    registerDropdownElement: <action>,
    getTriggerElement: <action>
  }
}
```

Check the full documentation with live examples in https://ember-basic-dropdown.com

### Features

#### Renders on the body or in place

By default this component will render the dropdown in the body using `#in-element` and absolutely
position it to place it in the proper coordinates.

You can opt out to this behavior by passing `renderInPlace=true`. That will add the dropdown just
below the trigger.

#### Close automatically when clicking outside the component

You don't need to care about adding or removing events, it does that for you.

You can make the dropdown content standout a little more by adding `overlay=true` to the content options, see example below. This will add a semi transparent overlay covering the whole screen. Also this will stop bubbling the click/touch event which closed the dropdown.

```glimmer-ts
import BasicDropdown from "ember-basic-dropdown/components/basic-dropdown";

<template>
  <BasicDropdown as |dd|>
    <dd.Trigger>Click me!</dd.Trigger>
    <dd.Content @overlay={{true}}>
      {{! here! }}
      content!
    </dd.Content>
  </BasicDropdown>
</template>
```

NOTE: If for some reason clicking outside a dropdown doesn't work, you might want to make sure the `<body>` spans the entire viewport. Adding a css rule like `body {min-height: 100vh;}` would do the trick. It ensures that wherever you click on the page, it will close the dropdown.

#### Close automatically when clicking inside the component

If you'd like the dropdown to close itself after a user clicks on it, you can use `dd.actions.close` from our public API.

```glimmer-ts
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import { on } from '@ember/modifier';

<template>
  <BasicDropdown as |dd|>
    <dd.Trigger>Click me!</dd.Trigger>
    <dd.Content>
      <div role="button" {{on "click" dd.actions.close}}>
        {{yield dd}}
      </div>
    </dd.Content>
  </BasicDropdown>
<template>
```

#### Keyboard and touchscreen support

The trigger of the component is focusable by default, and when focused can be triggered using `Enter` or `Space`.
It also listen to touch events so it works in mobile.

#### Easy to extend

The components provide hooks like `onFocus`, `onBlur`, `onKeydown`, `onMouseEnter` and more so
you can do pretty much anything you want.

#### Easy to animate.

You can animate it, in an out, with just CSS3 animations.
Check the example in the [Ember Power Select documentation](https://www.ember-power-select.com/cookbook/css-animations)

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
