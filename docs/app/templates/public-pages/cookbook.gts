import { LinkTo } from '@ember/routing';

<template>
  <section class="docs">
    <nav class="side-nav">
      <header class="side-nav-header">Basic recipes</header>
      <LinkTo
        @route="public-pages.cookbook.index"
        class="side-nav-link"
      >Usage without trigger</LinkTo>
    </nav>
    <section class="doc-page">
      {{outlet}}
    </section>
  </section>
</template>
