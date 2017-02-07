import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | helpers | clickDropdown');

test('`clickDropdown` simulates a click in the dropdown WITHIN the given selector', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(find('.ember-basic-dropdown-content').length, 0, 'There is no dropdown open');
    clickDropdown('.dropdown-1-wrapper');
  });

  andThen(function() {
    assert.equal(find('.ember-basic-dropdown-content').length, 1, 'There is a dropdown open');
  });
});

test('`clickDropdown` simulates a click in the dropdown WITH the given selector', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(find('.ember-basic-dropdown-content').length, 0, 'There is no dropdown open');
    clickDropdown('.dropdown-1');
  });

  andThen(function() {
    assert.equal(find('.ember-basic-dropdown-content').length, 1, 'There is a dropdown open');
  });
});
