import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | Opening and immediatly close');

test('BUGFIX: Opening and immediatly closing the component doesn\' leaves global event handlers', function(assert) {
  assert.expect(0);
  // This test has no assertion because the fact that runs without raising any exception
  // is already the validation that works.

  visit('/open-and-immediatly-close');

  andThen(() => {
    click('.ember-basic-dropdown-trigger');
  });

  andThen(() => {
    let event = new window.Event('mousedown');
    $('#other-div')[0].dispatchEvent(event);
  });
});
