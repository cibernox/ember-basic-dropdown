import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module(
  'Integration | Component | basic-dropdown-optional-tag',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it works without an @htmlTag', async function (assert) {
      await render(
        hbs`<BasicDropdownOptionalTag class='my-class'>content</BasicDropdownOptionalTag>`
      );

      assert.dom('div').exists();
      assert.dom('div').hasClass('my-class');
      assert.dom('div').hasText('content');
    });

    test('it works with an @htmlTag', async function (assert) {
      await render(
        hbs`<BasicDropdownOptionalTag @htmlTag="button" class='my-class'>content</BasicDropdownOptionalTag>`
      );

      assert.dom('button').exists();
      assert.dom('button').hasClass('my-class');
      assert.dom('button').hasText('content');
    });
  }
);
