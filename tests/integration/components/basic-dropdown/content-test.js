import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';
// import { fireKeydown } from '../../../helpers/ember-basic-dropdown';
// import run from 'ember-runloop';
// import set from 'ember-metal/set';

moduleForComponent('ember-basic-dropdown', 'Integration | Component | basic-dropdown/content', {
  integration: true
});

test('If the dropdown is open renders the given block in a div with class `ember-basic-dropdown-content`', function(assert) {
  assert.expect(2);
  this.dropdown = { isOpen: true };
  this.render(hbs`
    {{#basic-dropdown/content dropdown=dropdown}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = $('.ember-basic-dropdown-content');
  assert.equal($content.text().trim(), 'Lorem ipsum', 'It contains the given block');
  assert.equal($content.parent()[0].id, 'ember-testing', 'It is rendered in the #ember-testing div');
});

test('If the dropdown is closed, nothing is rendered', function(assert) {
  assert.expect(1);
  this.dropdown = { isOpen: false };
  this.render(hbs`
    {{#basic-dropdown/content dropdown=dropdown}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = $('.ember-basic-dropdown-content');
  assert.equal($content.length, 0, 'Nothing is rendered');
});

test('If it receives `renderInPlace=true`, it is rendered right here instead of elsewhere', function(assert) {
  assert.expect(2);
  this.dropdown = { isOpen: true };
  this.render(hbs`
    {{#basic-dropdown/content dropdown=dropdown renderInPlace=true}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = this.$('.ember-basic-dropdown-content');
  assert.equal($content.length, 1, 'It is rendered in the spot');
  assert.notEqual($content.parent()[0].id, 'ember-testing', 'It isn\'t rendered in the #ember-testing div');
});

test('If it receives `to="foo123"`, it is rendered in the element with that ID', function(assert) {
  assert.expect(2);
  this.dropdown = { isOpen: true };
  this.render(hbs`
    <div id="foo123"></div>
    {{#basic-dropdown/content dropdown=dropdown to="foo123"}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = this.$('#foo123 .ember-basic-dropdown-content');
  assert.equal($content.length, 1, 'It is rendered');
  assert.equal($content.parent()[0].id, 'foo123', 'It is rendered in the element with the given ID');
});

test('If it receives `dropdownId="foo123"`, the rendered content will have that ID', function(assert) {
  assert.expect(1);
  this.dropdown = { isOpen: true };
  this.render(hbs`
    {{#basic-dropdown/content dropdown=dropdown elementId="foo123"}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = $('.ember-basic-dropdown-content');
  assert.equal($content.attr('id'), 'foo123', 'contains the expected ID');
});

test('If it receives `class="foo123"`, the rendered content will have that class along with the default one', function(assert) {
  assert.expect(1);
  this.dropdown = { isOpen: true };
  this.render(hbs`
    {{#basic-dropdown/content dropdown=dropdown class="foo123"}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = $('.ember-basic-dropdown-content.foo123');
  assert.equal($content.length, 1, 'The dropdown contains that class');
});