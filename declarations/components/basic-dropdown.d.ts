import Component from '@glimmer/component';
import type { CalculatePosition, CalculatePositionResult, HorizontalPosition, VerticalPosition } from '../utils/calculate-position.ts';
import type Owner from '@ember/owner';
import type { ComponentLike } from '@glint/template';
import type { BasicDropdownTriggerSignature } from './basic-dropdown-trigger.ts';
import type { BasicDropdownContentSignature } from './basic-dropdown-content.ts';
export interface DropdownActions {
    toggle: (e?: Event) => void;
    close: (e?: Event, skipFocus?: boolean) => void;
    open: (e?: Event) => void;
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
            }
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
    onInit?: Function;
    registerAPI?: Function;
    onOpen?: Function;
    onClose?: Function;
    triggerComponent?: string | ComponentLike<any> | undefined;
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
    constructor(owner: Owner, args: BasicDropdownArgs);
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
}
export {};
//# sourceMappingURL=basic-dropdown.d.ts.map