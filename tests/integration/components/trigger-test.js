import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { render, triggerEvent, triggerKeyEvent, tap, click } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import { set } from '@ember/object'

module('Integration | Component | basic-dropdown-trigger', function(hooks) {
  setupRenderingTest(hooks);

  test('It renders the given block in a div with class `ember-basic-dropdown-trigger`, with no wrapper around', async function(assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <div id="direct-parent">
        <BasicDropdownTrigger @dropdown={{dropdown}}>Click me</BasicDropdownTrigger>
      </div>
    `);

    assert.dom('#direct-parent > .ember-basic-dropdown-trigger').exists('The trigger is not wrapped');
    assert.dom('.ember-basic-dropdown-trigger').hasText('Click me', 'The trigger contains the given block');
  });

  test('If a `@defaultClass` argument is provided, its value is added to the list of classes', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <div id="direct-parent">
        <BasicDropdownTrigger @dropdown={{dropdown}} @defaultClass="extra-class">Click me</BasicDropdownTrigger>
      </div>
    `);

    assert.dom('.ember-basic-dropdown-trigger').hasClass('extra-class');
  });

  // Attributes and a11y
  test('If it doesn\'t receive any tabindex, defaults to 0', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}}>Click me</BasicDropdownTrigger>
    `);

    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('tabindex', '0', 'Has a tabindex of 0');
  });

  test('If it receives a tabindex={{false}}, it removes the tabindex', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <BasicDropdownTrigger tabindex={{false}} @dropdown={{dropdown}}>Click me</BasicDropdownTrigger>
    `);

    assert.dom('.ember-basic-dropdown-trigger').doesNotHaveAttribute('tabindex');
  });

  test('If it receives `tabindex="3"`, the tabindex of the element is 3', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}} tabindex="3">Click me</BasicDropdownTrigger>
    `);

    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('tabindex', '3', 'Has a tabindex of 3');
  });

  test('If it receives `title="something"`, if has that title attribute', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}} title="foobar">Click me</BasicDropdownTrigger>
    `);

    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('title', 'foobar', 'Has the given title');
  });

  test('If it receives `id="some-id"`, if has that id', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}} id="my-own-id">Click me</BasicDropdownTrigger>
    `);

    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('id', 'my-own-id', 'Has the given id');
  });

  test('If the dropdown is disabled, the trigger doesn\'t have tabindex attribute', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123, disabled: true };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}}>Click me</BasicDropdownTrigger>
    `);

    assert.dom('.ember-basic-dropdown-trigger').doesNotHaveAttribute('tabindex', 'The component doesn\'t have tabindex');
  });

  test('If it belongs to a disabled dropdown, it gets an `aria-disabled=true` attribute for a11y', async function(assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 123, disabled: true };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}}>Click me</BasicDropdownTrigger>
    `);

    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('aria-disabled', 'true', 'It is marked as disabled');
    run(() => this.set('dropdown.disabled', false));
    assert.dom('.ember-basic-dropdown-trigger').doesNotHaveAttribute('aria-disabled', 'It is NOT marked as disabled');
  });

  test('If the received dropdown is open, it has an `aria-expanded="true"` attribute', async function(assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 123, isOpen: false };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}}>Click me</BasicDropdownTrigger>
    `);
    assert.dom('.ember-basic-dropdown-trigger').doesNotHaveAttribute('aria-expanded');
    run(() => set(this.dropdown, 'isOpen', true));
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('aria-expanded', 'true', 'the aria-expanded is true');
  });

  test('If it has an `aria-owns="foo123"` attribute pointing to the id of the content', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}}>Click me</BasicDropdownTrigger>
    `);
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('aria-owns', 'ember-basic-dropdown-content-123');
  });

  test('If it receives `@htmlTag`, the trigger uses that tag name', async function (assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}} @htmlTag="button" type="button">Click me</BasicDropdownTrigger>
    `);
    assert.equal(this.element.querySelector('.ember-basic-dropdown-trigger').tagName, 'BUTTON');
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('type', 'button');
  });

  test('If it receives `role="foo123"` it gets that attribute', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}} role="foo123">Click me</BasicDropdownTrigger>
    `);
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('role', 'foo123');
  });

  test('If it does not receive an specific `role`, the default is `button`', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    this.role = undefined;
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}}>Click me</BasicDropdownTrigger>
    `);
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('role', 'button');
  });

  // Custom actions
  test('the user can bind arbitrary events to the trigger', async function(assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 123 };
    this.onMouseEnter = (dropdown, e) => {
      assert.equal(dropdown, this.dropdown, 'receives the dropdown as 1st argument');
      assert.ok(e instanceof window.Event, 'It receives the event as second argument');
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}} {{on "mouseenter" (fn onMouseEnter dropdown)}}>Click me</BasicDropdownTrigger>
    `);
    await triggerEvent('.ember-basic-dropdown-trigger', 'mouseenter');
  });

  // Default behaviour
  test('click events invoke the `toggle` action on the dropdown by default', async function(assert) {
    assert.expect(2);
    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(e instanceof window.Event && arguments.length === 1, 'It receives the event as first and only argument');
        }
      }
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}}>Click me</BasicDropdownTrigger>
    `);
    await triggerEvent('.ember-basic-dropdown-trigger', 'click');
  });

  test('mousedown events DO NOT invoke the `toggle` action on the dropdown by default', async function(assert) {
    assert.expect(0);
    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle() {
          assert.ok(false);
        }
      }
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}}>Click me</BasicDropdownTrigger>
    `);
    await triggerEvent('.ember-basic-dropdown-trigger', 'mousedown');
  });

  test('click events DO NOT invoke the `toggle` action on the dropdown if `@eventType="mousedown"`', async function(assert) {
    assert.expect(0);
    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle() {
          assert.ok(false);
        }
      }
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}} @eventType="mousedown">Click me</BasicDropdownTrigger>
    `);
    await triggerEvent('.ember-basic-dropdown-trigger', 'click');
  });

  test('mousedown events invoke the `toggle` action on the dropdown if `eventType="mousedown"', async function(assert) {
    assert.expect(2);
    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(e instanceof window.Event && arguments.length === 1, 'It receives the event as first and only argument');
        }
      }
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}} @eventType="mousedown">Click me</BasicDropdownTrigger>
    `);
    await triggerEvent('.ember-basic-dropdown-trigger', 'mousedown');
  });

  test('when `stopPropagation` is true the `click` event does not bubble', async function (assert) {
    assert.expect(2);
    this.handlerInParent = () => assert.ok(false, 'This should never be called');

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(e instanceof window.Event && arguments.length === 1, 'It receives the event as first and only argument');
        }
      }
    };
    await render(hbs`
      <div onclick={{handlerInParent}}>
        <BasicDropdownTrigger @dropdown={{dropdown}} @stopPropagation={{true}}>Click me</BasicDropdownTrigger>
      </div>
    `);
    await triggerEvent('.ember-basic-dropdown-trigger', 'click');
  });

  test('when `stopPropagation` is true and eventType is true, the `click` event does not bubble', async function (assert) {
    assert.expect(2);
    this.handlerInParent = () => assert.ok(false, 'This should never be called');

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(e instanceof window.Event && arguments.length === 1, 'It receives the event as first and only argument');
        }
      }
    };
    await render(hbs`
      <div onclick={{handlerInParent}}>
        <BasicDropdownTrigger @dropdown={{dropdown}} @stopPropagation={{true}}>Click me</BasicDropdownTrigger>
      </div>
    `);
    await triggerEvent('.ember-basic-dropdown-trigger', 'click');
  });

  test('Pressing ENTER fires the `toggle` action on the dropdown', async function(assert) {
    assert.expect(2);
    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(e instanceof window.Event && arguments.length === 1, 'It receives the event as first and only argument');
        }
      }
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}}>Click me</BasicDropdownTrigger>
    `);

    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 13);
  });

  test('Pressing SPACE fires the `toggle` action on the dropdown and preventsDefault to avoid scrolling', async function(assert) {
    assert.expect(3);
    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(e instanceof window.Event && arguments.length === 1, 'It receives the event as first and only argument');
          assert.ok(e.defaultPrevented, 'The event is defaultPrevented');
        }
      }
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}}>Click me</BasicDropdownTrigger>
    `);

    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 32);
  });

  test('Pressing ESC fires the `close` action on the dropdown', async function(assert) {
    assert.expect(2);
    this.dropdown = {
      uniqueId: 123,
      actions: {
        close(e) {
          assert.ok(true, 'The `close()` action has been fired');
          assert.ok(e instanceof window.Event && arguments.length === 1, 'It receives the event as first and only argument');
        }
      }
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}}>Click me</BasicDropdownTrigger>
    `);

    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 27);
  });

  test('Pressing ENTER/SPACE/ESC does nothing if there is a `{{on "keydown"}}` event that calls stopImmediatePropagation', async function(assert) {
    assert.expect(0);
    this.onKeyDown = (e) => e.stopImmediatePropagation();
    this.dropdown = {
      uniqueId: 123,
      actions: {
        close() {
          assert.ok(false, 'This action is not called');
        },
        toggle() {
          assert.ok(false, 'This action is not called');
        }
      }
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}} {{on "keydown" onKeyDown}}>Click me</BasicDropdownTrigger>
    `);

    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 13);
    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 32);
    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 27);
  });

  test('Tapping invokes the toggle action on the dropdown', async function(assert) {
    assert.expect(3);
    this.dropdown = {
      actions: {
        uniqueId: 123,
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.equal(e.type, 'touchend', 'The event that toggles the dropdown is the touchend');
          assert.ok(e instanceof window.Event && arguments.length === 1, 'It receives the event as first and only argument');
        }
      }
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}} @isTouchDevice={{true}}>Click me</BasicDropdownTrigger>
    `);
    await tap('.ember-basic-dropdown-trigger');
  });

  test('Firing a mousemove between a touchstart and a touchend (touch scroll) doesn\'t fire the toggle action', async function(assert) {
    assert.expect(0);
    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle() {
          assert.ok(false, 'This action in not called');
        }
      }
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}} @isTouchDevice={{true}}>Click me</BasicDropdownTrigger>
    `);

    await triggerEvent('.ember-basic-dropdown-trigger', 'touchstart');
    await triggerEvent('.ember-basic-dropdown-trigger', 'touchmove');
    await triggerEvent('.ember-basic-dropdown-trigger', 'touchend');
  });

  test('If its dropdown is disabled it won\'t respond to mouse, touch or keyboard event', async function(assert) {
    assert.expect(0);
    this.dropdown = {
      uniqueId: 123,
      disabled: true,
      actions: {
        toggle() {
          assert.ok(false, 'This action in not called');
        },
        open() {
          assert.ok(false, 'This action in not called');
        },
        close() {
          assert.ok(false, 'This action in not called');
        }
      }
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}} @isTouchDevice={{true}}>Click me</BasicDropdownTrigger>
    `);
    await click('.ember-basic-dropdown-trigger');
    await tap('.ember-basic-dropdown-trigger');
    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 13);
    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 32);
    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 27);
  });

  // Decorating and overriding default event handlers
  test('A user-supplied {{on "mousedown"}} callback will execute before the default toggle behavior', async function(assert) {
    assert.expect(3);
    let userActionRanfirst = false;

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(userActionRanfirst, 'User-supplied `{{on "mousedown"}}` ran before default `toggle`');
        }
      }
    };

    this.onMouseDown = (e) => {
      assert.ok(true, 'The `userSuppliedAction()` action has been fired');
      assert.ok(e instanceof window.Event, 'It receives the event');
      userActionRanfirst = true;
    };

    await render(hbs`
      <BasicDropdownTrigger {{on "mousedown" this.onMouseDown}} @dropdown={{dropdown}} @eventType="mousedown">Click me</BasicDropdownTrigger>
    `);

    await click('.ember-basic-dropdown-trigger');
  });

  test('A user-supplied {{on "click"}} callback that calls `stopImmediatePropagation`, will prevent the default behavior', async function(assert) {
    assert.expect(1);

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(false, 'Default `toggle` action should not run');
        }
      }
    };

    this.onClick = (e) => {
      e.stopImmediatePropagation();
      assert.ok(true, 'The `userSuppliedAction()` action has been fired');
    };

    await render(hbs`
      <BasicDropdownTrigger {{on "click" onClick}} @dropdown={{dropdown}}>Click me</BasicDropdownTrigger>
    `);

    await click('.ember-basic-dropdown-trigger');
  });

  test('A user-supplied {{on "mousedown"}} callback that calls `stopImmediatePropagation` will prevent the default behavior', async function(assert) {
    assert.expect(1);

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(false, 'Default `toggle` action should not run');
        }
      }
    };

    this.onMouseDown = (e) => {
      e.stopImmediatePropagation();
      assert.ok(true, 'The user-supplied action has been fired');
    };

    await render(hbs`
      <BasicDropdownTrigger {{on "mousedown" this.onMouseDown}} @dropdown={{dropdown}} @eventType="mousedown">Click me</BasicDropdownTrigger>
    `);

    await click('.ember-basic-dropdown-trigger');
  });

  test('A user-supplied {{on "touchend"}} callback will execute before the default toggle behavior', async function(assert) {
    assert.expect(3);
    let userActionRanfirst = false;

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(userActionRanfirst, 'User-supplied `{{on "touchend"}}` ran before default `toggle`');
        }
      }
    };

    this.onTouchEnd = (e) => {
      assert.ok(true, 'The user-supplied touchend callback has been fired');
      assert.ok(e instanceof window.Event, 'It receives the event');
      userActionRanfirst = true;
    };

    await render(hbs`
      <BasicDropdownTrigger {{on "touchend" this.onTouchEnd}} @dropdown={{dropdown}}>
        Click me
      </BasicDropdownTrigger>
    `);
    await tap('.ember-basic-dropdown-trigger');
  });

  test('A user-supplied {{on "touchend"}} callback calling e.stopImmediatePropagation will prevent the default behavior', async function(assert) {
    assert.expect(2);

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: (e) => {
          assert.notEqual(e.type, 'touchend', 'Default `toggle` action should not run');
        }
      }
    };

    this.onTouchEnd = (e) => {
      e.stopImmediatePropagation();
      assert.ok(true, 'The user-supplied touchend callback has been fired');
    };

    await render(hbs`
      <BasicDropdownTrigger {{on "touchend" this.onTouchEnd}} @dropdown={{dropdown}}>
        Click me
      </BasicDropdownTrigger>
    `);
    await tap('.ember-basic-dropdown-trigger');
  });

  test('A user-supplied `{{on "keydown"}}` action will execute before the default toggle behavior', async function(assert) {
    assert.expect(3);
    let userActionRanfirst = false;

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(userActionRanfirst, 'User-supplied `{{on "keydown}}` ran before default `toggle`');
        }
      }
    };

    this.onKeyDown = (e) => {
      assert.ok(true, 'The `userSuppliedAction()` action has been fired');
      assert.ok(e instanceof window.Event, 'It receives the event');
      userActionRanfirst = true;
    };

    await render(hbs`
      <BasicDropdownTrigger {{on "keydown" onKeyDown}} @dropdown={{dropdown}}>Click me</BasicDropdownTrigger>
    `);
    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 13); // Enter
  });

  test('A user-supplied `{{on "keydown"}}` action calling `stopImmediatePropagation` will prevent the default behavior', async function(assert) {
    assert.expect(1);

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(false, 'Default `toggle` action should not run');
        }
      }
    };

    this.onKeyDown = (e) => {
      e.stopImmediatePropagation();
      assert.ok(true, 'The `userSuppliedAction()` action has been fired');
    };

    await render(hbs`
      <BasicDropdownTrigger {{on "keydown" onKeyDown}} @dropdown={{dropdown}}>Click me</BasicDropdownTrigger>
    `);
    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 13); // Enter
  });

  test('Tapping an SVG inside of the trigger invokes the toggle action on the dropdown', async function(assert) {
    assert.expect(2);
    this.dropdown = {
      actions: {
        uniqueId: 123,
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(e instanceof window.Event && arguments.length === 1, 'It receives the event as first and only argument');
        }
      }
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{dropdown}} @isTouchDevice={{true}}><svg class="trigger-child-svg">Click me</svg></BasicDropdownTrigger>
    `);
    await tap('.ember-basic-dropdown-trigger');
  });
});
