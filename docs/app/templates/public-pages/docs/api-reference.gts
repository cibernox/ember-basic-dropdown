import { LinkTo } from '@ember/routing';

<template>
  <h1 class="doc-page-title">API reference</h1>

  <p>
    It's hard to find a proper place in the guides for explaining every single
    option in depth, and some of them are so straightforward that they don't
    require an example, so use this section as a more exhaustive list.
  </p>

  <br />
  <h2>Dropdown</h2>

  <table>
    <thead>
      <tr>
        <th>Option</th>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>calculatePosition</td>
        <td><code>Function</code></td>
        <td>Function to customize how the content of the dropdown is positioned.</td>
      </tr>
      <tr>
        <td>destination</td>
        <td><code>String</code></td>
        <td>The id of a DOM element where the dropdown will be rendered using
          <code>#in-element</code></td>
      </tr>
      <tr>
        <td>destinationElement</td>
        <td><code>HTMLElement</code></td>
        <td>Instead of passing
          <code>destination</code>, you can pass the DOM element where the
          dropdown will be rendered using
          <code>#in-element</code></td>
      </tr>
      <tr>
        <td>horizontalPosition</td>
        <td><code>String</code></td>
        <td>The horizontal positioning strategy of the content. Can be one of
          <code>auto</code>
          (the default),
          <code>left</code>,
          <code>right</code>,
          <code>center</code>,
          <code>auto-left</code>
          or
          <code>auto-right</code></td>
      </tr>
      <tr>
        <td>verticalPosition</td>
        <td><code>String</code></td>
        <td>The vertical positioning strategy of the content. Can be one of
          <code>auto</code>
          (the default),
          <code>above</code>
          or
          <code>below</code></td>
      </tr>
      <tr>
        <td>disabled</td>
        <td><code>Boolean</code></td>
        <td>(Default:
          <code>false</code>). Flag that disables opening and closing of the
          dropdown.</td>
      </tr>
      <tr>
        <td>matchTriggerWidth</td>
        <td><code>Boolean</code></td>
        <td>(Default:
          <code>false</code>). Flag that indicates whether or not the content's
          width should be equal to the width of the trigger.</td>
      </tr>
      <tr>
        <td>preventScroll</td>
        <td><code>Boolean</code></td>
        <td>(Default:
          <code>false</code>). Flag that prevents any elements on the page
          outside the dropdown from scrolling. This matches platform-provided
          <code>select</code>
          element behavior. Note that this has no effect when scroll is
          performed on a touch device</td>
      </tr>
      <tr>
        <td>renderInPlace</td>
        <td><code>String</code></td>
        <td>When passed
          <code>true</code>, the content will render next to the trigger instead
          of being placed in the root of the body.</td>
      </tr>
      <tr>
        <td>initiallyOpened</td>
        <td><code>Boolean</code></td>
        <td>(Default:
          <code>false</code>). When passed
          <code>true</code>
          the component is first rendered open. Used in combination with
          <code>preventScroll</code>
          it changes Fastboot user experience, but other than that it does not
          alter its behavior. The user can close it as usual.</td>
      </tr>
      <tr>
        <td>rootEventType</td>
        <td>String</td>
        <td>(Default:
          <code>'click'</code>) The type of mouse event that handles closing the
          dropdown. Valid values: "mousedown" and "click"</td>
      </tr>
      <tr>
        <td>triggerComponent</td>
        <td><code>Component</code></td>
        <td>The component to render as trigger instead of the default trigger
          component.</td>
      </tr>
      <tr>
        <td>triggerHtmlTag</td>
        <td><code>String</code></td>
        <td>(Default: <code>'div'</code>) The tag of the trigger component</td>
      </tr>
      <tr>
        <td>contentComponent</td>
        <td><code>Component</code></td>
        <td>The component to render as content instead of the default content
          component. You
          <em>probably</em>
          don't want to use this option.</td>
      </tr>
      <tr>
        <td>registerAPI</td>
        <td><code>Function</code></td>
        <td>An action that will be invoked with the new public API of the
          component every time there is a change in the state of the component.</td>
      </tr>
      <tr>
        <td>onInit</td>
        <td><code>Function</code></td>
        <td>Action that will be called when the component is initialized.</td>
      </tr>
      <tr>
        <td>onOpen</td>
        <td><code>Function</code></td>
        <td>Action that will be called when the component is about to open.
          Returning
          <code>false</code>
          from this function will prevent the component from being opened.</td>
      </tr>
      <tr>
        <td>onClose</td>
        <td><code>Function</code></td>
        <td>Action that will be called when the component is about to close.
          Returning
          <code>false</code>
          from this function will prevent the component from being closed.</td>
      </tr>
    </tbody>
  </table>

  <h2>Trigger</h2>

  <table>
    <thead>
      <tr>
        <th>Option</th>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>eventType</td>
        <td>String</td>
        <td>(Default:
          <code>'click'</code>) The type of mouse event that triggers the
          trigger. Valid values: "mousedown" and "click"</td>
      </tr>
      <tr>
        <td>stopPropagation</td>
        <td>Boolean</td>
        <td>(Default:
          <code>false</code>) Whether the trigger should prevent the propagation
          of the event that triggers it (click or mousedown)</td>
      </tr>
      <tr>
        <td>defaultClass</td>
        <td><code>String</code></td>
        <td>Another way of providing a class to the component without polluting
          the
          <code>class</code>
          attribute. Useful in contextual component to allow users give their
          own classes while still retaining some defaults</td>
      </tr>
      <tr>
        <td>onBlur</td>
        <td><code>Function</code></td>
        <td>Action that is executed on blur events.</td>
      </tr>
      <tr>
        <td>onClick</td>
        <td><code>Function</code></td>
        <td>Action that is executed on click events.</td>
      </tr>
      <tr>
        <td>onFocus</td>
        <td><code>Function</code></td>
        <td>Action that is executed on focus events.</td>
      </tr>
      <tr>
        <td>onFocusIn</td>
        <td><code>Function</code></td>
        <td>Action that is executed on focus-in events.</td>
      </tr>
      <tr>
        <td>onFocusOut</td>
        <td><code>Function</code></td>
        <td>Action that is executed on focus-out events.</td>
      </tr>
      <tr>
        <td>onKeyDown</td>
        <td><code>Function</code></td>
        <td>Action that is executed on keydown events.</td>
      </tr>
      <tr>
        <td>onMouseDown</td>
        <td><code>Function</code></td>
        <td>Action that is executed on mouse down events.</td>
      </tr>
      <tr>
        <td>onMouseEnter</td>
        <td><code>Function</code></td>
        <td>Action that is executed on mouse enter events.</td>
      </tr>
      <tr>
        <td>onMouseLeave</td>
        <td><code>Function</code></td>
        <td>Action that is executed on mouse leave events.</td>
      </tr>
      <tr>
        <td>onTouchEnd</td>
        <td><code>Function</code></td>
        <td>Action that is executed on touch end events.</td>
      </tr>
    </tbody>
  </table>

  <h2>Content</h2>

  <table>
    <thead>
      <tr>
        <th>Option</th>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>animationEnabled</td>
        <td>boolean</td>
        <td>Flag to determine whether the content will allow CSS animations.
          Defaults to true</td>
      </tr>
      <tr>
        <td>htmlTag</td>
        <td>String</td>
        <td>(Default: <code>'div'</code>) The tag of the content component</td>
      </tr>
      <tr>
        <td>shouldReposition</td>
        <td>Function</td>
        <td>An optional function that can be used to avoid uncecessary
          repositions. To skip a reposition, simply return
          <code>false</code>. This function will be invoked when the DOM of the
          content is changed. It receives two arguments: a
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord"
            target="_blank"
            rel="noopener noreferrer"
          >MutationRecord</a>
          and the public API object.</td>
      </tr>
      <tr>
        <td>transitioningInClass</td>
        <td>String</td>
        <td>Allow to customize the classes used for animations</td>
      </tr>
      <tr>
        <td>transitioningOutClass</td>
        <td>String</td>
        <td>Allow to customize the classes used for animations</td>
      </tr>
      <tr>
        <td>transitionedInClass</td>
        <td>String</td>
        <td>Allow to customize the classes used for animations</td>
      </tr>
      <tr>
        <td>isTouchDevice</td>
        <td>boolean</td>
        <td>Forces adding touch events. By default we do auto-detected</td>
      </tr>
      <tr>
        <td>overlay</td>
        <td>boolean</td>
        <td>Renders the dropdown content as an overlay (<LinkTo
            @route="public-pages.docs.overlays"
          >see example</LinkTo>).</td>
      </tr>
      <tr>
        <td>defaultClass</td>
        <td><code>String</code></td>
        <td>Another way of providing a class to the component without polluting
          the
          <code>class</code>
          attribute. Useful in contextual component to allow users give their
          own classes while still retaining some defaults</td>
      </tr>
      <tr>
        <td>onFocusIn</td>
        <td><code>Function</code></td>
        <td>Action that is executed on focus-in events.</td>
      </tr>
      <tr>
        <td>onFocusOut</td>
        <td><code>Function</code></td>
        <td>Action that is executed on focus-out events.</td>
      </tr>
      <tr>
        <td>onMouseEnter</td>
        <td><code>Function</code></td>
        <td>Action that is executed on mouse enter events.</td>
      </tr>
      <tr>
        <td>onMouseLeave</td>
        <td><code>Function</code></td>
        <td>Action that is executed on mouse leave events.</td>
      </tr>
    </tbody>
  </table>

  <h2>Public API's methods and actions</h2>

  <p>
    All actions and subcomponents of Ember Basic Dropdown receive a single
    object containing the entirety of the public API of the component.
  </p>

  <p>
    Any non-underscored property or action of this object can be considered
    public and it's not going to change without causing a major version bump, so
    if you are building another component on top of Ember Basic Dropdown, you
    know that you are safe as long as you use this object.
  </p>

  <pre>
  {
    uniqueId: &lt;string&gt;, // Contains the unique of this instance of EmberBasicDropdown. It's of the form 'ember1234'.
    disabled: &lt;boolean&gt;, // Truthy if the component received 'disabled=true'
    isOpen: &lt;boolean&gt;, // Truthy if the component is currently opened
    actions: {
      close() { ... }, // Closes the dropdown
      open() { ... }, // Opens the dropdown
      reposition() { ... }, // Repositions the dropdown
      toggle() { ... } // Toggles the dropdown
      registerTriggerElement() { ... }, Gives option to register the trigger element
      registerDropdownElement() { ... }, Gives option to register the dropdown element
      getTriggerElement() { ... } Return HTMLElement from registered trigger element
    }
  }
  </pre>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.test-helpers"
      class="doc-page-nav-link-prev"
    >&lt; Test helpers</LinkTo>
  </div>
</template>
