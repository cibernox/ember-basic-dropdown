import calculatePosition from 'ember-basic-dropdown/utils/calculate-position';
import { module, test } from 'qunit';

module('Unit | Utility | Calculate Position', function() {
  test('calculatePosition is defined', function (assert) {
    assert.strictEqual(typeof calculatePosition, 'function', 'Not a function');
  });
});
