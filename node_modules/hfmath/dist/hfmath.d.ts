declare let CONFIG: Record<string, number>;
interface Bbox {
    x: number;
    y: number;
    w: number;
    h: number;
}
interface Expr {
    type: string;
    text: string;
    mode: string;
    chld: Expr[];
    bbox: Bbox;
}
interface ExportOpt {
    MIN_CHAR_H?: number;
    MAX_W?: number;
    MAX_H?: number;
    MARGIN_X?: number;
    MARGIN_Y?: number;
    SCALE_X?: number;
    SCALE_Y?: number;
    STROKE_W?: number;
    FG_COLOR?: string;
    BG_COLOR?: string;
}
declare class hfmath {
    _latex: string;
    _tree: Expr;
    _tokens: string[];
    _polylines: number[][][];
    constructor(latex: string);
    private resolveScale;
    polylines(opt?: ExportOpt): number[][][];
    pathd(opt?: ExportOpt): string;
    svg(opt: ExportOpt): string;
    pdf(opt: ExportOpt): string;
    boxes(opt: ExportOpt): Bbox[];
    box(opt: ExportOpt): Bbox;
}
declare let _impl: Record<string, Function>;

export { CONFIG, _impl, hfmath };
