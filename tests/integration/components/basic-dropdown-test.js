import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import { clickTrigger, tapTrigger } from '../../helpers/ember-basic-dropdown';

var lastDeprecationMsg;
Ember.Debug.registerDeprecationHandler(function(message, options, next) {
  lastDeprecationMsg = message;
  next(message, options);
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

moduleForComponent('ember-basic-dropdown', 'Integration | Component | basic dropdown', {
  integration: true,
  beforeEach() {
    lastDeprecationMsg = null;
  }
});

test('It toggles when the trigger is clicked and focuses the trigger', function(assert) {
  assert.expect(5);

  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger tagName="button"}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  assert.equal(this.$('.ember-basic-dropdown-trigger').length, 1, 'Is rendered');
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  clickTrigger();
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
  clickTrigger();
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown disappeared');



  // TODO: Not sure if this is relevant
  // assert.equal(this.$('.ember-basic-dropdown-trigger')[0], document.activeElement, 'The trigger is focused');
});

test('It closes when you click outside the component', function(assert) {
  assert.expect(2);

  this.render(hbs`
    <div id="not-the-dropdown"></div>
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
  Ember.run(() => {
    let event = new window.Event('mousedown');
    this.$('#not-the-dropdown')[0].dispatchEvent(event);
  });
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown disappeared');
});

test('It can receive an onOpen action that is fired just before the component opens', function(assert) {
  assert.expect(4);

  this.willOpen = function(dropdown, e) {
    assert.equal(dropdown.isOpen, false, 'The received dropdown has a `isOpen` property that is still false');
    assert.ok(dropdown.hasOwnProperty('actions'), 'The received dropdown has a `actions` property');
    assert.ok(!!e, 'Receives an argument as second argument');
    assert.ok(true, 'onOpen action was invoked');
  };
  this.render(hbs`
    {{#basic-dropdown onOpen=willOpen as |dropdown|}}
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
});

test('returning false from the `onOpen` action prevents the dropdown from opening', function(assert) {
  assert.expect(1);

  this.willOpen = function() {
    return false;
  };
  this.render(hbs`
    {{#basic-dropdown onOpen=willOpen as |dropdown|}}
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The dropdown is still closed');
});

test('It can receive an onClose action that is fired when the component closes', function(assert) {
  assert.expect(7);

  this.willClose = function(dropdown, e) {
    assert.equal(dropdown.isOpen, true, 'The received dropdown has a `isOpen` property and its value is `true`');
    assert.ok(dropdown.hasOwnProperty('actions'), 'The received dropdown has a `actions` property');
    assert.ok(!!e, 'Receives an argument as second argument');
    assert.ok(true, 'onClose action was invoked');
  };
  this.render(hbs`
    {{#basic-dropdown onClose=willClose as |dropdown|}}
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The dropdown is closed');
  clickTrigger();
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The dropdown is opened');
  clickTrigger();
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The dropdown is now opened');
});

test('returning false from the `onClose` action prevents the dropdown from closing', function(assert) {
  assert.expect(3);

  this.willClose = function() {
    return false;
  };
  this.render(hbs`
    {{#basic-dropdown onClose=willClose as |dropdown|}}
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The dropdown is closed');
  clickTrigger();
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The dropdown is opened');
  clickTrigger();
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The dropdown is still opened');
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
    {{#basic-dropdown onFocus=didFocus as |dropdown|}}
      {{#dropdown.trigger tagName="button"}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger')[0].focus());
});

test('It can receive an onMouseEnter action that is fired when the trigger is entered with the mouse', function(assert) {
  var done = assert.async();
  assert.expect(4);

  this.didMouseEnter = function(dropdown, e) {
    assert.ok(dropdown.hasOwnProperty('isOpen'), 'The received dropdown has a `isOpen` property');
    assert.ok(dropdown.hasOwnProperty('actions'), 'The received dropdown has a `actions` property');
    assert.ok(e instanceof(window.Event), 'The second argument is an event');
    assert.ok(true, 'onMouseEnter action was invoked');
    done();
  };
  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger onMouseEnter=didMouseEnter}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger')[0].dispatchEvent(new window.Event('mouseenter', { bubbles: true, cancelable: true, view: window })));
});

test('It can receive an onMouseLeave action that is fired when the trigger is entered with the mouse', function(assert) {
  var done = assert.async();
  assert.expect(4);

  this.didMouseLeave = function(dropdown, e) {
    assert.ok(dropdown.hasOwnProperty('isOpen'), 'The received dropdown has a `isOpen` property');
    assert.ok(dropdown.hasOwnProperty('actions'), 'The received dropdown has a `actions` property');
    assert.ok(e instanceof(window.Event), 'The second argument is an event');
    assert.ok(true, 'onMouseLeave action was invoked');
    done();
  };
  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger onMouseLeave=didMouseLeave}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  Ember.run(() => {
    let event = new window.Event('mouseleave', { bubbles: true, cancelable: true, view: window });
    this.$('.ember-basic-dropdown-trigger')[0].dispatchEvent(event);
  });
});

test('It can receive an onKeyDown action that is fired when a key is pressed while the trigger is focused', function(assert) {
  assert.expect(5);

  this.didKeydown = function(publicAPI, e) {
    assert.ok(true, 'onKeydown action was invoked');
    assert.equal(e.keyCode, 65, 'it receives the keydown event');
    assert.equal(typeof publicAPI.actions.open, 'function');
    assert.equal(typeof publicAPI.actions.close, 'function');
    assert.equal(typeof publicAPI.actions.toggle, 'function');

    // TODO: Reposition is part of the public API now?
    // assert.equal(typeof publicAPI.actions.reposition, 'function');
  };

  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger onKeydown=didKeydown}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
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
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger onKeydown=didKeydown}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  Ember.run(() => triggerKeydown(this.$('.ember-basic-dropdown-trigger')[0], 13));
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
});

test('Pressing Enter while the trigger is focused doesn\'t show the content if the onKeydown action returns false', function(assert) {
  assert.expect(3);

  this.didKeydown = function() {
    assert.ok(true, 'onKeydown action was invoked');
    return false;
  };
  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger onKeydown=didKeydown}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  Ember.run(() => triggerKeydown(this.$('.ember-basic-dropdown-trigger')[0], 13));
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is still not rendered');
});

test('Pressing Space while the trigger is focused show the content', function(assert) {
  assert.expect(3);

  this.didKeydown = function(/* publicAPI, e */) {
    assert.ok(true, 'onKeydown action was invoked');
  };
  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger onKeydown=didKeydown}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  Ember.run(() => triggerKeydown(this.$('.ember-basic-dropdown-trigger')[0], 32)); // Space
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
});

test('Pressing Space while the trigger is focused doesn\'t show the content if the onKeydown action returns false', function(assert) {
  assert.expect(3);

  this.didKeydown = function() {
    assert.ok(true, 'onKeydown action was invoked');
    return false;
  };
  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger onKeydown=didKeydown}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  Ember.run(() => triggerKeydown(this.$('.ember-basic-dropdown-trigger')[0], 32)); // Space
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is still not rendered');
});

test('Pressing ESC while the trigger is focused and the dropdown is opened closes the component', function(assert) {
  assert.expect(3);

  this.didKeydown = function(/* publicAPI, e */) {
    assert.ok(true, 'onKeydown action was invoked');
  };
  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger onKeydown=didKeydown}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown is rendered');
  Ember.run(() => triggerKeydown(this.$('.ember-basic-dropdown-trigger')[0], 27));
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
});

test('Pressing ESC while the trigger is focused and the dropdown is opened doesn\'t closes the dropdown the onKeydown action returns false', function(assert) {
  assert.expect(3);

  this.didKeydown = function() {
    assert.ok(true, 'onKeydown action was invoked');
    return false;
  };
  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger onKeydown=didKeydown}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown is rendered');
  Ember.run(() => triggerKeydown(this.$('.ember-basic-dropdown-trigger')[0], 27));
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown is still rendered');
});

test('It yields an object with a toggle action that can be used from within the block', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      <button id="dropdown-test-button" onclick={{dropdown.actions.toggle}}>Click me</button>
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  // clickTrigger();
  Ember.run(() => {
    let event = new window.Event('click');
    $('#dropdown-test-button')[0].dispatchEvent(event);
  });
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
});

test('It allows to customize the tabindex, but passing `disabled=true` still wins and removes it', function(assert) {
  assert.expect(2);

  this.foo = false;
  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger tabIndex=3 disabled=foo}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('tabindex'), '3', 'Tab index is the given one');
  Ember.run(this, 'set', 'foo', true);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('tabindex'), '-1', 'Tab index is -1');
});

test('Passing `disabled=true` sets `aria-disabled=true` for a11y', function(assert) {
  assert.expect(2);

  this.foo = true;
  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger disabled=foo}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-disabled'), 'true', 'The component is marked as disabled');
  Ember.run(this, 'set', 'foo', false);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-disabled'), 'false', 'The component is marked as enabled');
});

test('Passing a string to `ariaLabel` sets `aria-label` on the trigger', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger ariaLabel="ariaLabelString"}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-label'), 'ariaLabelString', 'The trigger DOM element has the correct `aria-label`');
});

test('It toggles when the trigger is clicked', function(assert) {
  assert.expect(3);

  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
  clickTrigger();
  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
  clickTrigger();
  assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown disappeared');
});

test('It can be rendered already opened when the `initiallyOpened=true`', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#basic-dropdown initiallyOpened=true as |dropdown|}}
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  assert.equal($('.ember-basic-dropdown-content').length, 1, 'The dropdown is opened');
});

test('Calling the `open` method while the dropdown is already opened does not call `onOpen` action', function(assert) {
  assert.expect(1);
  let onOpenCalls = 0;
  this.onFocus = (dropdown, e) => {
    dropdown.actions.open(e);
    dropdown.actions.open(e);
  };
  this.onOpen = () => {
    onOpenCalls++;
  };

  this.render(hbs`
    {{#basic-dropdown onOpen=onOpen as |dropdown|}}
      {{#dropdown.trigger onFocus=onFocus}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
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
    {{#basic-dropdown onClose=onClose as |dropdown|}}
      {{#dropdown.trigger onFocus=onFocus}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);
  Ember.run(() => this.$('.ember-basic-dropdown-trigger').focus());
  assert.equal(onCloseCalls, 0, 'onClose has been called only once');
});

test('It supports setting the aria-labelledby property', function(assert) {
  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger ariaLabelledBy="foo123"}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-labelledby'), 'foo123');
});

test('It supports setting the aria-describedby property', function(assert) {
  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger ariaDescribedBy="foo123"}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-describedby'), 'foo123');
});

test('It supports setting the aria-required property', function(assert) {
  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger ariaRequired=true}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-required'), 'true');
});

test('It has a aria-haspopup property', function(assert) {
  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-haspopup'), 'true');
});

test('It has `aria-expanded=true` and `aria-pressed=true` when it is open', function(assert) {
  assert.expect(4);
  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-expanded'), 'false');
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-pressed'), 'false');
  clickTrigger();
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-expanded'), 'true');
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-pressed'), 'true');
});

test('It supports setting the aria-invalid property', function(assert) {
  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger ariaInvalid=true}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-invalid'), 'true');
});

// test('The default role of the trigger is button', function(assert) {
//   this.render(hbs`{{#basic-dropdown}} {{else}} {{/basic-dropdown}}`);
//   assert.equal(this.$('.ember-basic-dropdown-trigger').attr('role'), 'button');
// });

// test('It supports setting the role property', function(assert) {
//   this.render(hbs`{{#basic-dropdown role="listbox"}} {{else}} {{/basic-dropdown}}`);
//   assert.equal(this.$('.ember-basic-dropdown-trigger').attr('role'), 'listbox');
// });

// test('It adds the proper class when `horizontalPosition=right` is given', function(assert) {
//   assert.expect(1);

//   this.render(hbs`
//     {{#basic-dropdown verticalPosition="above"}}
//       <h3>Content of the dropdown</h3>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   clickTrigger();
//   assert.ok(this.$('.ember-basic-dropdown').hasClass('ember-basic-dropdown--above'), 'The proper class has been added');
// });

// test('It adds the proper class when `horizontalPosition=center` is given', function(assert) {
//   assert.expect(1);

//   this.render(hbs`
//     {{#basic-dropdown horizontalPosition="center"}}
//       <h3>Content of the dropdown</h3>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   clickTrigger();
//   assert.ok(this.$('.ember-basic-dropdown').hasClass('ember-basic-dropdown--center'), 'The proper class has been added');
// });

// test('BUGFIX: When clicking in the trigger text selection is disabled until the user raises the finger', function(assert) {
//   assert.expect(2);

//   this.render(hbs`
//     {{#basic-dropdown onOpen=onOpen}}
//       <h3>Content of the dropdown</h3>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   Ember.run(() => {
//     let event = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
//     this.$('.ember-basic-dropdown-trigger')[0].dispatchEvent(event);
//   });
//   assert.equal($('#ember-testing').css('user-select'), 'none', 'Text selection is disabled in the entire app');
//   Ember.run(() => {
//     let event = new window.Event('mouseup', { bubbles: true, cancelable: true, view: window });
//     this.$('.ember-basic-dropdown-trigger')[0].dispatchEvent(event);
//   });
//   assert.notEqual($('#ember-testing').css('user-select'), 'none', 'Text selection is not disabled in the entire app');
// });

// test('The trigger can be customized with custom id and class', function(assert) {
//   assert.expect(2);

//   this.render(hbs`
//     {{#basic-dropdown triggerClass="foo-class" triggerId="foo-id"}}
//       <h3>Content of the dropdown</h3>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   let $trigger = this.$('.ember-basic-dropdown-trigger');
//   assert.ok($trigger.hasClass('foo-class'), 'The trigger has the given class');
//   assert.equal($trigger.attr('id'), 'foo-id', 'The trigger has the given id');
// });

// test('The content of the dropdown has a unique ID and the trigger has `aria-controls=that-id`', function(assert) {
//   assert.expect(2);

//   this.render(hbs`
//     {{#basic-dropdown}}
//       <h3>Content of the dropdown</h3>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   clickTrigger();
//   let dropdownId = $('.ember-basic-dropdown-content').attr('id');
//   assert.ok(dropdownId.match(/^ember-basic-dropdown-content-ember\d+$/), 'The dropdown has a unique id');
//   let $trigger = this.$('.ember-basic-dropdown-trigger');
//   assert.equal($trigger.attr('aria-controls'), dropdownId, 'The trigger aria-owns=<id-of-the-dropdown-content>');
// });

// test('in touch devices it can be opened and closed taping on the trigger', function(assert) {
//   assert.expect(5);

//   this.render(hbs`
//     {{#basic-dropdown isTouchDevice=true}}
//       <h3>Content of the dropdown</h3>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   assert.equal(this.$('.ember-basic-dropdown').length, 1, 'Is rendered');
//   assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
//   tapTrigger();
//   assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the dropdown appeared');
//   tapTrigger();
//   assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown disappeared');
//   assert.equal(this.$('.ember-basic-dropdown-trigger')[0], document.activeElement, 'The trigger is focused');
// });

// test('if between the touchstart and touchend there is any touchmove (the user scrolls) the component wont\'t open', function(assert) {
//   assert.expect(3);

//   this.render(hbs`
//     {{#basic-dropdown isTouchDevice=true}}
//       <h3>Content of the dropdown</h3>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   assert.equal(this.$('.ember-basic-dropdown').length, 1, 'Is rendered');
//   assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
//   Ember.run(() => this.$('.ember-basic-dropdown-trigger')[0].dispatchEvent(new window.Event('touchstart', { bubbles: true, cancelable: true, view: window })));
//   Ember.run(() => this.$('.ember-basic-dropdown-trigger')[0].dispatchEvent(new window.Event('touchmove', { bubbles: true, cancelable: true, view: window })));
//   Ember.run(() => this.$('.ember-basic-dropdown-trigger')[0].dispatchEvent(new window.Event('touchend', { bubbles: true, cancelable: true, view: window })));
//   assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown remains closed');
// });

// test('it adds a `ember-basic-dropdown--transitioning-out` when closing if it has transitions', function(assert) {
//   assert.expect(3);

//   this.render(hbs`
//     <style>
//       .fade-dropdown-test-class {
//         transition: opacity .2s;
//         opacity: 0;
//       }
//       .fade-dropdown-test-class.ember-basic-dropdown--transitioned-in {
//         opacity: 1;
//       }
//     </style>
//     {{#basic-dropdown dropdownClass="fade-dropdown-test-class" animationEnabled=true}}
//       <h3>Content of the dropdown</h3>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   clickTrigger();
//   assert.equal($('.ember-basic-dropdown-content').length, 1, 'the dropdown is opened');
//   clickTrigger();
//   assert.equal($('.ember-basic-dropdown-content').length, 1, 'the dropdown is still opened');
//   assert.ok($('.ember-basic-dropdown-content').hasClass('ember-basic-dropdown--transitioning-out'), 'It has the transitioning-out class');
// });

// test('if the option `triggerDisabled` is set to true, the component won\'t respond open or close with mouse/touch events', function(assert) {
//   assert.expect(2);

//   this.render(hbs`
//     {{#basic-dropdown triggerDisabled=true}}
//       <h3>Content of the dropdown</h3>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is not rendered');
//   clickTrigger();
//   assert.equal($('.ember-basic-dropdown-content').length, 0, 'The content of the dropdown is still not rendered');
// });

// test('when some element inside the trigger of a dropdown gains the focus, the dropdown obtains a `ember-basic-dropdown--focus-inside` class', function(assert) {
//   assert.expect(3);

//   this.render(hbs`
//     {{#basic-dropdown}}
//       <input type="text" id="input-inside-dropdown-content"/>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   assert.ok(!$('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown doesn\'t have the focus-inside class yet');
//   clickTrigger();
//   assert.ok(!$('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown doesn\'t have the focus-inside class yet');
//   Ember.run(() => this.$('button')[0].focus());
//   assert.ok($('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown has the focus-inside now');
// });

// test('when some element inside the dropdown-content when the component gets `renderedInPlace=true` gains the focus, the dropdown obtains a `ember-basic-dropdown--focus-inside` class', function(assert) {
//   assert.expect(3);

//   this.render(hbs`
//     {{#basic-dropdown renderedInPlace=true}}
//       <input type="text" id="input-inside-dropdown-content"/>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   assert.ok(!$('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown doesn\'t have the focus-inside class yet');
//   clickTrigger();
//   assert.ok(!$('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown doesn\'t have the focus-inside class yet');
//   Ember.run(() => $('#input-inside-dropdown-content')[0].focus());
//   assert.ok($('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown has the focus-inside now');
// });

// test('when some element inside the dropdown-content when the component gets `renderedInPlace=false` gains the focus, the dropdown obtains a `ember-basic-dropdown--focus-inside` class', function(assert) {
//   assert.expect(3);

//   this.render(hbs`
//     {{#basic-dropdown renderedInPlace=false}}
//       <input type="text" id="input-inside-dropdown-content"/>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   assert.ok(!$('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown doesn\'t have the focus-inside class yet');
//   clickTrigger();
//   assert.ok(!$('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown doesn\'t have the focus-inside class yet');
//   Ember.run(() => $('#input-inside-dropdown-content')[0].focus());
//   assert.ok($('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown has the focus-inside now');
// });

// test('Clicking in the dropdown-content of a nested dropdown doesn\'t close it despite of the element being in the root of the body', function(assert) {
//   assert.expect(4);

//   this.render(hbs`
//     {{#basic-dropdown as |dropdown|}}
//       <p id="first-dd-content">First level of the dropdpwn</p>
//       {{#basic-dropdown as |dropdown|}}
//         <p id="second-dd-content">Second level of the second</p>
//       {{else}}
//         <button>Trigger of the second dropdown</button>
//       {{/basic-dropdown}}
//     {{else}}
//       <button>Trigger of the first dropdown</button>
//     {{/basic-dropdown}}
//   `);

//   clickTrigger();
//   assert.equal($('.ember-basic-dropdown-content').length, 1, 'The content of the first dropdown appeared');
//   clickTrigger('.ember-basic-dropdown-content'); // Click on the trigger inside the second dropdown
//   assert.equal($('.ember-basic-dropdown-content').length, 2, 'The content of the second dropdown appeared');
//   Ember.run(() => {
//     let event = new window.Event('mousedown');
//     $('#second-dd-content')[0].dispatchEvent(event);
//   });
//   assert.equal($('.ember-basic-dropdown-content').length, 2, 'Both dropdowns are still opened');
//   Ember.run(() => {
//     let event = new window.Event('mousedown');
//     $('#first-dd-content')[0].dispatchEvent(event);
//   });
//   assert.equal($('.ember-basic-dropdown-content').length, 1, 'Only the first dropdown remain open');
// });

// // This is commented because this test fails in phantom, probably because of being an ancient version
// // of webkit.
// //
// //
// // test('it adds a `ember-basic-dropdown--transitioning-out` when closing if it has an animation', function(assert) {
// //   assert.expect(3);

// //   this.render(hbs`
// //     <style>
// //       @keyframes grow-bounce {
// //         0% { transform: scale(0); }
// //         70% { transform: scale(1.05); }
// //         90% { transform: scale(0.97); }
// //         100% { transform: scale(1); }
// //       }
// //       @-webkit-keyframes grow-bounce {
// //         0% { transform: scale(0); }
// //         70% { transform: scale(1.05); }
// //         90% { transform: scale(0.97); }
// //         100% { transform: scale(1); }
// //       }
// //       @-webkit-keyframes shrink-bounce {
// //         0% { transform: scale(1); }
// //         10% { transform: scale(0.97); }
// //         30% { transform: scale(1.05); }
// //         100% { transform: scale(0); }
// //       }
// //       @keyframes shrink-bounce {
// //         0% { transform: scale(1); }
// //         10% { transform: scale(0.97); }
// //         30% { transform: scale(1.05); }
// //         100% { transform: scale(0); }
// //       }
// //       .complex-animation-dropdown-test-class {
// //         animation-fill-mode: both;
// //       }
// //       .complex-animation-dropdown-test-class.ember-basic-dropdown--transitioned-in {
// //         animation: grow-bounce .33s;
// //       }
// //       .complex-animation-dropdown-test-class.ember-basic-dropdown--transitioning-out {
// //         animation: shrink-bounce .33s;
// //       }
// //     </style>
// //     {{#basic-dropdown dropdownClass="complex-animation-dropdown-test-class"}}
// //       <h3>Content of the dropdown</h3>
// //     {{else}}
// //       <button>Press me</button>
// //     {{/basic-dropdown}}
// //   `);

// //   clickTrigger();
// //   assert.equal($('.ember-basic-dropdown-content').length, 1, 'the dropdown is opened');
// //   clickTrigger();
// //   assert.equal($('.ember-basic-dropdown-content').length, 1, 'the dropdown is still opened');
// //   assert.ok($('.ember-basic-dropdown-content').hasClass('ember-basic-dropdown--transitioning-out'), 'It has the transitioning-out class');
// // });
