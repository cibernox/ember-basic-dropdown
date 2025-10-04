import { LinkTo } from '@ember/routing';
import CodeExample from '../../../components/code-example';

<template>
  <h1 class="doc-page-title">Styles</h1>

  <p>
    Since this component doesn't any visual theme, you can apply styles to it just
    with plain CSS or even adding the classes your favourite CSS framework gives
    you.
  </p>

  <p>
    If don't use any css pre-processor this is all. If you do use SASS or LESS,
    the addon will know it and will have to
    <code>@import</code>
    the styles explicitly. This gives you the chance to set a few variables that
    Ember Basic Dropdown will use.
  </p>

  <p>
    There is only four variables you can tweak (Sass syntax)
  </p>

  <CodeExample @scss="styles-1.scss" @showResult={{false}} @activeTab="scss" />

  <p>
    If by example you want to change the colour of the overlay to be blue, you
    could do this in your
    <code>app.scss</code>/<code>app.less</code>.
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
