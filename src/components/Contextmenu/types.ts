export interface ContextmenuItem {
  text?: string;
  subText?: string;
  icon?: string;
  divider?: boolean;
  disable?: boolean;
  hide?: boolean;
  iconPlacehoder?: boolean;
  children?: ContextmenuItem[];
  action?: (el: HTMLElement) => void;
}

export interface Axis {
  x: number;
  y: number;
}