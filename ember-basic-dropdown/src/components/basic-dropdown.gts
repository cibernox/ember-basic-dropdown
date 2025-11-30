import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import calculatePosition from '../utils/calculate-position.ts';
import type {
  CalculatePosition,
  CalculatePositionResult,
  HorizontalPosition,
  VerticalPosition,
} from '../utils/calculate-position.ts';
import { getOwner } from '@ember/application';
import type Owner from '@ember/owner';
import { schedule } from '@ember/runloop';
import type { ComponentLike } from '@glint/template';
import type { BasicDropdownTriggerSignature } from './basic-dropdown-trigger.ts';
import type { BasicDropdownContentSignature } from './basic-dropdown-content.ts';
import { ensureSafeComponent } from '@embroider/util';
import { hash } from '@ember/helper';
import BasicDropdownTrigger from './basic-dropdown-trigger.gts';
import BasicDropdownContent from './basic-dropdown-content.gts';
import { or } from 'ember-truth-helpers';
import type {
  Dropdown,
  DropdownActions,
  RepositionChanges,
  TRootEventType,
} from '../types.ts';
import { deprecate } from '@ember/debug';
import { isTesting } from '@embroider/macros';
import { config as utilConfig, _configSet, type Config } from '../config.ts';

// To avoid breaking the current types export we need this
export type { Dropdown, DropdownActions, TRootEventType };

const UNINITIALIZED = {};
const IGNORED_STYLES = ['top', 'left', 'right', 'width', 'height'];

export interface BasicDropdownDefaultBlock {
  uniqueId: string;
  disabled: boolean;
  isOpen: boolean;
  actions: DropdownActions;
  Trigger: ComponentLike<BasicDropdownTriggerSignature>;
  Content: ComponentLike<BasicDropdownContentSignature>;
}

export interface BasicDropdownSignature {
  Element: HTMLElement;
  Args: BasicDropdownArgs;
  Blocks: {
    default: [BasicDropdownDefaultBlock];
  };
}

export interface BasicDropdownArgs {
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
  onInit?: (dropdown: Dropdown) => void;
  registerAPI?: (dropdown: Dropdown | null) => void;
  onOpen?: (dropdown: Dropdown, e?: Event) => boolean | void;
  onClose?: (dropdown: Dropdown, e?: Event) => boolean | void;
  triggerComponent?:
    | string
    | ComponentLike<BasicDropdownTriggerSignature>
    | undefined;
  contentComponent?:
    | string
    | ComponentLike<BasicDropdownContentSignature>
    | undefined;
  calculatePosition?: CalculatePosition;
}

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
    open: this.open.bind(this),
    close: this.close.bind(this),
    toggle: this.toggle.bind(this),
    reposition: this.reposition.bind(this),
    registerTriggerElement: this.registerTriggerElement.bind(this),
    registerDropdownElement: this.registerDropdownElement.bind(this),
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
      // eslint-disable-next-line ember/no-runloop
      schedule('actions', () => {
        if (newVal && this.publicAPI.isOpen) {
          // eslint-disable-next-line ember/no-side-effects
          this.isOpen = false;
        }
        if (this.args.registerAPI) {
          this.args.registerAPI(this.publicAPI);
        }
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
    if (this.args.registerAPI) {
      this.args.registerAPI(this.publicAPI);
    }

    if (this.args.dropdownId !== undefined) {
      deprecate(
        'You have passed `@dropdownId` into `ember-basic-dropdown`. This property does not work correctly without custom modifiers and is undocumented. Remove this parameter and use the `uniqueId` property from the public API instead.',
        false,
        {
          for: 'ember-basic-dropdown',
          id: 'ember-basic-dropdown.deprecate-arg-dropdown-id',
          since: {
            enabled: '8.8',
            available: '8.8',
          },
          until: '9.0.0',
        },
      );
    }
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
    if (this.args.registerAPI) {
      this.args.registerAPI(this.publicAPI);
    }
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
    if (this.args.registerAPI) {
      this.args.registerAPI(this.publicAPI);
    }
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
    let config = utilConfig;

    if (!_configSet) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const configEnvironment = getOwner(this).resolveRegistration('config:environment') as {
        APP: {
          rootElement: string;
        };
        'ember-basic-dropdown': Config;
      };

      if (configEnvironment['ember-basic-dropdown']) {
        const legacyConfigString = JSON.stringify(configEnvironment['ember-basic-dropdown']);
        deprecate(
          `You have configured \`ember-basic-dropdown\` in \`ember-cli-build.js\`. Remove that configuration and instead use \`import { setConfig } from 'ember-basic-dropdown/config'; setConfig(${legacyConfigString});`,
          false,
          {
            for: 'ember-basic-dropdown',
            id: 'ember-basic-dropdown.config-environment',
            since: {
              enabled: '8.9',
              available: '8.9',
            },
            until: '9.0.0',
          },
        );

        config = configEnvironment['ember-basic-dropdown'];
      }

      if (configEnvironment['APP']?.rootElement) {
        deprecate(
          `ember-basic-dropdown received the \`APP.rootElement\` value from \`ember-cli-build.js\`. You now need to pass this value using \`import { setConfig } from 'ember-basic-dropdown/config'; setConfig({rootElement: config.APP['rootElement']});`,
          false,
          {
            for: 'ember-basic-dropdown',
            id: 'ember-basic-dropdown.config-environment',
            since: {
              enabled: '8.9',
              available: '8.9',
            },
            until: '9.0.0',
          },
        );

        config.rootElement = configEnvironment['APP']?.rootElement;
      }
    }

    if (isTesting()) {
      // document doesn't exist in fastboot apps, for this reason we need this check
      if (typeof document === 'undefined') {
        return 'ember-basic-dropdown-wormhole';
      }

      // check if destination exists in tests:
      if (
        config.destination
      ) {
        const destination = config.destination;
        if (document.getElementById(destination) !== null) {
          return destination;
        }
      }

      // check if default element exists in tests:
      if (document.getElementById('ember-basic-dropdown-wormhole') !== null) {
        return 'ember-basic-dropdown-wormhole';
      }

      // fall back to rootElement as destination
      const rootElement = config.rootElement;
      return (
        (rootElement ? document.querySelector(rootElement)?.id : undefined) ??
        'ember-basic-dropdown-wormhole'
      );
    }

    return (
      config.destination ||
      'ember-basic-dropdown-wormhole'
    );
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

  get triggerComponent(): ComponentLike<BasicDropdownTriggerSignature> {
    if (this.args.triggerComponent) {
      return ensureSafeComponent(
        this.args.triggerComponent,
        this,
      ) as ComponentLike<BasicDropdownTriggerSignature>;
    }

    return BasicDropdownTrigger as ComponentLike<BasicDropdownTriggerSignature>;
  }

  get contentComponent(): ComponentLike<BasicDropdownContentSignature> {
    if (this.args.contentComponent) {
      return ensureSafeComponent(
        this.args.contentComponent,
        this,
      ) as ComponentLike<BasicDropdownContentSignature>;
    }

    return BasicDropdownContent as ComponentLike<BasicDropdownContentSignature>;
  }

  <template>
    {{#let
      (hash
        uniqueId=this.publicAPI.uniqueId
        isOpen=this.publicAPI.isOpen
        disabled=this.publicAPI.disabled
        actions=this.publicAPI.actions
        Trigger=(component
          this.triggerComponent
          dropdown=this.publicAPI
          hPosition=this.hPosition
          renderInPlace=this.renderInPlace
          vPosition=this.vPosition
        )
        Content=(component
          this.contentComponent
          dropdown=this.publicAPI
          hPosition=this.hPosition
          renderInPlace=this.renderInPlace
          preventScroll=@preventScroll
          rootEventType=(or @rootEventType "click")
          vPosition=this.vPosition
          destination=this.destination
          destinationElement=this.destinationElement
          top=this.top
          left=this.left
          right=this.right
          width=this.width
          height=this.height
          otherStyles=this.otherStyles
        )
      )
      as |api|
    }}
      {{#if this.renderInPlace}}
        <div class="ember-basic-dropdown" ...attributes>{{yield api}}</div>
      {{else}}
        {{yield api}}
      {{/if}}
    {{/let}}
  </template>
}
