export interface DropdownActions {
  toggle: (e?: Event) => void;
  close: (e?: Event, skipFocus?: boolean) => void;
  open: (e?: Event) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reposition: (...args: any[]) => undefined | RepositionChanges;
  registerTriggerElement: (e: HTMLElement) => void;
  registerDropdownElement: (e: HTMLElement) => void;
  getTriggerElement: () => HTMLElement | null;
}

export interface Dropdown {
  uniqueId: string;
  disabled: boolean;
  isOpen: boolean;
  actions: DropdownActions;
}

export type TRootEventType = 'click' | 'mousedown';

export type RepositionChanges = {
  hPosition: HorizontalPosition;
  vPosition: VerticalPosition;
  otherStyles: Record<string, string | number | undefined>;
  top?: string | undefined;
  left?: string | undefined;
  right?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
};

export type VerticalPosition = 'auto' | 'above' | 'below';
export type HorizontalPosition =
  | 'auto'
  | 'auto-right'
  | 'auto-left'
  | 'left'
  | 'right'
  | 'center';
