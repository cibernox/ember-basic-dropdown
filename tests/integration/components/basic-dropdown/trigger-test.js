import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { clickTrigger, tapTrigger, fireKeydown } from '../../../helpers/ember-basic-dropdown';
import run from 'ember-runloop';
import set from 'ember-metal/set';

moduleForComponent('ember-basic-dropdown', 'Integration | Component | basic-dropdown/trigger', {
  integration: true
});

test('It renders the given block in a div with class `ember-basic-dropdown-trigger`, with no wrapper around', function(assert) {
  assert.expect(3);
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal(this.$().children()[0], $trigger[0], 'The trigger is not wrapped');
  assert.equal($trigger.length, 1, 'There is one element with `ember-basic-dropdown-trigger`');
  assert.equal($trigger.text(), 'Click me', 'The trigger contains the given block');
});

// Attributes and a11y
test('If it doesn\'t receive any tabindex, defaults to 0', function(assert) {
  assert.expect(1);
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('tabindex'), '0', 'Has a tabindex of 0');
});

test('If it receives a tabindex=null, defaults to 0', function(assert) {
  assert.expect(1);
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger tabindex=null dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('tabindex'), '0', 'Has a tabindex of 0');
});

test('If it receives a tabindex=false, it has no tabindex attribute', function(assert) {
  assert.expect(1);
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger tabindex=false dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('tabindex'), undefined, 'It has no tabindex');
});

test('If it receives `tabindex=3`, the tabindex of the element is 3', function(assert) {
  assert.expect(1);
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger tabindex=3 dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('tabindex'), '3', 'Has a tabindex of 3');
});

test('If it receives `title=something`, if has that title attribute', function(assert) {
  assert.expect(1);
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger title="foobar" dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('title'), 'foobar', 'Has the given title');
});

test('If the dropdown is disabled, the trigger doesn\'t have tabindex attribute, regardless of if it has been customized or not', function(assert) {
  assert.expect(1);
  this.dropdown = { uniqueId: 123, disabled: true };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown tabindex=3}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('tabindex'), undefined, 'The component doesn\'t have tabindex');
});

test('If it belongs to a disabled dropdown, it gets an `aria-disabled=true` attribute for a11y', function(assert) {
  assert.expect(2);
  this.dropdown = { uniqueId: 123, disabled: true };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.ok(['true', ''].indexOf($trigger.attr('aria-disabled')) > -1, 'It is marked as disabled');
  run(() => this.set('dropdown.disabled', false));
  assert.ok(['false', undefined].indexOf($trigger.attr('aria-disabled')) > -1, 'It is not disabled anymore');
});

test('If it receives `ariaLabel="foo123"` it gets an `aria-label="foo123"` attribute', function(assert) {
  assert.expect(1);
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger ariaLabel="foo123" dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-label'), 'foo123', 'the aria-label is set');
});

test('If it receives `ariaLabelledBy="foo123"` it gets an `aria-labelledby="foo123"` attribute', function(assert) {
  assert.expect(1);
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger ariaLabelledBy="foo123" dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-labelledby'), 'foo123', 'the aria-labelledby is set');
});

test('If it receives `ariaDescribedBy="foo123"` it gets an `aria-describedby="foo123"` attribute', function(assert) {
  assert.expect(1);
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger ariaDescribedBy="foo123" dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-describedby'), 'foo123', 'the aria-describedby is set');
});

test('If it receives `ariaRequired="true"` it gets an `aria-required="true"` attribute', function(assert) {
  assert.expect(2);
  this.dropdown = { uniqueId: 123 };
  this.required = true;
  this.render(hbs`
    {{#basic-dropdown/trigger ariaRequired=required dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('aria-required'), 'true', 'the aria-required is true');
  run(() => this.set('required', false));
  assert.equal($trigger.attr('aria-required'), undefined, 'the aria-required is false');
});

test('If it receives `ariaInvalid="true"` it gets an `aria-invalid="true"` attribute', function(assert) {
  assert.expect(2);
  this.invalid = true;
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger ariaInvalid=invalid dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('aria-invalid'), 'true', 'the aria-invalid is true');
  run(() => this.set('invalid', false));
  assert.equal($trigger.attr('aria-invalid'), undefined, 'the aria-invalid is false');
});

test('If the received dropdown is open, it has an `aria-expanded="true"` attribute', function(assert) {
  assert.expect(2);
  this.dropdown = { uniqueId: 123, isOpen: false };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('aria-expanded'), undefined, 'the aria-expanded is false');
  run(() => set(this.dropdown, 'isOpen', true));
  assert.equal($trigger.attr('aria-expanded'), 'true', 'the aria-expanded is true');
});

test('If the received dropdown is open, it has an `aria-pressed="true"` attribute', function(assert) {
  assert.expect(2);
  this.dropdown = { uniqueId: 123, isOpen: false };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('aria-pressed'), undefined, 'the aria-pressed is false');
  run(() => set(this.dropdown, 'isOpen', true));
  assert.equal($trigger.attr('aria-pressed'), 'true', 'the aria-pressed is true');
});

test('If it has an `aria-controls="foo123"` attribute pointing to the id of the content', function(assert) {
  assert.expect(1);
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('aria-controls'), 'ember-basic-dropdown-content-123');
});

test('If it receives `role="foo123"` it gets that attribute', function(assert) {
  assert.expect(1);
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown role="foo123"}}Click me{{/basic-dropdown/trigger}}
  `);
  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('role'), 'foo123');
});

test('If it does not receive an specific `role`, the default is `button`', function(assert) {
  assert.expect(1);
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('role'), 'button');
});

test('It has `aria-haspopup=true`', function(assert) {
  assert.expect(1);
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.ok(['true', ''].indexOf($trigger.attr('aria-haspopup') > -1), 'Has `aria-haspopup=true`');
});

// Custom actions
test('If it receives an `onMouseEnter` action, it will be invoked when a mouseenter event is received', function(assert) {
  assert.expect(2);
  this.dropdown = { uniqueId: 123 };
  this.onMouseEnter = (dropdown, e) => {
    assert.equal(dropdown, this.dropdown, 'receives the dropdown as 1st argument');
    assert.ok(e instanceof window.Event, 'It receives the event as second argument');
  };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown onMouseEnter=onMouseEnter}}Click me{{/basic-dropdown/trigger}}
  `);
  run(() => {
    let event = new window.Event('mouseenter', { bubbles: true, cancelable: true, view: window });
    this.$('.ember-basic-dropdown-trigger')[0].dispatchEvent(event);
  });
});

test('If it receives an `onMouseLeave` action, it will be invoked when a mouseleave event is received', function(assert) {
  assert.expect(2);
  this.onMouseLeave = (dropdown, e) => {
    assert.equal(dropdown, this.dropdown, 'receives the dropdown as 1st argument');
    assert.ok(e instanceof window.Event, 'It receives the event as second argument');
  };
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown onMouseLeave=onMouseLeave}}Click me{{/basic-dropdown/trigger}}
  `);
  run(() => {
    let event = new window.Event('mouseleave', { bubbles: true, cancelable: true, view: window });
    this.$('.ember-basic-dropdown-trigger')[0].dispatchEvent(event);
  });
});

test('If it receives an `onFocus` action, it will be invoked when it get focused', function(assert) {
  assert.expect(2);
  this.onFocus = (dropdown, e) => {
    assert.equal(dropdown, this.dropdown, 'receives the dropdown as 1st argument');
    assert.ok(e instanceof window.Event, 'It receives the event as second argument');
  };
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown onFocus=onFocus}}Click me{{/basic-dropdown/trigger}}
  `);
  run(() => this.$('.ember-basic-dropdown-trigger')[0].focus());
});

test('If it receives an `onBlur` action, it will be invoked when it get blurred', function(assert) {
  assert.expect(2);
  this.onBlur = (dropdown, e) => {
    assert.equal(dropdown, this.dropdown, 'receives the dropdown as 1st argument');
    assert.ok(e instanceof window.Event, 'It receives the event as second argument');
  };
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown onBlur=onBlur}}Click me{{/basic-dropdown/trigger}}
  `);
  run(() => this.$('.ember-basic-dropdown-trigger')[0].focus());
  run(() => this.$('.ember-basic-dropdown-trigger')[0].blur());
});

test('If it receives an `onKeydown` action, it will be invoked when a key is pressed while the component is focused', function(assert) {
  assert.expect(3);
  this.onKeydown = (dropdown, e) => {
    assert.equal(dropdown, this.dropdown, 'receives the dropdown as 1st argument');
    assert.ok(e instanceof window.Event, 'It receives the event as second argument');
    assert.equal(e.keyCode, 70, 'the event is the keydown event');
  };
  this.dropdown = { uniqueId: 123 };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown onKeydown=onKeydown}}Click me{{/basic-dropdown/trigger}}
  `);
  fireKeydown('.ember-basic-dropdown-trigger', 70);
});

// Default behaviour
test('Clicking invokes the `toggle` action on the dropdown', function(assert) {
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
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  clickTrigger();
});

test('Pressing ENTER fires the `toggle` action on the dropdown', function(assert) {
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
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);

  fireKeydown('.ember-basic-dropdown-trigger', 13);
});

test('Pressing SPACE fires the `toggle` action on the dropdown and preventsDefault to avoid scrolling', function(assert) {
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
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);

  fireKeydown('.ember-basic-dropdown-trigger', 32);
});

test('Pressing ESC fires the `close` action on the dropdown', function(assert) {
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
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);

  fireKeydown('.ember-basic-dropdown-trigger', 27);
});

test('Pressing ENTER/SPACE/ESC does nothing of the onKeydown action returns false', function(assert) {
  assert.expect(0);
  this.onKeydown = () => false;
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
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown onKeydown=onKeydown}}Click me{{/basic-dropdown/trigger}}
  `);

  fireKeydown('.ember-basic-dropdown-trigger', 13);
  fireKeydown('.ember-basic-dropdown-trigger', 32);
  fireKeydown('.ember-basic-dropdown-trigger', 27);
});

test('Tapping invokes the toggle action on the dropdown', function(assert) {
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
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown isTouchDevice=true}}Click me{{/basic-dropdown/trigger}}
  `);
  tapTrigger();
});

test('Firing a mousemove between a touchstart and a touchend (touch scroll) doesn\'t fire the toggle action', function(assert) {
  assert.expect(0);
  this.dropdown = {
    uniqueId: 123,
    actions: {
      toggle() {
        assert.ok(false, 'This action in not called');
      }
    }
  };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown isTouchDevice=true}}Click me{{/basic-dropdown/trigger}}
  `);
  let trigger = this.$('.ember-basic-dropdown-trigger').get(0);
  run(() => trigger.dispatchEvent(new window.Event('touchstart', { bubbles: true, cancelable: true, view: window })));
  run(() => trigger.dispatchEvent(new window.Event('touchmove', { bubbles: true, cancelable: true, view: window })));
  run(() => trigger.dispatchEvent(new window.Event('touchend', { bubbles: true, cancelable: true, view: window })));
});

test('If its dropdown is disabled it won\'t respond to mouse, touch or keyboard event', function(assert) {
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
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown isTouchDevice=true}}Click me{{/basic-dropdown/trigger}}
  `);
  clickTrigger();
  tapTrigger();
  fireKeydown('.ember-basic-dropdown-trigger', 13);
  fireKeydown('.ember-basic-dropdown-trigger', 32);
  fireKeydown('.ember-basic-dropdown-trigger', 27);
});

// Focus
test('If it receives an `onFocusIn` action, it is invoked if a focusin event is fired on the trigger', function(assert) {
  assert.expect(3);
  this.dropdown = { uniqueId: 123, isOpen: true, actions: { reposition() { } } };
  this.onFocusIn = (api, e) => {
    assert.ok(true, 'The action is invoked');
    assert.equal(api, this.dropdown, 'The first argument is the API');
    assert.ok(e instanceof window.Event, 'the second argument is an event');
  };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown onFocusIn=onFocusIn}}
      <input type="text" id="test-input-focusin" />
    {{/basic-dropdown/trigger}}
  `);
  let input = $('#test-input-focusin').get(0);
  run(() => input.focus());
});

test('If it receives an `onFocusIn` action, it is invoked if a focusin event is fired on the trigger', function(assert) {
  assert.expect(3);
  this.dropdown = { uniqueId: 123, isOpen: true, actions: { reposition() { } } };
  this.onFocusOut = (api, e) => {
    assert.ok(true, 'The action is invoked');
    assert.equal(api, this.dropdown, 'The first argument is the API');
    assert.ok(e instanceof window.Event, 'the second argument is an event');
  };
  this.render(hbs`
    {{#basic-dropdown/trigger dropdown=dropdown onFocusOut=onFocusOut}}
      <input type="text" id="test-input-focusout" />
    {{/basic-dropdown/trigger}}
  `);
  let input = $('#test-input-focusout').get(0);
  run(() => input.focus());
});

// Decorating and overriding default event handlers
test('A user-supplied onMousedown action will execute before the default toggle behavior', function(assert) {
  assert.expect(4);
  let userActionRanfirst = false;

  this.dropdown = {
    uniqueId: 123,
    actions: {
      toggle: () => {
        assert.ok(userActionRanfirst, 'User-supplied `onMousedown` ran before default `toggle`');
      }
    }
  };

  let userSuppliedAction = (dropdown, e) => {
    assert.ok(true, 'The `userSuppliedAction()` action has been fired');
    assert.ok(e instanceof window.Event, 'It receives the event');
    assert.equal(dropdown, this.dropdown, 'It receives the dropdown configuration object');
    userActionRanfirst = true;
  };

  this.set('onMousedown', userSuppliedAction);
  this.render(hbs`
    {{#basic-dropdown/trigger onMousedown=onMousedown dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);

  clickTrigger();
});

test('A user-supplied onMousedown action, returning `false`, will prevent the default behavior', function(assert) {
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

  this.set('onMousedown', userSuppliedAction);
  this.render(hbs`
    {{#basic-dropdown/trigger onMousedown=onMousedown dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);

  clickTrigger();
});

test('A user-supplied onTouchend action will execute before the default toggle behavior', function(assert) {
  assert.expect(4);
  let userActionRanfirst = false;

  this.dropdown = {
    uniqueId: 123,
    actions: {
      toggle: () => {
        assert.ok(userActionRanfirst, 'User-supplied `onTouchend` ran before default `toggle`');
      }
    }
  };

  let userSuppliedAction = (dropdown, e) => {
    assert.ok(true, 'The `userSuppliedAction` action has been fired');
    assert.ok(e instanceof window.Event, 'It receives the event');
    assert.equal(dropdown, this.dropdown, 'It receives the dropdown configuration object');
    userActionRanfirst = true;
  };

  this.set('onTouchend', userSuppliedAction);
  this.render(hbs`
    {{#basic-dropdown/trigger onTouchend=onTouchend dropdown=dropdown isTouchDevice=true}}Click me{{/basic-dropdown/trigger}}
  `);
  tapTrigger();
});

test('A user-supplied onTouchend action, returning `false`, will prevent the default behavior', function(assert) {
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

  this.set('onTouchend', userSuppliedAction);
  this.render(hbs`
    {{#basic-dropdown/trigger onTouchend=onTouchend dropdown=dropdown isTouchDevice=true}}Click me{{/basic-dropdown/trigger}}
  `);
  tapTrigger();
});

test('A user-supplied onKeydown action will execute before the default toggle behavior', function(assert) {
  assert.expect(4);
  let userActionRanfirst = false;

  this.dropdown = {
    uniqueId: 123,
    actions: {
      toggle: () => {
        assert.ok(userActionRanfirst, 'User-supplied `onKeydown` ran before default `toggle`');
      }
    }
  };

  let userSuppliedAction = (dropdown, e) => {
    assert.ok(true, 'The `userSuppliedAction()` action has been fired');
    assert.ok(e instanceof window.Event, 'It receives the event');
    assert.equal(dropdown, this.dropdown, 'It receives the dropdown configuration object');
    userActionRanfirst = true;
  };

  this.set('onKeydown', userSuppliedAction);
  this.render(hbs`
    {{#basic-dropdown/trigger onKeydown=onKeydown dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  fireKeydown('.ember-basic-dropdown-trigger', 13); // Enter
});

test('A user-supplied onKeydown action, returning `false`, will prevent the default behavior', function(assert) {
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

  this.set('onKeydown', userSuppliedAction);
  this.render(hbs`
    {{#basic-dropdown/trigger onKeydown=onKeydown dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  fireKeydown('.ember-basic-dropdown-trigger', 13); // Enter
});
