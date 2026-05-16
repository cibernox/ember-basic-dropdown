import type { VerticalPosition, HorizontalPosition } from '../types.ts';
export type { VerticalPosition, HorizontalPosition };
export interface CalculatePositionOptions {
    horizontalPosition: HorizontalPosition;
    verticalPosition: VerticalPosition;
    matchTriggerWidth: boolean;
    previousHorizontalPosition?: HorizontalPosition | undefined;
    previousVerticalPosition?: VerticalPosition | undefined;
    renderInPlace: boolean;
}
export type CalculatePositionResultStyle = {
    top?: number | undefined;
    left?: number | undefined;
    right?: number | undefined;
    width?: number | undefined;
    height?: number | undefined;
    [key: string]: string | number | undefined;
};
export type CalculatePositionResult = {
    horizontalPosition: HorizontalPosition;
    verticalPosition: VerticalPosition;
    style: CalculatePositionResultStyle;
};
export type CalculatePosition = (trigger: HTMLElement, content: HTMLElement, destination: HTMLElement, options: CalculatePositionOptions) => CalculatePositionResult;
export declare function calculateWormholedPosition(trigger: HTMLElement, content: HTMLElement, destination: HTMLElement, { horizontalPosition, verticalPosition, matchTriggerWidth, previousHorizontalPosition, previousVerticalPosition, }: CalculatePositionOptions): CalculatePositionResult;
export declare function calculateInPlacePosition(trigger: HTMLElement, content: HTMLElement, _destination: HTMLElement, { horizontalPosition, verticalPosition }: CalculatePositionOptions): CalculatePositionResult;
export declare function getScrollParent(element: Element): Element;
declare function calculatePosition(trigger: HTMLElement, content: HTMLElement, destination: HTMLElement, options: CalculatePositionOptions): CalculatePositionResult;
export default calculatePosition;
//# sourceMappingURL=calculate-position.d.ts.map