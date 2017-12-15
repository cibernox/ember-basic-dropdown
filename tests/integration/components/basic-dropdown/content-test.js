import { module, test } from 'qunit';
import { setupRenderingTest, render } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';
import { click, triggerEvent } from '@ember/test-helpers';
import { find } from 'ember-native-dom-helpers';

module('Integration | Component | basic-dropdown/content', function(hooks) {
  setupRenderingTest(hooks);

  // Basic rendering
  test('If the dropdown is open renders the given block in a div with class `ember-basic-dropdown-content`', async function(assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 'e123', isOpen: true, actions: { reposition() { } } };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing'}}Lorem ipsum{{/basic-dropdown/content}}
    `);
    let content = find('.ember-basic-dropdown-content');
    assert.equal(content.textContent.trim(), 'Lorem ipsum', 'It contains the given block');
    assert.equal(content.parentElement.id, 'ember-testing', 'It is rendered in the #ember-testing div');
  });

  test('If the dropdown is closed, nothing is rendered', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 'e123', isOpen: false };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing'}}Lorem ipsum{{/basic-dropdown/content}}
    `);
    assert.notOk(find('.ember-basic-dropdown-content'), 'Nothing is rendered');
  });

  test('If it receives `renderInPlace=true`, it is rendered right here instead of elsewhere', async function(assert) {
    assert.expect(2);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      actions: {
        reposition() {
          return {};
        }
      }
    };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing' renderInPlace=true}}Lorem ipsum{{/basic-dropdown/content}}
    `);
    let content = find('.ember-basic-dropdown-content');
    assert.ok(content, 'It is rendered in the spot');
    assert.notEqual(content.parentElement.id, 'ember-testing', 'It isn\'t rendered in the #ember-testing div');
  });

  test('If it receives `to="foo123"`, it is rendered in the element with that ID', async function(assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 'e123', isOpen: true, actions: { reposition() { } } };
    await render(hbs`
      <div id="foo123"></div>
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing' to="foo123"}}Lorem ipsum{{/basic-dropdown/content}}
    `);
    let content = find('#foo123 .ember-basic-dropdown-content');
    assert.ok(content, 'It is rendered');
    assert.equal(content.parentElement.id, 'foo123', 'It is rendered in the element with the given ID');
  });

  test('It derives the ID of the content from the `uniqueId` property of of the dropdown', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 'e123', isOpen: true, actions: { reposition() { } } };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing'}}Lorem ipsum{{/basic-dropdown/content}}
    `);
    assert.equal(find('.ember-basic-dropdown-content').id, 'ember-basic-dropdown-content-e123', 'contains the expected ID');
  });

  test('If it receives `class="foo123"`, the rendered content will have that class along with the default one', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 'e123', isOpen: true, actions: { reposition() { } } };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing' class="foo123"}}Lorem ipsum{{/basic-dropdown/content}}
    `);
    assert.ok(find('.ember-basic-dropdown-content.foo123'), 'The dropdown contains that class');
  });

  test('If it receives `defaultClass="foo123"`, the rendered content will have that class along with the default one', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 'e123', isOpen: true, actions: { reposition() { } } };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing' defaultClass="foo123"}}Lorem ipsum{{/basic-dropdown/content}}
    `);
    assert.ok(find('.ember-basic-dropdown-content.foo123'), 'The dropdown contains that class');
  });

  test('If it receives `dir="rtl"`, the rendered content will have the attribute set', async function(assert) {
    assert.expect(1);
    this.dropdown = { isOpen: true, actions: { reposition() { } } };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing' dir="rtl"}}Lorem ipsum{{/basic-dropdown/content}}
    `);
    assert.equal(find('.ember-basic-dropdown-content').attributes.dir.value, 'rtl', 'The dropdown has `dir="rtl"`');
  });

  // Clicking while the component is opened
  test('Clicking anywhere in the app outside the component will invoke the close action on the dropdown', async function(assert) {
    assert.expect(1);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      actions: {
        close() {
          assert.ok(true, 'The close action gets called');
        },
        reposition() {}
      }
    };
    await render(hbs`
      <div id="other-div"></div>
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing'}}Lorem ipsum{{/basic-dropdown/content}}
    `);

    click('#other-div');
  });

  test('Clicking anywhere inside the dropdown content doesn\'t invoke the close action', async function(assert) {
    assert.expect(0);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      actions: {
        close() {
          assert.ok(false, 'The close action should not be called');
        },
        reposition() {}
      }
    };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing'}}<div id="inside-div">Lorem ipsum</div>{{/basic-dropdown/content}}
    `);
    click('#inside-div');
  });

  test('Clicking in inside the a dropdown content nested inside another dropdown content doesn\'t invoke the close action on neither of them if the second is rendered in place', async function(assert) {
    assert.expect(0);
    this.dropdown1 = {
      uniqueId: 'ember1',
      isOpen: true,
      actions: {
        close() {
          assert.ok(false, 'The close action should not be called');
        },
        reposition() {
          return {};
        }
      }
    };
    this.dropdown2 = {
      uniqueId: 'ember2',
      isOpen: true,
      actions: {
        close() {
          assert.ok(false, 'The close action should not be called either');
        },
        reposition() {
          return {};
        }
      }
    };
    await render(hbs`
      <div id="fake-trigger"></div>
      {{#basic-dropdown/content dropdown=dropdown1 destination='ember-testing'}}
        Lorem ipsum
        {{#basic-dropdown/content dropdown=dropdown2 destination='ember-testing' renderInPlace=true}}
          <div id="nested-content-div">dolor sit amet</div>
        {{/basic-dropdown/content}}
      {{/basic-dropdown/content}}
    `);

    click('#nested-content-div');
  });

  // Touch gestures while the component is opened
  test('Tapping anywhere in the app outside the component will invoke the close action on the dropdown', async function(assert) {
    assert.expect(1);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      actions: {
        close() {
          assert.ok(true, 'The close action gets called');
        },
        reposition() {}
      }
    };
    await render(hbs`
      <div id="other-div"></div>
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing' isTouchDevice=true}}Lorem ipsum{{/basic-dropdown/content}}
    `);

    triggerEvent('#other-div', 'touchstart');
    triggerEvent('#other-div', 'touchend');
  });

  test('Scrolling (touchstart + touchmove + touchend) anywhere in the app outside the component will invoke the close action on the dropdown', async function(assert) {
    assert.expect(0);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      actions: {
        close() {
          assert.ok(false, 'The close action does not called');
        },
        reposition() {}
      }
    };
    await render(hbs`
      <div id="other-div"></div>
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing' isTouchDevice=true}}Lorem ipsum{{/basic-dropdown/content}}
    `);

    triggerEvent('#other-div', 'touchstart');
    triggerEvent('#other-div', 'touchmove');
    triggerEvent('#other-div', 'touchend');
  });

  // Focus
  test('If it receives an `onFocusIn` action, it is invoked if a focusin event is fired inside the content', async function(assert) {
    assert.expect(3);
    this.dropdown = { uniqueId: 'e123', isOpen: true, actions: { reposition() { } } };
    this.onFocusIn = (api, e) => {
      assert.ok(true, 'The action is invoked');
      assert.equal(api, this.dropdown, 'The first argument is the API');
      assert.ok(e instanceof window.Event, 'the second argument is an event');
    };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing' onFocusIn=onFocusIn}}
        <input type="text" id="test-input-focusin" />
      {{/basic-dropdown/content}}
    `);
    run(() => find('#test-input-focusin').focus());
  });

  test('If it receives an `onFocusOut` action, it is invoked if a focusout event is fired inside the content', async function(assert) {
    assert.expect(3);
    this.dropdown = { uniqueId: 'e123', isOpen: true, actions: { reposition() { } } };
    this.onFocusOut = (api, e) => {
      assert.ok(true, 'The action is invoked');
      assert.equal(api, this.dropdown, 'The first argument is the API');
      assert.ok(e instanceof window.Event, 'the second argument is an event');
    };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing' onFocusOut=onFocusOut}}
        <input type="text" id="test-input-focusin" />
      {{/basic-dropdown/content}}
    `);
    let input = find('#test-input-focusin');
    run(() => input.focus());
    run(() => input.blur());
  });

  // Mouseenter/leave
  test('If it receives an `onMouseEnter` action, it is invoked if a mouseenter event is fired on the content', async function(assert) {
    assert.expect(3);
    this.dropdown = { uniqueId: 'e123', isOpen: true, actions: { reposition() { } } };
    this.onMouseEnter = (api, e) => {
      assert.ok(true, 'The action is invoked');
      assert.equal(api, this.dropdown, 'The first argument is the API');
      assert.ok(e instanceof window.Event, 'the second argument is an event');
    };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing' onMouseEnter=onMouseEnter}}
        Content
      {{/basic-dropdown/content}}
    `);
    triggerEvent('.ember-basic-dropdown-content', 'mouseenter');
  });

  test('If it receives an `onMouseLeave` action, it is invoked if a mouseleave event is fired on the content', async function(assert) {
    assert.expect(3);
    this.dropdown = { uniqueId: 'e123', isOpen: true, actions: { reposition() { } } };
    this.onMouseLeave = (api, e) => {
      assert.ok(true, 'The action is invoked');
      assert.equal(api, this.dropdown, 'The first argument is the API');
      assert.ok(e instanceof window.Event, 'the second argument is an event');
    };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing' onMouseLeave=onMouseLeave}}
        Content
      {{/basic-dropdown/content}}
    `);
    triggerEvent('.ember-basic-dropdown-content', 'mouseleave');
  });

  // Repositining
  test('The component is repositioned immediatly when opened', async function(assert) {
    assert.expect(1);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      actions: {
        reposition() {
          assert.ok(true, 'Reposition is invoked exactly once');
        }
      }
    };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing'}}Lorem ipsum{{/basic-dropdown/content}}
    `);
  });

  test('The component is not repositioned if it is closed', async function(assert) {
    assert.expect(0);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: false,
      actions: {
        reposition() {
          assert.ok(false, 'Reposition is invoked exactly once');
        }
      }
    };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing'}}Lorem ipsum{{/basic-dropdown/content}}
    `);
  });

  test('The component cancels events when preventScroll is true', async function(assert) {
    assert.expect(4);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      actions: {
        reposition() {}
      }
    };

    await render(hbs`
      <div id="outer-div" style="width: 100px; height: 100px; overflow: auto;">
        <div style="width: 200px; height: 200px;">content scroll test</div>
      </div>
      {{#basic-dropdown/content preventScroll=true dropdown=dropdown destination='ember-testing'}}
        <div id="inner-div" style="width: 100px; height: 100px; overflow: auto;">
          <div style="width: 200px; height: 200px;">content scroll test</div>
        </div>
      {{/basic-dropdown/content}}
    `);

    let innerScrollable = find('#inner-div');
    let innerScrollableEvent = new WheelEvent('wheel', { deltaY: 4, cancelable: true, bubbles: true });
    run(() => innerScrollable.dispatchEvent(innerScrollableEvent));
    assert.strictEqual(innerScrollableEvent.defaultPrevented, false, 'The inner scrollable does not cancel wheel events.');

    innerScrollable.scrollTop = 4;
    let innerScrollableCanceledEvent = new WheelEvent('wheel', { deltaY: -10, cancelable: true, bubbles: true });
    run(() => innerScrollable.dispatchEvent(innerScrollableCanceledEvent));
    assert.strictEqual(innerScrollableCanceledEvent.defaultPrevented, true, 'The inner scrollable cancels out of bound wheel events.');
    assert.strictEqual(innerScrollable.scrollTop, 0, 'The innerScrollable was scrolled anyway.');

    let outerScrollable = find('#outer-div');
    let outerScrollableEvent = new WheelEvent('wheel', { deltaY: 4, cancelable: true, bubbles: true });
    run(() => outerScrollable.dispatchEvent(outerScrollableEvent));
    assert.strictEqual(outerScrollableEvent.defaultPrevented, true, 'The outer scrollable cancels wheel events.');
  });

  test('The component is repositioned if the window scrolls', async function(assert) {
    assert.expect(1);
    let repositions = 0;
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      actions: {
        reposition() {
          repositions++;
        }
      }
    };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing'}}Lorem ipsum{{/basic-dropdown/content}}
    `);
    run(() => window.dispatchEvent(new window.Event('scroll')));
    assert.equal(repositions, 2, 'The component has been repositioned twice');
  });

  test('The component is repositioned if the window is resized', async function(assert) {
    assert.expect(1);
    let repositions = 0;
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      actions: {
        reposition() {
          repositions++;
        }
      }
    };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing'}}Lorem ipsum{{/basic-dropdown/content}}
    `);
    run(() => window.dispatchEvent(new window.Event('resize')));
    assert.equal(repositions, 2, 'The component has been repositioned twice');
  });

  test('The component is repositioned if the orientation changes', async function(assert) {
    assert.expect(1);
    let repositions = 0;
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      actions: {
        reposition() {
          repositions++;
        }
      }
    };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing'}}Lorem ipsum{{/basic-dropdown/content}}
    `);
    run(() => window.dispatchEvent(new window.Event('orientationchange')));
    assert.equal(repositions, 2, 'The component has been repositioned twice');
  });

  test('The component is repositioned if the content of the dropdown changs', async function(assert) {
    assert.expect(1);
    let done = assert.async();
    let repositions = 0;
    this.dropdown = {
      uniqueId: 'e123',
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
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing'}}
        <div id="content-target-div"></div>
      {{/basic-dropdown/content}}
    `);
    run(() => {
      let target = document.getElementById('content-target-div');
      let span = document.createElement('SPAN');
      target.appendChild(span);
    });
  });

  test('A renderInPlace component is repositioned if the window scrolls', async function(assert) {
    assert.expect(1);
    let repositions = 0;
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      actions: {
        reposition() {
          repositions++;
        }
      }
    };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown renderInPlace=true destination='ember-testing'}}Lorem ipsum{{/basic-dropdown/content}}
    `);
    run(() => window.dispatchEvent(new window.Event('scroll')));
    assert.equal(repositions, 2, 'The component has been repositioned twice');
  });

  // Overlay
  test('If it receives an `overlay=true` option, there is an overlay covering all the screen', async function(assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 'e123', isOpen: true, actions: { reposition() { } } };
    await render(hbs`
      {{#basic-dropdown/content dropdown=dropdown destination='ember-testing' overlay=true}}
        <input type="text" id="test-input-focusin" />
      {{/basic-dropdown/content}}
    `);
    assert.ok(find('.ember-basic-dropdown-overlay'), 'There is one overlay');
    run(this, 'set', 'dropdown.isOpen', false);
    assert.notOk(find('.ember-basic-dropdown-overlay'), 'There is no overlay when closed');
  });
});
