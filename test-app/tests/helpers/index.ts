import {
  setupApplicationTest as upstreamSetupApplicationTest,
  setupRenderingTest as upstreamSetupRenderingTest,
  setupTest as upstreamSetupTest,
  type SetupTestOptions,
} from 'ember-qunit';
import { getRootElement } from '@ember/test-helpers';

// This file exists to provide wrappers around ember-qunit's
// test setup functions. This way, you can easily extend the setup that is
// needed per test type.

function setupApplicationTest(hooks: NestedHooks, options?: SetupTestOptions) {
  upstreamSetupApplicationTest(hooks, options);

  // Additional setup for application tests can be done here.
  //
  // For example, if you need an authenticated session for each
  // application test, you could do:
  //
  // hooks.beforeEach(async function () {
  //   await authenticateSession(); // ember-simple-auth
  // });
  //
  // This is also a good place to call test setup functions coming
  // from other addons:
  //
  // setupIntl(hooks, 'en-us'); // ember-intl
  // setupMirage(hooks); // ember-cli-mirage
}

function setupRenderingTest(hooks: NestedHooks, options?: SetupTestOptions) {
  upstreamSetupRenderingTest(hooks, options);

  // Additional setup for rendering tests can be done here.
}

function setupTest(hooks: NestedHooks, options?: SetupTestOptions) {
  upstreamSetupTest(hooks, options);

  // Additional setup for unit tests can be done here.
}

function setContainerSize(hooks, width, height, overflow) {
  let initialWidth: number;
  let initialHeight: number;
  let initialOverflow: string;

  hooks.beforeEach(function() {
    const container = getRootElement(); // safer than document.getElementById

    console.log(container)
    // Store original values
    initialWidth = container.style.width;
    initialHeight = container.style.height;
    initialOverflow = container.style.overflow;

    // Set new values
    if (width) container.style.width = width;
    if (height) container.style.height = height;
    if (overflow) container.style.overflow = overflow;

  });

  hooks.afterEach(function() {
    const container = getRootElement();
    // Reset to original values to avoid polluting other tests
    container.style.width = initialWidth;
    container.style.height = initialHeight;
    container.style.height = overflow;
  });
}

export { setupApplicationTest, setupRenderingTest, setupTest, setContainerSize };
