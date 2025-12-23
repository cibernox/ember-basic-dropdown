import calculatePosition from '#src/utils/calculate-position.ts';
import { module, test } from 'qunit';

module('Unit | Utility | Calculate Position', function () {
  test('calculatePosition is defined', function (assert) {
    assert.strictEqual(typeof calculatePosition, 'function', 'Not a function');
  });
});
