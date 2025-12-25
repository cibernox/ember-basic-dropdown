import { LinkTo } from '@ember/routing';
import CodeExample from '../../../components/code-example';

<template>
  <h1 class="doc-page-title">Styles</h1>

  <p>
    Since this component doesn't any visual theme, you can apply styles to it
    just with CSS variables, plain CSS or even adding the classes your favorite
    CSS framework gives you.
  </p>

  <CodeExample @css="styles-0.css" @showResult={{false}} @activeTab="css" />

  <p>
    If you use SASS you can override the default values by using the SASS syntax
  </p>

  <CodeExample @scss="styles-1.scss" @showResult={{false}} @activeTab="scss" />

  <p>
    If by example you want to change the colour of the overlay to be blue, you
    could do this in your
    <code>app.scss</code>.
  </p>

  <CodeExample @scss="styles-2.scss" @showResult={{false}} @activeTab="scss" />

  <p>
    In the next sections we'll give in more involved customizations.
  </p>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.overlays"
      class="doc-page-nav-link-prev"
    >&lt; Overlays</LinkTo>
    <LinkTo
      @route="public-pages.docs.custom-position"
      class="doc-page-nav-link-next"
    >Custom position &gt;</LinkTo>
  </div>
</template>
