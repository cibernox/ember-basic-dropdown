import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-basic-dropdown', 'Integration | Component | ember basic dropdown', {
  integration: true
});

/**
  a) It toggles when the trigger is clicked.
  b) It closes when you click outside the component and the trigger is not focused
  c) It can receive an onOpen action that is fired when the component opens.
  d) It can receive an onClose action that is fired when the component closes.
  e) It can receive an onFocus action that is fired when the trigger gets the focus.
  f) It can receive an onKeyDown action that is fired when a key is pressed while the trigger is focused.
  g) It can be opened by firing a custom 'dropdown:open' event.
  h) It can be closeed by firing a custom 'dropdown:close' event.
  i) It can be toggleed by firing a custom 'dropdown:toggle' event.
  j) It yields a toggle action that can be used from within the content of the dropdown.
*/

test('It toggles when the trigger is clicked', function(assert) {
  throw new Error('Not implemented');
});

test('It closes when you click outside the component and the trigger is not focuse', function(assert) {
  throw new Error('Not implemented');
});

test('It can receive an onOpen action that is fired when the component opens', function(assert) {
  throw new Error('Not implemented');
});

test('It can receive an onClose action that is fired when the component closes', function(assert) {
  throw new Error('Not implemented');
});

test('It can receive an onFocus action that is fired when the trigger gets the focus', function(assert) {
  throw new Error('Not implemented');
});

test('It can receive an onKeyDown action that is fired when a key is pressed while the trigger is focused', function(assert) {
  throw new Error('Not implemented');
});

test('It can be opened by firing a custom "dropdown:open" event', function(assert) {
  throw new Error('Not implemented');
});

test('It can be closeed by firing a custom "dropdown:close" event', function(assert) {
  throw new Error('Not implemented');
});

test('It can be toggleed by firing a custom "dropdown:toggle" event', function(assert) {
  throw new Error('Not implemented');
});

test('It yields a toggle action that can be used from within the content of the dropdown', function(assert) {
  throw new Error('Not implemented');
});


// test('it renders', function(assert) {
//   assert.expect(2);

//   // Set any properties with this.set('myProperty', 'value');
//   // Handle any actions with this.on('myAction', function(val) { ... });

//   this.render(hbs`{{ember-basic-dropdown}}`);

//   assert.equal(this.$().text().trim(), '');

//   // Template block usage:
//   this.render(hbs`
//     {{#ember-basic-dropdown}}
//       template block text
//     {{/ember-basic-dropdown}}
//   `);

//   assert.equal(this.$().text().trim(), 'template block text');
// });
