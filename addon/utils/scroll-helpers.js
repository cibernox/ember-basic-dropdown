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

// Recursively walks up scroll containers until the delta is distributed or we
// run out of elements in the allowed-to-scroll container.
export function distributeScroll(deltaX, deltaY, element, container) {
  const scrollLeftMax = element.scrollWidth - element.clientWidth;
  const scrollTopMax = element.scrollHeight - element.clientHeight;

  const availableScroll = {
    deltaXNegative: -element.scrollLeft,
    deltaXPositive: scrollLeftMax - element.scrollLeft,
    deltaYNegative: -element.scrollTop,
    deltaYPositive: scrollTopMax - element.scrollTop
  };

  element.scrollLeft = element.scrollLeft + deltaX;
  element.scrollTop = element.scrollTop + deltaY;

  if (deltaX > availableScroll.deltaXPositive) {
    deltaX = deltaX - availableScroll.deltaXPositive;
  } else if (deltaX < availableScroll.deltaXNegative) {
    deltaX = deltaX - availableScroll.deltaXNegative;
  } else {
    deltaX = 0;
  }

  if (deltaY > availableScroll.deltaYPositive) {
    deltaY = deltaY - availableScroll.deltaYPositive;
  } else if (deltaY < availableScroll.deltaYNegative) {
    deltaY = deltaY - availableScroll.deltaYNegative;
  } else {
    deltaY = 0;
  }

  if (element !== container && (deltaX || deltaY)) {
    distributeScroll(deltaX, deltaY, element.parentNode, container);
  }
}
