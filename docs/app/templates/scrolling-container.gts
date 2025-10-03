import ScrollableContainer1Component from '../components/snippets/scrollable-container-1';
import CodeExample from 'docs/components/code-example';

<template>
  <div class="scrolling-container-temporal-demo">

    <h1 class="doc-page-title">Usage with a scrollable container</h1>

    <p>
      What if your app doesn't scroll on the body tag? You can have the dropdown
      render wherever you would like. If you render it on an element inside the
      block that is scrolling the dropdown will automatically scroll with your
      trigger. You need to give the target element
      <code>position: relative;</code>
      for the dropdown to be positioned properly.
    </p>

    <CodeExample @glimmerTs="scrollable-container-1.gts">
      <ScrollableContainer1Component />
    </CodeExample>
  </div>
</template>
