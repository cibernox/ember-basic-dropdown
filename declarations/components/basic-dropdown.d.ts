import Component from '@glimmer/component';
import type { CalculatePosition, CalculatePositionResult, HorizontalPosition, VerticalPosition } from '../utils/calculate-position.ts';
import type Owner from '@ember/owner';
import type { ComponentLike } from '@glint/template';
import type { BasicDropdownTriggerSignature } from './basic-dropdown-trigger.ts';
import type { BasicDropdownContentSignature } from './basic-dropdown-content.ts';
import type { Dropdown, DropdownActions, RepositionChanges, TRootEventType } from '../types.ts';
export type { Dropdown, DropdownActions, TRootEventType };
export interface BasicDropdownDefaultBlock<TriggerHtmlTag extends keyof HTMLElementTagNameMap = 'div'> {
    uniqueId: string;
    disabled: boolean;
    isOpen: boolean;
    actions: DropdownActions;
    Trigger: ComponentLike<Omit<BasicDropdownTriggerSignature<TriggerHtmlTag>, 'Args'> & {
        Args: Omit<BasicDropdownTriggerSignature<TriggerHtmlTag>['Args'], 'htmlTag'>;
    }>;
    Content: ComponentLike<BasicDropdownContentSignature>;
}
export interface BasicDropdownSignature<TriggerHtmlTag extends keyof HTMLElementTagNameMap = 'div'> {
    Element: HTMLElement;
    Args: BasicDropdownArgs<TriggerHtmlTag>;
    Blocks: {
        default: [BasicDropdownDefaultBlock<TriggerHtmlTag>];
    };
}
export interface BasicDropdownArgs<TriggerHtmlTag extends keyof HTMLElementTagNameMap = 'div'> {
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
    triggerHtmlTag?: TriggerHtmlTag;
    onInit?: (dropdown: Dropdown) => void;
    registerAPI?: (dropdown: Dropdown | null) => void;
    onOpen?: (dropdown: Dropdown, e?: Event) => boolean | void;
    onClose?: (dropdown: Dropdown, e?: Event) => boolean | void;
    triggerComponent?: ComponentLike<BasicDropdownTriggerSignature<TriggerHtmlTag>> | undefined;
    contentComponent?: ComponentLike<BasicDropdownContentSignature> | undefined;
    calculatePosition?: CalculatePosition;
}
export default class BasicDropdown<TriggerHtmlTag extends keyof HTMLElementTagNameMap = 'div'> extends Component<BasicDropdownSignature<TriggerHtmlTag>> {
    hPosition: HorizontalPosition | null;
    vPosition: VerticalPosition | null;
    top: string | undefined;
    left: string | undefined;
    right: string | undefined;
    width: string | undefined;
    height: string | undefined;
    otherStyles: Record<string, string | number | undefined>;
    isOpen: boolean;
    renderInPlace: boolean;
    private previousVerticalPosition?;
    private previousHorizontalPosition?;
    private triggerElement;
    private dropdownElement;
    private _uid;
    private _dropdownId;
    private _previousDisabled;
    private _actions;
    private get horizontalPosition();
    private get verticalPosition();
    get destination(): string;
    get destinationElement(): HTMLElement | null;
    get disabled(): boolean;
    get publicAPI(): Dropdown;
    constructor(owner: Owner, args: BasicDropdownArgs<TriggerHtmlTag>);
    willDestroy(): void;
    open(e?: Event): void;
    close(e?: Event, skipFocus?: boolean): void;
    toggle(e?: Event): void;
    reposition(): undefined | RepositionChanges;
    registerTriggerElement(element: HTMLElement): void;
    registerDropdownElement(element: HTMLElement): void;
    applyReposition(_trigger: Element, dropdown: HTMLElement, positions: CalculatePositionResult): RepositionChanges;
    _getDestinationId(): string;
    _getDropdownElement(): HTMLElement | null;
    _getTriggerElement(): HTMLElement | null;
    get triggerComponent(): ComponentLike<BasicDropdownTriggerSignature<TriggerHtmlTag>>;
    get contentComponent(): ComponentLike<BasicDropdownContentSignature>;
}
//# sourceMappingURL=basic-dropdown.d.ts.map