import CodeExample from '../../../components/code-example';
import { LinkTo } from '@ember/routing';

<template>
  <h1 class="doc-page-title">Installation</h1>

  <p>
    To install ember-basic-dropdown, run the following command in your ember
    project directory
  </p>

  <p>
    <div class="code-block">
      <pre>$ pnpm install ember-basic-dropdown</pre>
    </div>
  </p>

  <p>
    After the installation you need to add the following lines somewhere in your
    <code>app.js/ts</code>.
  </p>

  <CodeExample
    @js="installation-2.js.txt"
    @showResult={{false}}
    @activeTab="js"
  />

  <p>
    Then you need to add the following lines somewhere in your templates where
    you want to render the dropdown content into e.g. your
    <code>application.gjs/gts</code>. In this component will be rendered the
    dropdown content.
  </p>

  <CodeExample
    @glimmerTs="installation-0.gts"
    @showResult={{false}}
    @activeTab="glimmer-ts"
  />

  <p>
    If you use vanilla CSS, you need to add the following line into
    <code>app.js</code>
    or in any route/controller/component
    <code>.js/.ts</code>
    file:
  </p>

  <CodeExample @js="installation-1.js" @showResult={{false}} />

  <p>
    Instead of adding the styling in an
    <code>.js</code>
    file and depending from your build config you can also add the css in any
    template/component css file by using following line
  </p>

  <CodeExample
    @css="installation-1.css.txt"
    @showResult={{false}}
    @activeTab="css"
  />

  <p>
    However, if you are using SASS or LESS you need to add an import statement
    to your styles.
  </p>

  <CodeExample
    @scss="installation-1.scss"
    @showResult={{false}}
    @activeTab="scss"
  />

  <p>
    If you are using LESS there is also necessary to register the
    <code>paths</code>
    in
    <code>lessOptions</code>
  </p>

  <CodeExample @js="installation-2-snippet.js" @showResult={{false}} />

  <p>
    The styles of the addon are
    <strong>very minimal</strong>
    and deal mostly with positioning. You can tweak a couple things but we'll
    get to that later.
  </p>

  <p>
    Now let's learn the API of the component.
  </p>

  <div class="doc-page-nav">
    <LinkTo @route="public-pages.docs.index" class="doc-page-nav-link-prev">&lt;
      Overview</LinkTo>
    <LinkTo
      @route="public-pages.docs.how-to-use-it"
      class="doc-page-nav-link-next"
    >How to use it &gt;</LinkTo>
  </div>
</template>
