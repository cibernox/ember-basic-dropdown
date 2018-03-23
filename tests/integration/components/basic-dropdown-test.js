import { run } from '@ember/runloop';
import { registerDeprecationHandler } from '@ember/debug';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { clickTrigger } from 'ember-basic-dropdown/test-support/helpers';
import { render, find, click, focus, triggerEvent } from '@ember/test-helpers';

let deprecations = [];

registerDeprecationHandler((message, options, next) => {
  deprecations.push(message);
  next(message, options);
});

module('Integration | Component | basic-dropdown', function(hooks) {
  hooks.beforeEach(() => deprecations = []);

  setupRenderingTest(hooks);

  test('Its `toggle` action opens and closes the dropdown', async function(assert) {
    assert.expect(3);

    await render(hbs`
      {{#basic-dropdown as |dropdown|}}
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.toggle}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      {{/basic-dropdown}}
    `);

    assert.notOk(find('#dropdown-is-opened'), 'The dropdown is closed');
    await clickTrigger();
    assert.ok(find('#dropdown-is-opened'), 'The dropdown is opened');
    await clickTrigger();
    assert.notOk(find('#dropdown-is-opened'), 'The dropdown is closed again');
  });

  test('The mousedown event with the right button doesn\'t open it', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#basic-dropdown as |dd|}}
        {{#dd.trigger}}Click me{{/dd.trigger}}
        {{#if dd.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      {{/basic-dropdown}}
    `);

    assert.notOk(find('#dropdown-is-opened'), 'The dropdown is closed');
    await triggerEvent('.ember-basic-dropdown-trigger', 'mousedown', { button: 2 });
    assert.notOk(find('#dropdown-is-opened'), 'The dropdown is closed');
  });

  test('Its `open` action opens the dropdown', async function(assert) {
    assert.expect(3);

    await render(hbs`
      {{#basic-dropdown as |dropdown|}}
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.open}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      {{/basic-dropdown}}
    `);

    assert.notOk(find('#dropdown-is-opened'), 'The dropdown is closed');
    await clickTrigger();
    assert.ok(find('#dropdown-is-opened'), 'The dropdown is opened');
    await clickTrigger();
    assert.ok(find('#dropdown-is-opened'), 'The dropdown is still opened');
  });

  test('Its `close` action closes the dropdown', async function(assert) {
    assert.expect(3);

    await render(hbs`
      {{#basic-dropdown initiallyOpened=true as |dropdown|}}
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.close}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      {{/basic-dropdown}}
    `);

    assert.ok(find('#dropdown-is-opened'), 'The dropdown is opened');
    await clickTrigger();
    assert.notOk(find('#dropdown-is-opened'), 'The dropdown is closed');
    await clickTrigger();
    assert.notOk(find('#dropdown-is-opened'), 'The dropdown is still closed');
  });

  test('It can receive an onOpen action that is fired just before the component opens', async function(assert) {
    assert.expect(4);

    this.willOpen = function(dropdown, e) {
      assert.equal(dropdown.isOpen, false, 'The received dropdown has a `isOpen` property that is still false');
      assert.ok(dropdown.hasOwnProperty('actions'), 'The received dropdown has a `actions` property');
      assert.ok(!!e, 'Receives an argument as second argument');
      assert.ok(true, 'onOpen action was invoked');
    };
    await render(hbs`
      {{#basic-dropdown onOpen=willOpen as |dropdown|}}
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.open}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      {{/basic-dropdown}}
    `);

    await clickTrigger();
  });

  test('returning false from the `onOpen` action prevents the dropdown from opening', async function(assert) {
    assert.expect(2);

    this.willOpen = function() {
      assert.ok(true, 'willOpen has been called');
      return false;
    };
    await render(hbs`
      {{#basic-dropdown onOpen=willOpen as |dropdown|}}
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.open}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      {{/basic-dropdown}}
    `);

    await clickTrigger();
    assert.notOk(find('#dropdown-is-opened'), 'The dropdown is still closed');
  });

  test('It can receive an onClose action that is fired when the component closes', async function(assert) {
    assert.expect(7);

    this.willClose = function(dropdown, e) {
      assert.equal(dropdown.isOpen, true, 'The received dropdown has a `isOpen` property and its value is `true`');
      assert.ok(dropdown.hasOwnProperty('actions'), 'The received dropdown has a `actions` property');
      assert.ok(!!e, 'Receives an argument as second argument');
      assert.ok(true, 'onClose action was invoked');
    };
    await render(hbs`
      {{#basic-dropdown onClose=willClose as |dropdown|}}
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.toggle}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      {{/basic-dropdown}}
    `);

    assert.notOk(find('#dropdown-is-opened'), 'The dropdown is closed');
    await clickTrigger();
    assert.ok(find('#dropdown-is-opened'), 'The dropdown is opened');
    await clickTrigger();
    assert.notOk(find('#dropdown-is-opened'), 'The dropdown is now opened');
  });

  test('returning false from the `onClose` action prevents the dropdown from closing', async function(assert) {
    assert.expect(4);

    this.willClose = function() {
      assert.ok(true, 'willClose has been invoked');
      return false;
    };
    await render(hbs`
      {{#basic-dropdown onClose=willClose as |dropdown|}}
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.toggle}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      {{/basic-dropdown}}
    `);

    assert.notOk(find('#dropdown-is-opened'), 'The dropdown is closed');
    await clickTrigger();
    assert.ok(find('#dropdown-is-opened'), 'The dropdown is opened');
    await clickTrigger();
    assert.ok(find('#dropdown-is-opened'), 'The dropdown is still opened');
  });

  test('It can be rendered already opened when the `initiallyOpened=true`', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{#basic-dropdown initiallyOpened=true as |dropdown|}}
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      {{/basic-dropdown}}
    `);

    assert.ok(find('#dropdown-is-opened'), 'The dropdown is opened');
  });

  test('Calling the `open` method while the dropdown is already opened does not call `onOpen` action', async function(assert) {
    assert.expect(1);
    let onOpenCalls = 0;
    this.onOpen = () => {
      onOpenCalls++;
    };

    await render(hbs`
      {{#basic-dropdown onOpen=onOpen as |dropdown|}}
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.open}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      {{/basic-dropdown}}
    `);
    await clickTrigger();
    await clickTrigger();
    await clickTrigger();
    assert.equal(onOpenCalls, 1, 'onOpen has been called only once');
  });

  test('Calling the `close` method while the dropdown is already opened does not call `onOpen` action', async function(assert) {
    assert.expect(1);
    let onCloseCalls = 0;
    this.onFocus = (dropdown) => {
      dropdown.actions.close();
    };
    this.onClose = () => {
      onCloseCalls++;
    };

    await render(hbs`
      {{#basic-dropdown onClose=onClose as |dropdown|}}
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.close}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      {{/basic-dropdown}}
    `);
    await clickTrigger();
    await clickTrigger();
    await clickTrigger();
    assert.equal(onCloseCalls, 0, 'onClose was never called');
  });

  test('It adds the proper class to trigger and content when it receives `horizontalPosition="right"`', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#basic-dropdown horizontalPosition="right" as |dropdown|}}
        {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
        {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
      {{/basic-dropdown}}
    `);

    await clickTrigger();
    assert.ok(find('.ember-basic-dropdown-trigger').classList.contains('ember-basic-dropdown-trigger--right'), 'The proper class has been added');
    assert.ok(find('.ember-basic-dropdown-content').classList.contains('ember-basic-dropdown-content--right'), 'The proper class has been added');
  });

  test('It adds the proper class to trigger and content when it receives `horizontalPosition="center"`', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#basic-dropdown horizontalPosition="center" as |dropdown|}}
        {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
        {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
      {{/basic-dropdown}}
    `);

    await clickTrigger();
    assert.ok(find('.ember-basic-dropdown-trigger').classList.contains('ember-basic-dropdown-trigger--center'), 'The proper class has been added');
    assert.ok(find('.ember-basic-dropdown-content').classList.contains('ember-basic-dropdown-content--center'), 'The proper class has been added');
  });

  test('It prefers right over left when it receives "auto-right"', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#basic-dropdown horizontalPosition="auto-right" as |dropdown|}}
        {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
        {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
      {{/basic-dropdown}}
    `);

    await clickTrigger();
    assert.ok(find('.ember-basic-dropdown-trigger').classList.contains('ember-basic-dropdown-trigger--right'), 'The proper class has been added');
    assert.ok(find('.ember-basic-dropdown-content').classList.contains('ember-basic-dropdown-content--right'), 'The proper class has been added');
  });

  test('It adds the proper class to trigger and content when it receives `verticalPosition="above"`', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#basic-dropdown verticalPosition="above" as |dropdown|}}
        {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
        {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
      {{/basic-dropdown}}
    `);

    await clickTrigger();
    assert.ok(find('.ember-basic-dropdown-trigger').classList.contains('ember-basic-dropdown-trigger--above'), 'The proper class has been added');
    assert.ok(find('.ember-basic-dropdown-content').classList.contains('ember-basic-dropdown-content--above'), 'The proper class has been added');
  });

  test('It passes the `renderInPlace` property to the yielded content component', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{#basic-dropdown renderInPlace=true as |dropdown|}}
        {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
        {{#dropdown.content}}<div id="dropdown-is-opened"></div>{{/dropdown.content}}
      {{/basic-dropdown}}
    `);

    await clickTrigger();
    assert.ok(find('.ember-basic-dropdown-content'), 'The dropdown is rendered in place');
  });

  test('It adds a special class to both trigger and content when `renderInPlace=true`', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#basic-dropdown renderInPlace=true as |dropdown|}}
        {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
        {{#dropdown.content}}<div id="dropdown-is-opened"></div>{{/dropdown.content}}
      {{/basic-dropdown}}
    `);

    await clickTrigger();
    assert.ok(find('.ember-basic-dropdown-trigger').classList.contains('ember-basic-dropdown-trigger--in-place'), 'The trigger has a special `--in-place` class');
    assert.ok(find('.ember-basic-dropdown-content').classList.contains('ember-basic-dropdown-content--in-place'), 'The content has a special `--in-place` class');
  });

  test('When rendered in-place, the content still contains the --above/below classes', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#basic-dropdown renderInPlace=true as |dropdown|}}
        {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
        {{#dropdown.content}}<div id="dropdown-is-opened"></div>{{/dropdown.content}}
      {{/basic-dropdown}}
    `);

    await clickTrigger();
    assert.ok(find('.ember-basic-dropdown-content').classList.contains('ember-basic-dropdown-content--below'), 'The content has a class indicating that it was placed below the trigger');

    await render(hbs`
      {{#basic-dropdown renderInPlace=true verticalPosition="above" as |dropdown|}}
        {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
        {{#dropdown.content}}<div id="dropdown-is-opened"></div>{{/dropdown.content}}
      {{/basic-dropdown}}
    `);

    await clickTrigger();
    assert.ok(find('.ember-basic-dropdown-content').classList.contains('ember-basic-dropdown-content--above'), 'The content has a class indicating that it was placed above the trigger');
  });

  test('It adds a wrapper element when `renderInPlace=true`', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{#basic-dropdown renderInPlace=true as |dropdown|}}
        {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
        {{#dropdown.content}}<div id="dropdown-is-opened"></div>{{/dropdown.content}}
      {{/basic-dropdown}}
    `);

    await clickTrigger();
    assert.ok(find('.ember-basic-dropdown'), 'The trigger has a special `--in-place` class');
  });

  test('When rendered in-place, it prefers right over left with position "auto-right"', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#basic-dropdown renderInPlace=true horizontalPosition="auto-right" as |dropdown|}}
        {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
        {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
      {{/basic-dropdown}}
    `);

    await clickTrigger();
    assert.ok(find('.ember-basic-dropdown-trigger').classList.contains('ember-basic-dropdown-trigger--right'), 'The proper class has been added');
    assert.ok(find('.ember-basic-dropdown-content').classList.contains('ember-basic-dropdown-content--right'), 'The proper class has been added');
  });

  test('When rendered in-place, it applies right class for position "right"', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#basic-dropdown renderInPlace=true horizontalPosition="right" as |dropdown|}}
        {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
        {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
      {{/basic-dropdown}}
    `);

    await clickTrigger();
    assert.ok(find('.ember-basic-dropdown-trigger').classList.contains('ember-basic-dropdown-trigger--right'), 'The proper class has been added');
    assert.ok(find('.ember-basic-dropdown-content').classList.contains('ember-basic-dropdown-content--right'), 'The proper class has been added');
  });

  test('[ISSUE #127] Having more than one dropdown with `renderInPlace=true` raises an exception', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{#basic-dropdown renderInPlace=true as |dropdown|}}{{/basic-dropdown}}
      {{#basic-dropdown renderInPlace=true as |dropdown|}}{{/basic-dropdown}}
    `);

    assert.ok(true, 'The test has run without errors');
  });

  test('It passes the `disabled` property as part of the public API, and updates is if it changes', async function(assert) {
    assert.expect(2);
    this.disabled = true;
    await render(hbs`
      {{#basic-dropdown disabled=disabled as |dropdown|}}
        {{#if dropdown.disabled}}
          <div id="disabled-dropdown-marker">Disabled!</div>
        {{else}}
          <div id="enabled-dropdown-marker">Enabled!</div>
        {{/if}}
      {{/basic-dropdown}}
    `);

    assert.ok(find('#disabled-dropdown-marker'), 'The public API of the component is marked as disabled');
    this.set('disabled', false);
    assert.ok(find('#enabled-dropdown-marker'), 'The public API of the component is marked as enabled');
  });

  test('It passes the `uniqueId` property as part of the public API', async function(assert) {
    assert.expect(1);
    this.disabled = true;

    await render(hbs`
      {{#basic-dropdown as |dropdown|}}
        <div id="dropdown-unique-id-container">{{dropdown.uniqueId}}</div>
      {{/basic-dropdown}}
    `);

    assert.ok(/ember\d+/.test(find('#dropdown-unique-id-container').textContent.trim()), 'It yields the uniqueId');
  });

  test('If the dropdown gets disabled while it\'s open, it closes automatically', async function(assert) {
    assert.expect(2);

    this.isDisabled = false;
    await render(hbs`
      {{#basic-dropdown disabled=isDisabled as |dropdown|}}
        {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
        {{#dropdown.content}}<div id="dropdown-is-opened"></div>{{/dropdown.content}}
      {{/basic-dropdown}}
    `);

    await clickTrigger();
    assert.ok(find('#dropdown-is-opened'), 'The select is open');
    run(() => this.set('isDisabled', true));
    assert.notOk(find('#dropdown-is-opened'), 'The select is now closed');
  });

  test('If the component\'s `disabled` property changes, the `registerAPI` action is called', async function(assert) {
    assert.expect(3);

    this.isDisabled = false;
    this.toggleDisabled = () => this.toggleProperty('isDisabled');
    this.registerAPI = (api) => run.scheduleOnce('actions', this, this.set, 'remoteController', api);
    await render(hbs`
      {{#basic-dropdown disabled=isDisabled registerAPI=(action registerAPI) as |dropdown|}}
        {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
      {{/basic-dropdown}}
      <button onclick={{action toggleDisabled}}>Toggle</button>
      {{#if remoteController.disabled}}
        <div id="is-disabled"></div>
      {{/if}}
    `);

    await clickTrigger();
    assert.notOk(find('#is-disabled'), 'The select is enabled');
    run(() => this.set('isDisabled', true));
    assert.ok(find('#is-disabled'), 'The select is disabled');
    run(() => this.set('isDisabled', false));
    assert.notOk(find('#is-disabled'), 'The select is enabled again');
  });

  test('It can receive `destination=id-of-elmnt` to customize where `#-in-element` is going to render the content', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{#basic-dropdown destination="id-of-elmnt" as |dd|}}
        {{#dd.trigger}}Click me{{/dd.trigger}}
        {{#dd.content}}Hello{{/dd.content}}
      {{/basic-dropdown}}
      <div id="id-of-elmnt"></div>
    `);

    await clickTrigger();
    assert.equal(find('.ember-basic-dropdown-content').parentNode.id, 'id-of-elmnt', 'The content has been rendered in an alternative destination');
  });

  // A11y
  test('By default, the `aria-owns` attribute of the trigger contains the id of the content', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{#basic-dropdown renderInPlace=true as |dropdown|}}
        {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
        {{#dropdown.content}}<div id="dropdown-is-opened"></div>{{/dropdown.content}}
      {{/basic-dropdown}}
    `);
    await clickTrigger();
    let trigger = find('.ember-basic-dropdown-trigger');
    let content = find('.ember-basic-dropdown-content');
    assert.equal(trigger.attributes['aria-owns'].value, content.id, 'The trigger controls the content');
  });

  // Repositioning
  test('Firing a reposition outside of a runloop doesn\'t break the component', async function(assert) {
    let done = assert.async();
    assert.expect(1);

    await render(hbs`
      {{#basic-dropdown as |dropdown|}}
        {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
        {{#dropdown.content}}
          <div id="dropdown-is-opened"></div>
        {{/dropdown.content}}
      {{/basic-dropdown}}
    `);
    await clickTrigger();
    find('#dropdown-is-opened').innerHTML = '<span>New content that will trigger a reposition</span>';
    setTimeout(function() {
      assert.equal(deprecations.length, 0, 'No deprecation warning was raised');
      done();
    }, 100);
  });

  test('The `reposition` public action returns an object with the changes', async function(assert) {
    assert.expect(4);
    let remoteController;
    this.saveAPI = (api) => remoteController = api;

    await render(hbs`
      {{#basic-dropdown registerAPI=(action saveAPI) as |dropdown|}}
        {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
        {{#dropdown.content}}
          <div id="dropdown-is-opened"></div>
        {{/dropdown.content}}
      {{/basic-dropdown}}
    `);
    let returnValue;
    await clickTrigger();

    run(() => {
      returnValue = remoteController.actions.reposition();
    });
    assert.ok(returnValue.hasOwnProperty('hPosition'));
    assert.ok(returnValue.hasOwnProperty('vPosition'));
    assert.ok(returnValue.hasOwnProperty('top'));
    assert.ok(returnValue.hasOwnProperty('left'));
  });

  test('The user can pass a custom `calculatePosition` function to customize how the component is placed on the screen', async function(assert) {
    this.calculatePosition = function(triggerElement, dropdownElement, destinationElement, { dropdown }) {
      assert.ok(dropdown, 'dropdown should be passed to the component');
      return {
        horizontalPosition: 'right',
        verticalPosition: 'above',
        style: {
          top: 111,
          width: 100,
          height: 110
        }
      };
    };
    await render(hbs`
      {{#basic-dropdown calculatePosition=calculatePosition as |dropdown|}}
        {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
        {{#dropdown.content}}
          <div id="dropdown-is-opened"></div>
        {{/dropdown.content}}
      {{/basic-dropdown}}
    `);
    await clickTrigger();
    let dropdownContent = find('.ember-basic-dropdown-content');
    assert.ok(dropdownContent.classList.contains('ember-basic-dropdown-content--above'), 'The dropdown is above');
    assert.ok(dropdownContent.classList.contains('ember-basic-dropdown-content--right'), 'The dropdown is in the right');
    assert.equal(dropdownContent.attributes.style.value, 'top: 111px;width: 100px;height: 110px', 'The style attribute is the expected one');
  });

  test('The user can use the `renderInPlace` flag option to modify how the position is calculated in the `calculatePosition` function', async function(assert) {
    assert.expect(4);
    this.calculatePosition = function(triggerElement, dropdownElement, destinationElement, { dropdown, renderInPlace }) {
      assert.ok(dropdown, 'dropdown should be passed to the component');
      if (renderInPlace) {
        return {
          horizontalPosition: 'right',
          verticalPosition: 'above',
          style: {
            top: 111,
            right: 222
          }
        };
      } else {
        return {
          horizontalPosition: 'left',
          verticalPosition: 'bottom',
          style: {
            top: 333,
            right: 444
          }
        };
      }
    };
    await render(hbs`
      {{#basic-dropdown calculatePosition=calculatePosition renderInPlace=true as |dropdown|}}
        {{#dropdown.trigger}}Click me{{/dropdown.trigger}}
        {{#dropdown.content}}
          <div id="dropdown-is-opened"></div>
        {{/dropdown.content}}
      {{/basic-dropdown}}
    `);
    await clickTrigger();
    let dropdownContent = find('.ember-basic-dropdown-content');
    assert.ok(dropdownContent.classList.contains('ember-basic-dropdown-content--above'), 'The dropdown is above');
    assert.ok(dropdownContent.classList.contains('ember-basic-dropdown-content--right'), 'The dropdown is in the right');
    assert.equal(dropdownContent.attributes.style.value, 'top: 111px;right: 222px;', 'The style attribute is the expected one');
  });

  // Customization of inner components
  test('It allows to customize the trigger passing `triggerComponent="my-custom-trigger"`', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{#basic-dropdown triggerComponent="my-custom-trigger" as |dropdown|}}
        {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
        {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
      {{/basic-dropdown}}
    `);

    assert.ok(find('#my-custom-trigger'), 'The custom component has been rendered');
  });

  test('It allows to customize the content passing `contentComponent="my-custom-content"`', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{#basic-dropdown contentComponent="my-custom-content" as |dropdown|}}
        {{#dropdown.trigger}}Press me{{/dropdown.trigger}}
        {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
      {{/basic-dropdown}}
    `);
    await clickTrigger();
    assert.ok(find('#my-custom-content'), 'The custom component has been rendered');
  });

  // State replacement
  test('When the component is opened, closed or disabled, the entire publicAPI is changed (kind-of)', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#basic-dropdown triggerComponent="trigger-with-did-receive-attrs" as |dropdown|}}
        {{#dropdown.trigger}}Open me{{/dropdown.trigger}}
        {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
      {{/basic-dropdown}}
    `);

    assert.equal(find('.ember-basic-dropdown-trigger').textContent.trim(), 'Open me');
    await clickTrigger();
    assert.equal(find('.ember-basic-dropdown-trigger').textContent.trim(), 'Open me Did open!');
  });

  test('The registerAPI is called with every mutation of the publicAPI object', async function(assert) {
    assert.expect(7);
    let apis = [];
    this.disabled = false;
    this.registerAPI = function(api) {
      apis.push(api);
    };
    await render(hbs`
      {{#basic-dropdown disabled=disabled registerAPI=registerAPI as |dropdown|}}
        {{#dropdown.trigger}}Open me{{/dropdown.trigger}}
        {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
      {{/basic-dropdown}}
    `);

    await clickTrigger();
    await clickTrigger();
    assert.equal(apis.length, 3, 'There have been 3 changes in the state of the public API');
    assert.equal(apis[0].isOpen, false, 'The component was closed');
    assert.equal(apis[1].isOpen, true, 'Then it opened');
    assert.equal(apis[2].isOpen, false, 'Then it closed again');
    this.set('disabled', true);
    assert.equal(apis.length, 4, 'There have been 4 changes now');
    assert.equal(apis[2].disabled, false, 'the component was enabled');
    assert.equal(apis[3].disabled, true, 'and it became disabled');
  });

  test('removing the dropdown in response to onClose does not error', async function(assert) {
    assert.expect(2);

    this.isOpen = true;

    this.onClose = () => {
      this.set('isOpen', false);
    };

    await render(hbs`
      {{#if isOpen}}
        {{#basic-dropdown onClose=onClose as |dropdown|}}
          {{#dropdown.trigger}}Open me{{/dropdown.trigger}}
          {{#dropdown.content}}<h3>Content of the dropdown</h3>{{/dropdown.content}}
        {{/basic-dropdown}}
      {{/if}}
    `);

    assert.ok(find('.ember-basic-dropdown-trigger'), 'the dropdown is rendered');
    await   clickTrigger();
    await   clickTrigger();
    assert.notOk(find('.ember-basic-dropdown-trigger'), 'the dropdown has been removed');
  });

  test('Dropdowns can be infinitely nested, clicking in children will not close parents, clicking in parents closes children', async function(assert) {
    assert.expect(12);

    await render(hbs`
      {{#basic-dropdown as |parent|}}
        {{#parent.trigger class='parent' tagName="button"}}Trigger of the first dropdown{{/parent.trigger}}
        {{#parent.content overlay=true}}
          {{#basic-dropdown as |child|}}
            <p class="body-parent">
              <br>First level of the dropdpwn<br>
            </p>
            {{#child.trigger class='child' tagName="button"}}Trigger of the second dropdown{{/child.trigger}}
            {{#child.content overlay=true}}
              <p class="body-child">
                <br>Second level of the second<br>
                {{#basic-dropdown as |grandchild|}}
                  <p>
                    <br>Second level of the dropdpwn<br>
                  </p>
                  {{#grandchild.trigger class='grandchild' tagName="button"}}Trigger of the Third dropdown{{/grandchild.trigger}}
                  {{#grandchild.content overlay=true}}
                    <p class="body-grandchild">
                      <br>Third level of the third<br>
                    </p>
                  {{/grandchild.content}}
                {{/basic-dropdown}}
              </p>
            {{/child.content}}
          {{/basic-dropdown}}
        {{/parent.content}}
      {{/basic-dropdown}}
    `);
    //open the nested dropdown
    await   click('.ember-basic-dropdown-trigger.parent');
    assert.ok(find('.body-parent'), 'the parent dropdown is rendered');

    await   click('.ember-basic-dropdown-trigger.child');
    assert.ok(find('.body-child'), 'the child dropdown is rendered');

    await   click('.ember-basic-dropdown-trigger.grandchild');
    assert.ok(find('.body-grandchild'), 'the grandchild dropdown is rendered');

    // click in the grandchild dropdown
    await   click('.body-grandchild');
    assert.ok(find('.body-grandchild'), 'can click in grandchild dropdown and still be open');
    assert.ok(find('.body-child'), 'can click in grandchild dropdown and still be open');
    assert.ok(find('.body-parent'), 'can click in grandchild dropdown and still be open');

    // click in the child dropdown
    await   click('.body-child');
    assert.notOk(find('.body-grandchild'), 'grandchild dropdown should not exist becuase we clicked in child');
    assert.ok(find('.body-child'), 'can click in child dropdown and still be open');
    assert.ok(find('.body-parent'), 'can click in child dropdown and still be open');

    // click in the parent dropdown
    await   click('.body-parent');
    assert.notOk(find('.body-grandchild'), 'grandchild dropdown should not exist becuase we clicked in parent');
    assert.notOk(find('.body-child'), 'child dropdown should not exist becuase we clicked in parent');
    assert.ok(find('.body-parent'), 'can click in parent dropdown and still be open');
  });

  // Misc bugfixes
  test('[BUGFIX] Dropdowns rendered in place do not register events twice', async function(assert) {
    assert.expect(2);
    let called = false;
    this.onFocusOut = function() {
      assert.notOk(called);
      called = true;
    }
    this.onOpen = function() {
      assert.ok(true);
    }
    await render(hbs`
      <input type="text" id="outer-input">
      {{#basic-dropdown renderInPlace=true onOpen=onOpen as |dropdown|}}
        {{#dropdown.trigger}}Open me{{/dropdown.trigger}}
        {{#dropdown.content onFocusOut=onFocusOut}}<input type="text" id="inner-input">{{/dropdown.content}}
      {{/basic-dropdown}}
    `);
    await clickTrigger();
    await focus('#inner-input');
    await focus('#outer-input');
  });

  test('[BUGFIX] It protects the inline styles from undefined values returned in the `calculatePosition` callback', async function(assert) {
    assert.expect(1);
    this.calculatePosition = function() {
      return {
        style: {
        }
      };
    };
    await render(hbs`
      {{#basic-dropdown calculatePosition=calculatePosition as |dropdown|}}
        {{#dropdown.trigger}}Open me{{/dropdown.trigger}}
        {{#dropdown.content}}Some content{{/dropdown.content}}
      {{/basic-dropdown}}
    `);
    await clickTrigger();
    assert.ok(find('.ember-basic-dropdown-content').getAttribute('style').indexOf('undefined') === -1, 'There is no undefined values');
  });

});
