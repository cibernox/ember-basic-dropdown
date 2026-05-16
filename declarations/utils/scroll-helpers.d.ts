interface ScrollDeltas {
    deltaX: number;
    deltaY: number;
}
/**
 * Mode that expresses the deltas in pixels.
 */
export declare const DOM_DELTA_PIXEL = 0;
/**
 * Mode that expresses the deltas in lines.
 *
 * This only happens in Firefox for Windows.
 *
 * Reference: https://stackoverflow.com/a/37474225
 */
export declare const DOM_DELTA_LINE = 1;
/**
 * Mode that expresses the deltas in pages.
 *
 * This only happens in Firefox for Windows with
 * a custom OS setting activated.
 *
 * Reference: https://stackoverflow.com/a/37474225
 */
export declare const DOM_DELTA_PAGE = 2;
/**
 * Number of lines per page considered for
 * DOM_DELTA_PAGE.
 *
 */
export declare const LINES_PER_PAGE = 3;
export declare function getScrollDeltas({ deltaX, deltaY, deltaMode, }: {
    deltaX?: number | undefined;
    deltaY?: number | undefined;
    deltaMode?: number | undefined;
}): ScrollDeltas;
export declare function getScrollLineHeight(): number | undefined;
export declare function getAvailableScroll(element: Element, container: Element): {
    deltaXNegative: number;
    deltaXPositive: number;
    deltaYNegative: number;
    deltaYPositive: number;
};
export declare function distributeScroll(deltaX: number, deltaY: number, element: Element, container: Element): void;
export {};
//# sourceMappingURL=scroll-helpers.d.ts.map