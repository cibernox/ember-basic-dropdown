import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';
import { clickTrigger } from '../../helpers/ember-basic-dropdown';

let deprecations = [];
const { run } = Ember;

Ember.Debug.registerDeprecationHandler((message, options, next) => {
  deprecations.push(message);
  next(message, options);
});

moduleForComponent('ember-basic-dropdown', 'Integration | Component | basic dropdown', {
  integration: true,
  beforeEach() {
    deprecations = [];
  }
});

test('Its `toggle` action opens and closes the dropdown', function(assert) {
  assert.expect(3);

  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.toggle}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);

  assert.equal(this.$('#dropdown-is-opened').length, 0, 'The dropdown is closed');
  clickTrigger();
  assert.equal(this.$('#dropdown-is-opened').length, 1, 'The dropdown is opened');
  clickTrigger();
  assert.equal(this.$('#dropdown-is-opened').length, 0, 'The dropdown is again');

  // TODO: Not sure if this is relevant
  // assert.equal(this.$('.ember-basic-dropdown-trigger')[0], document.activeElement, 'The trigger is focused');
});

test('Its `open` action opens the dropdown', function(assert) {
  assert.expect(3);

  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.open}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);

  assert.equal(this.$('#dropdown-is-opened').length, 0, 'The dropdown is closed');
  clickTrigger();
  assert.equal(this.$('#dropdown-is-opened').length, 1, 'The dropdown is opened');
  clickTrigger();
  assert.equal(this.$('#dropdown-is-opened').length, 1, 'The dropdown is still opened');
});

test('Its `close` action closes the dropdown', function(assert) {
  assert.expect(3);

  this.render(hbs`
    {{#basic-dropdown initiallyOpened=true as |dropdown|}}
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.close}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);

  assert.equal(this.$('#dropdown-is-opened').length, 1, 'The dropdown is opened');
  clickTrigger();
  assert.equal(this.$('#dropdown-is-opened').length, 0, 'The dropdown is closed');
  clickTrigger();
  assert.equal(this.$('#dropdown-is-opened').length, 0, 'The dropdown is still closed');
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
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.open}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
});

test('returning false from the `onOpen` action prevents the dropdown from opening', function(assert) {
  assert.expect(2);

  this.willOpen = function() {
    assert.ok(true, 'willOpen has been called');
    return false;
  };
  this.render(hbs`
    {{#basic-dropdown onOpen=willOpen as |dropdown|}}
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.open}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
  assert.equal(this.$('#dropdown-is-opened').length, 0, 'The dropdown is still closed');
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
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.toggle}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);

  assert.equal($('#dropdown-is-opened').length, 0, 'The dropdown is closed');
  clickTrigger();
  assert.equal($('#dropdown-is-opened').length, 1, 'The dropdown is opened');
  clickTrigger();
  assert.equal($('#dropdown-is-opened').length, 0, 'The dropdown is now opened');
});

test('returning false from the `onClose` action prevents the dropdown from closing', function(assert) {
  assert.expect(4);

  this.willClose = function() {
    assert.ok(true, 'willClose has been invoked');
    return false;
  };
  this.render(hbs`
    {{#basic-dropdown onClose=willClose as |dropdown|}}
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.toggle}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);

  assert.equal($('#dropdown-is-opened').length, 0, 'The dropdown is closed');
  clickTrigger();
  assert.equal($('#dropdown-is-opened').length, 1, 'The dropdown is opened');
  clickTrigger();
  assert.equal($('#dropdown-is-opened').length, 1, 'The dropdown is still opened');
});

test('It can be rendered already opened when the `initiallyOpened=true`', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#basic-dropdown initiallyOpened=true as |dropdown|}}
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);

  assert.equal($('#dropdown-is-opened').length, 1, 'The dropdown is opened');
});

test('Calling the `open` method while the dropdown is already opened does not call `onOpen` action', function(assert) {
  assert.expect(1);
  let onOpenCalls = 0;
  this.onOpen = () => {
    onOpenCalls++;
  };
  this.render(hbs`
    {{#basic-dropdown onOpen=onOpen as |dropdown|}}
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.open}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);
  clickTrigger();
  clickTrigger();
  clickTrigger();
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
      <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.close}}></button>
      {{#if dropdown.isOpen}}
        <div id="dropdown-is-opened"></div>
      {{/if}}
    {{/basic-dropdown}}
  `);
  clickTrigger();
  clickTrigger();
  clickTrigger();
  assert.equal(onCloseCalls, 0, 'onClose was never called');
});

// Fails in phantomjs, I don't know why
// test('Clicking anywhere outside the trigger or the content, closes the dropdown but DOES NOT focus the trigger', function(assert) {
//   assert.expect(2);

//   this.render(hbs`
//     <input id="external-input-test" />
//     {{#basic-dropdown renderInPlace=true as |dropdown|}}
//       {{#dropdown.trigger tagName="input"}}Click me{{/dropdown.trigger}}
//       {{#dropdown.content}}<div id="dropdown-is-opened"></div>{{/dropdown.content}}
//     {{/basic-dropdown}}
//   `);

//   clickTrigger();
//   let trigger = this.$('.ember-basic-dropdown-trigger').get(0);
//   run(() => trigger.focus());
//   assert.ok(trigger === document.activeElement, 'The trigger is focused');
//   nativeClick('#external-input-test');
//   assert.ok(trigger !== document.activeElement, 'The trigger is not focused');
// });

test('It adds the proper class to trigger and content when it receives `horizontalPosition="right"`', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#basic-dropdown horizontalPosition="right" as |dropdown|}}
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
  assert.ok(this.$('.ember-basic-dropdown-trigger').hasClass('ember-basic-dropdown-trigger--right'), 'The proper class has been added');
  assert.ok($('.ember-basic-dropdown-content').hasClass('ember-basic-dropdown-content--right'), 'The proper class has been added');
});

test('It adds the proper class to trigger and content when it receives `horizontalPosition="center"`', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#basic-dropdown horizontalPosition="center" as |dropdown|}}
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
  assert.ok(this.$('.ember-basic-dropdown-trigger').hasClass('ember-basic-dropdown-trigger--center'), 'The proper class has been added');
  assert.ok($('.ember-basic-dropdown-content').hasClass('ember-basic-dropdown-content--center'), 'The proper class has been added');
});

test('It adds the proper class to trigger and content when it receives `verticalPosition="above"`', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#basic-dropdown verticalPosition="above" as |dropdown|}}
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
  assert.ok(this.$('.ember-basic-dropdown-trigger').hasClass('ember-basic-dropdown-trigger--above'), 'The proper class has been added');
  assert.ok($('.ember-basic-dropdown-content').hasClass('ember-basic-dropdown-content--above'), 'The proper class has been added');
});

test('It passes the `renderInPlace` property to the yielded content component', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#basic-dropdown renderInPlace=true as |dropdown|}}
      {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
      {{#dropdown.content}}<div id="dropdown-is-opened"></div>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
  assert.equal(this.$('.ember-basic-dropdown-content').length, 1, 'The dropdown is rendered in place');
});

test('It adds a special class to both trigger and content when `renderInPlace=true`', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#basic-dropdown renderInPlace=true as |dropdown|}}
      {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
      {{#dropdown.content}}<div id="dropdown-is-opened"></div>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
  assert.ok(this.$('.ember-basic-dropdown-trigger').hasClass('ember-basic-dropdown-trigger--in-place'), 'The trigger has a special `--in-place` class');
  assert.ok(this.$('.ember-basic-dropdown-content').hasClass('ember-basic-dropdown-content--in-place'), 'The content has a special `--in-place` class');
});

test('It adds a wrapper element when `renderInPlace=true`', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#basic-dropdown renderInPlace=true as |dropdown|}}
      {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
      {{#dropdown.content}}<div id="dropdown-is-opened"></div>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
  assert.equal(this.$('.ember-basic-dropdown').length, 1, 'The trigger has a special `--in-place` class');
});

test('[ISSUE #127] Having more than one dropdown with `renderInPlace=true` raises an exception', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#basic-dropdown renderInPlace=true as |dropdown|}}{{/basic-dropdown}}
    {{#basic-dropdown renderInPlace=true as |dropdown|}}{{/basic-dropdown}}
  `);

  assert.ok(true, 'The test has run without errors');
});

test('It passes the `disabled` property as part of the public API, and updates is if it changes', function(assert) {
  assert.expect(2);
  this.disabled = true;
  this.render(hbs`
    {{#basic-dropdown disabled=disabled as |dropdown|}}
      {{#if dropdown.disabled}}
        <div id="disabled-dropdown-marker">Disabled!</div>
      {{else}}
        <div id="enabled-dropdown-marker">Enabled!</div>
      {{/if}}
    {{/basic-dropdown}}
  `);

  assert.equal(this.$('#disabled-dropdown-marker').length, 1, 'The public API of the component is marked as disabled');
  this.set('disabled', false);
  assert.equal(this.$('#enabled-dropdown-marker').length, 1, 'The public API of the component is marked as enabled');
});

test('It passes the `uniqueId` property as part of the public API', function(assert) {
  assert.expect(1);
  this.disabled = true;
  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      <div id="dropdown-unique-id-container">{{dropdown.uniqueId}}</div>
    {{/basic-dropdown}}
  `);

  assert.ok(/ember\d+/.test(this.$('#dropdown-unique-id-container').text().trim()), 'It yields the uniqueId');
});

test('If the dropdown gets disabled while it\'s open, it closes automatically', function(assert) {
  assert.expect(2);

  this.isDisabled = false;
  this.render(hbs`
    {{#basic-dropdown disabled=isDisabled as |dropdown|}}
      {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
      {{#dropdown.content}}<div id="dropdown-is-opened"></div>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
  assert.equal($('#dropdown-is-opened').length, 1, 'The select is open');
  run(() => this.set('isDisabled', true));
  assert.equal($('#dropdown-is-opened').length, 0, 'The select is now closed');
});

test('If the component\'s `disabled` property changes, the `registerAPI` action is called', function(assert) {
  assert.expect(3);

  this.isDisabled = false;
  this.toggleDisabled = () => this.toggleProperty('isDisabled');
  this.registerAPI = (api) => run.scheduleOnce('actions', this, this.set, 'remoteController', api);
  this.render(hbs`
    {{#basic-dropdown disabled=isDisabled registerAPI=(action registerAPI) as |dropdown|}}
      {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
    {{/basic-dropdown}}
    <button onclick={{action toggleDisabled}}>Toggle</button>
    {{#if remoteController.disabled}}
      <div id="is-disabled"></div>
    {{/if}}
  `);

  clickTrigger();
  assert.equal($('#is-disabled').length, 0, 'The select is enabled');
  run(() => this.set('isDisabled', true));
  assert.equal($('#is-disabled').length, 1, 'The select is disabled');
  run(() => this.set('isDisabled', false));
  assert.equal($('#is-disabled').length, 0, 'The select is enabled again');
});

// A11y
test('By default, the `aria-controls` attribute of the trigger contains the id of the content', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#basic-dropdown renderInPlace=true as |dropdown|}}
      {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
      {{#dropdown.content}}<div id="dropdown-is-opened"></div>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);
  clickTrigger();
  let $trigger = this.$('.ember-basic-dropdown-trigger');
  let $content = $('.ember-basic-dropdown-content');
  assert.equal($trigger.attr('aria-controls'), $content.attr('id'), 'The trigger controls the content');
});

// Repositioning
test('Firing a reposition outside of a runloop doesn\'t break the component', function(assert) {
  let done = assert.async();
  assert.expect(1);
  this.render(hbs`
    {{#basic-dropdown as |dropdown|}}
      {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
      {{#dropdown.content}}
        <div id="dropdown-is-opened"></div>
      {{/dropdown.content}}
    {{/basic-dropdown}}
  `);
  clickTrigger();
  $('#dropdown-is-opened').append('<span>New content that will trigger a reposition</span>');
  setTimeout(function() {
    assert.equal(deprecations.length, 0, 'No deprecation warning was raised');
    done();
  }, 100);
});

test('The `reposition` public action returns an object with the changes', function(assert) {
  assert.expect(4);
  let remoteController;
  this.saveAPI = (api) => remoteController = api;
  this.render(hbs`
    {{#basic-dropdown registerAPI=(action saveAPI) as |dropdown|}}
      {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
      {{#dropdown.content}}
        <div id="dropdown-is-opened"></div>
      {{/dropdown.content}}
    {{/basic-dropdown}}
  `);
  let returnValue;
  clickTrigger();

  run(() => {
    returnValue = remoteController.actions.reposition();
  });
  assert.ok(returnValue.hasOwnProperty('hPosition'));
  assert.ok(returnValue.hasOwnProperty('vPosition'));
  assert.ok(returnValue.hasOwnProperty('top'));
  assert.ok(returnValue.hasOwnProperty('left'));
});

test('The user can pass a custom `calculatePosition` function to customize how the component is placed on the screen', function(assert) {
  assert.expect(3);
  this.calculatePosition = function() {
    return {
      horizontalPosition: 'right',
      verticalPosition: 'above',
      style: {
        top: 111,
        right: 222
      }
    };
  };
  this.render(hbs`
    {{#basic-dropdown calculatePosition=calculatePosition as |dropdown|}}
      {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
      {{#dropdown.content}}
        <div id="dropdown-is-opened"></div>
      {{/dropdown.content}}
    {{/basic-dropdown}}
  `);
  clickTrigger();
  let $dropdownContent = $('.ember-basic-dropdown-content');
  assert.ok($dropdownContent.hasClass('ember-basic-dropdown-content--above'), 'The dropdown is above');
  assert.ok($dropdownContent.hasClass('ember-basic-dropdown-content--right'), 'The dropdown is in the right');
  assert.equal($dropdownContent.attr('style'), 'top: 111px;right: 222px;', 'The style attribute is the expected one');
});

test('The user can pass a custom `calculateInPlacePosition` function to customize how the component is placed on the screen when rendered "in place"', function(assert) {
  assert.expect(3);
  this.calculateInPlacePosition = function() {
    return {
      horizontalPosition: 'right',
      verticalPosition: 'above',
      style: {
        top: 111,
        right: 222
      }
    };
  };
  this.render(hbs`
    {{#basic-dropdown calculateInPlacePosition=calculateInPlacePosition renderInPlace=true as |dropdown|}}
      {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
      {{#dropdown.content}}
        <div id="dropdown-is-opened"></div>
      {{/dropdown.content}}
    {{/basic-dropdown}}
  `);
  clickTrigger();
  let $dropdownContent = $('.ember-basic-dropdown-content');
  assert.ok($dropdownContent.hasClass('ember-basic-dropdown-content--above'), 'The dropdown is above');
  assert.ok($dropdownContent.hasClass('ember-basic-dropdown-content--right'), 'The dropdown is in the right');
  assert.equal($dropdownContent.attr('style'), 'top: 111px;right: 222px;', 'The style attribute is the expected one');
});

// Customization of inner components
test('It allows to customize the trigger passing `triggerComponent="my-custom-trigger"`', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#basic-dropdown triggerComponent="my-custom-trigger" as |dropdown|}}
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  assert.equal(this.$('#my-custom-trigger').length, 1, 'The custom component has been rendered');
});

test('It allows to customize the content passing `contentComponent="my-custom-content"`', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#basic-dropdown contentComponent="my-custom-content" as |dropdown|}}
      {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);
  clickTrigger();
  assert.equal(this.$('#my-custom-content').length, 1, 'The custom component has been rendered');
});

// State replacement
test('When the component is opened, closed or disabled, the entire publicAPI is changed (kind-of)', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#basic-dropdown triggerComponent="trigger-with-did-receive-attrs" as |dropdown|}}
      {{#dropdown.trigger}}Open me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  assert.equal(this.$('.ember-basic-dropdown-trigger').text().trim(), 'Open me');
  clickTrigger();
  assert.equal(this.$('.ember-basic-dropdown-trigger').text().trim(), 'Open me Did open!');
});

test('The registerAPI is called with every mutation of the publicAPI object', function(assert) {
  assert.expect(7);
  let apis = [];
  this.disabled = false;
  this.registerAPI = function(api) {
    apis.push(api);
  };
  this.render(hbs`
    {{#basic-dropdown disabled=disabled registerAPI=registerAPI as |dropdown|}}
      {{#dropdown.trigger}}Open me{{/dropdown.trigger}}
      {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
    {{/basic-dropdown}}
  `);

  clickTrigger();
  clickTrigger();
  assert.equal(apis.length, 3, 'There have been 3 changes in the state of the public API');
  assert.equal(apis[0].isOpen, false, 'The component was closed');
  assert.equal(apis[1].isOpen, true, 'Then it opened');
  assert.equal(apis[2].isOpen, false, 'Then it closed again');
  this.set('disabled', true);
  assert.equal(apis.length, 4, 'There have been 4 changes now');
  assert.equal(apis[2].disabled, false, 'the component was enabled');
  assert.equal(apis[3].disabled, true, 'and it became disabled');
});

// test('BUGFIX: When clicking in the trigger text selection is disabled until the user raises the finger', function(assert) {
//   assert.expect(2);

//   this.render(hbs`
//     {{#basic-dropdown onOpen=onOpen}}
//       <h3>Content of the dropdown</h3>
//     {{else}}
//       <button>Press me</button>
//     {{/basic-dropdown}}
//   `);

//   run(() => {
//     let event = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
//     this.$('.ember-basic-dropdown-trigger')[0].dispatchEvent(event);
//   });
//   assert.equal($('#ember-testing').css('user-select'), 'none', 'Text selection is disabled in the entire app');
//   run(() => {
//     let event = new window.Event('mouseup', { bubbles: true, cancelable: true, view: window });
//     this.$('.ember-basic-dropdown-trigger')[0].dispatchEvent(event);
//   });
//   assert.notEqual($('#ember-testing').css('user-select'), 'none', 'Text selection is not disabled in the entire app');
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
//   run(() => this.$('button')[0].focus());
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
//   run(() => $('#input-inside-dropdown-content')[0].focus());
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
//   run(() => $('#input-inside-dropdown-content')[0].focus());
//   assert.ok($('.ember-basic-dropdown').hasClass('ember-basic-dropdown--focus-inside'), 'The dropdown has the focus-inside now');
// });