import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import { find, visit } from 'ember-native-dom-helpers';

moduleForAcceptance('Acceptance | helpers | clickDropdown');

test('`clickDropdown` simulates a click in the dropdown WITHIN the given selector', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.notOk(find('.ember-basic-dropdown-content'), 'There is no dropdown open');
    clickDropdown('.dropdown-1-wrapper');
  });

  andThen(function() {
    assert.ok(find('.ember-basic-dropdown-content'), 'There is a dropdown open');
    assert.equal(find('.ember-basic-dropdown-content').textContent.trim(), 'Hello world 1!', 'There it is the expected one');
  });
});

test('`clickDropdown` simulates a click in the dropdown WITH the given selector', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.notOk(find('.ember-basic-dropdown-content'), 'There is no dropdown open');
    clickDropdown('.dropdown-1');
  });

  andThen(function() {
    assert.ok(find('.ember-basic-dropdown-content'), 'There is a dropdown open');
    assert.equal(find('.ember-basic-dropdown-content').textContent.trim(), 'Hello world 1!', 'There it is the expected one');
  });
});
