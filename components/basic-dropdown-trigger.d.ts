import Component from '@glimmer/component';
import { Dropdown } from './basic-dropdown';
interface Args {
    dropdown: Dropdown;
    eventType: 'click' | 'mousedown';
    stopPropagation: boolean;
    onBlur?: (dropdown?: Dropdown, event?: FocusEvent) => void;
    onClick?: (dropdown?: Dropdown, event?: MouseEvent) => void;
    onFocus?: (dropdown?: Dropdown, event?: FocusEvent) => void;
    onFocusIn?: (dropdown?: Dropdown, event?: FocusEvent) => void;
    onFocusOut?: (dropdown?: Dropdown, event?: FocusEvent) => void;
    onKeyDown?: (dropdown?: Dropdown, event?: KeyboardEvent) => void;
    onMouseDown?: (dropdown?: Dropdown, event?: MouseEvent) => void;
    onMouseEnter?: (dropdown?: Dropdown, event?: MouseEvent) => void;
    onMouseLeave?: (dropdown?: Dropdown, event?: MouseEvent) => void;
    onTouchEnd?: (dropdown?: Dropdown, event?: TouchEvent) => void;
}
export default class BasicDropdownTrigger extends Component<Args> {
    private toggleIsBeingHandledByTouchEvents;
    private hasMoved;
    /**
     * Allows similair behaviour to `ember-composable-helpers`' `optional` helper.
     * Avoids adding extra dependencies.
     * Can be removed when the template `V1` compatability event handlers are removed.
     *
     * @see https://github.com/cibernox/ember-basic-dropdown/issues/498
     * @memberof BasicDropdownContent
     */
    noop(): void;
    handleMouseDown(e: MouseEvent): void;
    handleClick(e: MouseEvent): void;
    handleKeyDown(e: KeyboardEvent): void;
    handleTouchStart(): void;
    handleTouchEnd(e: TouchEvent): void;
    removeGlobalHandlers(): void;
    _mouseupHandler(): void;
    _touchMoveHandler(): void;
    _stopTextSelectionUntilMouseup(): void;
}
export {};
