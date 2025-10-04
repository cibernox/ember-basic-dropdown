import CodeExample from '../../../components/code-example';
import { LinkTo } from '@ember/routing';
import Position1Component from '../../../components/snippets/position-1';
import Position2Component from '../../../components/snippets/position-2';
import Position3Component from '../../../components/snippets/position-3';

<template>
  <h1 class="doc-page-title">Position</h1>

  <p>
    The number one thing that you will want to customize in a dropdown is where
    the floating content will be positioned in relation to the trigger.
  </p>

  <h3><code>horizontalPosition / verticalPosition</code></h3>

  <p>
    Ember Basic Dropdown comes with a nice set of defaults. The rules are as
    follow:
  </p>

  <ul>
    <li>
      The
      <code>&lt;dd.Content&gt;</code>
      has not pre-defined size, so it will adapt to the size its childs.
    </li>
    <li>
      The dropdown's content is positioned below the trigger, unless there is
      not enough space to fit it, in which case it is positioned above it.
    </li>
    <li>
      The content's left border will be aligned with the trigger's left border
      and content will flow towards the right.
    </li>
    <li>
      If there isn't enough size towards the right to fit the content but there
      is enough room to the left, the right border of the content will align
      with the right border of the trigger and it will grow towards the left.
    </li>
    <li>
      All the rules above are re-checked every time the content of the dropdown
      changes, the browser is resized or the orientation of the device changes.
    </li>
  </ul>

  <p>This sounds like a lot, but with an example it will be crystal clear.</p>

  <CodeExample @glimmerTs="position-1.gts">
    <Position1Component />
  </CodeExample>

  <p>
    In this example above I'm using the options
    <code>verticalPosition</code>
    and
    <code>horizontalPosition</code>
    to override the default behaviour.
  </p>

  <p>
    The default value for both options is
    <code>auto</code>, but you can pass
    <code>verticalPosition=above|below</code>
    and
    <code>horizontalPosition=auto-right|right|center|left</code>.
  </p>

  <p>Narrow the window of the browser and play with scroll to see the automatic
    positioning in action.</p>

  <h3><code>renderInPlace</code></h3>

  <p>
    Although by default the component renders the content in the root of the app
    and positions it absolutely, there are some situations where you want the
    content to be
    <em>physically</em>
    next to the trigger.
  </p>

  <p>
    To do so, pass
    <code>renderInPlace=true</code>
    to the component. Inspect the DOM of the next example to see the difference.
  </p>

  <CodeExample @glimmerTs="position-2.gts">
    <Position2Component />
  </CodeExample>

  <p>
    Please note that when rendering the content in place, the vertical position
    will not automatically detect the best position based on the space around
    the trigger. You have to explicitly pass
    <code>verticalPosition="above"</code>
    to render it over the trigger.
  </p>

  <h3><code>matchTriggerWidth</code></h3>

  <p>
    There is a few widgets in which the width of the floating box has to match
    the width of the trigger design reasons. Since this is common enough, there
    is an option to enable this behaviour.
  </p>

  <CodeExample @glimmerTs="position-3.gts">
    <Position3Component />
  </CodeExample>

  <p>
    In the section about
    <a href="/docs/custom-position">Custom Position</a>
    strategies we will see how to totally customize how the dropdown is
    positioned by passing it a function. If you do so the options in this
    section will not work unless your function, which will receive those
    options, honors them.
  </p>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.trigger-events"
      class="doc-page-nav-link-prev"
    >&lt; Trigger events</LinkTo>
    <LinkTo
      @route="public-pages.docs.disabled"
      class="doc-page-nav-link-next"
    >Disabled &gt;</LinkTo>
  </div>
</template>
