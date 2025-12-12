import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  focus,
  triggerEvent,
  waitUntil,
  find,
  settled,
  type TestContext,
} from '@ember/test-helpers';
import MyCustomTrigger from 'test-app/components/my-custom-trigger';
import MyCustomContent from 'test-app/components/my-custom-content';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import { on } from '@ember/modifier';
import Shadow from 'test-app/components/shadow';
import type { Dropdown, HorizontalPosition } from 'ember-basic-dropdown/types';
import type { CalculatePosition } from 'ember-basic-dropdown/utils/calculate-position';
import type { ComponentLike } from '@glint/template';
import type { BasicDropdownTriggerSignature } from 'ember-basic-dropdown/components/basic-dropdown-trigger';
import type { BasicDropdownContentSignature } from 'ember-basic-dropdown/components/basic-dropdown-content';

interface ExtendedTestContext extends TestContext {
  element: HTMLElement;
  disabled?: boolean;
  isOpen?: boolean;
  remoteController?: Dropdown | null;
  triggerComponent?: ComponentLike<BasicDropdownTriggerSignature>;
  contentComponent?: ComponentLike<BasicDropdownContentSignature>;
  toggleDisabled: () => void;
  onFocusOut: () => void;
  registerAPI?: (dropdown: Dropdown | null) => void;
  onOpen?: (dropdown: Dropdown, e?: Event) => boolean | void;
  onClose?: (dropdown: Dropdown, e?: Event) => boolean | void;
  calculatePosition?: CalculatePosition;
}

function getRootNode(element: Element): HTMLElement {
  return element.getRootNode() as HTMLElement;
}

module('Integration | Component | basic-dropdown', function (hooks) {
  setupRenderingTest(hooks);

  test<ExtendedTestContext>('Its `toggle` action opens and closes the dropdown', async function (assert) {
    assert.expect(3);

    await render(
      <template>
        <BasicDropdown as |dropdown|>
          <button
            type="button"
            class="ember-basic-dropdown-trigger"
            {{on "click" dropdown.actions.toggle}}
          ></button>
          {{#if dropdown.isOpen}}
            <div id="dropdown-is-opened"></div>
          {{/if}}
        </BasicDropdown>
      </template>,
    );

    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .doesNotExist('The dropdown is closed');
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .exists('The dropdown is opened');
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .doesNotExist('The dropdown is closed again');
  });

  test<ExtendedTestContext>("The click event with the right button doesn't open it", async function (assert) {
    assert.expect(2);

    await render(
      <template>
        <BasicDropdown as |dd|>
          <dd.Trigger>Click me</dd.Trigger>
          {{#if dd.isOpen}}
            <div id="dropdown-is-opened"></div>
          {{/if}}
        </BasicDropdown>
      </template>,
    );

    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .doesNotExist('The dropdown is closed');
    await triggerEvent('.ember-basic-dropdown-trigger', 'click', { button: 2 });
    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .doesNotExist('The dropdown is closed');
  });

  test<ExtendedTestContext>('Its `open` action opens the dropdown', async function (assert) {
    assert.expect(3);

    await render(
      <template>
        <BasicDropdown as |dropdown|>
          <button
            type="button"
            class="ember-basic-dropdown-trigger"
            {{on "click" dropdown.actions.open}}
          ></button>
          {{#if dropdown.isOpen}}
            <div id="dropdown-is-opened"></div>
          {{/if}}
        </BasicDropdown>
      </template>,
    );

    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .doesNotExist('The dropdown is closed');
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .exists('The dropdown is opened');
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .exists('The dropdown is still opened');
  });

  test<ExtendedTestContext>('Its `close` action closes the dropdown', async function (assert) {
    assert.expect(3);

    await render(
      <template>
        <BasicDropdown @initiallyOpened={{true}} as |dropdown|>
          <button
            type="button"
            class="ember-basic-dropdown-trigger"
            {{on "click" dropdown.actions.close}}
          ></button>
          {{#if dropdown.isOpen}}
            <div id="dropdown-is-opened"></div>
          {{/if}}
        </BasicDropdown>
      </template>,
    );

    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .exists('The dropdown is opened');
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .doesNotExist('The dropdown is closed');
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .doesNotExist('The dropdown is still closed');
  });

  test<ExtendedTestContext>('It can receive an onOpen action that is fired just before the component opens', async function (assert) {
    const self = this;

    assert.expect(4);

    this.onOpen = function (dropdown: Dropdown, e?: Event) {
      assert.false(
        dropdown.isOpen,
        'The received dropdown has a `isOpen` property that is still false',
      );
      assert.ok(
        Object.prototype.hasOwnProperty.call(dropdown, 'actions'),
        'The received dropdown has a `actions` property',
      );
      assert.ok(!!e, 'Receives an argument as second argument');
      assert.ok(true, 'onOpen action was invoked');
    };
    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown @onOpen={{self.onOpen}} as |dropdown|>
          <button
            type="button"
            class="ember-basic-dropdown-trigger"
            {{on "click" dropdown.actions.open}}
          ></button>
          {{#if dropdown.isOpen}}
            <div id="dropdown-is-opened"></div>
          {{/if}}
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
  });

  test<ExtendedTestContext>('returning false from the `onOpen` action prevents the dropdown from opening', async function (assert) {
    const self = this;

    assert.expect(2);

    this.onOpen = function () {
      assert.ok(true, 'willOpen has been called');
      return false;
    };
    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown @onOpen={{self.onOpen}} as |dropdown|>
          <button
            type="button"
            class="ember-basic-dropdown-trigger"
            {{on "click" dropdown.actions.open}}
          ></button>
          {{#if dropdown.isOpen}}
            <div id="dropdown-is-opened"></div>
          {{/if}}
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .doesNotExist('The dropdown is still closed');
  });

  test<ExtendedTestContext>('It can receive an onClose action that is fired when the component closes', async function (assert) {
    const self = this;

    assert.expect(7);

    this.onClose = function (dropdown, e) {
      assert.true(
        dropdown.isOpen,
        'The received dropdown has a `isOpen` property and its value is `true`',
      );
      assert.ok(
        Object.prototype.hasOwnProperty.call(dropdown, 'actions'),
        'The received dropdown has a `actions` property',
      );
      assert.ok(!!e, 'Receives an argument as second argument');
      assert.ok(true, 'onClose action was invoked');
    };
    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown @onClose={{self.onClose}} as |dropdown|>
          <button
            type="button"
            class="ember-basic-dropdown-trigger"
            {{on "click" dropdown.actions.toggle}}
          ></button>
          {{#if dropdown.isOpen}}
            <div id="dropdown-is-opened"></div>
          {{/if}}
        </BasicDropdown>
      </template>,
    );

    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .doesNotExist('The dropdown is closed');
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .exists('The dropdown is opened');
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .doesNotExist('The dropdown is now opened');
  });

  test<ExtendedTestContext>('returning false from the `onClose` action prevents the dropdown from closing', async function (assert) {
    const self = this;

    assert.expect(4);

    this.onClose = function () {
      assert.ok(true, 'willClose has been invoked');
      return false;
    };
    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown @onClose={{self.onClose}} as |dropdown|>
          <button
            type="button"
            class="ember-basic-dropdown-trigger"
            {{on "click" dropdown.actions.toggle}}
          ></button>
          {{#if dropdown.isOpen}}
            <div id="dropdown-is-opened"></div>
          {{/if}}
        </BasicDropdown>
      </template>,
    );

    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .doesNotExist('The dropdown is closed');
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .exists('The dropdown is opened');
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .exists('The dropdown is still opened');
  });

  test<ExtendedTestContext>('It can be rendered already opened when the `initiallyOpened=true`', async function (assert) {
    assert.expect(1);

    await render(
      <template>
        <BasicDropdown @initiallyOpened={{true}} as |dropdown|>
          {{#if dropdown.isOpen}}
            <div id="dropdown-is-opened"></div>
          {{/if}}
        </BasicDropdown>
      </template>,
    );

    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .exists('The dropdown is opened');
  });

  test<ExtendedTestContext>('Calling the `open` method while the dropdown is already opened does not call `onOpen` action', async function (assert) {
    const self = this;

    assert.expect(1);
    let onOpenCalls = 0;
    this.onOpen = () => {
      onOpenCalls++;
    };

    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown @onOpen={{self.onOpen}} as |dropdown|>
          <button
            type="button"
            class="ember-basic-dropdown-trigger"
            {{on "click" dropdown.actions.open}}
          ></button>
          {{#if dropdown.isOpen}}
            <div id="dropdown-is-opened"></div>
          {{/if}}
        </BasicDropdown>
      </template>,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert.strictEqual(onOpenCalls, 1, 'onOpen has been called only once');
  });

  test<ExtendedTestContext>('Calling the `close` method while the dropdown is already opened does not call `onOpen` action', async function (assert) {
    const self = this;

    assert.expect(1);
    let onCloseCalls = 0;

    this.onClose = () => {
      onCloseCalls++;
    };

    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown @onClose={{self.onClose}} as |dropdown|>
          <button
            type="button"
            class="ember-basic-dropdown-trigger"
            {{on "click" dropdown.actions.close}}
          ></button>
          {{#if dropdown.isOpen}}
            <div id="dropdown-is-opened"></div>
          {{/if}}
        </BasicDropdown>
      </template>,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert.strictEqual(onCloseCalls, 0, 'onClose was never called');
  });

  test<ExtendedTestContext>('It adds the proper class to trigger and content when it receives `@horizontalPosition="right"`', async function (assert) {
    assert.expect(2);

    await render(
      <template>
        <BasicDropdown @horizontalPosition="right" as |dropdown|>
          <dropdown.Trigger>Press me</dropdown.Trigger>
          <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );

    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-trigger--right',
        'The proper class has been added',
      );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-content--right',
        'The proper class has been added',
      );
  });

  test<ExtendedTestContext>('It adds the proper class to trigger and content when it receives `horizontalPosition="center"`', async function (assert) {
    assert.expect(2);

    await render(
      <template>
        <BasicDropdown @horizontalPosition="center" as |dropdown|>
          <dropdown.Trigger>Press me</dropdown.Trigger>
          <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-trigger--center',
        'The proper class has been added',
      );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-content--center',
        'The proper class has been added',
      );
  });

  test<ExtendedTestContext>('It prefers right over left when it receives "auto-right"', async function (assert) {
    assert.expect(2);

    await render(
      <template>
        <BasicDropdown @horizontalPosition="auto-right" as |dropdown|>
          <dropdown.Trigger>Press me</dropdown.Trigger>
          <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-trigger--right',
        'The proper class has been added',
      );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-content--right',
        'The proper class has been added',
      );
  });

  test<ExtendedTestContext>('It adds the proper class to trigger and content when it receives `verticalPosition="above"`', async function (assert) {
    assert.expect(2);

    await render(
      <template>
        <BasicDropdown @verticalPosition="above" as |dropdown|>
          <dropdown.Trigger>Press me</dropdown.Trigger>
          <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-trigger--above',
        'The proper class has been added',
      );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-content--above',
        'The proper class has been added',
      );
  });

  test<ExtendedTestContext>('It passes the `renderInPlace` property to the yielded content component', async function (assert) {
    assert.expect(1);

    await render(
      <template>
        <BasicDropdown @renderInPlace={{true}} as |dropdown|>
          <dropdown.Trigger>Click me</dropdown.Trigger>
          <dropdown.Content><div
              id="dropdown-is-opened"
            ></div></dropdown.Content>
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .exists('The dropdown is rendered in place');
  });

  test<ExtendedTestContext>('It adds a special class to both trigger and content when `@renderInPlace={{true}}`', async function (assert) {
    assert.expect(2);

    await render(
      <template>
        <BasicDropdown @renderInPlace={{true}} as |dropdown|>
          <dropdown.Trigger>Click me</dropdown.Trigger>
          <dropdown.Content><div
              id="dropdown-is-opened"
            ></div></dropdown.Content>
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-trigger--in-place',
        'The trigger has a special `--in-place` class',
      );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-content--in-place',
        'The content has a special `--in-place` class',
      );
  });

  test<ExtendedTestContext>('When rendered in-place, the content still contains the --above/below classes', async function (assert) {
    assert.expect(2);

    await render(
      <template>
        <BasicDropdown @renderInPlace={{true}} as |dropdown|>
          <dropdown.Trigger>Click me</dropdown.Trigger>
          <dropdown.Content><div
              id="dropdown-is-opened"
            ></div></dropdown.Content>
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-content--below',
        'The content has a class indicating that it was placed below the trigger',
      );

    await render(
      <template>
        <BasicDropdown
          @renderInPlace={{true}}
          @verticalPosition="above"
          as |dropdown|
        >
          <dropdown.Trigger>Click me</dropdown.Trigger>
          <dropdown.Content><div
              id="dropdown-is-opened"
            ></div></dropdown.Content>
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-content--above',
        'The content has a class indicating that it was placed above the trigger',
      );
  });

  test<ExtendedTestContext>('It adds a wrapper element when `@renderInPlace={{true}}`', async function (assert) {
    assert.expect(2);

    await render(
      <template>
        <BasicDropdown @renderInPlace={{true}} as |dropdown|>
          <dropdown.Trigger>Click me</dropdown.Trigger>
          <dropdown.Content><div
              id="dropdown-is-opened"
            ></div></dropdown.Content>
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert.dom('.ember-basic-dropdown', getRootNode(this.element)).exists();
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-trigger--in-place',
        'The trigger has a special `--in-place` class',
      );
  });

  test<ExtendedTestContext>('When rendered in-place, it prefers right over left with position "auto-right"', async function (assert) {
    assert.expect(2);

    await render(
      <template>
        <BasicDropdown
          @renderInPlace={{true}}
          @horizontalPosition="auto-right"
          as |dropdown|
        >
          <dropdown.Trigger>Press me</dropdown.Trigger>
          <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-trigger--right',
        'The proper class has been added',
      );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-content--right',
        'The proper class has been added',
      );
  });

  test<ExtendedTestContext>('When rendered in-place, it applies right class for position "right"', async function (assert) {
    assert.expect(2);

    await render(
      <template>
        <BasicDropdown
          @renderInPlace={{true}}
          @horizontalPosition="right"
          as |dropdown|
        >
          <dropdown.Trigger>Press me</dropdown.Trigger>
          <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-trigger--right',
        'The proper class has been added',
      );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-content--right',
        'The proper class has been added',
      );
  });

  test<ExtendedTestContext>('[ISSUE #127] Having more than one dropdown with `@renderInPlace={{true}}` raises an exception', async function (assert) {
    assert.expect(1);

    await render(
      <template>
        <BasicDropdown @renderInPlace={{true}} />
        <BasicDropdown @renderInPlace={{true}} />
      </template>,
    );

    assert.ok(true, 'The test has run without errors');
  });

  test<ExtendedTestContext>('It passes the `disabled` property as part of the public API, and updates is if it changes', async function (assert) {
    const self = this;

    assert.expect(2);
    this.disabled = true;
    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown @disabled={{self.disabled}} as |dropdown|>
          {{#if dropdown.disabled}}
            <div id="disabled-dropdown-marker">Disabled!</div>
          {{else}}
            <div id="enabled-dropdown-marker">Enabled!</div>
          {{/if}}
        </BasicDropdown>
      </template>,
    );

    assert
      .dom('#disabled-dropdown-marker', getRootNode(this.element))
      .exists('The public API of the component is marked as disabled');
    this.set('disabled', false);
    assert
      .dom('#enabled-dropdown-marker', getRootNode(this.element))
      .exists('The public API of the component is marked as enabled');
  });

  test<ExtendedTestContext>('It passes the `uniqueId` property as part of the public API', async function (assert) {
    assert.expect(1);

    await render(
      <template>
        <BasicDropdown as |dropdown|>
          <div id="dropdown-unique-id-container">{{dropdown.uniqueId}}</div>
        </BasicDropdown>
      </template>,
    );

    assert
      .dom('#dropdown-unique-id-container', getRootNode(this.element))
      .hasText(/ember\d+/, 'It yields the uniqueId');
  });

  test<ExtendedTestContext>("If the dropdown gets disabled while it's open, it closes automatically", async function (assert) {
    const self = this;

    assert.expect(2);

    this.disabled = false;
    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown @disabled={{self.disabled}} as |dropdown|>
          <dropdown.Trigger>Click me</dropdown.Trigger>
          <dropdown.Content><div
              id="dropdown-is-opened"
            ></div></dropdown.Content>
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .exists('The select is open');
    this.set('disabled', true);
    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .doesNotExist('The select is now closed');
  });

  test<ExtendedTestContext>("If the component's `disabled` property changes, the `registerAPI` action is called", async function (assert) {
    const self = this;

    assert.expect(3);

    this.disabled = false;
    this.toggleDisabled = () => this.set('disabled', this.disabled);
    this.registerAPI = (api) => this.set('remoteController', api);
    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown
          @disabled={{self.disabled}}
          @registerAPI={{self.registerAPI}}
          as |dropdown|
        >
          <dropdown.Trigger>Click me</dropdown.Trigger>
        </BasicDropdown>
        <button type="button" {{on "click" self.toggleDisabled}}>Toggle</button>
        {{#if self.remoteController.disabled}}
          <div id="is-disabled"></div>
        {{/if}}
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('#is-disabled', getRootNode(this.element))
      .doesNotExist('The select is enabled');
    this.set('disabled', true);
    assert
      .dom('#is-disabled', getRootNode(this.element))
      .exists('The select is disabled');
    this.set('disabled', false);
    assert
      .dom('#is-disabled', getRootNode(this.element))
      .doesNotExist('The select is enabled again');
  });

  test<ExtendedTestContext>('It can receive `@destination="id-of-elmnt"` to customize where `#-in-element` is going to render the content', async function (assert) {
    assert.expect(1);

    await render(
      <template>
        <BasicDropdown @destination="id-of-elmnt" as |dd|>
          <dd.Trigger>Click me</dd.Trigger>
          <dd.Content>Hello</dd.Content>
        </BasicDropdown>
        <div id="id-of-elmnt"></div>
      </template>,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );

    assert
      .dom(
        (
          getRootNode(this.element).querySelector(
            '.ember-basic-dropdown-content',
          ) as HTMLElement
        ).parentNode as HTMLElement,
      )
      .hasAttribute(
        'id',
        'id-of-elmnt',
        'The content has been rendered in an alternative destination',
      );
  });

  // A11y
  test<ExtendedTestContext>('By default, the `aria-controls` attribute of the trigger contains the id of the content', async function (assert) {
    assert.expect(1);

    await render(
      <template>
        <BasicDropdown @renderInPlace={{true}} as |dropdown|>
          <dropdown.Trigger>Click me</dropdown.Trigger>
          <dropdown.Content><div
              id="dropdown-is-opened"
            ></div></dropdown.Content>
        </BasicDropdown>
      </template>,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    const content = getRootNode(this.element).querySelector(
      '.ember-basic-dropdown-content',
    ) as HTMLElement;
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasAttribute(
        'aria-controls',
        content.id,
        'The trigger controls the content',
      );
  });

  test<ExtendedTestContext>('When opened, the `aria-owns` attribute of the trigger parent contains the id of the content', async function (assert) {
    assert.expect(2);
    await render(
      <template>
        <BasicDropdown @renderInPlace={{true}} as |dropdown|>
          <dropdown.Trigger>Click me</dropdown.Trigger>
          <dropdown.Content><div
              id="dropdown-is-opened"
            ></div></dropdown.Content>
        </BasicDropdown>
      </template>,
    );
    const trigger = getRootNode(this.element).querySelector(
      '.ember-basic-dropdown-trigger',
    ) as HTMLElement;
    assert
      .dom(trigger.parentNode as HTMLElement)
      .doesNotHaveAttribute(
        'aria-owns',
        'Closed dropdown parent does not have aria-owns',
      );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    const content = getRootNode(this.element).querySelector(
      '.ember-basic-dropdown-content',
    ) as HTMLElement;
    assert
      .dom(trigger.parentNode as HTMLElement)
      .hasAttribute(
        'aria-owns',
        content.id,
        'The trigger parent owns the content',
      );
  });

  // Repositioning
  test<ExtendedTestContext>('The `reposition` public action returns an object with the changes', async function (assert) {
    const self = this;

    assert.expect(4);
    let remoteController: Dropdown | null = null;
    this.registerAPI = (api) => (remoteController = api);

    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown @registerAPI={{self.registerAPI}} as |dropdown|>
          <dropdown.Trigger>Click me</dropdown.Trigger>
          <dropdown.Content>
            <div id="dropdown-is-opened"></div>
          </dropdown.Content>
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );

    const returnValue = (
      remoteController as unknown as Dropdown
    )?.actions.reposition();
    assert.ok(Object.prototype.hasOwnProperty.call(returnValue, 'hPosition'));
    assert.ok(Object.prototype.hasOwnProperty.call(returnValue, 'vPosition'));
    assert.ok(Object.prototype.hasOwnProperty.call(returnValue, 'top'));
    assert.ok(Object.prototype.hasOwnProperty.call(returnValue, 'left'));
  });

  test<ExtendedTestContext>('The user can pass a custom `calculatePosition` function to customize how the component is placed on the screen', async function (assert) {
    const self = this;

    assert.expect(4);
    this.calculatePosition = function () {
      assert.ok('custom calculatePosition was passed to the component');
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
    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown
          @calculatePosition={{self.calculatePosition}}
          as |dropdown|
        >
          <dropdown.Trigger>Click me</dropdown.Trigger>
          <dropdown.Content>
            <div id="dropdown-is-opened"></div>
          </dropdown.Content>
        </BasicDropdown>
      </template>,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasClass('ember-basic-dropdown-content--above', 'The dropdown is above');
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-content--right',
        'The dropdown is in the right',
      );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasAttribute(
        'style',
        'top: 111px; width: 100px; height: 110px;',
        'The style attribute is the expected one',
      );
  });

  test<ExtendedTestContext>('The user can use the `renderInPlace` flag option to modify how the position is calculated in the `calculatePosition` function', async function (assert) {
    const self = this;

    assert.expect(4);
    this.calculatePosition = function (
      _triggerElement,
      _dropdownElement,
      _destinationElement,
      { renderInPlace },
    ) {
      assert.ok(
        renderInPlace,
        'custom calculatePosition with renderInPlace was passed to the component',
      );
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
          verticalPosition: 'below',
          style: {
            top: 333,
            right: 444,
          },
        };
      }
    };
    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown
          @calculatePosition={{self.calculatePosition}}
          @renderInPlace={{true}}
          as |dropdown|
        >
          <dropdown.Trigger>Click me</dropdown.Trigger>
          <dropdown.Content>
            <div id="dropdown-is-opened"></div>
          </dropdown.Content>
        </BasicDropdown>
      </template>,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasClass('ember-basic-dropdown-content--above', 'The dropdown is above');
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasClass(
        'ember-basic-dropdown-content--right',
        'The dropdown is in the right',
      );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasStyle(
        { top: '111px', right: '222px' },
        'The style attribute is the expected one',
      );
  });

  // Customization of inner components
  test<ExtendedTestContext>('It allows to customize the trigger passing `@triggerComponent="my-custom-trigger"`', async function (assert) {
    const self = this;

    assert.expect(1);

    this.triggerComponent = MyCustomTrigger;

    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown
          @triggerComponent={{self.triggerComponent}}
          as |dropdown|
        >
          <dropdown.Trigger>Press me</dropdown.Trigger>
          <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
        </BasicDropdown>
      </template>,
    );

    assert
      .dom('#my-custom-trigger', getRootNode(this.element))
      .exists('The custom component has been rendered');
  });

  test<ExtendedTestContext>('It allows to customize the content passing `contentComponent="my-custom-content"`', async function (assert) {
    const self = this;

    assert.expect(1);

    this.contentComponent = MyCustomContent;

    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown
          @contentComponent={{self.contentComponent}}
          as |dropdown|
        >
          <dropdown.Trigger>Press me</dropdown.Trigger>
          <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
        </BasicDropdown>
      </template>,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('#my-custom-content', getRootNode(this.element))
      .exists('The custom component has been rendered');
  });

  // State replacement
  test<ExtendedTestContext>('The registerAPI is called with every mutation of the publicAPI object', async function (assert) {
    const self = this;

    assert.expect(7);
    const apis: Dropdown[] = [];
    this.disabled = false;
    this.registerAPI = function (api) {
      if (api) {
        apis.push(api);
      }
    };
    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown
          @disabled={{self.disabled}}
          @registerAPI={{self.registerAPI}}
          as |dropdown|
        >
          <dropdown.Trigger>Open me</dropdown.Trigger>
          <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert.strictEqual(
      apis.length,
      3,
      'There have been 3 changes in the state of the public API',
    );
    assert.false(apis[0] ? apis[0].isOpen : true, 'The component was closed');
    assert.true(apis[1] ? apis[1].isOpen : false, 'Then it opened');
    assert.false(apis[2] ? apis[2].isOpen : true, 'Then it closed again');
    this.set('disabled', true);
    assert.strictEqual(apis.length, 4, 'There have been 4 changes now');
    assert.false(
      apis[2] ? apis[2].disabled : true,
      'the component was enabled',
    );
    assert.true(apis[3] ? apis[3].disabled : false, 'and it became disabled');
  });

  test<ExtendedTestContext>('removing the dropdown in response to onClose does not error', async function (assert) {
    const self = this;

    assert.expect(2);

    this.isOpen = true;

    this.onClose = () => {
      this.set('isOpen', false);
    };

    await render<ExtendedTestContext>(
      <template>
        {{#if self.isOpen}}
          <BasicDropdown @onClose={{self.onClose}} as |dropdown|>
            <dropdown.Trigger>Open me</dropdown.Trigger>
            <dropdown.Content><h3>Content of the dropdown</h3></dropdown.Content>
          </BasicDropdown>
        {{/if}}
      </template>,
    );

    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .exists('the dropdown is rendered');
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .doesNotExist('the dropdown has been removed');
  });

  test<ExtendedTestContext>('Dropdowns can be infinitely nested, clicking in children will not close parents, clicking in parents closes children', async function (assert) {
    assert.expect(12);

    await render(
      <template>
        <BasicDropdown as |parent|>
          <parent.Trigger class="parent" @htmlTag="button">Trigger of the first
            dropdown</parent.Trigger>
          <parent.Content @overlay={{true}}>
            <BasicDropdown as |child|>
              <p class="body-parent">
                <br />First level of the dropdpwn<br />
              </p>
              <child.Trigger class="child" @htmlTag="button">Trigger of the
                second dropdown</child.Trigger>
              <child.Content @overlay={{true}}>
                <p class="body-child">
                  <br />Second level of the second<br />
                  <BasicDropdown as |grandchild|>
                    <p>
                      <br />Second level of the dropdpwn<br />
                    </p>
                    <grandchild.Trigger
                      class="grandchild"
                      @htmlTag="button"
                    >Trigger of the Third dropdown</grandchild.Trigger>
                    <grandchild.Content @overlay={{true}}>
                      <p class="body-grandchild">
                        <br />Third level of the third<br />
                      </p>
                    </grandchild.Content>
                  </BasicDropdown>
                </p>
              </child.Content>
            </BasicDropdown>
          </parent.Content>
        </BasicDropdown>
      </template>,
    );

    //open the nested dropdown
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger.parent',
      ) as HTMLElement,
    );
    assert
      .dom('.body-parent', getRootNode(this.element))
      .exists('the parent dropdown is rendered');

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger.child',
      ) as HTMLElement,
    );
    assert
      .dom('.body-child', getRootNode(this.element))
      .exists('the child dropdown is rendered');

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger.grandchild',
      ) as HTMLElement,
    );
    assert
      .dom('.body-grandchild', getRootNode(this.element))
      .exists('the grandchild dropdown is rendered');

    // click in the grandchild dropdown
    await click(
      getRootNode(this.element).querySelector(
        '.body-grandchild',
      ) as HTMLElement,
    );
    assert
      .dom('.body-grandchild', getRootNode(this.element))
      .exists('can click in grandchild dropdown and still be open');
    assert
      .dom('.body-child', getRootNode(this.element))
      .exists('can click in grandchild dropdown and still be open');
    assert
      .dom('.body-parent', getRootNode(this.element))
      .exists('can click in grandchild dropdown and still be open');

    // click in the child dropdown
    await click(
      getRootNode(this.element).querySelector('.body-child') as HTMLElement,
    );
    assert
      .dom('.body-grandchild', getRootNode(this.element))
      .doesNotExist(
        'grandchild dropdown should not exist becuase we clicked in child',
      );
    assert
      .dom('.body-child', getRootNode(this.element))
      .exists('can click in child dropdown and still be open');
    assert
      .dom('.body-parent', getRootNode(this.element))
      .exists('can click in child dropdown and still be open');

    // click in the parent dropdown
    await click(
      getRootNode(this.element).querySelector('.body-parent') as HTMLElement,
    );
    assert
      .dom('.body-grandchild', getRootNode(this.element))
      .doesNotExist(
        'grandchild dropdown should not exist becuase we clicked in parent',
      );
    assert
      .dom('.body-child', getRootNode(this.element))
      .doesNotExist(
        'child dropdown should not exist becuase we clicked in parent',
      );
    assert
      .dom('.body-parent', getRootNode(this.element))
      .exists('can click in parent dropdown and still be open');
  });

  // Misc bugfixes
  test<ExtendedTestContext>('[BUGFIX] Dropdowns rendered in place do not register events twice', async function (assert) {
    const self = this;

    assert.expect(2);
    let called = false;
    this.onFocusOut = function () {
      assert.notOk(called);
      called = true;
    };
    this.onOpen = function () {
      assert.ok(true);
    };
    await render<ExtendedTestContext>(
      <template>
        <input type="text" id="outer-input" />
        <BasicDropdown
          @renderInPlace={{true}}
          @onOpen={{self.onOpen}}
          as |dropdown|
        >
          <dropdown.Trigger>Open me</dropdown.Trigger>
          <dropdown.Content {{on "focusout" self.onFocusOut}}><input
              type="text"
              id="inner-input"
            /></dropdown.Content>
        </BasicDropdown>
      </template>,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    await focus(
      getRootNode(this.element).querySelector('#inner-input') as HTMLElement,
    );
    await focus(
      getRootNode(this.element).querySelector('#outer-input') as HTMLElement,
    );
  });

  test<ExtendedTestContext>('[BUGFIX] It protects the inline styles from undefined values returned in the `calculatePosition` callback', async function (assert) {
    const self = this;

    assert.expect(1);
    this.calculatePosition = function () {
      return {
        horizontalPosition: 'auto',
        verticalPosition: 'auto',
        style: {},
      };
    };
    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown
          @calculatePosition={{self.calculatePosition}}
          as |dropdown|
        >
          <dropdown.Trigger>Open me</dropdown.Trigger>
          <dropdown.Content>Some content</dropdown.Content>
        </BasicDropdown>
      </template>,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .doesNotHaveAttribute('style');
  });

  test<ExtendedTestContext>('It includes the inline styles returned from the `calculatePosition` callback', async function (assert) {
    const self = this;

    assert.expect(1);
    this.calculatePosition = function () {
      return {
        horizontalPosition: 'auto',
        verticalPosition: 'auto',
        style: {
          'max-height': '500px',
          'overflow-y': 'auto',
        },
      };
    };
    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown
          @calculatePosition={{self.calculatePosition}}
          as |dropdown|
        >
          <dropdown.Trigger>Open me</dropdown.Trigger>
          <dropdown.Content>Some content</dropdown.Content>
        </BasicDropdown>
      </template>,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasAttribute('style', /max-height: 500px; overflow-y: auto/);
  });

  /**
   * Tests related to https://github.com/cibernox/ember-basic-dropdown/issues/615
   * Just in case animationEnabled on TEST ENV, this test would cover this change
   */

  test.skip<ExtendedTestContext>('[BUGFIX] Dropdowns rendered in place have correct animation flow', async function (assert) {
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
        `,
    );

    await render(
      <template>
        <BasicDropdown @renderInPlace={{true}} as |dropdown|>
          <dropdown.Trigger><button type="button">Open me</button></dropdown.Trigger>
          <dropdown.Content><div
              id="dropdown-is-opened"
            >CONTENT</div></dropdown.Content>
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );

    assert
      .dom(`.${basicDropdownContentClass}`)
      .hasClass(
        transitioningInClass,
        `The dropdown content has .${transitioningInClass} class`,
      );

    await waitUntil(() =>
      find('.ember-basic-dropdown-content')?.classList.contains(
        transitionedInClass,
      ),
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );

    assert
      .dom(`.${basicDropdownContentClass}`)
      .hasClass(
        transitioningOutClass,
        `The dropdown content has .${transitioningOutClass} class`,
      );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );

    assert
      .dom(`.${basicDropdownContentClass}`)
      .hasClass(
        transitioningInClass,
        `After closing dropdown, the dropdown content has .${transitioningInClass} class again as initial value`,
      );

    await waitUntil(() =>
      find('.ember-basic-dropdown-content')?.classList.contains(
        transitionedInClass,
      ),
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );

    assert
      .dom(`.${basicDropdownContentClass}`)
      .hasClass(
        transitioningOutClass,
        `The dropdown content has .${transitioningOutClass} class`,
      );
  });

  // Styles properly get reset
  test<ExtendedTestContext>('Styles properly get reset if the positioning changes while open', async function (assert) {
    const self = this;

    assert.expect(4);
    let publicApi: Dropdown | null = null;
    this.registerAPI = (api) => (publicApi = api);

    let timesCalled = 0;
    this.calculatePosition = function () {
      const style: Record<string, string | number> = {
        top: 111,
      };
      let horizontalPosition: HorizontalPosition;
      if (timesCalled % 2 === 1) {
        style['right'] = 100;
        horizontalPosition = 'right';
      } else {
        style['left'] = 100;
        horizontalPosition = 'left';
      }

      timesCalled++;

      return {
        horizontalPosition,
        verticalPosition: 'above',
        style,
      };
    };

    await render<ExtendedTestContext>(
      <template>
        <BasicDropdown
          @registerAPI={{self.registerAPI}}
          @calculatePosition={{self.calculatePosition}}
          as |dropdown|
        >
          <dropdown.Trigger>Click me</dropdown.Trigger>
          <dropdown.Content>
            <div id="dropdown-is-opened"></div>
          </dropdown.Content>
        </BasicDropdown>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );

    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasStyle(
        { top: '111px', left: '100px' },
        'The style attribute is the expected one',
      );

    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .doesNotHaveStyle(
        { right: '100px' },
        'The style attribute is the expected one',
      );

    (publicApi as unknown as Dropdown).actions.reposition();

    await settled();

    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasStyle(
        { top: '111px', right: '100px' },
        'The style attribute is the expected one',
      );

    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .doesNotHaveStyle(
        { left: '100px' },
        'The style attribute is the expected one',
      );
  });

  // Shadow dom test
  test<ExtendedTestContext>('Shadow dom: Its `toggle` action opens and closes the dropdown', async function (assert) {
    const wormhole = document.createElement('div');
    wormhole.id = 'ember-basic-dropdown-wormhole';
    document.getElementById('ember-testing')?.appendChild(wormhole);

    await render<ExtendedTestContext>(
      <template>
        <Shadow>
          <BasicDropdown as |dropdown|>
            <dropdown.Trigger>Click me</dropdown.Trigger>
            <dropdown.Content>
              <div id="dropdown-is-opened"></div>
            </dropdown.Content>
          </BasicDropdown>
        </Shadow>
      </template>,
    );

    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .doesNotExist('The dropdown is closed');

    const triggerElement = find('[data-shadow]')?.shadowRoot?.querySelector(
      '.ember-basic-dropdown-trigger',
    );

    if (triggerElement) {
      await click(triggerElement);
    }

    assert
      .dom('.ember-basic-dropdown-content')
      .exists('The dropdown is rendered');

    assert.dom('#dropdown-is-opened').exists('The dropdown is opened');

    if (triggerElement) {
      await click(triggerElement);
    }

    assert
      .dom('#dropdown-is-opened')
      .doesNotExist('The dropdown is closed again');

    wormhole.remove();
  });

  test<ExtendedTestContext>('Shadow dom: Its `toggle` action opens and closes the dropdown with renderInPlace', async function (assert) {
    await render(
      <template>
        <Shadow>
          <BasicDropdown @renderInPlace={{true}} as |dropdown|>
            <dropdown.Trigger>Click me</dropdown.Trigger>
            <dropdown.Content>
              <div
                style="height: 100px; width: 100px; background: black"
                id="dropdown-is-opened"
              ></div>
            </dropdown.Content>
          </BasicDropdown>
        </Shadow>
      </template>,
    );

    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .doesNotExist('The dropdown is closed');

    const triggerElement = find('[data-shadow]')?.shadowRoot?.querySelector(
      '.ember-basic-dropdown-trigger',
    );

    if (triggerElement) {
      await click(triggerElement);
    }

    assert
      .dom('.ember-basic-dropdown-content', find('[data-shadow]')?.shadowRoot)
      .exists('The dropdown is rendered');

    assert
      .dom('#dropdown-is-opened', find('[data-shadow]')?.shadowRoot)
      .exists('The dropdown is opened');

    await click(
      find('[data-shadow]')?.shadowRoot?.getElementById(
        'dropdown-is-opened',
      ) as HTMLElement,
    );

    assert
      .dom('#dropdown-is-opened', find('[data-shadow]')?.shadowRoot)
      .exists('The dropdown stays opened when clicking content');

    if (triggerElement) {
      await click(triggerElement);
    }

    assert
      .dom('#dropdown-is-opened', find('[data-shadow]')?.shadowRoot)
      .doesNotExist('The dropdown is closed again');

    if (triggerElement) {
      await click(triggerElement);
    }

    assert
      .dom('#dropdown-is-opened', find('[data-shadow]')?.shadowRoot)
      .exists('The dropdown is opened 2d time');

    await click(
      find('[data-shadow]')?.shadowRoot?.getElementById(
        'dropdown-is-opened',
      ) as HTMLElement,
    );

    assert
      .dom('#dropdown-is-opened', find('[data-shadow]')?.shadowRoot)
      .exists('The dropdown stays opened when clicking content after 2d open');
  });

  test<ExtendedTestContext>('Shadow dom: Its `toggle` action opens and closes the dropdown when wormhole is inside shadow dom', async function (assert) {
    await render(
      <template>
        <Shadow>
          <BasicDropdown @destination="wormhole-in-shadow-dom" as |dropdown|>
            <dropdown.Trigger>Click me</dropdown.Trigger>
            <dropdown.Content>
              <div id="dropdown-is-opened"></div>
            </dropdown.Content>
          </BasicDropdown>

          <div id="wormhole-in-shadow-dom"></div>
        </Shadow>
      </template>,
    );

    assert
      .dom('#dropdown-is-opened', getRootNode(this.element))
      .doesNotExist('The dropdown is closed');

    const shadowRoot = find('[data-shadow]')?.shadowRoot;

    const triggerElement = shadowRoot?.querySelector(
      '.ember-basic-dropdown-trigger',
    );

    if (triggerElement) {
      await click(triggerElement);
    }

    assert
      .dom(shadowRoot?.querySelector('.ember-basic-dropdown-content'))
      .exists('The dropdown is rendered');

    assert
      .dom(shadowRoot?.querySelector('#dropdown-is-opened'))
      .exists('The dropdown is opened');

    if (triggerElement) {
      await click(triggerElement);
    }

    assert
      .dom(shadowRoot?.querySelector('#dropdown-is-opened'))
      .doesNotExist('The dropdown is closed again');
  });
});
