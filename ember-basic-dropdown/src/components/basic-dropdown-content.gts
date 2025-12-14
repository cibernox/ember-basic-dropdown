import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { getScrollParent } from '../utils/calculate-position.ts';
import {
  distributeScroll,
  getAvailableScroll,
  getScrollDeltas,
} from '../utils/scroll-helpers.ts';
import hasMoved from '../utils/has-moved.ts';
import { isTesting } from '@embroider/macros';
import { modifier } from 'ember-modifier';
import { element } from 'ember-element-helper';
import { or } from 'ember-truth-helpers';
import style from 'ember-style-modifier';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { hash } from '@ember/helper';
import type {
  Dropdown,
  TRootEventType,
  HorizontalPosition,
  VerticalPosition,
} from '../types.ts';

export interface BasicDropdownContentSignature {
  Element: HTMLElement;
  Args: {
    animationEnabled?: boolean;
    transitioningInClass?: string;
    transitionedInClass?: string;
    transitioningOutClass?: string;
    isTouchDevice?: boolean;
    destination?: string;
    destinationElement?: HTMLElement | null;
    dropdown?: Dropdown;
    renderInPlace?: boolean;
    preventScroll?: boolean | undefined;
    rootEventType?: TRootEventType;
    top?: string | undefined;
    left?: string | undefined;
    right?: string | undefined;
    width?: string | undefined;
    height?: string | undefined;
    otherStyles?: Record<string, string | number | undefined>;
    hPosition?: HorizontalPosition | null;
    vPosition?: VerticalPosition | null;
    defaultClass?: string;
    overlay?: boolean;
    htmlTag?: keyof HTMLElementTagNameMap | undefined;
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
  private rootElement: HTMLElement | undefined;
  @tracked private _contentWormhole?: Element;
  @tracked animationClass = this.transitioningInClass;

  get destinationElement(): Element | null {
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
      return (
        this._contentWormhole.getRootNode() as HTMLElement
      )?.querySelector('#' + this.args.destination);
    }

    return null;
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

  registerDropdownContentWormhole = modifier(
    (dropdownContentWormhole: Element) => {
      this._contentWormhole = dropdownContentWormhole;
    },
  );

  respondToEvents = modifier(
    (dropdownElement: Element): (() => void) => {
      if (this.args.dropdown?.actions?.registerDropdownElement) {
        this.args.dropdown.actions.registerDropdownElement(
          dropdownElement as HTMLElement,
        );
      }

      const selector = `[data-ebd-id=${this.args.dropdown?.uniqueId}-trigger]`;
      let triggerElement: HTMLElement | null = null;
      if (
        typeof this.args.dropdown?.actions?.getTriggerElement === 'function'
      ) {
        triggerElement = this.args.dropdown?.actions?.getTriggerElement();
      }
      if (!triggerElement) {
        triggerElement = document.querySelector(selector) as HTMLElement;
      }
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

        if (dropdownIsValidParent(triggerElement, target, this.dropdownId)) {
          this.touchMoveEvent = undefined;
          return;
        }

        if (this.args.dropdown?.actions?.close) {
          this.args.dropdown.actions.close(e, true);
        }
      };
      document.addEventListener(
        this.args.rootEventType || 'click',
        this.handleRootMouseDown,
        true,
      );

      // We need to register closing event on shadow dom element, otherwise all clicks inside a shadow dom are not closing the dropdown
      // In additional store the rootElement for outside clicks (ensure that we do removeEventListener on correct element)
      if (
        this._contentWormhole &&
        this._contentWormhole.getRootNode() instanceof ShadowRoot
      ) {
        this.rootElement = this._contentWormhole.getRootNode() as HTMLElement;
      } else {
        this.rootElement = undefined;
      }

      if (this.rootElement) {
        this.rootElement.addEventListener(
          this.args.rootEventType || 'click',
          this.handleRootMouseDown,
          true,
        );
      }

      window.addEventListener('resize', this.repositionBound);
      window.addEventListener('orientationchange', this.repositionBound);

      if (this.isTouchDevice) {
        document.addEventListener(
          'touchstart',
          this.touchStartHandlerBound,
          true,
        );
        document.addEventListener('touchend', this.handleRootMouseDown, true);

        if (this.rootElement) {
          this.rootElement.addEventListener(
            'touchstart',
            this.touchStartHandlerBound,
            true,
          );
          this.rootElement.addEventListener(
            'touchend',
            this.handleRootMouseDown,
            true,
          );
        }
      }
      if (
        triggerElement !== null &&
        !(triggerElement.getRootNode() instanceof ShadowRoot)
      ) {
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

        if (this.rootElement) {
          this.rootElement.removeEventListener(
            this.args.rootEventType || 'click',
            this.handleRootMouseDown as RootMouseDownHandler,
            true,
          );
        }

        if (this.isTouchDevice) {
          document.removeEventListener(
            'touchstart',
            this.touchStartHandlerBound,
            true,
          );
          document.removeEventListener(
            'touchend',
            this.handleRootMouseDown as RootMouseDownHandler,
            true,
          );

          if (this.rootElement) {
            this.rootElement.removeEventListener(
              'touchstart',
              this.touchStartHandlerBound,
              true,
            );
            this.rootElement.removeEventListener(
              'touchend',
              this.handleRootMouseDown as RootMouseDownHandler,
              true,
            );
          }
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
      void Promise.resolve().then(() => {
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
          this.reposition();
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
    document.addEventListener('touchmove', this.touchMoveHandlerBound, true);

    if (
      this._contentWormhole &&
      this._contentWormhole.getRootNode() instanceof ShadowRoot
    ) {
      const rootElement = this._contentWormhole.getRootNode() as HTMLElement;
      rootElement.addEventListener(
        'touchmove',
        this.touchMoveHandlerBound,
        true,
      );
    }
  }

  @action
  touchMoveHandler(e: TouchEvent): void {
    this.touchMoveEvent = e;
    document.removeEventListener('touchmove', this.touchMoveHandlerBound, true);

    if (
      this._contentWormhole &&
      this._contentWormhole.getRootNode() instanceof ShadowRoot
    ) {
      const rootElement = this._contentWormhole.getRootNode() as HTMLElement;
      rootElement.removeEventListener(
        'touchmove',
        this.touchMoveHandlerBound,
        true,
      );
    }
  }

  @action
  reposition(): void {
    if (!this.args.dropdown) {
      return;
    }

    this.args.dropdown.actions.reposition();
  }

  @action
  removeGlobalEvents(): void {
    window.removeEventListener('resize', this.repositionBound);
    window.removeEventListener('orientationchange', this.repositionBound);
  }

  touchMoveHandlerBound = (e: TouchEvent) => this.touchMoveHandler(e);
  repositionBound = () => this.reposition();
  touchStartHandlerBound = () => this.touchStartHandler();

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

      if (
        this._contentWormhole &&
        this._contentWormhole.getRootNode() instanceof ShadowRoot
      ) {
        const rootElement = this._contentWormhole.getRootNode() as HTMLElement;
        rootElement.addEventListener('wheel', wheelHandler, {
          capture: true,
          passive: false,
        });
      }

      this.removeScrollHandling = () => {
        document.removeEventListener('wheel', wheelHandler, { capture: true });

        if (
          this._contentWormhole &&
          this._contentWormhole.getRootNode() instanceof ShadowRoot
        ) {
          const rootElement =
            this._contentWormhole.getRootNode() as HTMLElement;
          rootElement.removeEventListener('wheel', wheelHandler, {
            capture: true,
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
  removeScrollHandling(): void {}

  // These two functions wire up scroll handling if `preventScroll` is false.
  // These trigger reposition of the dropdown.
  addScrollEvents(): void {
    window.addEventListener('scroll', this.repositionBound);
    this.scrollableAncestors.forEach((el) => {
      el.addEventListener('scroll', this.repositionBound);
    });
  }

  removeScrollEvents(): void {
    window.removeEventListener('scroll', this.repositionBound);
    this.scrollableAncestors.forEach((el) => {
      el.removeEventListener('scroll', this.repositionBound);
    });
  }

  <template>
    {{#if @dropdown.isOpen}}
      <div
        class="ember-basic-dropdown-content-wormhole-origin"
        {{this.registerDropdownContentWormhole}}
      >
        {{#if @renderInPlace}}
          {{#if @overlay}}
            <div class="ember-basic-dropdown-overlay"></div>
          {{/if}}

          {{#let (element (or @htmlTag "div")) as |OptionalTag|}}
            <OptionalTag
              id={{this.dropdownId}}
              class="ember-basic-dropdown-content ember-basic-dropdown-content--{{@hPosition}}
                ember-basic-dropdown-content--{{@vPosition}}
                {{this.animationClass}}{{if
                  @renderInPlace
                  ' ember-basic-dropdown-content--in-place'
                }}
                {{@defaultClass}}"
              ...attributes
              {{style @otherStyles this.positionStyles}}
              {{this.respondToEvents}}
              {{this.initiallyReposition}}
              {{this.observeMutations}}
              {{this.animateInAndOut}}
              {{on "focusin" (fn (or @onFocusIn this.noop) @dropdown)}}
              {{on "focusout" (fn (or @onFocusOut this.noop) @dropdown)}}
              {{on "mouseenter" (fn (or @onMouseEnter this.noop) @dropdown)}}
              {{on "mouseleave" (fn (or @onMouseLeave this.noop) @dropdown)}}
              {{! V1 compatibility - See #498 }}
            >
              {{yield}}
            </OptionalTag>
          {{/let}}
        {{else if this.destinationElement}}
          {{#in-element this.destinationElement insertBefore=null}}
            {{#if @overlay}}
              <div class="ember-basic-dropdown-overlay"></div>
            {{/if}}

            {{#let (element (or @htmlTag "div")) as |OptionalTag|}}
              <OptionalTag
                id={{this.dropdownId}}
                class="ember-basic-dropdown-content ember-basic-dropdown-content--{{@hPosition}}
                  ember-basic-dropdown-content--{{@vPosition}}
                  {{this.animationClass}}{{if
                    @renderInPlace
                    ' ember-basic-dropdown-content--in-place'
                  }}
                  {{@defaultClass}}"
                ...attributes
                {{style @otherStyles this.positionStyles}}
                {{this.respondToEvents}}
                {{this.initiallyReposition}}
                {{this.observeMutations}}
                {{this.animateInAndOut}}
                {{on "focusin" (fn (or @onFocusIn this.noop) @dropdown)}}
                {{on "focusout" (fn (or @onFocusOut this.noop) @dropdown)}}
                {{on "mouseenter" (fn (or @onMouseEnter this.noop) @dropdown)}}
                {{on "mouseleave" (fn (or @onMouseLeave this.noop) @dropdown)}}
                {{! V1 compatibility - See #498 }}
              >
                {{yield}}
              </OptionalTag>
            {{/let}}
          {{/in-element}}
        {{/if}}
      </div>
    {{else}}
      <div
        id={{this.dropdownId}}
        class="ember-basic-dropdown-content-placeholder"
        {{style (hash display="none")}}
      ></div>
    {{/if}}
  </template>
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

function waitForAnimations(element: Element, callback: () => void): void {
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
  triggerElement: HTMLElement | null,
  el: Element,
  dropdownId: string,
): boolean {
  const closestDropdown = closestContent(el);
  if (closestDropdown === null) {
    return false;
  } else {
    const closestAttrId = closestDropdown.getAttribute('id') ?? '';
    const selector = `[aria-controls=${closestAttrId}]`;
    const trigger =
      document.querySelector(selector) ??
      (triggerElement?.getRootNode() as HTMLElement)?.querySelector(selector);
    if (trigger === null) return false;
    const parentDropdown = closestContent(trigger);
    if (parentDropdown === null) return false;
    const parentAttrId = parentDropdown.getAttribute('id') ?? '';
    return (
      (parentDropdown && parentAttrId === dropdownId) ||
      dropdownIsValidParent(triggerElement, parentDropdown, dropdownId)
    );
  }
}
