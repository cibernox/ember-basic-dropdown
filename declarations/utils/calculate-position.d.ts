export type VerticalPosition = 'auto' | 'above' | 'below';
export type HorizontalPosition = 'auto' | 'auto-right' | 'auto-left' | 'left' | 'right' | 'center';
export interface CalculatePositionOptions {
    horizontalPosition: HorizontalPosition;
    verticalPosition: VerticalPosition;
    matchTriggerWidth: boolean;
    previousHorizontalPosition?: HorizontalPosition | undefined;
    previousVerticalPosition?: VerticalPosition | undefined;
    renderInPlace: boolean;
    dropdown: any;
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
export type CalculatePosition = (trigger: Element, content: HTMLElement, destination: HTMLElement, options: CalculatePositionOptions) => CalculatePositionResult;
export declare const calculateWormholedPosition: CalculatePosition;
export declare const calculateInPlacePosition: CalculatePosition;
export declare function getScrollParent(element: Element): Element;
declare const calculatePosition: CalculatePosition;
export default calculatePosition;
//# sourceMappingURL=calculate-position.d.ts.map