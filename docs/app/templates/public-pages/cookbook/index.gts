import CodeExample from '../../../components/code-example';
import NoTrigger1Component from '../../../components/snippets/no-trigger-1';
import NoTrigger2Component from '../../../components/snippets/no-trigger-2';

<template>
  <h1 class="doc-page-title">Usage without trigger</h1>

  <p>
    Use the component without a trigger? Is that possible?
  </p>

  <p>
    Yes, it is. You don't need to invoke the
    <code>&#60;dropdown.trigger></code>
    component to make the dropdown work. The yielded
    <code>dropdown</code>
    has actions you can invoke from any other item. Yes, it is. You don't need
    to invoke the
    <code>&#60;dropdown.trigger></code>
    component to make the dropdown work. The yielded
    <code>dropdown</code>
    has actions you can invoke from any other item.
  </p>

  <p>
    Sometimes you just cannot achieve what you want with this approach, so you
    need to step down and wire things yourself.
  </p>

  <p>
    If you invoke the
    <code>open</code>
    or
    <code>toggle</code>
    action from say, a button, the dropdown is going to open and will take as
    the element to be anchored to element with
    <code>data-ebd-id="\{{dropdown.uniqueId}}-trigger"</code>.
  </p>

  <p>
    What kind of things can you do with this?
  </p>

  <p>
    By example, you can open or close the component when an item is clicked but
    make the dropdown attach itself to an entirely different item in the page.
  </p>

  <p>
    Let's create an input with a button. When that button is clicked the drodown
    will open below the input, not not below the button that you clicked.
  </p>

  <CodeExample @glimmerTs="no-trigger-1.gts">
    <NoTrigger1Component />
  </CodeExample>

  <p>
    Remember that almost always you will want to use the provided trigger
    component
    <code>&#60;dropdown.trigger></code>
    because it takes care of all the A11y, bindings and classes for you, but
    when you can't it's good to know that you can still use your own markup and
    wire things together yourself.
  </p>

  <p>
    A good middle-ground is to apply the same trigger modifier that the
    component uses, but to your element or component. It will get all of the
    same a11y and bindings that the
    <code>&#60;dropdown.trigger></code>
    component gets.
  </p>

  <CodeExample @glimmerTs="no-trigger-2.gts">
    <NoTrigger2Component />
  </CodeExample>
</template>
