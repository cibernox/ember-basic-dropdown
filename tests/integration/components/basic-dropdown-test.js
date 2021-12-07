import { run, scheduleOnce } from '@ember/runloop';
import { registerDeprecationHandler } from '@ember/debug';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';
import {
  render,
  click,
  focus,
  triggerEvent,
  waitUntil,
  find,
} from '@ember/test-helpers';

let deprecations = [];

registerDeprecationHandler((message, options, next) => {
  deprecations.push(message);
  next(message, options);
});

module('Integration | Component | basic-dropdown', function (hooks) {
  hooks.beforeEach(() => (deprecations = []));

  setupRenderingTest(hooks);

  test('Its `toggle` action opens and closes the dropdown', async function (assert) {
    assert.expect(3);

    await render(hbs`
      <BasicDropdown as |dropdown|>
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.toggle}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      </BasicDropdown>
    `);

    assert.dom('#dropdown-is-opened').doesNotExist('The dropdown is closed');
    await click('.ember-basic-dropdown-trigger');
    assert.dom('#dropdown-is-opened').exists('The dropdown is opened');
    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('#dropdown-is-opened')
      .doesNotExist('The dropdown is closed again');
  });

  test("The click event with the right button doesn't open it", async function (assert) {
    assert.expect(2);

    await render(hbs`
      <BasicDropdown as |dd|>
        <dd.Trigger>Click me</dd.Trigger>
        {{#if dd.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      </BasicDropdown>
    `);

    assert.dom('#dropdown-is-opened').doesNotExist('The dropdown is closed');
    await triggerEvent('.ember-basic-dropdown-trigger', 'click', { button: 2 });
    assert.dom('#dropdown-is-opened').doesNotExist('The dropdown is closed');
  });

  test('Its `open` action opens the dropdown', async function (assert) {
    assert.expect(3);

    await render(hbs`
      <BasicDropdown as |dropdown|>
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.open}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      </BasicDropdown>
    `);

    assert.dom('#dropdown-is-opened').doesNotExist('The dropdown is closed');
    await click('.ember-basic-dropdown-trigger');
    assert.dom('#dropdown-is-opened').exists('The dropdown is opened');
    await click('.ember-basic-dropdown-trigger');
    assert.dom('#dropdown-is-opened').exists('The dropdown is still opened');
  });

  test('Its `close` action closes the dropdown', async function (assert) {
    assert.expect(3);

    await render(hbs`
      <BasicDropdown @initiallyOpened={{true}} as |dropdown|>
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.close}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      </BasicDropdown>
    `);

    assert.dom('#dropdown-is-opened').exists('The dropdown is opened');
    await click('.ember-basic-dropdown-trigger');
    assert.dom('#dropdown-is-opened').doesNotExist('The dropdown is closed');
    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('#dropdown-is-opened')
      .doesNotExist('The dropdown is still closed');
  });

  test('It can receive an onOpen action that is fired just before the component opens', async function (assert) {
    assert.expect(4);

    this.willOpen = function (dropdown, e) {
      assert.false(
        dropdown.isOpen,
        'The received dropdown has a `isOpen` property that is still false'
      );
      assert.ok(
        Object.prototype.hasOwnProperty.call(dropdown, 'actions'),
        'The received dropdown has a `actions` property'
      );
      assert.ok(!!e, 'Receives an argument as second argument');
      assert.ok(true, 'onOpen action was invoked');
    };
    await render(hbs`
      <BasicDropdown @onOpen={{this.willOpen}} as |dropdown|>
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.open}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      </BasicDropdown>
    `);

    await click('.ember-basic-dropdown-trigger');
  });

  test('returning false from the `onOpen` action prevents the dropdown from opening', async function (assert) {
    assert.expect(2);

    this.willOpen = function () {
      assert.ok(true, 'willOpen has been called');
      return false;
    };
    await render(hbs`
      <BasicDropdown @onOpen={{this.willOpen}} as |dropdown|>
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.open}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      </BasicDropdown>
    `);

    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('#dropdown-is-opened')
      .doesNotExist('The dropdown is still closed');
  });

  test('It can receive an onClose action that is fired when the component closes', async function (assert) {
    assert.expect(7);

    this.willClose = function (dropdown, e) {
      assert.true(
        dropdown.isOpen,
        'The received dropdown has a `isOpen` property and its value is `true`'
      );
      assert.ok(
        Object.prototype.hasOwnProperty.call(dropdown, 'actions'),
        'The received dropdown has a `actions` property'
      );
      assert.ok(!!e, 'Receives an argument as second argument');
      assert.ok(true, 'onClose action was invoked');
    };
    await render(hbs`
      <BasicDropdown @onClose={{this.willClose}} as |dropdown|>
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.toggle}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      </BasicDropdown>
    `);

    assert.dom('#dropdown-is-opened').doesNotExist('The dropdown is closed');
    await click('.ember-basic-dropdown-trigger');
    assert.dom('#dropdown-is-opened').exists('The dropdown is opened');
    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('#dropdown-is-opened')
      .doesNotExist('The dropdown is now opened');
  });

  test('returning false from the `onClose` action prevents the dropdown from closing', async function (assert) {
    assert.expect(4);

    this.willClose = function () {
      assert.ok(true, 'willClose has been invoked');
      return false;
    };
    await render(hbs`
      <BasicDropdown @onClose={{this.willClose}} as |dropdown|>
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.toggle}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      </BasicDropdown>
    `);

    assert.dom('#dropdown-is-opened').doesNotExist('The dropdown is closed');
    await click('.ember-basic-dropdown-trigger');
    assert.dom('#dropdown-is-opened').exists('The dropdown is opened');
    await click('.ember-basic-dropdown-trigger');
    assert.dom('#dropdown-is-opened').exists('The dropdown is still opened');
  });

  test('It can be rendered already opened when the `initiallyOpened=true`', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <BasicDropdown @initiallyOpened={{true}} as |dropdown|>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      </BasicDropdown>
    `);

    assert.dom('#dropdown-is-opened').exists('The dropdown is opened');
  });

  test('Calling the `open` method while the dropdown is already opened does not call `onOpen` action', async function (assert) {
    assert.expect(1);
    let onOpenCalls = 0;
    this.onOpen = () => {
      onOpenCalls++;
    };

    await render(hbs`
      <BasicDropdown @onOpen={{this.onOpen}} as |dropdown|>
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.open}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      </BasicDropdown>
    `);
    await click('.ember-basic-dropdown-trigger');
    await click('.ember-basic-dropdown-trigger');
    await click('.ember-basic-dropdown-trigger');
    assert.strictEqual(onOpenCalls, 1, 'onOpen has been called only once');
  });

  test('Calling the `close` method while the dropdown is already opened does not call `onOpen` action', async function (assert) {
    assert.expect(1);
    let onCloseCalls = 0;
    this.onFocus = (dropdown) => {
      dropdown.actions.close();
    };
    this.onClose = () => {
      onCloseCalls++;
    };

    await render(hbs`
      <BasicDropdown @onClose={{this.onClose}} as |dropdown|>
        <button class="ember-basic-dropdown-trigger" onclick={{dropdown.actions.close}}></button>
        {{#if dropdown.isOpen}}
          <div id="dropdown-is-opened"></div>
        {{/if}}
      </BasicDropdown>
    `);
    await click('.ember-basic-dropdown-trigger');
    await click('.ember-basic-dropdown-trigger');
    await click('.ember-basic-dropdown-trigger');
    assert.strictEqual(onCloseCalls, 0, 'onClose was never called');
  });

  test('It adds the proper class to trigger and content when it receives `@horizontalPosition="right"`', async function (assert) {
    assert.expect(2);

    await render(hbs`
      <BasicDropdown @horizontalPosition="right" as |dropdown|>
        <dropdown.Trigger>Press me</dropdown.Trigger>
        <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
      </BasicDropdown>
    `);

    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasClass(
        'ember-basic-dropdown-trigger--right',
        'The proper class has been added'
      );
    assert
      .dom('.ember-basic-dropdown-content')
      .hasClass(
        'ember-basic-dropdown-content--right',
        'The proper class has been added'
      );
  });

  test('It adds the proper class to trigger and content when it receives `horizontalPosition="center"`', async function (assert) {
    assert.expect(2);

    await render(hbs`
      <BasicDropdown @horizontalPosition="center" as |dropdown|>
        <dropdown.Trigger>Press me</dropdown.Trigger>
        <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
      </BasicDropdown>
    `);

    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasClass(
        'ember-basic-dropdown-trigger--center',
        'The proper class has been added'
      );
    assert
      .dom('.ember-basic-dropdown-content')
      .hasClass(
        'ember-basic-dropdown-content--center',
        'The proper class has been added'
      );
  });

  test('It prefers right over left when it receives "auto-right"', async function (assert) {
    assert.expect(2);

    await render(hbs`
      <BasicDropdown @horizontalPosition="auto-right" as |dropdown|>
        <dropdown.Trigger>Press me</dropdown.Trigger>
        <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
      </BasicDropdown>
    `);

    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasClass(
        'ember-basic-dropdown-trigger--right',
        'The proper class has been added'
      );
    assert
      .dom('.ember-basic-dropdown-content')
      .hasClass(
        'ember-basic-dropdown-content--right',
        'The proper class has been added'
      );
  });

  test('It adds the proper class to trigger and content when it receives `verticalPosition="above"`', async function (assert) {
    assert.expect(2);

    await render(hbs`
      <BasicDropdown @verticalPosition="above" as |dropdown|>
        <dropdown.Trigger>Press me</dropdown.Trigger>
        <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
      </BasicDropdown>
    `);

    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasClass(
        'ember-basic-dropdown-trigger--above',
        'The proper class has been added'
      );
    assert
      .dom('.ember-basic-dropdown-content')
      .hasClass(
        'ember-basic-dropdown-content--above',
        'The proper class has been added'
      );
  });

  test('It passes the `renderInPlace` property to the yielded content component', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <BasicDropdown @renderInPlace={{true}} as |dropdown|>
        <dropdown.Trigger>Click me</dropdown.Trigger>
        <dropdown.Content><div id="dropdown-is-opened"></div></dropdown.Content>
      </BasicDropdown>
    `);

    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('.ember-basic-dropdown-content')
      .exists('The dropdown is rendered in place');
  });

  test('It adds a special class to both trigger and content when `@renderInPlace={{true}}`', async function (assert) {
    assert.expect(2);

    await render(hbs`
      <BasicDropdown @renderInPlace={{true}} as |dropdown|>
        <dropdown.Trigger>Click me</dropdown.Trigger>
        <dropdown.Content><div id="dropdown-is-opened"></div></dropdown.Content>
      </BasicDropdown>
    `);

    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasClass(
        'ember-basic-dropdown-trigger--in-place',
        'The trigger has a special `--in-place` class'
      );
    assert
      .dom('.ember-basic-dropdown-content')
      .hasClass(
        'ember-basic-dropdown-content--in-place',
        'The content has a special `--in-place` class'
      );
  });

  test('When rendered in-place, the content still contains the --above/below classes', async function (assert) {
    assert.expect(2);

    await render(hbs`
      <BasicDropdown @renderInPlace={{true}} as |dropdown|>
        <dropdown.Trigger>Click me</dropdown.Trigger>
        <dropdown.Content><div id="dropdown-is-opened"></div></dropdown.Content>
      </BasicDropdown>
    `);

    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('.ember-basic-dropdown-content')
      .hasClass(
        'ember-basic-dropdown-content--below',
        'The content has a class indicating that it was placed below the trigger'
      );

    await render(hbs`
      <BasicDropdown @renderInPlace={{true}} @verticalPosition="above" as |dropdown|>
        <dropdown.Trigger>Click me</dropdown.Trigger>
        <dropdown.Content><div id="dropdown-is-opened"></div></dropdown.Content>
      </BasicDropdown>
    `);

    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('.ember-basic-dropdown-content')
      .hasClass(
        'ember-basic-dropdown-content--above',
        'The content has a class indicating that it was placed above the trigger'
      );
  });

  test('It adds a wrapper element when `@renderInPlace={{true}}`', async function (assert) {
    assert.expect(2);

    await render(hbs`
      <BasicDropdown @renderInPlace={{true}} as |dropdown|>
        <dropdown.Trigger>Click me</dropdown.Trigger>
        <dropdown.Content><div id="dropdown-is-opened"></div></dropdown.Content>
      </BasicDropdown>
    `);

    await click('.ember-basic-dropdown-trigger');
    assert.dom('.ember-basic-dropdown').exists();
    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasClass(
        'ember-basic-dropdown-trigger--in-place',
        'The trigger has a special `--in-place` class'
      );
  });

  test('When rendered in-place, it prefers right over left with position "auto-right"', async function (assert) {
    assert.expect(2);

    await render(hbs`
      <BasicDropdown @renderInPlace={{true}} @horizontalPosition="auto-right" as |dropdown|>
        <dropdown.Trigger>Press me</dropdown.Trigger>
        <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
      </BasicDropdown>
    `);

    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasClass(
        'ember-basic-dropdown-trigger--right',
        'The proper class has been added'
      );
    assert
      .dom('.ember-basic-dropdown-content')
      .hasClass(
        'ember-basic-dropdown-content--right',
        'The proper class has been added'
      );
  });

  test('When rendered in-place, it applies right class for position "right"', async function (assert) {
    assert.expect(2);

    await render(hbs`
      <BasicDropdown @renderInPlace={{true}} @horizontalPosition="right" as |dropdown|>
        <dropdown.Trigger>Press me</dropdown.Trigger>
        <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
      </BasicDropdown>
    `);

    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasClass(
        'ember-basic-dropdown-trigger--right',
        'The proper class has been added'
      );
    assert
      .dom('.ember-basic-dropdown-content')
      .hasClass(
        'ember-basic-dropdown-content--right',
        'The proper class has been added'
      );
  });

  test('[ISSUE #127] Having more than one dropdown with `@renderInPlace={{true}}` raises an exception', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <BasicDropdown @renderInPlace={{true}} as |dropdown|></BasicDropdown>
      <BasicDropdown @renderInPlace={{true}} as |dropdown|></BasicDropdown>
    `);

    assert.ok(true, 'The test has run without errors');
  });

  test('It passes the `disabled` property as part of the public API, and updates is if it changes', async function (assert) {
    assert.expect(2);
    this.disabled = true;
    await render(hbs`
      <BasicDropdown @disabled={{this.disabled}} as |dropdown|>
        {{#if dropdown.disabled}}
          <div id="disabled-dropdown-marker">Disabled!</div>
        {{else}}
          <div id="enabled-dropdown-marker">Enabled!</div>
        {{/if}}
      </BasicDropdown>
    `);

    assert
      .dom('#disabled-dropdown-marker')
      .exists('The public API of the component is marked as disabled');
    this.set('disabled', false);
    assert
      .dom('#enabled-dropdown-marker')
      .exists('The public API of the component is marked as enabled');
  });

  test('It passes the `uniqueId` property as part of the public API', async function (assert) {
    assert.expect(1);
    this.disabled = true;

    await render(hbs`
      <BasicDropdown as |dropdown|>
        <div id="dropdown-unique-id-container">{{dropdown.uniqueId}}</div>
      </BasicDropdown>
    `);

    assert
      .dom('#dropdown-unique-id-container')
      .hasText(/ember\d+/, 'It yields the uniqueId');
  });

  test("If the dropdown gets disabled while it's open, it closes automatically", async function (assert) {
    assert.expect(2);

    this.isDisabled = false;
    await render(hbs`
      <BasicDropdown @disabled={{this.isDisabled}} as |dropdown|>
        <dropdown.Trigger>Click me</dropdown.Trigger>
        <dropdown.Content><div id="dropdown-is-opened"></div></dropdown.Content>
      </BasicDropdown>
    `);

    await click('.ember-basic-dropdown-trigger');
    assert.dom('#dropdown-is-opened').exists('The select is open');
    run(() => this.set('isDisabled', true));
    assert.dom('#dropdown-is-opened').doesNotExist('The select is now closed');
  });

  test("If the component's `disabled` property changes, the `registerAPI` action is called", async function (assert) {
    assert.expect(3);

    this.isDisabled = false;
    this.toggleDisabled = () => this.toggleProperty('isDisabled');
    this.registerAPI = (api) =>
      scheduleOnce('actions', this, this.set, 'remoteController', api);
    await render(hbs`
      <BasicDropdown @disabled={{this.isDisabled}} @registerAPI={{action this.registerAPI}} as |dropdown|>
        <dropdown.Trigger>Click me</dropdown.Trigger>
      </BasicDropdown>
      <button onclick={{action this.toggleDisabled}}>Toggle</button>
      {{#if this.remoteController.disabled}}
        <div id="is-disabled"></div>
      {{/if}}
    `);

    await click('.ember-basic-dropdown-trigger');
    assert.dom('#is-disabled').doesNotExist('The select is enabled');
    run(() => this.set('isDisabled', true));
    assert.dom('#is-disabled').exists('The select is disabled');
    run(() => this.set('isDisabled', false));
    assert.dom('#is-disabled').doesNotExist('The select is enabled again');
  });

  test('It can receive `@destination="id-of-elmnt"` to customize where `#-in-element` is going to render the content', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <BasicDropdown @destination="id-of-elmnt" as |dd|>
        <dd.Trigger>Click me</dd.Trigger>
        <dd.Content>Hello</dd.Content>
      </BasicDropdown>
      <div id="id-of-elmnt"></div>
    `);
    await click('.ember-basic-dropdown-trigger');

    assert
      .dom(
        this.element.querySelector('.ember-basic-dropdown-content').parentNode
      )
      .hasAttribute(
        'id',
        'id-of-elmnt',
        'The content has been rendered in an alternative destination'
      );
  });

  // A11y
  test('By default, the `aria-controls` attribute of the trigger contains the id of the content', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <BasicDropdown @renderInPlace={{true}} as |dropdown|>
        <dropdown.Trigger>Click me</dropdown.Trigger>
        <dropdown.Content><div id="dropdown-is-opened"></div></dropdown.Content>
      </BasicDropdown>
    `);
    await click('.ember-basic-dropdown-trigger');
    let content = this.element.querySelector('.ember-basic-dropdown-content');
    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasAttribute(
        'aria-controls',
        content.id,
        'The trigger controls the content'
      );
  });

  test('When opened, the `aria-owns` attribute of the trigger parent contains the id of the content', async function (assert) {
    assert.expect(2);
    await render(hbs`
      <BasicDropdown @renderInPlace={{true}} as |dropdown|>
        <dropdown.Trigger>Click me</dropdown.Trigger>
        <dropdown.Content><div id="dropdown-is-opened"></div></dropdown.Content>
      </BasicDropdown>
    `);
    let trigger = this.element.querySelector('.ember-basic-dropdown-trigger');
    assert
      .dom(trigger.parentNode)
      .doesNotHaveAttribute(
        'aria-owns',
        'Closed dropdown parent does not have aria-owns'
      );
    await click('.ember-basic-dropdown-trigger');
    let content = this.element.querySelector('.ember-basic-dropdown-content');
    assert
      .dom(trigger.parentNode)
      .hasAttribute(
        'aria-owns',
        content.id,
        'The trigger parent owns the content'
      );
  });

  // Repositioning
  test('The `reposition` public action returns an object with the changes', async function (assert) {
    assert.expect(4);
    let remoteController;
    this.saveAPI = (api) => (remoteController = api);

    await render(hbs`
      <BasicDropdown @registerAPI={{action this.saveAPI}} as |dropdown|>
        <dropdown.Trigger>Click me</dropdown.Trigger>
        <dropdown.Content>
          <div id="dropdown-is-opened"></div>
        </dropdown.Content>
      </BasicDropdown>
    `);
    let returnValue;
    await click('.ember-basic-dropdown-trigger');

    run(() => {
      returnValue = remoteController.actions.reposition();
    });
    assert.ok(Object.prototype.hasOwnProperty.call(returnValue, 'hPosition'));
    assert.ok(Object.prototype.hasOwnProperty.call(returnValue, 'vPosition'));
    assert.ok(Object.prototype.hasOwnProperty.call(returnValue, 'top'));
    assert.ok(Object.prototype.hasOwnProperty.call(returnValue, 'left'));
  });

  test('The user can pass a custom `calculatePosition` function to customize how the component is placed on the screen', async function (assert) {
    assert.expect(4);
    this.calculatePosition = function (
      triggerElement,
      dropdownElement,
      destinationElement,
      { dropdown }
    ) {
      assert.ok(dropdown, 'dropdown should be passed to the component');
      return {
        horizontalPosition: 'right',
        verticalPosition: 'above',
        style: {
          top: 111,
          width: 100,
          height: 110,
        },
      };
    };
    await render(hbs`
      <BasicDropdown @calculatePosition={{this.calculatePosition}} as |dropdown|>
        <dropdown.Trigger>Click me</dropdown.Trigger>
        <dropdown.Content>
          <div id="dropdown-is-opened"></div>
        </dropdown.Content>
      </BasicDropdown>
    `);
    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('.ember-basic-dropdown-content')
      .hasClass('ember-basic-dropdown-content--above', 'The dropdown is above');
    assert
      .dom('.ember-basic-dropdown-content')
      .hasClass(
        'ember-basic-dropdown-content--right',
        'The dropdown is in the right'
      );
    assert
      .dom('.ember-basic-dropdown-content')
      .hasAttribute(
        'style',
        'top: 111px; width: 100px; height: 110px;',
        'The style attribute is the expected one'
      );
  });

  test('The user can use the `renderInPlace` flag option to modify how the position is calculated in the `calculatePosition` function', async function (assert) {
    assert.expect(4);
    this.calculatePosition = function (
      triggerElement,
      dropdownElement,
      destinationElement,
      { dropdown, renderInPlace }
    ) {
      assert.ok(dropdown, 'dropdown should be passed to the component');
      if (renderInPlace) {
        return {
          horizontalPosition: 'right',
          verticalPosition: 'above',
          style: {
            top: 111,
            right: 222,
          },
        };
      } else {
        return {
          horizontalPosition: 'left',
          verticalPosition: 'bottom',
          style: {
            top: 333,
            right: 444,
          },
        };
      }
    };
    await render(hbs`
      <BasicDropdown @calculatePosition={{this.calculatePosition}} @renderInPlace={{true}} as |dropdown|>
        <dropdown.Trigger>Click me</dropdown.Trigger>
        <dropdown.Content>
          <div id="dropdown-is-opened"></div>
        </dropdown.Content>
      </BasicDropdown>
    `);
    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('.ember-basic-dropdown-content')
      .hasClass('ember-basic-dropdown-content--above', 'The dropdown is above');
    assert
      .dom('.ember-basic-dropdown-content')
      .hasClass(
        'ember-basic-dropdown-content--right',
        'The dropdown is in the right'
      );
    assert
      .dom('.ember-basic-dropdown-content')
      .hasStyle(
        { top: '111px', right: '222px' },
        'The style attribute is the expected one'
      );
  });

  // Customization of inner components
  test('It allows to customize the trigger passing `@triggerComponent="my-custom-trigger"`', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <BasicDropdown @triggerComponent={{component "my-custom-trigger"}} as |dropdown|>
        <dropdown.Trigger>Press me</dropdown.Trigger>
        <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
      </BasicDropdown>
    `);

    assert
      .dom('#my-custom-trigger')
      .exists('The custom component has been rendered');
  });

  test('It allows to customize the content passing `contentComponent="my-custom-content"`', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <BasicDropdown @contentComponent={{component "my-custom-content"}} as |dropdown|>
        <dropdown.Trigger>Press me</dropdown.Trigger>
        <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
      </BasicDropdown>
    `);
    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('#my-custom-content')
      .exists('The custom component has been rendered');
  });

  // State replacement
  test('The registerAPI is called with every mutation of the publicAPI object', async function (assert) {
    assert.expect(7);
    let apis = [];
    this.disabled = false;
    this.registerAPI = function (api) {
      apis.push(api);
    };
    await render(hbs`
      <BasicDropdown @disabled={{this.disabled}} @registerAPI={{this.registerAPI}} as |dropdown|>
        <dropdown.Trigger>Open me</dropdown.Trigger>
        <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
      </BasicDropdown>
    `);

    await click('.ember-basic-dropdown-trigger');
    await click('.ember-basic-dropdown-trigger');
    assert.strictEqual(
      apis.length,
      3,
      'There have been 3 changes in the state of the public API'
    );
    assert.false(apis[0].isOpen, 'The component was closed');
    assert.true(apis[1].isOpen, 'Then it opened');
    assert.false(apis[2].isOpen, 'Then it closed again');
    this.set('disabled', true);
    assert.strictEqual(apis.length, 4, 'There have been 4 changes now');
    assert.false(apis[2].disabled, 'the component was enabled');
    assert.true(apis[3].disabled, 'and it became disabled');
  });

  test('removing the dropdown in response to onClose does not error', async function (assert) {
    assert.expect(2);

    this.isOpen = true;

    this.onClose = () => {
      this.set('isOpen', false);
    };

    await render(hbs`
      {{#if this.isOpen}}
        <BasicDropdown @onClose={{this.onClose}} as |dropdown|>
          <dropdown.Trigger>Open me</dropdown.Trigger>
          <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
        </BasicDropdown>
      {{/if}}
    `);

    assert
      .dom('.ember-basic-dropdown-trigger')
      .exists('the dropdown is rendered');
    await click('.ember-basic-dropdown-trigger');
    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('.ember-basic-dropdown-trigger')
      .doesNotExist('the dropdown has been removed');
  });

  test('Dropdowns can be infinitely nested, clicking in children will not close parents, clicking in parents closes children', async function (assert) {
    assert.expect(12);

    await render(hbs`
      <BasicDropdown as |parent|>
        <parent.Trigger class='parent' @htmlTag="button">Trigger of the first dropdown</parent.Trigger>
        <parent.Content @overlay={{true}}>
          <BasicDropdown as |child|>
            <p class="body-parent">
              <br>First level of the dropdpwn<br>
            </p>
            <child.Trigger class='child' @htmlTag="button">Trigger of the second dropdown</child.Trigger>
            <child.Content @overlay={{true}}>
              <p class="body-child">
                <br>Second level of the second<br>
                <BasicDropdown as |grandchild|>
                  <p>
                    <br>Second level of the dropdpwn<br>
                  </p>
                  <grandchild.Trigger class='grandchild' @htmlTag="button">Trigger of the Third dropdown</grandchild.Trigger>
                  <grandchild.Content @overlay={{true}}>
                    <p class="body-grandchild">
                      <br>Third level of the third<br>
                    </p>
                  </grandchild.Content>
                </BasicDropdown>
              </p>
            </child.Content>
          </BasicDropdown>
        </parent.Content>
      </BasicDropdown>
    `);
    //open the nested dropdown
    await click('.ember-basic-dropdown-trigger.parent');
    assert.dom('.body-parent').exists('the parent dropdown is rendered');

    await click('.ember-basic-dropdown-trigger.child');
    assert.dom('.body-child').exists('the child dropdown is rendered');

    await click('.ember-basic-dropdown-trigger.grandchild');
    assert
      .dom('.body-grandchild')
      .exists('the grandchild dropdown is rendered');

    // click in the grandchild dropdown
    await click('.body-grandchild');
    assert
      .dom('.body-grandchild')
      .exists('can click in grandchild dropdown and still be open');
    assert
      .dom('.body-child')
      .exists('can click in grandchild dropdown and still be open');
    assert
      .dom('.body-parent')
      .exists('can click in grandchild dropdown and still be open');

    // click in the child dropdown
    await click('.body-child');
    assert
      .dom('.body-grandchild')
      .doesNotExist(
        'grandchild dropdown should not exist becuase we clicked in child'
      );
    assert
      .dom('.body-child')
      .exists('can click in child dropdown and still be open');
    assert
      .dom('.body-parent')
      .exists('can click in child dropdown and still be open');

    // click in the parent dropdown
    await click('.body-parent');
    assert
      .dom('.body-grandchild')
      .doesNotExist(
        'grandchild dropdown should not exist becuase we clicked in parent'
      );
    assert
      .dom('.body-child')
      .doesNotExist(
        'child dropdown should not exist becuase we clicked in parent'
      );
    assert
      .dom('.body-parent')
      .exists('can click in parent dropdown and still be open');
  });

  // Misc bugfixes
  test('[BUGFIX] Dropdowns rendered in place do not register events twice', async function (assert) {
    assert.expect(2);
    let called = false;
    this.onFocusOut = function () {
      assert.notOk(called);
      called = true;
    };
    this.onOpen = function () {
      assert.ok(true);
    };
    await render(hbs`
      <input type="text" id="outer-input">
      <BasicDropdown @renderInPlace={{true}} @onOpen={{this.onOpen}} as |dropdown|>
        <dropdown.Trigger>Open me</dropdown.Trigger>
        <dropdown.Content {{on "focusout" this.onFocusOut}}><input type="text" id="inner-input"></dropdown.Content>
      </BasicDropdown>
    `);
    await click('.ember-basic-dropdown-trigger');
    await focus('#inner-input');
    await focus('#outer-input');
  });

  test('[BUGFIX] It protects the inline styles from undefined values returned in the `calculatePosition` callback', async function (assert) {
    assert.expect(1);
    this.calculatePosition = function () {
      return {
        style: {},
      };
    };
    await render(hbs`
      <BasicDropdown @calculatePosition={{this.calculatePosition}} as |dropdown|>
        <dropdown.Trigger>Open me</dropdown.Trigger>
        <dropdown.Content>Some content</dropdown.Content>
      </BasicDropdown>
    `);
    await click('.ember-basic-dropdown-trigger');
    assert.dom('.ember-basic-dropdown-content').doesNotHaveAttribute('style');
  });

  test('It includes the inline styles returned from the `calculatePosition` callback', async function (assert) {
    assert.expect(1);
    this.calculatePosition = function () {
      return {
        style: {
          'max-height': '500px',
          'overflow-y': 'auto',
        },
      };
    };
    await render(hbs`
      <BasicDropdown @calculatePosition={{this.calculatePosition}} as |dropdown|>
        <dropdown.Trigger>Open me</dropdown.Trigger>
        <dropdown.Content>Some content</dropdown.Content>
      </BasicDropdown>
    `);
    await click('.ember-basic-dropdown-trigger');
    assert
      .dom('.ember-basic-dropdown-content')
      .hasAttribute('style', /max-height: 500px; overflow-y: auto/);
  });

  /**
   * Tests related to https://github.com/cibernox/ember-basic-dropdown/issues/615
   */

  test('[BUGFIX] Dropdowns rendered in place have correct animation flow', async function (assert) {
    assert.expect(4);

    const basicDropdownContentClass = 'ember-basic-dropdown-content';
    const transitioningInClass = 'ember-basic-dropdown--transitioning-in';
    const transitionedInClass = 'ember-basic-dropdown--transitioned-in';
    const transitioningOutClass = 'ember-basic-dropdown--transitioning-out';

    document.head.insertAdjacentHTML(
      'beforeend',
      `<style>
          @keyframes grow-out{0%{opacity: 0;transform: scale(0);}100%{opacity: 1;transform: scale(1);}}
          @keyframes drop-fade-below {0%{opacity:0;transform: translateY(-5px);}100%{opacity: 1;transform: translateY(0);}}
          .ember-basic-dropdown--transitioning-in{animation: grow-out 1s ease-out;}
          .ember-basic-dropdown--transitioning-out{animation: drop-fade-below 1s reverse;}
        </style>
        `
    );

    await render(hbs`
       <BasicDropdown @renderInPlace={{true}} as |dropdown|>
         <dropdown.Trigger><button>Open me</button></dropdown.Trigger>
         <dropdown.Content><div id="dropdown-is-opened">CONTENT</div></dropdown.Content>
       </BasicDropdown>
     `);

    await click('.ember-basic-dropdown-trigger');

    assert
      .dom(`.${basicDropdownContentClass}`)
      .hasClass(
        transitioningInClass,
        `The dropdown content has .${transitioningInClass} class`
      );

    await waitUntil(() =>
      find('.ember-basic-dropdown-content').classList.contains(
        transitionedInClass
      )
    );

    await click('.ember-basic-dropdown-trigger');

    assert
      .dom(`.${basicDropdownContentClass}`)
      .hasClass(
        transitioningOutClass,
        `The dropdown content has .${transitioningOutClass} class`
      );

    await click('.ember-basic-dropdown-trigger');

    assert
      .dom(`.${basicDropdownContentClass}`)
      .hasClass(
        transitioningInClass,
        `After closing dropdown, the dropdown content has .${transitioningInClass} class again as initial value`
      );

    await waitUntil(() =>
      find('.ember-basic-dropdown-content').classList.contains(
        transitionedInClass
      )
    );

    await click('.ember-basic-dropdown-trigger');

    assert
      .dom(`.${basicDropdownContentClass}`)
      .hasClass(
        transitioningOutClass,
        `The dropdown content has .${transitioningOutClass} class`
      );
  });
});
