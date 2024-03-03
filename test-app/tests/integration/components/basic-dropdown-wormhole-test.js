import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';
import { render } from '@ember/test-helpers';
import config from 'test-app/config/environment';

module('Integration | Component | basic-dropdown-wormhole', function (hooks) {
  setupRenderingTest(hooks);

  test('Is present', async function (assert) {
    await render(hbs`
      <BasicDropdownWormhole />
    `);

    let id = '#ember-testing';
    if (config.APP.shadowDom) {
      id = '#ember-basic-dropdown-wormhole';
    }

    assert.dom(id, this.element.getRootNode()).exists('wormhole is present');
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
