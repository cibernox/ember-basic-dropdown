/**
  Function used to calculate the position of the content of the dropdown.
  @public
  @method calculatePosition
  @param {DomElement} trigger The trigger of the dropdown
  @param {DomElement} content The content of the dropdown
  @param {Object} options The directives that define how the position is calculated
    - {String} horizantalPosition How the users want the dropdown to be positioned horizontally. Values: right | center | left
    - {String} verticalPosition How the users want the dropdown to be positioned vertically. Values: above | below
    - {Boolean} matchTriggerWidth If the user wants the width of the dropdown to match the width of the trigger
    - {String} previousHorizantalPosition How the dropdown was positioned for the last time. Same values than horizontalPosition, but can be null the first time.
    - {String} previousVerticalPosition How the dropdown was positioned for the last time. Same values than verticalPosition, but can be null the first time.
    - {Boolean} renderInPlace Boolean flat that is truthy if the component is rendered in place.
  @return {Object} How the component is going to be positioned.
    - {String} horizantalPosition The new horizontal position.
    - {String} verticalPosition The new vertical position.
    - {Object} CSS properties to be set on the dropdown. It supports `top`, `left`, `right` and `width`.
*/
export default function(_, _2, { renderInPlace }) {
  if (renderInPlace) {
    return calculateInPlacePosition(...arguments);
  } else {
    return calculateWormholedPosition(...arguments);
  }
}

export function calculateWormholedPosition(trigger, content, { horizontalPosition, verticalPosition, matchTriggerWidth, previousHorizontalPosition, previousVerticalPosition, targetContainer }) {
  // Collect information about all the involved DOM elements
  let { left: triggerLeft, top: triggerTop, width: triggerWidth, height: triggerHeight } = trigger.getBoundingClientRect();
  let { height: dropdownHeight, width: dropdownWidth } = content.getBoundingClientRect();
  let container = targetContainer && document.getElementById(targetContainer);
  let style = {};
  let scroll;
  let viewportWidth;

  // consider the offset of the target container
  if (container) {
    let scrollParent = getScrollParent(container);
    triggerLeft -= container.offsetLeft;
    triggerTop -= container.offsetTop;
    scroll = { left: scrollParent.scrollLeft, top: scrollParent.scrollTop}
    viewportWidth = container.clientWidth;
  } else {
    scroll = { left: window.pageXOffset, top: window.pageYOffset };
    viewportWidth = self.document.body.clientWidth || self.window.innerWidth;
  }

  // Calculate drop down width
  dropdownWidth = matchTriggerWidth ? triggerWidth : dropdownWidth;
  if (matchTriggerWidth) {
    style.width = dropdownWidth;
  }

  // Calculate horizontal position
  let triggerLeftWithScroll = triggerLeft + scroll.left;
  if (horizontalPosition === 'auto') {
    // Calculate the number of visible horizontal pixels if we were to place the
    // dropdown on the left and right
    let leftVisible = Math.min(viewportWidth, triggerLeft + dropdownWidth) - Math.max(0, triggerLeft);
    let rightVisible = Math.min(viewportWidth, triggerLeft + triggerWidth) - Math.max(0, triggerLeft + triggerWidth - dropdownWidth);

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
  }
  if (horizontalPosition === 'right') {
    style.right = viewportWidth - (triggerLeftWithScroll + triggerWidth);
  } else if (horizontalPosition === 'center') {
    style.left = triggerLeftWithScroll + (triggerWidth - dropdownWidth) / 2;
  } else {
    style.left = triggerLeftWithScroll;
  }

  // Calculate vertical position
  let triggerTopWithScroll = triggerTop + scroll.top;
  if (verticalPosition === 'above') {
    style.top = triggerTopWithScroll - dropdownHeight;
  } else if (verticalPosition === 'below') {
    style.top = triggerTopWithScroll + triggerHeight;
  } else {
    let viewportBottom = scroll.top + self.window.innerHeight;
    let enoughRoomBelow = triggerTopWithScroll + triggerHeight + dropdownHeight < viewportBottom;
    let enoughRoomAbove = triggerTop > dropdownHeight;

    if (previousVerticalPosition === 'below' && !enoughRoomBelow && enoughRoomAbove) {
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

  return { horizontalPosition, verticalPosition, style };
}

export function calculateInPlacePosition(trigger, content, { horizontalPosition, verticalPosition }/*, matchTriggerWidth, previousHorizontalPosition, previousVerticalPosition */) {
  let dropdownRect;
  let positionData = {};
  if (horizontalPosition === 'auto') {
    let triggerRect = trigger.getBoundingClientRect();
    dropdownRect = content.getBoundingClientRect();
    let viewportRight = window.pageXOffset + self.window.innerWidth;
    positionData.horizontalPosition = triggerRect.left + dropdownRect.width > viewportRight ? 'right' : 'left';
  }
  if (verticalPosition === 'above') {
    positionData.verticalPosition = verticalPosition;
    dropdownRect = dropdownRect || content.getBoundingClientRect();
    positionData.style = { top: -dropdownRect.height };
  }
  return positionData;
}

function getScrollParent(node) {
  if (node === null) {
    return null;
  }

  let overflowY = window.getComputedStyle(node).overflowY;
  let isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

  if (isScrollable && node.scrollHeight > node.clientHeight) {
    return node;
  } else {
    return getScrollParent(node.parentNode);
  }
}
