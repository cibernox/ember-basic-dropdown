import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setConfig } from '#src/config.ts';
import { defaultBasicDropdownConfig } from '../../test-helper.ts';
import BasicDropdownWormhole from '#src/components/basic-dropdown-wormhole.gts';
import type { TestContext } from '@ember/test-helpers';

interface ExtendedTestContext extends TestContext {
  element: HTMLElement;
}

function getRootNode(element: Element): HTMLElement {
  return element.getRootNode() as HTMLElement;
}

module('Integration | Component | basic-dropdown-wormhole', function (hooks) {
  setupRenderingTest(hooks);

  hooks.afterEach(function (this: ExtendedTestContext) {
    setConfig(defaultBasicDropdownConfig);
  });

  test<ExtendedTestContext>('Is present', async function (assert) {
    await render(<template><BasicDropdownWormhole /></template>);

    assert
      .dom('#ember-basic-dropdown-wormhole', getRootNode(this.element))
      .exists('wormhole is present');
  });

  test<ExtendedTestContext>('Uses custom destination from config if present', async function (assert) {
    setConfig({
      ...defaultBasicDropdownConfig,
      destination: 'custom-wormhole-destination',
    });

    await render(<template><BasicDropdownWormhole /></template>);

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
    await render(
      <template><BasicDropdownWormhole class="my-custom-class" /></template>,
    );

    assert
      .dom('.my-custom-class', getRootNode(this.element))
      .exists('my-custom-class was set');
  });
});
