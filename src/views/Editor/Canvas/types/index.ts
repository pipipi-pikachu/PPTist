export interface AlignmentLineAxis {
  x: number; 
  y: number;
}

export interface AlignmentLineProps {
  type: 'vertical' | 'horizontal';
  axis: AlignmentLineAxis;
  length: number;
}

export interface MultiSelectRange {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}