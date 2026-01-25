/**
 * Mode that expresses the deltas in pixels.
 */
const DOM_DELTA_PIXEL = 0;
/**
 * Mode that expresses the deltas in lines.
 *
 * This only happens in Firefox for Windows.
 *
 * Reference: https://stackoverflow.com/a/37474225
 */
const DOM_DELTA_LINE = 1;
/**
 * Mode that expresses the deltas in pages.
 *
 * This only happens in Firefox for Windows with
 * a custom OS setting activated.
 *
 * Reference: https://stackoverflow.com/a/37474225
 */
const DOM_DELTA_PAGE = 2;

/**
 * Number of lines per page considered for
 * DOM_DELTA_PAGE.
 *
 */
const LINES_PER_PAGE = 3;
let scrollLineHeight = undefined;
function getScrollDeltas({
  deltaX = 0,
  deltaY = 0,
  deltaMode = DOM_DELTA_PIXEL
}) {
  if (deltaMode !== DOM_DELTA_PIXEL) {
    if (deltaMode === DOM_DELTA_PAGE) {
      deltaX *= LINES_PER_PAGE;
      deltaY *= LINES_PER_PAGE;
    }
    const scrollLineHeight = getScrollLineHeight();
    if (scrollLineHeight !== undefined) {
      deltaX *= scrollLineHeight;
      deltaY *= scrollLineHeight;
    }
  }
  return {
    deltaX,
    deltaY
  };
}
function getScrollLineHeight() {
  if (scrollLineHeight === undefined) {
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
    const body = iframeDocument.body;
    scrollLineHeight = body.firstElementChild.offsetHeight;
    document.body.removeChild(iframe);
  }
  return scrollLineHeight;
}
function getAvailableScroll(element, container) {
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
    availableScroll.deltaXNegative += -element.scrollLeft;
    availableScroll.deltaXPositive += scrollLeftMax - element.scrollLeft;
    availableScroll.deltaYNegative += -element.scrollTop;
    availableScroll.deltaYPositive += scrollTopMax - element.scrollTop;
    const parent = element.parentNode;
    if (parent === null) break;
    element = parent;
  }
  return availableScroll;
}

/**
 * Calculates the scroll distribution for `element` inside` container.
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
function distributeScroll(deltaX, deltaY, element, container) {
  const scrollInfos = calculateScrollDistribution(deltaX, deltaY, element, container);
  let info;
  for (let i = 0; i < scrollInfos.length; i++) {
    info = scrollInfos[i];
    if (info) {
      info.element.scrollLeft = info.scrollLeft;
      info.element.scrollTop = info.scrollTop;
    }
  }
}

export { DOM_DELTA_LINE, DOM_DELTA_PAGE, DOM_DELTA_PIXEL, LINES_PER_PAGE, distributeScroll, getAvailableScroll, getScrollDeltas, getScrollLineHeight };
//# sourceMappingURL=scroll-helpers.js.map
