import { LinkTo } from '@ember/routing';
import CodeExample from '../../../components/code-example';
import Animations1Component from '../../../components/snippets/animations-1';

<template>
  <h1 class="doc-page-title">Animations</h1>

  <p>
    Do you like animations in your dropdowns? Me too. Let's define some
  </p>

  <p>
    It is that simple as create a CSS3 animation using the
    <code>ember-basic-dropdown--transitioning-in</code>,
    <code>ember-basic-dropdown--transitioned-in</code>
    and
    <code>ember-basic-dropdown--transitioning-out</code>
    classes that ember-basic-dropdown gives you automatically.
  </p>

  <p>
    You will probably also want to use
    <code>.ember-basic-dropdown-content--below</code>
    and
    <code>.ember-basic-dropdown-content--above</code>
    to have different animations depending on where the dropdown is positioned.
  </p>

  <CodeExample @glimmerTs="animations-1.gts" @css="animations-1-css.scss">
    <Animations1Component />
  </CodeExample>

  <p>
    There is nothing else to know about animations, other that you have to use CSS
    <strong>animations</strong>, not transitions.
  </p>

  <p>
    The dropdown takes care of creating a clone when closing the dropdown so you
    animation works in both directions.
  </p>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.custom-position"
      class="doc-page-nav-link-prev"
    >&lt; Custom position</LinkTo>
    <LinkTo
      @route="public-pages.docs.migrate-7-0-to-8-0"
      class="doc-page-nav-link-next"
    >Migrate from 7.0 to 8.0 &gt;</LinkTo>
  </div>
</template>
