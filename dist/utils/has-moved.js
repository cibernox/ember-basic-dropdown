function hasMoved(endEvent, moveEvent) {
  if (!moveEvent) {
    return false;
  }
  if (!endEvent.changedTouches?.[0] ||
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  moveEvent.changedTouches[0].touchType !== 'stylus') {
    return true;
  }

  // Distinguish stylus scroll and tap: if touch "distance" < 5px, we consider it a tap
  const horizontalDistance = Math.abs((moveEvent.changedTouches[0]?.pageX ?? 0) - endEvent.changedTouches[0].pageX);
  const verticalDistance = Math.abs((moveEvent.changedTouches[0]?.pageY ?? 0) - endEvent.changedTouches[0].pageY);
  return horizontalDistance >= 5 || verticalDistance >= 5;
}

export { hasMoved as default };
//# sourceMappingURL=has-moved.js.map
