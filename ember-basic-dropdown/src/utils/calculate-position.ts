import type BasicDropdown from '../components/basic-dropdown.gts';
import type { VerticalPosition, HorizontalPosition } from '../types.ts';

// To avoid breaking the current types export we need this
export type { VerticalPosition, HorizontalPosition };

export interface CalculatePositionOptions {
  horizontalPosition: HorizontalPosition;
  verticalPosition: VerticalPosition;
  matchTriggerWidth: boolean;
  previousHorizontalPosition?: HorizontalPosition | undefined;
  previousVerticalPosition?: VerticalPosition | undefined;
  renderInPlace: boolean;
  dropdown: BasicDropdown;
}

export type CalculatePositionResultStyle = {
  top?: number | undefined;
  left?: number | undefined;
  right?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
  [key: string]: string | number | undefined;
};

export type CalculatePositionResult = {
  horizontalPosition: HorizontalPosition;
  verticalPosition: VerticalPosition;
  style: CalculatePositionResultStyle;
};

export type CalculatePosition = (
  trigger: Element,
  content: HTMLElement,
  destination: HTMLElement,
  options: CalculatePositionOptions,
) => CalculatePositionResult;

export type GetViewDataResult = {
  scroll: { left: number; top: number };
  triggerLeft: number;
  triggerTop: number;
  triggerWidth: number;
  triggerHeight: number;
  dropdownHeight: number;
  dropdownWidth: number;
  viewportWidth: number;
  viewportBottom: number;
};

export type GetViewData = (
  trigger: Element,
  content: HTMLElement,
) => GetViewDataResult;

export const getViewData: GetViewData = (trigger, content) => {
  const scroll = {
    left: window.scrollX,
    top: window.scrollY,
  };
  const {
    left: triggerLeft,
    top: triggerTop,
    width: triggerWidth,
    height: triggerHeight,
  } = trigger.getBoundingClientRect();
  const { height: dropdownHeight, width: dropdownWidth } =
    content.getBoundingClientRect();
  const viewportWidth = document.body.clientWidth || window.innerWidth;
  const viewportBottom = scroll.top + window.innerHeight;
  return {
    scroll,
    // The properties top and left of the trigger client rectangle need to be absolute to
    // the top left corner of the document as the value it's compared to is also the total
    // height and not only the viewport height (window client height + scroll offset).
    triggerLeft: triggerLeft + window.scrollX,
    triggerTop: triggerTop + window.scrollY,
    triggerWidth,
    triggerHeight,
    dropdownHeight,
    dropdownWidth,
    viewportWidth,
    viewportBottom,
  };
};

export const calculateWormholedPosition: CalculatePosition = (
  trigger,
  content,
  destination,
  {
    horizontalPosition,
    verticalPosition,
    matchTriggerWidth,
    previousHorizontalPosition,
    previousVerticalPosition,
  },
) => {
  // Collect information about all the involved DOM elements
  const viewData = getViewData(trigger, content);
  const {
    scroll,
    triggerWidth,
    triggerHeight,
    dropdownHeight,
    viewportWidth,
    viewportBottom,
  } = viewData;
  let { triggerLeft, triggerTop, dropdownWidth } = viewData;

  const style: CalculatePositionResultStyle = {};

  // Apply containers' offset
  let anchorElement = destination.parentNode as HTMLElement;

  if (anchorElement instanceof ShadowRoot) {
    anchorElement = anchorElement.host as HTMLElement;
  }

  let anchorPosition = window.getComputedStyle(anchorElement).position;
  while (
    anchorPosition !== 'relative' &&
    anchorPosition !== 'absolute' &&
    anchorElement.tagName.toUpperCase() !== 'BODY' &&
    !(anchorElement.parentNode instanceof ShadowRoot)
  ) {
    anchorElement = anchorElement.parentNode as HTMLElement;
    anchorPosition = window.getComputedStyle(anchorElement).position;
  }
  if (anchorPosition === 'relative' || anchorPosition === 'absolute') {
    const rect = anchorElement.getBoundingClientRect();
    triggerLeft = triggerLeft - rect.left;
    triggerTop = triggerTop - rect.top;
    const { offsetParent } = anchorElement;
    if (offsetParent) {
      triggerLeft -= offsetParent.scrollLeft;
      triggerTop -= offsetParent.scrollTop;
    }
  }

  // Calculate drop down width
  dropdownWidth = matchTriggerWidth ? triggerWidth : dropdownWidth;
  if (matchTriggerWidth) {
    style.width = dropdownWidth;
  }

  /**
   * Fixes bug where the dropdown always stays on the same position on the screen when
   * the <body> is relatively positioned
   */
  const isBodyPositionRelative =
    window.getComputedStyle(document.body).getPropertyValue('position') ===
    'relative';

  // Calculate horizontal position
  let triggerLeftWithScroll = triggerLeft;

  if (!isBodyPositionRelative) {
    triggerLeftWithScroll += scroll.left;
  }

  if (horizontalPosition === 'auto' || horizontalPosition === 'auto-left') {
    // Calculate the number of visible horizontal pixels if we were to place the
    // dropdown on the left and right
    const leftVisible =
      Math.min(viewportWidth, triggerLeft + dropdownWidth) -
      Math.max(0, triggerLeft);
    const rightVisible =
      Math.min(viewportWidth, triggerLeft + triggerWidth) -
      Math.max(0, triggerLeft + triggerWidth - dropdownWidth);

    if (dropdownWidth > leftVisible && rightVisible > leftVisible) {
      // If the drop down won't fit left-aligned, and there is more space on the
      // right than on the left, then force right-aligned
      horizontalPosition = 'right';
    } else if (dropdownWidth > rightVisible && leftVisible > rightVisible) {
      // If the drop down won't fit right-aligned, and there is more space on
      // the left than on the right, then force left-aligned
      horizontalPosition = 'left';
    } else {
      // Keep same position as previous
      horizontalPosition = previousHorizontalPosition || 'left';
    }
  } else if (horizontalPosition === 'auto-right') {
    // Calculate the number of visible horizontal pixels if we were to place the
    // dropdown on the left and right
    const leftVisible =
      Math.min(viewportWidth, triggerLeft + dropdownWidth) -
      Math.max(0, triggerLeft);
    const rightVisible =
      Math.min(viewportWidth, triggerLeft + triggerWidth) -
      Math.max(0, triggerLeft + triggerWidth - dropdownWidth);

    if (dropdownWidth > rightVisible && leftVisible > rightVisible) {
      // If the drop down won't fit right-aligned, and there is more space on the
      // left than on the right, then force left-aligned
      horizontalPosition = 'left';
    } else if (dropdownWidth > leftVisible && rightVisible > leftVisible) {
      // If the drop down won't fit left-aligned, and there is more space on
      // the right than on the left, then force right-aligned
      horizontalPosition = 'right';
    } else {
      // Keep same position as previous
      horizontalPosition = previousHorizontalPosition || 'right';
    }
  }
  if (horizontalPosition === 'right') {
    style.right = viewportWidth - (triggerLeftWithScroll + triggerWidth);
  } else if (horizontalPosition === 'center') {
    style.left = triggerLeftWithScroll + (triggerWidth - dropdownWidth) / 2;
  } else {
    style.left = triggerLeftWithScroll;
  }

  // Calculate vertical position
  let triggerTopWithScroll = triggerTop;

  if (!isBodyPositionRelative) {
    triggerTopWithScroll += scroll.top;
  }

  if (verticalPosition === 'above') {
    style.top = triggerTopWithScroll - dropdownHeight;
  } else if (verticalPosition === 'below') {
    style.top = triggerTopWithScroll + triggerHeight;
  } else {
    const enoughRoomBelow =
      triggerTopWithScroll + triggerHeight + dropdownHeight < viewportBottom;
    const enoughRoomAbove = triggerTop > dropdownHeight;

    if (!enoughRoomBelow && !enoughRoomAbove) {
      verticalPosition = 'below';
    } else if (
      previousVerticalPosition === 'below' &&
      !enoughRoomBelow &&
      enoughRoomAbove
    ) {
      verticalPosition = 'above';
    } else if (
      previousVerticalPosition === 'above' &&
      !enoughRoomAbove &&
      enoughRoomBelow
    ) {
      verticalPosition = 'below';
    } else if (!previousVerticalPosition) {
      verticalPosition = enoughRoomBelow ? 'below' : 'above';
    } else {
      verticalPosition = previousVerticalPosition;
    }
    style.top =
      triggerTopWithScroll +
      (verticalPosition === 'below' ? triggerHeight : -dropdownHeight);
  }

  return { horizontalPosition, verticalPosition, style };
};

export const calculateInPlacePosition: CalculatePosition = (
  trigger,
  content,
  _destination,
  { horizontalPosition, verticalPosition },
) => {
  let dropdownRect;
  const positionData: CalculatePositionResult = {
    horizontalPosition: 'left',
    verticalPosition: 'below',
    style: {},
  };
  if (horizontalPosition === 'auto') {
    const triggerRect = trigger.getBoundingClientRect();
    dropdownRect = content.getBoundingClientRect();
    const viewportRight = window.pageXOffset + window.innerWidth;
    positionData.horizontalPosition =
      triggerRect.left + dropdownRect.width > viewportRight ? 'right' : 'left';
  } else if (horizontalPosition === 'center') {
    const { width: triggerWidth } = trigger.getBoundingClientRect();
    const { width: dropdownWidth } = content.getBoundingClientRect();
    positionData.style = { left: (triggerWidth - dropdownWidth) / 2 };
  } else if (horizontalPosition === 'auto-right') {
    const triggerRect = trigger.getBoundingClientRect();
    const dropdownRect = content.getBoundingClientRect();
    positionData.horizontalPosition =
      triggerRect.right > dropdownRect.width ? 'right' : 'left';
  } else if (horizontalPosition === 'right') {
    positionData.horizontalPosition = 'right';
  }

  if (verticalPosition === 'above') {
    positionData.verticalPosition = verticalPosition;
    dropdownRect = dropdownRect || content.getBoundingClientRect();
    positionData.style.top = -dropdownRect.height;
  } else if (verticalPosition === 'below') {
    positionData.verticalPosition = 'below';
  } else {
    // Automatically determine if there is enough space above or below
    const { triggerTop, triggerHeight, dropdownHeight, viewportBottom } =
      getViewData(trigger, content);

    const enoughRoomBelow =
      triggerTop + triggerHeight + dropdownHeight < viewportBottom;
    const enoughRoomAbove = triggerTop > dropdownHeight;

    if (enoughRoomBelow) {
      verticalPosition = 'below';
    } else if (enoughRoomAbove) {
      verticalPosition = 'above';
      dropdownRect = dropdownRect || content.getBoundingClientRect();
      positionData.style.top = -dropdownRect.height;
    } else {
      // Not enough space above or below
      verticalPosition = 'below';
    }
    positionData.verticalPosition = verticalPosition;
  }
  return positionData;
};

export function getScrollParent(element: Element) {
  let style = window.getComputedStyle(element);
  const excludeStaticParent = style.position === 'absolute';
  const overflowRegex = /(auto|scroll)/;

  if (style.position === 'fixed') return document.body;
  for (
    let parent: Element | null = element;
    (parent = parent.parentElement);

  ) {
    style = window.getComputedStyle(parent);
    if (excludeStaticParent && style.position === 'static') {
      continue;
    }
    if (
      overflowRegex.test(style.overflow + style.overflowY + style.overflowX)
    ) {
      return parent;
    }
  }

  return document.body;
}
const calculatePosition: CalculatePosition = (
  trigger,
  content,
  destination,
  options,
) => {
  if (options.renderInPlace) {
    return calculateInPlacePosition(trigger, content, destination, options);
  } else {
    return calculateWormholedPosition(trigger, content, destination, options);
  }
};

export default calculatePosition;
