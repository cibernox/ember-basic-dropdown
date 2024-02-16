import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { join } from '@ember/runloop';
import { getScrollParent } from '../utils/calculate-position.ts';
import {
  distributeScroll,
  getAvailableScroll,
  getScrollDeltas,
} from '../utils/scroll-helpers.ts';
import hasMoved from '../utils/has-moved.ts';
import { isTesting } from '@embroider/macros';
import { modifier } from 'ember-modifier';
import { getOwner } from '@ember/application';
import type { Dropdown } from './basic-dropdown.ts';

export interface BasicDropdownContentSignature {
  Element: Element;
  Args: {
    animationEnabled?: boolean;
    transitioningInClass?: string;
    transitionedInClass?: string;
    transitioningOutClass?: string;
    isTouchDevice?: boolean;
    destination?: string;
    dropdown?: Dropdown;
    renderInPlace?: boolean;
    preventScroll?: boolean;
    rootEventType?: 'click' | 'mousedown';
    top?: string | undefined;
    left?: string | undefined;
    right?: string | undefined;
    width?: string | undefined;
    height?: string | undefined;
    otherStyles?: Record<string, string>;
    hPosition?: string;
    vPosition?: string;
    dir?: string;
    defaultClass?: string;
    overlay?: boolean;
    htmlTag?: string;
    onFocusIn?: (dropdown?: Dropdown, event?: FocusEvent) => void;
    onFocusOut?: (dropdown?: Dropdown, event?: FocusEvent) => void;
    onMouseEnter?: (dropdown?: Dropdown, event?: MouseEvent) => void;
    onMouseLeave?: (dropdown?: Dropdown, event?: MouseEvent) => void;
    shouldReposition?: (
      mutations: MutationRecord[],
      dropdown?: Dropdown,
    ) => boolean;
  };
  Blocks: {
    default: [];
  };
}

type RootMouseDownHandler = (ev: MouseEvent | TouchEvent) => void;

export default class BasicDropdownContent extends Component<BasicDropdownContentSignature> {
  transitioningInClass =
    this.args.transitioningInClass || 'ember-basic-dropdown--transitioning-in';
  transitionedInClass =
    this.args.transitionedInClass || 'ember-basic-dropdown--transitioned-in';
  transitioningOutClass =
    this.args.transitioningOutClass ||
    'ember-basic-dropdown--transitioning-out';
  isTouchDevice =
    this.args.isTouchDevice || Boolean(!!window && 'ontouchstart' in window);
  dropdownId = `ember-basic-dropdown-content-${this.args.dropdown?.uniqueId}`;
  private touchMoveEvent: TouchEvent | undefined;
  private handleRootMouseDown?: RootMouseDownHandler;
  private scrollableAncestors: Element[] = [];
  private mutationObserver: MutationObserver | undefined;
  @tracked animationClass = this.transitioningInClass;

  get destinationElement(): Element | null {
    if (!this.args.destination) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const owner: any = getOwner(this);
    return (
      document.getElementById(this.args.destination) ??
      owner.rootElement.querySelector?.(`[id="${this.args.destination}"]`)
    );
  }

  get animationEnabled(): boolean {
    const { animationEnabled: animationEnabledArg = true } = this.args;

    return animationEnabledArg && !isTesting();
  }

  get positionStyles(): Record<string, string> {
    const style: Record<string, string> = {};
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
  noop(): void {}

  respondToEvents = modifier(
    (dropdownElement: Element): (() => void) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const owner: any = getOwner(this);
      const selector = `[data-ebd-id=${this.args.dropdown?.uniqueId}-trigger]`;
      const triggerElement =
        document.querySelector(selector) ??
        owner.rootElement.querySelector?.(selector);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.handleRootMouseDown = (e: MouseEvent | TouchEvent): any => {
        const target = (e.composedPath?.()[0] || e.target) as Element;
        if (target === null) return;
        if (
          hasMoved(e as TouchEvent, this.touchMoveEvent) ||
          dropdownElement.contains(target) ||
          (triggerElement && triggerElement.contains(target))
        ) {
          this.touchMoveEvent = undefined;
          return;
        }

        if (dropdownIsValidParent(owner, target, this.dropdownId)) {
          this.touchMoveEvent = undefined;
          return;
        }

        this.args.dropdown?.actions.close(e, true);
      };
      document.addEventListener(
        this.args.rootEventType || 'click',
        this.handleRootMouseDown,
        true,
      );
      window.addEventListener('resize', this.runloopAwareReposition);
      window.addEventListener('orientationchange', this.runloopAwareReposition);

      if (this.isTouchDevice) {
        document.addEventListener('touchstart', this.touchStartHandler, true);
        document.addEventListener('touchend', this.handleRootMouseDown, true);
      }
      if (triggerElement !== null) {
        this.scrollableAncestors = getScrollableAncestors(triggerElement);
      }
      this.addScrollHandling(dropdownElement);
      return () => {
        this.removeGlobalEvents();
        this.removeScrollHandling();
        this.scrollableAncestors = [];

        document.removeEventListener(
          this.args.rootEventType || 'click',
          this.handleRootMouseDown as RootMouseDownHandler,
          true,
        );

        if (this.isTouchDevice) {
          document.removeEventListener(
            'touchstart',
            this.touchStartHandler,
            true,
          );
          document.removeEventListener(
            'touchend',
            this.handleRootMouseDown as RootMouseDownHandler,
            true,
          );
        }
      };
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { eager: false },
  );

  initiallyReposition = modifier(
    () => {
      // Escape autotracking frame and avoid backtracking re-render
      Promise.resolve().then(() => {
        this.args.dropdown?.actions.reposition();
      });
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { eager: false },
  );

  animateInAndOut = modifier(
    (dropdownElement: Element): (() => void) => {
      if (!this.animationEnabled) return () => {};
      waitForAnimations(dropdownElement, () => {
        this.animationClass = this.transitionedInClass;
      });
      return () => {
        if (!this.animationEnabled) return;
        let parentElement =
          dropdownElement.parentElement ?? this.destinationElement;
        if (parentElement === null) return;
        if (this.args.renderInPlace) {
          parentElement = parentElement.parentElement;
        }
        if (parentElement === null) return;
        const clone = dropdownElement.cloneNode(true) as Element;
        clone.id = `${clone.id}--clone`;
        clone.classList.remove(...this.transitioningInClass.split(' '));
        clone.classList.add(...this.transitioningOutClass.split(' '));
        parentElement.appendChild(clone);
        this.animationClass = this.transitioningInClass;
        waitForAnimations(clone, function () {
          (parentElement as HTMLElement).removeChild(clone);
        });
      };
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { eager: false },
  );

  observeMutations = modifier(
    (dropdownElement: Element): (() => void) => {
      this.mutationObserver = new MutationObserver((mutations) => {
        let shouldReposition = mutations.some(
          (record: MutationRecord) =>
            containsRelevantMutation(record.addedNodes) ||
            containsRelevantMutation(record.removedNodes),
        );

        if (shouldReposition && this.args.shouldReposition) {
          shouldReposition = this.args.shouldReposition(
            mutations,
            this.args.dropdown,
          );
        }

        if (shouldReposition) {
          this.runloopAwareReposition();
        }
      });
      this.mutationObserver.observe(dropdownElement, {
        childList: true,
        subtree: true,
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
    { eager: false },
  );

  @action
  touchStartHandler(): void {
    document.addEventListener('touchmove', this.touchMoveHandler, true);
  }

  @action
  touchMoveHandler(e: TouchEvent): void {
    this.touchMoveEvent = e;
    document.removeEventListener('touchmove', this.touchMoveHandler, true);
  }

  @action
  runloopAwareReposition(): void {
    if (!this.args.dropdown) {
      return;
    }

    join(this.args.dropdown.actions.reposition);
  }

  @action
  removeGlobalEvents(): void {
    window.removeEventListener('resize', this.runloopAwareReposition);
    window.removeEventListener(
      'orientationchange',
      this.runloopAwareReposition,
    );
  }

  // Methods
  addScrollHandling(dropdownElement: Element): void {
    if (this.args.preventScroll === true) {
      const wheelHandler = (event: WheelEvent) => {
        const target = (event.composedPath?.()[0] || event.target) as Element;
        if (target === null) return;
        if (
          dropdownElement.contains(target) ||
          dropdownElement === event.target
        ) {
          // Discover the amount of scrollable canvas that is within the dropdown.
          const availableScroll = getAvailableScroll(target, dropdownElement);

          // Calculate what the event's desired change to that scrollable canvas is.
          let { deltaX, deltaY } = getScrollDeltas(event);

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
        passive: false,
      });
      this.removeScrollHandling = () => {
        document.removeEventListener('wheel', wheelHandler, { capture: true });
      };
    } else {
      this.addScrollEvents();
      this.removeScrollHandling = this.removeScrollEvents;
    }
  }

  // Assigned at runtime to ensure that changes to the `preventScroll` property
  // don't result in not cleaning up after ourselves.
  removeScrollHandling(): void {}

  // These two functions wire up scroll handling if `preventScroll` is false.
  // These trigger reposition of the dropdown.
  addScrollEvents(): void {
    window.addEventListener('scroll', this.runloopAwareReposition);
    this.scrollableAncestors.forEach((el) => {
      el.addEventListener('scroll', this.runloopAwareReposition);
    });
  }
  removeScrollEvents(): void {
    window.removeEventListener('scroll', this.runloopAwareReposition);
    this.scrollableAncestors.forEach((el) => {
      el.removeEventListener('scroll', this.runloopAwareReposition);
    });
  }
}

function containsRelevantMutation(nodeList: NodeList): boolean {
  for (let i = 0; i < nodeList.length; i++) {
    const node = nodeList[i];
    if (
      node !== undefined &&
      node.nodeName !== '#comment' &&
      !(node.nodeName === '#text' && node.nodeValue === '')
    ) {
      return true;
    }
  }
  return false;
}

// All ancestors with scroll (except the BODY, which is treated differently)
function getScrollableAncestors(triggerElement: Element): Element[] {
  const scrollableAncestors = [];
  if (triggerElement) {
    const parent = triggerElement.parentNode;
    if (parent !== null) {
      let nextScrollable: Element | undefined = getScrollParent(
        parent as Element,
      );
      while (
        nextScrollable &&
        nextScrollable.tagName.toUpperCase() !== 'BODY' &&
        nextScrollable.tagName.toUpperCase() !== 'HTML'
      ) {
        scrollableAncestors.push(nextScrollable);
        const nextParent = nextScrollable.parentNode;
        if (nextParent === null) {
          nextScrollable = undefined;
        } else {
          nextScrollable = getScrollParent(nextParent as Element);
        }
      }
    }
  }
  return scrollableAncestors;
}

function closestContent(el: Element): Element | null {
  while (
    el &&
    (!el.classList || !el.classList.contains('ember-basic-dropdown-content'))
  ) {
    if (el.parentElement === null) return null;
    el = el.parentElement;
  }
  return el;
}

// eslint-disable-next-line @typescript-eslint/ban-types
function waitForAnimations(element: Element, callback: Function): void {
  window.requestAnimationFrame(function () {
    const computedStyle = window.getComputedStyle(element);
    if (
      computedStyle.animationName !== 'none' &&
      computedStyle.animationPlayState === 'running'
    ) {
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
function dropdownIsValidParent(
  owner: any,
  el: Element,
  dropdownId: string,
): boolean {
  const closestDropdown = closestContent(el);
  if (closestDropdown === null) {
    return false;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const closestAttrs = closestDropdown.attributes as unknown as any;
    const selector = `[aria-controls=${closestAttrs.id.value}]`;
    const trigger =
      document.querySelector(selector) ??
      owner.rootElement.querySelector?.(selector);
    if (trigger === null) return false;
    const parentDropdown = closestContent(trigger);
    if (parentDropdown === null) return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parentAttrs = parentDropdown.attributes as unknown as any;
    return (
      (parentDropdown && parentAttrs.id.value === dropdownId) ||
      dropdownIsValidParent(owner, parentDropdown, dropdownId)
    );
  }
}
