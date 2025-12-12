import { LinkTo } from '@ember/routing';

<template>
  <h1 class="doc-page-title">Migrate from 8.0 to 9.0</h1>

  <p>Before migrating to 9.x, you should first update to the latest 8.x release,
    as most of the breaking changes were introduced in 8.x.</p>

  <h2>Breaking changes</h2>

  <ul>
    <li>
      The minimum required versions are:
      <ul>
        <li>Ember 4.12 and above</li>
        <li><code>ember-truth-helpers</code> 5.x and above</li>
        <li><code>@ember/test-helpers</code> 5.x and above</li>
        <li><code>@glimmer/component</code> 2.x and above</li>
      </ul>
    </li>
    <li>
      <p>
        Passing
        <code>components</code>
        as strings is no longer supported. You must now pass all components as
        <code>contextual components</code>.<br />
        <small><i>(Ember deprecated passing components as strings in version
            3.25. In line with this change, we have removed the dependency on
            the deprecated
            <code>@embroider/util</code>
            package.)</i></small>
      </p>
    </li>
    <li>
      <p>
        <code>node-sass</code>
        has been deprecated for many years and is no longer supported. Please
        migrate to
        <code>sass</code>
        or
        <code>sass-embedded</code>.
      </p>
    </li>
    <li>
      <p>
        The
        <code>dropdown</code>
        option has been removed from
        <code>calculatePosition</code>. Previously, this option passed the
        current class instance to
        <code>calculatePosition</code>.<br>
        Note: This option was never documented.
      </p>
    </li>
    <li>
      <p>
        Passing
        <code>@dropdownId</code>
        wasn't working correctly without using custom modifiers and was
        undocumented. Remove this parameter and use the
        <code>uniqueId</code>
        property from the public API instead.
        <br />
        <small><i>(Deprecation added in 8.8)</i></small>
      </p>
    </li>
    <li>
      <p>
        Passing configurations to
        <code>ember-basic-dropdown</code>
        over
        <code>ember-cli-build.js</code>
        was removed. You should pass them over
        <code>setConfig</code>
        (see the installation guide)
        <br />
        <small><i>(Deprecation added in 8.9)</i></small>
      </p>
    </li>
    <li>
      <p>
        ember-basic-dropdown previously read the value of
        <code>APP.rootElement</code>
        from
        <code>ember-cli-build.js</code>. According to the v2 addon
        specification, addons should not read configurations from
        <code>ember-cli-build.js</code>. You must now pass this value via
        <code>setConfig</code>
        (see the installation guide).
        <br />
        <small><i>(Deprecation added in 8.9)</i></small>
      </p>
    </li>
  </ul>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.animations"
      class="doc-page-nav-link-prev"
    >&lt; Animations</LinkTo>
    <LinkTo
      @route="public-pages.docs.migrate-7-0-to-8-0"
      class="doc-page-nav-link-next"
    >Migrate from 7.0 to 8.0 &gt;</LinkTo>
  </div>
</template>
