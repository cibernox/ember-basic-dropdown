import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';
import { render } from '@ember/test-helpers';
import config from 'test-app/config/environment';
import type { TestContext } from '@ember/test-helpers';

interface ExtendedTestContext extends TestContext {
  element: HTMLElement;
  originalConfig: Record<string, unknown>;
}

function getRootNode(element: Element): HTMLElement {
  return element.getRootNode() as HTMLElement;
}

module('Integration | Component | basic-dropdown-wormhole', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function (this: ExtendedTestContext) {
    // Duplicate config to avoid mutating global config
    this.originalConfig = JSON.parse(
      JSON.stringify(config['ember-basic-dropdown'] || {}),
    ) as Record<string, unknown>;
  });

  hooks.afterEach(function (this: ExtendedTestContext) {
    config['ember-basic-dropdown'] = this.originalConfig;
  });

  test<ExtendedTestContext>('Is present', async function (assert) {
    await render(hbs`
      <BasicDropdownWormhole />
    `);

    assert
      .dom('#ember-basic-dropdown-wormhole', getRootNode(this.element))
      .exists('wormhole is present');
  });

  test<ExtendedTestContext>('Uses custom destination from config if present', async function (assert) {
    config['ember-basic-dropdown'] = {
      destination: 'custom-wormhole-destination',
    };

    await render(hbs`<BasicDropdownWormhole />`);

    assert
      .dom(
        '.ember-application  #custom-wormhole-destination',
        getRootNode(this.element),
      )
      .exists('custom destination is used');

    assert
      .dom(
        '.ember-application #ember-basic-dropdown-wormhole',
        getRootNode(this.element),
      )
      .doesNotExist('default destination is not used');
  });

  test<ExtendedTestContext>('Has class my-custom-class', async function (assert) {
    await render(hbs`
      <BasicDropdownWormhole class="my-custom-class" />
    `);

    assert
      .dom('.my-custom-class', getRootNode(this.element))
      .exists('my-custom-class was set');
  });
});
