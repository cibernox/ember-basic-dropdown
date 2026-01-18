import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
} from '@ember/test-helpers';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';

module('Integration | Component | basic-dropdown', function (hooks) {
  setupRenderingTest(hooks);

  test('Test', async function (assert) {
    await render(
      <template>
        <BasicDropdown as |dropdown|>
          <div id="dropdown-unique-id-container">{{dropdown.uniqueId}}</div>
        </BasicDropdown>
      </template>,
    );

    assert
      // @ts-expect-error Property 'element' does not exist on type 'TestContext'.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .dom('#dropdown-unique-id-container', this.element)
      .hasText(/ember\d+/, 'It yields the uniqueId');
  });
});
