import Component from '@glimmer/component';
import { Dropdown } from './basic-dropdown';
import { SafeString } from '@ember/template/-private/handlebars';
interface Args {
  transitioningInClass?: string;
  transitionedInClass?: string;
  transitioningOutClass?: string;
  isTouchDevice?: boolean;
  destination: string;
  dropdown: Dropdown;
  renderInPlace: boolean;
  preventScroll?: boolean;
  rootEventType: 'click' | 'mousedown';
  top: string | undefined;
  left: string | undefined;
  right: string | undefined;
  width: string | undefined;
  height: string | undefined;
  otherStyles: Record<string, string>;
  onFocusIn?: (dropdown?: Dropdown, event?: FocusEvent) => void;
  onFocusOut?: (dropdown?: Dropdown, event?: FocusEvent) => void;
  onMouseEnter?: (dropdown?: Dropdown, event?: MouseEvent) => void;
  onMouseLeave?: (dropdown?: Dropdown, event?: MouseEvent) => void;
  shouldReposition: (
    mutations: MutationRecord[],
    dropdown: Dropdown
  ) => boolean;
}
export default class BasicDropdownContent extends Component<Args> {
  transitioningInClass: string;
  transitionedInClass: string;
  transitioningOutClass: string;
  isTouchDevice: boolean;
  dropdownId: string;
  private hasMoved;
  private handleRootMouseDown?;
  private scrollableAncestors;
  private mutationObserver?;
  animationClass: string;
  get destinationElement(): Element | null;
  get animationEnabled(): boolean;
  get style(): SafeString;
  /**
   * Allows similair behaviour to `ember-composable-helpers`' `optional` helper.
   * Avoids adding extra dependencies.
   * Can be removed when the template `V1` compatability event handlers are removed.
   *
   * @see https://github.com/cibernox/ember-basic-dropdown/issues/498
   * @memberof BasicDropdownContent
   */
  noop(): void;
  setup(dropdownElement: Element): void;
  teardown(): void;
  animateIn(dropdownElement: Element): void;
  animateOut(dropdownElement: Element): void;
  setupMutationObserver(dropdownElement: Element): void;
  teardownMutationObserver(): void;
  touchStartHandler(): void;
  touchMoveHandler(): void;
  runloopAwareReposition(): void;
  removeGlobalEvents(): void;
  addScrollHandling(dropdownElement: Element): void;
  removeScrollHandling(): void;
  addScrollEvents(): void;
  removeScrollEvents(): void;
}
export {};
