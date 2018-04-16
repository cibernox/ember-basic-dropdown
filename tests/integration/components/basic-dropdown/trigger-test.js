import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { clickTrigger, tapTrigger, nativeTap } from 'ember-basic-dropdown/test-support/helpers';
import { render, triggerEvent, triggerKeyEvent, focus } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import { set } from "@ember/object"

module('Integration | Component | basic-dropdown/trigger', function(hooks) {
  setupRenderingTest(hooks);

  test('It renders the given block in a div with class `ember-basic-dropdown-trigger`, with no wrapper around', async function(assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <div id="direct-parent">
        {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
      </div>
    `);

    assert.dom('#direct-parent > .ember-basic-dropdown-trigger').exists('The trigger is not wrapped');
    assert.dom('.ember-basic-dropdown-trigger').hasText('Click me', 'The trigger contains the given block');
  });

  // Attributes and a11y
  test('If it doesn\'t receive any tabindex, defaults to 0', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);

    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('tabindex', '0', 'Has a tabindex of 0');
  });

  test('If it receives a tabindex=null, defaults to 0', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger tabindex=null dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);

    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('tabindex', '0', 'Has a tabindex of 0');
  });

  test('If it receives a tabindex=false, it has no tabindex attribute', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger tabindex=false dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);

    assert.dom('.ember-basic-dropdown-trigger').doesNotHaveAttribute('tabindex', 'It has no tabindex');
  });

  test('If it receives `tabindex=3`, the tabindex of the element is 3', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger tabindex=3 dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);

    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('tabindex', '3', 'Has a tabindex of 3');
  });

  test('If it receives `title=something`, if has that title attribute', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger title="foobar" dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);

    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('title', 'foobar', 'Has the given title');
  });

  test('If it receives `id="some-id"`, if has that id', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger id="my-own-id" title="foobar" dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);

    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('id', 'my-own-id', 'Has the given id');
  });

  test('If the dropdown is disabled, the trigger doesn\'t have tabindex attribute, regardless of if it has been customized or not', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123, disabled: true };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown tabindex=3}}Click me{{/basic-dropdown/trigger}}
    `);

    assert.dom('.ember-basic-dropdown-trigger').doesNotHaveAttribute('tabindex', 'The component doesn\'t have tabindex');
  });

  test('If it belongs to a disabled dropdown, it gets an `aria-disabled=true` attribute for a11y', async function(assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 123, disabled: true };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);

    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('aria-disabled', 'true', 'It is marked as disabled');
    run(() => this.set('dropdown.disabled', false));
    assert.dom('.ember-basic-dropdown-trigger').doesNotHaveAttribute('aria-disabled', 'It is NOT marked as disabled');
  });

  test('If it receives `ariaLabel="foo123"` it gets an `aria-label="foo123"` attribute', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger ariaLabel="foo123" dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('aria-label', 'foo123', 'the aria-label is set');
  });

  test('If it receives `ariaLabelledBy="foo123"` it gets an `aria-labelledby="foo123"` attribute', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger ariaLabelledBy="foo123" dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('aria-labelledby', 'foo123', 'the aria-labelledby is set');
  });

  test('If it receives `ariaDescribedBy="foo123"` it gets an `aria-describedby="foo123"` attribute', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger ariaDescribedBy="foo123" dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('aria-describedby', 'foo123', 'the aria-describedby is set');
  });

  test('If it receives `ariaRequired="true"` it gets an `aria-required="true"` attribute', async function(assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 123 };
    this.required = true;
    await render(hbs`
      {{#basic-dropdown/trigger ariaRequired=required dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('aria-required', 'true', 'the aria-required is true');
    run(() => this.set('required', false));
    assert.dom('.ember-basic-dropdown-trigger').doesNotHaveAttribute('aria-required');
  });

  test('If it receives `ariaInvalid="true"` it gets an `aria-invalid="true"` attribute', async function(assert) {
    assert.expect(2);
    this.invalid = true;
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger ariaInvalid=invalid dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('aria-invalid', 'true', 'the aria-invalid is true');
    run(() => this.set('invalid', false));
    assert.dom('.ember-basic-dropdown-trigger').doesNotHaveAttribute('aria-invalid');
  });

  test('If the received dropdown is open, it has an `aria-expanded="true"` attribute', async function(assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 123, isOpen: false };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);
    assert.dom('.ember-basic-dropdown-trigger').doesNotHaveAttribute('aria-expanded');
    run(() => set(this.dropdown, 'isOpen', true));
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('aria-expanded', 'true', 'the aria-expanded is true');
  });

  test('The `ariaPressed` attribute is bound, but defaults to false', async function(assert) {
    assert.expect(3);
    this.dropdown = { uniqueId: 123, isOpen: false };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);
    assert.dom('.ember-basic-dropdown-trigger').doesNotHaveAttribute('aria-pressed');
    run(() => set(this.dropdown, 'isOpen', true));
    assert.dom('.ember-basic-dropdown-trigger').doesNotHaveAttribute('aria-pressed');
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown ariaPressed=true}}Click me{{/basic-dropdown/trigger}}
    `);
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('aria-pressed', 'true', 'the aria-pressed is true');
  });

  test('If it has an `aria-owns="foo123"` attribute pointing to the id of the content', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('aria-owns', 'ember-basic-dropdown-content-123');
  });

  test('If it receives `role="foo123"` it gets that attribute', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown role="foo123"}}Click me{{/basic-dropdown/trigger}}
    `);
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('role', 'foo123');
  });

  test('If it does not receive an specific `role`, the default is `button`', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    this.role = undefined;
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown role=role}}Click me{{/basic-dropdown/trigger}}
    `);
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('role', 'button');
  });

  test('The `aria-haspopup` attribute is not present by default', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);
    assert.dom('.ember-basic-dropdown-trigger').doesNotHaveAttribute('aria-haspopup');
  });

  test('The `aria-haspopup` attribute will be present if passed in', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown aria-haspopup=true}}Click me{{/basic-dropdown/trigger}}
    `);
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('aria-haspopup');
  });

  test('The `aria-autocomplete` will be present if passed in', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown aria-autocomplete="foobar"}}Click me{{/basic-dropdown/trigger}}
    `);
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('aria-autocomplete', 'foobar', 'Has `aria-autocomplete="foobar"`');
  });

  test('The `aria-activedescendant` will be present if passed in', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown aria-activedescendant="foobar"}}Click me{{/basic-dropdown/trigger}}
    `);
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('aria-activedescendant', 'foobar', 'Has `aria-activedescendant="foobar"`');
  });

  // Custom actions
  test('If it receives an `onMouseEnter` action, it will be invoked when a mouseenter event is received', async function(assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 123 };
    this.onMouseEnter = (dropdown, e) => {
      assert.equal(dropdown, this.dropdown, 'receives the dropdown as 1st argument');
      assert.ok(e instanceof window.Event, 'It receives the event as second argument');
    };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown onMouseEnter=onMouseEnter}}Click me{{/basic-dropdown/trigger}}
    `);
    triggerEvent('.ember-basic-dropdown-trigger', 'mouseenter');
  });

  test('If it receives an `onMouseLeave` action, it will be invoked when a mouseleave event is received', async function(assert) {
    assert.expect(2);
    this.onMouseLeave = (dropdown, e) => {
      assert.equal(dropdown, this.dropdown, 'receives the dropdown as 1st argument');
      assert.ok(e instanceof window.Event, 'It receives the event as second argument');
    };
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown onMouseLeave=onMouseLeave}}Click me{{/basic-dropdown/trigger}}
    `);
    triggerEvent('.ember-basic-dropdown-trigger', 'mouseleave');
  });

  test('If it receives an `onFocus` action, it will be invoked when it get focused', async function(assert) {
    assert.expect(2);
    this.onFocus = (dropdown, e) => {
      assert.equal(dropdown, this.dropdown, 'receives the dropdown as 1st argument');
      assert.ok(e instanceof window.Event, 'It receives the event as second argument');
    };
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown onFocus=onFocus}}Click me{{/basic-dropdown/trigger}}
    `);
    await focus('.ember-basic-dropdown-trigger');
  });

  test('If it receives an `onBlur` action, it will be invoked when it get blurred', async function(assert) {
    assert.expect(2);
    this.onBlur = (dropdown, e) => {
      assert.equal(dropdown, this.dropdown, 'receives the dropdown as 1st argument');
      assert.ok(e instanceof window.Event, 'It receives the event as second argument');
    };
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown onBlur=onBlur}}Click me{{/basic-dropdown/trigger}}
    `);
    await focus('.ember-basic-dropdown-trigger');
    await blur('.ember-basic-dropdown-trigger');
  });

  test('If it receives an `onKeyDown` action, it will be invoked when a key is pressed while the component is focused', async function(assert) {
    assert.expect(3);
    this.onKeyDown = (dropdown, e) => {
      assert.equal(dropdown, this.dropdown, 'receives the dropdown as 1st argument');
      assert.ok(e instanceof window.Event, 'It receives the event as second argument');
      assert.equal(e.keyCode, 70, 'the event is the keydown event');
    };
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown onKeyDown=onKeyDown}}Click me{{/basic-dropdown/trigger}}
    `);
    triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 70);
  });

  // Default behaviour
  test('mousedown events invoke the `toggle` action on the dropdown by default', async function(assert) {
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
      {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);
    triggerEvent('.ember-basic-dropdown-trigger', 'mousedown');
  });

  test('click events DO NOT invoke the `toggle` action on the dropdown by default', async function(assert) {
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
      {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);
    triggerEvent('.ember-basic-dropdown-trigger', 'click');
  });

  test('mousedown events DO NOT invoke the `toggle` action on the dropdown if `eventType="click"`', async function(assert) {
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
      {{#basic-dropdown/trigger dropdown=dropdown eventType="click"}}Click me{{/basic-dropdown/trigger}}
    `);
    triggerEvent('.ember-basic-dropdown-trigger', 'mousedown');
  });

  test('click events invoke the `toggle` action on the dropdown if `eventType="click"', async function(assert) {
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
      {{#basic-dropdown/trigger dropdown=dropdown eventType="click"}}Click me{{/basic-dropdown/trigger}}
    `);
    triggerEvent('.ember-basic-dropdown-trigger', 'click');
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
      {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);

    triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 13);
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
      {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);

    triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 32);
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
      {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);

    triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 27);
  });

  test('Pressing ENTER/SPACE/ESC does nothing of the onKeyDown action returns false', async function(assert) {
    assert.expect(0);
    this.onKeyDown = () => false;
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
      {{#basic-dropdown/trigger dropdown=dropdown onKeyDown=onKeyDown}}Click me{{/basic-dropdown/trigger}}
    `);

    triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 13);
    triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 32);
    triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 27);
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
      {{#basic-dropdown/trigger dropdown=dropdown isTouchDevice=true}}Click me{{/basic-dropdown/trigger}}
    `);
    tapTrigger();
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
      {{#basic-dropdown/trigger dropdown=dropdown isTouchDevice=true}}Click me{{/basic-dropdown/trigger}}
    `);

    triggerEvent('.ember-basic-dropdown-trigger', 'touchstart');
    triggerEvent('.ember-basic-dropdown-trigger', 'touchmove');
    triggerEvent('.ember-basic-dropdown-trigger', 'touchend');
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
      {{#basic-dropdown/trigger dropdown=dropdown isTouchDevice=true}}Click me{{/basic-dropdown/trigger}}
    `);
    clickTrigger();
    tapTrigger();
    triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 13);
    triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 32);
    triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 27);
  });

  // Focus
  test('If it receives an `onFocusIn` action, it is invoked if a focusin event is fired on the trigger', async function(assert) {
    assert.expect(3);
    this.dropdown = { uniqueId: 123, isOpen: true, actions: { reposition() { } } };
    this.onFocusIn = (api, e) => {
      assert.ok(true, 'The action is invoked');
      assert.equal(api, this.dropdown, 'The first argument is the API');
      assert.ok(e instanceof window.Event, 'the second argument is an event');
    };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown onFocusIn=onFocusIn}}
        <input type="text" id="test-input-focusin" />
      {{/basic-dropdown/trigger}}
    `);
    await focus('#test-input-focusin');
  });

  test('If it receives an `onFocusIn` action, it is invoked if a focusin event is fired on the trigger', async function(assert) {
    assert.expect(3);
    this.dropdown = { uniqueId: 123, isOpen: true, actions: { reposition() { } } };
    this.onFocusOut = (api, e) => {
      assert.ok(true, 'The action is invoked');
      assert.equal(api, this.dropdown, 'The first argument is the API');
      assert.ok(e instanceof window.Event, 'the second argument is an event');
    };
    await render(hbs`
      {{#basic-dropdown/trigger dropdown=dropdown onFocusOut=onFocusOut}}
        <input type="text" id="test-input-focusout" />
      {{/basic-dropdown/trigger}}
    `);
    await focus('#test-input-focusout');
  });

  // Decorating and overriding default event handlers
  test('A user-supplied onMouseDown action will execute before the default toggle behavior', async function(assert) {
    assert.expect(4);
    let userActionRanfirst = false;

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(userActionRanfirst, 'User-supplied `onMouseDown` ran before default `toggle`');
        }
      }
    };

    let userSuppliedAction = (dropdown, e) => {
      assert.ok(true, 'The `userSuppliedAction()` action has been fired');
      assert.ok(e instanceof window.Event, 'It receives the event');
      assert.equal(dropdown, this.dropdown, 'It receives the dropdown configuration object');
      userActionRanfirst = true;
    };

    this.set('onMouseDown', userSuppliedAction);
    await render(hbs`
      {{#basic-dropdown/trigger onMouseDown=onMouseDown dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);

    clickTrigger();
  });

  test('A user-supplied onMouseDown action, returning `false`, will prevent the default behavior', async function(assert) {
    assert.expect(1);

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(false, 'Default `toggle` action should not run');
        }
      }
    };

    let userSuppliedAction = () => {
      assert.ok(true, 'The `userSuppliedAction()` action has been fired');
      return false;
    };

    this.set('onMouseDown', userSuppliedAction);
    await render(hbs`
      {{#basic-dropdown/trigger onMouseDown=onMouseDown dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);

    clickTrigger();
  });

  test('A user-supplied onTouchEnd action will execute before the default toggle behavior', async function(assert) {
    assert.expect(4);
    let userActionRanfirst = false;

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(userActionRanfirst, 'User-supplied `onTouchEnd` ran before default `toggle`');
        }
      }
    };

    let userSuppliedAction = (dropdown, e) => {
      assert.ok(true, 'The `userSuppliedAction` action has been fired');
      assert.ok(e instanceof window.Event, 'It receives the event');
      assert.equal(dropdown, this.dropdown, 'It receives the dropdown configuration object');
      userActionRanfirst = true;
    };

    this.set('onTouchEnd', userSuppliedAction);
    await render(hbs`
      {{#basic-dropdown/trigger onTouchEnd=onTouchEnd dropdown=dropdown isTouchDevice=true}}Click me{{/basic-dropdown/trigger}}
    `);
    tapTrigger();
  });

  test('A user-supplied onTouchEnd action, returning `false`, will prevent the default behavior', async function(assert) {
    assert.expect(1);

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(false, 'Default `toggle` action should not run');
        }
      }
    };

    let userSuppliedAction = () => {
      assert.ok(true, 'The `userSuppliedAction` action has been fired');
      return false;
    };

    this.set('onTouchEnd', userSuppliedAction);
    await render(hbs`
      {{#basic-dropdown/trigger onTouchEnd=onTouchEnd dropdown=dropdown isTouchDevice=true}}Click me{{/basic-dropdown/trigger}}
    `);
    tapTrigger();
  });

  test('A user-supplied onKeyDown action will execute before the default toggle behavior', async function(assert) {
    assert.expect(4);
    let userActionRanfirst = false;

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(userActionRanfirst, 'User-supplied `onKeyDown` ran before default `toggle`');
        }
      }
    };

    let userSuppliedAction = (dropdown, e) => {
      assert.ok(true, 'The `userSuppliedAction()` action has been fired');
      assert.ok(e instanceof window.Event, 'It receives the event');
      assert.equal(dropdown, this.dropdown, 'It receives the dropdown configuration object');
      userActionRanfirst = true;
    };

    this.set('onKeyDown', userSuppliedAction);
    await render(hbs`
      {{#basic-dropdown/trigger onKeyDown=onKeyDown dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);
    triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 13); // Enter
  });

  test('A user-supplied onKeyDown action, returning `false`, will prevent the default behavior', async function(assert) {
    assert.expect(1);

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(false, 'Default `toggle` action should not run');
        }
      }
    };

    let userSuppliedAction = () => {
      assert.ok(true, 'The `userSuppliedAction()` action has been fired');
      return false;
    };

    this.set('onKeyDown', userSuppliedAction);
    await render(hbs`
      {{#basic-dropdown/trigger onKeyDown=onKeyDown dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
    `);
    triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 13); // Enter
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
      {{#basic-dropdown/trigger dropdown=dropdown isTouchDevice=true}}<svg class="trigger-child-svg">Click me</svg>{{/basic-dropdown/trigger}}
    `);
    nativeTap('.trigger-child-svg');
  });
});

// moduleForComponent('ember-basic-dropdown', 'Integration | Component | basic-dropdown/trigger', {
//   integration: true
// });
