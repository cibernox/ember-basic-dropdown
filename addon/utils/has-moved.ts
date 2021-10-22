export default function hasMoved(
  endEvent: TouchEvent,
  moveEvent?: TouchEvent
): boolean {
  if (!moveEvent) {
    return false;
  }

  if (
    !endEvent.changedTouches?.[0] ||
    (moveEvent.changedTouches[0] as any).touchType !== 'stylus'
  ) {
    return true;
  }

  // Distinguish stylus scroll and tap: if touch "distance" < 5px, we consider it a tap
  let horizontalDistance = Math.abs(
    moveEvent.changedTouches[0].pageX - endEvent.changedTouches[0].pageX
  );
  let verticalDistance = Math.abs(
    moveEvent.changedTouches[0].pageY - endEvent.changedTouches[0].pageY
  );
  return horizontalDistance >= 5 || verticalDistance >= 5;
}
