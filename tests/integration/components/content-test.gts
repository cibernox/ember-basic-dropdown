import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  triggerEvent,
  settled,
  type TestContext,
} from '@ember/test-helpers';
import HostWrapper from '../../../demo-app/components/host-wrapper';
import BasicDropdownContent from '#src/components/basic-dropdown-content.gts';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import type { Dropdown } from '#src/types.ts';

interface ExtendedTestContext extends TestContext {
  element: HTMLElement;
  dropdown: Dropdown;
  dropdown1: Dropdown;
  dropdown2: Dropdown;
  divVisible?: boolean;
  onFocusIn: (dropdown?: Dropdown, event?: FocusEvent) => void;
  onFocusOut: (dropdown?: Dropdown, event?: FocusEvent) => void;
  onMouseEnter: (dropdown?: Dropdown, event?: MouseEvent) => void;
  onMouseLeave: (dropdown?: Dropdown, event?: MouseEvent) => void;
  shouldReposition?: (
    mutations: MutationRecord[],
    dropdown?: Dropdown,
  ) => boolean;
}

function getRootNode(element: Element): HTMLElement {
  const shadowRoot = element.querySelector('[data-host-wrapper]')?.shadowRoot;
  if (shadowRoot) {
    return shadowRoot as unknown as HTMLElement;
  }

  return element.getRootNode() as HTMLElement;
}

module('Integration | Component | basic-dropdown-content', function (hooks) {
  setupRenderingTest(hooks);

  // Basic rendering
  test<ExtendedTestContext>('If the dropdown is open renders the given block in a div with class `ember-basic-dropdown-content`', async function (assert) {
    const self = this;

    assert.expect(2);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
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
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasText('Lorem ipsum', 'It contains the given block');
    assert
      .dom(
        '#destination-el > .ember-basic-dropdown-content',
        getRootNode(this.element),
      )
      .exists('It is rendered in the #ember-testing div');
  });

  test<ExtendedTestContext>('If a `@defaultClass` argument is provided to the content, its value is added to the list of classes', async function (assert) {
    const self = this;

    assert.expect(2);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
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
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
            @defaultClass="extra-class"
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasText('Lorem ipsum', 'It contains the given block');
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasClass('extra-class');
  });

  test<ExtendedTestContext>('If the dropdown is closed, nothing is rendered', async function (assert) {
    const self = this;

    assert.expect(1);
    this.dropdown = {
      uniqueId: 'e123',
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
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .doesNotExist('Nothing is rendered');
  });

  test<ExtendedTestContext>('If it receives `@renderInPlace={{true}}`, it is rendered right here instead of elsewhere', async function (assert) {
    const self = this;

    assert.expect(2);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
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
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
            @renderInPlace={{true}}
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .exists('It is rendered in the spot');
    assert
      .dom(
        '#destination-el .ember-basic-dropdown-content',
        getRootNode(this.element),
      )
      .doesNotExist("It isn't rendered in the #ember-testing div");
  });

  test<ExtendedTestContext>('It derives the ID of the content from the `uniqueId` property of of the dropdown', async function (assert) {
    const self = this;

    assert.expect(1);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
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
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasAttribute(
        'id',
        'ember-basic-dropdown-content-e123',
        'contains the expected ID',
      );
  });

  test<ExtendedTestContext>('If it receives `class="foo123"`, the rendered content will have that class along with the default one', async function (assert) {
    const self = this;

    assert.expect(1);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
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
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
            class="foo123"
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasClass('foo123', 'The dropdown contains that class');
  });

  test<ExtendedTestContext>('If it receives `dir="rtl"`, the rendered content will have the attribute set', async function (assert) {
    const self = this;

    assert.expect(1);
    this.dropdown = {
      uniqueId: '',
      isOpen: true,
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
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
            dir="rtl"
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
    assert
      .dom('.ember-basic-dropdown-content', getRootNode(this.element))
      .hasAttribute('dir', 'rtl', 'The dropdown has `dir="rtl"`');
  });

  // Clicking while the component is opened
  test<ExtendedTestContext>('Clicking anywhere in the app outside the component will invoke the close action on the dropdown', async function (assert) {
    const self = this;

    assert.expect(1);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      disabled: false,
      actions: {
        toggle: () => {},
        close() {
          assert.ok(true, 'The close action gets called');
        },
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
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <div id="other-div"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @rootEventType="mousedown"
            @destination="destination-el"
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector('#other-div') as Element,
    );
  });

  test<ExtendedTestContext>('Specifying the rootEventType as click will not close a component if it is opened', async function (assert) {
    const self = this;

    assert.expect(0);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      disabled: false,
      actions: {
        toggle: () => {},
        close() {
          assert.ok(true, 'The close action should not be called');
        },
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
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <div id="other-div"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @rootEventType="click"
            @destination="destination-el"
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );

    await triggerEvent(
      getRootNode(this.element).querySelector('#other-div') as HTMLElement,
      'mousedown',
    );
  });

  test<ExtendedTestContext>('Specifying the rootEventType as mousedown will close a component if it is opened', async function (assert) {
    const self = this;

    assert.expect(1);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      disabled: false,
      actions: {
        toggle: () => {},
        close() {
          assert.ok(true, 'The close action gets called');
        },
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
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <div id="other-div"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @rootEventType="mousedown"
            @destination="destination-el"
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );

    await triggerEvent(
      getRootNode(this.element).querySelector('#other-div') as HTMLElement,
      'mousedown',
    );
  });

  test<ExtendedTestContext>("Clicking anywhere inside the dropdown content doesn't invoke the close action", async function (assert) {
    const self = this;

    assert.expect(0);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      disabled: false,
      actions: {
        toggle: () => {},
        close() {
          assert.ok(false, 'The close action should not be called');
        },
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

    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
          ><div id="inside-div">Lorem ipsum</div></BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
    await click(
      getRootNode(this.element).querySelector('#inside-div') as Element,
    );
  });

  test<ExtendedTestContext>("Clicking in inside the a dropdown content nested inside another dropdown content doesn't invoke the close action on neither of them if the second is rendered in place", async function (assert) {
    const self = this;

    assert.expect(0);
    this.dropdown1 = {
      uniqueId: 'ember1',
      isOpen: true,
      disabled: false,
      actions: {
        toggle: () => {},
        close() {
          assert.ok(false, 'The close action should not be called');
        },
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
    this.dropdown2 = {
      uniqueId: 'ember2',
      isOpen: true,
      disabled: false,
      actions: {
        toggle: () => {},
        close() {
          assert.ok(false, 'The close action should not be called either');
        },
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
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <div id="fake-trigger"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown1}}
            @destination="destination-el"
          >
            Lorem ipsum
            <BasicDropdownContent
              @dropdown={{self.dropdown2}}
              @destination="destination-el"
              @renderInPlace={{true}}
            >
              <div id="nested-content-div">dolor sit amet</div>
            </BasicDropdownContent>
          </BasicDropdownContent>
        </HostWrapper>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector('#nested-content-div') as Element,
    );
  });

  // Touch gestures while the component is opened
  test<ExtendedTestContext>('Tapping anywhere in the app outside the component will invoke the close action on the dropdown', async function (assert) {
    const self = this;

    assert.expect(1);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      disabled: false,
      actions: {
        toggle: () => {},
        close() {
          assert.ok(true, 'The close action gets called');
        },
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
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <div id="other-div"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
            @isTouchDevice={{true}}
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );

    await triggerEvent(
      getRootNode(this.element).querySelector('#other-div') as HTMLElement,
      'touchstart',
    );
    await triggerEvent(
      getRootNode(this.element).querySelector('#other-div') as HTMLElement,
      'touchend',
    );
  });

  test<ExtendedTestContext>('Scrolling (touchstart + touchmove + touchend) anywhere in the app outside the component will invoke the close action on the dropdown', async function (assert) {
    const self = this;

    assert.expect(0);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      disabled: false,
      actions: {
        toggle: () => {},
        close() {
          assert.ok(false, 'The close action does not called');
        },
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
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <div id="other-div"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
            @isTouchDevice={{true}}
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );

    await triggerEvent(
      getRootNode(this.element).querySelector('#other-div') as HTMLElement,
      'touchstart',
    );
    await triggerEvent(
      getRootNode(this.element).querySelector('#other-div') as HTMLElement,
      'touchmove',
      {
        changedTouches: [{ touchType: 'direct', pageX: 0, pageY: 0 }],
      },
    );
    await triggerEvent(
      getRootNode(this.element).querySelector('#other-div') as HTMLElement,
      'touchend',
      {
        changedTouches: [{ touchType: 'direct', pageX: 0, pageY: 10 }],
      },
    );
  });

  test<ExtendedTestContext>('Using stylus on touch device will handle scroll/tap to fire close action properly', async function (assert) {
    const self = this;

    assert.expect(1);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      disabled: false,
      actions: {
        toggle: () => {},
        close() {
          assert.ok(true, 'The close action is called');
        },
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
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <div id="other-div"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
            @isTouchDevice={{true}}
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );

    // scroll
    await triggerEvent(
      getRootNode(this.element).querySelector('#other-div') as HTMLElement,
      'touchstart',
    );
    await triggerEvent(
      getRootNode(this.element).querySelector('#other-div') as HTMLElement,
      'touchmove',
      {
        changedTouches: [{ touchType: 'stylus', pageX: 0, pageY: 0 }],
      },
    );
    await triggerEvent(
      getRootNode(this.element).querySelector('#other-div') as HTMLElement,
      'touchend',
      {
        changedTouches: [{ touchType: 'stylus', pageX: 0, pageY: 10 }],
      },
    );

    // tap
    await triggerEvent(
      getRootNode(this.element).querySelector('#other-div') as HTMLElement,
      'touchstart',
    );
    await triggerEvent(
      getRootNode(this.element).querySelector('#other-div') as HTMLElement,
      'touchmove',
      {
        changedTouches: [{ touchType: 'stylus', pageX: 0, pageY: 0 }],
      },
    );
    await triggerEvent(
      getRootNode(this.element).querySelector('#other-div') as HTMLElement,
      'touchend',
      {
        changedTouches: [{ touchType: 'stylus', pageX: 4, pageY: 0 }],
      },
    );
  });

  // Arbitrary events
  test<ExtendedTestContext>('The user can attach arbitrary events to the content', async function (assert) {
    const self = this;

    assert.expect(3);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
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
    this.onMouseEnter = (api, e) => {
      assert.ok(true, 'The action is invoked');
      assert.deepEqual(api, this.dropdown, 'The first argument is the API');
      assert.ok(e instanceof window.Event, 'the second argument is an event');
    };
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
            {{on "mouseenter" (fn self.onMouseEnter self.dropdown)}}
          >
            Content
          </BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
    await triggerEvent(
      getRootNode(this.element).querySelector(
        '.ember-basic-dropdown-content',
      ) as HTMLElement,
      'mouseenter',
    );
  });

  // Repositining
  test<ExtendedTestContext>('The component is repositioned immediatly when opened', async function (assert) {
    const self = this;

    assert.expect(1);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      disabled: false,
      actions: {
        toggle: () => {},
        close: () => {},
        open: () => {},
        reposition() {
          assert.ok(true, 'Reposition is invoked exactly once');

          return undefined;
        },
        registerTriggerElement: () => {},
        registerDropdownElement: () => {},
        getTriggerElement: () => {
          return null;
        },
      },
    };
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
  });

  test<ExtendedTestContext>('The component is not repositioned if it is closed', async function (assert) {
    const self = this;

    assert.expect(0);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: false,
      disabled: false,
      actions: {
        toggle: () => {},
        close: () => {},
        open: () => {},
        reposition() {
          assert.ok(false, 'Reposition is invoked exactly once');
          return undefined;
        },
        registerTriggerElement: () => {},
        registerDropdownElement: () => {},
        getTriggerElement: () => {
          return null;
        },
      },
    };
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
  });

  test<ExtendedTestContext>('The component cancels events when preventScroll is true', async function (assert) {
    const self = this;

    assert.expect(4);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
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

    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          {{! template-lint-disable no-inline-styles }}
          <div
            id="outer-div"
            style="width: 100px; height: 100px; overflow: auto;"
          >
            <div style="width: 200px; height: 200px;">content scroll test</div>
          </div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @preventScroll={{true}}
            @destination="destination-el"
          >
            <div
              id="inner-div"
              style="width: 100px; height: 100px; overflow: auto;"
            >
              <div style="width: 200px; height: 200px;">content scroll test</div>
            </div>
          </BasicDropdownContent>
        </HostWrapper>
      </template>,
    );

    const innerScrollable = getRootNode(this.element).querySelector(
      '#inner-div',
    ) as HTMLElement;
    const innerScrollableEvent = new WheelEvent('wheel', {
      deltaY: 4,
      cancelable: true,
      bubbles: true,
    });
    innerScrollable.dispatchEvent(innerScrollableEvent);
    assert.false(
      innerScrollableEvent.defaultPrevented,
      'The inner scrollable does not cancel wheel events.',
    );

    innerScrollable.scrollTop = 4;
    const innerScrollableCanceledEvent = new WheelEvent('wheel', {
      deltaY: -10,
      cancelable: true,
      bubbles: true,
    });
    innerScrollable.dispatchEvent(innerScrollableCanceledEvent);
    assert.true(
      innerScrollableCanceledEvent.defaultPrevented,
      'The inner scrollable cancels out of bound wheel events.',
    );
    assert.strictEqual(
      innerScrollable.scrollTop,
      0,
      'The innerScrollable was scrolled anyway.',
    );

    const outerScrollable = getRootNode(this.element).querySelector(
      '#outer-div',
    ) as HTMLElement;
    const outerScrollableEvent = new WheelEvent('wheel', {
      deltaY: 4,
      cancelable: true,
      bubbles: true,
    });
    outerScrollable.dispatchEvent(outerScrollableEvent);
    assert.true(
      outerScrollableEvent.defaultPrevented,
      'The outer scrollable cancels wheel events.',
    );
  });

  test<ExtendedTestContext>('The component is repositioned if the window scrolls', async function (assert) {
    const self = this;

    assert.expect(1);
    let repositions = 0;
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      disabled: false,
      actions: {
        toggle: () => {},
        close: () => {},
        open: () => {},
        reposition() {
          repositions++;
          return undefined;
        },
        registerTriggerElement: () => {},
        registerDropdownElement: () => {},
        getTriggerElement: () => {
          return null;
        },
      },
    };
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
    window.dispatchEvent(new window.Event('scroll'));
    await settled();
    assert.strictEqual(
      repositions,
      2,
      'The component has been repositioned twice',
    );
  });

  test<ExtendedTestContext>('The component is repositioned if the window is resized', async function (assert) {
    const self = this;

    assert.expect(1);
    let repositions = 0;
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      disabled: false,
      actions: {
        toggle: () => {},
        close: () => {},
        open: () => {},
        reposition() {
          repositions++;
          return undefined;
        },
        registerTriggerElement: () => {},
        registerDropdownElement: () => {},
        getTriggerElement: () => {
          return null;
        },
      },
    };
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
    window.dispatchEvent(new window.Event('resize'));
    await settled();
    assert.strictEqual(
      repositions,
      2,
      'The component has been repositioned twice',
    );
  });

  test<ExtendedTestContext>('The component is repositioned if the orientation changes', async function (assert) {
    const self = this;

    assert.expect(1);
    let repositions = 0;
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      disabled: false,
      actions: {
        toggle: () => {},
        close: () => {},
        open: () => {},
        reposition() {
          repositions++;
          return undefined;
        },
        registerTriggerElement: () => {},
        registerDropdownElement: () => {},
        getTriggerElement: () => {
          return null;
        },
      },
    };
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
    window.dispatchEvent(new window.Event('orientationchange'));
    await settled();
    assert.strictEqual(
      repositions,
      2,
      'The component has been repositioned twice',
    );
  });

  test<ExtendedTestContext>('The component is repositioned when the content of the dropdown changes', async function (assert) {
    const self = this;

    assert.expect(1);
    let repositions = 0;
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      disabled: false,
      actions: {
        toggle: () => {},
        close: () => {},
        open: () => {},
        reposition() {
          repositions++;
          return undefined;
        },
        registerTriggerElement: () => {},
        registerDropdownElement: () => {},
        getTriggerElement: () => {
          return null;
        },
      },
    };
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
          >
            <div id="content-target-div"></div>
          </BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
    const target = getRootNode(this.element).querySelector(
      '#content-target-div',
    ) as HTMLElement;
    const span = document.createElement('SPAN');
    target.appendChild(span);
    await settled();
    assert.strictEqual(repositions, 2, 'It was repositioned twice');
  });

  test<ExtendedTestContext>('The component is repositioned when the content of the dropdown is changed through ember', async function (assert) {
    const self = this;

    assert.expect(1);
    let repositions = 0;
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      disabled: false,
      actions: {
        toggle: () => {},
        close: () => {},
        open: () => {},
        reposition() {
          repositions++;
          return undefined;
        },
        registerTriggerElement: () => {},
        registerDropdownElement: () => {},
        getTriggerElement: () => {
          return null;
        },
      },
    };
    this.divVisible = false;
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
          >
            {{#if self.divVisible}}
              <div></div>
            {{/if}}
          </BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
    this.set('divVisible', true);
    await settled();
    assert.strictEqual(repositions, 2, 'It was repositioned twice');
  });

  test<ExtendedTestContext>('@shouldReposition can be used to control which mutations should trigger a reposition', async function (assert) {
    const self = this;

    assert.expect(2);
    const done = assert.async();
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      disabled: false,
      actions: {
        toggle: () => {},
        close: () => {},
        open: () => {},
        reposition() {
          assert.ok(true, 'It was repositioned once');
          done();
          return undefined;
        },
        registerTriggerElement: () => {},
        registerDropdownElement: () => {},
        getTriggerElement: () => {
          return null;
        },
      },
    };

    this.shouldReposition = (mutations) => {
      assert.ok(true, '@shouldReposition was called');
      if (!mutations[0]) {
        return false;
      }
      return Array.prototype.slice
        .call(mutations[0].addedNodes)
        .some((node: Node) => {
          return node.nodeName !== 'SPAN';
        });
    };

    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
            @shouldReposition={{self.shouldReposition}}
          >
            <div id="content-target-div"></div>
          </BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
    const target = getRootNode(this.element).querySelector(
      '#content-target-div',
    );
    const span = document.createElement('SPAN');
    target?.appendChild(span);
  });

  test<ExtendedTestContext>('A renderInPlace component is repositioned if the window scrolls', async function (assert) {
    const self = this;

    assert.expect(1);
    let repositions = 0;
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
      disabled: false,
      actions: {
        toggle: () => {},
        close: () => {},
        open: () => {},
        reposition() {
          repositions++;
          return undefined;
        },
        registerTriggerElement: () => {},
        registerDropdownElement: () => {},
        getTriggerElement: () => {
          return null;
        },
      },
    };
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @renderInPlace={{true}}
            @destination="destination-el"
          >Lorem ipsum</BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
    window.dispatchEvent(new window.Event('scroll'));
    await settled();
    assert.strictEqual(
      repositions,
      2,
      'The component has been repositioned twice',
    );
  });

  // Overlay
  test<ExtendedTestContext>('If it receives an `overlay=true` option, there is an overlay covering all the screen', async function (assert) {
    const self = this;

    assert.expect(2);
    this.dropdown = {
      uniqueId: 'e123',
      isOpen: true,
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
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper>
          <div id="destination-el"></div>
          <BasicDropdownContent
            @dropdown={{self.dropdown}}
            @destination="destination-el"
            @overlay={{true}}
          >
            <input type="text" id="test-input-focusin" />
          </BasicDropdownContent>
        </HostWrapper>
      </template>,
    );
    assert
      .dom('.ember-basic-dropdown-overlay', getRootNode(this.element))
      .exists('There is one overlay');
    this.set('dropdown.isOpen', false);
    assert
      .dom('.ember-basic-dropdown-overlay', getRootNode(this.element))
      .doesNotExist('There is no overlay when closed');
  });

  /**
   * Tests related to https://github.com/cibernox/ember-basic-dropdown/issues/498
   * Can be removed when the template `V1` compatability event handlers are removed.
   */
  module('Content event handlers', function (hooks) {
    hooks.beforeEach(function () {
      this.set('dropdown', {
        uniqueId: 'e123',
        isOpen: true,
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

    test<ExtendedTestContext>('It properly handles the onFocusIn action', async function (assert) {
      const self = this;

      assert.expect(4);

      const onFocusIn = (dropdown: Dropdown, e?: FocusEvent) => {
        assert.ok(true, 'The `onFocusIn()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, [dropdown, e]);
      };

      this.set('onFocusIn', onFocusIn);

      await render<ExtendedTestContext>(
        <template>
          <HostWrapper>
            <div id="destination-el"></div>
            <BasicDropdownContent
              @dropdown={{self.dropdown}}
              @destination="destination-el"
              @onFocusIn={{self.onFocusIn}}
            >
              <div id="content-target-div"></div>
            </BasicDropdownContent>
          </HostWrapper>
        </template>,
      );

      await triggerEvent(
        getRootNode(this.element).querySelector(
          '.ember-basic-dropdown-content',
        ) as HTMLElement,
        'focusin',
      );
    });

    test<ExtendedTestContext>('It properly handles the onFocusOut action', async function (assert) {
      const self = this;

      assert.expect(4);

      const onFocusOut = (dropdown: Dropdown, e?: FocusEvent) => {
        assert.ok(true, 'The `onFocusOut()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, [dropdown, e]);
      };

      this.set('onFocusOut', onFocusOut);

      await render<ExtendedTestContext>(
        <template>
          <HostWrapper>
            <div id="destination-el"></div>
            <BasicDropdownContent
              @dropdown={{self.dropdown}}
              @destination="destination-el"
              @onFocusOut={{self.onFocusOut}}
            >
              <div id="content-target-div"></div>
            </BasicDropdownContent>
          </HostWrapper>
        </template>,
      );

      await triggerEvent(
        getRootNode(this.element).querySelector(
          '.ember-basic-dropdown-content',
        ) as HTMLElement,
        'focusout',
      );
    });

    test<ExtendedTestContext>('It properly handles the onMouseEnter action', async function (assert) {
      const self = this;

      assert.expect(4);

      const onMouseEnter = (dropdown: Dropdown, e?: MouseEvent) => {
        assert.ok(true, 'The `onMouseEnter()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, [dropdown, e]);
      };

      this.set('onMouseEnter', onMouseEnter);

      await render<ExtendedTestContext>(
        <template>
          <HostWrapper>
            <div id="destination-el"></div>
            <BasicDropdownContent
              @dropdown={{self.dropdown}}
              @destination="destination-el"
              @onMouseEnter={{self.onMouseEnter}}
            >
              <div id="content-target-div"></div>
            </BasicDropdownContent>
          </HostWrapper>
        </template>,
      );

      await triggerEvent(
        getRootNode(this.element).querySelector(
          '.ember-basic-dropdown-content',
        ) as HTMLElement,
        'mouseenter',
      );
    });

    test<ExtendedTestContext>('It properly handles the onMouseLeave action', async function (assert) {
      const self = this;

      assert.expect(4);

      const onMouseLeave = (dropdown: Dropdown, e?: MouseEvent) => {
        assert.ok(true, 'The `onMouseLeave()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, [dropdown, e]);
      };

      this.set('onMouseLeave', onMouseLeave);

      await render<ExtendedTestContext>(
        <template>
          <HostWrapper>
            <div id="destination-el"></div>
            <BasicDropdownContent
              @dropdown={{self.dropdown}}
              @destination="destination-el"
              @onMouseLeave={{self.onMouseLeave}}
            >
              <div id="content-target-div"></div>
            </BasicDropdownContent>
          </HostWrapper>
        </template>,
      );

      await triggerEvent(
        getRootNode(this.element).querySelector(
          '.ember-basic-dropdown-content',
        ) as HTMLElement,
        'mouseleave',
      );
    });

    test<ExtendedTestContext>('If it receives `@htmlTag`, the content uses that tag name', async function (assert) {
      const self = this;

      await render<ExtendedTestContext>(
        <template>
          <HostWrapper>
            <div id="destination-el"></div>
            <BasicDropdownContent
              @dropdown={{self.dropdown}}
              @destination="destination-el"
              @htmlTag="span"
            >
              Content
            </BasicDropdownContent>
          </HostWrapper>
        </template>,
      );

      assert.strictEqual(
        (
          getRootNode(this.element).querySelector(
            '.ember-basic-dropdown-content',
          ) as HTMLElement
        ).tagName,
        'SPAN',
      );
    });
  });
});
