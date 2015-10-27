import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('ember-basic-dropdown', 'Integration | Component | ember basic dropdown', {
  integration: true
});

/**
  a) [DONE] It toggles when the trigger is clicked.
  b) [DONE] It closes when you click outside the component and the trigger is not focused
  c) [DONE] It can receive an onOpen action that is fired when the component opens.
  d) [DONE] It can receive an onClose action that is fired when the component closes.
  e) [DONE] It can receive an onFocus action that is fired when the trigger gets the focus.
  f) [DONE] It can receive an onKeyDown action that is fired when a key is pressed while the trigger is focused.
  g) [DONE] It can be opened by firing a custom 'dropdown:open' event.
  h) [DONE] It can be closeed by firing a custom 'dropdown:close' event.
  i) [DONE] It can be toggleed by firing a custom 'dropdown:toggle' event.
  j) [DONE] It yields a toggle action that can be used from within the content of the dropdown.
*/

test('It toggles when the trigger is clicked', function(assert) {
  assert.expect(5);

  this.render(hbs`
    {{#ember-basic-dropdown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/ember-basic-dropdown}}
  `);

  assert.equal(this.$('.ember-basic-dropdown').length, 1, 'Is rendered');
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').click());
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').click());
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown disappeared');
  assert.equal(this.$('.ember-basic-dropdown-trigger')[0], document.activeElement, 'The trigger is focused');
});

test('It closes when you click outside the component and the trigger is not focuse', function(assert) {
  assert.expect(3);

  this.render(hbs`
    <div id="not-the-dropdown"></div>
    {{#ember-basic-dropdown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/ember-basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').click());
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
  Ember.run(() => this.$('#not-the-dropdown').click());
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown disappeared');
  assert.notEqual(this.$('.ember-basic-dropdown-trigger')[0], document.activeElement, 'The trigger is not focused');
});

test('It can receive an onOpen action that is fired when the component opens', function(assert) {
  assert.expect(1);

  this.didOpen = function() {
    assert.ok(true, 'onOpen action was invoked');
  };
  this.render(hbs`
    {{#ember-basic-dropdown onOpen=didOpen}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/ember-basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').click());
});

test('It can receive an onClose action that is fired when the component closes', function(assert) {
  assert.expect(1);

  this.didClose = function() {
    assert.ok(true, 'onClose action was invoked');
  };
  this.render(hbs`
    {{#ember-basic-dropdown onClose=didClose}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/ember-basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').click());
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').click());
});

test('It can receive an onFocus action that is fired when the trigger gets the focus', function(assert) {
  assert.expect(1);

  this.didFocus = function() {
    assert.ok(true, 'onFocus action was invoked');
  };
  this.render(hbs`
    {{#ember-basic-dropdown onFocus=didFocus}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/ember-basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
});

test('It can receive an onKeyDown action that is fired when a key is pressed while the trigger is focused', function(assert) {
  assert.expect(3);

  this.didKeydown = function(publicAPI, e) {
    assert.ok(true, 'onKeydown action was invoked');
    assert.equal(e.keyCode, 65, 'it receives the keydown event');
    assert.ok(publicAPI.open && publicAPI.close && publicAPI.toggle, 'it receives an object with `open`, `close` and `toggle` functions');
  };

  this.render(hbs`
    {{#ember-basic-dropdown onKeydown=didKeydown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/ember-basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  Ember.run(() => createEventDispatcher(this.$('.ember-basic-dropdown-trigger')[0]).keydown(65));
});

test('Pressing Enter while the trigger is focused show the content', function(assert) {
  assert.expect(3);

  this.didKeydown = function(/* publicAPI, e */) {
    assert.ok(true, 'onKeydown action was invoked');
  };
  this.render(hbs`
    {{#ember-basic-dropdown onKeydown=didKeydown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/ember-basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  Ember.run(() => createEventDispatcher(this.$('.ember-basic-dropdown-trigger')[0]).keydown(13));
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
});

test('Pressing Enter while the trigger is focused doesn\'t show the content if the event is default precented in the onKeydown action', function(assert) {
  assert.expect(3);

  this.didKeydown = function(publicAPI, e) {
    assert.ok(true, 'onKeydown action was invoked');
    e.preventDefault();
  };
  this.render(hbs`
    {{#ember-basic-dropdown onKeydown=didKeydown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/ember-basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  Ember.run(() => createEventDispatcher(this.$('.ember-basic-dropdown-trigger')[0]).keydown(13));
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is still not rendered');
});

test('Pressing ESC while the trigger is focused and the dropdown is opened', function(assert) {
  assert.expect(3);

  this.didKeydown = function(/* publicAPI, e */) {
    assert.ok(true, 'onKeydown action was invoked');
  };
  this.render(hbs`
    {{#ember-basic-dropdown onKeydown=didKeydown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/ember-basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').click());
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown is rendered');
  Ember.run(() => createEventDispatcher(this.$('.ember-basic-dropdown-trigger')[0]).keydown(27));
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
});

test('Pressing ESC while the trigger is focused and the dropdown is opened doesn\'t closes the dropdown if the event is defaultprevented', function(assert) {
  assert.expect(3);

  this.didKeydown = function(publicAPI, e) {
    assert.ok(true, 'onKeydown action was invoked');
    e.preventDefault();
  };
  this.render(hbs`
    {{#ember-basic-dropdown onKeydown=didKeydown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/ember-basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').click());
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown is rendered');
  Ember.run(() => createEventDispatcher(this.$('.ember-basic-dropdown-trigger')[0]).keydown(27));
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown is still rendered');
});

test('It yields an object with a toggle action that can be used from within the content of the dropdown', function(assert) {
  assert.expect(3);

  this.render(hbs`
    {{#ember-basic-dropdown as |dropdown|}}
      <h3>Content of the dropdown</h3>
      <span id="click-to-close" onclick={{dropdown.toggle}}></span>
    {{else}}
      <button>Press me</button>
    {{/ember-basic-dropdown}}
  `);

  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').click());
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
  Ember.run(() => $('#click-to-close').click());
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown disappeared');
});

function createEventDispatcher(domElement) {
  const Podium = {};
  Podium.keydown = function(k) {
    var oEvent = document.createEvent('KeyboardEvent');

    // Chromium Hack
    Object.defineProperty(oEvent, 'keyCode', {
      get() { return this.keyCodeVal; }
    });
    Object.defineProperty(oEvent, 'which', {
      get() {
          return this.keyCodeVal;
      }
    });

    if (oEvent.initKeyboardEvent) {
      oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, false, false, k, k);
    } else {
      oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, k, 0);
    }

    oEvent.keyCodeVal = k;
    domElement.dispatchEvent(oEvent);
  };
  return Podium;
}