import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { getScrollParent } from '../utils/calculate-position.js';
import { getAvailableScroll, getScrollDeltas, distributeScroll } from '../utils/scroll-helpers.js';
import hasMoved from '../utils/has-moved.js';
import { isTesting } from '@embroider/macros';
import { modifier } from 'ember-modifier';
import { runTask } from 'ember-lifeline';
import { precompileTemplate } from '@ember/template-compilation';
import { g, i, n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{! template-lint-disable no-inline-styles }}\n{{#if @dropdown.isOpen}}\n  <div\n    class=\"ember-basic-dropdown-content-wormhole-origin\"\n    {{this.registerDropdownContentWormhole}}\n  >\n    {{#if @renderInPlace}}\n      {{#if @overlay}}\n        <div class=\"ember-basic-dropdown-overlay\"></div>\n      {{/if}}\n\n      {{#let (element (or @htmlTag \"div\")) as |OptionalTag|}}\n        <OptionalTag\n          id={{this.dropdownId}}\n          class=\"ember-basic-dropdown-content ember-basic-dropdown-content--{{@hPosition}}\n            ember-basic-dropdown-content--{{@vPosition}}\n            {{this.animationClass}}{{if\n              @renderInPlace\n              \' ember-basic-dropdown-content--in-place\'\n            }}\n            {{@defaultClass}}\"\n          dir={{@dir}}\n          ...attributes\n          {{style @otherStyles this.positionStyles}}\n          {{this.respondToEvents}}\n          {{this.initiallyReposition}}\n          {{this.observeMutations}}\n          {{this.animateInAndOut}}\n          {{on \"focusin\" (fn (or @onFocusIn this.noop) @dropdown)}}\n          {{on \"focusout\" (fn (or @onFocusOut this.noop) @dropdown)}}\n          {{on \"mouseenter\" (fn (or @onMouseEnter this.noop) @dropdown)}}\n          {{on \"mouseleave\" (fn (or @onMouseLeave this.noop) @dropdown)}}\n          {{! V1 compatibility - See #498 }}\n        >\n          {{yield}}\n        </OptionalTag>\n      {{/let}}\n    {{else if this.destinationElement}}\n      {{#in-element this.destinationElement insertBefore=null}}\n        {{#if @overlay}}\n          <div class=\"ember-basic-dropdown-overlay\"></div>\n        {{/if}}\n\n        {{#let (element (or @htmlTag \"div\")) as |OptionalTag|}}\n          <OptionalTag\n            id={{this.dropdownId}}\n            class=\"ember-basic-dropdown-content ember-basic-dropdown-content--{{@hPosition}}\n              ember-basic-dropdown-content--{{@vPosition}}\n              {{this.animationClass}}{{if\n                @renderInPlace\n                \' ember-basic-dropdown-content--in-place\'\n              }}\n              {{@defaultClass}}\"\n            dir={{@dir}}\n            ...attributes\n            {{style @otherStyles this.positionStyles}}\n            {{this.respondToEvents}}\n            {{this.initiallyReposition}}\n            {{this.observeMutations}}\n            {{this.animateInAndOut}}\n            {{on \"focusin\" (fn (or @onFocusIn this.noop) @dropdown)}}\n            {{on \"focusout\" (fn (or @onFocusOut this.noop) @dropdown)}}\n            {{on \"mouseenter\" (fn (or @onMouseEnter this.noop) @dropdown)}}\n            {{on \"mouseleave\" (fn (or @onMouseLeave this.noop) @dropdown)}}\n            {{! V1 compatibility - See #498 }}\n          >\n            {{yield}}\n          </OptionalTag>\n        {{/let}}\n      {{/in-element}}\n    {{/if}}\n  </div>\n{{else}}\n  <div\n    id={{this.dropdownId}}\n    class=\"ember-basic-dropdown-content-placeholder\"\n    {{style (hash display=\"none\")}}\n  ></div>\n{{/if}}");

class BasicDropdownContent extends Component {
  transitioningInClass = this.args.transitioningInClass || 'ember-basic-dropdown--transitioning-in';
  transitionedInClass = this.args.transitionedInClass || 'ember-basic-dropdown--transitioned-in';
  transitioningOutClass = this.args.transitioningOutClass || 'ember-basic-dropdown--transitioning-out';
  isTouchDevice = this.args.isTouchDevice || Boolean(!!window && 'ontouchstart' in window);
  dropdownId = `ember-basic-dropdown-content-${this.args.dropdown?.uniqueId}`;
  touchMoveEvent;
  handleRootMouseDown;
  scrollableAncestors = [];
  mutationObserver;
  static {
    g(this.prototype, "_contentWormhole", [tracked]);
  }
  #_contentWormhole = (i(this, "_contentWormhole"), undefined);
  static {
    g(this.prototype, "animationClass", [tracked], function () {
      return this.transitioningInClass;
    });
  }
  #animationClass = (i(this, "animationClass"), undefined);
  get destinationElement() {
    if (this.args.destinationElement) {
      return this.args.destinationElement;
    }
    if (!this.args.destination) {
      return null;
    }
    const element = document.getElementById(this.args.destination);
    if (element) {
      return element;
    }
    if (this._contentWormhole) {
      return this._contentWormhole.getRootNode()?.querySelector('#' + this.args.destination);
    }
    return null;
  }
  get animationEnabled() {
    const {
      animationEnabled: animationEnabledArg = true
    } = this.args;
    return animationEnabledArg && !isTesting();
  }
  get positionStyles() {
    const style = {};
    if (this.args.top !== undefined) {
      style['top'] = this.args.top;
    }
    if (this.args.left !== undefined) {
      style['left'] = this.args.left;
    }
    if (this.args.right !== undefined) {
      style['right'] = this.args.right;
    }
    if (this.args.width !== undefined) {
      style['width'] = this.args.width;
    }
    if (this.args.height !== undefined) {
      style['height'] = this.args.height;
    }
    return style;
  }

  /**
   * Allows similair behaviour to `ember-composable-helpers`' `optional` helper.
   * Avoids adding extra dependencies.
   * Can be removed when the template `V1` compatability event handlers are removed.
   *
   * @see https://github.com/cibernox/ember-basic-dropdown/issues/498
   * @memberof BasicDropdownContent
   */
  noop() {}
  registerDropdownContentWormhole = modifier(dropdownContentWormhole => {
    this._contentWormhole = dropdownContentWormhole;
  });
  respondToEvents = modifier(dropdownElement => {
    if (this.args.dropdown?.actions?.registerDropdownElement) {
      this.args.dropdown.actions.registerDropdownElement(dropdownElement);
    }
    const selector = `[data-ebd-id=${this.args.dropdown?.uniqueId}-trigger]`;
    let triggerElement = null;
    if (typeof this.args.dropdown?.actions?.getTriggerElement === 'function') {
      triggerElement = this.args.dropdown?.actions?.getTriggerElement();
    }
    if (!triggerElement) {
      triggerElement = document.querySelector(selector);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.handleRootMouseDown = e => {
      const target = e.composedPath?.()[0] || e.target;
      if (target === null) return;
      if (hasMoved(e, this.touchMoveEvent) || dropdownElement.contains(target) || triggerElement && triggerElement.contains(target)) {
        this.touchMoveEvent = undefined;
        return;
      }
      if (dropdownIsValidParent(triggerElement, target, this.dropdownId)) {
        this.touchMoveEvent = undefined;
        return;
      }
      if (this.args.dropdown?.actions?.close) {
        this.args.dropdown.actions.close(e, true);
      }
    };
    document.addEventListener(this.args.rootEventType || 'click', this.handleRootMouseDown, true);

    // We need to register closing event on shadow dom element, otherwise all clicks inside a shadow dom are not closing the dropdown
    let rootElement;
    if (this._contentWormhole && this._contentWormhole.getRootNode() instanceof ShadowRoot) {
      rootElement = this._contentWormhole.getRootNode();
    }
    if (rootElement) {
      rootElement.addEventListener(this.args.rootEventType || 'click', this.handleRootMouseDown, true);
    }
    window.addEventListener('resize', this.runloopAwareRepositionBound);
    window.addEventListener('orientationchange', this.runloopAwareRepositionBound);
    if (this.isTouchDevice) {
      document.addEventListener('touchstart', this.touchStartHandlerBound, true);
      document.addEventListener('touchend', this.handleRootMouseDown, true);
      if (rootElement) {
        rootElement.addEventListener('touchstart', this.touchStartHandlerBound, true);
        rootElement.addEventListener('touchend', this.handleRootMouseDown, true);
      }
    }
    if (triggerElement !== null && !(triggerElement.getRootNode() instanceof ShadowRoot)) {
      this.scrollableAncestors = getScrollableAncestors(triggerElement);
    }
    this.addScrollHandling(dropdownElement);
    return () => {
      this.removeGlobalEvents();
      this.removeScrollHandling();
      this.scrollableAncestors = [];
      document.removeEventListener(this.args.rootEventType || 'click', this.handleRootMouseDown, true);
      let rootElement;
      if (this._contentWormhole && this._contentWormhole.getRootNode() instanceof ShadowRoot) {
        rootElement = this._contentWormhole.getRootNode();
      }
      if (rootElement) {
        rootElement.removeEventListener(this.args.rootEventType || 'click', this.handleRootMouseDown, true);
      }
      if (this.isTouchDevice) {
        document.removeEventListener('touchstart', this.touchStartHandlerBound, true);
        document.removeEventListener('touchend', this.handleRootMouseDown, true);
        if (rootElement) {
          rootElement.removeEventListener('touchstart', this.touchStartHandlerBound, true);
          rootElement.removeEventListener('touchend', this.handleRootMouseDown, true);
        }
      }
    };
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  {
    eager: false
  });
  initiallyReposition = modifier(() => {
    // Escape autotracking frame and avoid backtracking re-render
    void Promise.resolve().then(() => {
      this.args.dropdown?.actions.reposition();
    });
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  {
    eager: false
  });
  animateInAndOut = modifier(dropdownElement => {
    if (!this.animationEnabled) return () => {};
    waitForAnimations(dropdownElement, () => {
      this.animationClass = this.transitionedInClass;
    });
    return () => {
      if (!this.animationEnabled) return;
      let parentElement = dropdownElement.parentElement ?? this.destinationElement;
      if (parentElement === null) return;
      if (this.args.renderInPlace) {
        parentElement = parentElement.parentElement;
      }
      if (parentElement === null) return;
      const clone = dropdownElement.cloneNode(true);
      clone.id = `${clone.id}--clone`;
      clone.classList.remove(...this.transitioningInClass.split(' '));
      clone.classList.add(...this.transitioningOutClass.split(' '));
      parentElement.appendChild(clone);
      this.animationClass = this.transitioningInClass;
      waitForAnimations(clone, function () {
        parentElement.removeChild(clone);
      });
    };
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  {
    eager: false
  });
  observeMutations = modifier(dropdownElement => {
    this.mutationObserver = new MutationObserver(mutations => {
      let shouldReposition = mutations.some(record => containsRelevantMutation(record.addedNodes) || containsRelevantMutation(record.removedNodes));
      if (shouldReposition && this.args.shouldReposition) {
        shouldReposition = this.args.shouldReposition(mutations, this.args.dropdown);
      }
      if (shouldReposition) {
        this.runloopAwareReposition();
      }
    });
    this.mutationObserver.observe(dropdownElement, {
      childList: true,
      subtree: true
    });
    return () => {
      if (this.mutationObserver !== undefined) {
        this.mutationObserver.disconnect();
        this.mutationObserver = undefined;
      }
    };
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  {
    eager: false
  });
  touchStartHandler() {
    document.addEventListener('touchmove', this.touchMoveHandlerBound, true);
    if (this._contentWormhole && this._contentWormhole.getRootNode() instanceof ShadowRoot) {
      const rootElement = this._contentWormhole.getRootNode();
      rootElement.addEventListener('touchmove', this.touchMoveHandlerBound, true);
    }
  }
  static {
    n(this.prototype, "touchStartHandler", [action]);
  }
  touchMoveHandler(e) {
    this.touchMoveEvent = e;
    document.removeEventListener('touchmove', this.touchMoveHandlerBound, true);
    if (this._contentWormhole && this._contentWormhole.getRootNode() instanceof ShadowRoot) {
      const rootElement = this._contentWormhole.getRootNode();
      rootElement.removeEventListener('touchmove', this.touchMoveHandlerBound, true);
    }
  }
  static {
    n(this.prototype, "touchMoveHandler", [action]);
  }
  runloopAwareReposition() {
    if (!this.args.dropdown) {
      return;
    }
    runTask(this, () => {
      if (!this.args.dropdown) {
        return;
      }
      this.args.dropdown.actions.reposition();
    });
  }
  static {
    n(this.prototype, "runloopAwareReposition", [action]);
  }
  removeGlobalEvents() {
    window.removeEventListener('resize', this.runloopAwareRepositionBound);
    window.removeEventListener('orientationchange', this.runloopAwareRepositionBound);
  }
  static {
    n(this.prototype, "removeGlobalEvents", [action]);
  }
  touchMoveHandlerBound = e => this.touchMoveHandler(e);
  runloopAwareRepositionBound = () => this.runloopAwareReposition();
  touchStartHandlerBound = () => this.touchStartHandler();

  // Methods
  addScrollHandling(dropdownElement) {
    if (this.args.preventScroll === true) {
      const wheelHandler = event => {
        const target = event.composedPath?.()[0] || event.target;
        if (target === null) return;
        if (dropdownElement.contains(target) || dropdownElement === event.target) {
          // Discover the amount of scrollable canvas that is within the dropdown.
          const availableScroll = getAvailableScroll(target, dropdownElement);

          // Calculate what the event's desired change to that scrollable canvas is.
          let {
            deltaX,
            deltaY
          } = getScrollDeltas(event);

          // If the consequence of the wheel action would result in scrolling beyond
          // the scrollable canvas of the dropdown, call preventDefault() and clamp
          // the value of the delta to the available scroll size.
          if (deltaX < availableScroll.deltaXNegative) {
            deltaX = availableScroll.deltaXNegative;
            event.preventDefault();
          } else if (deltaX > availableScroll.deltaXPositive) {
            deltaX = availableScroll.deltaXPositive;
            event.preventDefault();
          } else if (deltaY < availableScroll.deltaYNegative) {
            deltaY = availableScroll.deltaYNegative;
            event.preventDefault();
          } else if (deltaY > availableScroll.deltaYPositive) {
            deltaY = availableScroll.deltaYPositive;
            event.preventDefault();
          }

          // Add back in the default behavior for the two good states that the above
          // `preventDefault()` code will break.
          // - Two-axis scrolling on a one-axis scroll container
          // - The last relevant wheel event if the scroll is overshooting

          // Also, don't attempt to do this if both of `deltaX` or `deltaY` are 0.
          if (event.defaultPrevented && (deltaX || deltaY)) {
            distributeScroll(deltaX, deltaY, target, dropdownElement);
          }
        } else {
          // Scrolling outside of the dropdown is prohibited.
          event.preventDefault();
        }
      };
      document.addEventListener('wheel', wheelHandler, {
        capture: true,
        passive: false
      });
      if (this._contentWormhole && this._contentWormhole.getRootNode() instanceof ShadowRoot) {
        const rootElement = this._contentWormhole.getRootNode();
        rootElement.addEventListener('wheel', wheelHandler, {
          capture: true,
          passive: false
        });
      }
      this.removeScrollHandling = () => {
        document.removeEventListener('wheel', wheelHandler, {
          capture: true
        });
        if (this._contentWormhole && this._contentWormhole.getRootNode() instanceof ShadowRoot) {
          const rootElement = this._contentWormhole.getRootNode();
          rootElement.removeEventListener('wheel', wheelHandler, {
            capture: true
          });
        }
      };
    } else {
      this.addScrollEvents();
      this.removeScrollHandling = this.removeScrollEvents.bind(this);
    }
  }

  // Assigned at runtime to ensure that changes to the `preventScroll` property
  // don't result in not cleaning up after ourselves.
  removeScrollHandling() {}

  // These two functions wire up scroll handling if `preventScroll` is false.
  // These trigger reposition of the dropdown.
  addScrollEvents() {
    window.addEventListener('scroll', this.runloopAwareRepositionBound);
    this.scrollableAncestors.forEach(el => {
      el.addEventListener('scroll', this.runloopAwareRepositionBound);
    });
  }
  removeScrollEvents() {
    window.removeEventListener('scroll', this.runloopAwareRepositionBound);
    this.scrollableAncestors.forEach(el => {
      el.removeEventListener('scroll', this.runloopAwareRepositionBound);
    });
  }
}
function containsRelevantMutation(nodeList) {
  for (let i = 0; i < nodeList.length; i++) {
    const node = nodeList[i];
    if (node !== undefined && node.nodeName !== '#comment' && !(node.nodeName === '#text' && node.nodeValue === '')) {
      return true;
    }
  }
  return false;
}

// All ancestors with scroll (except the BODY, which is treated differently)
function getScrollableAncestors(triggerElement) {
  const scrollableAncestors = [];
  if (triggerElement) {
    const parent = triggerElement.parentNode;
    if (parent !== null) {
      let nextScrollable = getScrollParent(parent);
      while (nextScrollable && nextScrollable.tagName.toUpperCase() !== 'BODY' && nextScrollable.tagName.toUpperCase() !== 'HTML') {
        scrollableAncestors.push(nextScrollable);
        const nextParent = nextScrollable.parentNode;
        if (nextParent === null) {
          nextScrollable = undefined;
        } else {
          nextScrollable = getScrollParent(nextParent);
        }
      }
    }
  }
  return scrollableAncestors;
}
function closestContent(el) {
  while (el && (!el.classList || !el.classList.contains('ember-basic-dropdown-content'))) {
    if (el.parentElement === null) return null;
    el = el.parentElement;
  }
  return el;
}
function waitForAnimations(element, callback) {
  window.requestAnimationFrame(function () {
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.animationName !== 'none' && computedStyle.animationPlayState === 'running') {
      const eventCallback = function () {
        element.removeEventListener('animationend', eventCallback);
        callback();
      };
      element.addEventListener('animationend', eventCallback);
    } else {
      callback();
    }
  });
}

/**
 * Evaluates if the given element is in a dropdown or any of its parent dropdowns.
 *
 * @param {any} owner
 * @param {HTMLElement} el
 * @param {String} dropdownId
 */
function dropdownIsValidParent(triggerElement, el, dropdownId) {
  const closestDropdown = closestContent(el);
  if (closestDropdown === null) {
    return false;
  } else {
    const closestAttrId = closestDropdown.getAttribute('id') ?? '';
    const selector = `[aria-controls=${closestAttrId}]`;
    const trigger = document.querySelector(selector) ?? triggerElement?.getRootNode()?.querySelector(selector);
    if (trigger === null) return false;
    const parentDropdown = closestContent(trigger);
    if (parentDropdown === null) return false;
    const parentAttrId = parentDropdown.getAttribute('id') ?? '';
    return parentDropdown && parentAttrId === dropdownId || dropdownIsValidParent(triggerElement, parentDropdown, dropdownId);
  }
}
setComponentTemplate(TEMPLATE, BasicDropdownContent);

export { BasicDropdownContent as default };
//# sourceMappingURL=basic-dropdown-content.js.map
