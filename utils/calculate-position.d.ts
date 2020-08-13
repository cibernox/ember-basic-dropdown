interface CalculatePositionOptions {
    horizontalPosition: string;
    verticalPosition: string;
    matchTriggerWidth: boolean;
    previousHorizontalPosition?: string;
    previousVerticalPosition?: string;
    renderInPlace: boolean;
    dropdown: any;
}
export declare type CalculatePositionResultStyle = {
    top?: number;
    left?: number;
    right?: number;
    width?: number;
    height?: number;
    [key: string]: string | number | undefined;
};
export declare type CalculatePositionResult = {
    horizontalPosition: string;
    verticalPosition: string;
    style: CalculatePositionResultStyle;
};
export declare type CalculatePosition = (trigger: Element, content: HTMLElement, destination: HTMLElement, options: CalculatePositionOptions) => CalculatePositionResult;
export declare let calculateWormholedPosition: CalculatePosition;
export declare let calculateInPlacePosition: CalculatePosition;
export declare function getScrollParent(element: Element): Element;
declare let calculatePosition: CalculatePosition;
export default calculatePosition;
