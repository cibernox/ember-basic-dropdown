import Component from '@glimmer/component';
import type { Dropdown } from './basic-dropdown';
import type { HorizontalPosition, VerticalPosition } from '../types.ts';
export interface BasicDropdownTriggerSignature {
    Element: HTMLElement;
    Args: {
        dropdown?: Dropdown;
        eventType?: 'click' | 'mousedown';
        stopPropagation?: boolean;
        vPosition?: VerticalPosition | null;
        hPosition?: HorizontalPosition | null;
        defaultClass?: string;
        renderInPlace?: boolean;
        htmlTag?: keyof HTMLElementTagNameMap;
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
    };
    Blocks: {
        default: [];
    };
}
export default class BasicDropdownTrigger extends Component<BasicDropdownTriggerSignature> {
    /**
     * Allows similar behavior to `ember-composable-helpers`' `optional` helper.
     * Avoids adding extra dependencies.
     * Can be removed when the template `V1` compatibility event handlers are removed.
     *
     * @see https://github.com/cibernox/ember-basic-dropdown/issues/498
     * @memberof BasicDropdownContent
     */
    noop(): void;
    disableDocumentTextSelect(disable: boolean): void;
}
//# sourceMappingURL=basic-dropdown-trigger.d.ts.map