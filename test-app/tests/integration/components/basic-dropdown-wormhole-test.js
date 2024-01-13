import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';
import { render } from '@ember/test-helpers';

module('Integration | Component | basic-dropdown-wormhole', function (hooks) {
  setupRenderingTest(hooks);

  test('Is present', async function (assert) {
    await render(hbs`
      <BasicDropdownWormhole />
    `);

    assert.dom('#ember-testing').exists('wormhole is present');
  });

  test('Has class my-custom-class', async function (assert) {
    await render(hbs`
      <BasicDropdownWormhole class="my-custom-class" />
    `);

    assert.dom('.my-custom-class').exists('my-custom-class was set');
  });
});
