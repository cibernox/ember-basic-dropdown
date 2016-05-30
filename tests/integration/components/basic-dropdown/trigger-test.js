import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { clickTrigger } from '../../../helpers/ember-basic-dropdown';
import run from 'ember-runloop';
import set from 'ember-metal/set';
// import Ember from 'ember';

moduleForComponent('ember-basic-dropdown', 'Integration | Component | basic-dropdown/trigger', {
  integration: true
});

test('It renders the given block in a div with class `basic-dropdown-trigger`, with no wrapper around', function(assert) {
  assert.expect(3);
  this.appRoot = document.querySelector('#ember-testing');
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal(this.$().children()[0], $trigger[0], 'The trigger is not wrapped');
  assert.equal($trigger.length, 1, 'There is one element with `ember-basic-dropdown-trigger`');
  assert.equal($trigger.text(), 'Click me', 'The trigger contains the given block');
});

test('It has a tabindex of 0 by default', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('tabindex'), '0', 'Has a tabindex of 0');
});

test('The tabindex can be overriden passing `tabindex=3`', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot tabindex=3}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('tabindex'), '3', 'Has a tabindex of 3');
});

test('If it receives `disabled=true`, the tabindex is -1 regardless of if it has been customized or not', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot disabled=true tabindex=3}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('tabindex'), '-1', 'Has a tabindex of -1');
});

test('If it receives `disabled=true` it gets an `aria-disabled=true` attribute for a11y', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.disabled = true;
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot disabled=disabled}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('aria-disabled'), 'true', 'It is marked as disabled');
  run(() => this.set('disabled', false));
  assert.equal($trigger.attr('aria-disabled'), 'false', 'It is not disabled anymore');
});

test('If it receives `ariaLabel="foo123"` it gets an `aria-label="foo123"` attribute', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot ariaLabel="foo123"}}Click me{{/basic-dropdown/trigger}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-label'), 'foo123', 'the aria-label is set');
});

test('If it receives `ariaLabelledBy="foo123"` it gets an `aria-labelledby="foo123"` attribute', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot ariaLabelledBy="foo123"}}Click me{{/basic-dropdown/trigger}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-labelledby'), 'foo123', 'the aria-labelledby is set');
});

test('If it receives `ariaDescribedBy="foo123"` it gets an `aria-describedby="foo123"` attribute', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot ariaDescribedBy="foo123"}}Click me{{/basic-dropdown/trigger}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-describedby'), 'foo123', 'the aria-describedby is set');
});

test('If it receives `ariaRequired="true"` it gets an `aria-required="true"` attribute', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.required = true;
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot ariaRequired=required}}Click me{{/basic-dropdown/trigger}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-required'), 'true', 'the aria-required is true');
  run(() => this.set('required', false));
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-required'), 'false', 'the aria-required is false');
});

test('If it receives `ariaInvalid="true"` it gets an `aria-invalid="true"` attribute', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.invalid = true;
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot ariaInvalid=invalid}}Click me{{/basic-dropdown/trigger}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-invalid'), 'true', 'the aria-invalid is true');
  run(() => this.set('invalid', false));
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-invalid'), 'false', 'the aria-invalid is false');
});

test('If the received dropdown is open, it has an `aria-expanded="true"` attribute', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: false };
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-expanded'), 'false', 'the aria-expanded is false');
  run(() => set(this.dropdown, 'isOpen', true));
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-expanded'), 'true', 'the aria-expanded is true');
});

test('If the received dropdown is open, it has an `aria-pressed="true"` attribute', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: false };
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-pressed'), 'false', 'the aria-pressed is false');
  run(() => set(this.dropdown, 'isOpen', true));
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-pressed'), 'true', 'the aria-pressed is true');
});

test('It has `aria-haspopup=true`', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot}}Click me{{/basic-dropdown/trigger}}
  `);
  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('aria-haspopup'), 'true', 'Has `aria-haspopup=true`');
});

// test('Clicking invokes the `toggle` action on the dropdown', function(assert) {
//   assert.expect(2);
//   this.appRoot = document.querySelector('#ember-testing');
//   this.dropdown = {
//     actions: {
//       toggle(e) {
//         assert.ok(true, 'The `toggle()` action has been fired');
//         assert.ok(e instanceof Event && arguments.length === 1, 'It receives the event as first and only argument');
//       }
//     }
//   };
//   this.render(hbs`
//     {{#basic-dropdown/trigger appRoot=appRoot dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
//   `);
//   clickTrigger();
// });