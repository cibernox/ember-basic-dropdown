import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { scheduleTask } from 'ember-lifeline';
import calculatePosition from '../utils/calculate-position.ts';
import type {
  CalculatePosition,
  CalculatePositionResult,
  HorizontalPosition,
  VerticalPosition,
} from '../utils/calculate-position.ts';
import { getOwner } from '@ember/application';
import type Owner from '@ember/owner';
import type { ComponentLike } from '@glint/template';
import type { BasicDropdownTriggerSignature } from './basic-dropdown-trigger.ts';
import type { BasicDropdownContentSignature } from './basic-dropdown-content.ts';

export interface DropdownActions {
  toggle: (e?: Event) => void;
  close: (e?: Event, skipFocus?: boolean) => void;
  open: (e?: Event) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reposition: (...args: any[]) => undefined | RepositionChanges;
  registerTriggerElement: (e: HTMLElement) => void;
  registerDropdownElement: (e: HTMLElement) => void;
  getTriggerElement: () => HTMLElement | null;
}
export interface Dropdown {
  uniqueId: string;
  disabled: boolean;
  isOpen: boolean;
  actions: DropdownActions;
}

export type TRootEventType = 'click' | 'mousedown';

const UNINITIALIZED = {};
const IGNORED_STYLES = ['top', 'left', 'right', 'width', 'height'];
interface BasicDropdownSignature {
  Element: HTMLElement;
  Args: BasicDropdownArgs;
  Blocks: {
    default: [
      {
        uniqueId: string;
        disabled: boolean;
        isOpen: boolean;
        actions: DropdownActions;
        Trigger: ComponentLike<BasicDropdownTriggerSignature>;
        Content: ComponentLike<BasicDropdownContentSignature>;
      },
    ];
  };
}

interface BasicDropdownArgs {
  initiallyOpened?: boolean;
  renderInPlace?: boolean;
  verticalPosition?: VerticalPosition;
  horizontalPosition?: HorizontalPosition;
  destination?: string;
  destinationElement?: HTMLElement;
  disabled?: boolean;
  dropdownId?: string;
  rootEventType?: TRootEventType;
  preventScroll?: boolean;
  matchTriggerWidth?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onInit?: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  registerAPI?: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onOpen?: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onClose?: Function;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  triggerComponent?: string | ComponentLike<any> | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contentComponent?: string | ComponentLike<any> | undefined;
  calculatePosition?: CalculatePosition;
}

type RepositionChanges = {
  hPosition: HorizontalPosition;
  vPosition: VerticalPosition;
  otherStyles: Record<string, string | number | undefined>;
  top?: string | undefined;
  left?: string | undefined;
  right?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
};

export default class BasicDropdown extends Component<BasicDropdownSignature> {
  @tracked hPosition: HorizontalPosition | null = null;
  @tracked vPosition: VerticalPosition | null = null;
  @tracked top: string | undefined;
  @tracked left: string | undefined;
  @tracked right: string | undefined;
  @tracked width: string | undefined;
  @tracked height: string | undefined;
  @tracked otherStyles: Record<string, string | number | undefined> = {};
  @tracked isOpen = this.args.initiallyOpened || false;
  @tracked renderInPlace =
    this.args.renderInPlace !== undefined ? this.args.renderInPlace : false;
  private previousVerticalPosition?: VerticalPosition | undefined;
  private previousHorizontalPosition?: HorizontalPosition | undefined;
  private triggerElement: HTMLElement | null = null;
  private dropdownElement: HTMLElement | null = null;

  private _uid = guidFor(this);
  private _dropdownId: string =
    this.args.dropdownId || `ember-basic-dropdown-content-${this._uid}`;
  private _previousDisabled = UNINITIALIZED;
  private _actions: DropdownActions = {
    open: this.open,
    close: this.close,
    toggle: this.toggle,
    reposition: this.reposition,
    registerTriggerElement: this.registerTriggerElement,
    registerDropdownElement: this.registerDropdownElement,
    getTriggerElement: () => this.triggerElement,
  };

  private get horizontalPosition() {
    return this.args.horizontalPosition || 'auto'; // auto-right | right | center | left
  }

  private get verticalPosition() {
    return this.args.verticalPosition || 'auto'; // above | below
  }

  get destination(): string {
    return this.args.destination || this._getDestinationId();
  }

  get destinationElement(): HTMLElement | null {
    if (this.args.destinationElement) {
      return this.args.destinationElement;
    }

    const element = document.getElementById(this.destination);

    if (element) {
      return element;
    }

    if (
      this.triggerElement &&
      this.triggerElement.getRootNode() instanceof ShadowRoot
    ) {
      return (this.triggerElement.getRootNode() as HTMLElement)?.querySelector(
        `#${this.destination}`,
      );
    }

    return null;
  }

  get disabled(): boolean {
    const newVal = this.args.disabled || false;
    if (
      this._previousDisabled !== UNINITIALIZED &&
      this._previousDisabled !== newVal
    ) {
      scheduleTask(this, 'actions', () => {
        if (newVal && this.publicAPI.isOpen) {
          // eslint-disable-next-line ember/no-side-effects
          this.isOpen = false;
        }
        this.args.registerAPI && this.args.registerAPI(this.publicAPI);
      });
    }
    // eslint-disable-next-line ember/no-side-effects
    this._previousDisabled = newVal;
    return newVal;
  }

  get publicAPI(): Dropdown {
    return {
      uniqueId: this._uid,
      isOpen: this.isOpen,
      disabled: this.disabled,
      actions: this._actions,
    };
  }

  // Lifecycle hooks
  constructor(owner: Owner, args: BasicDropdownArgs) {
    super(owner, args);
    if (this.args.onInit) {
      this.args.onInit(this.publicAPI);
    }
    this.args.registerAPI && this.args.registerAPI(this.publicAPI);
  }

  override willDestroy(): void {
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
    const trigger = this._getTriggerElement();
    if (trigger) {
      const parent = trigger.parentElement;
      if (parent) {
        parent.setAttribute('aria-owns', this._dropdownId);
      }
    }
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
    const trigger = this._getTriggerElement();
    if (!trigger) {
      return;
    }
    const parent = trigger.parentElement;
    if (parent) {
      parent.removeAttribute('aria-owns');
    }
    if (skipFocus) {
      return;
    }
    if (trigger.tabIndex > -1) {
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
    const dropdownElement = this._getDropdownElement();
    const triggerElement = this._getTriggerElement();
    if (!dropdownElement || !triggerElement || !this.destinationElement) {
      return;
    }

    const {
      horizontalPosition,
      verticalPosition,
      previousHorizontalPosition,
      previousVerticalPosition,
    } = this;
    const { renderInPlace = false, matchTriggerWidth = false } = this.args;
    const calculatePositionFn =
      this.args.calculatePosition || calculatePosition;
    const positionData = calculatePositionFn(
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
        dropdown: this,
      },
    );
    return this.applyReposition(triggerElement, dropdownElement, positionData);
  }

  @action
  registerTriggerElement(element: HTMLElement): void {
    this.triggerElement = element;
  }

  @action
  registerDropdownElement(element: HTMLElement): void {
    this.dropdownElement = element;
  }

  applyReposition(
    _trigger: Element,
    dropdown: HTMLElement,
    positions: CalculatePositionResult,
  ): RepositionChanges {
    const changes: RepositionChanges = {
      hPosition: positions.horizontalPosition,
      vPosition: positions.verticalPosition,
      otherStyles: Object.assign({}, this.otherStyles),
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
        for (const prop in positions.style) {
          if (positions.style[prop] !== undefined) {
            if (typeof positions.style[prop] === 'number') {
              dropdown.style.setProperty(prop, `${positions.style[prop]}px`);
            } else {
              dropdown.style.setProperty(prop, `${positions.style[prop]}`);
            }
          }
        }
      }
    }
    for (const prop in positions.style) {
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const config = getOwner(this).resolveRegistration('config:environment') as {
      environment: string;
      APP: {
        rootElement: string;
      };
      'ember-basic-dropdown': {
        destination: string;
      };
    };

    if (config.environment === 'test') {
      // document doesn't exists in fastboot apps, for this reason we need this check
      if (typeof document === 'undefined') {
        return 'ember-basic-dropdown-wormhole';
      }
      const rootElement = config['APP']?.rootElement;
      return (
        document.querySelector(rootElement)?.id ??
        'ember-basic-dropdown-wormhole'
      );
    }

    return ((config['ember-basic-dropdown'] &&
      config['ember-basic-dropdown'].destination) ||
      'ember-basic-dropdown-wormhole') as string;
  }

  _getDropdownElement(): HTMLElement | null {
    if (this.dropdownElement) {
      return this.dropdownElement;
    }

    return document.querySelector(`[id="${this._dropdownId}"]`);
  }

  _getTriggerElement(): HTMLElement | null {
    if (this.triggerElement) {
      return this.triggerElement;
    }

    return document.querySelector(
      `[data-ebd-id=${this.publicAPI.uniqueId}-trigger]`,
    );
  }
}
