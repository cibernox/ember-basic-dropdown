import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { getOwner } from '@ember/application';
import { DEBUG } from '@glimmer/env';
import calculatePosition, { CalculatePosition, CalculatePositionResult } from '../utils/calculate-position';
// @ts-ignore
import requirejs from 'require';
import { schedule } from '@ember/runloop';
declare const FastBoot: any

export interface DropdownActions {
  toggle: (e?: Event) => void
  close: (e?: Event, skipFocus?: boolean) => void
  open: (e?: Event) => void
  reposition: (...args: any[]) => undefined | RepositionChanges
}
export interface Dropdown {
  uniqueId: string
  disabled: boolean
  isOpen: boolean
  actions: DropdownActions
}

const UNINITIALIZED = {};
const IGNORED_STYLES = ['top', 'left', 'right', 'width', 'height'];

interface Args {
  initiallyOpened?: boolean
  renderInPlace?: boolean
  verticalPosition?: string
  horizontalPosition?: string
  destination?: string
  disabled?: boolean
  dropdownId?: string
  matchTriggerWidth?: boolean
  onInit?: Function
  registerAPI?: Function
  onOpen?: Function
  onClose?: Function
  calculatePosition?: CalculatePosition
}

type RepositionChanges = {
  hPosition: string
  vPosition: string
  otherStyles: Record<string, string | number | undefined>
  top?: string
  left?: string
  right?: string
  width?: string
  height?: string
}

export default class BasicDropdown extends Component<Args> {
  @tracked hPosition: string | null = null
  @tracked vPosition: string | null = null
  @tracked top: string | undefined
  @tracked left: string | undefined
  @tracked right: string | undefined
  @tracked width: string | undefined
  @tracked height: string | undefined
  @tracked otherStyles: Record<string, string | number | undefined> = {}
  @tracked isOpen = this.args.initiallyOpened || false
  @tracked renderInPlace = this.args.renderInPlace !== undefined ? this.args.renderInPlace : false;
  private previousVerticalPosition?: string
  private previousHorizontalPosition?: string
  private destinationElement?: HTMLElement
  private verticalPosition = this.args.verticalPosition || 'auto'; // above | below
  private horizontalPosition = this.args.horizontalPosition || 'auto'; // auto-right | right | center | left
  private _uid = guidFor(this)
  private _dropdownId: string = this.args.dropdownId || `ember-basic-dropdown-content-${this._uid}`;
  private _previousDisabled = UNINITIALIZED
  private _actions: DropdownActions = {
    open: this.open,
    close: this.close,
    toggle: this.toggle,
    reposition: this.reposition,
  };

  get destination(): string {
    return this.args.destination || this._getDestinationId();
  }

  get disabled(): boolean {
    let newVal = this.args.disabled || false;
    if (this._previousDisabled !== UNINITIALIZED && this._previousDisabled !== newVal) {
      schedule('actions', () => {
        if (newVal && this.publicAPI.isOpen) {
          this.isOpen = false;
        }
        this.args.registerAPI && this.args.registerAPI(this.publicAPI);
      });
    }
    this._previousDisabled = newVal;
    return newVal
  }

  get publicAPI(): Dropdown {
    return {
      uniqueId: this._uid,
      isOpen: this.isOpen,
      disabled: this.disabled,
      actions: this._actions
    }
  }

  // Lifecycle hooks
  constructor(owner: unknown, args: Args) {
    super(owner, args);
    if (this.args.onInit) {
      this.args.onInit(this.publicAPI);
    }
    this.args.registerAPI && this.args.registerAPI(this.publicAPI);
  }

  willDestroy(): void {
    super.willDestroy();
    if (this.args.registerAPI) {
      this.args.registerAPI(null);
    }
  }

  // Actions
  @action
  open(e?: Event): void {
    if (this.isDestroyed) {
      return;
    }
    if (this.publicAPI.disabled || this.publicAPI.isOpen) {
      return;
    }
    if (this.args.onOpen && this.args.onOpen(this.publicAPI, e) === false) {
      return;
    }
    this.isOpen = true;
    this.args.registerAPI && this.args.registerAPI(this.publicAPI);
  }

  @action
  close(e?: Event, skipFocus?: boolean): void {
    if (this.isDestroyed) {
      return;
    }
    if (this.publicAPI.disabled || !this.publicAPI.isOpen) {
      return;
    }
    if (this.args.onClose && this.args.onClose(this.publicAPI, e) === false) {
      return;
    }
    if (this.isDestroyed) {
      return; // To check that the `onClose` didn't destroy the dropdown
    }
    this.hPosition = this.vPosition = null;
    this.top = this.left = this.right = this.width = this.height = undefined;
    this.previousVerticalPosition = this.previousHorizontalPosition = undefined;
    this.isOpen = false;
    this.args.registerAPI && this.args.registerAPI(this.publicAPI);
    if (skipFocus) {
      return;
    }
    let trigger = document.querySelector(`[data-ebd-id=${this.publicAPI.uniqueId}-trigger]`) as HTMLElement;
    if (trigger && trigger.tabIndex > -1) {
      trigger.focus();
    }
  }

  @action
  toggle(e?: Event): void {
    if (this.publicAPI.isOpen) {
      this.close(e);
    } else {
      this.open(e);
    }
  }

  @action
  reposition(): undefined | RepositionChanges {
    if (!this.publicAPI.isOpen) {
      return;
    }
    let dropdownElement = document.getElementById(this._dropdownId);
    let triggerElement = document.querySelector(`[data-ebd-id=${this.publicAPI.uniqueId}-trigger]`) as HTMLElement;
    if (!dropdownElement || !triggerElement) {
      return;
    }

    this.destinationElement = this.destinationElement || document.getElementById(this.destination) as HTMLElement;
    let { horizontalPosition, verticalPosition, previousHorizontalPosition, previousVerticalPosition } = this;
    let { renderInPlace = false, matchTriggerWidth = false } = this.args;
    let calculatePositionFn = this.args.calculatePosition || calculatePosition
    let positionData = calculatePositionFn(
      triggerElement,
      dropdownElement,
      this.destinationElement,
      {
        horizontalPosition,
        verticalPosition,
        previousHorizontalPosition,
        previousVerticalPosition,
        renderInPlace,
        matchTriggerWidth,
        dropdown: this
      }
    );
    return this.applyReposition(triggerElement, dropdownElement, positionData);
  }

  applyReposition(_trigger: Element, dropdown: Element, positions: CalculatePositionResult): RepositionChanges {
    let changes: RepositionChanges = {
      hPosition: positions.horizontalPosition,
      vPosition: positions.verticalPosition,
      otherStyles: Object.assign({}, this.otherStyles)
    };

    if (positions.style) {
      if (positions.style.top !== undefined) {
        changes.top = `${positions.style.top}px`;
      }
      // The component can be aligned from the right or from the left, but not from both.
      if (positions.style.left !== undefined) {
        changes.left = `${positions.style.left}px`;
        changes.right = undefined;
        // Since we set the first run manually we may need to unset the `right` property.
        if (positions.style.right !== undefined) {
          positions.style.right = undefined;
        }
      } else if (positions.style.right !== undefined) {
        changes.right = `${positions.style.right}px`;
        changes.left = undefined;
      }
      if (positions.style.width !== undefined) {
        changes.width = `${positions.style.width}px`;
      }
      if (positions.style.height !== undefined) {
        changes.height = `${positions.style.height}px`;
      }
      if (this.top === undefined) {
        // Bypass Ember on the first reposition only to avoid flickering.
        let cssRules = [];
        for (let prop in positions.style) {
          if (positions.style[prop] !== undefined) {
            if (typeof positions.style[prop] === 'number') {
              cssRules.push(`${prop}: ${positions.style[prop]}px`)
            } else {
              cssRules.push(`${prop}: ${positions.style[prop]}`)
            }
          }
        }
        dropdown.setAttribute('style', cssRules.join(';'));
      }
    }
    for (let prop in positions.style) {
      if (!IGNORED_STYLES.includes(prop)) {
        changes.otherStyles;
        changes.otherStyles[prop] = positions.style[prop];
      }
    }

    this.hPosition = changes.hPosition;
    this.vPosition = changes.vPosition;
    this.top = changes.top;
    this.left = changes.left;
    this.right = changes.right;
    this.width = changes.width;
    this.height = changes.height;
    this.otherStyles = changes.otherStyles;
    this.previousHorizontalPosition = positions.horizontalPosition;
    this.previousVerticalPosition = positions.verticalPosition;
    return changes;
  }

  _getDestinationId(): string {
    let config = getOwner(this).resolveRegistration('config:environment');
    let id: string;
    if (config.environment === 'test' && (typeof FastBoot === 'undefined')) {
      if (DEBUG) {
        if (requirejs.has('@ember/test-helpers/dom/get-root-element')) {
          try {
            return requirejs('@ember/test-helpers/dom/get-root-element').default().id as string;
          } catch(ex) {
            // no op
          }
        }
        let rootView = document.querySelector('#ember-testing > .ember-view');
        if (rootView) {
          return rootView.id;
        }
        return '';
      }
    }
    id = (config['ember-basic-dropdown'] && config['ember-basic-dropdown'].destination || 'ember-basic-dropdown-wormhole') as string;
    // if (DEBUG && typeof FastBoot === 'undefined' && !this.renderInPlace) {
    //   assert(`You're trying to attach the content of a dropdown to an node with ID ${id}, but there is no node with that ID in the document. This can happen when your Ember app is not in control of the index.html page. Check https://ember-power-select.com/docs/troubleshooting for more information`, document.getElementById(id));
    // }
    return id;
  }
}
