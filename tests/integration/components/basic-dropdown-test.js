import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

var lastDeprecationMsg;
Ember.Debug.registerDeprecationHandler(function(message, options, next) {
  lastDeprecationMsg = message;
  next(message, options);
});

moduleForComponent('ember-basic-dropdown', 'Integration | Component | basic dropdown', {
  integration: true,
  beforeEach() {
    lastDeprecationMsg = null;
  }
});

test('It toggles when the trigger is clicked and focuses the trigger', function(assert) {
  assert.expect(5);

  this.render(hbs`
    {{#basic-dropdown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  assert.equal(this.$('.ember-basic-dropdown').length, 1, 'Is rendered');
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').trigger('mousedown'));
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').trigger('mousedown'));
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown disappeared');
  assert.equal(this.$('.ember-basic-dropdown-trigger')[0], document.activeElement, 'The trigger is focused');
});

test('It closes when you click outside the component and the trigger is not focuse', function(assert) {
  assert.expect(3);

  this.render(hbs`
    <div id="not-the-dropdown"></div>
    {{#basic-dropdown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').trigger('mousedown'));
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
  Ember.run(() => {
    let event = new window.Event('mousedown');
    this.$('#not-the-dropdown')[0].dispatchEvent(event);
  });
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown disappeared');
  assert.notEqual(this.$('.ember-basic-dropdown-trigger')[0], document.activeElement, 'The trigger is not focused');
});

test('It can receive an onOpen action that is fired when the component opens', function(assert) {
  assert.expect(4);

  this.didOpen = function(dropdown, e) {
    assert.ok(dropdown.hasOwnProperty('isOpen'), 'The received dropdown has a `isOpen` property');
    assert.ok(dropdown.hasOwnProperty('actions'), 'The received dropdown has a `actions` property');
    assert.ok(!!e, 'Receives an argument as second argument');
    assert.ok(true, 'onOpen action was invoked');
  };
  this.render(hbs`
    {{#basic-dropdown onOpen=didOpen}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').trigger('mousedown'));
});

test('It can receive an onClose action that is fired when the component closes', function(assert) {
  assert.expect(4);

  this.didClose = function(dropdown, e) {
    assert.ok(dropdown.hasOwnProperty('isOpen'), 'The received dropdown has a `isOpen` property');
    assert.ok(dropdown.hasOwnProperty('actions'), 'The received dropdown has a `actions` property');
    assert.ok(!!e, 'Receives an argument as second argument');
    assert.ok(true, 'onClose action was invoked');
  };
  this.render(hbs`
    {{#basic-dropdown onClose=didClose}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').trigger('mousedown'));
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').trigger('mousedown'));
});

test('It can receive an onFocus action that is fired when the trigger gets the focus', function(assert) {
  var done = assert.async();
  assert.expect(4);

  this.didFocus = function(dropdown, e) {
    assert.ok(dropdown.hasOwnProperty('isOpen'), 'The received dropdown has a `isOpen` property');
    assert.ok(dropdown.hasOwnProperty('actions'), 'The received dropdown has a `actions` property');
    assert.ok(e instanceof(window.Event), 'The second argument is an event');
    assert.ok(true, 'onFocus action was invoked');
    done();
  };
  this.render(hbs`
    {{#basic-dropdown onFocus=didFocus}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
});

test('It can receive an onKeyDown action that is fired when a key is pressed while the trigger is focused', function(assert) {
  assert.expect(3);

  this.didKeydown = function(publicAPI, e) {
    assert.ok(true, 'onKeydown action was invoked');
    assert.equal(e.keyCode, 65, 'it receives the keydown event');
    assert.ok(publicAPI.actions.open && publicAPI.actions.close && publicAPI.actions.toggle && publicAPI.actions.toggle && publicAPI.actions.reposition, 'it receives an object with `open`, `close`, `toggle` and `reposition` functions');
  };

  this.render(hbs`
    {{#basic-dropdown onKeydown=didKeydown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  Ember.run(() => triggerKeydown(this.$('.ember-basic-dropdown-trigger')[0], 65));
});

test('Pressing Enter while the trigger is focused show the content', function(assert) {
  assert.expect(3);

  this.didKeydown = function(/* publicAPI, e */) {
    assert.ok(true, 'onKeydown action was invoked');
  };
  this.render(hbs`
    {{#basic-dropdown onKeydown=didKeydown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  Ember.run(() => triggerKeydown(this.$('.ember-basic-dropdown-trigger')[0], 13));
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
});

test('Pressing Enter while the trigger is focused doesn\'t show the content if the event is default precented in the onKeydown action', function(assert) {
  assert.expect(3);

  this.didKeydown = function(publicAPI, e) {
    assert.ok(true, 'onKeydown action was invoked');
    e.preventDefault();
  };
  this.render(hbs`
    {{#basic-dropdown onKeydown=didKeydown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  Ember.run(() => triggerKeydown(this.$('.ember-basic-dropdown-trigger')[0], 13));
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is still not rendered');
});

test('Pressing ESC while the trigger is focused and the dropdown is opened', function(assert) {
  assert.expect(3);

  this.didKeydown = function(/* publicAPI, e */) {
    assert.ok(true, 'onKeydown action was invoked');
  };
  this.render(hbs`
    {{#basic-dropdown onKeydown=didKeydown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').trigger('mousedown'));
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown is rendered');
  Ember.run(() => triggerKeydown(this.$('.ember-basic-dropdown-trigger')[0], 27));
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
});

test('Pressing ESC while the trigger is focused and the dropdown is opened doesn\'t closes the dropdown if the event is defaultprevented', function(assert) {
  assert.expect(3);

  this.didKeydown = function(publicAPI, e) {
    assert.ok(true, 'onKeydown action was invoked');
    e.preventDefault();
  };
  this.render(hbs`
    {{#basic-dropdown onKeydown=didKeydown}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').trigger('mousedown'));
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown is rendered');
  Ember.run(() => triggerKeydown(this.$('.ember-basic-dropdown-trigger')[0], 27));
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown is still rendered');
});

test('It yields an object with a toggle action that can be used from within the content of the dropdown', function(assert) {
  assert.expect(3);

  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      <h3>Content of the dropdown</h3>
      <span id="click-to-close" onclick={{dropdown.actions.toggle}}></span>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').trigger('mousedown'));
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
  Ember.run(() => $('#click-to-close').click());
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown disappeared');
});

test('It allows to customize the tabindex, but passing `disabled=true` still wins and removes it', function(assert) {
  assert.expect(2);

  this.foo = false;
  this.render(hbs`
    {{#basic-dropdown tabindex=3 disabled=foo as |dropdown|}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('tabindex'), '3', 'Tab index is the given one');
  Ember.run(this, 'set', 'foo', true);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('tabindex'), undefined, 'Tab index is the given one');
});

test('Passing `disabled=true` sets `aria-disabled=true` for a11y', function(assert) {
  assert.expect(2);

  this.foo = true;
  this.render(hbs`
    {{#basic-dropdown disabled=foo as |dropdown|}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-disabled'), 'true', 'The component is marked as disabled');
  Ember.run(this, 'set', 'foo', false);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-disabled'), 'false', 'The component is marked as enabled');
});

test('It toggles when the trigger is clicked BUT doesn\'t focus the trigger if its tabidex is negative', function(assert) {
  assert.expect(5);

  this.render(hbs`
    {{#basic-dropdown tabindex="-1"}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  assert.equal(this.$('.ember-basic-dropdown').length, 1, 'Is rendered');
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').trigger('mousedown'));
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').trigger('mousedown'));
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown disappeared');
  assert.notEqual(this.$('.ember-basic-dropdown-trigger')[0], document.activeElement, 'The trigger is not focused');
});

test('It adds the proper class when a specific vertical position is given', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#basic-dropdown verticalPosition="above"}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').trigger('mousedown'));
  assert.ok(this.$('.ember-basic-dropdown').hasClass('ember-basic-dropdown--above'), 'The proper class has been added');
});

test('It adds the proper class when a specific horizontal position is given', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#basic-dropdown horizontalPosition="right"}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').trigger('mousedown'));
  assert.ok(this.$('.ember-basic-dropdown').hasClass('ember-basic-dropdown--right'), 'The proper class has been added');
});

test('It can be rendered already when the `opened=true`', function(assert) {
  assert.expect(1);

  this.opened = true;
  this.render(hbs`
    {{#basic-dropdown opened=true}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The dropdown is opened');
});

test('It opened and closed by toggling the property passed to `opened`', function(assert) {
  assert.expect(3);

  this.opened = false;
  this.render(hbs`
    {{#basic-dropdown opened=opened}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The dropdown is closed');
  Ember.run(() => this.set('opened', true));
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The dropdown is opened');
  Ember.run(() => this.set('opened', false));
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The dropdown is again');
});

test('When the dropdown is opened and closed normally and the passed `opened` property is mutable, it gets mutated too', function(assert) {
  assert.expect(5);

  this.opened = false;
  this.render(hbs`
    {{#basic-dropdown opened=opened}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The dropdown is closed');
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').trigger('mousedown'));
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The dropdown is opened');
  assert.ok(this.get('opened'), 'The local property has been updated');
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').trigger('mousedown'));
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The dropdown is again');
  assert.ok(!this.get('opened'), 'The local property has been updated again');
});

test('Calling the `open` method while the dropdown is already opened does not call `onOpen` action', function(assert) {
  assert.expect(1);
  let onOpenCalls = 0;
  this.onFocus = (dropdown) => {
    dropdown.actions.open();
    dropdown.actions.open();
  };
  this.onOpen = () => {
    onOpenCalls++;
  };

  this.render(hbs`
    {{#basic-dropdown onFocus=onFocus onOpen=onOpen}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  assert.equal(onOpenCalls, 1, 'onOpen has been called only once');
});

test('Calling the `close` method while the dropdown is already opened does not call `onOpen` action', function(assert) {
  assert.expect(1);
  let onCloseCalls = 0;
  this.onFocus = (dropdown) => {
    dropdown.actions.close();
  };
  this.onClose = () => {
    onCloseCalls++;
  };

  this.render(hbs`
    {{#basic-dropdown onFocus=onFocus onClose=onClose}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  assert.equal(onCloseCalls, 0, 'onClose has been called only once');
});

test('It supports setting the aria-labelledby property', function(assert) {
  this.render(hbs`
    {{#basic-dropdown ariaLabelledBy="foo123"}} {{else}} {{/basic-dropdown}}`);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-labelledby'), 'foo123');
});

test('It supports setting the aria-describedby property', function(assert) {
  this.render(hbs`
    {{#basic-dropdown ariaDescribedBy="foo123"}} {{else}} {{/basic-dropdown}}`);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-describedby'), 'foo123');
});

test('It supports setting the aria-required property', function(assert) {
  this.render(hbs`
    {{#basic-dropdown ariaRequired=true}} {{else}} {{/basic-dropdown}}`);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-required'), 'true');
});

test('It supports setting the aria-invalid property', function(assert) {
  this.render(hbs`
    {{#basic-dropdown ariaInvalid=true}} {{else}} {{/basic-dropdown}}`);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-invalid'), 'true');
});

test('It supports setting the role property', function(assert) {
  this.render(hbs`
    {{#basic-dropdown role="listbox"}} {{else}} {{/basic-dropdown}}`);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('role'), 'listbox');
});

test('BUGFIX: The mousedown event that opens the dropdown is default prevented to avoid select a range of text if the user moves the finger before the mouseup', function(assert) {
  assert.expect(1);

  this.onOpen = (dropdown, event) => {
    assert.ok(event.defaultPrevented, 'The mousedown that opened the select is default prevented');
  };

  this.render(hbs`
    {{#basic-dropdown onOpen=onOpen}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  Ember.run(() => {
    let event = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
    this.$('.ember-basic-dropdown-trigger')[0].dispatchEvent(event);
  });
});

test('The trigger can be customized with custom id and class', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#basic-dropdown triggerClass="foo-class" triggerId="foo-id"}}
      <h3>Content of the dropdown</h3>
    {{else}}
      <button>Press me</button>
    {{/basic-dropdown}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.ok($trigger.hasClass('foo-class'), 'The trigger has the given class');
  assert.equal($trigger.attr('id'), 'foo-id', 'The trigger has the given id');
});

function triggerKeydown(domElement, k) {
  var oEvent = document.createEvent("Events");
  oEvent.initEvent('keydown', true, true);
  $.extend(oEvent, {
    view: window,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    keyCode: k,
    charCode: k
  });

  domElement.dispatchEvent(oEvent);
}
