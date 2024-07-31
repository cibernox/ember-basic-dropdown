const calculateWormholedPosition = (trigger, content, destination, {
  horizontalPosition,
  verticalPosition,
  matchTriggerWidth,
  previousHorizontalPosition,
  previousVerticalPosition
}) => {
  // Collect information about all the involved DOM elements
  const scroll = {
    left: window.pageXOffset,
    top: window.pageYOffset
  };
  let {
    left: triggerLeft,
    top: triggerTop
  } = trigger.getBoundingClientRect();
  const {
    width: triggerWidth,
    height: triggerHeight
  } = trigger.getBoundingClientRect();
  const {
    height: dropdownHeight
  } = content.getBoundingClientRect();
  let {
    width: dropdownWidth
  } = content.getBoundingClientRect();
  const viewportWidth = document.body.clientWidth || window.innerWidth;
  const style = {};

  // Apply containers' offset
  let anchorElement = destination.parentNode;
  if (anchorElement instanceof ShadowRoot) {
    anchorElement = anchorElement.host;
  }
  let anchorPosition = window.getComputedStyle(anchorElement).position;
  while (anchorPosition !== 'relative' && anchorPosition !== 'absolute' && anchorElement.tagName.toUpperCase() !== 'BODY' && !(anchorElement.parentNode instanceof ShadowRoot)) {
    anchorElement = anchorElement.parentNode;
    anchorPosition = window.getComputedStyle(anchorElement).position;
  }
  if (anchorPosition === 'relative' || anchorPosition === 'absolute') {
    const rect = anchorElement.getBoundingClientRect();
    triggerLeft = triggerLeft - rect.left;
    triggerTop = triggerTop - rect.top;
    const {
      offsetParent
    } = anchorElement;
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
  const isBodyPositionRelative = window.getComputedStyle(document.body).getPropertyValue('position') === 'relative';

  // Calculate horizontal position
  let triggerLeftWithScroll = triggerLeft;
  if (!isBodyPositionRelative) {
    triggerLeftWithScroll += scroll.left;
  }
  if (horizontalPosition === 'auto' || horizontalPosition === 'auto-left') {
    // Calculate the number of visible horizontal pixels if we were to place the
    // dropdown on the left and right
    const leftVisible = Math.min(viewportWidth, triggerLeft + dropdownWidth) - Math.max(0, triggerLeft);
    const rightVisible = Math.min(viewportWidth, triggerLeft + triggerWidth) - Math.max(0, triggerLeft + triggerWidth - dropdownWidth);
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
    const leftVisible = Math.min(viewportWidth, triggerLeft + dropdownWidth) - Math.max(0, triggerLeft);
    const rightVisible = Math.min(viewportWidth, triggerLeft + triggerWidth) - Math.max(0, triggerLeft + triggerWidth - dropdownWidth);
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
    const viewportBottom = scroll.top + window.innerHeight;
    const enoughRoomBelow = triggerTopWithScroll + triggerHeight + dropdownHeight < viewportBottom;
    const enoughRoomAbove = triggerTop > dropdownHeight;
    if (!enoughRoomBelow && !enoughRoomAbove) {
      verticalPosition = 'below';
    } else if (previousVerticalPosition === 'below' && !enoughRoomBelow && enoughRoomAbove) {
      verticalPosition = 'above';
    } else if (previousVerticalPosition === 'above' && !enoughRoomAbove && enoughRoomBelow) {
      verticalPosition = 'below';
    } else if (!previousVerticalPosition) {
      verticalPosition = enoughRoomBelow ? 'below' : 'above';
    } else {
      verticalPosition = previousVerticalPosition;
    }
    style.top = triggerTopWithScroll + (verticalPosition === 'below' ? triggerHeight : -dropdownHeight);
  }
  return {
    horizontalPosition,
    verticalPosition,
    style
  };
};
const calculateInPlacePosition = (trigger, content, _destination, {
  horizontalPosition,
  verticalPosition
}) => {
  let dropdownRect;
  const positionData = {
    horizontalPosition: 'left',
    verticalPosition: 'below',
    style: {}
  };
  if (horizontalPosition === 'auto') {
    const triggerRect = trigger.getBoundingClientRect();
    dropdownRect = content.getBoundingClientRect();
    const viewportRight = window.pageXOffset + window.innerWidth;
    positionData.horizontalPosition = triggerRect.left + dropdownRect.width > viewportRight ? 'right' : 'left';
  } else if (horizontalPosition === 'center') {
    const {
      width: triggerWidth
    } = trigger.getBoundingClientRect();
    const {
      width: dropdownWidth
    } = content.getBoundingClientRect();
    positionData.style = {
      left: (triggerWidth - dropdownWidth) / 2
    };
  } else if (horizontalPosition === 'auto-right') {
    const triggerRect = trigger.getBoundingClientRect();
    const dropdownRect = content.getBoundingClientRect();
    positionData.horizontalPosition = triggerRect.right > dropdownRect.width ? 'right' : 'left';
  } else if (horizontalPosition === 'right') {
    positionData.horizontalPosition = 'right';
  }
  if (verticalPosition === 'above') {
    positionData.verticalPosition = verticalPosition;
    dropdownRect = dropdownRect || content.getBoundingClientRect();
    positionData.style.top = -dropdownRect.height;
  } else {
    positionData.verticalPosition = 'below';
  }
  return positionData;
};
function getScrollParent(element) {
  let style = window.getComputedStyle(element);
  const excludeStaticParent = style.position === 'absolute';
  const overflowRegex = /(auto|scroll)/;
  if (style.position === 'fixed') return document.body;
  for (let parent = element; parent = parent.parentElement;) {
    style = window.getComputedStyle(parent);
    if (excludeStaticParent && style.position === 'static') {
      continue;
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
      return parent;
    }
  }
  return document.body;
}
const calculatePosition = (trigger, content, destination, options) => {
  if (options.renderInPlace) {
    return calculateInPlacePosition(trigger, content, destination, options);
  } else {
    return calculateWormholedPosition(trigger, content, destination, options);
  }
};

export { calculateInPlacePosition, calculateWormholedPosition, calculatePosition as default, getScrollParent };
//# sourceMappingURL=calculate-position.js.map
