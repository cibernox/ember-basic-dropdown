import Component from '@glimmer/component';
import { CalculatePosition, CalculatePositionResult } from '../utils/calculate-position';
export interface DropdownActions {
    toggle: (e?: Event) => void;
    close: (e?: Event, skipFocus?: boolean) => void;
    open: (e?: Event) => void;
    reposition: (...args: any[]) => undefined | RepositionChanges;
}
export interface Dropdown {
    uniqueId: string;
    disabled: boolean;
    isOpen: boolean;
    actions: DropdownActions;
}
interface Args {
    initiallyOpened?: boolean;
    renderInPlace?: boolean;
    verticalPosition?: string;
    horizontalPosition?: string;
    destination?: string;
    disabled?: boolean;
    dropdownId?: string;
    matchTriggerWidth?: boolean;
    onInit?: Function;
    registerAPI?: Function;
    onOpen?: Function;
    onClose?: Function;
    calculatePosition?: CalculatePosition;
}
declare type RepositionChanges = {
    hPosition: string;
    vPosition: string;
    otherStyles: Record<string, string | number | undefined>;
    top?: string;
    left?: string;
    right?: string;
    width?: string;
    height?: string;
};
export default class BasicDropdown extends Component<Args> {
    hPosition: string | null;
    vPosition: string | null;
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
    private destinationElement?;
    private _uid;
    private _dropdownId;
    private _previousDisabled;
    private _actions;
    private get horizontalPosition();
    private get verticalPosition();
    get destination(): string;
    get disabled(): boolean;
    get publicAPI(): Dropdown;
    constructor(owner: unknown, args: Args);
    willDestroy(): void;
    open(e?: Event): void;
    close(e?: Event, skipFocus?: boolean): void;
    toggle(e?: Event): void;
    reposition(): undefined | RepositionChanges;
    applyReposition(_trigger: Element, dropdown: Element, positions: CalculatePositionResult): RepositionChanges;
    _getDestinationId(): string;
}
export {};
