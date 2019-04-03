import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';
import { render, click, triggerEvent, focus, blur, triggerKeyEvent } from '@ember/test-helpers';

module('Integration | Component | BasicDropdown::Content', function(hooks) {
  setupRenderingTest(hooks);

  // Basic rendering
  test('If the dropdown is open renders the given block in a div with class `ember-basic-dropdown-content`', async function(assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 'e123', isOpen: true, actions: { reposition() { } } };
    await render(hbs`
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el">Lorem ipsum</BasicDropdown::Content>
    `);
    assert.dom('.ember-basic-dropdown-content').hasText('Lorem ipsum', 'It contains the given block');
    assert.dom('#destination-el > .ember-basic-dropdown-content').exists('It is rendered in the #ember-testing div');
  });

  test('If the dropdown is closed, nothing is rendered', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 'e123', isOpen: false };
    await render(hbs`
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el">Lorem ipsum</BasicDropdown::Content>
    `);
    assert.dom('.ember-basic-dropdown-content').doesNotExist('Nothing is rendered');
  });

  test('If it receives `@renderInPlace={{true}}`, it is rendered right here instead of elsewhere', async function(assert) {
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
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el" @renderInPlace={{true}}>Lorem ipsum</BasicDropdown::Content>
    `);
    assert.dom('.ember-basic-dropdown-content').exists('It is rendered in the spot');
    assert.dom('#destination-el .ember-basic-dropdown-content').doesNotExist('It isn\'t rendered in the #ember-testing div');
  });

  test('It derives the ID of the content from the `uniqueId` property of of the dropdown', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 'e123', isOpen: true, actions: { reposition() { } } };
    await render(hbs`
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el">Lorem ipsum</BasicDropdown::Content>
    `);
    assert.dom('.ember-basic-dropdown-content').hasAttribute('id', 'ember-basic-dropdown-content-e123', 'contains the expected ID');
  });

  test('If it receives `class="foo123"`, the rendered content will have that class along with the default one', async function(assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 'e123', isOpen: true, actions: { reposition() { } } };
    await render(hbs`
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el" class="foo123">Lorem ipsum</BasicDropdown::Content>
    `);
    assert.dom('.ember-basic-dropdown-content').hasClass('foo123', 'The dropdown contains that class');
  });

  // test('If it receives `defaultClass="foo123"`, the rendered content will have that class along with the default one', async function(assert) {
  //   assert.expect(1);
  //   this.dropdown = { uniqueId: 'e123', isOpen: true, actions: { reposition() { } } };
  //   await render(hbs`
  //     <div id="destination-el"></div>
  //     <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el" defaultClass="foo123">Lorem ipsum</BasicDropdown::Content>
  //   `);
  //   assert.dom('.ember-basic-dropdown-content').hasClass('foo123', 'The dropdown contains that class');
  // });

  test('If it receives `dir="rtl"`, the rendered content will have the attribute set', async function(assert) {
    assert.expect(1);
    this.dropdown = { isOpen: true, actions: { reposition() { } } };
    await render(hbs`
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el" dir="rtl">Lorem ipsum</BasicDropdown::Content>
    `);
    assert.dom('.ember-basic-dropdown-content').hasAttribute('dir', 'rtl', 'The dropdown has `dir="rtl"`');
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
      <div id="destination-el"></div>
      <div id="other-div"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @rootEventType="mousedown" @destination="destination-el">Lorem ipsum</BasicDropdown::Content>
    `);

    await click('#other-div');
  });

  test('Specifying the rootEventType as click will not close a component if it is opened', async function(assert) {
    assert.expect(0);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      actions: {
        close() {
          assert.ok(true, 'The close action should not be called');
        },
        reposition() {}
      }
    };
    await render(hbs`
      <div id="destination-el"></div>
      <div id="other-div"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @rootEventType="click" @destination="destination-el">Lorem ipsum</BasicDropdown::Content>
    `);

    await triggerEvent('#other-div', 'mousedown');
  });

  test('Specifying the rootEventType as mousedown will close a component if it is opened', async function(assert) {
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
      <div id="destination-el"></div>
      <div id="other-div"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @rootEventType="mousedown" @destination="destination-el">Lorem ipsum</BasicDropdown::Content>
    `);

    await triggerEvent('#other-div', 'mousedown');
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
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el"><div id="inside-div">Lorem ipsum</div></BasicDropdown::Content>
    `);
    await click('#inside-div');
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
      <div id="destination-el"></div>
      <div id="fake-trigger"></div>
      <BasicDropdown::Content @dropdown={{dropdown1}} @destination="destination-el">
        Lorem ipsum
        <BasicDropdown::Content @dropdown={{dropdown2}} @destination="destination-el" @renderInPlace={{true}}>
          <div id="nested-content-div">dolor sit amet</div>
        </BasicDropdown::Content>
      </BasicDropdown::Content>
    `);

    await click('#nested-content-div');
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
      <div id="destination-el"></div>
      <div id="other-div"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el" @isTouchDevice={{true}}>Lorem ipsum</BasicDropdown::Content>
    `);

    await triggerEvent('#other-div', 'touchstart');
    await triggerEvent('#other-div', 'touchend');
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
      <div id="destination-el"></div>
      <div id="other-div"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el" @isTouchDevice={{true}}>Lorem ipsum</BasicDropdown::Content>
    `);

    await triggerEvent('#other-div', 'touchstart');
    await triggerEvent('#other-div', 'touchmove');
    await triggerEvent('#other-div', 'touchend');
  });

  // // Focus
  test('If it receives an `onFocusIn` action, it is invoked if a focusin event is fired inside the content', async function(assert) {
    assert.expect(3);
    this.dropdown = { uniqueId: 'e123', isOpen: true, actions: { reposition() { } } };
    this.onFocusIn = (api, e) => {
      assert.ok(true, 'The action is invoked');
      assert.equal(api, this.dropdown, 'The first argument is the API');
      assert.ok(e instanceof window.Event, 'the second argument is an event');
    };
    await render(hbs`
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el" @onFocusIn={{onFocusIn}}>
        <input type="text" id="test-input-focusin" />
      </BasicDropdown::Content>
    `);
    await focus('#test-input-focusin');
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
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el" @onFocusOut={{onFocusOut}}>
        <input type="text" id="test-input-focusin" />
      </BasicDropdown::Content>
    `);
    await focus('#test-input-focusin');
    await blur('#test-input-focusin');
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
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el" @onMouseEnter={{onMouseEnter}}>
        Content
      </BasicDropdown::Content>
    `);
    await triggerEvent('.ember-basic-dropdown-content', 'mouseenter');
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
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el" @onMouseLeave={{onMouseLeave}}>
        Content
      </BasicDropdown::Content>
    `);
    await triggerEvent('.ember-basic-dropdown-content', 'mouseleave');
  });

  // Keydown
  test('If it receives an `onKeyDown` action, it is invoked if a keydown event is fired on the content', async function (assert) {
    assert.expect(3);
    this.dropdown = { uniqueId: 'e123', isOpen: true, actions: { reposition() { } } };
    this.onKeyDown = (api, e) => {
      assert.equal(api, this.dropdown, 'receives the dropdown as 1st argument');
      assert.ok(e instanceof window.Event, 'It receives the event as second argument');
      assert.equal(e.keyCode, 70, 'the event is the keydown event');
    };
    await render(hbs`
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el" @onKeyDown={{onKeyDown}}>
        <input id="inner-input">
      </BasicDropdown::Content>
    `);
    await focus('#inner-input');
    await triggerKeyEvent('#inner-input', 'keydown', 70);
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
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el">Lorem ipsum</BasicDropdown::Content>
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
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el">Lorem ipsum</BasicDropdown::Content>
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
      <div id="destination-el"></div>
      <div id="outer-div" style="width: 100px; height: 100px; overflow: auto;">
        <div style="width: 200px; height: 200px;">content scroll test</div>
      </div>
      <BasicDropdown::Content @dropdown={{dropdown}} @preventScroll={{true}} @destination="destination-el">
        <div id="inner-div" style="width: 100px; height: 100px; overflow: auto;">
          <div style="width: 200px; height: 200px;">content scroll test</div>
        </div>
      </BasicDropdown::Content>
    `);

    let innerScrollable = this.element.querySelector('#inner-div');
    let innerScrollableEvent = new WheelEvent('wheel', { deltaY: 4, cancelable: true, bubbles: true });
    run(() => innerScrollable.dispatchEvent(innerScrollableEvent));
    assert.strictEqual(innerScrollableEvent.defaultPrevented, false, 'The inner scrollable does not cancel wheel events.');

    innerScrollable.scrollTop = 4;
    let innerScrollableCanceledEvent = new WheelEvent('wheel', { deltaY: -10, cancelable: true, bubbles: true });
    run(() => innerScrollable.dispatchEvent(innerScrollableCanceledEvent));
    assert.strictEqual(innerScrollableCanceledEvent.defaultPrevented, true, 'The inner scrollable cancels out of bound wheel events.');
    assert.strictEqual(innerScrollable.scrollTop, 0, 'The innerScrollable was scrolled anyway.');

    let outerScrollable = this.element.querySelector('#outer-div');
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
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el">Lorem ipsum</BasicDropdown::Content>
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
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el">Lorem ipsum</BasicDropdown::Content>
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
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el">Lorem ipsum</BasicDropdown::Content>
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
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el">
        <div id="content-target-div"></div>
      </BasicDropdown::Content>
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
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @renderInPlace={{true}} @destination="destination-el">Lorem ipsum</BasicDropdown::Content>
    `);
    run(() => window.dispatchEvent(new window.Event('scroll')));
    assert.equal(repositions, 2, 'The component has been repositioned twice');
  });

  // Overlay
  test('If it receives an `overlay=true` option, there is an overlay covering all the screen', async function(assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 'e123', isOpen: true, actions: { reposition() { } } };
    await render(hbs`
      <div id="destination-el"></div>
      <BasicDropdown::Content @dropdown={{dropdown}} @destination="destination-el" @overlay={{true}}>
        <input type="text" id="test-input-focusin" />
      </BasicDropdown::Content>
    `);
    assert.dom('.ember-basic-dropdown-overlay').exists('There is one overlay');
    run(this, 'set', 'dropdown.isOpen', false);
    assert.dom('.ember-basic-dropdown-overlay').doesNotExist('There is no overlay when closed');
  });
});
