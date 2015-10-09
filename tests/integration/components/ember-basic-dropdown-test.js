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
  assert.equal(this.$('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
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
  assert.expect(2);

  this.didKeydown = function(e) {
    assert.ok(true, 'onKeydown action was invoked');
    assert.equal(e.keyCode, 13, 'it receives the keydown event');
  };
  this.render(hbs`
    {{#ember-basic-dropdown onKeydown=didKeydown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/ember-basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').trigger($.Event('keydown', { keyCode: 13 })));
});

test('It can be opened by firing a custom "dropdown:open" event', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#ember-basic-dropdown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/ember-basic-dropdown}}
  `);

  assert.equal(this.$('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  Ember.run(() => this.$('.ember-basic-dropdown')[0].dispatchEvent(new window.Event('dropdown:open')));
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
});

test('It can be closeed by firing a custom "dropdown:close" event', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#ember-basic-dropdown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/ember-basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').click());
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
  Ember.run(() => this.$('.ember-basic-dropdown')[0].dispatchEvent(new window.Event('dropdown:close')));
  assert.equal(this.$('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown disappeared');
});

test('It can be toggleed by firing a custom "dropdown:toggle" event', function(assert) {
  assert.expect(3);

  this.render(hbs`
    {{#ember-basic-dropdown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/ember-basic-dropdown}}
  `);

  assert.equal(this.$('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  Ember.run(() => this.$('.ember-basic-dropdown')[0].dispatchEvent(new window.Event('dropdown:toggle')));
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
  Ember.run(() => this.$('.ember-basic-dropdown')[0].dispatchEvent(new window.Event('dropdown:toggle')));
  assert.equal(this.$('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown disappeared');
});

test('It yields a toggle action that can be used from within the content of the dropdown', function(assert) {
  assert.expect(3);

  this.render(hbs`
    {{#ember-basic-dropdown as |toggle|}}
      <h3>Content of the dropdown</h3>
      <span id="click-to-close" onclick={{toggle}}></span>
    {{else}}
      <button>Press me</button>
    {{/ember-basic-dropdown}}
  `);

  assert.equal(this.$('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').click());
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
  Ember.run(() => $('#click-to-close').click());
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown disappeared');
});