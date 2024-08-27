import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';
import { render } from '@ember/test-helpers';
import config from 'test-app/config/environment';

module('Integration | Component | basic-dropdown-wormhole', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    // Duplicate config to avoid mutating global config
    this.originalConfig = JSON.parse(
      JSON.stringify(config['ember-basic-dropdown'] || {}),
    );
  });

  hooks.afterEach(async function () {
    config['ember-basic-dropdown'] = this.originalConfig;
  });

  test('Is present', async function (assert) {
    await render(hbs`
      <BasicDropdownWormhole />
    `);

    assert
      .dom('#ember-basic-dropdown-wormhole', this.element.getRootNode())
      .exists('wormhole is present');
  });

  test('Uses custom destination from config if present', async function (assert) {
    config['ember-basic-dropdown'] = {
      destination: 'custom-wormhole-destination',
    };

    await render(hbs`<BasicDropdownWormhole />`);

    assert
      .dom(
        '.ember-application  #custom-wormhole-destination',
        this.element.getRootNode(),
      )
      .exists('custom destination is used');

    assert
      .dom(
        '.ember-application #ember-basic-dropdown-wormhole',
        this.element.getRootNode(),
      )
      .doesNotExist('default destination is not used');
  });

  test('Has class my-custom-class', async function (assert) {
    await render(hbs`
      <BasicDropdownWormhole class="my-custom-class" />
    `);

    assert
      .dom('.my-custom-class', this.element.getRootNode())
      .exists('my-custom-class was set');
  });
});
