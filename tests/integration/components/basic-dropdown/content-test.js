import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';
import run from 'ember-runloop';

moduleForComponent('ember-basic-dropdown', 'Integration | Component | basic-dropdown/content', {
  integration: true
});

// Basic rendering
test('If the dropdown is open renders the given block in a div with class `ember-basic-dropdown-content`', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: true, actions: { reposition() { } } };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = $('.ember-basic-dropdown-content');
  assert.equal($content.text().trim(), 'Lorem ipsum', 'It contains the given block');
  assert.equal($content.parent()[0].id, 'ember-testing', 'It is rendered in the #ember-testing div');
});

test('If the dropdown is closed, nothing is rendered', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: false };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = $('.ember-basic-dropdown-content');
  assert.equal($content.length, 0, 'Nothing is rendered');
});

test('If it receives `renderInPlace=true`, it is rendered right here instead of elsewhere', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: true, actions: { reposition() { } } };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown renderInPlace=true}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = this.$('.ember-basic-dropdown-content');
  assert.equal($content.length, 1, 'It is rendered in the spot');
  assert.notEqual($content.parent()[0].id, 'ember-testing', 'It isn\'t rendered in the #ember-testing div');
});

test('If it receives `to="foo123"`, it is rendered in the element with that ID', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: true, actions: { reposition() { } } };
  this.render(hbs`
    <div id="foo123"></div>
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown to="foo123"}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = this.$('#foo123 .ember-basic-dropdown-content');
  assert.equal($content.length, 1, 'It is rendered');
  assert.equal($content.parent()[0].id, 'foo123', 'It is rendered in the element with the given ID');
});

test('If it receives `dropdownId="foo123"`, the rendered content will have that ID', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: true, actions: { reposition() { } } };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown elementId="foo123"}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = $('.ember-basic-dropdown-content');
  assert.equal($content.attr('id'), 'foo123', 'contains the expected ID');
});

test('If it receives `class="foo123"`, the rendered content will have that class along with the default one', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: true, actions: { reposition() { } } };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown class="foo123"}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = $('.ember-basic-dropdown-content.foo123');
  assert.equal($content.length, 1, 'The dropdown contains that class');
});

test('If it receives `verticalPositionClass="foo123"`, the rendered content will have that class along with the default one', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: true, actions: { reposition() { } } };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown verticalPositionClass="foo123"}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = $('.ember-basic-dropdown-content.foo123');
  assert.equal($content.length, 1, 'The dropdown contains that class');
});

test('If it receives `horizontalPositionClass="foo123"`, the rendered content will have that class along with the default one', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: true, actions: { reposition() { } } };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown horizontalPositionClass="foo123"}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = $('.ember-basic-dropdown-content.foo123');
  assert.equal($content.length, 1, 'The dropdown contains that class');
});

test('If it receives `dir="rtl"`, the rendered content will have the attribute set', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: true, actions: { reposition() { } } };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown dir="rtl"}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = $('.ember-basic-dropdown-content');
  assert.equal($content.attr('dir'), 'rtl', 'The dropdown has `dir="rtl"`');
});

// Clicking while the component is opened
test('Clicking anywhere in the app outside the component will invoke the close action on the dropdown', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = {
    isOpen: true,
    actions: {
      close() {
        assert.ok(true, 'The close action gets called');
      },
      reposition() {}
    }
  };
  this.render(hbs`
    <div id="other-div"></div>
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown}}Lorem ipsum{{/basic-dropdown/content}}
  `);

  run(() => {
    let event = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
    this.$('#other-div')[0].dispatchEvent(event);
  });
});

test('Clicking anywhere inside the dropdown content doesn\'t invoke the close action', function(assert) {
  assert.expect(0);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = {
    isOpen: true,
    actions: {
      close() {
        assert.ok(false, 'The close action should not be called');
      },
      reposition() {}
    }
  };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown}}<div id="inside-div">Lorem ipsum</div>{{/basic-dropdown/content}}
  `);

  run(() => {
    let event = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
    $('#inside-div')[0].dispatchEvent(event);
  });
});

test('Clicking in the trigger doesn\'t invoke the close action' , function(assert) {
  assert.expect(0);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = {
    isOpen: true,
    actions: {
      close() {
        assert.ok(false, 'The close action should not be called');
      },
      reposition() {}
    }
  };
  this.render(hbs`
    <div id="fake-trigger"></div>
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown triggerId="fake-trigger"}}Lorem ipsum{{/basic-dropdown/content}}
  `);

  run(() => {
    let event = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
    $('#fake-trigger')[0].dispatchEvent(event);
  });
});

test('Clicking in inside the a dropdown content nested inside another dropdown content doesn\'t invoke the close action on neither of them if the second is rendered in place' , function(assert) {
  assert.expect(0);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown1 = {
    isOpen: true,
    actions: {
      close() {
        assert.ok(false, 'The close action should not be called');
      },
      reposition() {}
    }
  };
  this.dropdown2 = {
    isOpen: true,
    actions: {
      close() {
        assert.ok(false, 'The close action should not be called either');
      },
      reposition() {}
    }
  };
  this.render(hbs`
    <div id="fake-trigger"></div>
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown1}}
      Lorem ipsum
      {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown2 renderInPlace=true}}
        <div id="nested-content-div">dolor sit amet</div>
      {{/basic-dropdown/content}}
    {{/basic-dropdown/content}}
  `);

  run(() => {
    let event = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
    $('#nested-content-div')[0].dispatchEvent(event);
  });
});

// Touch gestures while the component is opened
test('Tapping anywhere in the app outside the component will invoke the close action on the dropdown', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = {
    isOpen: true,
    actions: {
      close() {
        assert.ok(true, 'The close action gets called');
      },
      reposition() {}
    }
  };
  this.render(hbs`
    <div id="other-div"></div>
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown isTouchDevice=true}}Lorem ipsum{{/basic-dropdown/content}}
  `);

  run(() => {
    let touchstartEvent = new window.Event('touchstart', { bubbles: true, cancelable: true, view: window });
    let touchendEvent = new window.Event('touchend', { bubbles: true, cancelable: true, view: window });
    this.$('#other-div')[0].dispatchEvent(touchstartEvent);
    this.$('#other-div')[0].dispatchEvent(touchendEvent);
  });
});

test('Scrolling (touchstart + touchmove + touchend) anywhere in the app outside the component will invoke the close action on the dropdown', function(assert) {
  assert.expect(0);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = {
    isOpen: true,
    actions: {
      close() {
        assert.ok(false, 'The close action does not called');
      },
      reposition() {}
    }
  };
  this.render(hbs`
    <div id="other-div"></div>
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown isTouchDevice=true}}Lorem ipsum{{/basic-dropdown/content}}
  `);

  run(() => {
    let touchstartEvent = new window.Event('touchstart', { bubbles: true, cancelable: true, view: window });
    let touchmoveEvent = new window.Event('touchmove', { bubbles: true, cancelable: true, view: window });
    let touchendEvent = new window.Event('touchend', { bubbles: true, cancelable: true, view: window });
    this.$('#other-div')[0].dispatchEvent(touchstartEvent);
    this.$('#other-div')[0].dispatchEvent(touchmoveEvent);
    this.$('#other-div')[0].dispatchEvent(touchendEvent);
  });
});

// Repositining
test('The component is repositioned immediatly when opened', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = {
    isOpen: true,
    actions: {
      reposition() {
        assert.ok(true, 'Reposition is invoked exactly once');
      }
    }
  };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown}}Lorem ipsum{{/basic-dropdown/content}}
  `);
});

test('The component is not repositioned if it is closed', function(assert) {
  assert.expect(0);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = {
    isOpen: false,
    actions: {
      reposition() {
        assert.ok(false, 'Reposition is invoked exactly once');
      }
    }
  };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown}}Lorem ipsum{{/basic-dropdown/content}}
  `);
});

test('The component is repositioned if the window scrolls', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  let repositions = 0;
  this.dropdown = {
    isOpen: true,
    actions: {
      reposition() {
        repositions++;
      }
    }
  };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  run(() => window.dispatchEvent(new window.Event('scroll')));
  assert.equal(repositions, 2, 'The component has been repositioned twice');
});

test('The component is repositioned if the window is resized', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  let repositions = 0;
  this.dropdown = {
    isOpen: true,
    actions: {
      reposition() {
        repositions++;
      }
    }
  };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  run(() => window.dispatchEvent(new window.Event('resize')));
  assert.equal(repositions, 2, 'The component has been repositioned twice');
});

test('The component is repositioned if the orientation changes', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  let repositions = 0;
  this.dropdown = {
    isOpen: true,
    actions: {
      reposition() {
        repositions++;
      }
    }
  };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  run(() => window.dispatchEvent(new window.Event('orientationchange')));
  assert.equal(repositions, 2, 'The component has been repositioned twice');
});

test('The component is repositioned if the content of the dropdown changs', function(assert) {
  assert.expect(1);
  let done = assert.async();
  this.appRoot = document.querySelector('#ember-testing');
  let repositions = 0;
  this.dropdown = {
    isOpen: true,
    actions: {
      reposition() {
        repositions++;
        if (repositions === 2) {
          assert.equal(repositions, 2, 'It was repositioned twice');
          done();
        }
      }
    }
  };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown}}
      <div id="content-target-div"></div>
    {{/basic-dropdown/content}}
  `);
  run(() => {
    let target = document.getElementById('content-target-div');
    let span = document.createElement('SPAN');
    target.appendChild(span);
  });
});

// Animations
test('The component is opened with an `transitioning-in` class that is then replaced by a `transitioned-in` class once the animation finishes', function(assert) {
  assert.expect(3);
  let done = assert.async();
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: true, actions: { reposition() { } } };
  this.render(hbs`
    <style>
      @keyframes test-fade-in {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }

      .ember-basic-dropdown-content.test-fade-in.ember-basic-dropdown--transitioning-in {
        animation: test-fade-in 0.25s;
      }
    </style>
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown class="test-fade-in"}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = $('.ember-basic-dropdown-content');
  assert.ok($content.hasClass('ember-basic-dropdown--transitioning-in'), 'Renders with a transitioning-in class');
  setTimeout(function() {
    assert.ok(!$content.hasClass('ember-basic-dropdown--transitioning-in'), 'The transitioning-in class is gone');
    assert.ok($content.hasClass('ember-basic-dropdown--transitioned-in'), 'The transitioned-in class appeared');
    done();
  }, 250 + 50);
});

test('The component is closed by addong `transitioning-out` class to a ghost copy of the dropdown', function(assert) {
  assert.expect(2);
  let done = assert.async();
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: true, actions: { reposition() { } } };
  this.render(hbs`
    <style>
      @keyframes test-fade-in {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }

      .ember-basic-dropdown-content.test-fade-in.ember-basic-dropdown--transitioning-out {
        animation: test-fade-in 0.25s reverse;
      }
    </style>
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown class="test-fade-in"}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  run(() => this.set('dropdown.isOpen', false));
  let $content = $('.ember-basic-dropdown-content');
  assert.ok($content.hasClass('ember-basic-dropdown--transitioning-out'), 'Renders with a transitioning-in class');
  setTimeout(function() {
    assert.equal($('.ember-basic-dropdown-content').length, 0, 'The ghost copy has been removed');
    done();
  }, 250 + 50);
});