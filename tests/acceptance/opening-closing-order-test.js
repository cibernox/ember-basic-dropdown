import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | Opening-closing order');

test('when a dropdown is opened and another dropdown is clicked, the first one closes before opening the new', function(assert) {
  visit('/opening-closing-order');

  andThen(function() {
    nativeClick('.dd-1 .ember-basic-dropdown-trigger');
  });

  andThen(function() {
    nativeClick('.dd-2 .ember-basic-dropdown-trigger');
  });

  andThen(() => {
    let calls = this.application.__container__.lookup('controller:opening-closing-order').calls;
    assert.equal(calls.length, 3);
    assert.equal(calls[0], 'open1');
    assert.equal(calls[1], 'close1');
    assert.equal(calls[2], 'open2');
  });
});
