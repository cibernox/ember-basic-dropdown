
/**
 * Mode that expresses the deltas in pixels.
 *
 * @property DOM_DELTA_PIXEL
 */
export const DOM_DELTA_PIXEL = 0;
/**
 * Mode that expresses the deltas in lines.
 *
 * This only happens in Firefox for Windows.
 *
 * Reference: https://stackoverflow.com/a/37474225
 *
 * @property DOM_DELTA_LINE
 */
export const DOM_DELTA_LINE = 1;
/**
 * Mode that expresses the deltas in pages.
 *
 * This only happens in Firefox for Windows with
 * a custom OS setting activated.
 *
 * Reference: https://stackoverflow.com/a/37474225
 */
export const DOM_DELTA_PAGE = 2;

/**
 * Number of lines per page considered for
 * DOM_DELTA_PAGE.
 *
 * @property LINES_PER_PAGE
 */
export const LINES_PER_PAGE = 3;


/**
 * Returns the deltas calculated in pixels.
 *
 * @param {Number} event.deltaX horizontal delta
 * @param {Number} event.deltaY vertical delta
 * @param {DeltaMode} event.deltaMode delta mode tells which unit is being used.
 * @return {Object} Object with deltaX and deltaY properties
 */
export function getScrollDeltas({ deltaX = 0, deltaY = 0, deltaMode = DOM_DELTA_PIXEL }) {
  if (deltaMode !== DOM_DELTA_PIXEL) {
    if (deltaMode === DOM_DELTA_PAGE) {
      deltaX *= LINES_PER_PAGE;
      deltaY *= LINES_PER_PAGE;
    }
    const scrollLineHeight = getScrollLineHeight();
    deltaX *= scrollLineHeight;
    deltaY *= scrollLineHeight;
  }

  return { deltaX, deltaY };
}

let scrollLineHeight = null;
export function getScrollLineHeight() {
  if (!scrollLineHeight) {
    const iframe = document.createElement('iframe');
    iframe.src = '#';
    iframe.style.position = 'absolute';
    iframe.style.visibility = 'hidden';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    const iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write('<!doctype html><html><head></head><body><span>X</span></body></html>');
    iframeDocument.close();
    scrollLineHeight = iframeDocument.body.firstElementChild.offsetHeight;
    document.body.removeChild(iframe);
  }
  return scrollLineHeight;
}

export function getAvailableScroll(element, container) {
  const availableScroll = {
    deltaXNegative: 0,
    deltaXPositive: 0,
    deltaYNegative: 0,
    deltaYPositive: 0
  };

  let scrollLeftMax, scrollTopMax;
  while (container.contains(element) || container === element) {
    scrollLeftMax = element.scrollWidth - element.clientWidth;
    scrollTopMax = element.scrollHeight - element.clientHeight;

    availableScroll.deltaXNegative += -element.scrollLeft
    availableScroll.deltaXPositive += scrollLeftMax - element.scrollLeft
    availableScroll.deltaYNegative += -element.scrollTop
    availableScroll.deltaYPositive += scrollTopMax - element.scrollTop
    element = element.parentNode;
  }

  return availableScroll;
}

/**
 * Calculates the scroll distribution for `element` inside` container.
 *
 * @param {Number} deltaX
 * @param {Number} deltaY
 * @param {Element} element
 * @param {Element} container
 * @param {ScrollInformation[]} accumulator
 * @return {ScrollInforamtion}
 */
function calculateScrollDistribution(deltaX, deltaY, element, container, accumulator = []) {
  const scrollInformation = {
    element,
    scrollLeft: 0,
    scrollTop: 0
  };
  const scrollLeftMax = element.scrollWidth - element.clientWidth;
  const scrollTopMax = element.scrollHeight - element.clientHeight;

  const availableScroll = {
    deltaXNegative: -element.scrollLeft,
    deltaXPositive: scrollLeftMax - element.scrollLeft,
    deltaYNegative: -element.scrollTop,
    deltaYPositive: scrollTopMax - element.scrollTop
  };

  const elementStyle = window.getComputedStyle(element);

  if (elementStyle.overflowX !== 'hidden') {
    // The `deltaX` can be larger than the available scroll for the element, thus overshooting.
    // The result of that is that it scrolls the element as far as possible. We don't need to
    // calculate exactly because we reduce the amount of desired scroll for the
    // parent elements by the correct amount below.
    scrollInformation.scrollLeft = element.scrollLeft + deltaX;
    if (deltaX > availableScroll.deltaXPositive) {
      deltaX = deltaX - availableScroll.deltaXPositive;
    } else if (deltaX < availableScroll.deltaXNegative) {
      deltaX = deltaX - availableScroll.deltaXNegative;
    } else {
      deltaX = 0;
    }
  }

  if (elementStyle.overflowY !== 'hidden') {
    scrollInformation.scrollTop = element.scrollTop + deltaY;
    if (deltaY > availableScroll.deltaYPositive) {
      deltaY = deltaY - availableScroll.deltaYPositive;
    } else if (deltaY < availableScroll.deltaYNegative) {
      deltaY = deltaY - availableScroll.deltaYNegative;
    } else {
      deltaY = 0;
    }
  }

  if (element !== container && (deltaX || deltaY)) {
    return calculateScrollDistribution(deltaX, deltaY, element.parentNode, container, accumulator.concat([scrollInformation]));
  }

  return accumulator.concat([scrollInformation]);
}

// Recursively walks up scroll containers until the delta is distributed or we
// run out of elements in the allowed-to-scroll container.
export function distributeScroll(deltaX, deltaY, element, container) {
  const scrollInfos = calculateScrollDistribution(deltaX, deltaY, element, container);
  let info;

  for (let i = 0; i < scrollInfos.length; i++) {
    info = scrollInfos[i];
    info.element.scrollLeft = info.scrollLeft;
    info.element.scrollTop = info.scrollTop;
  }
}
