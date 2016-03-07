import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

let func;
let originalMultationObserver = window.MutationObserver;

moduleForAcceptance('Acceptance | mutation observers', {
  beforeEach() {
    window.MutationObserver = (function() {
      let factory = function(callback) {
        func = callback;
      };
      factory.prototype.observe = function() {
      };
      factory.prototype.disconnect = function() {
      };
      return factory;
    })();
  },
  afterEach() {
    window.MutationObserver = originalMultationObserver;
  }
});

test('repositionDropdown should be run loop aware on re-render', function(assert) {
  let done = assert.async();
  let mutations = [{addedNodes: {length: 1}}];

  visit('/runloop');
  nativeClick('.ember-basic-dropdown-trigger');

  andThen(function() {
    func(mutations);
    setTimeout(function() {
      assert.equal(1, 1);
      done();
    }, 1);
  });
});
