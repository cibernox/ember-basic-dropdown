import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';
import {
  render,
  triggerEvent,
  triggerKeyEvent,
  tap,
  click,
  focus,
  type TestContext,
} from '@ember/test-helpers';
import type { Dropdown } from 'ember-basic-dropdown/types';

interface ExtendedTestContext extends TestContext {
  element: HTMLElement;
  dropdown: Dropdown;
  // divVisible?: boolean;
  // onFocusIn: (dropdown?: Dropdown, event?: FocusEvent) => void;
  // onFocusOut: (dropdown?: Dropdown, event?: FocusEvent) => void;
  onMouseEnter: (dropdown?: Dropdown, event?: MouseEvent) => void;
  onBlur: (dropdown?: Dropdown, event?: FocusEvent) => void;
  onClick: (dropdown?: Dropdown, event?: MouseEvent) => void;
  onFocus: (dropdown?: Dropdown, event?: FocusEvent) => void;
  onFocusIn: (dropdown?: Dropdown, event?: FocusEvent) => void;
  onFocusOut: (dropdown?: Dropdown, event?: FocusEvent) => void;
  onKeyDown: (dropdown?: Dropdown, event?: KeyboardEvent) => void;
  onMouseDown: (dropdown?: Dropdown, event?: MouseEvent) => void;
  onMouseLeave: (dropdown?: Dropdown, event?: MouseEvent) => void;
  onTouchEnd: (dropdown?: Dropdown, event?: TouchEvent) => void;
  touchEnd: (e: Event) => void;
  keyDown: (e: Event) => void;
  mouseDown: (e: Event) => void;
  click: (e: Event) => void;
  handlerInParent: (e: Event) => void;
  // onMouseLeave: (dropdown?: Dropdown, event?: MouseEvent) => void;
  // shouldReposition?: (
  //   mutations: MutationRecord[],
  //   dropdown?: Dropdown,
  // ) => boolean;
}

function getRootNode(element: Element): HTMLElement {
  return element.getRootNode() as HTMLElement;
}

const dropdownBase: Dropdown = {
  uniqueId: '',
  isOpen: false,
  disabled: false,
  actions: {
    toggle: () => {},
    close: () => {},
    open: () => {},
    reposition: () => {
      return undefined;
    },
    registerTriggerElement: () => {},
    registerDropdownElement: () => {},
    getTriggerElement: () => {
      return null;
    },
  },
};

module('Integration | Component | basic-dropdown-trigger', function (hooks) {
  setupRenderingTest(hooks);

  test<ExtendedTestContext>('It renders the given block in a div with class `ember-basic-dropdown-trigger`, with no wrapper around', async function (assert) {
    assert.expect(2);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
    };
    await render<ExtendedTestContext>(hbs`
      <div id="direct-parent">
        <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
      </div>
    `);

    assert
      .dom(
        '#direct-parent > .ember-basic-dropdown-trigger',
        getRootNode(this.element),
      )
      .exists('The trigger is not wrapped');
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasText('Click me', 'The trigger contains the given block');
  });

  test<ExtendedTestContext>('If a `@defaultClass` argument is provided to the trigger, its value is added to the list of classes', async function (assert) {
    assert.expect(1);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
    };
    await render<ExtendedTestContext>(hbs`
      <div id="direct-parent">
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @defaultClass="extra-class">Click me</BasicDropdownTrigger>
      </div>
    `);

    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasClass('extra-class');
  });

  // Attributes and a11y
  test<ExtendedTestContext>("If it doesn't receive any tabindex, defaults to 0", async function (assert) {
    assert.expect(1);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasAttribute('tabindex', '0', 'Has a tabindex of 0');
  });

  test<ExtendedTestContext>('If it receives a tabindex={{false}}, it removes the tabindex', async function (assert) {
    assert.expect(1);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger tabindex={{false}} @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .doesNotHaveAttribute('tabindex');
  });

  test<ExtendedTestContext>('If it receives `tabindex="3"`, the tabindex of the element is 3', async function (assert) {
    assert.expect(1);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} tabindex="3">Click me</BasicDropdownTrigger>
    `);

    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasAttribute('tabindex', '3', 'Has a tabindex of 3');
  });

  test<ExtendedTestContext>('If it receives `title="something"`, if has that title attribute', async function (assert) {
    assert.expect(1);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} title="foobar">Click me</BasicDropdownTrigger>
    `);

    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasAttribute('title', 'foobar', 'Has the given title');
  });

  test<ExtendedTestContext>('If it receives `id="some-id"`, if has that id', async function (assert) {
    assert.expect(1);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} id="my-own-id">Click me</BasicDropdownTrigger>
    `);

    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasAttribute('id', 'my-own-id', 'Has the given id');
  });

  test<ExtendedTestContext>("If the dropdown is disabled, the trigger doesn't have tabindex attribute", async function (assert) {
    assert.expect(1);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      disabled: true,
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .doesNotHaveAttribute('tabindex', "The component doesn't have tabindex");
  });

  test<ExtendedTestContext>('If it belongs to a disabled dropdown, it gets an `aria-disabled=true` attribute for a11y', async function (assert) {
    assert.expect(2);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      disabled: true,
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasAttribute('aria-disabled', 'true', 'It is marked as disabled');
    this.set('dropdown', { ...this.dropdown, disabled: false });
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasAttribute('aria-disabled', 'false', 'It is NOT marked as disabled');
  });

  test<ExtendedTestContext>('If the received dropdown is open, it has an `aria-expanded="true"` attribute, otherwise `"false"`', async function (assert) {
    assert.expect(2);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      isOpen: false,
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasAttribute('aria-expanded', 'false', 'the aria-expanded is false');
    this.set('dropdown', { ...this.dropdown, isOpen: true });
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasAttribute('aria-expanded', 'true', 'the aria-expanded is true');
  });

  test<ExtendedTestContext>('If it has an `aria-controls="foo123"` attribute pointing to the id of the content', async function (assert) {
    assert.expect(1);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasAttribute('aria-controls', 'ember-basic-dropdown-content-123');
  });

  test<ExtendedTestContext>('If it receives `@htmlTag`, the trigger uses that tag name', async function (assert) {
    assert.expect(2);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} @htmlTag="button" type="button">Click me</BasicDropdownTrigger>
    `);
    assert.strictEqual(
      (
        getRootNode(this.element).querySelector(
          '.ember-basic-dropdown-trigger',
        ) as HTMLElement
      ).tagName,
      'BUTTON',
    );
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasAttribute('type', 'button');
  });

  test<ExtendedTestContext>('If it receives `role="presentation"` it gets that attribute', async function (assert) {
    assert.expect(1);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} role="presentation">Click me</BasicDropdownTrigger>
    `);
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasAttribute('role', 'presentation');
  });

  test<ExtendedTestContext>('If it receives `aria-owns="custom-owns"` it gets that attribute', async function (assert) {
    assert.expect(1);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} aria-owns="custom-owns">Click me</BasicDropdownTrigger>
    `);
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasAttribute('aria-owns', 'custom-owns');
  });

  test<ExtendedTestContext>('If it receives `aria-controls="custom-controls"` it gets that attribute', async function (assert) {
    assert.expect(1);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} aria-controls="custom-controls">Click me</BasicDropdownTrigger>
    `);
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasAttribute('aria-controls', 'custom-controls');
  });

  test<ExtendedTestContext>('If it does not receive an specific `role`, the default is `button`', async function (assert) {
    assert.expect(1);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);
    assert
      .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
      .hasAttribute('role', 'button');
  });

  // Custom actions
  test<ExtendedTestContext>('the user can bind arbitrary events to the trigger', async function (assert) {
    assert.expect(2);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
    };
    this.onMouseEnter = (dropdown, e) => {
      assert.deepEqual(
        dropdown,
        this.dropdown,
        'receives the dropdown as 1st argument',
      );
      assert.ok(
        e instanceof window.Event,
        'It receives the event as second argument',
      );
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} {{on "mouseenter" (fn this.onMouseEnter this.dropdown)}}>Click me</BasicDropdownTrigger>
    `);
    await triggerEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'mouseenter',
    );
  });

  // Default behaviour
  test<ExtendedTestContext>('click events invoke the `toggle` action on the dropdown by default', async function (assert) {
    assert.expect(3);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
        },
      },
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);
    await triggerEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'click',
    );
  });

  test<ExtendedTestContext>('mousedown events DO NOT invoke the `toggle` action on the dropdown by default', async function (assert) {
    assert.expect(0);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle() {
          assert.ok(false);
        },
      },
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);
    await triggerEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'mousedown',
    );
  });

  test<ExtendedTestContext>('click events DO NOT invoke the `toggle` action on the dropdown if `@eventType="mousedown"`', async function (assert) {
    assert.expect(0);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle() {
          assert.ok(false);
        },
      },
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} @eventType="mousedown">Click me</BasicDropdownTrigger>
    `);
    await triggerEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'click',
    );
  });

  test<ExtendedTestContext>('mousedown events invoke the `toggle` action on the dropdown if `eventType="mousedown"', async function (assert) {
    assert.expect(3);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
        },
      },
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} @eventType="mousedown">Click me</BasicDropdownTrigger>
    `);
    await triggerEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'mousedown',
    );
  });

  test<ExtendedTestContext>('when `stopPropagation` is true the `click` event does not bubble', async function (assert) {
    assert.expect(3);
    this.handlerInParent = () =>
      assert.ok(false, 'This should never be called');

    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
        },
      },
    };
    await render<ExtendedTestContext>(hbs`
      <div role="button" {{on "click" this.handlerInParent}}>
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @stopPropagation={{true}} role="presentation">Click me</BasicDropdownTrigger>
      </div>
    `);
    await triggerEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'click',
    );
  });

  test<ExtendedTestContext>('when `stopPropagation` is true and eventType is true, the `click` event does not bubble', async function (assert) {
    assert.expect(3);
    this.handlerInParent = () =>
      assert.ok(false, 'This should never be called');

    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
        },
      },
    };
    await render<ExtendedTestContext>(hbs`
      <div role="button" {{on "click" this.handlerInParent}}>
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @stopPropagation={{true}} role="presentation">Click me</BasicDropdownTrigger>
      </div>
    `);
    await triggerEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'click',
    );
  });

  test<ExtendedTestContext>('Pressing ENTER fires the `toggle` action on the dropdown', async function (assert) {
    assert.expect(3);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
        },
      },
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'keydown',
      13,
    );
  });

  test<ExtendedTestContext>('Pressing SPACE fires the `toggle` action on the dropdown and preventsDefault to avoid scrolling', async function (assert) {
    assert.expect(4);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
          assert.ok(e?.defaultPrevented, 'The event is defaultPrevented');
        },
      },
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'keydown',
      32,
    );
  });

  test<ExtendedTestContext>('Pressing ESC fires the `close` action on the dropdown', async function (assert) {
    assert.expect(3);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        close(e) {
          assert.ok(true, 'The `close()` action has been fired');
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
        },
      },
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'keydown',
      27,
    );
  });

  test<ExtendedTestContext>('Pressing ENTER/SPACE/ESC does nothing if there is a `{{on "keydown"}}` event that calls stopImmediatePropagation', async function (assert) {
    assert.expect(0);
    this.keyDown = (e) => e.stopImmediatePropagation();
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        close() {
          assert.ok(false, 'This action is not called');
        },
        toggle() {
          assert.ok(false, 'This action is not called');
        },
      },
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} {{on "keydown" this.keyDown}}>Click me</BasicDropdownTrigger>
    `);

    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'keydown',
      13,
    );
    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'keydown',
      32,
    );
    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'keydown',
      27,
    );
  });

  test<ExtendedTestContext>('Tapping invokes the toggle action on the dropdown', async function (assert) {
    assert.expect(4);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.strictEqual(
            e?.type,
            'touchend',
            'The event that toggles the dropdown is the touchend',
          );
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
        },
      },
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);
    await tap(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
  });

  test<ExtendedTestContext>("Firing a mousemove between a touchstart and a touchend (touch scroll) doesn't fire the toggle action", async function (assert) {
    assert.expect(0);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle() {
          assert.ok(false, 'This action in not called');
        },
      },
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    await triggerEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'touchstart',
    );
    await triggerEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'touchmove',
      {
        changedTouches: [{ touchType: 'direct', pageX: 0, pageY: 0 }],
      },
    );
    await triggerEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'touchend',
      {
        changedTouches: [{ touchType: 'direct', pageX: 0, pageY: 10 }],
      },
    );
  });

  test<ExtendedTestContext>('Using stylus on touch device will handle scroll/tap to fire toggle action properly', async function (assert) {
    assert.expect(1);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle() {
          assert.ok(true, 'The toggle action is called');
        },
        reposition() {
          return undefined;
        },
      },
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    // scroll
    await triggerEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'touchstart',
    );
    await triggerEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'touchmove',
      {
        changedTouches: [{ touchType: 'stylus', pageX: 0, pageY: 0 }],
      },
    );
    await triggerEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'touchend',
      {
        changedTouches: [{ touchType: 'stylus', pageX: 0, pageY: 10 }],
      },
    );

    // tap
    await triggerEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'touchstart',
    );
    await triggerEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'touchmove',
      {
        changedTouches: [{ touchType: 'stylus', pageX: 0, pageY: 0 }],
      },
    );
    await triggerEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'touchend',
      {
        changedTouches: [{ touchType: 'stylus', pageX: 4, pageY: 0 }],
      },
    );
  });

  test<ExtendedTestContext>("If its dropdown is disabled it won't respond to mouse, touch or keyboard event", async function (assert) {
    assert.expect(0);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      disabled: true,
      actions: {
        ...dropdownBase.actions,
        toggle() {
          assert.ok(false, 'This action in not called');
        },
        open() {
          assert.ok(false, 'This action in not called');
        },
        close() {
          assert.ok(false, 'This action in not called');
        },
      },
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);
    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
    await tap('.ember-basic-dropdown-trigger');
    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'keydown',
      13,
    );
    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'keydown',
      32,
    );
    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'keydown',
      27,
    );
  });

  // Decorating and overriding default event handlers
  test<ExtendedTestContext>('A user-supplied {{on "mousedown"}} callback will execute before the default toggle behavior', async function (assert) {
    assert.expect(3);
    let userActionRunFirst = false;

    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle: () => {
          assert.ok(
            userActionRunFirst,
            'User-supplied `{{on "mousedown"}}` ran before default `toggle`',
          );
        },
      },
    };

    this.mouseDown = (e: Event) => {
      assert.ok(true, 'The `userSuppliedAction()` action has been fired');
      assert.ok(e instanceof window.Event, 'It receives the event');
      userActionRunFirst = true;
    };

    await render<ExtendedTestContext>(hbs`
      {{!-- template-lint-disable no-pointer-down-event-binding --}}
      <BasicDropdownTrigger {{on "mousedown" this.mouseDown}} @dropdown={{this.dropdown}} @eventType="mousedown">Click me</BasicDropdownTrigger>
    `);

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
  });

  test<ExtendedTestContext>('A user-supplied {{on "click"}} callback that calls `stopImmediatePropagation`, will prevent the default behavior', async function (assert) {
    assert.expect(1);

    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle: () => {
          assert.ok(false, 'Default `toggle` action should not run');
        },
      },
    };

    this.click = (e: Event) => {
      e.stopImmediatePropagation();
      assert.ok(true, 'The `userSuppliedAction()` action has been fired');
    };

    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger {{on "click" this.click}} @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
  });

  test<ExtendedTestContext>('A user-supplied {{on "mousedown"}} callback that calls `stopImmediatePropagation` will prevent the default behavior', async function (assert) {
    assert.expect(1);

    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle: () => {
          assert.ok(false, 'Default `toggle` action should not run');
        },
      },
    };

    this.mouseDown = (e: Event) => {
      e.stopImmediatePropagation();
      assert.ok(true, 'The user-supplied action has been fired');
    };

    await render<ExtendedTestContext>(hbs`
      {{!-- template-lint-disable no-pointer-down-event-binding --}}
      <BasicDropdownTrigger {{on "mousedown" this.mouseDown}} @dropdown={{this.dropdown}} @eventType="mousedown">Click me</BasicDropdownTrigger>
    `);

    await click(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
  });

  test<ExtendedTestContext>('A user-supplied {{on "touchend"}} callback will execute before the default toggle behavior', async function (assert) {
    assert.expect(3);
    let userActionRunFirst = false;

    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle: () => {
          assert.ok(
            userActionRunFirst,
            'User-supplied `{{on "touchend"}}` ran before default `toggle`',
          );
        },
      },
    };

    this.touchEnd = (e: Event) => {
      assert.ok(true, 'The user-supplied touchend callback has been fired');
      assert.ok(e instanceof window.Event, 'It receives the event');
      userActionRunFirst = true;
    };

    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger {{on "touchend" this.touchEnd}} @dropdown={{this.dropdown}}>
        Click me
      </BasicDropdownTrigger>
    `);
    await tap(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
  });

  test<ExtendedTestContext>('A user-supplied {{on "touchend"}} callback calling e.stopImmediatePropagation will prevent the default behavior', async function (assert) {
    assert.expect(2);

    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle: (e) => {
          assert.notEqual(
            e?.type,
            'touchend',
            'Default `toggle` action should not run',
          );
        },
      },
    };

    this.touchEnd = (e: Event) => {
      e.stopImmediatePropagation();
      assert.ok(true, 'The user-supplied touchend callback has been fired');
    };

    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger {{on "touchend" this.touchEnd}} @dropdown={{this.dropdown}}>
        Click me
      </BasicDropdownTrigger>
    `);
    await tap(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
  });

  test<ExtendedTestContext>('A user-supplied `{{on "keydown"}}` action will execute before the default toggle behavior', async function (assert) {
    assert.expect(3);
    let userActionRunFirst = false;

    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle: () => {
          assert.ok(
            userActionRunFirst,
            'User-supplied `{{on "keydown}}` ran before default `toggle`',
          );
        },
      },
    };

    this.keyDown = (e: Event) => {
      assert.ok(true, 'The `userSuppliedAction()` action has been fired');
      assert.ok(e instanceof window.Event, 'It receives the event');
      userActionRunFirst = true;
    };

    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger {{on "keydown" this.keyDown}} @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);
    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'keydown',
      13,
    ); // Enter
  });

  test<ExtendedTestContext>('A user-supplied `{{on "keydown"}}` action calling `stopImmediatePropagation` will prevent the default behavior', async function (assert) {
    assert.expect(1);

    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle: () => {
          assert.ok(false, 'Default `toggle` action should not run');
        },
      },
    };

    this.keyDown = (e: Event) => {
      e.stopImmediatePropagation();
      assert.ok(true, 'The `userSuppliedAction()` action has been fired');
    };

    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger {{on "keydown" this.keyDown}} @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);
    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
      'keydown',
      13,
    ); // Enter
  });

  test<ExtendedTestContext>('Tapping an SVG inside of the trigger invokes the toggle action on the dropdown', async function (assert) {
    assert.expect(3);
    this.dropdown = {
      ...dropdownBase,
      uniqueId: '123',
      actions: {
        ...dropdownBase.actions,
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
        },
      },
    };
    await render<ExtendedTestContext>(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}><svg class="trigger-child-svg">Click me</svg></BasicDropdownTrigger>
    `);
    await tap(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-trigger',
      ) as HTMLElement,
    );
  });

  /**
   * Tests related to https://github.com/cibernox/ember-basic-dropdown/issues/498
   * Can be removed when the template `V1` compatability event handlers are removed.
   */
  module('trigger event handlers', function (hooks) {
    hooks.beforeEach(function () {
      this.set('dropdown', {
        ...dropdownBase,
        uniqueId: 'e123',
        actions: { ...dropdownBase.actions, toggle: () => {} },
      });
    });

    function assertCommonEventHandlerArgs(
      this: ExtendedTestContext,
      assert: Assert,
      args: [Dropdown, Event | undefined],
    ) {
      const [dropdown, e] = args;

      assert.ok(
        dropdown.uniqueId === this.dropdown.uniqueId,
        'It receives the dropdown argument as the first argument',
      );
      assert.ok(
        e instanceof window.Event,
        'It receives the event as second argument',
      );
      assert.ok(args.length === 2, 'It receives only 2 arguments');
    }

    test<ExtendedTestContext>('It properly handles the onBlur action', async function (assert) {
      assert.expect(4);

      const onBlur = (dropdown: Dropdown, e?: FocusEvent) => {
        assert.ok(true, 'The `onBlur()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, [dropdown, e]);
      };

      this.set('onBlur', onBlur);

      await render<ExtendedTestContext>(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onBlur={{this.onBlur}}>hello</BasicDropdownTrigger>
      `);
      await triggerEvent(
        getRootNode(this.element).querySelector(
          '.ember-basic-dropdown-trigger',
        ) as HTMLElement,
        'blur',
      ); // For some reason, `blur` test-helper fails here
    });

    test<ExtendedTestContext>('It properly handles the onClick action', async function (assert) {
      assert.expect(4);

      const onClick = (dropdown: Dropdown, e?: MouseEvent) => {
        assert.ok(true, 'The `onClick()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, [dropdown, e]);
      };

      this.set('onClick', onClick);

      await render<ExtendedTestContext>(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onClick={{this.onClick}}>hello</BasicDropdownTrigger>
      `);
      await click(
        getRootNode(this.element).querySelector(
          '.ember-basic-dropdown-trigger',
        ) as HTMLElement,
      );
    });

    test<ExtendedTestContext>('It properly handles the onFocus action', async function (assert) {
      assert.expect(4);

      const onFocus = (dropdown: Dropdown, e?: FocusEvent) => {
        assert.ok(true, 'The `onFocus()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, [dropdown, e]);
      };

      this.set('onFocus', onFocus);

      await render<ExtendedTestContext>(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onFocus={{this.onFocus}}>hello</BasicDropdownTrigger>
      `);
      await focus(
        getRootNode(this.element).querySelector(
          '.ember-basic-dropdown-trigger',
        ) as HTMLElement,
      );
    });

    test<ExtendedTestContext>('It properly handles the onFocusIn action', async function (assert) {
      assert.expect(4);

      const onFocusIn = (dropdown: Dropdown, e?: FocusEvent) => {
        assert.ok(true, 'The `onFocusIn()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, [dropdown, e]);
      };

      this.set('onFocusIn', onFocusIn);

      await render<ExtendedTestContext>(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onFocusIn={{this.onFocusIn}}>hello</BasicDropdownTrigger>
      `);
      await triggerEvent(
        getRootNode(this.element).querySelector(
          '.ember-basic-dropdown-trigger',
        ) as HTMLElement,
        'focusin',
      );
    });

    test<ExtendedTestContext>('It properly handles the onFocusOut action', async function (assert) {
      assert.expect(4);

      const onFocusOut = (dropdown: Dropdown, e?: FocusEvent) => {
        assert.ok(true, 'The `onFocusOut()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, [dropdown, e]);
      };

      this.set('onFocusOut', onFocusOut);

      await render<ExtendedTestContext>(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onFocusOut={{this.onFocusOut}}>hello</BasicDropdownTrigger>
      `);
      await triggerEvent(
        getRootNode(this.element).querySelector(
          '.ember-basic-dropdown-trigger',
        ) as HTMLElement,
        'focusout',
      );
    });

    test<ExtendedTestContext>('It properly handles the onKeyDown action', async function (assert) {
      assert.expect(4);

      const onKeyDown = (dropdown: Dropdown, e?: KeyboardEvent) => {
        assert.ok(true, 'The `onKeyDown()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, [dropdown, e]);
      };

      this.set('onKeyDown', onKeyDown);

      await render<ExtendedTestContext>(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onKeyDown={{this.onKeyDown}}>hello</BasicDropdownTrigger>
      `);
      await triggerEvent(
        getRootNode(this.element).querySelector(
          '.ember-basic-dropdown-trigger',
        ) as HTMLElement,
        'keydown',
      );
    });

    test<ExtendedTestContext>('It properly handles the onMouseDown action', async function (assert) {
      assert.expect(4);

      const onMouseDown = (dropdown: Dropdown, e?: MouseEvent) => {
        assert.ok(true, 'The `onMouseDown()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, [dropdown, e]);
      };

      this.set('onMouseDown', onMouseDown);

      await render<ExtendedTestContext>(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onMouseDown={{this.onMouseDown}}>hello</BasicDropdownTrigger>
      `);
      await triggerEvent(
        getRootNode(this.element).querySelector(
          '.ember-basic-dropdown-trigger',
        ) as HTMLElement,
        'mousedown',
      );
    });

    test<ExtendedTestContext>('It properly handles the onMouseEnter action', async function (assert) {
      assert.expect(4);

      const onMouseEnter = (dropdown: Dropdown, e?: MouseEvent) => {
        assert.ok(true, 'The `onMouseEnter()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, [dropdown, e]);
      };

      this.set('onMouseEnter', onMouseEnter);

      await render<ExtendedTestContext>(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onMouseEnter={{this.onMouseEnter}}>hello</BasicDropdownTrigger>
      `);
      await triggerEvent('.ember-basic-dropdown-trigger', 'mouseenter');
    });

    test<ExtendedTestContext>('It properly handles the onMouseLeave action', async function (assert) {
      assert.expect(4);

      const onMouseLeave = (dropdown: Dropdown, e?: MouseEvent) => {
        assert.ok(true, 'The `onMouseLeave()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, [dropdown, e]);
      };

      this.set('onMouseLeave', onMouseLeave);

      await render<ExtendedTestContext>(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onMouseLeave={{this.onMouseLeave}}>hello</BasicDropdownTrigger>
      `);
      await triggerEvent(
        getRootNode(this.element).querySelector(
          '.ember-basic-dropdown-trigger',
        ) as HTMLElement,
        'mouseleave',
      );
    });

    test<ExtendedTestContext>('It properly handles the onTouchEnd action', async function (assert) {
      assert.expect(4);

      const onTouchEnd = (dropdown: Dropdown, e?: MouseEvent) => {
        assert.ok(true, 'The `onTouchEnd()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, [dropdown, e]);
      };

      this.set('onTouchEnd', onTouchEnd);

      await render<ExtendedTestContext>(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onTouchEnd={{this.onTouchEnd}}>hello</BasicDropdownTrigger>
      `);
      await triggerEvent(
        getRootNode(this.element).querySelector(
          '.ember-basic-dropdown-trigger',
        ) as HTMLElement,
        'touchend',
      );
    });
  });
});
