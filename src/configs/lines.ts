export interface LinePoolItem {
  path: string;
  style: string;
  points: [string, string];
}

export const LINE_LIST = [
  { path: 'M0,0 L20,20', style: 'solid', points: ['', ''] },
  { path: 'M0,0 L20,20', style: 'dashed', points: ['', ''] },
  { path: 'M0,0 L20,20', style: 'solid', points: ['', 'arrow'] },
  { path: 'M0,0 L20,20', style: 'dashed', points: ['', 'arrow'] },
  { path: 'M0,0 L20,20', style: 'solid', points: ['', 'dot'] },
]