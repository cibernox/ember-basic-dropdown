import Component from '@glimmer/component';
import type { Dropdown, TRootEventType } from './basic-dropdown.ts';
export interface BasicDropdownContentSignature {
    Element: Element;
    Args: {
        animationEnabled?: boolean;
        transitioningInClass?: string;
        transitionedInClass?: string;
        transitioningOutClass?: string;
        isTouchDevice?: boolean;
        destination?: string;
        destinationElement?: HTMLElement;
        dropdown?: Dropdown;
        renderInPlace?: boolean;
        preventScroll?: boolean;
        rootEventType?: TRootEventType;
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
        shouldReposition?: (mutations: MutationRecord[], dropdown?: Dropdown) => boolean;
    };
    Blocks: {
        default: [];
    };
}
export default class BasicDropdownContent extends Component<BasicDropdownContentSignature> {
    transitioningInClass: string;
    transitionedInClass: string;
    transitioningOutClass: string;
    isTouchDevice: boolean;
    dropdownId: string;
    private touchMoveEvent;
    private handleRootMouseDown?;
    private scrollableAncestors;
    private mutationObserver;
    private _contentWormhole?;
    animationClass: string;
    get destinationElement(): Element | null;
    get animationEnabled(): boolean;
    get positionStyles(): Record<string, string>;
    /**
     * Allows similair behaviour to `ember-composable-helpers`' `optional` helper.
     * Avoids adding extra dependencies.
     * Can be removed when the template `V1` compatability event handlers are removed.
     *
     * @see https://github.com/cibernox/ember-basic-dropdown/issues/498
     * @memberof BasicDropdownContent
     */
    noop(): void;
    registerDropdownContentWormhole: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: unknown[];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: Element;
    }>;
    respondToEvents: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: unknown[];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: Element;
    }>;
    initiallyReposition: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: unknown[];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: Element;
    }>;
    animateInAndOut: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: unknown[];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: Element;
    }>;
    observeMutations: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: unknown[];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: Element;
    }>;
    touchStartHandler(): void;
    touchMoveHandler(e: TouchEvent): void;
    runloopAwareReposition(): void;
    removeGlobalEvents(): void;
    touchMoveHandlerBound: (e: TouchEvent) => void;
    runloopAwareRepositionBound: () => void;
    touchStartHandlerBound: () => void;
    addScrollHandling(dropdownElement: Element): void;
    removeScrollHandling(): void;
    addScrollEvents(): void;
    removeScrollEvents(): void;
}
//# sourceMappingURL=basic-dropdown-content.d.ts.map