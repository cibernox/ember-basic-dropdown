import CodeExample from '../../../components/code-example';
import { LinkTo } from '@ember/routing';

<template>
  <h1 class="doc-page-title">Migrate from 7.0 to 8.0</h1>

  <p>The addon is now a
    <a href="https://rfcs.emberjs.com/id/0507-embroider-v2-package-format/">V2
      Embroider Addon</a>. The following changes are necessary:</p>

  <ul>
    <li>
      <p>Add following line to your <code>application.hbs</code></p>
      <CodeExample
        @glimmerTs="installation-0.gts"
        @showResult={{false}}
        @activeTab="glimmer-ts"
      />
    </li>
    <li>
      <p>Vanilla JS: If you have used vanilla js you must now import the css in
        <code>app.js</code>
        manually like (for other css adding examples see under installation)</p>
      <CodeExample @js="installation-1.js" @showResult={{false}} />
    </li>
    <li>
      <p>LESS: If you are using with less you need to add
        <code>lessOptions</code>
        into your
        <code>ember-cli-build.js</code>
        file</p>
      <CodeExample @js="installation-2-snippet.js" @showResult={{false}} />
    </li>
    <li>
      <p>Typescript: There were added / modified / fixed the typescript
        declarations. This could be braking for consumer app</p>
    </li>
  </ul>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.migrate-8-0-to-9-0"
      class="doc-page-nav-link-prev"
    >&lt; Migrate from 8.0 to 9.0</LinkTo>
    <LinkTo
      @route="public-pages.docs.test-helpers"
      class="doc-page-nav-link-next"
    >Test helpers &gt;</LinkTo>
  </div>
</template>
