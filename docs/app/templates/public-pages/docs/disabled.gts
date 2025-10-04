import CodeExample from 'docs/components/code-example';
import Disabled1Component from '../../../components/snippets/disabled-1';
import { LinkTo } from '@ember/routing';

<template>
  <h1 class="doc-page-title">Disabled</h1>

  <p>
    If you disable the dropdown, it will not open or close by any mean, mouse,
    keyboard or touch screen.
  </p>

  <CodeExample @glimmerTs="disabled-1.gts">
    <Disabled1Component />
  </CodeExample>

  <p>
    Note that being disabled does not prevent the dropdown or any of its
    sub-components from firing events like
    <code>onMouseEnter</code>.
  </p>

  <p>
    The component takes care by default of usual good practices, removing the
    <code>tabindex</code>
    of the trigger and set
    <code>[aria-disabled="true"]</code>
    to assist screen readers.
  </p>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.position"
      class="doc-page-nav-link-prev"
    >&lt; Position</LinkTo>
    <LinkTo
      @route="public-pages.docs.overlays"
      class="doc-page-nav-link-next"
    >Overlays &gt;</LinkTo>
  </div>
</template>
