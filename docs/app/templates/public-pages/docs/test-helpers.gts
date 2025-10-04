import { LinkTo } from '@ember/routing';
import CodeExample from '../../../components/code-example';

<template>
  <h1 class="doc-page-title">Test helpers</h1>

  <br />

  <p>
    Ember Basic Dropdown bundles some handy test helpers (<code
    >clickDropdown</code>
    and
    <code>tapDropdown</code>) that make it easier to simulate user interaction
    in acceptance tests.
  </p>

  <p>
    You can just have to import them at the top of your tests and call them
    preceded by
    <code>await</code>.
  </p>

  <CodeExample @js="test-helpers-1-js.js" @showResult={{false}} />

  <h3><code>clickTrigger(scope = null, eventOptions)</code></h3>

  <p>
    Simulates a click to open or close the dropdown. As all integration test
    helpers is already runloop aware, so you don't need to wrap it in
    <code>Ember.run</code>.
  </p>

  <p>
    In case there is more than one dropdown rendered at the same time you can
    pass a string with the scope to trigger it over the desired one.
  </p>

  <CodeExample @js="test-helpers-2-js.js" @showResult={{false}} />

  <h3><code>tapTrigger(scope = null, eventOptions)</code></h3>

  <p>
    Identical to
    <code>clickTrigger</code>
    but simulates a tap instead.
  </p>

  <CodeExample @js="test-helpers-3-js.js" @showResult={{false}} />

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.migrate-7-0-to-8-0"
      class="doc-page-nav-link-prev"
    >&lt; Migrate from 7.0 to 8.0</LinkTo>
    <LinkTo
      @route="public-pages.docs.api-reference"
      class="doc-page-nav-link-next"
    >API reference &gt;</LinkTo>
  </div>
</template>
