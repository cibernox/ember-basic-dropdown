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
  this.appRoot = document.querySelector('#ember-testing');
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal(this.$().children()[0], $trigger[0], 'The trigger is not wrapped');
  assert.equal($trigger.length, 1, 'There is one element with `ember-basic-dropdown-trigger`');
  assert.equal($trigger.text(), 'Click me', 'The trigger contains the given block');
});

// Attributes and a11y
test('If it doesn\'t receive any tabindex, the default is 0', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('tabindex'), '0', 'Has a tabindex of 0');
});

test('If it receives `tabindex=3`, the tabindex of the element is 3', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot tabindex=3}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('tabindex'), '3', 'Has a tabindex of 3');
});

test('If it receives `disabled=true`, the tabindex is -1 regardless of if it has been customized or not', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot disabled=true tabindex=3}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('tabindex'), '-1', 'Has a tabindex of -1');
});

test('If it receives `disabled=true` it gets an `aria-disabled=true` attribute for a11y', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.disabled = true;
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot disabled=disabled}}Click me{{/basic-dropdown/trigger}}
  `);

  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('aria-disabled'), 'true', 'It is marked as disabled');
  run(() => this.set('disabled', false));
  assert.equal($trigger.attr('aria-disabled'), 'false', 'It is not disabled anymore');
});

test('If it receives `ariaLabel="foo123"` it gets an `aria-label="foo123"` attribute', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot ariaLabel="foo123"}}Click me{{/basic-dropdown/trigger}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-label'), 'foo123', 'the aria-label is set');
});

test('If it receives `ariaLabelledBy="foo123"` it gets an `aria-labelledby="foo123"` attribute', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot ariaLabelledBy="foo123"}}Click me{{/basic-dropdown/trigger}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-labelledby'), 'foo123', 'the aria-labelledby is set');
});

test('If it receives `ariaDescribedBy="foo123"` it gets an `aria-describedby="foo123"` attribute', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot ariaDescribedBy="foo123"}}Click me{{/basic-dropdown/trigger}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-describedby'), 'foo123', 'the aria-describedby is set');
});

test('If it receives `ariaRequired="true"` it gets an `aria-required="true"` attribute', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.required = true;
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot ariaRequired=required}}Click me{{/basic-dropdown/trigger}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-required'), 'true', 'the aria-required is true');
  run(() => this.set('required', false));
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-required'), 'false', 'the aria-required is false');
});

test('If it receives `ariaInvalid="true"` it gets an `aria-invalid="true"` attribute', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.invalid = true;
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot ariaInvalid=invalid}}Click me{{/basic-dropdown/trigger}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-invalid'), 'true', 'the aria-invalid is true');
  run(() => this.set('invalid', false));
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-invalid'), 'false', 'the aria-invalid is false');
});

test('If the received dropdown is open, it has an `aria-expanded="true"` attribute', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: false };
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-expanded'), 'false', 'the aria-expanded is false');
  run(() => set(this.dropdown, 'isOpen', true));
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-expanded'), 'true', 'the aria-expanded is true');
});

test('If the received dropdown is open, it has an `aria-pressed="true"` attribute', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: false };
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-pressed'), 'false', 'the aria-pressed is false');
  run(() => set(this.dropdown, 'isOpen', true));
  assert.equal(this.$('.ember-basic-dropdown-trigger').attr('aria-pressed'), 'true', 'the aria-pressed is true');
});

test('If it receives dropdownId="foo123" it gets an `aria-controls="foo123"` attribute', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot dropdownId="foo123"}}Click me{{/basic-dropdown/trigger}}
  `);
  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('aria-controls'), 'foo123');
});

test('It has `aria-haspopup=true`', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot}}Click me{{/basic-dropdown/trigger}}
  `);
  let $trigger = this.$('.ember-basic-dropdown-trigger');
  assert.equal($trigger.attr('aria-haspopup'), 'true', 'Has `aria-haspopup=true`');
});

// Custom actions
test('If it receives an `onMouseEnter` action, it will be invoked when a mouseenter event is received', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.onMouseEnter = (dropdown, e) => {
    assert.equal(dropdown, this.dropdown, 'receives the dropdown as 1st argument');
    assert.ok(e instanceof window.Event, 'It receives the event as second argument');
  };
  this.dropdown = {};
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot dropdown=dropdown onMouseEnter=onMouseEnter}}Click me{{/basic-dropdown/trigger}}
  `);
  run(() => {
    let event = new window.Event('mouseenter', { bubbles: true, cancelable: true, view: window });
    this.$('.ember-basic-dropdown-trigger')[0].dispatchEvent(event);
  });
});

test('If it receives an `onMouseLeave` action, it will be invoked when a mouseleave event is received', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.onMouseLeave = (dropdown, e) => {
    assert.equal(dropdown, this.dropdown, 'receives the dropdown as 1st argument');
    assert.ok(e instanceof window.Event, 'It receives the event as second argument');
  };
  this.dropdown = {};
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot dropdown=dropdown onMouseLeave=onMouseLeave}}Click me{{/basic-dropdown/trigger}}
  `);
  run(() => {
    let event = new window.Event('mouseleave', { bubbles: true, cancelable: true, view: window });
    this.$('.ember-basic-dropdown-trigger')[0].dispatchEvent(event);
  });
});

test('If it receives an `onFocus` action, it will be invoked when it get focused', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.onFocus = (dropdown, e) => {
    assert.equal(dropdown, this.dropdown, 'receives the dropdown as 1st argument');
    assert.ok(e instanceof window.Event, 'It receives the event as second argument');
  };
  this.dropdown = {};
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot dropdown=dropdown onFocus=onFocus}}Click me{{/basic-dropdown/trigger}}
  `);
  run(() => this.$('.ember-basic-dropdown-trigger')[0].focus());
});

test('If it receives an `onKeydown` action, it will be invoked when a key is pressed while the component is focused', function(assert) {
  assert.expect(3);
  this.appRoot = document.querySelector('#ember-testing');
  this.onKeydown = (dropdown, e) => {
    assert.equal(dropdown, this.dropdown, 'receives the dropdown as 1st argument');
    assert.ok(e instanceof window.Event, 'It receives the event as second argument');
    assert.equal(e.keyCode, 70, 'the event is the keydown event');
  };
  this.dropdown = {};
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot dropdown=dropdown onKeydown=onKeydown}}Click me{{/basic-dropdown/trigger}}
  `);
  fireKeydown('.ember-basic-dropdown-trigger', 70);
});

// Default behaviour
test('Clicking invokes the `toggle` action on the dropdown', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = {
    actions: {
      toggle(e) {
        assert.ok(true, 'The `toggle()` action has been fired');
        assert.ok(e instanceof window.Event && arguments.length === 1, 'It receives the event as first and only argument');
      }
    }
  };
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);
  clickTrigger();
});

test('Pressing ENTER fires the `toggle` action on the dropdown', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = {
    actions: {
      toggle(e) {
        assert.ok(true, 'The `toggle()` action has been fired');
        assert.ok(e instanceof window.Event && arguments.length === 1, 'It receives the event as first and only argument');
      }
    }
  };
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);

  fireKeydown('.ember-basic-dropdown-trigger', 13);
});

test('Pressing SPACE fires the `toggle` action on the dropdown and preventsDefault to avoid scrolling', function(assert) {
  assert.expect(3);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = {
    actions: {
      toggle(e) {
        assert.ok(true, 'The `toggle()` action has been fired');
        assert.ok(e instanceof window.Event && arguments.length === 1, 'It receives the event as first and only argument');
        assert.ok(e.defaultPrevented, 'The event is defaultPrevented');
      }
    }
  };
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);

  fireKeydown('.ember-basic-dropdown-trigger', 32);
});

test('Pressing ESC fires the `close` action on the dropdown', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = {
    actions: {
      close(e) {
        assert.ok(true, 'The `close()` action has been fired');
        assert.ok(e instanceof window.Event && arguments.length === 1, 'It receives the event as first and only argument');
      }
    }
  };
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot dropdown=dropdown}}Click me{{/basic-dropdown/trigger}}
  `);

  fireKeydown('.ember-basic-dropdown-trigger', 27);
});

test('Pressing ENTER/SPACE/ESC does nothing of the onKeydown action returns false', function(assert) {
  assert.expect(0);
  this.appRoot = document.querySelector('#ember-testing');
  this.onKeydown = () => false;
  this.dropdown = {
    actions: {
      close() { assert.ok(false, 'This action is not called'); },
      toggle() { assert.ok(false, 'This action is not called'); }
    }
  };
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot dropdown=dropdown onKeydown=onKeydown}}Click me{{/basic-dropdown/trigger}}
  `);

  fireKeydown('.ember-basic-dropdown-trigger', 13);
  fireKeydown('.ember-basic-dropdown-trigger', 32);
  fireKeydown('.ember-basic-dropdown-trigger', 27);
});

test('Tapping invokes the toggle action on the dropdown', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = {
    actions: {
      toggle(e) {
        assert.ok(true, 'The `toggle()` action has been fired');
        assert.ok(e instanceof window.Event && arguments.length === 1, 'It receives the event as first and only argument');
      }
    }
  };
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot dropdown=dropdown isTouchDevice=true}}Click me{{/basic-dropdown/trigger}}
  `);
  tapTrigger();
});

test('Firing a mousemove between a touchstart and a touchend (touch scroll) doesn\'t fire the toggle action', function(assert) {
  assert.expect(0);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = {
    actions: {
      toggle() { assert.ok(false, 'This action in not called'); }
    }
  };
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot dropdown=dropdown isTouchDevice=true}}Click me{{/basic-dropdown/trigger}}
  `);
  let trigger = this.$('.ember-basic-dropdown-trigger')[0];
  run(() => trigger.dispatchEvent(new window.Event('touchstart', { bubbles: true, cancelable: true, view: window })));
  run(() => trigger.dispatchEvent(new window.Event('touchmove', { bubbles: true, cancelable: true, view: window })));
  run(() => trigger.dispatchEvent(new window.Event('touchend', { bubbles: true, cancelable: true, view: window })));
});

test('If the component is disabled it won\'t respond to mouse, touch or keyboard event', function(assert) {
  assert.expect(0);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = {
    actions: {
      toggle() { assert.ok(false, 'This action in not called'); },
      open() { assert.ok(false, 'This action in not called'); },
      close() { assert.ok(false, 'This action in not called'); }
    }
  };
  this.render(hbs`
    {{#basic-dropdown/trigger appRoot=appRoot disabled=true dropdown=dropdown isTouchDevice=true}}Click me{{/basic-dropdown/trigger}}
  `);
  clickTrigger();
  tapTrigger();
  fireKeydown('.ember-basic-dropdown-trigger', 13);
  fireKeydown('.ember-basic-dropdown-trigger', 32);
  fireKeydown('.ember-basic-dropdown-trigger', 27);
});
