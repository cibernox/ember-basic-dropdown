import $ from 'jquery';
/**
  Function used to calculate the position of the content of the dropdown.
  @public
  @method calculatePosition
  @param {DomElement} trigger The trigger of the dropdown
  @param {DomElement} dropdown The content of the dropdown
  @param {Object} options The directives that define how the position is calculated
    - {String} horizantalPosition How the users want the dropdown to be positioned horizontally. Values: right | center | left
    - {String} verticalPosition How the users want the dropdown to be positioned vertically. Values: above | below
    - {Boolean} matchTriggerWidth If the user wants the width of the dropdown to match the width of the trigger
    - {String} previousHorizantalPosition How the dropdown was positioned for the last time. Same values than horizontalPosition, but can be null the first time.
    - {String} previousVerticalPosition How the dropdown was positioned for the last time. Same values than verticalPosition, but can be null the first time.
  @return {Object} How the component is going to be positioned.
    - {String} horizantalPosition The new horizontal position.
    - {String} verticalPosition The new vertical position.
    - {Object} CSS properties to be set on the dropdown. It supports `top`, `left`, `right` and `width`.
*/
export function calculatePosition(trigger, dropdown, { previousHorizontalPosition, horizontalPosition, previousVerticalPosition, verticalPosition, matchTriggerWidth }) {
  let $window = $(self.window);
  let scroll = { left: $window.scrollLeft(), top: $window.scrollTop() };
  let { left: triggerLeft, top: triggerTop, width: triggerWidth, height: triggerHeight } = trigger.getBoundingClientRect();
  let { height: dropdownHeight, width: dropdownWidth } = dropdown.getBoundingClientRect();
  let dropdownLeft = triggerLeft;
  let dropdownTop;
  dropdownWidth = matchTriggerWidth ? triggerWidth : dropdownWidth;

  let viewportRight = scroll.left + self.window.innerWidth;

  if (horizontalPosition === 'auto') {
    let roomForRight = viewportRight - triggerLeft;

    if (roomForRight < dropdownWidth) {
      horizontalPosition = 'right';
    } else if (triggerLeft < dropdownWidth) {
      horizontalPosition = 'left';
    } else {
      horizontalPosition = previousHorizontalPosition || 'left';
    }

  } else if (horizontalPosition === 'right') {
    dropdownLeft = triggerLeft + triggerWidth - dropdownWidth;
  } else if (horizontalPosition === 'center') {
    dropdownLeft = triggerLeft + (triggerWidth - dropdownWidth) / 2;
  }

  let triggerTopWithScroll = triggerTop + scroll.top;
  if (verticalPosition === 'above') {
    dropdownTop = triggerTopWithScroll - dropdownHeight;
  } else if (verticalPosition === 'below') {
    dropdownTop = triggerTopWithScroll + triggerHeight;
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
    dropdownTop = triggerTopWithScroll + (verticalPosition === 'below' ? triggerHeight : -dropdownHeight);
  }

  let style = { top: dropdownTop };
  if (horizontalPosition === 'right') {
    style.right = viewportRight - (triggerWidth + triggerLeft);
  } else {
    style.left = dropdownLeft;
  }
  if (matchTriggerWidth) {
    style.width = dropdownWidth;
  }

  return { horizontalPosition, verticalPosition, style };
}