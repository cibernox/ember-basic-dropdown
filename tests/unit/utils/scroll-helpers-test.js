import {
  distributeScroll,
  getAvailableScroll,
  getScrollDeltas,
  getScrollLineHeight,
  DOM_DELTA_LINE,
  DOM_DELTA_PAGE,
  DOM_DELTA_PIXEL,
  LINES_PER_PAGE,
} from 'ember-basic-dropdown/utils/scroll-helpers';
import { module, test } from 'qunit';

module('Unit | Utility | scroll helpers', function () {
  test('getScrollLineHeight', function (assert) {
    // Depends on device and settings.
    let result = getScrollLineHeight();

    // Also blows up on 0, which is an invalid value.
    assert.ok(result, 'did not throw errors');
  });

  test('getAvailableScroll', function (assert) {
    const container = document.createElement('div');
    container.style.height = '100px';
    container.style.overflow = 'auto';
    const child = document.createElement('div');
    child.style.height = '300px';
    child.style.overflow = 'auto';
    const grandchild = document.createElement('div');
    grandchild.style.height = '500px';
    grandchild.innerText = 'asdf';

    child.appendChild(grandchild);
    container.appendChild(child);
    document.body.appendChild(container);

    let result;
    container.scrollTop = 0;
    result = getAvailableScroll(child, container);
    assert.strictEqual(result.deltaYNegative, 0);
    assert.strictEqual(result.deltaYPositive, 400);

    container.scrollTop = 20;
    result = getAvailableScroll(child, container);
    assert.strictEqual(result.deltaYNegative, -20);
    assert.strictEqual(result.deltaYPositive, 380);

    result = getAvailableScroll(grandchild, container);
    assert.strictEqual(result.deltaYNegative, -20);
    assert.strictEqual(result.deltaYPositive, 380);
  });

  test('distributeScroll', function (assert) {
    const container = document.createElement('div');
    container.style.height = '100px';
    container.style.overflow = 'auto';
    const child = document.createElement('div');
    child.style.height = '300px';
    child.style.overflow = 'auto';
    const grandchild = document.createElement('div');
    grandchild.style.height = '500px';
    grandchild.innerText = 'asdf';

    child.appendChild(grandchild);
    container.appendChild(child);
    document.body.appendChild(container);

    container.scrollTop = 20;
    child.scrollTop = 20;

    distributeScroll(0, -30, grandchild, container);
    assert.strictEqual(container.scrollTop, 10);
    assert.strictEqual(child.scrollTop, 0);

    distributeScroll(0, 40, grandchild, container);
    assert.strictEqual(container.scrollTop, 10);
    assert.strictEqual(child.scrollTop, 40);
  });

  test('getScrollDeltas DOM_DELTA_PIXEL', function (assert) {
    const originalDeltaX = 25;
    const originalDeltaY = 15;
    const { deltaX, deltaY } = getScrollDeltas({
      deltaX: originalDeltaX,
      deltaY: originalDeltaY,
      deltaMode: DOM_DELTA_PIXEL,
    });
    assert.strictEqual(deltaX, originalDeltaX);
    assert.strictEqual(deltaY, originalDeltaY);
  });

  test('getScrollDeltas DOM_DELTA_LINE', function (assert) {
    const scrollLineHeight = getScrollLineHeight();
    const originalDeltaX = 25;
    const originalDeltaY = 15;
    const { deltaX, deltaY } = getScrollDeltas({
      deltaX: originalDeltaX,
      deltaY: originalDeltaY,
      deltaMode: DOM_DELTA_LINE,
    });
    assert.strictEqual(deltaX, originalDeltaX * scrollLineHeight);
    assert.strictEqual(deltaY, originalDeltaY * scrollLineHeight);
  });

  test('getScrollDeltas DOM_DELTA_PAGE', function (assert) {
    const scrollLineHeight = getScrollLineHeight();
    const originalDeltaX = 25;
    const originalDeltaY = 15;
    const { deltaX, deltaY } = getScrollDeltas({
      deltaX: originalDeltaX,
      deltaY: originalDeltaY,
      deltaMode: DOM_DELTA_PAGE,
    });
    assert.strictEqual(
      deltaX,
      originalDeltaX * scrollLineHeight * LINES_PER_PAGE
    );
    assert.strictEqual(
      deltaY,
      originalDeltaY * scrollLineHeight * LINES_PER_PAGE
    );
  });
});
