import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';
import { find } from 'ember-native-dom-helpers';
// import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
// import { find, visit } from 'ember-native-dom-helpers';

// moduleForAcceptance('Acceptance | helpers | clickDropdown');
module('Acceptance | helpers | clickDropdown', function(hooks) {
  setupApplicationTest(hooks);

  test('`clickDropdown` simulates a click in the dropdown WITHIN the given selector', async function(assert) {
    await visit('/helpers-testing');

    assert.notOk(find('.ember-basic-dropdown-content'), 'There is no dropdown open');
    await clickDropdown('.dropdown-1-wrapper');

    assert.ok(find('.ember-basic-dropdown-content'), 'There is a dropdown open');
    assert.equal(find('.ember-basic-dropdown-content').textContent.trim(), 'Hello world 1!', 'There it is the expected one');
  });

  test('`clickDropdown` simulates a click in the dropdown WITH the given selector', async function(assert) {
    await visit('/helpers-testing');

    assert.notOk(find('.ember-basic-dropdown-content'), 'There is no dropdown open');
    await clickDropdown('.dropdown-1');

    assert.ok(find('.ember-basic-dropdown-content'), 'There is a dropdown open');
    assert.equal(find('.ember-basic-dropdown-content').textContent.trim(), 'Hello world 1!', 'There it is the expected one');
  });
});
