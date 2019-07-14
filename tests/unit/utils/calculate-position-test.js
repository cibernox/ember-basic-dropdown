import calculatePosition from 'ember-basic-dropdown/utils/calculate-position';
import { module, test } from 'qunit';

module('Unit | Utility | Calculate Position');

test('calculatePosition is defined', function(assert) {
  assert.equal(typeof calculatePosition, 'function', 'Not a function');
});