/* PptxGenJS 3.12.0 @ 2023-03-20T03:12:31.353Z */
'use strict';

var JSZip = require('jszip');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var JSZip__default = /*#__PURE__*/_interopDefaultLegacy(JSZip);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

/**
 * PptxGenJS Enums
 * NOTE: `enum` wont work for objects, so use `Object.freeze`
 */
// CONST
var EMU = 914400; // One (1) inch (OfficeXML measures in EMU (English Metric Units))
var ONEPT = 12700; // One (1) point (pt)
var CRLF = '\r\n'; // AKA: Chr(13) & Chr(10)
var LAYOUT_IDX_SERIES_BASE = 2147483649;
var REGEX_HEX_COLOR = /^[0-9a-fA-F]{6}$/;
var LINEH_MODIFIER = 1.67; // AKA: Golden Ratio Typography
var DEF_BULLET_MARGIN = 27;
var DEF_CELL_BORDER = { type: 'solid', color: '666666', pt: 1 };
var DEF_CELL_MARGIN_IN = [0.05, 0.1, 0.05, 0.1]; // "Normal" margins in PPT-2021 ("Narrow" is `0.05` for all 4)
var DEF_CHART_BORDER = { type: 'solid', color: '363636', pt: 1 };
var DEF_CHART_GRIDLINE = { color: '888888', style: 'solid', size: 1, cap: 'flat' };
var DEF_FONT_COLOR = '000000';
var DEF_FONT_SIZE = 12;
var DEF_FONT_TITLE_SIZE = 18;
var DEF_PRES_LAYOUT = 'LAYOUT_16x9';
var DEF_PRES_LAYOUT_NAME = 'DEFAULT';
var DEF_SHAPE_LINE_COLOR = '333333';
var DEF_SHAPE_SHADOW = { type: 'outer', blur: 3, offset: 23000 / 12700, angle: 90, color: '000000', opacity: 0.35, rotateWithShape: true };
var DEF_SLIDE_MARGIN_IN = [0.5, 0.5, 0.5, 0.5]; // TRBL-style
var DEF_TEXT_SHADOW = { type: 'outer', blur: 8, offset: 4, angle: 270, color: '000000', opacity: 0.75 };
var DEF_TEXT_GLOW = { size: 8, color: 'FFFFFF', opacity: 0.75 };
var AXIS_ID_VALUE_PRIMARY = '2094734552';
var AXIS_ID_VALUE_SECONDARY = '2094734553';
var AXIS_ID_CATEGORY_PRIMARY = '2094734554';
var AXIS_ID_CATEGORY_SECONDARY = '2094734555';
var AXIS_ID_SERIES_PRIMARY = '2094734556';
var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
var BARCHART_COLORS = [
    'C0504D',
    '4F81BD',
    '9BBB59',
    '8064A2',
    '4BACC6',
    'F79646',
    '628FC6',
    'C86360',
    'C0504D',
    '4F81BD',
    '9BBB59',
    '8064A2',
    '4BACC6',
    'F79646',
    '628FC6',
    'C86360'
];
var PIECHART_COLORS = [
    '5DA5DA',
    'FAA43A',
    '60BD68',
    'F17CB0',
    'B2912F',
    'B276B2',
    'DECF3F',
    'F15854',
    'A7A7A7',
    '5DA5DA',
    'FAA43A',
    '60BD68',
    'F17CB0',
    'B2912F',
    'B276B2',
    'DECF3F',
    'F15854',
    'A7A7A7',
];
var TEXT_HALIGN;
(function (TEXT_HALIGN) {
    TEXT_HALIGN["left"] = "left";
    TEXT_HALIGN["center"] = "center";
    TEXT_HALIGN["right"] = "right";
    TEXT_HALIGN["justify"] = "justify";
})(TEXT_HALIGN || (TEXT_HALIGN = {}));
var TEXT_VALIGN;
(function (TEXT_VALIGN) {
    TEXT_VALIGN["b"] = "b";
    TEXT_VALIGN["ctr"] = "ctr";
    TEXT_VALIGN["t"] = "t";
})(TEXT_VALIGN || (TEXT_VALIGN = {}));
var SLDNUMFLDID = '{F7021451-1387-4CA6-816F-3879F97B5CBC}';
// ENUM
// TODO: 3.5 or v4.0: rationalize ts-def exported enum names/case!
// NOTE: First tsdef enum named correctly (shapes -> 'Shape', colors -> 'Color'), etc.
var OutputType;
(function (OutputType) {
    OutputType["arraybuffer"] = "arraybuffer";
    OutputType["base64"] = "base64";
    OutputType["binarystring"] = "binarystring";
    OutputType["blob"] = "blob";
    OutputType["nodebuffer"] = "nodebuffer";
    OutputType["uint8array"] = "uint8array";
})(OutputType || (OutputType = {}));
var ChartType;
(function (ChartType) {
    ChartType["area"] = "area";
    ChartType["bar"] = "bar";
    ChartType["bar3d"] = "bar3D";
    ChartType["bubble"] = "bubble";
    ChartType["bubble3d"] = "bubble3D";
    ChartType["doughnut"] = "doughnut";
    ChartType["line"] = "line";
    ChartType["pie"] = "pie";
    ChartType["radar"] = "radar";
    ChartType["scatter"] = "scatter";
})(ChartType || (ChartType = {}));
var ShapeType;
(function (ShapeType) {
    ShapeType["accentBorderCallout1"] = "accentBorderCallout1";
    ShapeType["accentBorderCallout2"] = "accentBorderCallout2";
    ShapeType["accentBorderCallout3"] = "accentBorderCallout3";
    ShapeType["accentCallout1"] = "accentCallout1";
    ShapeType["accentCallout2"] = "accentCallout2";
    ShapeType["accentCallout3"] = "accentCallout3";
    ShapeType["actionButtonBackPrevious"] = "actionButtonBackPrevious";
    ShapeType["actionButtonBeginning"] = "actionButtonBeginning";
    ShapeType["actionButtonBlank"] = "actionButtonBlank";
    ShapeType["actionButtonDocument"] = "actionButtonDocument";
    ShapeType["actionButtonEnd"] = "actionButtonEnd";
    ShapeType["actionButtonForwardNext"] = "actionButtonForwardNext";
    ShapeType["actionButtonHelp"] = "actionButtonHelp";
    ShapeType["actionButtonHome"] = "actionButtonHome";
    ShapeType["actionButtonInformation"] = "actionButtonInformation";
    ShapeType["actionButtonMovie"] = "actionButtonMovie";
    ShapeType["actionButtonReturn"] = "actionButtonReturn";
    ShapeType["actionButtonSound"] = "actionButtonSound";
    ShapeType["arc"] = "arc";
    ShapeType["bentArrow"] = "bentArrow";
    ShapeType["bentUpArrow"] = "bentUpArrow";
    ShapeType["bevel"] = "bevel";
    ShapeType["blockArc"] = "blockArc";
    ShapeType["borderCallout1"] = "borderCallout1";
    ShapeType["borderCallout2"] = "borderCallout2";
    ShapeType["borderCallout3"] = "borderCallout3";
    ShapeType["bracePair"] = "bracePair";
    ShapeType["bracketPair"] = "bracketPair";
    ShapeType["callout1"] = "callout1";
    ShapeType["callout2"] = "callout2";
    ShapeType["callout3"] = "callout3";
    ShapeType["can"] = "can";
    ShapeType["chartPlus"] = "chartPlus";
    ShapeType["chartStar"] = "chartStar";
    ShapeType["chartX"] = "chartX";
    ShapeType["chevron"] = "chevron";
    ShapeType["chord"] = "chord";
    ShapeType["circularArrow"] = "circularArrow";
    ShapeType["cloud"] = "cloud";
    ShapeType["cloudCallout"] = "cloudCallout";
    ShapeType["corner"] = "corner";
    ShapeType["cornerTabs"] = "cornerTabs";
    ShapeType["cube"] = "cube";
    ShapeType["curvedDownArrow"] = "curvedDownArrow";
    ShapeType["curvedLeftArrow"] = "curvedLeftArrow";
    ShapeType["curvedRightArrow"] = "curvedRightArrow";
    ShapeType["curvedUpArrow"] = "curvedUpArrow";
    ShapeType["custGeom"] = "custGeom";
    ShapeType["decagon"] = "decagon";
    ShapeType["diagStripe"] = "diagStripe";
    ShapeType["diamond"] = "diamond";
    ShapeType["dodecagon"] = "dodecagon";
    ShapeType["donut"] = "donut";
    ShapeType["doubleWave"] = "doubleWave";
    ShapeType["downArrow"] = "downArrow";
    ShapeType["downArrowCallout"] = "downArrowCallout";
    ShapeType["ellipse"] = "ellipse";
    ShapeType["ellipseRibbon"] = "ellipseRibbon";
    ShapeType["ellipseRibbon2"] = "ellipseRibbon2";
    ShapeType["flowChartAlternateProcess"] = "flowChartAlternateProcess";
    ShapeType["flowChartCollate"] = "flowChartCollate";
    ShapeType["flowChartConnector"] = "flowChartConnector";
    ShapeType["flowChartDecision"] = "flowChartDecision";
    ShapeType["flowChartDelay"] = "flowChartDelay";
    ShapeType["flowChartDisplay"] = "flowChartDisplay";
    ShapeType["flowChartDocument"] = "flowChartDocument";
    ShapeType["flowChartExtract"] = "flowChartExtract";
    ShapeType["flowChartInputOutput"] = "flowChartInputOutput";
    ShapeType["flowChartInternalStorage"] = "flowChartInternalStorage";
    ShapeType["flowChartMagneticDisk"] = "flowChartMagneticDisk";
    ShapeType["flowChartMagneticDrum"] = "flowChartMagneticDrum";
    ShapeType["flowChartMagneticTape"] = "flowChartMagneticTape";
    ShapeType["flowChartManualInput"] = "flowChartManualInput";
    ShapeType["flowChartManualOperation"] = "flowChartManualOperation";
    ShapeType["flowChartMerge"] = "flowChartMerge";
    ShapeType["flowChartMultidocument"] = "flowChartMultidocument";
    ShapeType["flowChartOfflineStorage"] = "flowChartOfflineStorage";
    ShapeType["flowChartOffpageConnector"] = "flowChartOffpageConnector";
    ShapeType["flowChartOnlineStorage"] = "flowChartOnlineStorage";
    ShapeType["flowChartOr"] = "flowChartOr";
    ShapeType["flowChartPredefinedProcess"] = "flowChartPredefinedProcess";
    ShapeType["flowChartPreparation"] = "flowChartPreparation";
    ShapeType["flowChartProcess"] = "flowChartProcess";
    ShapeType["flowChartPunchedCard"] = "flowChartPunchedCard";
    ShapeType["flowChartPunchedTape"] = "flowChartPunchedTape";
    ShapeType["flowChartSort"] = "flowChartSort";
    ShapeType["flowChartSummingJunction"] = "flowChartSummingJunction";
    ShapeType["flowChartTerminator"] = "flowChartTerminator";
    ShapeType["folderCorner"] = "folderCorner";
    ShapeType["frame"] = "frame";
    ShapeType["funnel"] = "funnel";
    ShapeType["gear6"] = "gear6";
    ShapeType["gear9"] = "gear9";
    ShapeType["halfFrame"] = "halfFrame";
    ShapeType["heart"] = "heart";
    ShapeType["heptagon"] = "heptagon";
    ShapeType["hexagon"] = "hexagon";
    ShapeType["homePlate"] = "homePlate";
    ShapeType["horizontalScroll"] = "horizontalScroll";
    ShapeType["irregularSeal1"] = "irregularSeal1";
    ShapeType["irregularSeal2"] = "irregularSeal2";
    ShapeType["leftArrow"] = "leftArrow";
    ShapeType["leftArrowCallout"] = "leftArrowCallout";
    ShapeType["leftBrace"] = "leftBrace";
    ShapeType["leftBracket"] = "leftBracket";
    ShapeType["leftCircularArrow"] = "leftCircularArrow";
    ShapeType["leftRightArrow"] = "leftRightArrow";
    ShapeType["leftRightArrowCallout"] = "leftRightArrowCallout";
    ShapeType["leftRightCircularArrow"] = "leftRightCircularArrow";
    ShapeType["leftRightRibbon"] = "leftRightRibbon";
    ShapeType["leftRightUpArrow"] = "leftRightUpArrow";
    ShapeType["leftUpArrow"] = "leftUpArrow";
    ShapeType["lightningBolt"] = "lightningBolt";
    ShapeType["line"] = "line";
    ShapeType["lineInv"] = "lineInv";
    ShapeType["mathDivide"] = "mathDivide";
    ShapeType["mathEqual"] = "mathEqual";
    ShapeType["mathMinus"] = "mathMinus";
    ShapeType["mathMultiply"] = "mathMultiply";
    ShapeType["mathNotEqual"] = "mathNotEqual";
    ShapeType["mathPlus"] = "mathPlus";
    ShapeType["moon"] = "moon";
    ShapeType["noSmoking"] = "noSmoking";
    ShapeType["nonIsoscelesTrapezoid"] = "nonIsoscelesTrapezoid";
    ShapeType["notchedRightArrow"] = "notchedRightArrow";
    ShapeType["octagon"] = "octagon";
    ShapeType["parallelogram"] = "parallelogram";
    ShapeType["pentagon"] = "pentagon";
    ShapeType["pie"] = "pie";
    ShapeType["pieWedge"] = "pieWedge";
    ShapeType["plaque"] = "plaque";
    ShapeType["plaqueTabs"] = "plaqueTabs";
    ShapeType["plus"] = "plus";
    ShapeType["quadArrow"] = "quadArrow";
    ShapeType["quadArrowCallout"] = "quadArrowCallout";
    ShapeType["rect"] = "rect";
    ShapeType["ribbon"] = "ribbon";
    ShapeType["ribbon2"] = "ribbon2";
    ShapeType["rightArrow"] = "rightArrow";
    ShapeType["rightArrowCallout"] = "rightArrowCallout";
    ShapeType["rightBrace"] = "rightBrace";
    ShapeType["rightBracket"] = "rightBracket";
    ShapeType["round1Rect"] = "round1Rect";
    ShapeType["round2DiagRect"] = "round2DiagRect";
    ShapeType["round2SameRect"] = "round2SameRect";
    ShapeType["roundRect"] = "roundRect";
    ShapeType["rtTriangle"] = "rtTriangle";
    ShapeType["smileyFace"] = "smileyFace";
    ShapeType["snip1Rect"] = "snip1Rect";
    ShapeType["snip2DiagRect"] = "snip2DiagRect";
    ShapeType["snip2SameRect"] = "snip2SameRect";
    ShapeType["snipRoundRect"] = "snipRoundRect";
    ShapeType["squareTabs"] = "squareTabs";
    ShapeType["star10"] = "star10";
    ShapeType["star12"] = "star12";
    ShapeType["star16"] = "star16";
    ShapeType["star24"] = "star24";
    ShapeType["star32"] = "star32";
    ShapeType["star4"] = "star4";
    ShapeType["star5"] = "star5";
    ShapeType["star6"] = "star6";
    ShapeType["star7"] = "star7";
    ShapeType["star8"] = "star8";
    ShapeType["stripedRightArrow"] = "stripedRightArrow";
    ShapeType["sun"] = "sun";
    ShapeType["swooshArrow"] = "swooshArrow";
    ShapeType["teardrop"] = "teardrop";
    ShapeType["trapezoid"] = "trapezoid";
    ShapeType["triangle"] = "triangle";
    ShapeType["upArrow"] = "upArrow";
    ShapeType["upArrowCallout"] = "upArrowCallout";
    ShapeType["upDownArrow"] = "upDownArrow";
    ShapeType["upDownArrowCallout"] = "upDownArrowCallout";
    ShapeType["uturnArrow"] = "uturnArrow";
    ShapeType["verticalScroll"] = "verticalScroll";
    ShapeType["wave"] = "wave";
    ShapeType["wedgeEllipseCallout"] = "wedgeEllipseCallout";
    ShapeType["wedgeRectCallout"] = "wedgeRectCallout";
    ShapeType["wedgeRoundRectCallout"] = "wedgeRoundRectCallout";
})(ShapeType || (ShapeType = {}));
/**
 * TODO: FUTURE: v4.0: rename to `ThemeColor`
 */
var SchemeColor;
(function (SchemeColor) {
    SchemeColor["text1"] = "tx1";
    SchemeColor["text2"] = "tx2";
    SchemeColor["background1"] = "bg1";
    SchemeColor["background2"] = "bg2";
    SchemeColor["accent1"] = "accent1";
    SchemeColor["accent2"] = "accent2";
    SchemeColor["accent3"] = "accent3";
    SchemeColor["accent4"] = "accent4";
    SchemeColor["accent5"] = "accent5";
    SchemeColor["accent6"] = "accent6";
})(SchemeColor || (SchemeColor = {}));
var AlignH;
(function (AlignH) {
    AlignH["left"] = "left";
    AlignH["center"] = "center";
    AlignH["right"] = "right";
    AlignH["justify"] = "justify";
})(AlignH || (AlignH = {}));
var AlignV;
(function (AlignV) {
    AlignV["top"] = "top";
    AlignV["middle"] = "middle";
    AlignV["bottom"] = "bottom";
})(AlignV || (AlignV = {}));
var SHAPE_TYPE;
(function (SHAPE_TYPE) {
    SHAPE_TYPE["ACTION_BUTTON_BACK_OR_PREVIOUS"] = "actionButtonBackPrevious";
    SHAPE_TYPE["ACTION_BUTTON_BEGINNING"] = "actionButtonBeginning";
    SHAPE_TYPE["ACTION_BUTTON_CUSTOM"] = "actionButtonBlank";
    SHAPE_TYPE["ACTION_BUTTON_DOCUMENT"] = "actionButtonDocument";
    SHAPE_TYPE["ACTION_BUTTON_END"] = "actionButtonEnd";
    SHAPE_TYPE["ACTION_BUTTON_FORWARD_OR_NEXT"] = "actionButtonForwardNext";
    SHAPE_TYPE["ACTION_BUTTON_HELP"] = "actionButtonHelp";
    SHAPE_TYPE["ACTION_BUTTON_HOME"] = "actionButtonHome";
    SHAPE_TYPE["ACTION_BUTTON_INFORMATION"] = "actionButtonInformation";
    SHAPE_TYPE["ACTION_BUTTON_MOVIE"] = "actionButtonMovie";
    SHAPE_TYPE["ACTION_BUTTON_RETURN"] = "actionButtonReturn";
    SHAPE_TYPE["ACTION_BUTTON_SOUND"] = "actionButtonSound";
    SHAPE_TYPE["ARC"] = "arc";
    SHAPE_TYPE["BALLOON"] = "wedgeRoundRectCallout";
    SHAPE_TYPE["BENT_ARROW"] = "bentArrow";
    SHAPE_TYPE["BENT_UP_ARROW"] = "bentUpArrow";
    SHAPE_TYPE["BEVEL"] = "bevel";
    SHAPE_TYPE["BLOCK_ARC"] = "blockArc";
    SHAPE_TYPE["CAN"] = "can";
    SHAPE_TYPE["CHART_PLUS"] = "chartPlus";
    SHAPE_TYPE["CHART_STAR"] = "chartStar";
    SHAPE_TYPE["CHART_X"] = "chartX";
    SHAPE_TYPE["CHEVRON"] = "chevron";
    SHAPE_TYPE["CHORD"] = "chord";
    SHAPE_TYPE["CIRCULAR_ARROW"] = "circularArrow";
    SHAPE_TYPE["CLOUD"] = "cloud";
    SHAPE_TYPE["CLOUD_CALLOUT"] = "cloudCallout";
    SHAPE_TYPE["CORNER"] = "corner";
    SHAPE_TYPE["CORNER_TABS"] = "cornerTabs";
    SHAPE_TYPE["CROSS"] = "plus";
    SHAPE_TYPE["CUBE"] = "cube";
    SHAPE_TYPE["CURVED_DOWN_ARROW"] = "curvedDownArrow";
    SHAPE_TYPE["CURVED_DOWN_RIBBON"] = "ellipseRibbon";
    SHAPE_TYPE["CURVED_LEFT_ARROW"] = "curvedLeftArrow";
    SHAPE_TYPE["CURVED_RIGHT_ARROW"] = "curvedRightArrow";
    SHAPE_TYPE["CURVED_UP_ARROW"] = "curvedUpArrow";
    SHAPE_TYPE["CURVED_UP_RIBBON"] = "ellipseRibbon2";
    SHAPE_TYPE["CUSTOM_GEOMETRY"] = "custGeom";
    SHAPE_TYPE["DECAGON"] = "decagon";
    SHAPE_TYPE["DIAGONAL_STRIPE"] = "diagStripe";
    SHAPE_TYPE["DIAMOND"] = "diamond";
    SHAPE_TYPE["DODECAGON"] = "dodecagon";
    SHAPE_TYPE["DONUT"] = "donut";
    SHAPE_TYPE["DOUBLE_BRACE"] = "bracePair";
    SHAPE_TYPE["DOUBLE_BRACKET"] = "bracketPair";
    SHAPE_TYPE["DOUBLE_WAVE"] = "doubleWave";
    SHAPE_TYPE["DOWN_ARROW"] = "downArrow";
    SHAPE_TYPE["DOWN_ARROW_CALLOUT"] = "downArrowCallout";
    SHAPE_TYPE["DOWN_RIBBON"] = "ribbon";
    SHAPE_TYPE["EXPLOSION1"] = "irregularSeal1";
    SHAPE_TYPE["EXPLOSION2"] = "irregularSeal2";
    SHAPE_TYPE["FLOWCHART_ALTERNATE_PROCESS"] = "flowChartAlternateProcess";
    SHAPE_TYPE["FLOWCHART_CARD"] = "flowChartPunchedCard";
    SHAPE_TYPE["FLOWCHART_COLLATE"] = "flowChartCollate";
    SHAPE_TYPE["FLOWCHART_CONNECTOR"] = "flowChartConnector";
    SHAPE_TYPE["FLOWCHART_DATA"] = "flowChartInputOutput";
    SHAPE_TYPE["FLOWCHART_DECISION"] = "flowChartDecision";
    SHAPE_TYPE["FLOWCHART_DELAY"] = "flowChartDelay";
    SHAPE_TYPE["FLOWCHART_DIRECT_ACCESS_STORAGE"] = "flowChartMagneticDrum";
    SHAPE_TYPE["FLOWCHART_DISPLAY"] = "flowChartDisplay";
    SHAPE_TYPE["FLOWCHART_DOCUMENT"] = "flowChartDocument";
    SHAPE_TYPE["FLOWCHART_EXTRACT"] = "flowChartExtract";
    SHAPE_TYPE["FLOWCHART_INTERNAL_STORAGE"] = "flowChartInternalStorage";
    SHAPE_TYPE["FLOWCHART_MAGNETIC_DISK"] = "flowChartMagneticDisk";
    SHAPE_TYPE["FLOWCHART_MANUAL_INPUT"] = "flowChartManualInput";
    SHAPE_TYPE["FLOWCHART_MANUAL_OPERATION"] = "flowChartManualOperation";
    SHAPE_TYPE["FLOWCHART_MERGE"] = "flowChartMerge";
    SHAPE_TYPE["FLOWCHART_MULTIDOCUMENT"] = "flowChartMultidocument";
    SHAPE_TYPE["FLOWCHART_OFFLINE_STORAGE"] = "flowChartOfflineStorage";
    SHAPE_TYPE["FLOWCHART_OFFPAGE_CONNECTOR"] = "flowChartOffpageConnector";
    SHAPE_TYPE["FLOWCHART_OR"] = "flowChartOr";
    SHAPE_TYPE["FLOWCHART_PREDEFINED_PROCESS"] = "flowChartPredefinedProcess";
    SHAPE_TYPE["FLOWCHART_PREPARATION"] = "flowChartPreparation";
    SHAPE_TYPE["FLOWCHART_PROCESS"] = "flowChartProcess";
    SHAPE_TYPE["FLOWCHART_PUNCHED_TAPE"] = "flowChartPunchedTape";
    SHAPE_TYPE["FLOWCHART_SEQUENTIAL_ACCESS_STORAGE"] = "flowChartMagneticTape";
    SHAPE_TYPE["FLOWCHART_SORT"] = "flowChartSort";
    SHAPE_TYPE["FLOWCHART_STORED_DATA"] = "flowChartOnlineStorage";
    SHAPE_TYPE["FLOWCHART_SUMMING_JUNCTION"] = "flowChartSummingJunction";
    SHAPE_TYPE["FLOWCHART_TERMINATOR"] = "flowChartTerminator";
    SHAPE_TYPE["FOLDED_CORNER"] = "folderCorner";
    SHAPE_TYPE["FRAME"] = "frame";
    SHAPE_TYPE["FUNNEL"] = "funnel";
    SHAPE_TYPE["GEAR_6"] = "gear6";
    SHAPE_TYPE["GEAR_9"] = "gear9";
    SHAPE_TYPE["HALF_FRAME"] = "halfFrame";
    SHAPE_TYPE["HEART"] = "heart";
    SHAPE_TYPE["HEPTAGON"] = "heptagon";
    SHAPE_TYPE["HEXAGON"] = "hexagon";
    SHAPE_TYPE["HORIZONTAL_SCROLL"] = "horizontalScroll";
    SHAPE_TYPE["ISOSCELES_TRIANGLE"] = "triangle";
    SHAPE_TYPE["LEFT_ARROW"] = "leftArrow";
    SHAPE_TYPE["LEFT_ARROW_CALLOUT"] = "leftArrowCallout";
    SHAPE_TYPE["LEFT_BRACE"] = "leftBrace";
    SHAPE_TYPE["LEFT_BRACKET"] = "leftBracket";
    SHAPE_TYPE["LEFT_CIRCULAR_ARROW"] = "leftCircularArrow";
    SHAPE_TYPE["LEFT_RIGHT_ARROW"] = "leftRightArrow";
    SHAPE_TYPE["LEFT_RIGHT_ARROW_CALLOUT"] = "leftRightArrowCallout";
    SHAPE_TYPE["LEFT_RIGHT_CIRCULAR_ARROW"] = "leftRightCircularArrow";
    SHAPE_TYPE["LEFT_RIGHT_RIBBON"] = "leftRightRibbon";
    SHAPE_TYPE["LEFT_RIGHT_UP_ARROW"] = "leftRightUpArrow";
    SHAPE_TYPE["LEFT_UP_ARROW"] = "leftUpArrow";
    SHAPE_TYPE["LIGHTNING_BOLT"] = "lightningBolt";
    SHAPE_TYPE["LINE_CALLOUT_1"] = "borderCallout1";
    SHAPE_TYPE["LINE_CALLOUT_1_ACCENT_BAR"] = "accentCallout1";
    SHAPE_TYPE["LINE_CALLOUT_1_BORDER_AND_ACCENT_BAR"] = "accentBorderCallout1";
    SHAPE_TYPE["LINE_CALLOUT_1_NO_BORDER"] = "callout1";
    SHAPE_TYPE["LINE_CALLOUT_2"] = "borderCallout2";
    SHAPE_TYPE["LINE_CALLOUT_2_ACCENT_BAR"] = "accentCallout2";
    SHAPE_TYPE["LINE_CALLOUT_2_BORDER_AND_ACCENT_BAR"] = "accentBorderCallout2";
    SHAPE_TYPE["LINE_CALLOUT_2_NO_BORDER"] = "callout2";
    SHAPE_TYPE["LINE_CALLOUT_3"] = "borderCallout3";
    SHAPE_TYPE["LINE_CALLOUT_3_ACCENT_BAR"] = "accentCallout3";
    SHAPE_TYPE["LINE_CALLOUT_3_BORDER_AND_ACCENT_BAR"] = "accentBorderCallout3";
    SHAPE_TYPE["LINE_CALLOUT_3_NO_BORDER"] = "callout3";
    SHAPE_TYPE["LINE_CALLOUT_4"] = "borderCallout3";
    SHAPE_TYPE["LINE_CALLOUT_4_ACCENT_BAR"] = "accentCallout3";
    SHAPE_TYPE["LINE_CALLOUT_4_BORDER_AND_ACCENT_BAR"] = "accentBorderCallout3";
    SHAPE_TYPE["LINE_CALLOUT_4_NO_BORDER"] = "callout3";
    SHAPE_TYPE["LINE"] = "line";
    SHAPE_TYPE["LINE_INVERSE"] = "lineInv";
    SHAPE_TYPE["MATH_DIVIDE"] = "mathDivide";
    SHAPE_TYPE["MATH_EQUAL"] = "mathEqual";
    SHAPE_TYPE["MATH_MINUS"] = "mathMinus";
    SHAPE_TYPE["MATH_MULTIPLY"] = "mathMultiply";
    SHAPE_TYPE["MATH_NOT_EQUAL"] = "mathNotEqual";
    SHAPE_TYPE["MATH_PLUS"] = "mathPlus";
    SHAPE_TYPE["MOON"] = "moon";
    SHAPE_TYPE["NON_ISOSCELES_TRAPEZOID"] = "nonIsoscelesTrapezoid";
    SHAPE_TYPE["NOTCHED_RIGHT_ARROW"] = "notchedRightArrow";
    SHAPE_TYPE["NO_SYMBOL"] = "noSmoking";
    SHAPE_TYPE["OCTAGON"] = "octagon";
    SHAPE_TYPE["OVAL"] = "ellipse";
    SHAPE_TYPE["OVAL_CALLOUT"] = "wedgeEllipseCallout";
    SHAPE_TYPE["PARALLELOGRAM"] = "parallelogram";
    SHAPE_TYPE["PENTAGON"] = "homePlate";
    SHAPE_TYPE["PIE"] = "pie";
    SHAPE_TYPE["PIE_WEDGE"] = "pieWedge";
    SHAPE_TYPE["PLAQUE"] = "plaque";
    SHAPE_TYPE["PLAQUE_TABS"] = "plaqueTabs";
    SHAPE_TYPE["QUAD_ARROW"] = "quadArrow";
    SHAPE_TYPE["QUAD_ARROW_CALLOUT"] = "quadArrowCallout";
    SHAPE_TYPE["RECTANGLE"] = "rect";
    SHAPE_TYPE["RECTANGULAR_CALLOUT"] = "wedgeRectCallout";
    SHAPE_TYPE["REGULAR_PENTAGON"] = "pentagon";
    SHAPE_TYPE["RIGHT_ARROW"] = "rightArrow";
    SHAPE_TYPE["RIGHT_ARROW_CALLOUT"] = "rightArrowCallout";
    SHAPE_TYPE["RIGHT_BRACE"] = "rightBrace";
    SHAPE_TYPE["RIGHT_BRACKET"] = "rightBracket";
    SHAPE_TYPE["RIGHT_TRIANGLE"] = "rtTriangle";
    SHAPE_TYPE["ROUNDED_RECTANGLE"] = "roundRect";
    SHAPE_TYPE["ROUNDED_RECTANGULAR_CALLOUT"] = "wedgeRoundRectCallout";
    SHAPE_TYPE["ROUND_1_RECTANGLE"] = "round1Rect";
    SHAPE_TYPE["ROUND_2_DIAG_RECTANGLE"] = "round2DiagRect";
    SHAPE_TYPE["ROUND_2_SAME_RECTANGLE"] = "round2SameRect";
    SHAPE_TYPE["SMILEY_FACE"] = "smileyFace";
    SHAPE_TYPE["SNIP_1_RECTANGLE"] = "snip1Rect";
    SHAPE_TYPE["SNIP_2_DIAG_RECTANGLE"] = "snip2DiagRect";
    SHAPE_TYPE["SNIP_2_SAME_RECTANGLE"] = "snip2SameRect";
    SHAPE_TYPE["SNIP_ROUND_RECTANGLE"] = "snipRoundRect";
    SHAPE_TYPE["SQUARE_TABS"] = "squareTabs";
    SHAPE_TYPE["STAR_10_POINT"] = "star10";
    SHAPE_TYPE["STAR_12_POINT"] = "star12";
    SHAPE_TYPE["STAR_16_POINT"] = "star16";
    SHAPE_TYPE["STAR_24_POINT"] = "star24";
    SHAPE_TYPE["STAR_32_POINT"] = "star32";
    SHAPE_TYPE["STAR_4_POINT"] = "star4";
    SHAPE_TYPE["STAR_5_POINT"] = "star5";
    SHAPE_TYPE["STAR_6_POINT"] = "star6";
    SHAPE_TYPE["STAR_7_POINT"] = "star7";
    SHAPE_TYPE["STAR_8_POINT"] = "star8";
    SHAPE_TYPE["STRIPED_RIGHT_ARROW"] = "stripedRightArrow";
    SHAPE_TYPE["SUN"] = "sun";
    SHAPE_TYPE["SWOOSH_ARROW"] = "swooshArrow";
    SHAPE_TYPE["TEAR"] = "teardrop";
    SHAPE_TYPE["TRAPEZOID"] = "trapezoid";
    SHAPE_TYPE["UP_ARROW"] = "upArrow";
    SHAPE_TYPE["UP_ARROW_CALLOUT"] = "upArrowCallout";
    SHAPE_TYPE["UP_DOWN_ARROW"] = "upDownArrow";
    SHAPE_TYPE["UP_DOWN_ARROW_CALLOUT"] = "upDownArrowCallout";
    SHAPE_TYPE["UP_RIBBON"] = "ribbon2";
    SHAPE_TYPE["U_TURN_ARROW"] = "uturnArrow";
    SHAPE_TYPE["VERTICAL_SCROLL"] = "verticalScroll";
    SHAPE_TYPE["WAVE"] = "wave";
})(SHAPE_TYPE || (SHAPE_TYPE = {}));
var CHART_TYPE;
(function (CHART_TYPE) {
    CHART_TYPE["AREA"] = "area";
    CHART_TYPE["BAR"] = "bar";
    CHART_TYPE["BAR3D"] = "bar3D";
    CHART_TYPE["BUBBLE"] = "bubble";
    CHART_TYPE["BUBBLE3D"] = "bubble3D";
    CHART_TYPE["DOUGHNUT"] = "doughnut";
    CHART_TYPE["LINE"] = "line";
    CHART_TYPE["PIE"] = "pie";
    CHART_TYPE["RADAR"] = "radar";
    CHART_TYPE["SCATTER"] = "scatter";
})(CHART_TYPE || (CHART_TYPE = {}));
var SCHEME_COLOR_NAMES;
(function (SCHEME_COLOR_NAMES) {
    SCHEME_COLOR_NAMES["TEXT1"] = "tx1";
    SCHEME_COLOR_NAMES["TEXT2"] = "tx2";
    SCHEME_COLOR_NAMES["BACKGROUND1"] = "bg1";
    SCHEME_COLOR_NAMES["BACKGROUND2"] = "bg2";
    SCHEME_COLOR_NAMES["ACCENT1"] = "accent1";
    SCHEME_COLOR_NAMES["ACCENT2"] = "accent2";
    SCHEME_COLOR_NAMES["ACCENT3"] = "accent3";
    SCHEME_COLOR_NAMES["ACCENT4"] = "accent4";
    SCHEME_COLOR_NAMES["ACCENT5"] = "accent5";
    SCHEME_COLOR_NAMES["ACCENT6"] = "accent6";
})(SCHEME_COLOR_NAMES || (SCHEME_COLOR_NAMES = {}));
var MASTER_OBJECTS;
(function (MASTER_OBJECTS) {
    MASTER_OBJECTS["chart"] = "chart";
    MASTER_OBJECTS["image"] = "image";
    MASTER_OBJECTS["line"] = "line";
    MASTER_OBJECTS["rect"] = "rect";
    MASTER_OBJECTS["text"] = "text";
    MASTER_OBJECTS["placeholder"] = "placeholder";
})(MASTER_OBJECTS || (MASTER_OBJECTS = {}));
var SLIDE_OBJECT_TYPES;
(function (SLIDE_OBJECT_TYPES) {
    SLIDE_OBJECT_TYPES["chart"] = "chart";
    SLIDE_OBJECT_TYPES["hyperlink"] = "hyperlink";
    SLIDE_OBJECT_TYPES["image"] = "image";
    SLIDE_OBJECT_TYPES["media"] = "media";
    SLIDE_OBJECT_TYPES["online"] = "online";
    SLIDE_OBJECT_TYPES["placeholder"] = "placeholder";
    SLIDE_OBJECT_TYPES["table"] = "table";
    SLIDE_OBJECT_TYPES["tablecell"] = "tablecell";
    SLIDE_OBJECT_TYPES["text"] = "text";
    SLIDE_OBJECT_TYPES["notes"] = "notes";
})(SLIDE_OBJECT_TYPES || (SLIDE_OBJECT_TYPES = {}));
var PLACEHOLDER_TYPES;
(function (PLACEHOLDER_TYPES) {
    PLACEHOLDER_TYPES["title"] = "title";
    PLACEHOLDER_TYPES["body"] = "body";
    PLACEHOLDER_TYPES["image"] = "pic";
    PLACEHOLDER_TYPES["chart"] = "chart";
    PLACEHOLDER_TYPES["table"] = "tbl";
    PLACEHOLDER_TYPES["media"] = "media";
})(PLACEHOLDER_TYPES || (PLACEHOLDER_TYPES = {}));
/**
 * NOTE: 20170304: BULLET_TYPES: Only default is used so far. I'd like to combine the two pieces of code that use these before implementing these as options
 * Since we close <p> within the text object bullets, its slightly more difficult than combining into a func and calling to get the paraProp
 * and i'm not sure if anyone will even use these... so, skipping for now.
 */
var BULLET_TYPES;
(function (BULLET_TYPES) {
    BULLET_TYPES["DEFAULT"] = "&#x2022;";
    BULLET_TYPES["CHECK"] = "&#x2713;";
    BULLET_TYPES["STAR"] = "&#x2605;";
    BULLET_TYPES["TRIANGLE"] = "&#x25B6;";
})(BULLET_TYPES || (BULLET_TYPES = {}));
// IMAGES (base64)
var IMG_BROKEN = 'data:image/png;base64,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';
var IMG_PLAYBTN = 'data:image/png;base64,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AAAAAACAlFAAAwAAAAAAAKSEAhgAAAAAAAAgJRTAAAAAAAAAACmhAAYAAAAAAABICQUwAAAAAAAAQEoogAEAAAAAAABSQgEMAAAAAAAAkBIKYAAAAAAAAICUUAADAAAAAAAApIQCGAAAAAAAACAlFMAAAAAAAAAAKaEABgAAAAAAAEgJBTAAAAAAAABASiiAAQAAAAAAAFJCAQwAAAAAAACQEgpgAAAAAAAAgJRQAAMAAAAAAACkhAIYAAAAAAAAICUUwAAAAAAAAAApoQAGAAAAAAAASAkFMAAAAAAAAEBKKIABAAAAAAAAUkIBDAAAAAAAAJASCmAAAAAAAACAlFAAAwAAAAAAAKSEAhgAAAAAAAAgJRTAAAAAAAAAACmhAAYAAAAAAABICQUwAAAAAAAAQEoogAEAAAAAAABSQgEMAAAAAAAAkBIKYAAAAAAAAICUUAADAAAAAAAApIQCGAAAAAAAACAlFMAAAAAAAAAAKaEABgAAAAAAAEgJBTAAAAAAAABASiiAAQAAAAAAAFJCAQwAAAAAAACQEgpgAAAAAAAAgJRQAAMAAAAAAACkhAIYAAAAAAAAICUUwAAAAAAAAAApoQAGAAAAAAAASAkFMAAAAAAAAEBKKIABAAAAAAAAUkIBDAAAAAAAAJASCmAAAAAAAACAlFAAAwAAAAAAAKSEAhgAAAAAAAAgJRTAAAAAAAAAACmhAAYAAAAAAABICQUwAAAAAAAAQEoogAEAAAAAAABSQgEMAAAAAAAAkBIKYAAAAAAAAICUUAADAAAAAAAApIQCGAAAAAAAACAlFMAAAAAAAAAAKaEABgAAAAAAAEgJBTAAAAAAAABASiiAAQAAAAAAAFJCAQwAAAAAAACQEgpgAAAAAAAAgJRQAAMAAAAAAACkhAIYAAAAAAAAICUUwAAAAAAAAAApoQAGAAAAAAAASAkFMAAAAAAAAEBKKIABAAAAAAAAUkIBDAAAAAAAAJASCmAAAAAAAACAlFAAAwAAAAAAAKSEAhgAAAAAAAAgJRTAAAAAAAAAACmhAAYAAAAAAABICQUwAAAAAAAAQEoogAEAAAAAAABSQgEMAAAAAAAAkBIKYAAAAAAAAICUUAADAAAAAAAApIQCGAAAAAAAACAlFMAAAAAAAAAAKaEABgAAAAAAAEgJBTAAAAAAAABASiiAAQAAAAAAAFJCAQwAAAAAAACQEgpgAAAAAAAAgJRQAAMAAAAAAACkhAIYAAAAAAAAICUUwAAAAAAAAAApoQAGAAAAAAAASAkFMAAAAAAAAEBKKIABAAAAAAAAUkIBDAAAAAAAAJASCmAAAAAAAACAlFAAAwAAAAAAAKSEAhgAAAAAAAAgJRTAAAAAAAAAACmhAAYAAAAAAABICQUwAAAAAAAAQEoogAEAAAAAAABSQgEMAAAAAAAAkBIKYAAAAAAAAICUUAADAAAAAAAApIQCGAAAAAAAACAlFMAAAAAAAAAAKaEABgAAAAAAAEgJBTAAAAAAAABASiiAAQAAAAAAAFJCAQwAAAAAAACQEgpgAAAAAAAAgJRQAAMAAAAAAACkhAIYAAAAAAAAICUUwAAAAAAAAAApoQAGAAAAAAAASAkFMAAAAAAAAEBKKIABAAAAAAAAUkIBDAAAAAAAAJASCmAAAAAAAACAlFAAAwAAAAAAAKSEAhgAAAAAAAAgJRTAAAAAAAAAACmhAAYAAAAAAABICQUwAAAAAAAAQEoogAEAAAAAAABSQgEMAAAAAAAAkBIKYAAAAAAAAICUUAADAAAAAAAApIQCGAAAAAAAACAlFMAAAAAAAAAAKaEABgAAAAAAAEgJBTAAAAAAAABASiiAAQAAAAAAAFJCAQwAAAAAAACQEgpgAAAAAAAAgJRQAAMAAAAAAACkhAIYAAAAAAAAICUUwAAAAAAAAAApoQAGAAAAAAAASAkFMAAAAAAAAEBKKIABAAAAAAAAUkIBDAAAAAAAAJASCmAAAAAAAACAlFAAAwAAAAAAAKSEAhgAAAAAAAAgJRTAAAAAAAAAACmhAAYAAAAAAABICQUwAAAAAAAAQEoogAEAAAAAAABSQgEMAAAAAAAAkBIKYAAAAAAAAICUUAADAAAAAAAApIQCGAAAAAAAACAlFMAAAAAAAAAAKaEABgAAAAAAAEgJBTAAAAAAAABASiiAAQAAAAAAAFJCAQwAAAAAAACQEgpgAAAAAAAAgJRQAAMAAAAAAACkhAIYAAAAAAAAICUUwAAAAAAAAAApoQAGAAAAAAAASAkFMAAAAAAAAEBKKIABAAAAAAAAUkIBDAAAAAAAAJASCmAAAAAAAACAlFAAAwAAAAAAAKSEAhgAAAAAAAAgJRTAAAAAAAAAACmhAAYAAAAAAABICQUwAAAAAAAAQEoogAEAAAAAAABSQgEMAAAAAAAAkBIKYAAAAAAAAICUUAADAAAAAAAApIQCGAAAAAAAACAlFMAAAAAAAAAAKaEABgAAAAAAAEgJBTAAAAAAAABASiiAAQAAAAAAAFJCAQwAAAAAAACQEgpgAAAAAAAAgJRQAAMAAAAAAACkhAIYAAAAAAAAICUUwAAAAAAAAAApoQAGAAAAAAAASAkFMAAAAAAAAEBKKIABAAAAAAAAUkIBDAAAAAAAAJASCmAAAAAAAACAlFAAAwAAAAAAAKSEAhgAAAAAAAAgJRTAAAAAAAAAACmhAAYAAAAAAABICQUwAAAAAAAAQEoogAEAAAAAAABSQgEMAAAAAAAAkBIKYAAAAAAAAICUUAADAAAAAAAApIQCGAAAAAAAACAlFMAAAAAAAAAAKaEABgAAAAAAAEgJBTAAAAAAAABASiiAAQAAAAAAAFJCAQwAAAAAAACQEgpgAAAAAAAAgJRQAAMAAAAAAACkhAIYAAAAAAAAICUUwAAAAAAAAAApoQAGAAAAAAAASAkFMAAAAAAAAEBKKIABAAAAAAAAUkIBDAAAAAAAAJASCmAAAAAAAACAlFAAAwAAAAAAAKREkRUAAACwrUpLSwuGDRvWfMCAAS26du3avKysrLiioqKkZcuWzZs1a1bcvHnz0tLS0rJsNtusuLi4ebNmzUoLCgo+8/eijY2N9Zs3b66pra2tqqur21xTU1NdVVVVs2nTptqNGzdWbdiwoeYvf/nL5hUrVlQtWLBgw6xZs6pqamoaJQYAAEDaKYABAACIiIghQ4aUHnTQQW379u3bql27dq3at2/fpkWLFq2bN29eWVpa2qpZs2bNCwsLm2ez2fLCwsLyoqKi8sLCwtKknK+hoaG6vr6+qqGh4S91dXV/aWhoqNq8eXNVTU3NuqqqqvUbNmxYu2rVqjWrV69e99Zbb6177rnnPpgzZ06NTwYAAABJogAGAADIA8OGDWt+xBFHdBwwYECnLl26dGjdunXHFi1adCgtLe1YUlLSvlmzZq0KCgqK07yDwsLCssLCwrKIaPdp/zuNjY21mzdvXrdp06ZVNTU172/YsGHl2rVr31+2bNnKBQsWrHjyySffnzVrVpVPGAAAAE1Fpuexsd9HfaF+ZcSal0ptCAAAIAE6deqUPf744zvtueeeXbp3796lbdu2XSorKzuXlpZ2KS0t7VBYWFhhSztGQ0PDxpqampU1NTXL169fv+yDDz5Y9s477yybPXv2sj/96U8rVqxYUWdLAAAAbE9t9q6Jog4f/TUFMAAAQEJks9nMt7/97Y4jRozo1bdv397t2rXrXl5e3rWsrKxzcXFx+4gosKUmp7G2tnZVTU3Nso0bNy5btWrV0tdff/2tJ598cvG999672noAAADYFgpgAACAhPne977X6a9Fb/v27Xu1bNmyV1lZWa8kvXOXLauvr9/wl7/8ZdG6desWL1u2bNHChQsX/fGPf1w8derUjbYDAADAliiAAQAAmqhsNps59dRTuxx66KH9+/Tp87n27dv3Ly8v719UVOSRzXlq06ZNKzZu3Pj6+++//8abb775xqOPPvrG3XffvcpmAAAA+CsFMAAAQBNx6qmndvniF784qHfv3v3btWv3uYqKis8VFhaW2wxbUl9fv37Dhg1vfPDBB68vXrz4jccee2z+jTfeuNxmAAAA8pMCGAAAYBc45phjWn/rW9/aq3///kPatGnTv6Kiop9HOLO9NDQ0VG/cuPGtNWvWLFy4cOGcO+6445WHHnporc0AAACknwIYAABgJzjjjDO6f+lLX9qrV69eg1u3bj2orKysR0RkbIadJFddXb103bp18xcvXjz30UcffeXqq69+x1oAAADSRwEMAACwnZWWlhb86le/2u3QQw8d1r17931btmw5qLCwsMxmaEoaGhqqP/zww/nvvPPOzGeeeWbW2LFj36ipqWm0GQAAgGRTAAMAAGwHP/7xj7t+9atf3bdXr15D27Ztu1c2m21jKyRJXV3dmg8++OCVRYsWvfznP/95xh/+8IdltgIAAJA8CmAAAIBtcOKJJ7Y75ZRTDujXr9+w1q1bD81ms61shTSpq6tbt3bt2pfffPPNWbfccsvUe++9d7WtAAAANH0KYAAAgE+hoqKi4IILLhg0YsSI/bp27bpfy5YtB2YymUKbIR/kcrmGDz/8cP6777474/nnn59x4YUXvrZx40aPiwYAAGiCFMAAAAAf4/jjj2/7/e9//8D+/fsf2Lp1630KCgpKbAUiGhsbN61fv37eW2+9NeWGG2545u67715lKwAAAE2DAhgAAOB/ZLPZzAUXXPC5I4888sDu3bsfWFFRsVtEFNgMbFl1dfWSd999d8qsWbNmnnvuuS+vW7euwVYAAAB2DQUwAACQ10pLSwsuvfTSQYcccsjBXbt2HVFWVtbDVmDb1dbWrnr//fdfmDp16uRf/vKXL65evbreVgAAAHYeBTAAAJB3Bg0aVHrBBRd8fs899zywQ4cOBxQVFbWwFdj+Ghsba9euXTtrzpw5T59//vmTX3755WpbAQAA2LEUwAAAQF4YNmxY8/POO+/gIUOGHOZ9vrDz/W0ZfNFFFz07a9asKlsBAADY/hTAAABAarVq1arwyiuv3HfEiBEjO3TocFBhYWGZrcCu19DQUP3+++8/O2XKlIk/+clPZm7cuLHRVgAAALYPBTAAAJAqrVq1Kvztb3+7/3777Xd4x44dRxQWFpbbCjRdDQ0NG99///0pM2bMeOqHP/zhC8pgAACAz0YBDAAApMJZZ53V45vf/OaRvXr1GllaWtrVRiB5ampq3l28ePHEO++8c9LVV1/9jo0AAABsPQUwAACQWMOHDy+/6KKLvjB48OCjW7RoMdBGID0+/PDDV+fNmzfhvPPOe3L69Ol/sREAAIBPRwEMAAAkSqtWrQpvuOGGQ/bbb79/atOmzX6ZTCZrK5BeuVyubs2aNTNmzJjx2JgxYyavW7euwVYAAAA+ngIYAABIhB//+Mddv/e9732lZ8+e/1RcXNzWRiD/1NbWfvD2228/dssttzz029/+9l0bAQAA+L8UwAAAQJNVUVFRcO21137+4IMPPrZ169b7ZTKZAlsBIqJxzZo1M59//vnxp5122hR3BQMAAPx/CmAAAKDJOeWUUzqefvrpx/bu3ftL2Wy2jY0AH6e+vn7j0qVLH/vd7373x+uvv36ZjQAAAPlOAQwAADQJ2Ww2c+uttx5wyCGHnNC6deu9I8LdvsDWaFy7du1L06ZN+/OPfvSjZ1evXl1vJQAAQD5SAAMAALtU//79S6655pp/2nPPPY8tLy/vayPAZ1VTU7NswYIF488999wHp06dutFGAACAfKIABgAAdomf//znPU855ZQTu3btemRhYWGZjQDbW2NjY92KFSuevOWWW+689NJLF9kIAACQDxTAAADATuMxz8Cusn79+rlPP/30f5188slT6+rqcjYCAACklQIYAADY4fr27Vv8hz/84a+Pee5nI8CuUlNT8+68efPu/8EPfvDgwoULN9kIAACQNgpgAABghxkyZEjpNddc89XBgwefWFxc3MFGgKaitrZ21dy5c+/5yU9+8uc5c+bU2AgAAJAWWyqAPYoNAADYJqNHj+4wb968n06ZMuXRYcOGnaH8BZqa4uLi9sOGDTtjypQpj86bN++nJ510UntbAQAA0s4dwAAAwFY599xze33/+9//dufOnY/IZDJZGwGSIpfL1S1fvvzJG2644fbLLrvsbRsBAACSyiOgAQCAz+y8887r+53vfOfbHTt2PDyTyRTaCJBUuVyuYcWKFU/cdNNN//XrX/96sY0AAABJowAGAAC22WWXXTboG9/4xg9at249zDaAtFm7du2su++++9pzzjnnNdsAAACSQgEMAABsNcUvkE8UwQAAQJIogAEAgE9N8Qvks7Vr18665557rvv5z38+3zYAAICmaksFcGHlwOj6UV9orIqoWZG1PQAAyBO/+MUvet9xxx3nHHrooT8pLS3tYiNAPiotLe2y7777HvP973+/X1lZ2ZIpU6assxUAAKCpKetcHwXlH/01BTAAAOS5M844o/u99957zpe//OWflZeX94qIjK0AeS5TXl7e8+CDDx71/e9/v3dEvDVjxowPrQUAAGgqFMAAAMD/ceKJJ7a77777fjJq1Kh/KS8v7xOKX4B/lCkvL+99+OGHj/rWt77VfvXq1Qvnz59fbS0AAMCutqUC2DuAAQAgzwwdOrTs+uuvP6l///4nFRYWltkI20NjY2Ns2rQpqquro6amJurr62PTpk2xefPmqK+vj+rq6qivr4/NmzfHpk2boqGhYZv/fxUWFkZJSUk0a9YsioqKoqysLIqKiqJZs2ZRUlISRUVFUVpa+r9/FRQUCIjtoqGhoeq11167a8yYMffMmTOnxkYAAIBdZUvvAFYAAwBAnujUqVP2nnvuGbXXXnudnM1mK22Ej9PQ0BAbN26MDRs2/J+/Nm7cGBs3boyamprYtGlTbNq0KWpqaqK2trbJnqe4uDhKSkqitLT0f/9eUVERFRUV0aJFi//zV0VFRRQWFvog8LHq6urWvvjii7eceOKJf169enW9jQAAADubAhgAAPLcXXfdddAXv/jF00tLS7vZRn7L5XKxYcOGWLt2baxbty7Wrl37d3+tW7cuNmzYkPd7atGiRbRu3TpatWoVrVu3jjZt2vzvf27dunW0aNHCh4morq5e+sgjj1zzne98Z6ptAAAAO5MCGAAA8tTVV189+MQTTzyzoqJioG3kj8bGxli5cmUsX748Pvjgg1i9evX//n3t2rXR2NhoSZ9RYWFhtGrVKtq1axdt27b937937tw5OnTo4LHTeWbDhg3z77333qvOPPPMebYBAADsDApgAADIM1/72tfaXHrppad27979qIjQRKVUQ0NDrFq1KlasWBHvv//+//595cqVTfqRzGlXXFwcHTp0iI4dO0bnzp2jY8eO0alTp2jXrp1HS6dYLpdrfOeddx76+c9/fv2ECRPW2QgAALAjKYABACBP9OrVq9ldd931jT322OM7hYWFZTaSHh9++GG88847sXTp0njvvfdixYoVsXr16mhoaLCchCgsLIz27dtHp06dolu3btG9e/fo3r27x0mnTENDQ9W8efNu++Y3v/nHJUuWbLYRAABgR1AAAwBAHrjrrrtG/NM//dOZJSUlXWwj2davXx9Lly6Nd955539L3w8//NBiUqqysvJ/y+C//tWqVSuLSbiamppljz322G9Gjx49xTYAAIDtTQEMAAAp9qtf/arPD3/4w5+1atVqL9tIno0bN8aSJUvirbfeikWLFsV7770XmzZtspg8V1JSEl27do0+ffpE3759o3fv3lFeXm4xCbRu3bqXr7322ivGjh27yDYAAIDtRQEMAAApNGjQoNI77rjju7vttttJBQUFWRtJhtWrV8ebb74ZixcvjiVLlsTy5cujsbHRYtiigoKC6Ny5c/Tu3Tt69+4d/fr1i7Zt21pMQjQ2Nta98cYbd33rW9+6ff78+TU2AgAAfFYKYAAASJHS0tKCBx988Jj99tvvn7PZbBsbaboaGhri7bffjrfeeisWLFgQS5YscXcv201FRUX06tUr+vbtG3379o2ePXtGYWGhxTRhdXV1a2bMmHHjV77ylYdqamr85gcAALDNFMAAAJASp59+erdf/vKX51ZWVu5jG03T6tWr47XXXouFCxfGm2++GRs3brQUdooWLVpE3759Y8CAATFw4EB3CDdh69evf/E//uM//vPqq69+xzYAAIBtoQAGAICEGzRoUOm99977w969ex+byWTc4teErF+/PubNmxcLFiyIN954Q+FLk9GiRYvo169fDBgwIPbYY4+orKy0lCYkl8s1LF68eNyJJ554rcdCAwAAW0sBDAAACXbNNdcMOemkk35RVlbWyzZ2vVwuF++++27MnTs3XnvttViyZIl3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B7lcrm7y5Mm//vKXv/yIbQAAwK63pXcAK4ABAMg7paWlBTNnzjyzT58+x9vG39uwYUOMGzcuZsyY4VHPQF7KZDKx3377xde//vWoqKiwkH+waNGiP+27775X1dTUeCwEAADsQgpgAAD4H926dctOnjz5V506dRppG/9fLpeLqVOnxp///OfYuHGjhQB5r6KiIkaNGhX777+/x0L/g+XLlz9+6KGHXvLuu+/W2QYAAOwaWyqAvQMYAIC8MXz48PInnnjiynbt2o2wjf/vnXfeiWuvvTaee+652Lx5s4UARMTmzZtjzpw58dprr0XPnj2jRYsWlvI/Kioq+n7rW98aMnXq1Ofee+89f3AAAMAusKV3ACuAAQDIC9/+9rc73n777X9o0aLFANv4b1VVVXHXXXfFvffeG+vXr7cQgI+wbt26eP7552P9+vWx2267RVFRkaVERElJSefjjjvuoA8++GDKK6+88hcbAQCAnUsBDABAXjv//PP7XXzxxX8oKSnpbBv/bfr06XHttdfGokWLLAPgU3jnnXdi2rRp0bp16+jc2R8nERHZbLbyC1/4whElJSUvTp48eY2NAADAzqMABgAgb/3ud7/b60c/+tFVRUVFrWwjYs2aNXHzzTfHpEmTora21kIAtkJtbW289NJL8c4770Tfvn2jtLQ073dSWFhYNnz48C/26dNn4UMPPbTMpwQAAHYOBTAAAHnp1ltv3f+b3/zmfxYWFjbP913kcrl4/vnn4/rrr4/ly5f7cAB8BitXroxp06ZFRUVFdOvWLTKZTF7vo6CgIDto0KBDBw0atOiBBx54xycEAAB2vC0VwJmex8Z+H/WF+pURa17ym6wAACTTww8//KXDDjvsXzKZTN6/rPGDDz6I22+/Pd544w0fDIDtbMCAAfGtb30r2rRpk/e7yOVyjVOmTPn1yJEjH/LJAACAHavN3jVR1OGjv6YABgAgdV555ZXTPve5z30r3/fQ0NAQjz32WDz++ONRV1fngwGwg2Sz2Tj66KPjC1/4QhQUFOT9Pl5//fU79tprr9/7ZAAAwI6jAAYAIC9ks9nMyy+/fFafPn2Oz/ddvPvuu3HbbbfFe++954MBsJN069YtvvOd70S3bt3yfhdLliy5f5999rmypqam0ScDAAC2PwUwAACpV1paWjBr1qyzevfufVw+7yGXy8WTTz4ZDz74oLt+AXaBbDYbxxxzTBxxxBF5fzfw0qVLHxg6dOjlSmAAANj+FMAAAKRar169mk2ePHlsu3btDsrnPaxcuTJuueWWePvtt30oAHaxnj17ximnnBIdOnTI6z2sXr16yiGHHPIvS5Ys2exTAQAA28+WCuDCyoHR9aO+0FgVUbMia3sAADRpQ4cOLXvqqacub9Omzf75uoNcLhfPPPNMXH/99bF27VofCoAmYP369TFlypQoKSmJnj17RiaTycs9NG/evPtJJ500ZPLkyc+sWLHCoykAAGA7KetcHwXlH/01BTAAAIk1ZMiQ0kceeeSKVq1a7Z2vO6iuro7bb789nnjiiWhs9IRNgKaksbEx5s+fH++//34MGDAgstn8/DlLaWlpp6997WuDn3rqqadXrlxZ75MBAACfnQIYAIDUOfTQQ1s8+OCDv2/ZsuUe+bqDOXPmxNVXX+2RzwBN3PLly+OFF16Ijh075u0joUtLSzudcMIJ+7/00ktPv/3227U+FQAA8NkogAEASJVhw4Y1v++++37TsmXLQfl4/vr6+hg/fnz88Y9/jNpaP0MHSILNmzfHiy++GJs3b47ddtstCgoK8m4HxcXFbY866qg9n3vuuaeXL1/ucdAAAPAZKIABAEiNI488snLcuHG/b9GixcB8PP97770XV111VcyZM8eHASCBFi1aFC+//HL069cvWrRokXfnLykp6XDcccftP2fOnGcWLVq0yScCAAC2jQIYAIBUOPLIIyvvvPPO35aXl++Wj+d/+umn48Ybb4wPP/zQhwEgwf7yl7/ECy+8ECUlJdGrV6+8O3+zZs3aHHXUUfspgQEAYNspgAEASLxjjz227W233faH5s2b98m3s1dVVcXNN98cTz31VDQ2NvowAKRAY2NjzJ8/P5YtWxYDBgyIZs2a5dX5mzVr1uaYY4458M0333xm4cKFNT4RAACwdRTAAAAk2qGHHtritttuuzofy9+33347rrnmmli8eLEPAkAKvf/++/HKK69Enz59orKyMq/Ons1mK4888sh9Zs6c+dTSpUs3+zQAAMCnpwAGACCxjjjiiJb33nvvteXl5f3y6dy5XC4mTZoUN998c1RVVfkgAKRYVVVVTJ06NbLZbPTp0ycymUzenL24uLjtV7/61c+/8sorTy1evLjWpwEAAD4dBTAAAIl06KGHtrj33nt/l2/lb3V1ddx0000xefLkyOVyPggAeSCXy8WCBQvi3Xffjd133z2y2fz5mUyzZs1aH3300fvNmDHjSXcCAwDAp6MABgAgcYYOHVo2fvz4qysqKgbk07mXLVsWV111lUc+A+SplStXxiuvvBKf+9znoqKiIm/O3axZszZHH3300GeeeebJFStW1PkkAADAlimAAQBIlCFDhpQ++uij17Rs2XL3fDr31KlT49prr42NGzf6EADksaqqqpg+fXq0bds2unTpkjfnLikpaT9q1KihTz755JMrV66s90kAAICPt6UCuMB6AABoSjp16pSdMGHCv1dWVu6RL2dubGyMcePGxR133BF1dW56AiCitrY2br755hg/fnw0NjbmzbkrKyv3mDBhwr9369bNXQkAALCNFMAAADQZrVq1Kpw+ffolbdq02T9fzlxdXR2/+93vYtKkSd73C8DfyeVy8fjjj8fvf//7qK6uzptzt2nTZv8pU6Zc0qpVq0KfAgAA2HoKYAAAmoSKioqC2bNnX9KuXbuD8uXMS5cujYsuuijmz5/vAwDAx3r11VfjoosuiqVLl+bNmdu1a3fQ7Nmz/72iosLPrgAAYCu5iAYAoEmYOXPmz9q1a3dIvpz35ZdfjiuuuCLWrVsnfAA+0bp16+KKK66Il19+OW/O3K5du4Nnzpz5M+kDAMDWUQADALDLvfjii2N69OgxKh/Omsvl4oEHHogbbrghamtrhQ/Ap1ZbWxs33HBDPPDAA3nz2oAePXqMevHFF8dIHwAAPj0FMAAAu9SkSZO+NnDgwFPy4ax1dXVx8803x8SJE73vF4BtksvlYuLEiXHLLbdEXV1dXpx54MCBJ0+aNOlr0gcAgE9HAQwAwC7z6KOPHnXggQeekw9nXbduXfz617+OWbNmCR6Az2zmzJnx61//Ol9eJZA58MADz3n00UePkjwAAHyywsqB0fWjvtBYFVGzImtDAADsEDfeeOO+Rx999EWZTKYw7Wddvnx5XHXVVbFy5UrBA7DdbNiwIWbPnh0DBw6MioqKtB8307179/179uz56sMPP7xc+gAA5LuyzvVRUP7RX1MAAwCw011xxRV7fPe7372qoKCgWdrPOmfOnPjtb38bGzduFDwA2111dXVMmzYtOnfuHB07dkz1WTOZTOHuu+9+eJs2bV6aNGnSKukDAJDPFMAAADQZZ5xxRvef/exnvy0sLCxP+1knTJgQd999d9TX1wsegB2moaEhXnrppchms9G3b99UnzWTyRTttddeB/3lL395dubMmRukDwBAvlIAAwDQJBx00EEVf/jDH64pLi7ulOZz5nK5eOCBB+Kxxx4TOgA77c+eBQsWRF1dXfTv3z8ymUxqz1pQUFBywAEHDJs+ffqkpUuXbpY+AAD5aEsFcIH1AACwMwwaNKj0vvvuu7qsrKxXms9ZV1cX1113XUyaNEnoAOx0EydOjOuvvz7q6upSfc6ysrJef/rTn67u379/idQBAODvKYABANjhKioqCh577LGLKyoqBqb5nNXV1XHNNdfE7NmzhQ7ALvPKK6/ElVdeGVVVVak+Z4sWLQZOnDhxbEVFhZ9vAQDA33CBDADADjdz5syftW3b9sA0n3HdunVx2WWXxRtvvCFwAHa5xYsXx2WXXRZr165N9TnbtWt34MyZM38mcQAA+P8UwAAA7FBPPvnkqB49eoxK8xlXrVoVV1xxRSxfvlzgADQZK1asiCuuuCJWrlyZ6nP26NFj1KRJk0ZJHAAA/lth5cDo+lFfaKyKqFmRtSEAALbZjTfeuO+XvvSlCzOZTGp/8fDdd9+NK6+8MtatWydwAJqc6urqmDVrVvTv3z8qKytTe85u3boN79mz57yHH37Yb2MBAJAXyjrXR0H5R39NAQwAwA5x3nnn9T311FOvLigoKE7rGV977bW45pprorq6WuAANFmbN2+OGTNmRI8ePaJ9+/apPGMmkykYNGjQIYWFhVOee+45v5UFAEDqKYABANipjjrqqFb/8R//8YdmzZq1SusZX3755bj++uujrq5O4AA0eQ0NDfHSSy9Fp06dolOnTqk8Y0FBQXbYsGGfnz9//qQ33nhjk9QBAEizLRXA3gEMAMB21a1bt+wNN9zwnyUlJR3TesYpU6bEjTfeGPX19QIHIDHq6+vjxhtvjKlTp6b2jCUlJZ1uuOGG/+jWrZu7GgAAyFsKYAAAtqunn376XyorK/dI6/kmTZoUd955ZzQ2NgobgMRpbGyMO+64I5588snUnrGysnLw008//UtpAwCQrxTAAABsN88///w3unTp8k9pPd/EiRNj3LhxkcvlhA1AYuVyubj//vtTXQJ36dLlS88+++yJ0gYAIB95BzAAANvFTTfdNPzII488L5PJZNJ4vsceeyzGjx8vaABS47XXXotmzZpF3759U3m+zp0779urV695Dz/88DJpAwCQNlt6B7ACGACAz+wXv/hF7x/+8IdXFxQUNEvj+R544IF45JFHBA1A6ixYsCDq6upiwIABqTtbJpPJDBo06ODGxsbnpk6dul7aAACkiQIYAIAd5oADDqj43e9+99tmzZq1TeP5xo0bF5MmTRI0AKm1aNGi2Lx5cwwcODB1ZysoKMjut99+w5577rnH33vvvc3SBgAgLbZUAHsHMAAA2yybzWbuvPPOfyktLe2exvNNmDBB+QtAXpg0aVI89NBDqTxbaWlpj3vuuedfstlsRtIAAOQDBTAAANvs+eef/06HDh0OTePZHn744Xj44YeFDEDeeOSRR+LPf/5zKs/WoUOHw5599tlvSxkAgHygAAYAYJvcd999hw8ePPjUNJ7t/vvvjwkTJggZgLzz2GOPxX333ZfKs+25554/+NOf/nSYlAEASDvvAAYAYKudccYZ3ceMGXN5QUFBcdrONnHixHjkkUeEDEDeWrx4cWSz2ejbt2/ajpbp06fPvn/5y18mz5w5c4OkAQBIsi29A1gBDADAVhk2bFjzG2+88Q/NmjVrl7azPfroo6l99CUAbI2FCxdGUVFR9OvXL1XnKigoKD7wwAP3e/LJJx9dsWJFnaQBAEiqLRXAHgENAMBWuffee39ZWlraPW3nevzxx+PBBx8UMAD8jz//+c8xceLE1J2rtLS0x3333fdLCQMAkFYKYAAAPrVJkyaN6tSp0xEpPFeMHz9ewADwD8aPHx+TJ09O3bk6der0hUmTJn1VwgAApJFHQAMA8Kmcd955fU888cR/z2QyRWk618yZM+Puu+8WMAB8jNdeey06duwYnTt3TtW5unbtuk9BQcHzzz333DopAwCQNN4BDADAZ3LEEUe0vOKKK67NZrOVaTrXyy+/HDfffHPkcjkhA8DHyOVyMXv27OjSpUt06tQpNefKZDJF++yzz/CpU6c+9u67726WNAAASeIdwAAAbLNsNpu55ZZb/q2kpKRjms61YMGCuPnmm6OxsVHIAPAJGhsb4+abb44333wzVecqLS3tcvfdd5+fzWYzUgYAIC0UwAAAbNGkSZO+3rZt2wPTdKZly5bFDTfcEPX19QIGgE+prq4urr322li+fHmqztWuXbsDH3/88VESBgAgLTwCGgCAj3XZZZcN+upXvzo2k8mk5hcH33///bjyyiujqqpKwACwlerq6uLll1+OIUOGRHl5eWrO1aVLl31LS0unPvPMM2ukDABAEngENAAAW61///4lJ5988q8ymUxRWs60YcOG+P3vfx8bN24UMABso40bN8bvfve7VP15WlBQkP3hD394ft++fYslDABA4q9vrQAAgI/y4IMPnl1WVtYrLeeprq6O3/zmN7Fq1SrhAsBntGrVqrjyyiujuro6NWcqKyvr8/DDD58lXQAAkk4BDADA/zF+/Pgju3XrdnRazlNfX5/KdxYCwK60fPnyuO6666K+vj41Z+rRo8dXx40bd4R0AQBIMgUwAAB/53vf+16nI4444py0nCeXy8Vtt90Wb7zxhnABYDt7/fXX47bbbotcLpeaMx155JHnfvvb3+4oXQAAkkoBDADA/6qoqCi4+OKLLywsLCxPy5nGjx8fs2bNEi4A7CCzZs2Khx56KDXnKSwsrPj1r399QUVFhZ+bAQCQSC5kAQD4XxMnThxdWVk5OC3nef7552PixImCBYAd7LHHHosXXnghNeeprKzc89FHHz1RsgAAJFFh5cDo+lFfaKyKqFmRtSEAgDxxwQUX7DZq1KgLM5lMYRrO8+qrr8Ytt9ySqkdSAkBT/7O3d+/e0a5du1Scp2PHjkNzudxzU6ZMWSddAACamrLO9VHwMc/wcwcwAADRt2/f4h//+McXZzKZVPwG4HvvvRc33HBDNDY2ChcAdpKGhoa47rrrYtmyZak4T0FBQfbss88e27dv32LpAgCQqGtZKwAAYPz48T8qKyvrkYazbNiwIX7/+99HbW2tYAFgJ9u0aVP8/ve/j40bN6biPGVlZb3GjRs3RrIAACSJAhgAIM/ddNNNw/v06XN8Gs5SX18f1157baxdu1awALCLrFmzJq699tqor69PxXn69ev3jd///vdDJQsAQFIogAEA8thBBx1Uceyxx/5rRGTScJ477rgjFi9eLFgA2MUWLVoUd955Z1qOU/CNb3zj34YNG9ZcsgAAJOIC1goAAPLXzTfffFZxcXG7NJxl4sSJMX36dKECQBMxbdq0mDRpUirOUlJS0unOO+88Q6oAACSBAhgAIE/913/914FdunT5UhrO8tprr8Wf//xnoQJAEzN+/PhYsGBBKs7SrVu3o2+66abhUgUAoKlTAAMA5KEvfelLlV/5yld+lYazrFixIq6//vpobGwULAA0MY2NjXHdddfFihUr0nCczHHHHfergw46qEKyAAA0ZQpgAIA8dPXVV5+ezWYrk36OmpqauPbaa2PTpk1CBYAmatOmTXHttddGTU1N4s+SzWbb3njjjT+RKgAATZkCGAAgz9x6663Du3Tp8uWknyOXy8Utt9wSK1euFCoANHErV66MW2+9NXK5XOLP4lHQAAA0dQpgAIA8MnTo0LKvfvWrv0jDWSZMmBBz584VKgAkxJw5c+Kxxx5LxVlGjRr1i6FDh5ZJFQCApkgBDACQR+64444fFRcXd0z6OV5++eV45JFHBAoACfPQQw+l4he4SkpKOt5xxx0/lCgAAE2RAhgAIE9cfvnlu/fs2XNU0s/xwQcfxB133JGKR0gCQL7J5XJx2223xZo1axJ/lp49ex57+eWX7y5VAACaGgUwAEAe6NatW/a73/3uv2YymURf/9XX18cNN9wQ1dXVQgWAhKqqqoobb7wx6uvrE32OTCZT8N3vfvdX3bp1y0oVAICmRAEMAJAHxo8ff0pZWVmvpJ/jnnvuiaVLlwoUABJuyZIlcd999yX+HGVlZT3Hjx9/ikQBAGhKFMAAACn385//vOeAAQNGJ/0c06dPjylTpggUAFJi8uTJMWPGjMSfY8CAAaN//vOf95QoAABNhQIYACDFstls5qyzzjo3k8kk+tGEK1asiLvvvlugAJAyd911V6xYsSLRZ8hkMtmzzjrr3Gw2m5EoAABNgQIYACDFxo0b98XKysq9knyG2trauOGGG6K2tlagAJAyf/1zfvPmzYk+R2Vl5V7jxo0bKVEAAJoCBTAAQEoNHz68/OCDDz4t6ee4//77Y/ny5QIFgJRavnx5jBs3LvHnGDFixI+HDRvWXKIAAOxqCmAAgJS69dZbT8tms22TfIYZM2bEc889J0wASLnJkyfHzJkzE32G4uLitrfffvtp0gQAYFdTAAMApNBVV121R48ePb6S5DOsXLky7rrrLmECQJ64++6744MPPkj0GXr27PnVK664Yg9pAgCwKymAAQBSprS0tOAb3/jGT5N8rdfY2Bi333679/4CQB6pqamJ2267LRobG5N8jIJvfvObZ5aWlvqZGwAAu+6i1AoAANJlwoQJX6uoqBiQ5DOMHz8+Fi1aJEwAyDNvvvlmPPjgg4k+Q4sWLQY9+OCDx0gTAIBdRQEMAJAiRx55ZOWwYcN+kOQzzJ07N5544glhAkCemjhxYixYsCDRZxg+fPiPjjjiiJbSBABgV1AAAwCkyBVXXHFyUVFRRVLnr6qqijvvvDNyuZwwASBP5XK5uP3226O6ujqxZygqKmrxm9/85mRpAgCwKyiAAQBS4vzzz+/Xu3fv45J8httvvz0+/PBDYQJAnlu3bl3cfvvtiT5D7969jz///PP7SRMAgJ1NAQwAkALZbDZz6qmn/jyTyST2+m769OkxZ84cYQIAERExe/bsmDFjRmLnz2QyBaeeeurPs9lsRpoAAOxMCmAAgBT44x//eERlZeXgpM6/du3auPfeewUJAPyde+65J9atW5fY+SsrKwf/6U9/+oIkAQDYmRTAAAAJ17dv3+JDDjnkR0k+w9133x01NTXCBAD+Tk1NTdx9992JPsPBBx/8o759+xZLEwCAnUUBDACQcHfdddc3S0pKOiV1/smTJ8e8efMECQB8pLlz58azzz6b2PlLSko63nPPPd+SJAAAO4sCGAAgwb70pS9VDhw48KSkzr9mzZoYP368IAGALXrggQdizZo1iZ2/f//+Jx111FGtJAkAwM6gAAYASLArrrji1MLCwvIkzp7L5eK2226LTZs2CRIA2KJNmzbFbbfdFrlcLpHzFxYWll1++eU/kCQAADuDAhgAIKF+8Ytf9O7evftXkjr/s88+G2+88YYgAYBP5Y033ojnn38+sfN369bt6F/96ld9JAkAwI6mAAYASKgf/vCHP8pkMom8nvvggw/igQceECIAsFXGjRsX69atS+TsmUym4NRTT/2xFAEA2NEUwAAACXTdddcNa9eu3YFJnD2Xy8Udd9wRtbW1ggQAtsqmTZvizjvvTOz8bdq02f+mm27aT5IAAOxICmAAgIQpLS0t+NrXvnZ6Uud/4YUXYuHChYIEALbJq6++GjNmzEjs/Mccc8zpFRUVfiYHAMAO42ITACBhbr/99oMrKip2S+LsGzZsiHHjxgkRAPhM7r///qiqqkrk7OXl5X3/67/+6wgpAgCwoyiAAQASpKKiouCwww47Nanz33vvvYn9YS0A0HRs2LAh7r///sTOf9BBB/1zq1atCiUJAMCOoAAGAEiQ+++//+iysrKeSZx9zpw58dJLLwkRANguXnjhhViwYEEiZy8tLe32xz/+8StSBABgR1AAAwAkRN++fYv33Xfff07i7LW1tXHvvfcKEQDYru6+++6oq6tL5Oz77bffKf379y+RIgAA25sCGAAgIW6++eZRxcXFbZM4+yOPPBJr164VIgCwXa1atSoee+yxRM6ezWbb3njjjV+TIgAA25sCGAAgAYYOHVq21157fSeJs7/33nvxxBNPCBEA2CEmTpwYK1asSOTsQ4YM+c7QoUPLpAgAwPakAAYASIBrr732xKKiosqkzZ3L5eKee+6JxsZGIQIAO0R9fX3cddddkcvlEjd7UVFR5bXXXnuCFAEA2J4UwAAATdwBBxxQMWDAgG8kcfYZM2bEW2+9JUQAYId6880348UXX0zk7AMGDPjG8OHDy6UIAMD2ogAGAGjirrrqqhOKiooqkjb3pk2b4oEHHhAgALBT3H///VFbW5u4uYuKilpcffXV7gIGAGC7UQADADRhBx10UEX//v0Teffvww8/HB9++KEQAYCdYv369TFhwoREzj5w4MBvHHDAARVSBABge1AAAwA0Yf/5n/95bGFhYfOkzb1q1aqYPHmyAAGAnerpp5+O1atXJ27uwsLC8ssuu2yUBAEA2B4UwAAATdQBBxxQMWjQoNFJnP3uu++O+vp6IQIAO1V9fX3cddddiZx99913/+bQoUPLpAgAwGelAAYAaKIuv/zyYwsLC8uTNvfcuXNjwYIFAgQAdokFCxbE3LlzEzd3UVFRi9/97ndflyAAAJ+VAhgAoAkaOnRo2aBBgxL37t+6urr405/+JEAAYJf605/+FHV1dYmbe/fdd//mkCFDSiUIAMBnoQAGAGiCfvOb33ylqKioZdLmfu655xL53j0AIF1Wr14dzz33XOLmLioqann11VcfLUEAAD4LBTAAQBPTq1evZoMHD/5m0uaurq6ORx55RIAAQJPwyCOPRHV1deLmHjJkyLe6deuWlSAAANtKAQwA0MTcdNNNxxQXF7dN2twTJkyIqqoqAQIATUJVVVUifzmtuLi43a233uouYAAAtpkCGACgCWnVqlXhXnvtdVLS5l61alU8++yzAgQAmpTJkyfHqlWrEjf30KFDR7dq1apQggAAbAsFMABAE3LLLbccXlJS0jlpcz/44INRX18vQACgSamvr48HH3wwcXOXlJR0vummmw6VIAAA20IBDADQRGSz2cwBBxzw7aTNvWjRonjppZcECAA0SS+99FIsXrw4cXOPGDHiO9lsNiNBAAC2lgIYAKCJuOaaa/YuLy/vm7S5H3roocjlcgIEAJqkXC6XyLuAy8vL+1111VV7SRAAgK2lAAYAaCK+8pWvfDdpM8+bNy8WLlwoPACgSVu4cGG8+uqrrg8BAMgLCmAAgCbgsssuG1RZWblPkmbO5XIxfvx44QEAifDAAw8k7qklrVu33veSSy7pLz0AALaGAhgAoAkYNWrUCUmbefbs2bFs2TLhAQCJsGzZsnjllVcSN/cJJ5xwovQAANgaCmAAgF3sn//5nzt37NjxiCTN3NjYGA888IDwAIBEGT9+fDQ0NCRq5k6dOn1h9OjRHaQHAMCnpQAGANjFfvSjH30tk8kk6rps2rRpsWrVKuEBAImyatWqeOGFFxI1cyaTKfzpT386SnoAAHxaCmAAgF1o0KBBpX369Plqkmaur6+PCRMmCA8ASKQJEyZEXV1dombu27fvV/r27VssPQAAPg0FMADALnTZZZcdXlRUVJGkmadOnRpr164VHgCQSOvXr48pU6YkauaioqLK3/zmN0dIDwCAT0MBDACwi2Sz2cy+++57UpJmrqurc/cvAJB4jz76aOLuAt5///1PymazGekBAPBJFMAAALvI1VdfPbSsrKx3kmaeMmVKbNiwQXgAQKJt2LAhnn/++UTNXFZW1ueqq67aS3oAAHwSBTAAwC7y5S9/+bgkzVtfXx8TJ04UHACQCo8//nji7gL+0pe+dLzkAAD4JApgAIBdYPTo0R3atm07IkkzT5s2LdatWyc8ACAVPvzww5g+fXqiZm7fvv2I0aNHd5AeAABbogAGANgFfvrTn47KZDKFSZm3vr4+HnnkEcEBAKnyyCOPRH19fWLmzWQyhT/96U+/JjkAALZEAQwAsJN16tQp26dPn6OTNLO7fwGANFq3bl1MmzYtUTP36dPnmE6dOmWlBwDAx1EAAwDsZFddddUB2Wy2dVLmbWxsjEmTJgmOVOvYsWN06OCJmgD5aNKkSdHY2JiYebPZbOurrrrqAMkBAPBxFMAAADvZiBEjvp6keV988cVYtWqV4Ei1Ll26xIUXXhinnXZadO3a1UIA8siqVavipZdecj0JAEBqKIABAHaiM844o3tlZeXeSZk3l8vFxIkTBUdeyGQyMXjw4PjVr34VY8aMcUcwQB55/PHHI5fLJWbeysrKvc8444zukgMA4KMogAEAdqJTTjnlqxGRScq8CxYsiPfee09w5JVMJhN77713XHjhhTFmzJho3769pQCk3HvvvRcLFy5M1B9X/3NdCQAA/4cCGABgJ+nVq1ezXr16fTlJM3v3L/nsr0XwBRdcECeffHK0bdvWUgBSLGnXPb169fpyr169mkkOAIB/pAAGANhJrrjiioOLiopaJmXeBN4JAztEYWFhDB8+PC688MIYPXp0VFZWWgpACi1YsCCWLVuWmHmLiopaXnnllYdIDgCAf6QABgDYSYYPH/6VJM2btHfhwY5WVFQUI0aMiEsuuSRGjx4dLVu2tBSAFMnlcvH4448naub99tvvK5IDAOAfKYABAHaC0aNHd6isrByalHnXrl0bL7/8suDgI/y1CL744ovjhBNOiBYtWlgKQEq89NJLsW7dusTMW1lZudfo0aM7SA4AgL+lAAYA2AlOP/30o5J07fXMM89EQ0OD4GALiouL47DDDouxY8fGqFGjoqyszFIAEq6hoSGeeeaZJI1c8D/XmQAA8P8vEq0AAGDHymazmX79+n05KfPW1tbGlClTBAefUnFxcYwcOTIuvfTSGDVqVJSWlloKQII9//zzUVtbm5h5+/Xr9+VsNpuRHAAAf6UABgDYwX7zm9/sWVJS0jkp886YMSOqq6sFB1uppKQkRo4cGZdcckkcffTRUVJSYikACVRdXR0zZ85M0p8/na+44orBkgMA4K8UwAAAO9gXvvCFLyVl1lwuF08//bTQ4DNo3rx5HHXUUXHJJZfEyJEjI5vNWgpAwjz11FORy+USM++RRx75ZakBAPBXCmAAgB1oyJAhpZ07dz4iKfO+/vrrsWLFCsHBdlBeXh6jRo2KSy+9VBEMkDArVqyI119/PTHzdunS5fD+/ft79AQAABGhAAYA2KHGjh17aGFhYWJeCOruX9j+KioqYtSoUXHxxRfH4YcfHkVFRZYC4LpouyosLGz+H//xHwdLDQCACAUwAMAOteeeex6ZlFnXrl0b8+bNExrsIK1atYrjjz8+LrroohgxYkQUFPh2DKApmzdvXqxZsyYx8+61115HSg0AgAgFMADADnPMMce0bt269b5Jmfe5556LxsZGwcEO1qZNmxg9enRcfPHFimCAJqyxsTGee+65JP35MvyYY45pLTkAAPykAQBgBznzzDMPz2Qyibje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FpafffbZvaQFAJA+CmAAgE9p//3375+EOV9//XVhAXmjvLw8Ro0aFf/+7/8eI0eOjGw2aymA67FP6fOf//xAaQEApI8CGADgU+rRo8fuTX3G2traePvtt4UF5J2KiooYNWpUXHzxxXH44Yc3+XdvAum2ePHiRLySo1evXoOkBQCQPgpgAIBPqXXr1k3+DoklS5ZEQ0ODsIC81apVqzj++OPj4osvjhEjRkRBgW97gZ2voaEhlixZ0uTnbNOmjQIYACCFfCcMAPApDBkypLR58+a9m/qcb775prAAIqJ169YxevToGDt2rCIYcF32MZo3b95n0KBBpdICAEgX3wEDAHwKp556av9MJtPkr53eeustYQH8jTZt2sTo0aPjvPPOi+HDhyuCAddlfyOTyRT84Ac/+Jy0AADSxXe+AACfwuDBg5v84/Hq6+tj0aJFwgL4CJ06dYqTTz45/u3f/i323nvvyGQylgLsUIsXL07Eqzn23HPPgdICAEgXBTAAwKfQpUuXAU19xnfeeSfq6uqEBbAFnTt3jjFjxiiCgR2utrY23n333SRc53oPMABAyiiAAQA+hZYtW/Zv6jN6/DPAp9elS5cYM2ZMnHvuuTF48GALAfL2+iwJ17kAAGwdBTAAwCcYPnx4eUlJSeemPqfHPwNsvV69esVpp50W55xzTvTvrwMB8u/6rLS0tPPw4cPLpQUAkB4KYACAT/Ctb31rt4ho8s8IXbx4sbAAtlGfPn3irLPOinPOOSd22203CwG2i4T8gl7m29/+dj9pAQCkhwIYAOAT7L777k2+CVi7dm1s2LBBWACfUZ8+feLss8+OM888M3r27GkhwGfy4Ycfxrp165r8nAMHDlQAAwCkSJEVAABsWadOnZr8D8TefvttQQFsRwMGDIgBAwbEggULYvz48bF06VJLAbb5Oq1Vq1audwEA2GkUwAAAn6CyslIBDJCnBgwYEP3794958+bFQw89FO+++66lAFtlyZIlsddeezX1613PvgcASBEFMADAFnTq1CnbvHnzXk19ziVLlggLYAfJZDIxePDg2GOPPeLll1+OBx98MFauXGkxQGqu05o3b967Xbt2RatXr66XGABA8nkHMADAFowZM6ZnJpPJNuUZGxsbPZoUYCfIZDKx9957x4UXXhhjxoyJ9u3bWwrwiZYuXRqNjY1NesaCgoLsqaee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k8nE7NmzY+LEibFmzRoNAXif/VNSzJo161kTAwBongTAAAC70O233/7KOeecszU/P78022sdMGBAtG/f3tWu0My9+uqrMWnSpFi1apVmALyPjh07xgEHHJCIWhsbG6u/8Y1v/NXUAACaJwEwAMAutHLlyob169fP6tat2+hsrzWVSsXhhx8ekyZNMjhohubMmROTJ0+OJUuWaAbAh3D44YdHKpVKRK3r16+fVVFR0WhqAADNU54WAADsWq+++mpirts77LDDDAyamTfffDP+/d//PX7yk58IfwE+pFQqFSNGjEhMva+88sozpgYA0Hw5AQwAsIvddNNNz5166qnV+fn5rbO91m7dukX//v1j4cKFBgc5btmyZfHYY4/F/PnzNQPgIzrggAOic+fOiai1sbFxy4033jjL1AAAmi8BMADALrZy5cqG8vLyGT179vx0Euo9+uijBcCQw5YvXx7jxo0T/AJ8wv1SUpSXlz9TXl7eYGoAAM2XABgAYDeYMWPGUxdccEEiAuAhQ4ZE69ato7q62uAgh6xcuTImTJgQc+fOjUwmoyEAH1ObNm3i0EMPTUy9zz777FOmBgDQvPkGMADAbvDVr371lYaGhk1JqLWgoCCOOOIIQ4McsW7duvj5z38ed955Z8yZM0f4C/AJjRw5MvLz8xNRa0NDw8abbrrpVVMDAGjenAAGANgNKisrm1atWjW9T58+5ySh3qOPPjqefPJJQREk2Pr16+Oxxx6L2bNn+3cZYBdJpVIxatSoxNS7cuXKadXV1WmTAwBo3pwABgDYTaZNm5aY6/c6duwYAwYMMDRIoA0bNsSvf/3r+Nd//dd49dVXhb8Au9CAAQOiY8eOian36aefftLUAAAQAAMA7CZf+9rX5tTX11ckpd6jjjrK0CBBqqqq4v77749vf/vb8eKLL0ZTU5OmAOxiRx55ZGJqra+vX/eNb3zjdVMDAMAV0AAAu0ltbW16xYoVT++///6fT0K9hx56aLRt2zaqqqoMD7LYli1bYsqUKfHcc8/F9u3bNQRgN2nbtm0MGTIkMfUuX778qdraWtc/AwDgBDAAwO70xz/+cUJSas3Pz4/jjjvO0CBL1dTUxKOPPhq33XZb/OUvfxH+Auxmxx57bOTn5yel3Myvf/3rCaYGAECEABgAYLe66667llZXV89PSr1HH310tGjRwuAgi7wd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qATAAABZ4umnn968fPnyxF3xN3r06GjXrp0BAgBZqUOHDnH88ccnru5ly5ZNmD59+hYTBADgoxIAAwBkkbvvvvtPmUymKUk1FxYWxumnn254AEBWOvPMMxP3yYpMJtN41113/dH0AAD4OATAAABZ5Be/+MWatWvXTkta3UcccUT06tXLAAGArNK7d+847LDDEld3eXn5X+6///51JggAwMchAAYAyDIPP/zwn5JWcyqVijPPPNPwAICsMmbMmEilUomr+8EHH/yT6QEA8HEJgAEAsszXv/71NzZs2DAraXUPHDgwDj74YAMEALLCoEGDYsCAAYmru6KiYuatt966wAQBAPi4BMAAAFlo3Lhxv01i3WPGjIm8PFtMAGDvysvLizFjxiSy9j//+c+/NUEAAD7RflgLAACyz/XXXz+nqqrqr0mru1evXnHUUUcZIACwVx1zzDHRvXv3xNW9adOmV2666aa5JggAwCchAAYAyFJ/+tOf7k1i3WPGjInS0lIDBAD2ijZt2sRZZ52VyNofeOCBe00QAIBPSgAMAJClbrrpprlJPAVcXFwcZ555pgECAHvFWWedFS1btkxc3Zs2bXrl5ptvnmeCAAB8UgJgAIAsNm7cuF8lse5Ro0ZF7969DRAA2KP69OkTI0eOTGTtjz322K9MEACAXUEADACQxcaOHTu7qqrqb0mrO5VKxfnnnx+pVMoQAYA9tv/4/Oc/n8j9R2Vl5d+uueaav5kiAAC7ggAYACDLTZ069bdJrLtv374xZMgQAwQA9ojDDjsssTeQTJ48+TcmCADAriIABgDIcpdeeumLVVVVryax9s9//vNRXFxsiADAblVaWhrnn39+Imuvqqr66+WXX/6SKQIAsKsIgAEAEuChhx76WRLrLisri9NPP90AAYDd6qyzzoqSkpIklp753e9+91MTBABgVxIAAwAkwA033DB3w4YNs5JY+3HHHRd9+vQxRABgt+jbt28cddRRiay9oqJi1te//vU3TBEAgF1JAAwAkBA///nPfxoR6aTVnUql4vOf/3zk5dl6AgC7Vn5+flx00UWRSqWSWH76F7/4xX+bIgAAu5q3cAAACXHHHXe8tW7duulJrL13795xzDHHGCIAsEudcMIJ0b1790TWXl5e/pc77rjjLVMEAGBXEwADACTI3XfffW8mk2lKYu1nnXVWtG3b1hAB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onv37vEv//IvccABBzSrdWcymaYnnnji9s997nPPeAoAAODDEQADAJBYDz/88NJjjjlmY+/evY+KiGZzFKq0tDSGDx8eq1evjvXr13sQAHLcwIED45prrol27do1t6VnZsyY8YOzzjprqqcAAAA+PAEwAACJdv/99795zDHHVO6zzz5HRDMKgVu0aBGHHXZYtGzZMhYuXBjpdNrDAJBjCgoK4pxzzonzzz8/WrRo0dyWn37uuefuOuWUUyZ4EgAA4KMRAAMAkHi///3v5w8bNmxF3759j2lO10GnUqno27dvDB06NBYvXhxbtmzxMADkiJ49e8YNN9wQgwcPblbf+434x7XPU6ZM+fbpp58+2ZMAAAAfnQAYAICc8OCDDy4ZNmzYin79+jWrEDgionXr1nHEEUdEfX19LF261MMAkGCpVCpOOOGEuOKKK6JNmzbNbv07wt9vnXPOOX/xNAAAwMcjAAYAIGc89NBDS4YNG7a8X79+xza3EDg/Pz8OPvjg6NWrV8yfPz8aGho8EAAJU1JSEpdffnmccMIJkZ+f3+zWn8lkGp944olvffazn53maQAAgI9PAAwAQE556KGHlo4cOXJdnz59RqWa252ZEdG1a9cYNmxYLFu2LCorKz0QAAnRt2/fuO6662K//fZrluvPZDLpp59++rvnnHPO054GAAD4ZATAAADknD/96U+LDj300KX7779/s7sOOiKiuLg4jjzyyCgpKYk333wz0um0hwIgSxUUFMRnP/vZuPDCC6OkpKRZ9iCdTjc88sgjt5x//vnTPREAAPDJCYABAMhJDz/88NId3wQelUqlmt09mqlUKvr06RMHH3xwLFy4MLZt2+ahAMgynTt3jrFjx8bQoUOjGV5aERH/CH+feOKJ2y+88MLnPBEAALBrCIABAMhZDz300JIePXq8NmjQoGPz8vJaNMcetG3bNkaNGhVNTU2xZMkSDwVAFkilUjF69Oi48soro0OHDs22D01NTdt++9vf/stll132oqcCAAB2HQEwAAA5bdKkSeXdu3efM3jw4GYbAufn58eAAQOiV69esWDBgti+fbsHA2Avad26dVx66aVx/PHHR35+frPtQ2NjY/WvfvWrf7nuuute81QAAMCuJQAGACDnTZ48eW1jY+OMI4444uiCgoKS5tqHrl27xqhRo2Lbtm2xcuVKDwbAHpRKpWLUqFExduzY6NWrV7PuRX19/fo77rjjK9/61rcWejIAAGDXEwADANAsPP/881UbNmx45rjjjjuqsLCwrLn2obCwMAYNGhT77bdfLF68OGpraz0cALtZ+/bt44orrogTTzwxCgub9/uU2tralTfffPPVP/nJT1Z7MgAAYPcQAAMA0Gz87W9/27p27doZJ5xwwsjCwsK2zbkXnTp1ipEjR0Z1dbXTwAC70ciRI+Pqq6+OHj16NPte1NTULL/hhhuu/e1vf7vOkwEAALuPABgAgGbltdde2zpv3rynTznllKFFRUWdmnMvCgsL49BDD4399tsvFi1a5DQwwC709qnfk08+udmf+o2I2Lx587yLL774unHjxm30dAAAwO71fgFwat9zYsTOftC4LmLjq610DwCAxOrVq1fhs88++69du3Y9QTciGhoaYurUqTF58uRobGzUEICPqaCgIE499dQYPXq04HeH8vLyp4499tjvrly5skE3AABg9+swrDYKuuz8ZwJgAAByWuvWrfNeeumlm/fdd9+zdeMfVq9eHffff38sWbJEMwA+ov322y8uuugi1z2/w8KFC38/fPjwnzY0NGR0AwAA9gwBMAAAzd7zzz9/8aGHHnp1RKR0IyKTycTMmTPjz3/+c9TV1WkIwAcoKSmJ8847L0aMGBGplL9Kdki//PLL9xx77LEPagUAAOxZ7xcA+wYwAADNwn333Tfn+OOP39yrV6/DQwgcqVQqevfuHcOHD49169ZFRUWFhwTgPRxyyCExduzY6N+/v/B3h0wm0/jMM8/828knnzxONwAAYM97v28AC4ABAGg2fve7370xePDgJf369Ts6lUrl60hEcXFxjBgxInr06BFLly6N2tpaTQHYoUOHDvGFL3whzjzzzCguLtaQHZqammoeeOCBWz73uc9N1w0AANg7BMAAALDDww8/vKygoOC54cOHH1FQUFCqI//QrVu3OO6446K0tDQWL14cTU1NmgI0Wy1btoxzzjknLr300ujevbuGvENtbe2K22677arbbrvtDd0AAIC9RwAMAADv8Oyzz25avHjx0yeddNKQoqKiTjryD3l5edGnT58YOXJkbN26NVatWqUpQLNz+OGHx1e+8pUYMGBA5OXlacg7VFVV/e3CCy+8/oEHHvDdAAAA2MsEwAAA8C7z58+vefbZZ58+44wz+hcX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OigOOOCAKCoq0pQs0djYuGXmzJk/PvPMMyc2NDS4XgAAAPjQBMAAAJADjjzyyNY/+9nPrujbt++5EZGnI9mluro6Fi5cGPPnz4958+ZFZWWlprBXtGvXLg455JAYMGBA9O/fP1q39nsjWSj91ltv/fmqq676xaxZs6q1AwAA+KgEwAAAkEN++ctfjhgzZsyNrVq16q0b2SmdTsfKlStj0aJFsXDhwli8eHFs27ZNY9gtSkpKol+/ftG/f//Yf//9o1evXpGX53dEslVNTc3yRx999EdXXnnlK7oBAAB8XAJgAADIMd26dSt8+OGHPzd48ODL8vPzbdyzXCaTiTVr1sTChQtj0aJFsWjRotiyZYvG8LGUlZVF//79/xn6du/ePVKplMZkuaampprXXnvtV2PGjHmgoqKiUUcAAIBPQgAMAAA56rjjjiv7r//6r8tdC508mzdvjuXLl8eKFSti+fLlsXjx4qipqdEY/pfi4uLo169f9O7dO/bZZ5/Yd999o6ysTGMSJJPJpJcsWfLn66677pfTp0/3mx8AAMAuIQAGAIAc99Of/nTIueeee3NpaWlf3UimxsbGWLlyZSxdujSWLVsWy5cvj3Xr1kUmk9GcZiKVSkWXLl1in332iT59+kSfPn2iV69eUVBQoDkJtXXr1sUPPvjgj6699tq/6wYAALArCYABAKAZaNeuXf64cePOGTp06BUFBQWtdST56uvrY+XKlf88KbxixYpYu3ZtpNNpzUm4vLy86Nq1a+yzzz7//KdXr17RsmVLzckBjY2NW/7617/+4pxzznm0srKySUcAAIBdTQAMAADNyIknntjmnnvuuXzfffcdk0qlHB3MMdu3b481a9bEmjVrYu3atbF27dooLy+PDRs2CIazUF5eXnTs2DG6desWXbt2jW7dukW3bt2iR48eUVhYqEE5JpPJNC5ZsuRR1z0DAAC7mwAYAACaoa9+9av7Xnfdddd16NDhCN3IfY2Njf8MhNetWxfr1q2LioqKWLduXWzbtk2DdrPS0tLo3LnzP//p0qVLdO3aNbp27eoK52Ziw4YNM//rv/7rxz/60Y+W6wYAALC7CYABAKAZ++UvfznirLPOuq64uNj3gZupmpqaWL9+/T//qaioiMrKyqisrIxNmzZFY2OjJn2AgoKCaN++fbRr1y7at28fHTt2jC5dukSnTp2ic+fOUVxcrEnN1NatW98aP378PVdcccXLugEAAOwpAmAAAGjm2rVrl//ggw+eOWLEiCsLCwvb6gjvtHnz5n+GwZs2bYrKysqorq6OLVu2xJYtW6K6ujqqq6sjk8nk3NpTqVS0bt06WrduHWVlZdGmTZsoLS39X2Fvu3btok2bNh4U/peGhobKl1566efnnHPO+OrqavevAwAAe5QAGAAAiIiIoUOHFt97770XHHjggRfk5+c7ssiHlk6n/xkEV1dXR01Nzfv+k8lkora2NtLpdNTX10dTU1PU1dXt0u8U5+XlRcuWLSM/Pz+KiooiLy8vWrVqFalUKoqLi3f6T0lJSbRq1eqfgW9paWnk5eUZMB9aU1NTzYIFC/745S9/+Y+zZ8+u0REAAGBvEAADAAD/y2mnndb2rrvuurRPnz5n5+XlFeoIe9LbgfDbtm/f/r7XUBcUFESLFi3++b/fDnxhT8pkMg1LliwZd8stt/xq0qRJVToCAADsTQJgAABgp0477bS2d95554X777//5wTBAP9XJpNpWLhw4QO33nrrHwS/AABAtni/ADi/7UHRc2c/SG+LqC33/gcAAHLZokWL6u69995X0un0swcddFCnkpKS3roC8A8VFRUz/7//7/+77aKLLpq6aNGiOh0BAACyRXH3xsgr3fnPBMAAAEDMnDmz8u67736qqalpWr9+/Ypbt27dN5VKpXQGaG4ymUx6zZo1U+65555/Peeccx6cOXNmpa4AAADZRgAMAAB8KDNnzqz88Y9//Gw6nZ4uCAaak7eD37vvvvtfzz///McEvwAAQDYTAAMAAB+JIBhoLgS/AABAEgmAAQCAj+XtILisrOyFvn37diwuLu4VEYJgIBdkKioqnrv33nu/PWbMmEcEvwAAQJK8XwCc2vecGLGzHzSui9j4aivdAwAA/unqq6/u8ZWvfOX8Pn36nJWXl9dCR4CkSafT9UuXLh3/X//1Xw/84he/WKMjAABAEnUYVhsFXXb+MwEwAADwkZ1xxhntb7/99rMPPPDA8/Pz81vrCJDtmpqaqhcsWPDgd77znUcmTpzotC8AAJBoAmAAAGC3GD58eMkPf/jDzwwePPjioqKijjoCZJv6+voNr7322u9vvPHGx2fPnl2jIwAAQC4QAAMAALvV0KFDi++5556zDjnkkPOKioq66giwt9XV1a19/fXXH7z++uvHC34BAIBcIwAGAAD2iFatWuXdc889w0455ZTzO3bseJSOAHtYZsOGDbOmTJny4PXXX/9qbW1tWksAAIBcJAAGAAD2uH/913/tf/7555/dq1ev0/Ly8lroCLC7pNPp+pUrV05+4IEHHvnOd76zSEcAAIBcJwAGAAD2mjPOOKP97bfffvYBBxzw2YKCgjY6AuwqjY2NVW+++eafv/e97z06YcKETToCAAA0FwJgAABgrxs+fHjJ97///dGDBg0aU1paur+OAB9XdXX1wtdee+3Rr371q1Nfe+21Wh0BAACaGwEwAACQVb761a/ue8EFF3y6b9++ZxUUFLTWEeCDNDY2bnnrrbfG/+EPf5j4ox/9aLmOAAAAzZkAGAAAyEpDhw4t/sEPfnDy4MGDz27dunV/HQHerbq6+s2XX375weuuu+7ppUuXbtcRAAAAATAAAJDlCgsLU3ffffeQ0aNHn9G1a9fj8vLyinQFmq90Ol1XXl4+bcqUKROuvfbav+sIAADA/yYABgAAEqNPnz4t/v3f/33UyJEjz2rfvv2nIiKlK9AsZDZt2vTXF1544bGvfe1rzzntCwAA8N4EwAAAQCJddNFFXa6++uqTDzzwwLNbtmzZTUcg99TV1a1ZsGDBuJ/+9KdP3n///et0BAAA4IMJgAEAgETr1q1b4d13333k4YcffmqHDh2OyMvLK9QVSK50Ot2wcePGWbNmzZp8/fXXz6qoqGjUFQAAgA9PAAwAAOSMo48+uvWtt956/CGHHHJKu3btBkdEnq5AIqQrKytfmzdv3uQ777xz+owZM6q1BAAA4OMRAAMAADnpuOOOK/vGN75x/CGHHHJa27ZtB4bvBUO2yVRVVc2dN2/epO9///vTpk+fvkVLAAAAPjkBMAAAkPNuu+22vmedddZJffr0Oa5Vq1a9dQT2ntra2uXLly+f/uijjz51xx13vKUjAAAAu5YAGAAAaFa+9KUvdbv44ouP7t+//wlOBsMekamqqpq7cOHCv/z+97+fcd9995VrCQAAwO4jAAYAAJqtSy65pOtll112jDAYdrl0VVXVvIULF/7lV7/61bO/+93v1moJAADAniEABgAAiIirr766x/nnnz9q//33P7JNmzZDUqlUga7Ah5fJZBoqKyv/vnjx4uf+9Kc/zbr33ntX6woAAMCeJwAGAAB4l379+hV97WtfGzRy5MhRPXv2PLaoqKizrsD/VV9fv37VqlXPvPDCC8/9+7//+5zFixfX6woAAMDeJQAGAAB4H61bt8678847Bx599NFHde/efURpaen+4apomq/M1q1bF69Zs+bF5557btY3v/nNOdXV1WltAQAAyB4CYAAAgI9g8ODBrcaOHXvI8OHDD+vevfvw1q1bHxACYXJXprq6+s01a9a88sorr7z8k5/8ZN5rr71Wqy0AAADZSwAMAADwCVx//fX7nHHGGYf169dvePv27Yfm5+e31hWSrLGxsXrjxo2vvvXWWy+PHz/+lR//+McrdQUAACA5BMAAAAC70Je//OUe55xzzvA+ffoM7tix45CioqKuukI2q6+vX7t27doXFy9ePGfixImv3Xvvvat1BQAAILkEwAAAALvRl7/85R6f+cxnBvfr129Qly5dDm/ZsqVAmL2qrq5u7bp16wS+AAAAOUoADAAAsIe0atUq75prrtnn2GOPPXi//fY7uH379oeUlpb2TaVS+brDbpKuqalZtnHjxnlvvfXW3GeffXbef/3Xfy2vra1Naw0AAEBuEgADAADsRQceeGDLq6+++oAhQ4Yc3LNnz4Pbtm17sGuj+biampqqq6qqXi8vL583Z86ceb/85S/nvfjii1t1BgAAoPkQAAMAAGSZoUOHFn/xi1/cf9CgQQf26NHjwHbt2h3YqlWr3qlUKk932CFdU1OzvLKycsHq1asXzJkzZ8Gf//znJTNmzKjWGgAAgOZNAAwAAJAAxx13XNkFF1xw4MEHH3xA165dDywtLd23pKRkn1QqVag7uS2TyTRs27ZtRXV19dJ169YtfOONNxZOmDBh4YQJEzbpDgAAAO8mAAYAAEiw8847r+OJJ57Yp3///vt16dKlT5s2bfZr3bp1v/z8/GLdSZampqaa6urqxZs3b16ybt26pQsXLlzy9NNPL33ooYc26A4AAAAflgAYAAAgx7Rr1y7/kksu6TFkyJCe++67b89OnTr1Kisr61VcXNyzZcuW3VKpVL4u7R2ZTKaprq6uvKamZtWWLVtWVlRUrFy6dOnK2bNnr7r//vvXVFZWNukSAAAAn4QAGAAAoBnp1KlTwec+97luQ4cO7bnPPvv0aNeuXafWrVt3Li4u7tqyZcvORUVFnfLy8lro1MeTTqe319fXr6+rq6uoqalZW11dvb6y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AACAEgIwAAAAAAAAQAkBGAAAAAAAAKCEAAwAAAAAAABQQgAGAAAAAAAAKCEAAwAAAAAAAJQQgAEAAAAAAABKCMAAAAAAAAAAJQRgAAAAAAAAgBICMAAAAAAAAEAJARgAAAAAAACghAAMAAAAAAAAUEIABgAAAAAAACghAAMAAAAAAACUEIABAAAAAAAASgjAAAAAAAAAACUEYAAAAAAAAIASAjAAAAAAAABACQEYAAAAAAAAoIQADAAAAAAAAFBCAAYAAAAAAAAoIQADAAAAAAAAlBCAAQAAAAAAAEoIwAAAAAAAAAAlBGAAAAAAAACAEgIwAAAAAAAAQAkBGAAAAAAAAKCEAAwAAAAAAABQQgAGAAAAAAAAKCEAAwAAAAAAAJQQgAEAAAAAAABKCMAAAAAAAAAAJQRgAAAAAAAAgBICMAAAAAAAAEAJARgAAAAAAACghAAMAAAAAAAAUEIABgAAAAAAACghAAMAAAAAAACUEIABAAAAAAAASgjAAAAAAAAAACUEYAAAAAAAAIASAjAAAAAAAABACQEYAAAAAAAAoIQADAAAAAAAAFBCAAYAAAAAAAAoIQADAAAAAAAAlBCAAQAAAAAAAEoIwAAAAAAAAAAlBGAAAAAAAACAEgIwAAAAAAAAQAkBGAAAAAAAAKCEAAwAAAAAAABQQgAGAAAAAAAAKCEAAwAAAAAAAJQQgAEAAAAAAABKCMAAAAAAAAAAJQRgAAAAAAAAgBICMAAAAAAAAEAJARgAAAAAAACghAAMAAAAAAAAUEIABgAAAAAAACghAAMAAAAAAACUEIABAAAAAAAASgjAAAAAAAAAACUEYAAAAAAAAIASAjAAAAAAAABACQEYAAAAAAAAoIQADAAAAAAAAFBCAAYAAAAAAAAoIQADAAAAAAAAlBCAAQAAAAAAAEoIwAAAAAAAAAAlBGAAAAAAAACAEgIwAAAAAAAAQAkBGAAAAAAAAKCEAAwAAAAAAABQQgAGAAAAAAAAKCEAAwAAAAAAAJQQgAEAAAAAAABKCMAAAAAAAAAAJQRgAAAAAAAAgBICMAAAAAAAAEAJARgAAAAAAACghAAMAAAAAAAAUEIABgAAAAAAACghAAMAAAAAAACUEIABAAAAAAAASgjAAAAAAAAAACUEYAAAAAAAAIASAjAAAAAAAABACQEYAAAAAAAAoIQADAAAAAAAAFBCAAYAAAAAAAAoIQADAAAAAAAAlBCAAQAAAAAAAEoIwAAAAAAAAAAlBGAAAAAAAACAEgIwAAAAAAAAQAkBGAAAAAAAAKCEAAwAAAAAAABQQgAGAAAAAAAAKCEAAwAAAAAAAJQQgAEAAAAAAABKCMAAAAAAAAAAJQRgAAAAAAAAgBICMAAAAAAAAEAJARgAAAAAAACghAAMAAAAAAAAUEIABgAAAAAAACghAAMAAAAAAACUEIABAAAAAAAASgjAAAAAAAAAACUEYAAAAAAAAIASAjAAAAAAAABACQEYAAAAAAAAoIQADAAAAAAAAFBCAAYAAAAAAAAoIQADAAAAAAAAlBCAAQAAAAAAAEoIwAAAAAAAAAAlBGAAAAAAAACAEgIwAAAAAAAAQAkBGAAAAAAAAKCEAAwAAAAAAABQQgAGAAAAAAAAKCEAAwAAAAAAAJQQgAEAAAAAAABKCMAAAAAAAAAAJQRgAAAAAAAAgBICMAAAAAAAAEAJARgAAAAAAACghAAMAAAAAAAAUEIABgAAAAAAACghAAMAAAAAAACUEIABAAAAAAAASgjAAAAAAAAAACUEYAAAAAAAAIASAjAAAAAAAABACQEYAAAAAAAAoIQADAAAAAAAAFBCAAYAAAAAAAAoIQADAAAAAAAAlBCAAQAAAAAAAEoIwAAAAAAAAAAlBGAAAAAAAACAEgIwAAAAAAAAQAkBGAAAAAAAAKCEAAwAAAAAAABQQgAGAAAAAAAAKCEAAwAAAAAAAJQQgAEAAAAAAABKCMAAAAAAAAAAJQRgAAAAAAAAgBICMAAAAAAAAEAJARgAAAAAAACghAAMAAAAAAAAUEIABgAAAAAAACghAAMAAAAAAACUEIABAAAAAAAASgjAAAAAAAAAACUEYAAAAAAAAIASAjAAAAAAAABACQEYAAAAAAAAoIQADAAAAAAAAFBCAAYAAAAAAAAoIQADAAAAAAAAlBCAAQAAAAAAAEoIwAAAAAAAAAAlBGAAAAAAAACAEgIwAAAAAAAAQAkBGAAAAAAAAKCEAAwAAAAAAABQQgAGAAAAAAAAKCEAAwAAAAAAAJQQgAEAAAAAAABKCMAAAAAAAAAAJQRgAAAAAAAAgBICMAAAAAAAAEAJARgAAAAAAACghAAMAAAAAAAAUEIABgAAAAAAACghAAMAAAAAAACUEIABAAAAAAAASgjAAAAAAAAAACUEYAAAAAAAAIASAjAAAAAAAABACQEYAAAAAAAAoIQADAAAAAAAAFBCAAYAAAAAAAAoIQADAAAAAAAAlBCAAQAAAAAAAEoIwAAAAAAAAAAlBGAAAAAAAACAEgIwAAAAAAAAQAkBGAAAAAAAAKCEAAwAAAAAAABQQgAGAAAAAAAAKCEAAwAAAAAAAJQQgAEAAAAAAABKCMAAAAAAAAAAJQRgAAAAAAAAgBICMAAAAAAAAEAJARgAAAAAAACghAAMAAAAAAAAUEIABgAAAAAAACghAAMAAAAAAACUEIABAAAAAAAASgjAAAAAAAAAACUEYAAAAAAAAIASAjAAAAAAAABACQEYAAAAAAAAoIQADAAAAAAAAFBCAAYAAAAAAAAoMY3JP//9K8My551lzpAk293a7QAAAAAAAAD8iIw3r+SL7TpPxuSt4/ibJJuz20QDBgAAAAAAAHhzrJPp6NvHYcyyjLl7dJTPbl/Jp6sPLufSsM+5ec7q5YOrF0OeP/SVaAAAAAAAAIA3weH7u6zfm79dWDIMSw6225w785vsx3XyzasOby5ssz69c4sAAAAAAAAAr9n69C6bC9sT93a7rKdnORin5Otxynzi1JQcfiwCAwAAAAAAALxO69O7HH68TaaT98cp85R8vbp3Nfszv8q0LHn7xMF1sjk/ZzUPmZ/MmWefhAYAAAAAAAD4oayPdjn7223Gn7x6ZrXPnetX8mBKkpv3cufDd/Pufn5FL56SzcVtNheT3dNt8tQlAwAAAAAAAHyv1sm0ySv/9XtsNWZ3I/lHkgzHi7/4XY7WYz5yiwAAAAAAAAA/Ivtcv/3nPEyS1fHa42t5+vNLyX7JoRsCAAAAAAAAePPt1/nbV3/KvePn1Xc371/NYxEYAAAAAAAA4M0yTHk2rvNo2WdzvHZqzN9v/SF3vju3evng/at5fPDLPDu1yuGyZHSVAAAAAAAAAK/XOGe4ueSvZ4e8M8xZbVe5ceuPufvy3Oqkw4+v5emDX+fuuTlLhhwsEYIBAAAAAAAAXpclGR8OuXP0TR4cPM/9z/+SRyfNDf/1TZezOp/87KdjzizJZkhO7edMy/w/nAUAAAAAAADg/zaMWcZkP8/ZLsmLacr2/MV8+cnvs/tP5/4FmLjAq1ifcioAAAAASUVORK5CYII=';

/**
 * PptxGenJS: Utility Methods
 */
/**
 * Translates any type of `x`/`y`/`w`/`h` prop to EMU
 * - guaranteed to return a result regardless of undefined, null, etc. (0)
 * - {number} - 12800 (EMU)
 * - {number} - 0.5 (inches)
 * - {string} - "75%"
 * @param {number|string} size - numeric ("5.5") or percentage ("90%")
 * @param {'X' | 'Y'} xyDir - direction
 * @param {PresLayout} layout - presentation layout
 * @returns {number} calculated size
 */
function getSmartParseNumber(size, xyDir, layout) {
    // FIRST: Convert string numeric value if reqd
    if (typeof size === 'string' && !isNaN(Number(size)))
        size = Number(size);
    // CASE 1: Number in inches
    // Assume any number less than 100 is inches
    if (typeof size === 'number' && size < 100)
        return inch2Emu(size);
    // CASE 2: Number is already converted to something other than inches
    // Assume any number greater than 100 sure isnt inches! Just return it (assume value is EMU already).
    if (typeof size === 'number' && size >= 100)
        return size;
    // CASE 3: Percentage (ex: '50%')
    if (typeof size === 'string' && size.includes('%')) {
        if (xyDir && xyDir === 'X')
            return Math.round((parseFloat(size) / 100) * layout.width);
        if (xyDir && xyDir === 'Y')
            return Math.round((parseFloat(size) / 100) * layout.height);
        // Default: Assume width (x/cx)
        return Math.round((parseFloat(size) / 100) * layout.width);
    }
    // LAST: Default value
    return 0;
}
/**
 * Basic UUID Generator Adapted
 * @link https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#answer-2117523
 * @param {string} uuidFormat - UUID format
 * @returns {string} UUID
 */
function getUuid(uuidFormat) {
    return uuidFormat.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
/**
 * Replace special XML characters with HTML-encoded strings
 * @param {string} xml - XML string to encode
 * @returns {string} escaped XML
 */
function encodeXmlEntities(xml) {
    // NOTE: Dont use short-circuit eval here as value c/b "0" (zero) etc.!
    if (typeof xml === 'undefined' || xml == null)
        return '';
    return xml.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
/**
 * Convert inches into EMU
 * @param {number|string} inches - as string or number
 * @returns {number} EMU value
 */
function inch2Emu(inches) {
    // NOTE: Provide Caller Safety: Numbers may get conv<->conv during flight, so be kind and do some simple checks to ensure inches were passed
    // Any value over 100 damn sure isnt inches, so lets assume its in EMU already, therefore, just return the same value
    if (typeof inches === 'number' && inches > 100)
        return inches;
    if (typeof inches === 'string')
        inches = Number(inches.replace(/in*/gi, ''));
    return Math.round(EMU * inches);
}
/**
 * Convert `pt` into points (using `ONEPT`)
 * @param {number|string} pt
 * @returns {number} value in points (`ONEPT`)
 */
function valToPts(pt) {
    var points = Number(pt) || 0;
    return isNaN(points) ? 0 : Math.round(points * ONEPT);
}
/**
 * Convert degrees (0..360) to PowerPoint `rot` value
 * @param {number} d degrees
 * @returns {number} calculated `rot` value
 */
function convertRotationDegrees(d) {
    d = d || 0;
    return Math.round((d > 360 ? d - 360 : d) * 60000);
}
/**
 * Converts component value to hex value
 * @param {number} c - component color
 * @returns {string} hex string
 */
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}
/**
 * Converts RGB colors from css selectors to Hex for Presentation colors
 * @param {number} r - red value
 * @param {number} g - green value
 * @param {number} b - blue value
 * @returns {string} XML string
 */
function rgbToHex(r, g, b) {
    return (componentToHex(r) + componentToHex(g) + componentToHex(b)).toUpperCase();
}
/**  TODO: FUTURE: TODO-4.0:
 * @date 2022-04-10
 * @tldr this s/b a private method with all current calls switched to `genXmlColorSelection()`
 * @desc lots of code calls this method
 * @example [gen-charts.tx] `strXml += '<a:solidFill>' + createColorElement(seriesColor, `<a:alpha val="${Math.round(opts.chartColorsOpacity * 1000)}"/>`) + '</a:solidFill>'`
 * Thi sis wrong. We s/b calling `genXmlColorSelection()` instead as it returns `<a:solidfill>BLAH</a:solidFill>`!!
 */
/**
 * Create either a `a:schemeClr` - (scheme color) or `a:srgbClr` (hexa representation).
 * @param {string|SCHEME_COLORS} colorStr - hexa representation (eg. "FFFF00") or a scheme color constant (eg. pptx.SchemeColor.ACCENT1)
 * @param {string} innerElements - additional elements that adjust the color and are enclosed by the color element
 * @returns {string} XML string
 */
function createColorElement(colorStr, innerElements) {
    var colorVal = (colorStr || '').replace('#', '');
    if (!REGEX_HEX_COLOR.test(colorVal) &&
        colorVal !== SchemeColor.background1 &&
        colorVal !== SchemeColor.background2 &&
        colorVal !== SchemeColor.text1 &&
        colorVal !== SchemeColor.text2 &&
        colorVal !== SchemeColor.accent1 &&
        colorVal !== SchemeColor.accent2 &&
        colorVal !== SchemeColor.accent3 &&
        colorVal !== SchemeColor.accent4 &&
        colorVal !== SchemeColor.accent5 &&
        colorVal !== SchemeColor.accent6) {
        console.warn("\"".concat(colorVal, "\" is not a valid scheme color or hex RGB! \"").concat(DEF_FONT_COLOR, "\" used instead. Only provide 6-digit RGB or 'pptx.SchemeColor' values!"));
        colorVal = DEF_FONT_COLOR;
    }
    var tagName = REGEX_HEX_COLOR.test(colorVal) ? 'srgbClr' : 'schemeClr';
    var colorAttr = 'val="' + (REGEX_HEX_COLOR.test(colorVal) ? colorVal.toUpperCase() : colorVal) + '"';
    return innerElements ? "<a:".concat(tagName, " ").concat(colorAttr, ">").concat(innerElements, "</a:").concat(tagName, ">") : "<a:".concat(tagName, " ").concat(colorAttr, "/>");
}
/**
 * Creates `a:glow` element
 * @param {TextGlowProps} options glow properties
 * @param {TextGlowProps} defaults defaults for unspecified properties in `opts`
 * @see http://officeopenxml.com/drwSp-effects.php
 * { size: 8, color: 'FFFFFF', opacity: 0.75 };
 */
function createGlowElement(options, defaults) {
    var strXml = '';
    var opts = __assign(__assign({}, defaults), options);
    var size = Math.round(opts.size * ONEPT);
    var color = opts.color;
    var opacity = Math.round(opts.opacity * 100000);
    strXml += "<a:glow rad=\"".concat(size, "\">");
    strXml += createColorElement(color, "<a:alpha val=\"".concat(opacity, "\"/>"));
    strXml += '</a:glow>';
    return strXml;
}
/**
 * Create color selection
 * @param {Color | ShapeFillProps | ShapeLineProps} props fill props
 * @returns XML string
 */
function genXmlColorSelection(props) {
    var fillType = 'solid';
    var colorVal = '';
    var internalElements = '';
    var outText = '';
    if (props) {
        if (typeof props === 'string')
            colorVal = props;
        else {
            if (props.type)
                fillType = props.type;
            if (props.color)
                colorVal = props.color;
            if (props.alpha)
                internalElements += "<a:alpha val=\"".concat(Math.round((100 - props.alpha) * 1000), "\"/>"); // DEPRECATED: @deprecated v3.3.0
            if (props.transparency)
                internalElements += "<a:alpha val=\"".concat(Math.round((100 - props.transparency) * 1000), "\"/>");
        }
        switch (fillType) {
            case 'solid':
                outText += "<a:solidFill>".concat(createColorElement(colorVal, internalElements), "</a:solidFill>");
                break;
            default: // @note need a statement as having only "break" is removed by rollup, then tiggers "no-default" js-linter
                outText += '';
                break;
        }
    }
    return outText;
}
/**
 * Get a new rel ID (rId) for charts, media, etc.
 * @param {PresSlide} target - the slide to use
 * @returns {number} count of all current rels plus 1 for the caller to use as its "rId"
 */
function getNewRelId(target) {
    return target._rels.length + target._relsChart.length + target._relsMedia.length + 1;
}
/**
 * Checks shadow options passed by user and performs corrections if needed.
 * @param {ShadowProps} ShadowProps - shadow options
 */
function correctShadowOptions(ShadowProps) {
    if (!ShadowProps || typeof ShadowProps !== 'object') {
        // console.warn("`shadow` options must be an object. Ex: `{shadow: {type:'none'}}`")
        return;
    }
    // OPT: `type`
    if (ShadowProps.type !== 'outer' && ShadowProps.type !== 'inner' && ShadowProps.type !== 'none') {
        console.warn('Warning: shadow.type options are `outer`, `inner` or `none`.');
        ShadowProps.type = 'outer';
    }
    // OPT: `angle`
    if (ShadowProps.angle) {
        // A: REALITY-CHECK
        if (isNaN(Number(ShadowProps.angle)) || ShadowProps.angle < 0 || ShadowProps.angle > 359) {
            console.warn('Warning: shadow.angle can only be 0-359');
            ShadowProps.angle = 270;
        }
        // B: ROBUST: Cast any type of valid arg to int: '12', 12.3, etc. -> 12
        ShadowProps.angle = Math.round(Number(ShadowProps.angle));
    }
    // OPT: `opacity`
    if (ShadowProps.opacity) {
        // A: REALITY-CHECK
        if (isNaN(Number(ShadowProps.opacity)) || ShadowProps.opacity < 0 || ShadowProps.opacity > 1) {
            console.warn('Warning: shadow.opacity can only be 0-1');
            ShadowProps.opacity = 0.75;
        }
        // B: ROBUST: Cast any type of valid arg to int: '12', 12.3, etc. -> 12
        ShadowProps.opacity = Number(ShadowProps.opacity);
    }
    // OPT: `color`
    if (ShadowProps.color) {
        // INCORRECT FORMAT
        if (ShadowProps.color.startsWith('#')) {
            console.warn('Warning: shadow.color should not include hash (#) character, , e.g. "FF0000"');
            ShadowProps.color = ShadowProps.color.replace('#', '');
        }
    }
    return ShadowProps;
}

/**
 * PptxGenJS: Table Generation
 */
/**
 * Break cell text into lines based upon table column width (e.g.: Magic Happens Here(tm))
 * @param {TableCell} cell - table cell
 * @param {number} colWidth - table column width (inches)
 * @return {TableRow[]} - cell's text objects grouped into lines
 */
function parseTextToLines(cell, colWidth, verbose) {
    var _a, _b;
    // FYI: CPL = Width / (font-size / font-constant)
    // FYI: CHAR:2.3, colWidth:10, fontSize:12 => CPL=138, (actual chars per line in PPT)=145 [14.5 CPI]
    // FYI: CHAR:2.3, colWidth:7 , fontSize:12 => CPL= 97, (actual chars per line in PPT)=100 [14.3 CPI]
    // FYI: CHAR:2.3, colWidth:9 , fontSize:16 => CPL= 96, (actual chars per line in PPT)=84  [ 9.3 CPI]
    var FOCO = 2.3 + (((_a = cell.options) === null || _a === void 0 ? void 0 : _a.autoPageCharWeight) ? cell.options.autoPageCharWeight : 0); // Character Constant
    var CPL = Math.floor((colWidth / ONEPT) * EMU) / ((((_b = cell.options) === null || _b === void 0 ? void 0 : _b.fontSize) ? cell.options.fontSize : DEF_FONT_SIZE) / FOCO); // Chars-Per-Line
    var parsedLines = [];
    var inputCells = [];
    var inputLines1 = [];
    var inputLines2 = [];
    /*
        if (cell.options && cell.options.autoPageCharWeight) {
            let CHR1 = 2.3 + (cell.options && cell.options.autoPageCharWeight ? cell.options.autoPageCharWeight : 0) // Character Constant
            let CPL1 = ((colWidth / ONEPT) * EMU) / ((cell.options && cell.options.fontSize ? cell.options.fontSize : DEF_FONT_SIZE) / CHR1) // Chars-Per-Line
            console.log(`cell.options.autoPageCharWeight: '${cell.options.autoPageCharWeight}' => CPL: ${CPL1}`)
            let CHR2 = 2.3 + 0
            let CPL2 = ((colWidth / ONEPT) * EMU) / ((cell.options && cell.options.fontSize ? cell.options.fontSize : DEF_FONT_SIZE) / CHR2) // Chars-Per-Line
            console.log(`cell.options.autoPageCharWeight: '0' => CPL: ${CPL2}`)
        }
    */
    /**
     * EX INPUTS: `cell.text`
     * - string....: "Account Name Column"
     * - object....: { text:"Account Name Column" }
     * - object[]..: [{ text:"Account Name", options:{ bold:true } }, { text:" Column" }]
     * - object[]..: [{ text:"Account Name", options:{ breakLine:true } }, { text:"Input" }]
     */
    /**
     * EX OUTPUTS:
     * - string....: [{ text:"Account Name Column" }]
     * - object....: [{ text:"Account Name Column" }]
     * - object[]..: [{ text:"Account Name", options:{ breakLine:true } }, { text:"Input" }]
     * - object[]..: [{ text:"Account Name", options:{ breakLine:true } }, { text:"Input" }]
     */
    // STEP 1: Ensure inputCells is an array of TableCells
    if (cell.text && cell.text.toString().trim().length === 0) {
        // Allow a single space/whitespace as cell text (user-requested feature)
        inputCells.push({ _type: SLIDE_OBJECT_TYPES.tablecell, text: ' ' });
    }
    else if (typeof cell.text === 'number' || typeof cell.text === 'string') {
        inputCells.push({ _type: SLIDE_OBJECT_TYPES.tablecell, text: (cell.text || '').toString().trim() });
    }
    else if (Array.isArray(cell.text)) {
        inputCells = cell.text;
    }
    if (verbose) {
        console.log('[1/4] inputCells');
        inputCells.forEach(function (cell, idx) { return console.log("[1/4] [".concat(idx + 1, "] cell: ").concat(JSON.stringify(cell))); });
        // console.log('...............................................\n\n')
    }
    // STEP 2: Group table cells into lines based on "\n" or `breakLine` prop
    /**
     * - EX: `[{ text:"Input Output" }, { text:"Extra" }]`                       == 1 line
     * - EX: `[{ text:"Input" }, { text:"Output", options:{ breakLine:true } }]` == 1 line
     * - EX: `[{ text:"Input\nOutput" }]`                                        == 2 lines
     * - EX: `[{ text:"Input", options:{ breakLine:true } }, { text:"Output" }]` == 2 lines
     */
    var newLine = [];
    inputCells.forEach(function (cell) {
        var _a;
        // (this is always true, we just constructed them above, but we need to tell typescript b/c type is still string||Cell[])
        if (typeof cell.text === 'string') {
            if (cell.text.split('\n').length > 1) {
                cell.text.split('\n').forEach(function (textLine) {
                    newLine.push({
                        _type: SLIDE_OBJECT_TYPES.tablecell,
                        text: textLine,
                        options: __assign(__assign({}, cell.options), { breakLine: true }),
                    });
                });
            }
            else {
                newLine.push({
                    _type: SLIDE_OBJECT_TYPES.tablecell,
                    text: cell.text.trim(),
                    options: cell.options,
                });
            }
            if ((_a = cell.options) === null || _a === void 0 ? void 0 : _a.breakLine) {
                if (verbose)
                    console.log("inputCells: new line > ".concat(JSON.stringify(newLine)));
                inputLines1.push(newLine);
                newLine = [];
            }
        }
        // Flush buffer
        if (newLine.length > 0) {
            inputLines1.push(newLine);
            newLine = [];
        }
    });
    if (verbose) {
        console.log("[2/4] inputLines1 (".concat(inputLines1.length, ")"));
        inputLines1.forEach(function (line, idx) { return console.log("[2/4] [".concat(idx + 1, "] line: ").concat(JSON.stringify(line))); });
        // console.log('...............................................\n\n')
    }
    // STEP 3: Tokenize every text object into words (then it's really easy to assemble lines below without having to break text, add its `options`, etc.)
    inputLines1.forEach(function (line) {
        line.forEach(function (cell) {
            var lineCells = [];
            var cellTextStr = String(cell.text); // force convert to string (compiled JS is better with this than a cast)
            var lineWords = cellTextStr.split(' ');
            lineWords.forEach(function (word, idx) {
                var cellProps = __assign({}, cell.options);
                // IMPORTANT: Handle `breakLine` prop - we cannot apply to each word - only apply to very last word!
                if (cellProps === null || cellProps === void 0 ? void 0 : cellProps.breakLine)
                    cellProps.breakLine = idx + 1 === lineWords.length;
                lineCells.push({ _type: SLIDE_OBJECT_TYPES.tablecell, text: word + (idx + 1 < lineWords.length ? ' ' : ''), options: cellProps });
            });
            inputLines2.push(lineCells);
        });
    });
    if (verbose) {
        console.log("[3/4] inputLines2 (".concat(inputLines2.length, ")"));
        inputLines2.forEach(function (line) { return console.log("[3/4] line: ".concat(JSON.stringify(line))); });
        // console.log('...............................................\n\n')
    }
    // STEP 4: Group cells/words into lines based upon space consumed by word letters
    inputLines2.forEach(function (line) {
        var lineCells = [];
        var strCurrLine = '';
        line.forEach(function (word) {
            // A: create new line when horizontal space is exhausted
            if (strCurrLine.length + word.text.length > CPL) {
                // if (verbose) console.log(`STEP 4: New line added: (${strCurrLine.length} + ${word.text.length} > ${CPL})`);
                parsedLines.push(lineCells);
                lineCells = [];
                strCurrLine = '';
            }
            // B: add current word to line cells
            lineCells.push(word);
            // C: add current word to `strCurrLine` which we use to keep track of line's char length
            strCurrLine += word.text.toString();
        });
        // Flush buffer: Only create a line when there's text to avoid empty row
        if (lineCells.length > 0)
            parsedLines.push(lineCells);
    });
    if (verbose) {
        console.log("[4/4] parsedLines (".concat(parsedLines.length, ")"));
        parsedLines.forEach(function (line, idx) { return console.log("[4/4] [Line ".concat(idx + 1, "]:\n").concat(JSON.stringify(line))); });
        console.log('...............................................\n\n');
    }
    // Done:
    return parsedLines;
}
/**
 * Takes an array of table rows and breaks into an array of slides, which contain the calculated amount of table rows that fit on that slide
 * @param {TableCell[][]} tableRows - table rows
 * @param {TableToSlidesProps} tableProps - table2slides properties
 * @param {PresLayout} presLayout - presentation layout
 * @param {SlideLayout} masterSlide - master slide
 * @return {TableRowSlide[]} array of table rows
 */
function getSlidesForTableRows(tableRows, tableProps, presLayout, masterSlide) {
    if (tableRows === void 0) { tableRows = []; }
    if (tableProps === void 0) { tableProps = {}; }
    var arrInchMargins = DEF_SLIDE_MARGIN_IN;
    var emuSlideTabW = EMU * 1;
    var emuSlideTabH = EMU * 1;
    var emuTabCurrH = 0;
    var numCols = 0;
    var tableRowSlides = [];
    var tablePropX = getSmartParseNumber(tableProps.x, 'X', presLayout);
    var tablePropY = getSmartParseNumber(tableProps.y, 'Y', presLayout);
    var tablePropW = getSmartParseNumber(tableProps.w, 'X', presLayout);
    var tablePropH = getSmartParseNumber(tableProps.h, 'Y', presLayout);
    var tableCalcW = tablePropW;
    function calcSlideTabH() {
        var emuStartY = 0;
        if (tableRowSlides.length === 0)
            emuStartY = tablePropY || inch2Emu(arrInchMargins[0]);
        if (tableRowSlides.length > 0)
            emuStartY = inch2Emu(tableProps.autoPageSlideStartY || tableProps.newSlideStartY || arrInchMargins[0]);
        emuSlideTabH = (tablePropH || presLayout.height) - emuStartY - inch2Emu(arrInchMargins[2]);
        // console.log(`| startY .......................................... = ${(emuStartY / EMU).toFixed(1)}`)
        // console.log(`| emuSlideTabH .................................... = ${(emuSlideTabH / EMU).toFixed(1)}`)
        if (tableRowSlides.length > 1) {
            // D: RULE: Use margins for starting point after the initial Slide, not `opt.y` (ISSUE #43, ISSUE #47, ISSUE #48)
            if (typeof tableProps.autoPageSlideStartY === 'number') {
                emuSlideTabH = (tablePropH || presLayout.height) - inch2Emu(tableProps.autoPageSlideStartY + arrInchMargins[2]);
            }
            else if (typeof tableProps.newSlideStartY === 'number') {
                // @deprecated v3.3.0
                emuSlideTabH = (tablePropH || presLayout.height) - inch2Emu(tableProps.newSlideStartY + arrInchMargins[2]);
            }
            else if (tablePropY) {
                emuSlideTabH = (tablePropH || presLayout.height) - inch2Emu((tablePropY / EMU < arrInchMargins[0] ? tablePropY / EMU : arrInchMargins[0]) + arrInchMargins[2]);
                // Use whichever is greater: area between margins or the table H provided (dont shrink usable area - the whole point of over-riding Y on paging is to *increase* usable space)
                if (emuSlideTabH < tablePropH)
                    emuSlideTabH = tablePropH;
            }
        }
    }
    if (tableProps.verbose) {
        console.log('[[VERBOSE MODE]]');
        console.log('|-- TABLE PROPS --------------------------------------------------------|');
        console.log("| presLayout.width ................................ = ".concat((presLayout.width / EMU).toFixed(1)));
        console.log("| presLayout.height ............................... = ".concat((presLayout.height / EMU).toFixed(1)));
        console.log("| tableProps.x .................................... = ".concat(typeof tableProps.x === 'number' ? (tableProps.x / EMU).toFixed(1) : tableProps.x));
        console.log("| tableProps.y .................................... = ".concat(typeof tableProps.y === 'number' ? (tableProps.y / EMU).toFixed(1) : tableProps.y));
        console.log("| tableProps.w .................................... = ".concat(typeof tableProps.w === 'number' ? (tableProps.w / EMU).toFixed(1) : tableProps.w));
        console.log("| tableProps.h .................................... = ".concat(typeof tableProps.h === 'number' ? (tableProps.h / EMU).toFixed(1) : tableProps.h));
        console.log("| tableProps.slideMargin .......................... = ".concat(tableProps.slideMargin ? String(tableProps.slideMargin) : ''));
        console.log("| tableProps.margin ............................... = ".concat(String(tableProps.margin)));
        console.log("| tableProps.colW ................................. = ".concat(String(tableProps.colW)));
        console.log("| tableProps.autoPageSlideStartY .................. = ".concat(tableProps.autoPageSlideStartY));
        console.log("| tableProps.autoPageCharWeight ................... = ".concat(tableProps.autoPageCharWeight));
        console.log('|-- CALCULATIONS -------------------------------------------------------|');
        console.log("| tablePropX ...................................... = ".concat(tablePropX / EMU));
        console.log("| tablePropY ...................................... = ".concat(tablePropY / EMU));
        console.log("| tablePropW ...................................... = ".concat(tablePropW / EMU));
        console.log("| tablePropH ...................................... = ".concat(tablePropH / EMU));
        console.log("| tableCalcW ...................................... = ".concat(tableCalcW / EMU));
    }
    // STEP 1: Calculate margins
    {
        // Important: Use default size as zero cell margin is causing our tables to be too large and touch bottom of slide!
        if (!tableProps.slideMargin && tableProps.slideMargin !== 0)
            tableProps.slideMargin = DEF_SLIDE_MARGIN_IN[0];
        if (masterSlide && typeof masterSlide._margin !== 'undefined') {
            if (Array.isArray(masterSlide._margin))
                arrInchMargins = masterSlide._margin;
            else if (!isNaN(Number(masterSlide._margin))) {
                arrInchMargins = [Number(masterSlide._margin), Number(masterSlide._margin), Number(masterSlide._margin), Number(masterSlide._margin)];
            }
        }
        else if (tableProps.slideMargin || tableProps.slideMargin === 0) {
            if (Array.isArray(tableProps.slideMargin))
                arrInchMargins = tableProps.slideMargin;
            else if (!isNaN(tableProps.slideMargin))
                arrInchMargins = [tableProps.slideMargin, tableProps.slideMargin, tableProps.slideMargin, tableProps.slideMargin];
        }
        if (tableProps.verbose)
            console.log("| arrInchMargins .................................. = [".concat(arrInchMargins.join(', '), "]"));
    }
    // STEP 2: Calculate number of columns
    {
        // NOTE: Cells may have a colspan, so merely taking the length of the [0] (or any other) row is not
        // ....: sufficient to determine column count. Therefore, check each cell for a colspan and total cols as reqd
        var firstRow = tableRows[0] || [];
        firstRow.forEach(function (cell) {
            if (!cell)
                cell = { _type: SLIDE_OBJECT_TYPES.tablecell };
            var cellOpts = cell.options || null;
            numCols += Number((cellOpts === null || cellOpts === void 0 ? void 0 : cellOpts.colspan) ? cellOpts.colspan : 1);
        });
        if (tableProps.verbose)
            console.log("| numCols ......................................... = ".concat(numCols));
    }
    // STEP 3: Calculate width using tableProps.colW if possible
    if (!tablePropW && tableProps.colW) {
        tableCalcW = Array.isArray(tableProps.colW) ? tableProps.colW.reduce(function (p, n) { return p + n; }) * EMU : tableProps.colW * numCols || 0;
        if (tableProps.verbose)
            console.log("| tableCalcW ...................................... = ".concat(tableCalcW / EMU));
    }
    // STEP 4: Calculate usable width now that total usable space is known (`emuSlideTabW`)
    {
        emuSlideTabW = tableCalcW || inch2Emu((tablePropX ? tablePropX / EMU : arrInchMargins[1]) + arrInchMargins[3]);
        if (tableProps.verbose)
            console.log("| emuSlideTabW .................................... = ".concat((emuSlideTabW / EMU).toFixed(1)));
    }
    // STEP 5: Calculate column widths if not provided (emuSlideTabW will be used below to determine lines-per-col)
    if (!tableProps.colW || !Array.isArray(tableProps.colW)) {
        if (tableProps.colW && !isNaN(Number(tableProps.colW))) {
            var arrColW_1 = [];
            var firstRow = tableRows[0] || [];
            firstRow.forEach(function () { return arrColW_1.push(tableProps.colW); });
            tableProps.colW = [];
            arrColW_1.forEach(function (val) {
                if (Array.isArray(tableProps.colW))
                    tableProps.colW.push(val);
            });
        }
        else {
            // No column widths provided? Then distribute cols.
            tableProps.colW = [];
            for (var iCol = 0; iCol < numCols; iCol++) {
                tableProps.colW.push(emuSlideTabW / EMU / numCols);
            }
        }
    }
    // STEP 6: **MAIN** Iterate over rows, add table content, create new slides as rows overflow
    var newTableRowSlide = { rows: [] };
    tableRows.forEach(function (row, iRow) {
        // A: Row variables
        var rowCellLines = [];
        var maxCellMarTopEmu = 0;
        var maxCellMarBtmEmu = 0;
        // B: Create new row in data model, calc `maxCellMar*`
        var currTableRow = [];
        row.forEach(function (cell) {
            var _a, _b, _c, _d;
            currTableRow.push({
                _type: SLIDE_OBJECT_TYPES.tablecell,
                text: [],
                options: cell.options,
            });
            /** FUTURE: DEPRECATED:
             * - Backwards-Compat: Oops! Discovered we were still using points for cell margin before v3.8.0 (UGH!)
             * - We cant introduce a breaking change before v4.0, so...
             */
            if (cell.options.margin && cell.options.margin[0] >= 1) {
                if (((_a = cell.options) === null || _a === void 0 ? void 0 : _a.margin) && cell.options.margin[0] && valToPts(cell.options.margin[0]) > maxCellMarTopEmu)
                    maxCellMarTopEmu = valToPts(cell.options.margin[0]);
                else if ((tableProps === null || tableProps === void 0 ? void 0 : tableProps.margin) && tableProps.margin[0] && valToPts(tableProps.margin[0]) > maxCellMarTopEmu)
                    maxCellMarTopEmu = valToPts(tableProps.margin[0]);
                if (((_b = cell.options) === null || _b === void 0 ? void 0 : _b.margin) && cell.options.margin[2] && valToPts(cell.options.margin[2]) > maxCellMarBtmEmu)
                    maxCellMarBtmEmu = valToPts(cell.options.margin[2]);
                else if ((tableProps === null || tableProps === void 0 ? void 0 : tableProps.margin) && tableProps.margin[2] && valToPts(tableProps.margin[2]) > maxCellMarBtmEmu)
                    maxCellMarBtmEmu = valToPts(tableProps.margin[2]);
            }
            else {
                if (((_c = cell.options) === null || _c === void 0 ? void 0 : _c.margin) && cell.options.margin[0] && inch2Emu(cell.options.margin[0]) > maxCellMarTopEmu)
                    maxCellMarTopEmu = inch2Emu(cell.options.margin[0]);
                else if ((tableProps === null || tableProps === void 0 ? void 0 : tableProps.margin) && tableProps.margin[0] && inch2Emu(tableProps.margin[0]) > maxCellMarTopEmu)
                    maxCellMarTopEmu = inch2Emu(tableProps.margin[0]);
                if (((_d = cell.options) === null || _d === void 0 ? void 0 : _d.margin) && cell.options.margin[2] && inch2Emu(cell.options.margin[2]) > maxCellMarBtmEmu)
                    maxCellMarBtmEmu = inch2Emu(cell.options.margin[2]);
                else if ((tableProps === null || tableProps === void 0 ? void 0 : tableProps.margin) && tableProps.margin[2] && inch2Emu(tableProps.margin[2]) > maxCellMarBtmEmu)
                    maxCellMarBtmEmu = inch2Emu(tableProps.margin[2]);
            }
        });
        // C: Calc usable vertical space/table height. Set default value first, adjust below when necessary.
        calcSlideTabH();
        emuTabCurrH += maxCellMarTopEmu + maxCellMarBtmEmu; // Start row height with margins
        if (tableProps.verbose && iRow === 0)
            console.log("| SLIDE [".concat(tableRowSlides.length, "]: emuSlideTabH ...... = ").concat((emuSlideTabH / EMU).toFixed(1), " "));
        // D: --==[[ BUILD DATA SET ]]==-- (iterate over cells: split text into lines[], set `lineHeight`)
        row.forEach(function (cell, iCell) {
            var _a;
            var newCell = {
                _type: SLIDE_OBJECT_TYPES.tablecell,
                _lines: null,
                _lineHeight: inch2Emu(((((_a = cell.options) === null || _a === void 0 ? void 0 : _a.fontSize) ? cell.options.fontSize : tableProps.fontSize ? tableProps.fontSize : DEF_FONT_SIZE) *
                    (LINEH_MODIFIER + (tableProps.autoPageLineWeight ? tableProps.autoPageLineWeight : 0))) /
                    100),
                text: [],
                options: cell.options,
            };
            // E-1: Exempt cells with `rowspan` from increasing lineHeight (or we could create a new slide when unecessary!)
            if (newCell.options.rowspan)
                newCell._lineHeight = 0;
            // E-2: The parseTextToLines method uses `autoPageCharWeight`, so inherit from table options
            newCell.options.autoPageCharWeight = tableProps.autoPageCharWeight ? tableProps.autoPageCharWeight : null;
            // E-3: **MAIN** Parse cell contents into lines based upon col width, font, etc
            var totalColW = tableProps.colW[iCell];
            if (cell.options.colspan && Array.isArray(tableProps.colW)) {
                totalColW = tableProps.colW.filter(function (_cell, idx) { return idx >= iCell && idx < idx + cell.options.colspan; }).reduce(function (prev, curr) { return prev + curr; });
            }
            // E-4: Create lines based upon available column width
            newCell._lines = parseTextToLines(cell, totalColW, false);
            // E-5: Add cell to array
            rowCellLines.push(newCell);
        });
        /** E: --==[[ PAGE DATA SET ]]==--
         * Add text one-line-a-time to this row's cells until: lines are exhausted OR table height limit is hit
         *
         * Design:
         * - Building cells L-to-R/loop style wont work as one could be 100 lines and another 1 line
         * - Therefore, build the whole row, one-line-at-a-time, across each table columns
         * - Then, when the vertical size limit is hit is by any of the cells, make a new slide and continue adding any remaining lines
         *
         * Implementation:
         * - `rowCellLines` is an array of cells, one for each column in the table, with each cell containing an array of lines
         *
         * Sample Data:
         * - `rowCellLines` ..: [ TableCell, TableCell, TableCell ]
         * - `TableCell` .....: { _type: 'tablecell', _lines: TableCell[], _lineHeight: 10 }
         * - `_lines` ........: [ {_type: 'tablecell', text: 'cell-1,line-1', options: {…}}, {_type: 'tablecell', text: 'cell-1,line-2', options: {…}} }
         * - `_lines` is TableCell[] (the 1-N words in the line)
         * {
         *    _lines: [{ text:'cell-1,line-1' }, { text:'cell-1,line-2' }],                                                     // TOTAL-CELL-HEIGHT = 2
         *    _lines: [{ text:'cell-2,line-1' }, { text:'cell-2,line-2' }],                                                     // TOTAL-CELL-HEIGHT = 2
         *    _lines: [{ text:'cell-3,line-1' }, { text:'cell-3,line-2' }, { text:'cell-3,line-3' }, { text:'cell-3,line-4' }], // TOTAL-CELL-HEIGHT = 4
         * }
         *
         * Example: 2 rows, with the firstrow overflowing onto a new slide
         * SLIDE 1:
         *  |--------|--------|--------|--------|
         *  | line-1 | line-1 | line-1 | line-1 |
         *  |        |        | line-2 |        |
         *  |        |        | line-3 |        |
         *  |--------|--------|--------|--------|
         *
         * SLIDE 2:
         *  |--------|--------|--------|--------|
         *  |        |        | line-4 |        |
         *  |--------|--------|--------|--------|
         *  | line-1 | line-1 | line-1 | line-1 |
         *  |--------|--------|--------|--------|
         */
        if (tableProps.verbose)
            console.log("\n| SLIDE [".concat(tableRowSlides.length, "]: ROW [").concat(iRow, "]: START..."));
        var currCellIdx = 0;
        var emuLineMaxH = 0;
        var isDone = false;
        while (!isDone) {
            var srcCell = rowCellLines[currCellIdx];
            var tgtCell = currTableRow[currCellIdx]; // NOTE: may be redefined below (a new row may be created, thus changing this value)
            // 1: calc emuLineMaxH
            rowCellLines.forEach(function (cell) {
                if (cell._lineHeight >= emuLineMaxH)
                    emuLineMaxH = cell._lineHeight;
            });
            // 2: create a new slide if there is insufficient room for the current row
            if (emuTabCurrH + emuLineMaxH > emuSlideTabH) {
                if (tableProps.verbose) {
                    console.log('\n|-----------------------------------------------------------------------|');
                    // prettier-ignore
                    console.log("|-- NEW SLIDE CREATED (currTabH+currLineH > maxH) => ".concat((emuTabCurrH / EMU).toFixed(2), " + ").concat((srcCell._lineHeight / EMU).toFixed(2), " > ").concat(emuSlideTabH / EMU));
                    console.log('|-----------------------------------------------------------------------|\n\n');
                }
                // A: add current row slide or it will be lost (only if it has rows and text)
                if (currTableRow.length > 0 && currTableRow.map(function (cell) { return cell.text.length; }).reduce(function (p, n) { return p + n; }) > 0)
                    newTableRowSlide.rows.push(currTableRow);
                // B: add current slide to Slides array
                tableRowSlides.push(newTableRowSlide);
                // C: reset working/curr slide to hold rows as they're created
                var newRows = [];
                newTableRowSlide = { rows: newRows };
                // D: reset working/curr row
                currTableRow = [];
                row.forEach(function (cell) { return currTableRow.push({ _type: SLIDE_OBJECT_TYPES.tablecell, text: [], options: cell.options }); });
                // E: Calc usable vertical space/table height now as we may still be in the same row and code above ("C: Calc usable vertical space/table height.") calc may now be invalid
                calcSlideTabH();
                emuTabCurrH += maxCellMarTopEmu + maxCellMarBtmEmu; // Start row height with margins
                if (tableProps.verbose)
                    console.log("| SLIDE [".concat(tableRowSlides.length, "]: emuSlideTabH ...... = ").concat((emuSlideTabH / EMU).toFixed(1), " "));
                // F: reset current table height for this new Slide
                emuTabCurrH = 0;
                // G: handle repeat headers option /or/ Add new empty row to continue current lines into
                if ((tableProps.addHeaderToEach || tableProps.autoPageRepeatHeader) && tableProps._arrObjTabHeadRows) {
                    tableProps._arrObjTabHeadRows.forEach(function (row) {
                        var newHeadRow = [];
                        var maxLineHeight = 0;
                        row.forEach(function (cell) {
                            newHeadRow.push(cell);
                            if (cell._lineHeight > maxLineHeight)
                                maxLineHeight = cell._lineHeight;
                        });
                        newTableRowSlide.rows.push(newHeadRow);
                        emuTabCurrH += maxLineHeight; // TODO: what about margins? dont we need to include cell margin in line height?
                    });
                }
                // WIP: NEW: TEST THIS!!
                tgtCell = currTableRow[currCellIdx];
            }
            // 3: set array of words that comprise this line
            var currLine = srcCell._lines.shift();
            // 4: create new line by adding all words from curr line (or add empty if there are no words to avoid "needs repair" issue triggered when cells have null content)
            if (Array.isArray(tgtCell.text)) {
                if (currLine)
                    tgtCell.text = tgtCell.text.concat(currLine);
                else if (tgtCell.text.length === 0)
                    tgtCell.text = tgtCell.text.concat({ _type: SLIDE_OBJECT_TYPES.tablecell, text: '' });
                // IMPORTANT: ^^^ add empty if there are no words to avoid "needs repair" issue triggered when cells have null content
            }
            // 5: increase table height by the curr line height (if we're on the last column)
            if (currCellIdx === rowCellLines.length - 1)
                emuTabCurrH += emuLineMaxH;
            // 6: advance column/cell index (or circle back to first one to continue adding lines)
            currCellIdx = currCellIdx < rowCellLines.length - 1 ? currCellIdx + 1 : 0;
            // 7: done?
            var brent = rowCellLines.map(function (cell) { return cell._lines.length; }).reduce(function (prev, next) { return prev + next; });
            if (brent === 0)
                isDone = true;
        }
        // F: Flush/capture row buffer before it resets at the top of this loop
        if (currTableRow.length > 0)
            newTableRowSlide.rows.push(currTableRow);
        if (tableProps.verbose) {
            console.log("- SLIDE [".concat(tableRowSlides.length, "]: ROW [").concat(iRow, "]: ...COMPLETE ...... emuTabCurrH = ").concat((emuTabCurrH / EMU).toFixed(2), " ( emuSlideTabH = ").concat((emuSlideTabH / EMU).toFixed(2), " )"));
        }
    });
    // STEP 7: Flush buffer / add final slide
    tableRowSlides.push(newTableRowSlide);
    if (tableProps.verbose) {
        console.log('\n|================================================|');
        console.log("| FINAL: tableRowSlides.length = ".concat(tableRowSlides.length));
        tableRowSlides.forEach(function (slide) { return console.log(slide); });
        console.log('|================================================|\n\n');
    }
    // LAST:
    return tableRowSlides;
}
/**
 * Reproduces an HTML table as a PowerPoint table - including column widths, style, etc. - creates 1 or more slides as needed
 * @param {PptxGenJS} pptx - pptxgenjs instance
 * @param {string} tabEleId - HTMLElementID of the table
 * @param {ITableToSlidesOpts} options - array of options (e.g.: tabsize)
 * @param {SlideLayout} masterSlide - masterSlide
 */
function genTableToSlides(pptx, tabEleId, options, masterSlide) {
    if (options === void 0) { options = {}; }
    var opts = options || {};
    opts.slideMargin = opts.slideMargin || opts.slideMargin === 0 ? opts.slideMargin : 0.5;
    var emuSlideTabW = opts.w || pptx.presLayout.width;
    var arrObjTabHeadRows = [];
    var arrObjTabBodyRows = [];
    var arrObjTabFootRows = [];
    var arrColW = [];
    var arrTabColW = [];
    var arrInchMargins = [0.5, 0.5, 0.5, 0.5]; // TRBL-style
    var intTabW = 0;
    // REALITY-CHECK:
    if (!document.getElementById(tabEleId))
        throw new Error('tableToSlides: Table ID "' + tabEleId + '" does not exist!');
    // STEP 1: Set margins
    if (masterSlide === null || masterSlide === void 0 ? void 0 : masterSlide._margin) {
        if (Array.isArray(masterSlide._margin))
            arrInchMargins = masterSlide._margin;
        else if (!isNaN(masterSlide._margin))
            arrInchMargins = [masterSlide._margin, masterSlide._margin, masterSlide._margin, masterSlide._margin];
        opts.slideMargin = arrInchMargins;
    }
    else if (opts === null || opts === void 0 ? void 0 : opts.slideMargin) {
        if (Array.isArray(opts.slideMargin))
            arrInchMargins = opts.slideMargin;
        else if (!isNaN(opts.slideMargin))
            arrInchMargins = [opts.slideMargin, opts.slideMargin, opts.slideMargin, opts.slideMargin];
    }
    emuSlideTabW = (opts.w ? inch2Emu(opts.w) : pptx.presLayout.width) - inch2Emu(arrInchMargins[1] + arrInchMargins[3]);
    if (opts.verbose) {
        console.log('[[VERBOSE MODE]]');
        console.log('|-- `tableToSlides` ----------------------------------------------------|');
        console.log("| tableProps.h .................................... = ".concat(opts.h));
        console.log("| tableProps.w .................................... = ".concat(opts.w));
        console.log("| pptx.presLayout.width ........................... = ".concat((pptx.presLayout.width / EMU).toFixed(1)));
        console.log("| pptx.presLayout.height .......................... = ".concat((pptx.presLayout.height / EMU).toFixed(1)));
        console.log("| emuSlideTabW .................................... = ".concat((emuSlideTabW / EMU).toFixed(1)));
    }
    // STEP 2: Grab table col widths - just find the first availble row, either thead/tbody/tfoot, others may have colspans, who cares, we only need col widths from 1
    var firstRowCells = document.querySelectorAll("#".concat(tabEleId, " tr:first-child th"));
    if (firstRowCells.length === 0)
        firstRowCells = document.querySelectorAll("#".concat(tabEleId, " tr:first-child td"));
    firstRowCells.forEach(function (cell) {
        if (cell.getAttribute('colspan')) {
            // Guesstimate (divide evenly) col widths
            // NOTE: both j$query and vanilla selectors return {0} when table is not visible)
            for (var idxc = 0; idxc < Number(cell.getAttribute('colspan')); idxc++) {
                arrTabColW.push(Math.round(cell.offsetWidth / Number(cell.getAttribute('colspan'))));
            }
        }
        else {
            arrTabColW.push(cell.offsetWidth);
        }
    });
    arrTabColW.forEach(function (colW) {
        intTabW += colW;
    });
    // STEP 3: Calc/Set column widths by using same column width percent from HTML table
    arrTabColW.forEach(function (colW, idxW) {
        var intCalcWidth = Number(((Number(emuSlideTabW) * ((colW / intTabW) * 100)) / 100 / EMU).toFixed(2));
        var intMinWidth = 0;
        var colSelectorMin = document.querySelector("#".concat(tabEleId, " thead tr:first-child th:nth-child(").concat(idxW + 1, ")"));
        if (colSelectorMin)
            intMinWidth = Number(colSelectorMin.getAttribute('data-pptx-min-width'));
        var colSelectorSet = document.querySelector("#".concat(tabEleId, " thead tr:first-child th:nth-child(").concat(idxW + 1, ")"));
        if (colSelectorSet)
            intMinWidth = Number(colSelectorSet.getAttribute('data-pptx-width'));
        arrColW.push((intMinWidth > intCalcWidth ? intMinWidth : intCalcWidth));
    });
    if (opts.verbose) {
        console.log("| arrColW ......................................... = [".concat(arrColW.join(', '), "]"));
    }
    // STEP 4: Iterate over each table element and create data arrays (text and opts)
    // NOTE: We create 3 arrays instead of one so we can loop over body then show header/footer rows on first and last page
    var tableParts = ['thead', 'tbody', 'tfoot'];
    tableParts.forEach(function (part) {
        document.querySelectorAll("#".concat(tabEleId, " ").concat(part, " tr")).forEach(function (row) {
            var arrObjTabCells = [];
            Array.from(row.cells).forEach(function (cell) {
                // A: Get RGB text/bkgd colors
                var arrRGB1 = window.getComputedStyle(cell).getPropertyValue('color').replace(/\s+/gi, '').replace('rgba(', '').replace('rgb(', '').replace(')', '').split(',');
                var arrRGB2 = window
                    .getComputedStyle(cell)
                    .getPropertyValue('background-color')
                    .replace(/\s+/gi, '')
                    .replace('rgba(', '')
                    .replace('rgb(', '')
                    .replace(')', '')
                    .split(',');
                if (
                // NOTE: (ISSUE#57): Default for unstyled tables is black bkgd, so use white instead
                window.getComputedStyle(cell).getPropertyValue('background-color') === 'rgba(0, 0, 0, 0)' ||
                    window.getComputedStyle(cell).getPropertyValue('transparent')) {
                    arrRGB2 = ['255', '255', '255'];
                }
                // B: Create option object
                var cellOpts = {
                    align: null,
                    bold: !!(window.getComputedStyle(cell).getPropertyValue('font-weight') === 'bold' ||
                        Number(window.getComputedStyle(cell).getPropertyValue('font-weight')) >= 500),
                    border: null,
                    color: rgbToHex(Number(arrRGB1[0]), Number(arrRGB1[1]), Number(arrRGB1[2])),
                    fill: { color: rgbToHex(Number(arrRGB2[0]), Number(arrRGB2[1]), Number(arrRGB2[2])) },
                    fontFace: (window.getComputedStyle(cell).getPropertyValue('font-family') || '').split(',')[0].replace(/"/g, '').replace('inherit', '').replace('initial', '') ||
                        null,
                    fontSize: Number(window.getComputedStyle(cell).getPropertyValue('font-size').replace(/[a-z]/gi, '')),
                    margin: null,
                    colspan: Number(cell.getAttribute('colspan')) || null,
                    rowspan: Number(cell.getAttribute('rowspan')) || null,
                    valign: null,
                };
                if (['left', 'center', 'right', 'start', 'end'].includes(window.getComputedStyle(cell).getPropertyValue('text-align'))) {
                    var align = window.getComputedStyle(cell).getPropertyValue('text-align').replace('start', 'left').replace('end', 'right');
                    cellOpts.align = align === 'center' ? 'center' : align === 'left' ? 'left' : align === 'right' ? 'right' : null;
                }
                if (['top', 'middle', 'bottom'].includes(window.getComputedStyle(cell).getPropertyValue('vertical-align'))) {
                    var valign = window.getComputedStyle(cell).getPropertyValue('vertical-align');
                    cellOpts.valign = valign === 'top' ? 'top' : valign === 'middle' ? 'middle' : valign === 'bottom' ? 'bottom' : null;
                }
                // C: Add padding [margin] (if any)
                // NOTE: Margins translate: px->pt 1:1 (e.g.: a 20px padded cell looks the same in PPTX as 20pt Text Inset/Padding)
                if (window.getComputedStyle(cell).getPropertyValue('padding-left')) {
                    cellOpts.margin = [0, 0, 0, 0];
                    var sidesPad = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'];
                    sidesPad.forEach(function (val, idxs) {
                        cellOpts.margin[idxs] = Math.round(Number(window.getComputedStyle(cell).getPropertyValue(val).replace(/\D/gi, '')));
                    });
                }
                // D: Add border (if any)
                if (window.getComputedStyle(cell).getPropertyValue('border-top-width') ||
                    window.getComputedStyle(cell).getPropertyValue('border-right-width') ||
                    window.getComputedStyle(cell).getPropertyValue('border-bottom-width') ||
                    window.getComputedStyle(cell).getPropertyValue('border-left-width')) {
                    cellOpts.border = [null, null, null, null];
                    var sidesBor = ['top', 'right', 'bottom', 'left'];
                    sidesBor.forEach(function (val, idxb) {
                        var intBorderW = Math.round(Number(window
                            .getComputedStyle(cell)
                            .getPropertyValue('border-' + val + '-width')
                            .replace('px', '')));
                        var arrRGB = [];
                        arrRGB = window
                            .getComputedStyle(cell)
                            .getPropertyValue('border-' + val + '-color')
                            .replace(/\s+/gi, '')
                            .replace('rgba(', '')
                            .replace('rgb(', '')
                            .replace(')', '')
                            .split(',');
                        var strBorderC = rgbToHex(Number(arrRGB[0]), Number(arrRGB[1]), Number(arrRGB[2]));
                        cellOpts.border[idxb] = { pt: intBorderW, color: strBorderC };
                    });
                }
                // LAST: Add cell
                arrObjTabCells.push({
                    _type: SLIDE_OBJECT_TYPES.tablecell,
                    text: cell.innerText,
                    options: cellOpts,
                });
            });
            switch (part) {
                case 'thead':
                    arrObjTabHeadRows.push(arrObjTabCells);
                    break;
                case 'tbody':
                    arrObjTabBodyRows.push(arrObjTabCells);
                    break;
                case 'tfoot':
                    arrObjTabFootRows.push(arrObjTabCells);
                    break;
                default:
                    console.log("table parsing: unexpected table part: ".concat(part));
                    break;
            }
        });
    });
    // STEP 5: Break table into Slides as needed
    // Pass head-rows as there is an option to add to each table and the parse func needs this data to fulfill that option
    opts._arrObjTabHeadRows = arrObjTabHeadRows || null;
    opts.colW = arrColW;
    getSlidesForTableRows(__spreadArray(__spreadArray(__spreadArray([], arrObjTabHeadRows, true), arrObjTabBodyRows, true), arrObjTabFootRows, true), opts, pptx.presLayout, masterSlide).forEach(function (slide, idxTr) {
        // A: Create new Slide
        var newSlide = pptx.addSlide({ masterName: opts.masterSlideName || null });
        // B: DESIGN: Reset `y` to startY or margin after first Slide (ISSUE#43, ISSUE#47, ISSUE#48)
        if (idxTr === 0)
            opts.y = opts.y || arrInchMargins[0];
        if (idxTr > 0)
            opts.y = opts.autoPageSlideStartY || opts.newSlideStartY || arrInchMargins[0];
        if (opts.verbose)
            console.log("| opts.autoPageSlideStartY: ".concat(opts.autoPageSlideStartY, " / arrInchMargins[0]: ").concat(arrInchMargins[0], " => opts.y = ").concat(opts.y));
        // C: Add table to Slide
        newSlide.addTable(slide.rows, { x: opts.x || arrInchMargins[3], y: opts.y, w: Number(emuSlideTabW) / EMU, colW: arrColW, autoPage: false });
        // D: Add any additional objects
        if (opts.addImage) {
            opts.addImage.options = opts.addImage.options || {};
            if (!opts.addImage.image || (!opts.addImage.image.path && !opts.addImage.image.data)) {
                console.warn('Warning: tableToSlides.addImage requires either `path` or `data`');
            }
            else {
                newSlide.addImage({
                    path: opts.addImage.image.path,
                    data: opts.addImage.image.data,
                    x: opts.addImage.options.x,
                    y: opts.addImage.options.y,
                    w: opts.addImage.options.w,
                    h: opts.addImage.options.h,
                });
            }
        }
        if (opts.addShape)
            newSlide.addShape(opts.addShape.shapeName, opts.addShape.options || {});
        if (opts.addTable)
            newSlide.addTable(opts.addTable.rows, opts.addTable.options || {});
        if (opts.addText)
            newSlide.addText(opts.addText.text, opts.addText.options || {});
    });
}

/**
 * PptxGenJS: Slide Object Generators
 */
/** counter for included charts (used for index in their filenames) */
var _chartCounter = 0;
/**
 * Transforms a slide definition to a slide object that is then passed to the XML transformation process.
 * @param {SlideMasterProps} props - slide definition
 * @param {PresSlide|SlideLayout} target - empty slide object that should be updated by the passed definition
 */
function createSlideMaster(props, target) {
    // STEP 1: Add background if either the slide or layout has background props
    // if (props.background || target.background) addBackgroundDefinition(props.background, target)
    if (props.bkgd)
        target.bkgd = props.bkgd; // DEPRECATED: (remove in v4.0.0)
    // STEP 2: Add all Slide Master objects in the order they were given
    if (props.objects && Array.isArray(props.objects) && props.objects.length > 0) {
        props.objects.forEach(function (object, idx) {
            var key = Object.keys(object)[0];
            var tgt = target;
            if (MASTER_OBJECTS[key] && key === 'chart')
                addChartDefinition(tgt, object[key].type, object[key].data, object[key].opts);
            else if (MASTER_OBJECTS[key] && key === 'image')
                addImageDefinition(tgt, object[key]);
            else if (MASTER_OBJECTS[key] && key === 'line')
                addShapeDefinition(tgt, SHAPE_TYPE.LINE, object[key]);
            else if (MASTER_OBJECTS[key] && key === 'rect')
                addShapeDefinition(tgt, SHAPE_TYPE.RECTANGLE, object[key]);
            else if (MASTER_OBJECTS[key] && key === 'text')
                addTextDefinition(tgt, [{ text: object[key].text }], object[key].options, false);
            else if (MASTER_OBJECTS[key] && key === 'placeholder') {
                // TODO: 20180820: Check for existing `name`?
                object[key].options.placeholder = object[key].options.name;
                delete object[key].options.name; // remap name for earier handling internally
                object[key].options._placeholderType = object[key].options.type;
                delete object[key].options.type; // remap name for earier handling internally
                object[key].options._placeholderIdx = 100 + idx;
                addTextDefinition(tgt, [{ text: object[key].text }], object[key].options, true);
                // TODO: ISSUE#599 - only text is suported now (add more below)
                // else if (object[key].image) addImageDefinition(tgt, object[key].image)
                /* 20200120: So... image placeholders go into the "slideLayoutN.xml" file and addImage doesnt do this yet...
                    <p:sp>
                  <p:nvSpPr>
                    <p:cNvPr id="7" name="Picture Placeholder 6">
                      <a:extLst>
                        <a:ext uri="{FF2B5EF4-FFF2-40B4-BE49-F238E27FC236}">
                          <a16:creationId xmlns:a16="http://schemas.microsoft.com/office/drawing/2014/main" id="{CE1AE45D-8641-0F4F-BDB5-080E69CCB034}"/>
                        </a:ext>
                      </a:extLst>
                    </p:cNvPr>
                    <p:cNvSpPr>
                */
            }
        });
    }
    // STEP 3: Add Slide Numbers (NOTE: Do this last so numbers are not covered by objects!)
    if (props.slideNumber && typeof props.slideNumber === 'object')
        target._slideNumberProps = props.slideNumber;
}
/**
 * Generate the chart based on input data.
 * OOXML Chart Spec: ISO/IEC 29500-1:2016(E)
 *
 * @param {CHART_NAME | IChartMulti[]} `type` should belong to: 'column', 'pie'
 * @param {[]} `data` a JSON object with follow the following format
 * @param {IChartOptsLib} `opt` chart options
 * @param {PresSlide} `target` slide object that the chart will be added to
 * @return {object} chart object
 * {
 *    title: 'eSurvey chart',
 *    data: [
 *        {
 *            name: 'Income',
 *            labels: ['2005', '2006', '2007', '2008', '2009'],
 *            values: [23.5, 26.2, 30.1, 29.5, 24.6]
 *        },
 *        {
 *            name: 'Expense',
 *            labels: ['2005', '2006', '2007', '2008', '2009'],
 *            values: [18.1, 22.8, 23.9, 25.1, 25]
 *        }
 *    ]
 * }
 */
function addChartDefinition(target, type, data, opt) {
    var _a;
    function correctGridLineOptions(glOpts) {
        if (!glOpts || glOpts.style === 'none')
            return;
        if (glOpts.size !== undefined && (isNaN(Number(glOpts.size)) || glOpts.size <= 0)) {
            console.warn('Warning: chart.gridLine.size must be greater than 0.');
            delete glOpts.size; // delete prop to used defaults
        }
        if (glOpts.style && !['solid', 'dash', 'dot'].includes(glOpts.style)) {
            console.warn('Warning: chart.gridLine.style options: `solid`, `dash`, `dot`.');
            delete glOpts.style;
        }
        if (glOpts.cap && !['flat', 'square', 'round'].includes(glOpts.cap)) {
            console.warn('Warning: chart.gridLine.cap options: `flat`, `square`, `round`.');
            delete glOpts.cap;
        }
    }
    var chartId = ++_chartCounter;
    var resultObject = {
        _type: null,
        text: null,
        options: null,
        chartRid: null,
    };
    // DESIGN: `type` can an object (ex: `pptx.charts.DOUGHNUT`) or an array of chart objects
    // EX: addChartDefinition([ { type:pptx.charts.BAR, data:{name:'', labels:[], values[]} }, {<etc>} ])
    // Multi-Type Charts
    var tmpOpt = null;
    var tmpData = [];
    if (Array.isArray(type)) {
        // For multi-type charts there needs to be data for each type,
        // as well as a single data source for non-series operations.
        // The data is indexed below to keep the data in order when segmented
        // into types.
        type.forEach(function (obj) {
            tmpData = tmpData.concat(obj.data);
        });
        tmpOpt = data || opt;
    }
    else {
        tmpData = data;
        tmpOpt = opt;
    }
    tmpData.forEach(function (item, i) {
        item._dataIndex = i;
        // Converts the 'labels' array from string[] to string[][] (or the respective primitive type), if needed
        if (item.labels !== undefined && !Array.isArray(item.labels[0])) {
            item.labels = [item.labels];
        }
    });
    var options = tmpOpt && typeof tmpOpt === 'object' ? tmpOpt : {};
    // STEP 1: TODO: check for reqd fields, correct type, etc
    // `type` exists in CHART_TYPE
    // Array.isArray(data)
    /*
        if ( Array.isArray(rel.data) && rel.data.length > 0 && typeof rel.data[0] === 'object'
            && rel.data[0].labels && Array.isArray(rel.data[0].labels)
            && rel.data[0].values && Array.isArray(rel.data[0].values) ) {
            obj = rel.data[0];
        }
        else {
            console.warn("USAGE: addChart( 'pie', [ {name:'Sales', labels:['Jan','Feb'], values:[10,20]} ], {x:1, y:1} )");
            return;
        }
        */
    // STEP 2: Set default options/decode user options
    // A: Core
    options._type = type;
    options.x = typeof options.x !== 'undefined' && options.x != null && !isNaN(Number(options.x)) ? options.x : 1;
    options.y = typeof options.y !== 'undefined' && options.y != null && !isNaN(Number(options.y)) ? options.y : 1;
    options.w = options.w || '50%';
    options.h = options.h || '50%';
    options.objectName = options.objectName
        ? encodeXmlEntities(options.objectName)
        : "Chart ".concat(target._slideObjects.filter(function (obj) { return obj._type === SLIDE_OBJECT_TYPES.chart; }).length);
    // B: Options: misc
    if (!['bar', 'col'].includes(options.barDir || ''))
        options.barDir = 'col';
    // barGrouping: "21.2.3.17 ST_Grouping (Grouping)"
    // barGrouping must be handled before data label validation as it can affect valid label positioning
    if (options._type === CHART_TYPE.AREA) {
        if (!['stacked', 'standard', 'percentStacked'].includes(options.barGrouping || ''))
            options.barGrouping = 'standard';
    }
    if (options._type === CHART_TYPE.BAR) {
        if (!['clustered', 'stacked', 'percentStacked'].includes(options.barGrouping || ''))
            options.barGrouping = 'clustered';
    }
    if (options._type === CHART_TYPE.BAR3D) {
        if (!['clustered', 'stacked', 'standard', 'percentStacked'].includes(options.barGrouping || ''))
            options.barGrouping = 'standard';
    }
    if ((_a = options.barGrouping) === null || _a === void 0 ? void 0 : _a.includes('tacked')) {
        if (!options.barGapWidthPct)
            options.barGapWidthPct = 50;
    }
    // Clean up and validate data label positions
    // REFERENCE: https://docs.microsoft.com/en-us/openspecs/office_standards/ms-oi29500/e2b1697c-7adc-463d-9081-3daef72f656f?redirectedfrom=MSDN
    if (options.dataLabelPosition) {
        if (options._type === CHART_TYPE.AREA || options._type === CHART_TYPE.BAR3D || options._type === CHART_TYPE.DOUGHNUT || options._type === CHART_TYPE.RADAR) {
            delete options.dataLabelPosition;
        }
        if (options._type === CHART_TYPE.PIE) {
            if (!['bestFit', 'ctr', 'inEnd', 'outEnd'].includes(options.dataLabelPosition))
                delete options.dataLabelPosition;
        }
        if (options._type === CHART_TYPE.BUBBLE || options._type === CHART_TYPE.BUBBLE3D || options._type === CHART_TYPE.LINE || options._type === CHART_TYPE.SCATTER) {
            if (!['b', 'ctr', 'l', 'r', 't'].includes(options.dataLabelPosition))
                delete options.dataLabelPosition;
        }
        if (options._type === CHART_TYPE.BAR) {
            if (!['stacked', 'percentStacked'].includes(options.barGrouping || '')) {
                if (!['ctr', 'inBase', 'inEnd'].includes(options.dataLabelPosition))
                    delete options.dataLabelPosition;
            }
            if (!['clustered'].includes(options.barGrouping || '')) {
                if (!['ctr', 'inBase', 'inEnd', 'outEnd'].includes(options.dataLabelPosition))
                    delete options.dataLabelPosition;
            }
        }
    }
    options.dataLabelBkgrdColors = options.dataLabelBkgrdColors || !options.dataLabelBkgrdColors ? options.dataLabelBkgrdColors : false;
    if (!['b', 'l', 'r', 't', 'tr'].includes(options.legendPos || ''))
        options.legendPos = 'r';
    // 3D bar: ST_Shape
    if (!['cone', 'coneToMax', 'box', 'cylinder', 'pyramid', 'pyramidToMax'].includes(options.bar3DShape || ''))
        options.bar3DShape = 'box';
    // lineDataSymbol: http://www.datypic.com/sc/ooxml/a-val-32.html
    // Spec has [plus,star,x] however neither PPT2013 nor PPT-Online support them
    if (!['circle', 'dash', 'diamond', 'dot', 'none', 'square', 'triangle'].includes(options.lineDataSymbol || ''))
        options.lineDataSymbol = 'circle';
    if (!['gap', 'span'].includes(options.displayBlanksAs || ''))
        options.displayBlanksAs = 'span';
    if (!['standard', 'marker', 'filled'].includes(options.radarStyle || ''))
        options.radarStyle = 'standard';
    options.lineDataSymbolSize = options.lineDataSymbolSize && !isNaN(options.lineDataSymbolSize) ? options.lineDataSymbolSize : 6;
    options.lineDataSymbolLineSize = options.lineDataSymbolLineSize && !isNaN(options.lineDataSymbolLineSize) ? valToPts(options.lineDataSymbolLineSize) : valToPts(0.75);
    // `layout` allows the override of PPT defaults to maximize space
    if (options.layout) {
        ['x', 'y', 'w', 'h'].forEach(function (key) {
            var val = options.layout[key];
            if (isNaN(Number(val)) || val < 0 || val > 1) {
                console.warn('Warning: chart.layout.' + key + ' can only be 0-1');
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete options.layout[key]; // remove invalid value so that default will be used
            }
        });
    }
    // Set gridline defaults
    options.catGridLine = options.catGridLine || (options._type === CHART_TYPE.SCATTER ? { color: 'D9D9D9', size: 1 } : { style: 'none' });
    options.valGridLine = options.valGridLine || (options._type === CHART_TYPE.SCATTER ? { color: 'D9D9D9', size: 1 } : {});
    options.serGridLine = options.serGridLine || (options._type === CHART_TYPE.SCATTER ? { color: 'D9D9D9', size: 1 } : { style: 'none' });
    correctGridLineOptions(options.catGridLine);
    correctGridLineOptions(options.valGridLine);
    correctGridLineOptions(options.serGridLine);
    correctShadowOptions(options.shadow);
    // C: Options: plotArea
    options.showDataTable = options.showDataTable || !options.showDataTable ? options.showDataTable : false;
    options.showDataTableHorzBorder = options.showDataTableHorzBorder || !options.showDataTableHorzBorder ? options.showDataTableHorzBorder : true;
    options.showDataTableVertBorder = options.showDataTableVertBorder || !options.showDataTableVertBorder ? options.showDataTableVertBorder : true;
    options.showDataTableOutline = options.showDataTableOutline || !options.showDataTableOutline ? options.showDataTableOutline : true;
    options.showDataTableKeys = options.showDataTableKeys || !options.showDataTableKeys ? options.showDataTableKeys : true;
    options.showLabel = options.showLabel || !options.showLabel ? options.showLabel : false;
    options.showLegend = options.showLegend || !options.showLegend ? options.showLegend : false;
    options.showPercent = options.showPercent || !options.showPercent ? options.showPercent : true;
    options.showTitle = options.showTitle || !options.showTitle ? options.showTitle : false;
    options.showValue = options.showValue || !options.showValue ? options.showValue : false;
    options.showLeaderLines = options.showLeaderLines || !options.showLeaderLines ? options.showLeaderLines : false;
    options.catAxisLineShow = typeof options.catAxisLineShow !== 'undefined' ? options.catAxisLineShow : true;
    options.valAxisLineShow = typeof options.valAxisLineShow !== 'undefined' ? options.valAxisLineShow : true;
    options.serAxisLineShow = typeof options.serAxisLineShow !== 'undefined' ? options.serAxisLineShow : true;
    options.v3DRotX = !isNaN(options.v3DRotX) && options.v3DRotX >= -90 && options.v3DRotX <= 90 ? options.v3DRotX : 30;
    options.v3DRotY = !isNaN(options.v3DRotY) && options.v3DRotY >= 0 && options.v3DRotY <= 360 ? options.v3DRotY : 30;
    options.v3DRAngAx = options.v3DRAngAx || !options.v3DRAngAx ? options.v3DRAngAx : true;
    options.v3DPerspective = !isNaN(options.v3DPerspective) && options.v3DPerspective >= 0 && options.v3DPerspective <= 240 ? options.v3DPerspective : 30;
    // D: Options: chart
    options.barGapWidthPct = !isNaN(options.barGapWidthPct) && options.barGapWidthPct >= 0 && options.barGapWidthPct <= 1000 ? options.barGapWidthPct : 150;
    options.barGapDepthPct = !isNaN(options.barGapDepthPct) && options.barGapDepthPct >= 0 && options.barGapDepthPct <= 1000 ? options.barGapDepthPct : 150;
    options.chartColors = Array.isArray(options.chartColors)
        ? options.chartColors
        : options._type === CHART_TYPE.PIE || options._type === CHART_TYPE.DOUGHNUT
            ? PIECHART_COLORS
            : BARCHART_COLORS;
    options.chartColorsOpacity = options.chartColorsOpacity && !isNaN(options.chartColorsOpacity) ? options.chartColorsOpacity : null;
    // DEPRECATED: v3.11.0 - use `plotArea.border` vvv
    options.border = options.border && typeof options.border === 'object' ? options.border : null;
    if (options.border && (!options.border.pt || isNaN(options.border.pt)))
        options.border.pt = DEF_CHART_BORDER.pt;
    if (options.border && (!options.border.color || typeof options.border.color !== 'string'))
        options.border.color = DEF_CHART_BORDER.color;
    // DEPRECATED: (remove above in v4.0) ^^^
    options.plotArea = options.plotArea || {};
    options.plotArea.border = options.plotArea.border && typeof options.plotArea.border === 'object' ? options.plotArea.border : null;
    if (options.plotArea.border && (!options.plotArea.border.pt || isNaN(options.plotArea.border.pt)))
        options.plotArea.border.pt = DEF_CHART_BORDER.pt;
    if (options.plotArea.border && (!options.plotArea.border.color || typeof options.plotArea.border.color !== 'string')) {
        options.plotArea.border.color = DEF_CHART_BORDER.color;
    }
    if (options.border)
        options.plotArea.border = options.border; // @deprecated [[remove in v4.0]]
    options.plotArea.fill = options.plotArea.fill || { color: null, transparency: null };
    if (options.fill)
        options.plotArea.fill.color = options.fill; // @deprecated [[remove in v4.0]]
    //
    options.chartArea = options.chartArea || {};
    options.chartArea.border = options.chartArea.border && typeof options.chartArea.border === 'object' ? options.chartArea.border : null;
    if (options.chartArea.border) {
        options.chartArea.border = {
            color: options.chartArea.border.color || DEF_CHART_BORDER.color,
            pt: options.chartArea.border.pt || DEF_CHART_BORDER.pt,
        };
    }
    options.chartArea.roundedCorners = typeof options.chartArea.roundedCorners === 'boolean' ? options.chartArea.roundedCorners : true;
    //
    options.dataBorder = options.dataBorder && typeof options.dataBorder === 'object' ? options.dataBorder : null;
    if (options.dataBorder && (!options.dataBorder.pt || isNaN(options.dataBorder.pt)))
        options.dataBorder.pt = 0.75;
    if (options.dataBorder && (!options.dataBorder.color || typeof options.dataBorder.color !== 'string' || options.dataBorder.color.length !== 6)) {
        options.dataBorder.color = 'F9F9F9';
    }
    //
    if (!options.dataLabelFormatCode && options._type === CHART_TYPE.SCATTER)
        options.dataLabelFormatCode = 'General';
    if (!options.dataLabelFormatCode && (options._type === CHART_TYPE.PIE || options._type === CHART_TYPE.DOUGHNUT)) {
        options.dataLabelFormatCode = options.showPercent ? '0%' : 'General';
    }
    options.dataLabelFormatCode = options.dataLabelFormatCode && typeof options.dataLabelFormatCode === 'string' ? options.dataLabelFormatCode : '#,##0';
    //
    // Set default format for Scatter chart labels to custom string if not defined
    if (!options.dataLabelFormatScatter && options._type === CHART_TYPE.SCATTER)
        options.dataLabelFormatScatter = 'custom';
    //
    options.lineSize = typeof options.lineSize === 'number' ? options.lineSize : 2;
    options.valAxisMajorUnit = typeof options.valAxisMajorUnit === 'number' ? options.valAxisMajorUnit : null;
    if (options._type === CHART_TYPE.AREA || options._type === CHART_TYPE.BAR || options._type === CHART_TYPE.BAR3D || options._type === CHART_TYPE.LINE) {
        options.catAxisMultiLevelLabels = !!options.catAxisMultiLevelLabels;
    }
    else {
        delete options.catAxisMultiLevelLabels;
    }
    // STEP 4: Set props
    resultObject._type = 'chart';
    resultObject.options = options;
    resultObject.chartRid = getNewRelId(target);
    // STEP 5: Add this chart to this Slide Rels (rId/rels count spans all slides! Count all images to get next rId)
    target._relsChart.push({
        rId: getNewRelId(target),
        data: tmpData,
        opts: options,
        type: options._type,
        globalId: chartId,
        fileName: "chart".concat(chartId, ".xml"),
        Target: "/ppt/charts/chart".concat(chartId, ".xml"),
    });
    target._slideObjects.push(resultObject);
    return resultObject;
}
/**
 * Adds an image object to a slide definition.
 * This method can be called with only two args (opt, target) - this is supposed to be the only way in future.
 * @param {ImageProps} `opt` - object containing `path`/`data`, `x`, `y`, etc.
 * @param {PresSlide} `target` - slide that the image should be added to (if not specified as the 2nd arg)
 * @note: Remote images (eg: "http://whatev.com/blah"/from web and/or remote server arent supported yet - we'd need to create an <img>, load it, then send to canvas
 * @see: https://stackoverflow.com/questions/164181/how-to-fetch-a-remote-image-to-display-in-a-canvas)
 */
function addImageDefinition(target, opt) {
    var newObject = {
        _type: null,
        text: null,
        options: null,
        image: null,
        imageRid: null,
        hyperlink: null,
    };
    // FIRST: Set vars for this image (object param replaces positional args in 1.1.0)
    var intPosX = opt.x || 0;
    var intPosY = opt.y || 0;
    var intWidth = opt.w || 0;
    var intHeight = opt.h || 0;
    var sizing = opt.sizing || null;
    var objHyperlink = opt.hyperlink || '';
    var strImageData = opt.data || '';
    var strImagePath = opt.path || '';
    var imageRelId = getNewRelId(target);
    var objectName = opt.objectName ? encodeXmlEntities(opt.objectName) : "Image ".concat(target._slideObjects.filter(function (obj) { return obj._type === SLIDE_OBJECT_TYPES.image; }).length);
    // REALITY-CHECK:
    if (!strImagePath && !strImageData) {
        console.error('ERROR: addImage() requires either \'data\' or \'path\' parameter!');
        return null;
    }
    else if (strImagePath && typeof strImagePath !== 'string') {
        console.error("ERROR: addImage() 'path' should be a string, ex: {path:'/img/sample.png'} - you sent ".concat(String(strImagePath)));
        return null;
    }
    else if (strImageData && typeof strImageData !== 'string') {
        console.error("ERROR: addImage() 'data' should be a string, ex: {data:'image/png;base64,NMP[...]'} - you sent ".concat(String(strImageData)));
        return null;
    }
    else if (strImageData && typeof strImageData === 'string' && !strImageData.toLowerCase().includes('base64,')) {
        console.error('ERROR: Image `data` value lacks a base64 header! Ex: \'image/png;base64,NMP[...]\')');
        return null;
    }
    // STEP 1: Set extension
    // NOTE: Split to address URLs with params (eg: `path/brent.jpg?someParam=true`)
    var strImgExtn = (strImagePath
        .substring(strImagePath.lastIndexOf('/') + 1)
        .split('?')[0]
        .split('.')
        .pop()
        .split('#')[0] || 'png').toLowerCase();
    // However, pre-encoded images can be whatever mime-type they want (and good for them!)
    if (strImageData && /image\/(\w+);/.exec(strImageData) && /image\/(\w+);/.exec(strImageData).length > 0) {
        strImgExtn = /image\/(\w+);/.exec(strImageData)[1];
    }
    else if (strImageData === null || strImageData === void 0 ? void 0 : strImageData.toLowerCase().includes('image/svg+xml')) {
        strImgExtn = 'svg';
    }
    // STEP 2: Set type/path
    newObject._type = SLIDE_OBJECT_TYPES.image;
    newObject.image = strImagePath || 'preencoded.png';
    // STEP 3: Set image properties & options
    // FIXME: Measure actual image when no intWidth/intHeight params passed
    // ....: This is an async process: we need to make getSizeFromImage use callback, then set H/W...
    // if ( !intWidth || !intHeight ) { var imgObj = getSizeFromImage(strImagePath);
    newObject.options = {
        x: intPosX || 0,
        y: intPosY || 0,
        w: intWidth || 1,
        h: intHeight || 1,
        altText: opt.altText || '',
        rounding: typeof opt.rounding === 'boolean' ? opt.rounding : false,
        sizing: sizing,
        placeholder: opt.placeholder,
        rotate: opt.rotate || 0,
        flipV: opt.flipV || false,
        flipH: opt.flipH || false,
        transparency: opt.transparency || 0,
        objectName: objectName,
        shadow: correctShadowOptions(opt.shadow),
    };
    // STEP 4: Add this image to this Slide Rels (rId/rels count spans all slides! Count all images to get next rId)
    if (strImgExtn === 'svg') {
        // SVG files consume *TWO* rId's: (a png version and the svg image)
        // <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image1.png"/>
        // <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image2.svg"/>
        target._relsMedia.push({
            path: strImagePath || strImageData + 'png',
            type: 'image/png',
            extn: 'png',
            data: strImageData || '',
            rId: imageRelId,
            Target: "../media/image-".concat(target._slideNum, "-").concat(target._relsMedia.length + 1, ".png"),
            isSvgPng: true,
            svgSize: { w: getSmartParseNumber(newObject.options.w, 'X', target._presLayout), h: getSmartParseNumber(newObject.options.h, 'Y', target._presLayout) },
        });
        newObject.imageRid = imageRelId;
        target._relsMedia.push({
            path: strImagePath || strImageData,
            type: 'image/svg+xml',
            extn: strImgExtn,
            data: strImageData || '',
            rId: imageRelId + 1,
            Target: "../media/image-".concat(target._slideNum, "-").concat(target._relsMedia.length + 1, ".").concat(strImgExtn),
        });
        newObject.imageRid = imageRelId + 1;
    }
    else {
        // PERF: Duplicate media should reuse existing `Target` value and not create an additional copy
        var dupeItem = target._relsMedia.filter(function (item) { return item.path && item.path === strImagePath && item.type === 'image/' + strImgExtn && !item.isDuplicate; })[0];
        target._relsMedia.push({
            path: strImagePath || 'preencoded.' + strImgExtn,
            type: 'image/' + strImgExtn,
            extn: strImgExtn,
            data: strImageData || '',
            rId: imageRelId,
            isDuplicate: !!(dupeItem === null || dupeItem === void 0 ? void 0 : dupeItem.Target),
            Target: (dupeItem === null || dupeItem === void 0 ? void 0 : dupeItem.Target) ? dupeItem.Target : "../media/image-".concat(target._slideNum, "-").concat(target._relsMedia.length + 1, ".").concat(strImgExtn),
        });
        newObject.imageRid = imageRelId;
    }
    // STEP 5: Hyperlink support
    if (typeof objHyperlink === 'object') {
        if (!objHyperlink.url && !objHyperlink.slide)
            throw new Error('ERROR: `hyperlink` option requires either: `url` or `slide`');
        else {
            imageRelId++;
            target._rels.push({
                type: SLIDE_OBJECT_TYPES.hyperlink,
                data: objHyperlink.slide ? 'slide' : 'dummy',
                rId: imageRelId,
                Target: objHyperlink.url || objHyperlink.slide.toString(),
            });
            objHyperlink._rId = imageRelId;
            newObject.hyperlink = objHyperlink;
        }
    }
    // STEP 6: Add object to slide
    target._slideObjects.push(newObject);
}
/**
 * Adds a media object to a slide definition.
 * @param {PresSlide} `target` - slide object that the media will be added to
 * @param {MediaProps} `opt` - media options
 */
function addMediaDefinition(target, opt) {
    var intPosX = opt.x || 0;
    var intPosY = opt.y || 0;
    var intSizeX = opt.w || 2;
    var intSizeY = opt.h || 2;
    var strData = opt.data || '';
    var strLink = opt.link || '';
    var strPath = opt.path || '';
    var strType = opt.type || 'audio';
    var strExtn = '';
    var strCover = opt.cover || IMG_PLAYBTN;
    var objectName = opt.objectName ? encodeXmlEntities(opt.objectName) : "Media ".concat(target._slideObjects.filter(function (obj) { return obj._type === SLIDE_OBJECT_TYPES.media; }).length);
    var slideData = { _type: SLIDE_OBJECT_TYPES.media };
    // STEP 1: REALITY-CHECK
    if (!strPath && !strData && strType !== 'online') {
        throw new Error('addMedia() error: either `data` or `path` are required!');
    }
    else if (strData && !strData.toLowerCase().includes('base64,')) {
        throw new Error('addMedia() error: `data` value lacks a base64 header! Ex: \'video/mpeg;base64,NMP[...]\')');
    }
    else if (strCover && !strCover.toLowerCase().includes('base64,')) {
        throw new Error('addMedia() error: `cover` value lacks a base64 header! Ex: \'data:image/png;base64,iV[...]\')');
    }
    // Online Video: requires `link`
    if (strType === 'online' && !strLink) {
        throw new Error('addMedia() error: online videos require `link` value');
    }
    // FIXME: 20190707
    // strType = strData ? strData.split(';')[0].split('/')[0] : strType
    strExtn = opt.extn || (strData ? strData.split(';')[0].split('/')[1] : strPath.split('.').pop()) || 'mp3';
    // STEP 2: Set type, media
    slideData.mtype = strType;
    slideData.media = strPath || 'preencoded.mov';
    slideData.options = {};
    // STEP 3: Set media properties & options
    slideData.options.x = intPosX;
    slideData.options.y = intPosY;
    slideData.options.w = intSizeX;
    slideData.options.h = intSizeY;
    slideData.options.objectName = objectName;
    // STEP 4: Add this media to this Slide Rels (rId/rels count spans all slides! Count all media to get next rId)
    /**
     * NOTE:
     * - rId starts at 2 (hence the intRels+1 below) as slideLayout.xml is rId=1!
     *
     * NOTE:
     * - Audio/Video files consume *TWO* rId's:
     * <Relationship Id="rId2" Target="../media/media1.mov" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/video"/>
     * <Relationship Id="rId3" Target="../media/media1.mov" Type="http://schemas.microsoft.com/office/2007/relationships/media"/>
     */
    if (strType === 'online') {
        var relId1 = getNewRelId(target);
        // A: Add video
        target._relsMedia.push({
            path: strPath || 'preencoded' + strExtn,
            data: 'dummy',
            type: 'online',
            extn: strExtn,
            rId: relId1,
            Target: strLink,
        });
        slideData.mediaRid = relId1;
        // B: Add cover (preview/overlay) image
        target._relsMedia.push({
            path: 'preencoded.png',
            data: strCover,
            type: 'image/png',
            extn: 'png',
            rId: getNewRelId(target),
            Target: "../media/image-".concat(target._slideNum, "-").concat(target._relsMedia.length + 1, ".png"),
        });
    }
    else {
        // PERF: Duplicate media should reuse existing `Target` value and not create an additional copy
        var dupeItem = target._relsMedia.filter(function (item) { return item.path && item.path === strPath && item.type === strType + '/' + strExtn && !item.isDuplicate; })[0];
        // A: "relationships/video"
        var relId1 = getNewRelId(target);
        target._relsMedia.push({
            path: strPath || 'preencoded' + strExtn,
            type: strType + '/' + strExtn,
            extn: strExtn,
            data: strData || '',
            rId: relId1,
            isDuplicate: !!(dupeItem === null || dupeItem === void 0 ? void 0 : dupeItem.Target),
            Target: (dupeItem === null || dupeItem === void 0 ? void 0 : dupeItem.Target) ? dupeItem.Target : "../media/media-".concat(target._slideNum, "-").concat(target._relsMedia.length + 1, ".").concat(strExtn),
        });
        slideData.mediaRid = relId1;
        // B: "relationships/media"
        target._relsMedia.push({
            path: strPath || 'preencoded' + strExtn,
            type: strType + '/' + strExtn,
            extn: strExtn,
            data: strData || '',
            rId: getNewRelId(target),
            isDuplicate: !!(dupeItem === null || dupeItem === void 0 ? void 0 : dupeItem.Target),
            Target: (dupeItem === null || dupeItem === void 0 ? void 0 : dupeItem.Target) ? dupeItem.Target : "../media/media-".concat(target._slideNum, "-").concat(target._relsMedia.length + 0, ".").concat(strExtn),
        });
        // C: Add cover (preview/overlay) image
        target._relsMedia.push({
            path: 'preencoded.png',
            type: 'image/png',
            extn: 'png',
            data: strCover,
            rId: getNewRelId(target),
            Target: "../media/image-".concat(target._slideNum, "-").concat(target._relsMedia.length + 1, ".png"),
        });
    }
    // LAST
    target._slideObjects.push(slideData);
}
/**
 * Adds Notes to a slide.
 * @param {PresSlide} `target` slide object
 * @param {string} `notes`
 * @since 2.3.0
 */
function addNotesDefinition(target, notes) {
    target._slideObjects.push({
        _type: SLIDE_OBJECT_TYPES.notes,
        text: [{ text: notes }],
    });
}
/**
 * Adds a shape object to a slide definition.
 * @param {PresSlide} target slide object that the shape should be added to
 * @param {SHAPE_NAME} shapeName shape name
 * @param {ShapeProps} opts shape options
 */
function addShapeDefinition(target, shapeName, opts) {
    var options = typeof opts === 'object' ? opts : {};
    options.line = options.line || { type: 'none' };
    var newObject = {
        _type: SLIDE_OBJECT_TYPES.text,
        shape: shapeName || SHAPE_TYPE.RECTANGLE,
        options: options,
        text: null,
    };
    // Reality check
    if (!shapeName)
        throw new Error('Missing/Invalid shape parameter! Example: `addShape(pptxgen.shapes.LINE, {x:1, y:1, w:1, h:1});`');
    // 1: ShapeLineProps defaults
    var newLineOpts = {
        type: options.line.type || 'solid',
        color: options.line.color || DEF_SHAPE_LINE_COLOR,
        transparency: options.line.transparency || 0,
        width: options.line.width || 1,
        dashType: options.line.dashType || 'solid',
        beginArrowType: options.line.beginArrowType || null,
        endArrowType: options.line.endArrowType || null,
    };
    if (typeof options.line === 'object' && options.line.type !== 'none')
        options.line = newLineOpts;
    // 2: Set options defaults
    options.x = options.x || (options.x === 0 ? 0 : 1);
    options.y = options.y || (options.y === 0 ? 0 : 1);
    options.w = options.w || (options.w === 0 ? 0 : 1);
    options.h = options.h || (options.h === 0 ? 0 : 1);
    options.objectName = options.objectName
        ? encodeXmlEntities(options.objectName)
        : "Shape ".concat(target._slideObjects.filter(function (obj) { return obj._type === SLIDE_OBJECT_TYPES.text; }).length);
    // 3: Handle line (lots of deprecated opts)
    if (typeof options.line === 'string') {
        var tmpOpts = newLineOpts;
        tmpOpts.color = String(options.line); // @deprecated `options.line` string (was line color)
        options.line = tmpOpts;
    }
    if (typeof options.lineSize === 'number')
        options.line.width = options.lineSize; // @deprecated (part of `ShapeLineProps` now)
    if (typeof options.lineDash === 'string')
        options.line.dashType = options.lineDash; // @deprecated (part of `ShapeLineProps` now)
    if (typeof options.lineHead === 'string')
        options.line.beginArrowType = options.lineHead; // @deprecated (part of `ShapeLineProps` now)
    if (typeof options.lineTail === 'string')
        options.line.endArrowType = options.lineTail; // @deprecated (part of `ShapeLineProps` now)
    // 4: Create hyperlink rels
    createHyperlinkRels(target, newObject);
    // LAST: Add object to slide
    target._slideObjects.push(newObject);
}
/**
 * Adds a table object to a slide definition.
 * @param {PresSlide} target - slide object that the table should be added to
 * @param {TableRow[]} tableRows - table data
 * @param {TableProps} options - table options
 * @param {SlideLayout} slideLayout - Slide layout
 * @param {PresLayout} presLayout - Presentation layout
 * @param {Function} addSlide - method
 * @param {Function} getSlide - method
 */
function addTableDefinition(target, tableRows, options, slideLayout, presLayout, addSlide, getSlide) {
    var slides = [target]; // Create array of Slides as more may be added by auto-paging
    var opt = options && typeof options === 'object' ? options : {};
    opt.objectName = opt.objectName ? encodeXmlEntities(opt.objectName) : "Table ".concat(target._slideObjects.filter(function (obj) { return obj._type === SLIDE_OBJECT_TYPES.table; }).length);
    // STEP 1: REALITY-CHECK
    {
        // A: check for empty
        if (tableRows === null || tableRows.length === 0 || !Array.isArray(tableRows)) {
            throw new Error('addTable: Array expected! EX: \'slide.addTable( [rows], {options} );\' (https://gitbrent.github.io/PptxGenJS/docs/api-tables.html)');
        }
        // B: check for non-well-formatted array (ex: rows=['a','b'] instead of [['a','b']])
        if (!tableRows[0] || !Array.isArray(tableRows[0])) {
            throw new Error('addTable: \'rows\' should be an array of cells! EX: \'slide.addTable( [ [\'A\'], [\'B\'], {text:\'C\',options:{align:\'center\'}} ] );\' (https://gitbrent.github.io/PptxGenJS/docs/api-tables.html)');
        }
        // TODO: FUTURE: This is wacky and wont function right (shows .w value when there is none from demo.js?!) 20191219
        /*
        if (opt.w && opt.colW) {
            console.warn('addTable: please use either `colW` or `w` - not both (table will use `colW` and ignore `w`)')
            console.log(`${opt.w} ${opt.colW}`)
        }
        */
    }
    // STEP 2: Transform `tableRows` into well-formatted TableCell's
    // tableRows can be object or plain text array: `[{text:'cell 1'}, {text:'cell 2', options:{color:'ff0000'}}]` | `["cell 1", "cell 2"]`
    var arrRows = [];
    tableRows.forEach(function (row) {
        var newRow = [];
        if (Array.isArray(row)) {
            row.forEach(function (cell) {
                // A:
                var newCell = {
                    _type: SLIDE_OBJECT_TYPES.tablecell,
                    text: '',
                    options: typeof cell === 'object' && cell.options ? cell.options : {},
                };
                // B:
                if (typeof cell === 'string' || typeof cell === 'number')
                    newCell.text = cell.toString();
                else if (cell.text) {
                    // Cell can contain complex text type, or string, or number
                    if (typeof cell.text === 'string' || typeof cell.text === 'number')
                        newCell.text = cell.text.toString();
                    else if (cell.text)
                        newCell.text = cell.text;
                    // Capture options
                    if (cell.options && typeof cell.options === 'object')
                        newCell.options = cell.options;
                }
                // C: Set cell borders
                newCell.options.border = newCell.options.border || opt.border || [{ type: 'none' }, { type: 'none' }, { type: 'none' }, { type: 'none' }];
                var cellBorder = newCell.options.border;
                // CASE 1: border interface is: BorderOptions | [BorderOptions, BorderOptions, BorderOptions, BorderOptions]
                if (!Array.isArray(cellBorder) && typeof cellBorder === 'object')
                    newCell.options.border = [cellBorder, cellBorder, cellBorder, cellBorder];
                // Handle: [null, null, {type:'solid'}, null]
                if (!newCell.options.border[0])
                    newCell.options.border[0] = { type: 'none' };
                if (!newCell.options.border[1])
                    newCell.options.border[1] = { type: 'none' };
                if (!newCell.options.border[2])
                    newCell.options.border[2] = { type: 'none' };
                if (!newCell.options.border[3])
                    newCell.options.border[3] = { type: 'none' };
                // set complete BorderOptions for all sides
                var arrSides = [0, 1, 2, 3];
                arrSides.forEach(function (idx) {
                    newCell.options.border[idx] = {
                        type: newCell.options.border[idx].type || DEF_CELL_BORDER.type,
                        color: newCell.options.border[idx].color || DEF_CELL_BORDER.color,
                        pt: typeof newCell.options.border[idx].pt === 'number' ? newCell.options.border[idx].pt : DEF_CELL_BORDER.pt,
                    };
                });
                // LAST:
                newRow.push(newCell);
            });
        }
        else {
            console.log('addTable: tableRows has a bad row. A row should be an array of cells. You provided:');
            console.log(row);
        }
        arrRows.push(newRow);
    });
    // STEP 3: Set options
    opt.x = getSmartParseNumber(opt.x || (opt.x === 0 ? 0 : EMU / 2), 'X', presLayout);
    opt.y = getSmartParseNumber(opt.y || (opt.y === 0 ? 0 : EMU / 2), 'Y', presLayout);
    if (opt.h)
        opt.h = getSmartParseNumber(opt.h, 'Y', presLayout); // NOTE: Dont set default `h` - leaving it null triggers auto-rowH in `makeXMLSlide()`
    opt.fontSize = opt.fontSize || DEF_FONT_SIZE;
    opt.margin = opt.margin === 0 || opt.margin ? opt.margin : DEF_CELL_MARGIN_IN;
    if (typeof opt.margin === 'number')
        opt.margin = [Number(opt.margin), Number(opt.margin), Number(opt.margin), Number(opt.margin)];
    if (!opt.color)
        opt.color = opt.color || DEF_FONT_COLOR; // Set default color if needed (table option > inherit from Slide > default to black)
    if (typeof opt.border === 'string') {
        console.warn('addTable `border` option must be an object. Ex: `{border: {type:\'none\'}}`');
        opt.border = null;
    }
    else if (Array.isArray(opt.border)) {
        [0, 1, 2, 3].forEach(function (idx) {
            opt.border[idx] = opt.border[idx]
                ? { type: opt.border[idx].type || DEF_CELL_BORDER.type, color: opt.border[idx].color || DEF_CELL_BORDER.color, pt: opt.border[idx].pt || DEF_CELL_BORDER.pt }
                : { type: 'none' };
        });
    }
    opt.autoPage = typeof opt.autoPage === 'boolean' ? opt.autoPage : false;
    opt.autoPageRepeatHeader = typeof opt.autoPageRepeatHeader === 'boolean' ? opt.autoPageRepeatHeader : false;
    opt.autoPageHeaderRows = typeof opt.autoPageHeaderRows !== 'undefined' && !isNaN(Number(opt.autoPageHeaderRows)) ? Number(opt.autoPageHeaderRows) : 1;
    opt.autoPageLineWeight = typeof opt.autoPageLineWeight !== 'undefined' && !isNaN(Number(opt.autoPageLineWeight)) ? Number(opt.autoPageLineWeight) : 0;
    if (opt.autoPageLineWeight) {
        if (opt.autoPageLineWeight > 1)
            opt.autoPageLineWeight = 1;
        else if (opt.autoPageLineWeight < -1)
            opt.autoPageLineWeight = -1;
    }
    // autoPage ^^^
    // Set/Calc table width
    // Get slide margins - start with default values, then adjust if master or slide margins exist
    var arrTableMargin = DEF_SLIDE_MARGIN_IN;
    // Case 1: Master margins
    if (slideLayout && typeof slideLayout._margin !== 'undefined') {
        if (Array.isArray(slideLayout._margin))
            arrTableMargin = slideLayout._margin;
        else if (!isNaN(Number(slideLayout._margin))) {
            arrTableMargin = [Number(slideLayout._margin), Number(slideLayout._margin), Number(slideLayout._margin), Number(slideLayout._margin)];
        }
    }
    // Case 2: Table margins
    /* FIXME: add `_margin` option to slide options
        else if ( addNewSlide._margin ) {
            if ( Array.isArray(addNewSlide._margin) ) arrTableMargin = addNewSlide._margin;
            else if ( !isNaN(Number(addNewSlide._margin)) ) arrTableMargin = [Number(addNewSlide._margin), Number(addNewSlide._margin), Number(addNewSlide._margin), Number(addNewSlide._margin)];
        }
    */
    /**
     * Calc table width depending upon what data we have - several scenarios exist (including bad data, eg: colW doesnt match col count)
     * The API does not require a `w` value, but XML generation does, hence, code to calc a width below using colW value(s)
     */
    if (opt.colW) {
        var firstRowColCnt = arrRows[0].reduce(function (totalLen, c) {
            var _a;
            if (((_a = c === null || c === void 0 ? void 0 : c.options) === null || _a === void 0 ? void 0 : _a.colspan) && typeof c.options.colspan === 'number') {
                totalLen += c.options.colspan;
            }
            else {
                totalLen += 1;
            }
            return totalLen;
        }, 0);
        if (typeof opt.colW === 'string' || typeof opt.colW === 'number') {
            // Ex: `colW = 3` or `colW = '3'`
            opt.w = Math.floor(Number(opt.colW) * firstRowColCnt);
            opt.colW = null; // IMPORTANT: Unset `colW` so table is created using `opt.w`, which will evenly divide cols
        }
        else if (opt.colW && Array.isArray(opt.colW) && opt.colW.length === 1 && firstRowColCnt > 1) {
            // Ex: `colW=[3]` but with >1 cols (same as above, user is saying "use this width for all")
            opt.w = Math.floor(Number(opt.colW) * firstRowColCnt);
            opt.colW = null; // IMPORTANT: Unset `colW` so table is created using `opt.w`, which will evenly divide cols
        }
        else if (opt.colW && Array.isArray(opt.colW) && opt.colW.length !== firstRowColCnt) {
            // Err: Mismatched colW and cols count
            console.warn('addTable: mismatch: (colW.length != data.length) Therefore, defaulting to evenly distributed col widths.');
            opt.colW = null;
        }
    }
    else if (opt.w) {
        opt.w = getSmartParseNumber(opt.w, 'X', presLayout);
    }
    else {
        opt.w = Math.floor(presLayout._sizeW / EMU - arrTableMargin[1] - arrTableMargin[3]);
    }
    // STEP 4: Convert units to EMU now (we use different logic in makeSlide->table - smartCalc is not used)
    if (opt.x && opt.x < 20)
        opt.x = inch2Emu(opt.x);
    if (opt.y && opt.y < 20)
        opt.y = inch2Emu(opt.y);
    if (opt.w && opt.w < 20)
        opt.w = inch2Emu(opt.w);
    if (opt.h && opt.h < 20)
        opt.h = inch2Emu(opt.h);
    // STEP 5: Loop over cells: transform each to ITableCell; check to see whether to unset `autoPage` while here
    arrRows.forEach(function (row) {
        row.forEach(function (cell, idy) {
            // A: Transform cell data if needed
            /* Table rows can be an object or plain text - transform into object when needed
                // EX:
                var arrTabRows1 = [
                    [ { text:'A1\nA2', options:{rowspan:2, fill:'99FFCC'} } ]
                    ,[ 'B2', 'C2', 'D2', 'E2' ]
                ]
            */
            if (typeof cell === 'number' || typeof cell === 'string') {
                // Grab table formatting `opts` to use here so text style/format inherits as it should
                row[idy] = { _type: SLIDE_OBJECT_TYPES.tablecell, text: String(row[idy]), options: opt };
            }
            else if (typeof cell === 'object') {
                // ARG0: `text`
                if (typeof cell.text === 'number')
                    row[idy].text = row[idy].text.toString();
                else if (typeof cell.text === 'undefined' || cell.text === null)
                    row[idy].text = '';
                // ARG1: `options`: ensure options exists
                row[idy].options = cell.options || {};
                // Set type to tabelcell
                row[idy]._type = SLIDE_OBJECT_TYPES.tablecell;
            }
            // B: Check for fine-grained formatting, disable auto-page when found
            // Since genXmlTextBody already checks for text array ( text:[{},..{}] ) we're done!
            // Text in individual cells will be formatted as they are added by calls to genXmlTextBody within table builder
            // if (cell.text && Array.isArray(cell.text)) opt.autoPage = false
            // TODO: FIXME: WIP: 20210807: We cant do this anymore
        });
    });
    // If autoPage = true, we need to return references to newly created slides if any
    var newAutoPagedSlides = [];
    // STEP 6: Auto-Paging: (via {options} and used internally)
    // (used internally by `tableToSlides()` to not engage recursion - we've already paged the table data, just add this one)
    if (opt && !opt.autoPage) {
        // Create hyperlink rels (IMPORTANT: Wait until table has been shredded across Slides or all rels will end-up on Slide 1!)
        createHyperlinkRels(target, arrRows);
        // Add slideObjects (NOTE: Use `extend` to avoid mutation)
        target._slideObjects.push({
            _type: SLIDE_OBJECT_TYPES.table,
            arrTabRows: arrRows,
            options: Object.assign({}, opt),
        });
    }
    else {
        if (opt.autoPageRepeatHeader)
            opt._arrObjTabHeadRows = arrRows.filter(function (_row, idx) { return idx < opt.autoPageHeaderRows; });
        // Loop over rows and create 1-N tables as needed (ISSUE#21)
        getSlidesForTableRows(arrRows, opt, presLayout, slideLayout).forEach(function (slide, idx) {
            // A: Create new Slide when needed, otherwise, use existing (NOTE: More than 1 table can be on a Slide, so we will go up AND down the Slide chain)
            if (!getSlide(target._slideNum + idx))
                slides.push(addSlide({ masterName: (slideLayout === null || slideLayout === void 0 ? void 0 : slideLayout._name) || null }));
            // B: Reset opt.y to `option`/`margin` after first Slide (ISSUE#43, ISSUE#47, ISSUE#48)
            if (idx > 0)
                opt.y = inch2Emu(opt.autoPageSlideStartY || opt.newSlideStartY || arrTableMargin[0]);
            // C: Add this table to new Slide
            {
                var newSlide = getSlide(target._slideNum + idx);
                opt.autoPage = false;
                // Create hyperlink rels (IMPORTANT: Wait until table has been shredded across Slides or all rels will end-up on Slide 1!)
                createHyperlinkRels(newSlide, slide.rows);
                // Add rows to new slide
                newSlide.addTable(slide.rows, Object.assign({}, opt));
                // Add reference to the new slide so it can be returned, but don't add the first one because the user already has a reference to that one.
                if (idx > 0)
                    newAutoPagedSlides.push(newSlide);
            }
        });
    }
    return newAutoPagedSlides;
}
/**
 * Adds a text object to a slide definition.
 * @param {PresSlide} target - slide object that the text should be added to
 * @param {string|TextProps[]} text text string or object
 * @param {TextPropsOptions} opts text options
 * @param {boolean} isPlaceholder whether this a placeholder object
 * @since: 1.0.0
 */
function addTextDefinition(target, text, opts, isPlaceholder) {
    var newObject = {
        _type: isPlaceholder ? SLIDE_OBJECT_TYPES.placeholder : SLIDE_OBJECT_TYPES.text,
        shape: (opts === null || opts === void 0 ? void 0 : opts.shape) || SHAPE_TYPE.RECTANGLE,
        text: !text || text.length === 0 ? [{ text: '', options: null }] : text,
        options: opts || {},
    };
    function cleanOpts(itemOpts) {
        // STEP 1: Set some options
        {
            // A.1: Color (placeholders should inherit their colors or override them, so don't default them)
            if (!itemOpts.placeholder) {
                itemOpts.color = itemOpts.color || newObject.options.color || target.color || DEF_FONT_COLOR;
            }
            // A.2: Placeholder should inherit their bullets or override them, so don't default them
            if (itemOpts.placeholder || isPlaceholder) {
                itemOpts.bullet = itemOpts.bullet || false;
            }
            // A.3: Text targeting a placeholder need to inherit the placeholders options (eg: margin, valign, etc.) (Issue #640)
            if (itemOpts.placeholder && target._slideLayout && target._slideLayout._slideObjects) {
                var placeHold = target._slideLayout._slideObjects.filter(function (item) { return item._type === 'placeholder' && item.options && item.options.placeholder && item.options.placeholder === itemOpts.placeholder; })[0];
                if (placeHold === null || placeHold === void 0 ? void 0 : placeHold.options)
                    itemOpts = __assign(__assign({}, itemOpts), placeHold.options);
            }
            // A.4: Other options
            itemOpts.objectName = itemOpts.objectName
                ? encodeXmlEntities(itemOpts.objectName)
                : "Text ".concat(target._slideObjects.filter(function (obj) { return obj._type === SLIDE_OBJECT_TYPES.text; }).length);
            // B:
            if (itemOpts.shape === SHAPE_TYPE.LINE) {
                // ShapeLineProps defaults
                var newLineOpts = {
                    type: itemOpts.line.type || 'solid',
                    color: itemOpts.line.color || DEF_SHAPE_LINE_COLOR,
                    transparency: itemOpts.line.transparency || 0,
                    width: itemOpts.line.width || 1,
                    dashType: itemOpts.line.dashType || 'solid',
                    beginArrowType: itemOpts.line.beginArrowType || null,
                    endArrowType: itemOpts.line.endArrowType || null,
                };
                if (typeof itemOpts.line === 'object')
                    itemOpts.line = newLineOpts;
                // 3: Handle line (lots of deprecated opts)
                if (typeof itemOpts.line === 'string') {
                    var tmpOpts = newLineOpts;
                    if (typeof itemOpts.line === 'string')
                        tmpOpts.color = itemOpts.line; // @deprecated [remove in v4.0]
                    // tmpOpts.color = itemOpts.line!.toString() // @deprecated `itemOpts.line`:[string] (was line color)
                    itemOpts.line = tmpOpts;
                }
                if (typeof itemOpts.lineSize === 'number')
                    itemOpts.line.width = itemOpts.lineSize; // @deprecated (part of `ShapeLineProps` now)
                if (typeof itemOpts.lineDash === 'string')
                    itemOpts.line.dashType = itemOpts.lineDash; // @deprecated (part of `ShapeLineProps` now)
                if (typeof itemOpts.lineHead === 'string')
                    itemOpts.line.beginArrowType = itemOpts.lineHead; // @deprecated (part of `ShapeLineProps` now)
                if (typeof itemOpts.lineTail === 'string')
                    itemOpts.line.endArrowType = itemOpts.lineTail; // @deprecated (part of `ShapeLineProps` now)
            }
            // C: Line opts
            itemOpts.line = itemOpts.line || {};
            itemOpts.lineSpacing = itemOpts.lineSpacing && !isNaN(itemOpts.lineSpacing) ? itemOpts.lineSpacing : null;
            itemOpts.lineSpacingMultiple = itemOpts.lineSpacingMultiple && !isNaN(itemOpts.lineSpacingMultiple) ? itemOpts.lineSpacingMultiple : null;
            // D: Transform text options to bodyProperties as thats how we build XML
            itemOpts._bodyProp = itemOpts._bodyProp || {};
            itemOpts._bodyProp.autoFit = itemOpts.autoFit || false; // DEPRECATED: (3.3.0) If true, shape will collapse to text size (Fit To shape)
            itemOpts._bodyProp.anchor = !itemOpts.placeholder ? TEXT_VALIGN.ctr : null; // VALS: [t,ctr,b]
            itemOpts._bodyProp.vert = itemOpts.vert || null; // VALS: [eaVert,horz,mongolianVert,vert,vert270,wordArtVert,wordArtVertRtl]
            itemOpts._bodyProp.wrap = typeof itemOpts.wrap === 'boolean' ? itemOpts.wrap : true;
            // E: Inset
            // @deprecated 3.10.0 (`inset` - use `margin`)
            if ((itemOpts.inset && !isNaN(Number(itemOpts.inset))) || itemOpts.inset === 0) {
                itemOpts._bodyProp.lIns = inch2Emu(itemOpts.inset);
                itemOpts._bodyProp.rIns = inch2Emu(itemOpts.inset);
                itemOpts._bodyProp.tIns = inch2Emu(itemOpts.inset);
                itemOpts._bodyProp.bIns = inch2Emu(itemOpts.inset);
            }
            // F: Transform @deprecated props
            if (typeof itemOpts.underline === 'boolean' && itemOpts.underline === true)
                itemOpts.underline = { style: 'sng' };
        }
        // STEP 2: Transform `align`/`valign` to XML values, store in _bodyProp for XML gen
        {
            if ((itemOpts.align || '').toLowerCase().indexOf('c') === 0)
                itemOpts._bodyProp.align = TEXT_HALIGN.center;
            else if ((itemOpts.align || '').toLowerCase().indexOf('l') === 0)
                itemOpts._bodyProp.align = TEXT_HALIGN.left;
            else if ((itemOpts.align || '').toLowerCase().indexOf('r') === 0)
                itemOpts._bodyProp.align = TEXT_HALIGN.right;
            else if ((itemOpts.align || '').toLowerCase().indexOf('j') === 0)
                itemOpts._bodyProp.align = TEXT_HALIGN.justify;
            if ((itemOpts.valign || '').toLowerCase().indexOf('b') === 0)
                itemOpts._bodyProp.anchor = TEXT_VALIGN.b;
            else if ((itemOpts.valign || '').toLowerCase().indexOf('m') === 0)
                itemOpts._bodyProp.anchor = TEXT_VALIGN.ctr;
            else if ((itemOpts.valign || '').toLowerCase().indexOf('t') === 0)
                itemOpts._bodyProp.anchor = TEXT_VALIGN.t;
        }
        // STEP 3: ROBUST: Set rational values for some shadow props if needed
        correctShadowOptions(itemOpts.shadow);
        return itemOpts;
    }
    // STEP 1: Create/Clean object options
    newObject.options = cleanOpts(newObject.options);
    // STEP 2: Create/Clean text options
    newObject.text.forEach(function (item) { return (item.options = cleanOpts(item.options || {})); });
    // STEP 3: Create hyperlinks
    createHyperlinkRels(target, newObject.text || '');
    // LAST: Add object to Slide
    target._slideObjects.push(newObject);
}
/**
 * Adds placeholder objects to slide
 * @param {PresSlide} slide - slide object containing layouts
 */
function addPlaceholdersToSlideLayouts(slide) {
    // Add all placeholders on this Slide that dont already exist
    (slide._slideLayout._slideObjects || []).forEach(function (slideLayoutObj) {
        if (slideLayoutObj._type === SLIDE_OBJECT_TYPES.placeholder) {
            // A: Search for this placeholder on Slide before we add
            // NOTE: Check to ensure a placeholder does not already exist on the Slide
            // They are created when they have been populated with text (ex: `slide.addText('Hi', { placeholder:'title' });`)
            if (slide._slideObjects.filter(function (slideObj) { return slideObj.options && slideObj.options.placeholder === slideLayoutObj.options.placeholder; }).length === 0) {
                addTextDefinition(slide, [{ text: '' }], slideLayoutObj.options, false);
            }
        }
    });
}
/* -------------------------------------------------------------------------------- */
/**
 * Adds a background image or color to a slide definition.
 * @param {BackgroundProps} props - color string or an object with image definition
 * @param {PresSlide} target - slide object that the background is set to
 */
function addBackgroundDefinition(props, target) {
    var _a;
    // A: @deprecated
    if (target.bkgd) {
        if (!target.background)
            target.background = {};
        if (typeof target.bkgd === 'string')
            target.background.color = target.bkgd;
        else {
            if (target.bkgd.data)
                target.background.data = target.bkgd.data;
            if (target.bkgd.path)
                target.background.path = target.bkgd.path;
            if (target.bkgd.src)
                target.background.path = target.bkgd.src; // @deprecated (drop in 4.x)
        }
    }
    if ((_a = target.background) === null || _a === void 0 ? void 0 : _a.fill)
        target.background.color = target.background.fill;
    // B: Handle media
    if (props && (props.path || props.data)) {
        // Allow the use of only the data key (`path` isnt reqd)
        props.path = props.path || 'preencoded.png';
        var strImgExtn = (props.path.split('.').pop() || 'png').split('?')[0]; // Handle "blah.jpg?width=540" etc.
        if (strImgExtn === 'jpg')
            strImgExtn = 'jpeg'; // base64-encoded jpg's come out as "data:image/jpeg;base64,/9j/[...]", so correct exttnesion to avoid content warnings at PPT startup
        target._relsMedia = target._relsMedia || [];
        var intRels = target._relsMedia.length + 1;
        // NOTE: `Target` cannot have spaces (eg:"Slide 1-image-1.jpg") or a "presentation is corrupt" warning comes up
        target._relsMedia.push({
            path: props.path,
            type: SLIDE_OBJECT_TYPES.image,
            extn: strImgExtn,
            data: props.data || null,
            rId: intRels,
            Target: "../media/".concat((target._name || '').replace(/\s+/gi, '-'), "-image-").concat(target._relsMedia.length + 1, ".").concat(strImgExtn),
        });
        target._bkgdImgRid = intRels;
    }
}
/**
 * Parses text/text-objects from `addText()` and `addTable()` methods; creates 'hyperlink'-type Slide Rels for each hyperlink found
 * @param {PresSlide} target - slide object that any hyperlinks will be be added to
 * @param {number | string | TextProps | TextProps[] | ITableCell[][]} text - text to parse
 */
function createHyperlinkRels(target, text) {
    var textObjs = [];
    // Only text objects can have hyperlinks, bail when text param is plain text
    if (typeof text === 'string' || typeof text === 'number')
        return;
    // IMPORTANT: "else if" Array.isArray must come before typeof===object! Otherwise, code will exhaust recursion!
    else if (Array.isArray(text))
        textObjs = text;
    else if (typeof text === 'object')
        textObjs = [text];
    textObjs.forEach(function (text) {
        // `text` can be an array of other `text` objects (table cell word-level formatting), continue parsing using recursion
        if (Array.isArray(text)) {
            createHyperlinkRels(target, text);
        }
        else if (Array.isArray(text.text)) {
            // this handles TableCells with hyperlinks
            createHyperlinkRels(target, text.text);
        }
        else if (text && typeof text === 'object' && text.options && text.options.hyperlink && !text.options.hyperlink._rId) {
            if (typeof text.options.hyperlink !== 'object')
                console.log('ERROR: text `hyperlink` option should be an object. Ex: `hyperlink: {url:\'https://github.com\'}` ');
            else if (!text.options.hyperlink.url && !text.options.hyperlink.slide)
                console.log('ERROR: \'hyperlink requires either: `url` or `slide`\'');
            else {
                var relId = getNewRelId(target);
                target._rels.push({
                    type: SLIDE_OBJECT_TYPES.hyperlink,
                    data: text.options.hyperlink.slide ? 'slide' : 'dummy',
                    rId: relId,
                    Target: encodeXmlEntities(text.options.hyperlink.url) || text.options.hyperlink.slide.toString(),
                });
                text.options.hyperlink._rId = relId;
            }
        }
    });
}

/**
 * PptxGenJS: Slide Class
 */
var Slide = /** @class */ (function () {
    function Slide(params) {
        var _a;
        this.addSlide = params.addSlide;
        this.getSlide = params.getSlide;
        this._name = "Slide ".concat(params.slideNumber);
        this._presLayout = params.presLayout;
        this._rId = params.slideRId;
        this._rels = [];
        this._relsChart = [];
        this._relsMedia = [];
        this._setSlideNum = params.setSlideNum;
        this._slideId = params.slideId;
        this._slideLayout = params.slideLayout || null;
        this._slideNum = params.slideNumber;
        this._slideObjects = [];
        /** NOTE: Slide Numbers: In order for Slide Numbers to function they need to be in all 3 files: master/layout/slide
         * `defineSlideMaster` and `addNewSlide.slideNumber` will add {slideNumber} to `this.masterSlide` and `this.slideLayouts`
         * so, lastly, add to the Slide now.
         */
        this._slideNumberProps = ((_a = this._slideLayout) === null || _a === void 0 ? void 0 : _a._slideNumberProps) ? this._slideLayout._slideNumberProps : null;
    }
    Object.defineProperty(Slide.prototype, "bkgd", {
        get: function () {
            return this._bkgd;
        },
        set: function (value) {
            this._bkgd = value;
            if (!this._background || !this._background.color) {
                if (!this._background)
                    this._background = {};
                if (typeof value === 'string')
                    this._background.color = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Slide.prototype, "background", {
        get: function () {
            return this._background;
        },
        set: function (props) {
            this._background = props;
            // Add background (image data/path must be captured before `exportPresentation()` is called)
            if (props)
                addBackgroundDefinition(props, this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Slide.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._color = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Slide.prototype, "hidden", {
        get: function () {
            return this._hidden;
        },
        set: function (value) {
            this._hidden = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Slide.prototype, "slideNumber", {
        get: function () {
            return this._slideNumberProps;
        },
        /**
         * @type {SlideNumberProps}
         */
        set: function (value) {
            // NOTE: Slide Numbers: In order for Slide Numbers to function they need to be in all 3 files: master/layout/slide
            this._slideNumberProps = value;
            this._setSlideNum(value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Slide.prototype, "newAutoPagedSlides", {
        get: function () {
            return this._newAutoPagedSlides;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Add chart to Slide
     * @param {CHART_NAME|IChartMulti[]} type - chart type
     * @param {object[]} data - data object
     * @param {IChartOpts} options - chart options
     * @return {Slide} this Slide
     */
    Slide.prototype.addChart = function (type, data, options) {
        // FUTURE: TODO-VERSION-4: Remove first arg - only take data and opts, with "type" required on opts
        // Set `_type` on IChartOptsLib as its what is used as object is passed around
        var optionsWithType = options || {};
        optionsWithType._type = type;
        addChartDefinition(this, type, data, options);
        return this;
    };
    /**
     * Add image to Slide
     * @param {ImageProps} options - image options
     * @return {Slide} this Slide
     */
    Slide.prototype.addImage = function (options) {
        addImageDefinition(this, options);
        return this;
    };
    /**
     * Add media (audio/video) to Slide
     * @param {MediaProps} options - media options
     * @return {Slide} this Slide
     */
    Slide.prototype.addMedia = function (options) {
        addMediaDefinition(this, options);
        return this;
    };
    /**
     * Add speaker notes to Slide
     * @docs https://gitbrent.github.io/PptxGenJS/docs/speaker-notes.html
     * @param {string} notes - notes to add to slide
     * @return {Slide} this Slide
     */
    Slide.prototype.addNotes = function (notes) {
        addNotesDefinition(this, notes);
        return this;
    };
    /**
     * Add shape to Slide
     * @param {SHAPE_NAME} shapeName - shape name
     * @param {ShapeProps} options - shape options
     * @return {Slide} this Slide
     */
    Slide.prototype.addShape = function (shapeName, options) {
        // NOTE: As of v3.1.0, <script> users are passing the old shape object from the shapes file (orig to the project)
        // But React/TypeScript users are passing the shapeName from an enum, which is a simple string, so lets cast
        // <script./> => `pptx.shapes.RECTANGLE` [string] "rect" ... shapeName['name'] = 'rect'
        // TypeScript => `pptxgen.shapes.RECTANGLE` [string] "rect" ... shapeName = 'rect'
        // let shapeNameDecode = typeof shapeName === 'object' && shapeName['name'] ? shapeName['name'] : shapeName
        addShapeDefinition(this, shapeName, options);
        return this;
    };
    /**
     * Add table to Slide
     * @param {TableRow[]} tableRows - table rows
     * @param {TableProps} options - table options
     * @return {Slide} this Slide
     */
    Slide.prototype.addTable = function (tableRows, options) {
        // FUTURE: we pass `this` - we dont need to pass layouts - they can be read from this!
        this._newAutoPagedSlides = addTableDefinition(this, tableRows, options, this._slideLayout, this._presLayout, this.addSlide, this.getSlide);
        return this;
    };
    /**
     * Add text to Slide
     * @param {string|TextProps[]} text - text string or complex object
     * @param {TextPropsOptions} options - text options
     * @return {Slide} this Slide
     */
    Slide.prototype.addText = function (text, options) {
        var textParam = typeof text === 'string' || typeof text === 'number' ? [{ text: text, options: options }] : text;
        addTextDefinition(this, textParam, options, false);
        return this;
    };
    return Slide;
}());

/**
 * PptxGenJS: Chart Generation
 */
/**
 * Based on passed data, creates Excel Worksheet that is used as a data source for a chart.
 * @param {ISlideRelChart} chartObject - chart object
 * @param {JSZip} zip - file that the resulting XLSX should be added to
 * @return {Promise} promise of generating the XLSX file
 */
function createExcelWorksheet(chartObject, zip) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = chartObject.data;
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var _a, _b;
                            var zipExcel = new JSZip__default["default"]();
                            var intBubbleCols = (data.length - 1) * 2 + 1; // 1 for "X-Values", then 2 for every Y-Axis
                            var IS_MULTI_CAT_AXES = ((_b = (_a = data[0]) === null || _a === void 0 ? void 0 : _a.labels) === null || _b === void 0 ? void 0 : _b.length) > 1;
                            // A: Add folders
                            zipExcel.folder('_rels');
                            zipExcel.folder('docProps');
                            zipExcel.folder('xl/_rels');
                            zipExcel.folder('xl/tables');
                            zipExcel.folder('xl/theme');
                            zipExcel.folder('xl/worksheets');
                            zipExcel.folder('xl/worksheets/_rels');
                            // B: Add core contents
                            {
                                zipExcel.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
                                    '  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
                                    '  <Default Extension="xml" ContentType="application/xml"/>' +
                                    '  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
                                    '  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
                                    '  <Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>' +
                                    '  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
                                    '  <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>' +
                                    '  <Override PartName="/xl/tables/table1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/>' +
                                    '  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
                                    '  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>' +
                                    '</Types>\n');
                                zipExcel.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
                                    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>' +
                                    '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>' +
                                    '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
                                    '</Relationships>\n');
                                zipExcel.file('docProps/app.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">' +
                                    '<Application>Microsoft Macintosh Excel</Application>' +
                                    '<DocSecurity>0</DocSecurity>' +
                                    '<ScaleCrop>false</ScaleCrop>' +
                                    '<HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant></vt:vector></HeadingPairs>' +
                                    '<TitlesOfParts><vt:vector size="1" baseType="lpstr"><vt:lpstr>Sheet1</vt:lpstr></vt:vector></TitlesOfParts>' +
                                    '<Company></Company><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>16.0300</AppVersion>' +
                                    '</Properties>\n');
                                zipExcel.file('docProps/core.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
                                    '<dc:creator>PptxGenJS</dc:creator>' +
                                    '<cp:lastModifiedBy>PptxGenJS</cp:lastModifiedBy>' +
                                    '<dcterms:created xsi:type="dcterms:W3CDTF">' +
                                    new Date().toISOString() +
                                    '</dcterms:created>' +
                                    '<dcterms:modified xsi:type="dcterms:W3CDTF">' +
                                    new Date().toISOString() +
                                    '</dcterms:modified>' +
                                    '</cp:coreProperties>');
                                zipExcel.file('xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                                    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
                                    '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
                                    '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>' +
                                    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
                                    '<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>' +
                                    '</Relationships>');
                                zipExcel.file('xl/styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="0" formatCode="General"/></numFmts><fonts count="4"><font><sz val="9"/><color indexed="8"/><name val="Geneva"/></font><font><sz val="9"/><color indexed="8"/><name val="Geneva"/></font><font><sz val="10"/><color indexed="8"/><name val="Geneva"/></font><font><sz val="18"/><color indexed="8"/>' +
                                    '<name val="Arial"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><dxfs count="0"/><tableStyles count="0"/><colors><indexedColors><rgbColor rgb="ff000000"/><rgbColor rgb="ffffffff"/><rgbColor rgb="ffff0000"/><rgbColor rgb="ff00ff00"/><rgbColor rgb="ff0000ff"/>' +
                                    '<rgbColor rgb="ffffff00"/><rgbColor rgb="ffff00ff"/><rgbColor rgb="ff00ffff"/><rgbColor rgb="ff000000"/><rgbColor rgb="ffffffff"/><rgbColor rgb="ff878787"/><rgbColor rgb="fff9f9f9"/></indexedColors></colors></styleSheet>\n');
                                zipExcel.file('xl/theme/theme1.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2><a:accent1><a:srgbClr val="4472C4"/></a:accent1><a:accent2><a:srgbClr val="ED7D31"/></a:accent2><a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4><a:accent5><a:srgbClr val="5B9BD5"/></a:accent5><a:accent6><a:srgbClr val="70AD47"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Calibri Light" panose="020F0302020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="Yu Gothic Light"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="DengXian Light"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont><a:minorFont><a:latin typeface="Calibri" panose="020F0502020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="Yu Gothic"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="DengXian"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/><a:tint val="67000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="103000"/><a:tint val="73000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="109000"/><a:tint val="81000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/><a:tint val="94000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/><a:shade val="100000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="99000"/><a:satMod val="120000"/><a:shade val="78000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="63000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/></a:schemeClr></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/><a:extLst><a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}"><thm15:themeFamily xmlns:thm15="http://schemas.microsoft.com/office/thememl/2012/main" name="Office Theme" id="{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}" vid="{4A3C46E8-61CC-4603-A589-7422A47A8E4A}"/></a:ext></a:extLst></a:theme>');
                                zipExcel.file('xl/workbook.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                                    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x15" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main">' +
                                    '<fileVersion appName="xl" lastEdited="7" lowestEdited="6" rupBuild="10507"/>' +
                                    '<workbookPr/>' +
                                    '<bookViews><workbookView xWindow="0" yWindow="500" windowWidth="20960" windowHeight="15960"/></bookViews>' +
                                    '<sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets>' +
                                    '<calcPr calcId="0" concurrentCalc="0"/>' +
                                    '</workbook>\n');
                                zipExcel.file('xl/worksheets/_rels/sheet1.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                                    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
                                    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Target="../tables/table1.xml"/>' +
                                    '</Relationships>\n');
                            }
                            // sharedStrings.xml
                            {
                                // A: Start XML
                                var strSharedStrings_1 = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
                                if (chartObject.opts._type === CHART_TYPE.BUBBLE || chartObject.opts._type === CHART_TYPE.BUBBLE3D) {
                                    strSharedStrings_1 += "<sst xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" count=\"".concat(intBubbleCols, "\" uniqueCount=\"").concat(intBubbleCols, "\">");
                                }
                                else if (chartObject.opts._type === CHART_TYPE.SCATTER) {
                                    strSharedStrings_1 += "<sst xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" count=\"".concat(data.length, "\" uniqueCount=\"").concat(data.length, "\">");
                                }
                                else if (IS_MULTI_CAT_AXES) {
                                    var totCount_1 = data.length;
                                    data[0].labels.forEach(function (arrLabel) { return (totCount_1 += arrLabel.filter(function (label) { return label && label !== ''; }).length); });
                                    strSharedStrings_1 += "<sst xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" count=\"".concat(totCount_1, "\" uniqueCount=\"").concat(totCount_1, "\">");
                                    strSharedStrings_1 += '<si><t/></si>';
                                }
                                else {
                                    // series names + all labels of one series + number of label groups (data.labels.length) of one series (i.e. how many times the blank string is used)
                                    var totCount = data.length + data[0].labels.length * data[0].labels[0].length + data[0].labels.length;
                                    // series names + labels of one series + blank string (same for all label groups)
                                    var unqCount = data.length + data[0].labels.length * data[0].labels[0].length + 1;
                                    // start `sst`
                                    strSharedStrings_1 += "<sst xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" count=\"".concat(totCount, "\" uniqueCount=\"").concat(unqCount, "\">");
                                    // B: Add 'blank' for A1, B1, ..., of every label group inside data[n].labels
                                    strSharedStrings_1 += '<si><t xml:space="preserve"></t></si>';
                                }
                                // C: Add `name`/Series
                                if (chartObject.opts._type === CHART_TYPE.BUBBLE || chartObject.opts._type === CHART_TYPE.BUBBLE3D) {
                                    data.forEach(function (objData, idx) {
                                        if (idx === 0)
                                            strSharedStrings_1 += '<si><t>X-Axis</t></si>';
                                        else {
                                            strSharedStrings_1 += "<si><t>".concat(encodeXmlEntities(objData.name || "Y-Axis".concat(idx)), "</t></si>");
                                            strSharedStrings_1 += "<si><t>".concat(encodeXmlEntities("Size".concat(idx)), "</t></si>");
                                        }
                                    });
                                }
                                else {
                                    data.forEach(function (objData) {
                                        strSharedStrings_1 += "<si><t>".concat(encodeXmlEntities((objData.name || ' ').replace('X-Axis', 'X-Values')), "</t></si>");
                                    });
                                }
                                // D: Add `labels`/Categories
                                if (chartObject.opts._type !== CHART_TYPE.BUBBLE && chartObject.opts._type !== CHART_TYPE.BUBBLE3D && chartObject.opts._type !== CHART_TYPE.SCATTER) {
                                    // Use forEach backwards & check for '' to support multi-cat axes
                                    data[0].labels
                                        .slice()
                                        .reverse()
                                        .forEach(function (labelsGroup) {
                                        labelsGroup
                                            .filter(function (label) { return label && label !== ''; })
                                            .forEach(function (label) {
                                            strSharedStrings_1 += "<si><t>".concat(encodeXmlEntities(label), "</t></si>");
                                        });
                                    });
                                }
                                // DONE:
                                strSharedStrings_1 += '</sst>\n';
                                zipExcel.file('xl/sharedStrings.xml', strSharedStrings_1);
                            }
                            // tables/table1.xml
                            {
                                var strTableXml_1 = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
                                if (chartObject.opts._type === CHART_TYPE.BUBBLE || chartObject.opts._type === CHART_TYPE.BUBBLE3D) {
                                    strTableXml_1 += "<table xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" id=\"1\" name=\"Table1\" displayName=\"Table1\" ref=\"A1:".concat(getExcelColName(intBubbleCols)).concat(intBubbleCols, "\" totalsRowShown=\"0\">");
                                    strTableXml_1 += "<tableColumns count=\"".concat(intBubbleCols, "\">");
                                    var idxColLtr_1 = 1;
                                    data.forEach(function (obj, idx) {
                                        if (idx === 0) {
                                            strTableXml_1 += "<tableColumn id=\"".concat(idx + 1, "\" name=\"X-Values\"/>");
                                        }
                                        else {
                                            strTableXml_1 += "<tableColumn id=\"".concat(idx + idxColLtr_1, "\" name=\"").concat(obj.name, "\"/>");
                                            idxColLtr_1++;
                                            strTableXml_1 += "<tableColumn id=\"".concat(idx + idxColLtr_1, "\" name=\"Size").concat(idx, "\"/>");
                                        }
                                    });
                                }
                                else if (chartObject.opts._type === CHART_TYPE.SCATTER) {
                                    strTableXml_1 += "<table xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" id=\"1\" name=\"Table1\" displayName=\"Table1\" ref=\"A1:".concat(getExcelColName(data.length)).concat(data[0].values.length + 1, "\" totalsRowShown=\"0\">");
                                    strTableXml_1 += "<tableColumns count=\"".concat(data.length, "\">");
                                    data.forEach(function (_obj, idx) {
                                        strTableXml_1 += "<tableColumn id=\"".concat(idx + 1, "\" name=\"").concat(idx === 0 ? 'X-Values' : 'Y-Value ').concat(idx, "\"/>");
                                    });
                                }
                                else {
                                    strTableXml_1 += "<table xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" id=\"1\" name=\"Table1\" displayName=\"Table1\" ref=\"A1:".concat(getExcelColName(data.length + data[0].labels.length)).concat(data[0].labels[0].length + 1, "'\" totalsRowShown=\"0\">");
                                    strTableXml_1 += "<tableColumns count=\"".concat(data.length + data[0].labels.length, "\">");
                                    data[0].labels.forEach(function (_labelsGroup, idx) {
                                        strTableXml_1 += "<tableColumn id=\"".concat(idx + 1, "\" name=\"Column").concat(idx + 1, "\"/>");
                                    });
                                    data.forEach(function (obj, idx) {
                                        strTableXml_1 += "<tableColumn id=\"".concat(idx + data[0].labels.length + 1, "\" name=\"").concat(encodeXmlEntities(obj.name), "\"/>");
                                    });
                                }
                                strTableXml_1 += '</tableColumns>';
                                strTableXml_1 += '<tableStyleInfo showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/>';
                                strTableXml_1 += '</table>';
                                zipExcel.file('xl/tables/table1.xml', strTableXml_1);
                            }
                            // worksheets/sheet1.xml
                            {
                                var strSheetXml_1 = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
                                strSheetXml_1 +=
                                    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">';
                                if (chartObject.opts._type === CHART_TYPE.BUBBLE || chartObject.opts._type === CHART_TYPE.BUBBLE3D) {
                                    strSheetXml_1 += "<dimension ref=\"A1:".concat(getExcelColName(intBubbleCols)).concat(data[0].values.length + 1, "\"/>");
                                }
                                else if (chartObject.opts._type === CHART_TYPE.SCATTER) {
                                    strSheetXml_1 += "<dimension ref=\"A1:".concat(getExcelColName(data.length)).concat(data[0].values.length + 1, "\"/>");
                                }
                                else {
                                    strSheetXml_1 += "<dimension ref=\"A1:".concat(getExcelColName(data.length + 1)).concat(data[0].values.length + 1, "\"/>");
                                }
                                strSheetXml_1 += '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><selection activeCell="B1" sqref="B1"/></sheetView></sheetViews>';
                                strSheetXml_1 += '<sheetFormatPr baseColWidth="10" defaultRowHeight="16"/>';
                                if (chartObject.opts._type === CHART_TYPE.BUBBLE || chartObject.opts._type === CHART_TYPE.BUBBLE3D) {
                                    // UNUSED: strSheetXml += `<cols><col min="1" max="${data.length}" width="11" customWidth="1" /></cols>`
                                    /* EX: INPUT: `data`
                                    [
                                        { name:'X-Axis'  , values:[10,11,12,13,14,15,16,17,18,19,20] },
                                        { name:'Y-Axis 1', values:[ 1, 6, 7, 8, 9], sizes:[ 4, 5, 6, 7, 8] },
                                        { name:'Y-Axis 2', values:[33,32,42,53,63], sizes:[11,12,13,14,15] }
                                    ];
                                    */
                                    /* EX: OUTPUT: bubbleChart Worksheet:
                                        -|----A-----|------B-----|------C-----|------D-----|------E-----|
                                        1| X-Values | Y-Values 1 | Y-Sizes 1  | Y-Values 2 | Y-Sizes 2  |
                                        2|    11    |     22     |      4     |     33     |      8     |
                                        -|----------|------------|------------|------------|------------|
                                    */
                                    strSheetXml_1 += '<sheetData>';
                                    // A: Create header row first (NOTE: Start at index=1 as headers cols start with 'B')
                                    strSheetXml_1 += "<row r=\"1\" spans=\"1:".concat(intBubbleCols, "\">");
                                    strSheetXml_1 += '<c r="A1" t="s"><v>0</v></c>';
                                    for (var idx = 1; idx < intBubbleCols; idx++) {
                                        strSheetXml_1 += "<c r=\"".concat(getExcelColName(idx + 1), "1\" t=\"s\"><v>").concat(idx, "</v></c>"); // NOTE: add `t="s"` for label cols!
                                    }
                                    strSheetXml_1 += '</row>';
                                    // B: Add row for each X-Axis value (Y-Axis* value is optional)
                                    data[0].values.forEach(function (val, idx) {
                                        // Leading col is reserved for the 'X-Axis' value, so hard-code it, then loop over col values
                                        strSheetXml_1 += "<row r=\"".concat(idx + 2, "\" spans=\"1:").concat(intBubbleCols, "\">");
                                        strSheetXml_1 += "<c r=\"A".concat(idx + 2, "\"><v>").concat(val, "</v></c>");
                                        // Add Y-Axis 1->N (idy=0 = Xaxis)
                                        var idxColLtr = 2;
                                        for (var idy = 1; idy < data.length; idy++) {
                                            // y-value
                                            strSheetXml_1 += "<c r=\"".concat(getExcelColName(idxColLtr)).concat(idx + 2, "\"><v>").concat(data[idy].values[idx] || '', "</v></c>");
                                            idxColLtr++;
                                            // y-size
                                            strSheetXml_1 += "<c r=\"".concat(getExcelColName(idxColLtr)).concat(idx + 2, "\"><v>").concat(data[idy].sizes[idx] || '', "</v></c>");
                                            idxColLtr++;
                                        }
                                        strSheetXml_1 += '</row>';
                                    });
                                }
                                else if (chartObject.opts._type === CHART_TYPE.SCATTER) {
                                    /* UNUSED:
                                        strSheetXml += '<cols>'
                                        strSheetXml += '<col min="1" max="' + data.length + '" width="11" customWidth="1" />'
                                        //data.forEach((obj,idx)=>{ strSheetXml += '<col min="'+(idx+1)+'" max="'+(idx+1)+'" width="11" customWidth="1" />' });
                                        strSheetXml += '</cols>'
                                    */
                                    /* EX: INPUT: `data`
                                        [
                                            { name:'X-AxisA', values:[ 1, 2, 3, 4, 5] },
                                            { name:'Y-AxisB', values:[ 2,22,42,52,62] },
                                            { name:'Y-AxisC', values:[ 3,33,43,53,63] }
                                        ];
                                    */
                                    /* EX: OUTPUT: sheet1.xml:
                                        -|----A----|----B----|----C----|
                                        1| X-AxisA | Y-AxisB | Y-AxisC |
                                        2|    1    |    2    |    3    |
                                        -|---------|---------|---------|
                                    */
                                    strSheetXml_1 += '<sheetData>';
                                    // A: Create header row first (every `name` row provided)
                                    strSheetXml_1 += "<row r=\"1\" spans=\"1:".concat(data.length, "\">");
                                    for (var idx = 0; idx < data.length; idx++) {
                                        strSheetXml_1 += "<c r=\"".concat(getExcelColName(idx + 1), "1\" t=\"s\"><v>").concat(idx, "</v></c>"); // NOTE: add `t="s"` for label cols!
                                    }
                                    strSheetXml_1 += '</row>';
                                    // B: Add row for each X-Axis value (Y-Axis* value is optional)
                                    data[0].values.forEach(function (val, idx) {
                                        // Leading col is reserved for the 'X-Axis' value, so hard-code it, then loop over col values
                                        strSheetXml_1 += "<row r=\"".concat(idx + 2, "\" spans=\"1:").concat(data.length, "\">");
                                        strSheetXml_1 += "<c r=\"A".concat(idx + 2, "\"><v>").concat(val, "</v></c>");
                                        // Add Y-Axis 1->N
                                        for (var idy = 1; idy < data.length; idy++) {
                                            strSheetXml_1 += "<c r=\"".concat(getExcelColName(idy + 1)).concat(idx + 2, "\"><v>").concat(data[idy].values[idx] || data[idy].values[idx] === 0 ? data[idy].values[idx] : '', "</v></c>");
                                        }
                                        strSheetXml_1 += '</row>';
                                    });
                                }
                                else {
                                    // strSheetXml += '<cols><col min="1" max="1" width="11" customWidth="1" /></cols>'
                                    strSheetXml_1 += '<sheetData>';
                                    /* EX: INPUT: `data`
                                        [
                                            { name:'Red', labels:['Jan..May-17'], values:[11,13,14,15,16] },
                                            { name:'Amb', labels:['Jan..May-17'], values:[22, 6, 7, 8, 9] },
                                            { name:'Grn', labels:['Jan..May-17'], values:[33,32,42,53,63] }
                                        ];
                                    */
                                    /* EX: OUTPUT: lineChart Worksheet:
                                        -|---A---|--B--|--C--|--D--|
                                        1|       | Red | Amb | Grn |
                                        2|Jan-17 |   11|   22|   33|
                                        3|Feb-17 |   55|   43|   70|
                                        4|Mar-17 |   56|  143|   99|
                                        5|Apr-17 |   65|    3|  120|
                                        6|May-17 |   75|   93|  170|
                                        -|-------|-----|-----|-----|
                                    */
                                    if (!IS_MULTI_CAT_AXES) {
                                        // A: Create header row first
                                        strSheetXml_1 += "<row r=\"1\" spans=\"1:".concat(data.length + data[0].labels.length, "\">");
                                        data[0].labels.forEach(function (_labelsGroup, idx) {
                                            strSheetXml_1 += "<c r=\"".concat(getExcelColName(idx + 1), "1\" t=\"s\"><v>0</v></c>");
                                        });
                                        for (var idx = 0; idx < data.length; idx++) {
                                            strSheetXml_1 += "<c r=\"".concat(getExcelColName(idx + 1 + data[0].labels.length), "1\" t=\"s\"><v>").concat(idx + 1, "</v></c>"); // NOTE: use `t="s"` for label cols!
                                        }
                                        strSheetXml_1 += '</row>';
                                        // B: Add data row(s) for each category
                                        data[0].labels[0].forEach(function (_cat, idx) {
                                            strSheetXml_1 += "<row r=\"".concat(idx + 2, "\" spans=\"1:").concat(data.length + data[0].labels.length, "\">");
                                            // Leading cols are reserved for the label groups
                                            for (var idx2 = data[0].labels.length - 1; idx2 >= 0; idx2--) {
                                                strSheetXml_1 += "<c r=\"".concat(getExcelColName(data[0].labels.length - idx2)).concat(idx + 2, "\" t=\"s\">");
                                                strSheetXml_1 += "<v>".concat(data.length + idx + 1, "</v>");
                                                strSheetXml_1 += '</c>';
                                            }
                                            for (var idy = 0; idy < data.length; idy++) {
                                                strSheetXml_1 += "<c r=\"".concat(getExcelColName(data[0].labels.length + idy + 1)).concat(idx + 2, "\"><v>").concat(data[idy].values[idx] || '', "</v></c>");
                                            }
                                            strSheetXml_1 += '</row>';
                                        });
                                    }
                                    else {
                                        // A: create header row
                                        strSheetXml_1 += "<row r=\"1\" spans=\"1:".concat(data.length + data[0].labels.length, "\">");
                                        for (var idx = 0; idx < data[0].labels.length; idx++) {
                                            strSheetXml_1 += "<c r=\"".concat(getExcelColName(idx + 1), "1\" t=\"s\"><v>0</v></c>");
                                        }
                                        for (var idx = data[0].labels.length - 1; idx < data.length + data[0].labels.length - 1; idx++) {
                                            strSheetXml_1 += "<c r=\"".concat(getExcelColName(idx + data[0].labels.length), "1\" t=\"s\"><v>").concat(idx, "</v></c>"); // NOTE: use `t="s"` for label cols!
                                        }
                                        strSheetXml_1 += '</row>';
                                        // FIXME: 20220524 (v3.11.0)
                                        /**
                                         * @example INPUT
                                         * const LABELS = [
                                         *   ["Gear", "Berg", "Motr", "Swch", "Plug", "Cord", "Pump", "Leak", "Seal"],
                                         *   ["Mech", "", "", "Elec", "", "", "Hydr", "", ""],
                                         * ];
                                         * const arrDataRegions = [
                                         *   { name: "West", labels: LABELS, values: [11, 8, 3, 0, 11, 3, 0, 0, 0] },
                                         *   { name: "Ctrl", labels: LABELS, values: [0, 11, 6, 19, 12, 5, 0, 0, 0] },
                                         *   { name: "East", labels: LABELS, values: [0, 3, 2, 0, 0, 0, 4, 3, 1] },
                                         * ];
                                         */
                                        /**
                                         * @example OUTPUT EXCEL SHEET
                                         * |/|---A--|---B--|---C--|---D--|---E--|
                                         * |1|      |      | West | Ctrl | East |
                                         * |2| Mech | Gear |  ##  |  ##  |  ##  |
                                         * |3|      | Brng |  ##  |  ##  |  ##  |
                                         * |4|      | Motr |  ##  |  ##  |  ##  |
                                         * |5| Elec | Swch |  ##  |  ##  |  ##  |
                                         * |6|      | Plug |  ##  |  ##  |  ##  |
                                         * |7|      | Cord |  ##  |  ##  |  ##  |
                                         * |8| Hydr | Pump |  ##  |  ##  |  ##  |
                                         * |9|      | Leak |  ##  |  ##  |  ##  |
                                         *|10|      | Seal |  ##  |  ##  |  ##  |
                                         */
                                        /**
                                         * @example OUTPUT EXCEL SHEET XML
                                         * <row r="1" spans="1:5">
                                         *   <c r="A1" t="s"><v>0</v></c>
                                         *   <c r="B1" t="s"><v>0</v></c>
                                         *   <c r="C1" t="s"><v>1</v></c>
                                         *   <c r="D1" t="s"><v>2</v></c>
                                         *   <c r="E1" t="s"><v>3</v></c>
                                         * </row>
                                         * <row r="2" spans="1:5">
                                         *   <c r="A2" t="s"><v>4</v></c>
                                         *   <c r="B2" t="s"><v>7</v></c>
                                         *   <c r="C2"      ><v>###</v></c>
                                         * </row>
                                         * <row r="3" spans="1:5">
                                         *   <c r="A3" />
                                         *   <c r="B3" t="s"><v>8</v></c>
                                         *   <c r="C3"      ><v>###</v></c>
                                         * </row>
                                         */
                                        /**
                                         * @example SHARED-STRINGS
                                         * 1=West, 2=Ctrl, 3=East, 4=Mech, 5=Elec, 6=Mydr, 7=Gear, 8=Brng, [...], 15=Seal
                                         */
                                        // B: Add data row(s) for each category
                                        /**
                                         * const LABELS = [
                                         *   ["Gear", "Berg", "Motr", "Swch", "Plug", "Cord", "Pump", "Leak", "Seal"],
                                         *   ["Mech",     "",     "", "Elec",     "",     "", "Hydr",     "",     ""],
                                         *   ["2010",     "",     "",     "",     "",     "",     "",     "",     ""],
                                         * ];
                                         */
                                        var TOT_SER = data.length;
                                        var TOT_CAT = data[0].labels[0].length;
                                        var TOT_LVL = data[0].labels.length;
                                        var _loop_1 = function (idx) {
                                            // A: start row
                                            strSheetXml_1 += "<row r=\"".concat(idx + 2, "\" spans=\"1:").concat(TOT_SER + TOT_LVL, "\">");
                                            // WIP: FIXME:
                                            // B: add a col for each label/cat
                                            var totLabels = TOT_SER;
                                            var revLabelGroups = data[0].labels.slice().reverse();
                                            revLabelGroups.forEach(function (labelsGroup, idy) {
                                                /**
                                                 * const LABELS_REVERSED = [
                                                 *   ["Mech",     "",     "", "Elec",     "",     "", "Hydr",     "",     ""],
                                                 *   ["Gear", "Berg", "Motr", "Swch", "Plug", "Cord", "Pump", "Leak", "Seal"],
                                                 * ];
                                                 */
                                                var colLabel = labelsGroup[idx];
                                                if (colLabel) {
                                                    var totGrpLbls = idy === 0 ? 1 : revLabelGroups[idy - 1].filter(function (label) { return label && label !== ''; }).length; // get unique label so we can add to get proper shared-string #
                                                    totLabels += totGrpLbls;
                                                    strSheetXml_1 += "<c r=\"".concat(getExcelColName(idx + 1 + idy)).concat(idx + 2, "\" t=\"s\"><v>").concat(totLabels, "</v></c>");
                                                }
                                            });
                                            // WIP: FIXME:
                                            // C: add a col for each data value
                                            for (var idy = 0; idy < TOT_SER; idy++) {
                                                strSheetXml_1 += "<c r=\"".concat(getExcelColName(TOT_LVL + idy + 1)).concat(idx + 2, "\"><v>").concat(data[idy].values[idx] || 0, "</v></c>");
                                            }
                                            // D: Done
                                            strSheetXml_1 += '</row>';
                                        };
                                        // Iterate across labels/cats as these are the <row>'s
                                        for (var idx = 0; idx < TOT_CAT; idx++) {
                                            _loop_1(idx);
                                        }
                                        // console.log(strSheetXml) // WIP: CHECK:
                                        // console.log(`---CHECK ABOVE---------------------`)
                                    }
                                }
                                strSheetXml_1 += '</sheetData>';
                                /* FIXME: support multi-level
                                if (IS_MULTI_CAT_AXES) {
                                    strSheetXml += '<mergeCells count="3">'
                                    strSheetXml += ' <mergeCell ref="A2:A4"/>'
                                    strSheetXml += ' <mergeCell ref="A10:A12"/>'
                                    strSheetXml += ' <mergeCell ref="A5:A9"/>'
                                    strSheetXml += '</mergeCells>'
                                }
                                */
                                strSheetXml_1 += '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>';
                                // Link the `table1.xml` file to define an actual Table in Excel
                                // NOTE: This only works with scatter charts - all others give a "cannot find linked file" error
                                // ....: Since we dont need the table anyway (chart data can be edited/range selected, etc.), just dont use this
                                // ....: Leaving this so nobody foolishly attempts to add this in the future
                                // strSheetXml += '<tableParts count="1"><tablePart r:id="rId1"/></tableParts>'
                                strSheetXml_1 += '</worksheet>\n';
                                zipExcel.file('xl/worksheets/sheet1.xml', strSheetXml_1);
                            }
                            // C: Add XLSX to PPTX export
                            zipExcel
                                .generateAsync({ type: 'base64' })
                                .then(function (content) {
                                // 1: Create the embedded Excel worksheet with labels and data
                                zip.file("ppt/embeddings/Microsoft_Excel_Worksheet".concat(chartObject.globalId, ".xlsx"), content, { base64: true });
                                // 2: Create the chart.xml and rel files
                                zip.file('ppt/charts/_rels/' + chartObject.fileName + '.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                                    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
                                    "<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/package\" Target=\"../embeddings/Microsoft_Excel_Worksheet".concat(chartObject.globalId, ".xlsx\"/>") +
                                    '</Relationships>');
                                zip.file("ppt/charts/".concat(chartObject.fileName), makeXmlCharts(chartObject));
                                // 3: Done
                                resolve('');
                            })
                                .catch(function (strErr) {
                                reject(strErr);
                            });
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * Main entry point method for create charts
 * @see: http://www.datypic.com/sc/ooxml/s-dml-chart.xsd.html
 * @param {ISlideRelChart} rel - chart object
 * @return {string} XML
 */
function makeXmlCharts(rel) {
    var _a, _b, _c, _d;
    var strXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    var usesSecondaryValAxis = false;
    // STEP 1: Create chart
    {
        // CHARTSPACE: BEGIN vvv
        strXml +=
            '<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">';
        strXml += '<c:date1904 val="0"/>'; // ppt defaults to 1904 dates, excel to 1900
        strXml += "<c:roundedCorners val=\"".concat(rel.opts.chartArea.roundedCorners ? '1' : '0', "\"/>");
        strXml += '<c:chart>';
        // OPTION: Title
        if (rel.opts.showTitle) {
            strXml += genXmlTitle({
                title: rel.opts.title || 'Chart Title',
                color: rel.opts.titleColor,
                fontFace: rel.opts.titleFontFace,
                fontSize: rel.opts.titleFontSize || DEF_FONT_TITLE_SIZE,
                titleAlign: rel.opts.titleAlign,
                titleBold: rel.opts.titleBold,
                titlePos: rel.opts.titlePos,
                titleRotate: rel.opts.titleRotate,
            }, rel.opts.x, rel.opts.y);
            strXml += '<c:autoTitleDeleted val="0"/>';
        }
        else {
            // NOTE: Add autoTitleDeleted tag in else to prevent default creation of chart title even when showTitle is set to false
            strXml += '<c:autoTitleDeleted val="1"/>';
        }
        /** Add 3D view tag
         * @see: https://c-rex.net/projects/samples/ooxml/e1/Part4/OOXML_P4_DOCX_perspective_topic_ID0E6BUQB.html
         */
        if (rel.opts._type === CHART_TYPE.BAR3D) {
            strXml += "<c:view3D><c:rotX val=\"".concat(rel.opts.v3DRotX, "\"/><c:rotY val=\"").concat(rel.opts.v3DRotY, "\"/><c:rAngAx val=\"").concat(!rel.opts.v3DRAngAx ? 0 : 1, "\"/><c:perspective val=\"").concat(rel.opts.v3DPerspective, "\"/></c:view3D>");
        }
        strXml += '<c:plotArea>';
        // IMPORTANT: Dont specify layout to enable auto-fit: PPT does a great job maximizing space with all 4 TRBL locations
        if (rel.opts.layout) {
            strXml += '<c:layout>';
            strXml += ' <c:manualLayout>';
            strXml += '  <c:layoutTarget val="inner" />';
            strXml += '  <c:xMode val="edge" />';
            strXml += '  <c:yMode val="edge" />';
            strXml += '  <c:x val="' + (rel.opts.layout.x || 0) + '" />';
            strXml += '  <c:y val="' + (rel.opts.layout.y || 0) + '" />';
            strXml += '  <c:w val="' + (rel.opts.layout.w || 1) + '" />';
            strXml += '  <c:h val="' + (rel.opts.layout.h || 1) + '" />';
            strXml += ' </c:manualLayout>';
            strXml += '</c:layout>';
        }
        else {
            strXml += '<c:layout/>';
        }
    }
    // A: Create Chart XML -----------------------------------------------------------
    if (Array.isArray(rel.opts._type)) {
        rel.opts._type.forEach(function (type) {
            // TODO: FIXME: theres `options` on chart rels??
            var options = __assign(__assign({}, rel.opts), type.options);
            // let options: IChartOptsLib = { type: type.type, }
            var valAxisId = options.secondaryValAxis ? AXIS_ID_VALUE_SECONDARY : AXIS_ID_VALUE_PRIMARY;
            var catAxisId = options.secondaryCatAxis ? AXIS_ID_CATEGORY_SECONDARY : AXIS_ID_CATEGORY_PRIMARY;
            usesSecondaryValAxis = usesSecondaryValAxis || options.secondaryValAxis;
            strXml += makeChartType(type.type, type.data, options, valAxisId, catAxisId);
        });
    }
    else {
        strXml += makeChartType(rel.opts._type, rel.data, rel.opts, AXIS_ID_VALUE_PRIMARY, AXIS_ID_CATEGORY_PRIMARY);
    }
    // B: Axes -----------------------------------------------------------
    if (rel.opts._type !== CHART_TYPE.PIE && rel.opts._type !== CHART_TYPE.DOUGHNUT) {
        // Param check
        if (rel.opts.valAxes && rel.opts.valAxes.length > 1 && !usesSecondaryValAxis) {
            throw new Error('Secondary axis must be used by one of the multiple charts');
        }
        if (rel.opts.catAxes) {
            if (!rel.opts.valAxes || rel.opts.valAxes.length !== rel.opts.catAxes.length) {
                throw new Error('There must be the same number of value and category axes.');
            }
            strXml += makeCatAxis(__assign(__assign({}, rel.opts), rel.opts.catAxes[0]), AXIS_ID_CATEGORY_PRIMARY, AXIS_ID_VALUE_PRIMARY);
        }
        else {
            strXml += makeCatAxis(rel.opts, AXIS_ID_CATEGORY_PRIMARY, AXIS_ID_VALUE_PRIMARY);
        }
        if (rel.opts.valAxes) {
            strXml += makeValAxis(__assign(__assign({}, rel.opts), rel.opts.valAxes[0]), AXIS_ID_VALUE_PRIMARY);
            if (rel.opts.valAxes[1]) {
                strXml += makeValAxis(__assign(__assign({}, rel.opts), rel.opts.valAxes[1]), AXIS_ID_VALUE_SECONDARY);
            }
        }
        else {
            strXml += makeValAxis(rel.opts, AXIS_ID_VALUE_PRIMARY);
            // Add series axis for 3D bar
            if (rel.opts._type === CHART_TYPE.BAR3D) {
                strXml += makeSerAxis(rel.opts, AXIS_ID_SERIES_PRIMARY, AXIS_ID_VALUE_PRIMARY);
            }
        }
        // Combo Charts: Add secondary axes after all vals
        if (((_a = rel.opts) === null || _a === void 0 ? void 0 : _a.catAxes) && ((_b = rel.opts) === null || _b === void 0 ? void 0 : _b.catAxes[1])) {
            strXml += makeCatAxis(__assign(__assign({}, rel.opts), rel.opts.catAxes[1]), AXIS_ID_CATEGORY_SECONDARY, AXIS_ID_VALUE_SECONDARY);
        }
    }
    // C: Chart Properties and plotArea Options: Border, Data Table, Fill, Legend
    {
        // NOTE: DataTable goes between '</c:valAx>' and '<c:spPr>'
        if (rel.opts.showDataTable) {
            strXml += '<c:dTable>';
            strXml += "  <c:showHorzBorder val=\"".concat(!rel.opts.showDataTableHorzBorder ? 0 : 1, "\"/>");
            strXml += "  <c:showVertBorder val=\"".concat(!rel.opts.showDataTableVertBorder ? 0 : 1, "\"/>");
            strXml += "  <c:showOutline    val=\"".concat(!rel.opts.showDataTableOutline ? 0 : 1, "\"/>");
            strXml += "  <c:showKeys       val=\"".concat(!rel.opts.showDataTableKeys ? 0 : 1, "\"/>");
            strXml += '  <c:spPr>';
            strXml += '    <a:noFill/>';
            strXml += '    <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="15000"/><a:lumOff val="85000"/></a:schemeClr></a:solidFill><a:round/></a:ln>';
            strXml += '    <a:effectLst/>';
            strXml += '  </c:spPr>';
            strXml += '  <c:txPr>';
            strXml += '   <a:bodyPr rot="0" spcFirstLastPara="1" vertOverflow="ellipsis" vert="horz" wrap="square" anchor="ctr" anchorCtr="1"/>';
            strXml += '   <a:lstStyle/>';
            strXml += '   <a:p>';
            strXml += '     <a:pPr rtl="0">';
            strXml += "       <a:defRPr sz=\"".concat(Math.round((rel.opts.dataTableFontSize || DEF_FONT_SIZE) * 100), "\" b=\"0\" i=\"0\" u=\"none\" strike=\"noStrike\" kern=\"1200\" baseline=\"0\">");
            strXml += '         <a:solidFill><a:schemeClr val="tx1"><a:lumMod val="65000"/><a:lumOff val="35000"/></a:schemeClr></a:solidFill>';
            strXml += '         <a:latin typeface="+mn-lt"/>';
            strXml += '         <a:ea typeface="+mn-ea"/>';
            strXml += '         <a:cs typeface="+mn-cs"/>';
            strXml += '       </a:defRPr>';
            strXml += '     </a:pPr>';
            strXml += '    <a:endParaRPr lang="en-US"/>';
            strXml += '   </a:p>';
            strXml += ' </c:txPr>';
            strXml += '</c:dTable>';
        }
        strXml += '  <c:spPr>';
        // OPTION: Fill
        strXml += ((_c = rel.opts.plotArea.fill) === null || _c === void 0 ? void 0 : _c.color) ? genXmlColorSelection(rel.opts.plotArea.fill) : '<a:noFill/>';
        // OPTION: Border
        strXml += rel.opts.plotArea.border
            ? "<a:ln w=\"".concat(valToPts(rel.opts.plotArea.border.pt), "\" cap=\"flat\">").concat(genXmlColorSelection(rel.opts.plotArea.border.color), "</a:ln>")
            : '<a:ln><a:noFill/></a:ln>';
        // Close shapeProp/plotArea before Legend
        strXml += '    <a:effectLst/>';
        strXml += '  </c:spPr>';
        strXml += '</c:plotArea>';
        // OPTION: Legend
        // IMPORTANT: Dont specify layout to enable auto-fit: PPT does a great job maximizing space with all 4 TRBL locations
        if (rel.opts.showLegend) {
            strXml += '<c:legend>';
            strXml += '<c:legendPos val="' + rel.opts.legendPos + '"/>';
            // strXml += '<c:layout/>'
            strXml += '<c:overlay val="0"/>';
            if (rel.opts.legendFontFace || rel.opts.legendFontSize || rel.opts.legendColor) {
                strXml += '<c:txPr>';
                strXml += '  <a:bodyPr/>';
                strXml += '  <a:lstStyle/>';
                strXml += '  <a:p>';
                strXml += '    <a:pPr>';
                strXml += rel.opts.legendFontSize ? "<a:defRPr sz=\"".concat(Math.round(Number(rel.opts.legendFontSize) * 100), "\">") : '<a:defRPr>';
                if (rel.opts.legendColor)
                    strXml += genXmlColorSelection(rel.opts.legendColor);
                if (rel.opts.legendFontFace)
                    strXml += '<a:latin typeface="' + rel.opts.legendFontFace + '"/>';
                if (rel.opts.legendFontFace)
                    strXml += '<a:cs    typeface="' + rel.opts.legendFontFace + '"/>';
                strXml += '      </a:defRPr>';
                strXml += '    </a:pPr>';
                strXml += '    <a:endParaRPr lang="en-US"/>';
                strXml += '  </a:p>';
                strXml += '</c:txPr>';
            }
            strXml += '</c:legend>';
        }
    }
    strXml += '  <c:plotVisOnly val="1"/>';
    strXml += '  <c:dispBlanksAs val="' + rel.opts.displayBlanksAs + '"/>';
    if (rel.opts._type === CHART_TYPE.SCATTER)
        strXml += '<c:showDLblsOverMax val="1"/>';
    strXml += '</c:chart>';
    // D: CHARTSPACE SHAPE PROPS
    strXml += '<c:spPr>';
    strXml += ((_d = rel.opts.chartArea.fill) === null || _d === void 0 ? void 0 : _d.color) ? genXmlColorSelection(rel.opts.chartArea.fill) : '<a:noFill/>';
    strXml += rel.opts.chartArea.border
        ? "<a:ln w=\"".concat(valToPts(rel.opts.chartArea.border.pt), "\" cap=\"flat\">").concat(genXmlColorSelection(rel.opts.chartArea.border.color), "</a:ln>")
        : '<a:ln><a:noFill/></a:ln>';
    strXml += '  <a:effectLst/>';
    strXml += '</c:spPr>';
    // E: DATA (Add relID)
    strXml += '<c:externalData r:id="rId1"><c:autoUpdate val="0"/></c:externalData>';
    // LAST: chartSpace end
    strXml += '</c:chartSpace>';
    return strXml;
}
/**
 * Create XML string for any given chart type
 * @param {CHART_NAME} chartType chart type name
 * @param {IOptsChartData[]} data chart data
 * @param {IChartOptsLib} opts chart options
 * @param {string} valAxisId chart val axis id
 * @param {string} catAxisId chart cat axis id
 * @param {boolean} isMultiTypeChart is this a mutli-type chart?
 * @example 'bubble' returns <c:bubbleChart></c>
 * @example '<c:lineChart>'
 * @return {string} XML chart
 */
function makeChartType(chartType, data, opts, valAxisId, catAxisId, isMultiTypeChart) {
    // NOTE: "Chart Range" (as shown in "select Chart Area dialog") is calculated.
    // ....: Ensure each X/Y Axis/Col has same row height (esp. applicable to XY Scatter where X can often be larger than Y's)
    var colorIndex = -1; // Maintain the color index by region
    var idxColLtr = 1;
    var optsChartData = null;
    var strXml = '';
    switch (chartType) {
        case CHART_TYPE.AREA:
        case CHART_TYPE.BAR:
        case CHART_TYPE.BAR3D:
        case CHART_TYPE.LINE:
        case CHART_TYPE.RADAR:
            // 1: Start Chart
            strXml += "<c:".concat(chartType, "Chart>");
            if (chartType === CHART_TYPE.AREA && opts.barGrouping === 'stacked') {
                strXml += '<c:grouping val="' + opts.barGrouping + '"/>';
            }
            if (chartType === CHART_TYPE.BAR || chartType === CHART_TYPE.BAR3D) {
                strXml += '<c:barDir val="' + opts.barDir + '"/>';
                strXml += '<c:grouping val="' + (opts.barGrouping || 'clustered') + '"/>';
            }
            if (chartType === CHART_TYPE.RADAR) {
                strXml += '<c:radarStyle val="' + opts.radarStyle + '"/>';
            }
            strXml += '<c:varyColors val="0"/>';
            // 2: "Series" block for every data row
            /* EX1:
                data: [
                 {
                   name: 'Region 1',
                   labels: [['April', 'May', 'June', 'July']],
                   values: [17, 26, 53, 96]
                 },
                 {
                   name: 'Region 2',
                   labels: [['April', 'May', 'June', 'July']],
                   values: [55, 43, 70, 58]
                 }
                ]
            */
            /* EX2:
                data: [
                 {
                   name: 'Region 1',
                   labels: [
                       ['April', 'May', 'June', 'April', 'May', 'June'],
                       ['2020',     '',     '', '2021',     '',     '']
                   ],
                   values: [17, 26, 53, 96, 40, 33]
                 },
                 {
                   name: 'Region 2',
                   labels: [
                       ['April', 'May', 'June', 'April', 'May', 'June'],
                       ['2020',     '',     '', '2021',     '',     '']
                   ],
                   values: [55, 43, 70, 58, 78, 63]
                 }
                ]
             */
            data.forEach(function (obj) {
                var _a;
                colorIndex++;
                strXml += '<c:ser>';
                strXml += "  <c:idx val=\"".concat(obj._dataIndex, "\"/><c:order val=\"").concat(obj._dataIndex, "\"/>");
                strXml += '  <c:tx>';
                strXml += '    <c:strRef>';
                strXml += '      <c:f>Sheet1!$' + getExcelColName(obj._dataIndex + obj.labels.length + 1) + '$1</c:f>';
                strXml += '      <c:strCache><c:ptCount val="1"/><c:pt idx="0"><c:v>' + encodeXmlEntities(obj.name) + '</c:v></c:pt></c:strCache>';
                strXml += '    </c:strRef>';
                strXml += '  </c:tx>';
                // Fill and Border
                // TODO: CURRENT: Pull#727
                // TODO: let seriesColor = obj.color ? obj.color : opts.chartColors ? opts.chartColors[colorIndex % opts.chartColors.length] : null
                var seriesColor = opts.chartColors ? opts.chartColors[colorIndex % opts.chartColors.length] : null;
                strXml += '  <c:spPr>';
                if (seriesColor === 'transparent') {
                    strXml += '<a:noFill/>';
                }
                else if (opts.chartColorsOpacity) {
                    strXml += '<a:solidFill>' + createColorElement(seriesColor, "<a:alpha val=\"".concat(Math.round(opts.chartColorsOpacity * 1000), "\"/>")) + '</a:solidFill>';
                }
                else {
                    strXml += '<a:solidFill>' + createColorElement(seriesColor) + '</a:solidFill>';
                }
                if (chartType === CHART_TYPE.LINE || chartType === CHART_TYPE.RADAR) {
                    if (opts.lineSize === 0) {
                        strXml += '<a:ln><a:noFill/></a:ln>';
                    }
                    else {
                        strXml += "<a:ln w=\"".concat(valToPts(opts.lineSize), "\" cap=\"").concat(createLineCap(opts.lineCap), "\"><a:solidFill>").concat(createColorElement(seriesColor), "</a:solidFill>");
                        strXml += '<a:prstDash val="' + (opts.lineDash || 'solid') + '"/><a:round/></a:ln>';
                    }
                }
                else if (opts.dataBorder) {
                    strXml += "<a:ln w=\"".concat(valToPts(opts.dataBorder.pt), "\" cap=\"").concat(createLineCap(opts.lineCap), "\"><a:solidFill>").concat(createColorElement(opts.dataBorder.color), "</a:solidFill><a:prstDash val=\"solid\"/><a:round/></a:ln>");
                }
                strXml += createShadowElement(opts.shadow, DEF_SHAPE_SHADOW);
                strXml += '  </c:spPr>';
                strXml += '  <c:invertIfNegative val="0"/>';
                // Data Labels per series
                // NOTE: [20190117] Adding these to RADAR chart causes unrecoverable corruption!
                if (chartType !== CHART_TYPE.RADAR) {
                    strXml += '<c:dLbls>';
                    strXml += "<c:numFmt formatCode=\"".concat(encodeXmlEntities(opts.dataLabelFormatCode) || 'General', "\" sourceLinked=\"0\"/>");
                    if (opts.dataLabelBkgrdColors)
                        strXml += "<c:spPr><a:solidFill>".concat(createColorElement(seriesColor), "</a:solidFill></c:spPr>");
                    strXml += '<c:txPr><a:bodyPr/><a:lstStyle/><a:p><a:pPr>';
                    strXml += "<a:defRPr b=\"".concat(opts.dataLabelFontBold ? 1 : 0, "\" i=\"").concat(opts.dataLabelFontItalic ? 1 : 0, "\" strike=\"noStrike\" sz=\"").concat(Math.round((opts.dataLabelFontSize || DEF_FONT_SIZE) * 100), "\" u=\"none\">");
                    strXml += "<a:solidFill>".concat(createColorElement(opts.dataLabelColor || DEF_FONT_COLOR), "</a:solidFill>");
                    strXml += "<a:latin typeface=\"".concat(opts.dataLabelFontFace || 'Arial', "\"/>");
                    strXml += '</a:defRPr></a:pPr></a:p></c:txPr>';
                    if (opts.dataLabelPosition)
                        strXml += "<c:dLblPos val=\"".concat(opts.dataLabelPosition, "\"/>");
                    strXml += '<c:showLegendKey val="0"/>';
                    strXml += "<c:showVal val=\"".concat(opts.showValue ? '1' : '0', "\"/>");
                    strXml += "<c:showCatName val=\"0\"/><c:showSerName val=\"".concat(opts.showSerName ? '1' : '0', "\"/><c:showPercent val=\"0\"/><c:showBubbleSize val=\"0\"/>");
                    strXml += "<c:showLeaderLines val=\"".concat(opts.showLeaderLines ? '1' : '0', "\"/>");
                    strXml += '</c:dLbls>';
                }
                // 'c:marker' tag: `lineDataSymbol`
                if (chartType === CHART_TYPE.LINE || chartType === CHART_TYPE.RADAR) {
                    strXml += '<c:marker>';
                    strXml += '  <c:symbol val="' + opts.lineDataSymbol + '"/>';
                    if (opts.lineDataSymbolSize)
                        strXml += "<c:size val=\"".concat(opts.lineDataSymbolSize, "\"/>"); // Defaults to "auto" otherwise (but this is usually too small, so there is a default)
                    strXml += '  <c:spPr>';
                    strXml += "    <a:solidFill>".concat(createColorElement(opts.chartColors[obj._dataIndex + 1 > opts.chartColors.length ? Math.floor(Math.random() * opts.chartColors.length) : obj._dataIndex]), "</a:solidFill>");
                    strXml += "    <a:ln w=\"".concat(opts.lineDataSymbolLineSize, "\" cap=\"flat\"><a:solidFill>").concat(createColorElement(opts.lineDataSymbolLineColor || seriesColor), "</a:solidFill><a:prstDash val=\"solid\"/><a:round/></a:ln>");
                    strXml += '    <a:effectLst/>';
                    strXml += '  </c:spPr>';
                    strXml += '</c:marker>';
                }
                // Allow users with a single data set to pass their own array of colors (check for this using != ours)
                // Color chart bars various colors when >1 color
                // NOTE: `<c:dPt>` created with various colors will change PPT legend by design so each dataPt/color is an legend item!
                if ((chartType === CHART_TYPE.BAR || chartType === CHART_TYPE.BAR3D) &&
                    data.length === 1 &&
                    ((opts.chartColors && opts.chartColors !== BARCHART_COLORS && opts.chartColors.length > 1) || ((_a = opts.invertedColors) === null || _a === void 0 ? void 0 : _a.length))) {
                    // Series Data Point colors
                    obj.values.forEach(function (value, index) {
                        var arrColors = value < 0 ? opts.invertedColors || opts.chartColors || BARCHART_COLORS : opts.chartColors || [];
                        strXml += '  <c:dPt>';
                        strXml += "    <c:idx val=\"".concat(index, "\"/>");
                        strXml += '      <c:invertIfNegative val="0"/>';
                        strXml += '    <c:bubble3D val="0"/>';
                        strXml += '    <c:spPr>';
                        if (opts.lineSize === 0) {
                            strXml += '<a:ln><a:noFill/></a:ln>';
                        }
                        else if (chartType === CHART_TYPE.BAR) {
                            strXml += '<a:solidFill>';
                            strXml += '  <a:srgbClr val="' + arrColors[index % arrColors.length] + '"/>';
                            strXml += '</a:solidFill>';
                        }
                        else {
                            strXml += '<a:ln>';
                            strXml += '  <a:solidFill>';
                            strXml += '   <a:srgbClr val="' + arrColors[index % arrColors.length] + '"/>';
                            strXml += '  </a:solidFill>';
                            strXml += '</a:ln>';
                        }
                        strXml += createShadowElement(opts.shadow, DEF_SHAPE_SHADOW);
                        strXml += '    </c:spPr>';
                        strXml += '  </c:dPt>';
                    });
                }
                // 2: "Categories"
                {
                    strXml += '<c:cat>';
                    if (opts.catLabelFormatCode) {
                        // Use 'numRef' as catLabelFormatCode implies that we are expecting numbers here
                        strXml += '  <c:numRef>';
                        strXml += "    <c:f>Sheet1!$A$2:$A$".concat(obj.labels[0].length + 1, "</c:f>");
                        strXml += '    <c:numCache>';
                        strXml += '      <c:formatCode>' + (opts.catLabelFormatCode || 'General') + '</c:formatCode>';
                        strXml += "      <c:ptCount val=\"".concat(obj.labels[0].length, "\"/>");
                        obj.labels[0].forEach(function (label, idx) { return (strXml += "<c:pt idx=\"".concat(idx, "\"><c:v>").concat(encodeXmlEntities(label), "</c:v></c:pt>")); });
                        strXml += '    </c:numCache>';
                        strXml += '  </c:numRef>';
                    }
                    else {
                        strXml += '  <c:multiLvlStrRef>';
                        strXml += "    <c:f>Sheet1!$A$2:$".concat(getExcelColName(obj.labels.length), "$").concat(obj.labels[0].length + 1, "</c:f>");
                        strXml += '    <c:multiLvlStrCache>';
                        strXml += "      <c:ptCount val=\"".concat(obj.labels[0].length, "\"/>");
                        obj.labels.forEach(function (labelsGroup) {
                            strXml += '<c:lvl>';
                            labelsGroup.forEach(function (label, idx) { return (strXml += "<c:pt idx=\"".concat(idx, "\"><c:v>").concat(encodeXmlEntities(label), "</c:v></c:pt>")); });
                            strXml += '</c:lvl>';
                        });
                        strXml += '    </c:multiLvlStrCache>';
                        strXml += '  </c:multiLvlStrRef>';
                    }
                    strXml += '</c:cat>';
                }
                // 3: "Values"
                {
                    strXml += '<c:val>';
                    strXml += '  <c:numRef>';
                    strXml += "<c:f>Sheet1!$".concat(getExcelColName(obj._dataIndex + obj.labels.length + 1), "$2:$").concat(getExcelColName(obj._dataIndex + obj.labels.length + 1), "$").concat(obj.labels[0].length + 1, "</c:f>");
                    strXml += '    <c:numCache>';
                    strXml += '      <c:formatCode>' + (opts.valLabelFormatCode || opts.dataTableFormatCode || 'General') + '</c:formatCode>';
                    strXml += "      <c:ptCount val=\"".concat(obj.labels[0].length, "\"/>");
                    obj.values.forEach(function (value, idx) { return (strXml += "<c:pt idx=\"".concat(idx, "\"><c:v>").concat(value || value === 0 ? value : '', "</c:v></c:pt>")); });
                    strXml += '    </c:numCache>';
                    strXml += '  </c:numRef>';
                    strXml += '</c:val>';
                }
                // Option: `smooth`
                if (chartType === CHART_TYPE.LINE)
                    strXml += '<c:smooth val="' + (opts.lineSmooth ? '1' : '0') + '"/>';
                // 4: Close "SERIES"
                strXml += '</c:ser>';
            });
            // 3: "Data Labels"
            {
                strXml += '  <c:dLbls>';
                strXml += "    <c:numFmt formatCode=\"".concat(encodeXmlEntities(opts.dataLabelFormatCode) || 'General', "\" sourceLinked=\"0\"/>");
                strXml += '    <c:txPr>';
                strXml += '      <a:bodyPr/>';
                strXml += '      <a:lstStyle/>';
                strXml += '      <a:p><a:pPr>';
                strXml += "        <a:defRPr b=\"".concat(opts.dataLabelFontBold ? 1 : 0, "\" i=\"").concat(opts.dataLabelFontItalic ? 1 : 0, "\" strike=\"noStrike\" sz=\"").concat(Math.round((opts.dataLabelFontSize || DEF_FONT_SIZE) * 100), "\" u=\"none\">");
                strXml += '          <a:solidFill>' + createColorElement(opts.dataLabelColor || DEF_FONT_COLOR) + '</a:solidFill>';
                strXml += '          <a:latin typeface="' + (opts.dataLabelFontFace || 'Arial') + '"/>';
                strXml += '        </a:defRPr>';
                strXml += '      </a:pPr></a:p>';
                strXml += '    </c:txPr>';
                if (opts.dataLabelPosition)
                    strXml += ' <c:dLblPos val="' + opts.dataLabelPosition + '"/>';
                strXml += '    <c:showLegendKey val="0"/>';
                strXml += '    <c:showVal val="' + (opts.showValue ? '1' : '0') + '"/>';
                strXml += '    <c:showCatName val="0"/>';
                strXml += '    <c:showSerName val="' + (opts.showSerName ? '1' : '0') + '"/>';
                strXml += '    <c:showPercent val="0"/>';
                strXml += '    <c:showBubbleSize val="0"/>';
                strXml += "    <c:showLeaderLines val=\"".concat(opts.showLeaderLines ? '1' : '0', "\"/>");
                strXml += '  </c:dLbls>';
            }
            // 4: Add more chart options (gapWidth, line Marker, etc.)
            if (chartType === CHART_TYPE.BAR) {
                strXml += "  <c:gapWidth val=\"".concat(opts.barGapWidthPct, "\"/>");
                strXml += "  <c:overlap val=\"".concat((opts.barGrouping || '').includes('tacked') ? 100 : opts.barOverlapPct ? opts.barOverlapPct : 0, "\"/>");
            }
            else if (chartType === CHART_TYPE.BAR3D) {
                strXml += "  <c:gapWidth val=\"".concat(opts.barGapWidthPct, "\"/>");
                strXml += "  <c:gapDepth val=\"".concat(opts.barGapDepthPct, "\"/>");
                strXml += '  <c:shape val="' + opts.bar3DShape + '"/>';
            }
            else if (chartType === CHART_TYPE.LINE) {
                strXml += '  <c:marker val="1"/>';
            }
            // 5: Add axisId (NOTE: order matters! (category comes first))
            strXml += "<c:axId val=\"".concat(catAxisId, "\"/><c:axId val=\"").concat(valAxisId, "\"/><c:axId val=\"").concat(AXIS_ID_SERIES_PRIMARY, "\"/>");
            // 6: Close Chart tag
            strXml += "</c:".concat(chartType, "Chart>");
            // end switch
            break;
        case CHART_TYPE.SCATTER:
            /*
                `data` = [
                    { name:'X-Axis',    values:[1,2,3,4,5,6,7,8,9,10,11,12] },
                    { name:'Y-Value 1', values:[13, 20, 21, 25] },
                    { name:'Y-Value 2', values:[ 1,  2,  5,  9] }
                ];
            */
            // 1: Start Chart
            strXml += '<c:' + chartType + 'Chart>';
            strXml += '<c:scatterStyle val="lineMarker"/>';
            strXml += '<c:varyColors val="0"/>';
            // 2: Series: (One for each Y-Axis)
            colorIndex = -1;
            data.filter(function (_obj, idx) { return idx > 0; }).forEach(function (obj, idx) {
                colorIndex++;
                strXml += '<c:ser>';
                strXml += "  <c:idx val=\"".concat(idx, "\"/>");
                strXml += "  <c:order val=\"".concat(idx, "\"/>");
                strXml += '  <c:tx>';
                strXml += '    <c:strRef>';
                strXml += "      <c:f>Sheet1!$".concat(getExcelColName(idx + 2), "$1</c:f>");
                strXml += '      <c:strCache><c:ptCount val="1"/><c:pt idx="0"><c:v>' + encodeXmlEntities(obj.name) + '</c:v></c:pt></c:strCache>';
                strXml += '    </c:strRef>';
                strXml += '  </c:tx>';
                // 'c:spPr': Fill, Border, Line, LineStyle (dash, etc.), Shadow
                strXml += '  <c:spPr>';
                {
                    var tmpSerColor = opts.chartColors[colorIndex % opts.chartColors.length];
                    if (tmpSerColor === 'transparent') {
                        strXml += '<a:noFill/>';
                    }
                    else if (opts.chartColorsOpacity) {
                        strXml += '<a:solidFill>' + createColorElement(tmpSerColor, '<a:alpha val="' + Math.round(opts.chartColorsOpacity * 1000).toString() + '"/>') + '</a:solidFill>';
                    }
                    else {
                        strXml += '<a:solidFill>' + createColorElement(tmpSerColor) + '</a:solidFill>';
                    }
                    if (opts.lineSize === 0) {
                        strXml += '<a:ln><a:noFill/></a:ln>';
                    }
                    else {
                        strXml += "<a:ln w=\"".concat(valToPts(opts.lineSize), "\" cap=\"").concat(createLineCap(opts.lineCap), "\"><a:solidFill>").concat(createColorElement(tmpSerColor), "</a:solidFill>");
                        strXml += "<a:prstDash val=\"".concat(opts.lineDash || 'solid', "\"/><a:round/></a:ln>");
                    }
                    // Shadow
                    strXml += createShadowElement(opts.shadow, DEF_SHAPE_SHADOW);
                }
                strXml += '  </c:spPr>';
                // 'c:marker' tag: `lineDataSymbol`
                {
                    strXml += '<c:marker>';
                    strXml += '  <c:symbol val="' + opts.lineDataSymbol + '"/>';
                    if (opts.lineDataSymbolSize) {
                        // Defaults to "auto" otherwise (but this is usually too small, so there is a default)
                        strXml += "<c:size val=\"".concat(opts.lineDataSymbolSize, "\"/>");
                    }
                    strXml += '<c:spPr>';
                    strXml += "<a:solidFill>".concat(createColorElement(opts.chartColors[idx + 1 > opts.chartColors.length ? Math.floor(Math.random() * opts.chartColors.length) : idx]), "</a:solidFill>");
                    strXml += "<a:ln w=\"".concat(opts.lineDataSymbolLineSize, "\" cap=\"flat\"><a:solidFill>").concat(createColorElement(opts.lineDataSymbolLineColor || opts.chartColors[colorIndex % opts.chartColors.length]), "</a:solidFill><a:prstDash val=\"solid\"/><a:round/></a:ln>");
                    strXml += '<a:effectLst/>';
                    strXml += '</c:spPr>';
                    strXml += '</c:marker>';
                }
                // Option: scatter data point labels
                if (opts.showLabel) {
                    var chartUuid_1 = getUuid('-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
                    if (obj.labels[0] && (opts.dataLabelFormatScatter === 'custom' || opts.dataLabelFormatScatter === 'customXY')) {
                        strXml += '<c:dLbls>';
                        obj.labels[0].forEach(function (label, idx) {
                            if (opts.dataLabelFormatScatter === 'custom' || opts.dataLabelFormatScatter === 'customXY') {
                                strXml += '  <c:dLbl>';
                                strXml += "    <c:idx val=\"".concat(idx, "\"/>");
                                strXml += '    <c:tx>';
                                strXml += '      <c:rich>';
                                strXml += '            <a:bodyPr>';
                                strXml += '                <a:spAutoFit/>';
                                strXml += '            </a:bodyPr>';
                                strXml += '            <a:lstStyle/>';
                                strXml += '            <a:p>';
                                strXml += '                <a:pPr>';
                                strXml += '                    <a:defRPr/>';
                                strXml += '                </a:pPr>';
                                strXml += '              <a:r>';
                                strXml += '                    <a:rPr lang="' + (opts.lang || 'en-US') + '" dirty="0"/>';
                                strXml += '                    <a:t>' + encodeXmlEntities(label) + '</a:t>';
                                strXml += '              </a:r>';
                                // Apply XY values at end of custom label
                                // Do not apply the values if the label was empty or just spaces
                                // This allows for selective labelling where required
                                if (opts.dataLabelFormatScatter === 'customXY' && !/^ *$/.test(label)) {
                                    strXml += '              <a:r>';
                                    strXml += '                  <a:rPr lang="' + (opts.lang || 'en-US') + '" baseline="0" dirty="0"/>';
                                    strXml += '                  <a:t> (</a:t>';
                                    strXml += '              </a:r>';
                                    strXml += '              <a:fld id="{' + getUuid('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx') + '}" type="XVALUE">';
                                    strXml += '                  <a:rPr lang="' + (opts.lang || 'en-US') + '" baseline="0"/>';
                                    strXml += '                  <a:pPr>';
                                    strXml += '                      <a:defRPr/>';
                                    strXml += '                  </a:pPr>';
                                    strXml += '                  <a:t>[' + encodeXmlEntities(obj.name) + '</a:t>';
                                    strXml += '              </a:fld>';
                                    strXml += '              <a:r>';
                                    strXml += '                  <a:rPr lang="' + (opts.lang || 'en-US') + '" baseline="0" dirty="0"/>';
                                    strXml += '                  <a:t>, </a:t>';
                                    strXml += '              </a:r>';
                                    strXml += '              <a:fld id="{' + getUuid('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx') + '}" type="YVALUE">';
                                    strXml += '                  <a:rPr lang="' + (opts.lang || 'en-US') + '" baseline="0"/>';
                                    strXml += '                  <a:pPr>';
                                    strXml += '                      <a:defRPr/>';
                                    strXml += '                  </a:pPr>';
                                    strXml += '                  <a:t>[' + encodeXmlEntities(obj.name) + ']</a:t>';
                                    strXml += '              </a:fld>';
                                    strXml += '              <a:r>';
                                    strXml += '                  <a:rPr lang="' + (opts.lang || 'en-US') + '" baseline="0" dirty="0"/>';
                                    strXml += '                  <a:t>)</a:t>';
                                    strXml += '              </a:r>';
                                    strXml += '              <a:endParaRPr lang="' + (opts.lang || 'en-US') + '" dirty="0"/>';
                                }
                                strXml += '            </a:p>';
                                strXml += '      </c:rich>';
                                strXml += '    </c:tx>';
                                strXml += '    <c:spPr>';
                                strXml += '        <a:noFill/>';
                                strXml += '        <a:ln>';
                                strXml += '            <a:noFill/>';
                                strXml += '        </a:ln>';
                                strXml += '        <a:effectLst/>';
                                strXml += '    </c:spPr>';
                                if (opts.dataLabelPosition)
                                    strXml += ' <c:dLblPos val="' + opts.dataLabelPosition + '"/>';
                                strXml += '    <c:showLegendKey val="0"/>';
                                strXml += '    <c:showVal val="0"/>';
                                strXml += '    <c:showCatName val="0"/>';
                                strXml += '    <c:showSerName val="0"/>';
                                strXml += '    <c:showPercent val="0"/>';
                                strXml += '    <c:showBubbleSize val="0"/>';
                                strXml += '       <c:showLeaderLines val="1"/>';
                                strXml += '    <c:extLst>';
                                strXml += '      <c:ext uri="{CE6537A1-D6FC-4f65-9D91-7224C49458BB}" xmlns:c15="http://schemas.microsoft.com/office/drawing/2012/chart"/>';
                                strXml += '      <c:ext uri="{C3380CC4-5D6E-409C-BE32-E72D297353CC}" xmlns:c16="http://schemas.microsoft.com/office/drawing/2014/chart">';
                                strXml += "            <c16:uniqueId val=\"{".concat('00000000'.substring(0, 8 - (idx + 1).toString().length).toString()).concat(idx + 1).concat(chartUuid_1, "}\"/>");
                                strXml += '      </c:ext>';
                                strXml += '        </c:extLst>';
                                strXml += '</c:dLbl>';
                            }
                        });
                        strXml += '</c:dLbls>';
                    }
                    if (opts.dataLabelFormatScatter === 'XY') {
                        strXml += '<c:dLbls>';
                        strXml += '    <c:spPr>';
                        strXml += '        <a:noFill/>';
                        strXml += '        <a:ln>';
                        strXml += '            <a:noFill/>';
                        strXml += '        </a:ln>';
                        strXml += '          <a:effectLst/>';
                        strXml += '    </c:spPr>';
                        strXml += '    <c:txPr>';
                        strXml += '        <a:bodyPr>';
                        strXml += '            <a:spAutoFit/>';
                        strXml += '        </a:bodyPr>';
                        strXml += '        <a:lstStyle/>';
                        strXml += '        <a:p>';
                        strXml += '            <a:pPr>';
                        strXml += '                <a:defRPr/>';
                        strXml += '            </a:pPr>';
                        strXml += '            <a:endParaRPr lang="en-US"/>';
                        strXml += '        </a:p>';
                        strXml += '    </c:txPr>';
                        if (opts.dataLabelPosition)
                            strXml += ' <c:dLblPos val="' + opts.dataLabelPosition + '"/>';
                        strXml += '    <c:showLegendKey val="0"/>';
                        strXml += " <c:showVal val=\"".concat(opts.showLabel ? '1' : '0', "\"/>");
                        strXml += " <c:showCatName val=\"".concat(opts.showLabel ? '1' : '0', "\"/>");
                        strXml += " <c:showSerName val=\"".concat(opts.showSerName ? '1' : '0', "\"/>");
                        strXml += '    <c:showPercent val="0"/>';
                        strXml += '    <c:showBubbleSize val="0"/>';
                        strXml += '    <c:extLst>';
                        strXml += '        <c:ext uri="{CE6537A1-D6FC-4f65-9D91-7224C49458BB}" xmlns:c15="http://schemas.microsoft.com/office/drawing/2012/chart">';
                        strXml += '            <c15:showLeaderLines val="1"/>';
                        strXml += '        </c:ext>';
                        strXml += '    </c:extLst>';
                        strXml += '</c:dLbls>';
                    }
                }
                // Color bar chart bars various colors
                // Allow users with a single data set to pass their own array of colors (check for this using != ours)
                if (data.length === 1 && opts.chartColors !== BARCHART_COLORS) {
                    // Series Data Point colors
                    obj.values.forEach(function (value, index) {
                        var arrColors = value < 0 ? opts.invertedColors || opts.chartColors || BARCHART_COLORS : opts.chartColors || [];
                        strXml += '  <c:dPt>';
                        strXml += "    <c:idx val=\"".concat(index, "\"/>");
                        strXml += '      <c:invertIfNegative val="0"/>';
                        strXml += '    <c:bubble3D val="0"/>';
                        strXml += '    <c:spPr>';
                        if (opts.lineSize === 0) {
                            strXml += '<a:ln><a:noFill/></a:ln>';
                        }
                        else {
                            strXml += '<a:solidFill>';
                            strXml += ' <a:srgbClr val="' + arrColors[index % arrColors.length] + '"/>';
                            strXml += '</a:solidFill>';
                        }
                        strXml += createShadowElement(opts.shadow, DEF_SHAPE_SHADOW);
                        strXml += '    </c:spPr>';
                        strXml += '  </c:dPt>';
                    });
                }
                // 3: "Values": Scatter Chart has 2: `xVal` and `yVal`
                {
                    // X-Axis is always the same
                    strXml += '<c:xVal>';
                    strXml += '  <c:numRef>';
                    strXml += "    <c:f>Sheet1!$A$2:$A$".concat(data[0].values.length + 1, "</c:f>");
                    strXml += '    <c:numCache>';
                    strXml += '      <c:formatCode>General</c:formatCode>';
                    strXml += "      <c:ptCount val=\"".concat(data[0].values.length, "\"/>");
                    data[0].values.forEach(function (value, idx) {
                        strXml += "<c:pt idx=\"".concat(idx, "\"><c:v>").concat(value || value === 0 ? value : '', "</c:v></c:pt>");
                    });
                    strXml += '    </c:numCache>';
                    strXml += '  </c:numRef>';
                    strXml += '</c:xVal>';
                    // Y-Axis vals are this object's `values`
                    strXml += '<c:yVal>';
                    strXml += '  <c:numRef>';
                    strXml += "    <c:f>Sheet1!$".concat(getExcelColName(idx + 2), "$2:$").concat(getExcelColName(idx + 2), "$").concat(data[0].values.length + 1, "</c:f>");
                    strXml += '    <c:numCache>';
                    strXml += '      <c:formatCode>General</c:formatCode>';
                    // NOTE: Use pt count and iterate over data[0] (X-Axis) as user can have more values than data (eg: timeline where only first few months are populated)
                    strXml += "      <c:ptCount val=\"".concat(data[0].values.length, "\"/>");
                    data[0].values.forEach(function (_value, idx) {
                        strXml += "<c:pt idx=\"".concat(idx, "\"><c:v>").concat(obj.values[idx] || obj.values[idx] === 0 ? obj.values[idx] : '', "</c:v></c:pt>");
                    });
                    strXml += '    </c:numCache>';
                    strXml += '  </c:numRef>';
                    strXml += '</c:yVal>';
                }
                // Option: `smooth`
                strXml += '<c:smooth val="' + (opts.lineSmooth ? '1' : '0') + '"/>';
                // 4: Close "SERIES"
                strXml += '</c:ser>';
            });
            // 3: Data Labels
            {
                strXml += '  <c:dLbls>';
                strXml += "    <c:numFmt formatCode=\"".concat(encodeXmlEntities(opts.dataLabelFormatCode) || 'General', "\" sourceLinked=\"0\"/>");
                strXml += '    <c:txPr>';
                strXml += '      <a:bodyPr/>';
                strXml += '      <a:lstStyle/>';
                strXml += '      <a:p><a:pPr>';
                strXml += "        <a:defRPr b=\"".concat(opts.dataLabelFontBold ? '1' : '0', "\" i=\"").concat(opts.dataLabelFontItalic ? '1' : '0', "\" strike=\"noStrike\" sz=\"").concat(Math.round((opts.dataLabelFontSize || DEF_FONT_SIZE) * 100), "\" u=\"none\">");
                strXml += '          <a:solidFill>' + createColorElement(opts.dataLabelColor || DEF_FONT_COLOR) + '</a:solidFill>';
                strXml += '          <a:latin typeface="' + (opts.dataLabelFontFace || 'Arial') + '"/>';
                strXml += '        </a:defRPr>';
                strXml += '      </a:pPr></a:p>';
                strXml += '    </c:txPr>';
                if (opts.dataLabelPosition)
                    strXml += ' <c:dLblPos val="' + opts.dataLabelPosition + '"/>';
                strXml += '    <c:showLegendKey val="0"/>';
                strXml += '    <c:showVal val="' + (opts.showValue ? '1' : '0') + '"/>';
                strXml += '    <c:showCatName val="0"/>';
                strXml += '    <c:showSerName val="' + (opts.showSerName ? '1' : '0') + '"/>';
                strXml += '    <c:showPercent val="0"/>';
                strXml += '    <c:showBubbleSize val="0"/>';
                strXml += '  </c:dLbls>';
            }
            // 4: Add axis Id (NOTE: order matters! - category comes first)
            strXml += "<c:axId val=\"".concat(catAxisId, "\"/><c:axId val=\"").concat(valAxisId, "\"/>");
            // 5: Close Chart tag
            strXml += '</c:' + chartType + 'Chart>';
            // end switch
            break;
        case CHART_TYPE.BUBBLE:
        case CHART_TYPE.BUBBLE3D:
            /*
                `data` = [
                    { name:'X-Axis',     values:[1,2,3,4,5,6,7,8,9,10,11,12] },
                    { name:'Y-Values 1', values:[13, 20, 21, 25], sizes:[10, 5, 20, 15] },
                    { name:'Y-Values 2', values:[ 1,  2,  5,  9], sizes:[ 5, 3,  9,  3] }
                ];
            */
            // 1: Start Chart
            strXml += '<c:bubbleChart>';
            strXml += '<c:varyColors val="0"/>';
            // 2: Series: (One for each Y-Axis)
            colorIndex = -1;
            data.filter(function (_obj, idx) { return idx > 0; }).forEach(function (obj, idx) {
                colorIndex++;
                strXml += '<c:ser>';
                strXml += "  <c:idx val=\"".concat(idx, "\"/>");
                strXml += "  <c:order val=\"".concat(idx, "\"/>");
                // A: `<c:tx>`
                strXml += '  <c:tx>';
                strXml += '    <c:strRef>';
                strXml += '      <c:f>Sheet1!$' + getExcelColName(idxColLtr + 1) + '$1</c:f>';
                strXml += '      <c:strCache><c:ptCount val="1"/><c:pt idx="0"><c:v>' + encodeXmlEntities(obj.name) + '</c:v></c:pt></c:strCache>';
                strXml += '    </c:strRef>';
                strXml += '  </c:tx>';
                // B: '<c:spPr>': Fill, Border, Line, LineStyle (dash, etc.), Shadow
                {
                    strXml += '<c:spPr>';
                    var tmpSerColor = opts.chartColors[colorIndex % opts.chartColors.length];
                    if (tmpSerColor === 'transparent') {
                        strXml += '<a:noFill/>';
                    }
                    else if (opts.chartColorsOpacity) {
                        strXml += "<a:solidFill>".concat(createColorElement(tmpSerColor, '<a:alpha val="' + Math.round(opts.chartColorsOpacity * 1000).toString() + '"/>'), "</a:solidFill>");
                    }
                    else {
                        strXml += '<a:solidFill>' + createColorElement(tmpSerColor) + '</a:solidFill>';
                    }
                    if (opts.lineSize === 0) {
                        strXml += '<a:ln><a:noFill/></a:ln>';
                    }
                    else if (opts.dataBorder) {
                        strXml += "<a:ln w=\"".concat(valToPts(opts.dataBorder.pt), "\" cap=\"flat\"><a:solidFill>").concat(createColorElement(opts.dataBorder.color), "</a:solidFill><a:prstDash val=\"solid\"/><a:round/></a:ln>");
                    }
                    else {
                        strXml += "<a:ln w=\"".concat(valToPts(opts.lineSize), "\" cap=\"flat\"><a:solidFill>").concat(createColorElement(tmpSerColor), "</a:solidFill>");
                        strXml += "<a:prstDash val=\"".concat(opts.lineDash || 'solid', "\"/><a:round/></a:ln>");
                    }
                    // Shadow
                    strXml += createShadowElement(opts.shadow, DEF_SHAPE_SHADOW);
                    strXml += '</c:spPr>';
                }
                // C: '<c:dLbls>' "Data Labels"
                // Let it be defaulted for now
                // D: '<c:xVal>'/'<c:yVal>' "Values": Scatter Chart has 2: `xVal` and `yVal`
                {
                    // X-Axis is always the same
                    strXml += '<c:xVal>';
                    strXml += '  <c:numRef>';
                    strXml += "    <c:f>Sheet1!$A$2:$A$".concat(data[0].values.length + 1, "</c:f>");
                    strXml += '    <c:numCache>';
                    strXml += '      <c:formatCode>General</c:formatCode>';
                    strXml += "      <c:ptCount val=\"".concat(data[0].values.length, "\"/>");
                    data[0].values.forEach(function (value, idx) {
                        strXml += "<c:pt idx=\"".concat(idx, "\"><c:v>").concat(value || value === 0 ? value : '', "</c:v></c:pt>");
                    });
                    strXml += '    </c:numCache>';
                    strXml += '  </c:numRef>';
                    strXml += '</c:xVal>';
                    // Y-Axis vals are this object's `values`
                    strXml += '<c:yVal>';
                    strXml += '  <c:numRef>';
                    strXml += "<c:f>Sheet1!$".concat(getExcelColName(idxColLtr + 1), "$2:$").concat(getExcelColName(idxColLtr + 1), "$").concat(data[0].values.length + 1, "</c:f>");
                    idxColLtr++;
                    strXml += '    <c:numCache>';
                    strXml += '      <c:formatCode>General</c:formatCode>';
                    // NOTE: Use pt count and iterate over data[0] (X-Axis) as user can have more values than data (eg: timeline where only first few months are populated)
                    strXml += "      <c:ptCount val=\"".concat(data[0].values.length, "\"/>");
                    data[0].values.forEach(function (_value, idx) {
                        strXml += "<c:pt idx=\"".concat(idx, "\"><c:v>").concat(obj.values[idx] || obj.values[idx] === 0 ? obj.values[idx] : '', "</c:v></c:pt>");
                    });
                    strXml += '    </c:numCache>';
                    strXml += '  </c:numRef>';
                    strXml += '</c:yVal>';
                }
                // E: '<c:bubbleSize>'
                strXml += '  <c:bubbleSize>';
                strXml += '    <c:numRef>';
                strXml += "<c:f>Sheet1!$".concat(getExcelColName(idxColLtr + 1), "$2:$").concat(getExcelColName(idxColLtr + 1), "$").concat(obj.sizes.length + 1, "</c:f>");
                idxColLtr++;
                strXml += '      <c:numCache>';
                strXml += '        <c:formatCode>General</c:formatCode>';
                strXml += "           <c:ptCount val=\"".concat(obj.sizes.length, "\"/>");
                obj.sizes.forEach(function (value, idx) {
                    strXml += "<c:pt idx=\"".concat(idx, "\"><c:v>").concat(value || '', "</c:v></c:pt>");
                });
                strXml += '      </c:numCache>';
                strXml += '    </c:numRef>';
                strXml += '  </c:bubbleSize>';
                strXml += '  <c:bubble3D val="' + (chartType === CHART_TYPE.BUBBLE3D ? '1' : '0') + '"/>';
                // F: Close "SERIES"
                strXml += '</c:ser>';
            });
            // 3: Data Labels
            {
                strXml += '<c:dLbls>';
                strXml += "<c:numFmt formatCode=\"".concat(encodeXmlEntities(opts.dataLabelFormatCode) || 'General', "\" sourceLinked=\"0\"/>");
                strXml += '<c:txPr><a:bodyPr/><a:lstStyle/><a:p><a:pPr>';
                strXml += "<a:defRPr b=\"".concat(opts.dataLabelFontBold ? 1 : 0, "\" i=\"").concat(opts.dataLabelFontItalic ? 1 : 0, "\" strike=\"noStrike\" sz=\"").concat(Math.round(Math.round(opts.dataLabelFontSize || DEF_FONT_SIZE) * 100), "\" u=\"none\">");
                strXml += "<a:solidFill>".concat(createColorElement(opts.dataLabelColor || DEF_FONT_COLOR), "</a:solidFill>");
                strXml += "<a:latin typeface=\"".concat(opts.dataLabelFontFace || 'Arial', "\"/>");
                strXml += '</a:defRPr></a:pPr></a:p></c:txPr>';
                if (opts.dataLabelPosition)
                    strXml += "<c:dLblPos val=\"".concat(opts.dataLabelPosition, "\"/>");
                strXml += '<c:showLegendKey val="0"/>';
                strXml += "<c:showVal val=\"".concat(opts.showValue ? '1' : '0', "\"/>");
                strXml += "<c:showCatName val=\"0\"/><c:showSerName val=\"".concat(opts.showSerName ? '1' : '0', "\"/><c:showPercent val=\"0\"/><c:showBubbleSize val=\"0\"/>");
                strXml += '<c:extLst>';
                strXml += '  <c:ext uri="{CE6537A1-D6FC-4f65-9D91-7224C49458BB}" xmlns:c15="http://schemas.microsoft.com/office/drawing/2012/chart">';
                strXml += '    <c15:showLeaderLines val="' + (opts.showLeaderLines ? '1' : '0') + '"/>';
                strXml += '  </c:ext>';
                strXml += '</c:extLst>';
                strXml += '</c:dLbls>';
            }
            // 4: Bubble options
            // strXml += '  <c:bubbleScale val="100"/>';
            // strXml += '  <c:showNegBubbles val="0"/>';
            // Commented out to let it default to PPT until we create options
            // 5: AxisId (NOTE: order matters! (category comes first))
            strXml += "<c:axId val=\"".concat(catAxisId, "\"/><c:axId val=\"").concat(valAxisId, "\"/>");
            // 6: Close Chart tag
            strXml += '</c:bubbleChart>';
            // end switch
            break;
        case CHART_TYPE.DOUGHNUT:
        case CHART_TYPE.PIE:
            // Use the same let name so code blocks from barChart are interchangeable
            optsChartData = data[0];
            /* EX:
                data: [
                 {
                   name: 'Project Status',
                   labels: ['Red', 'Amber', 'Green', 'Unknown'],
                   values: [10, 20, 38, 2]
                 }
                ]
            */
            // 1: Start Chart
            strXml += '<c:' + chartType + 'Chart>';
            strXml += '  <c:varyColors val="1"/>';
            strXml += '<c:ser>';
            strXml += '  <c:idx val="0"/>';
            strXml += '  <c:order val="0"/>';
            strXml += '  <c:tx>';
            strXml += '    <c:strRef>';
            strXml += '      <c:f>Sheet1!$B$1</c:f>';
            strXml += '      <c:strCache>';
            strXml += '        <c:ptCount val="1"/>';
            strXml += '        <c:pt idx="0"><c:v>' + encodeXmlEntities(optsChartData.name) + '</c:v></c:pt>';
            strXml += '      </c:strCache>';
            strXml += '    </c:strRef>';
            strXml += '  </c:tx>';
            strXml += '  <c:spPr>';
            strXml += '    <a:solidFill><a:schemeClr val="accent1"/></a:solidFill>';
            strXml += '    <a:ln w="9525" cap="flat"><a:solidFill><a:srgbClr val="F9F9F9"/></a:solidFill><a:prstDash val="solid"/><a:round/></a:ln>';
            if (opts.dataNoEffects) {
                strXml += '<a:effectLst/>';
            }
            else {
                strXml += createShadowElement(opts.shadow, DEF_SHAPE_SHADOW);
            }
            strXml += '  </c:spPr>';
            // strXml += '<c:explosion val="0"/>'
            // 2: "Data Point" block for every data row
            optsChartData.labels[0].forEach(function (_label, idx) {
                strXml += '<c:dPt>';
                strXml += " <c:idx val=\"".concat(idx, "\"/>");
                strXml += ' <c:bubble3D val="0"/>';
                strXml += ' <c:spPr>';
                strXml += "<a:solidFill>".concat(createColorElement(opts.chartColors[idx + 1 > opts.chartColors.length ? Math.floor(Math.random() * opts.chartColors.length) : idx]), "</a:solidFill>");
                if (opts.dataBorder) {
                    strXml += "<a:ln w=\"".concat(valToPts(opts.dataBorder.pt), "\" cap=\"flat\"><a:solidFill>").concat(createColorElement(opts.dataBorder.color), "</a:solidFill><a:prstDash val=\"solid\"/><a:round/></a:ln>");
                }
                strXml += createShadowElement(opts.shadow, DEF_SHAPE_SHADOW);
                strXml += '  </c:spPr>';
                strXml += '</c:dPt>';
            });
            // 3: "Data Label" block for every data Label
            strXml += '<c:dLbls>';
            optsChartData.labels[0].forEach(function (_label, idx) {
                strXml += '<c:dLbl>';
                strXml += " <c:idx val=\"".concat(idx, "\"/>");
                strXml += "  <c:numFmt formatCode=\"".concat(encodeXmlEntities(opts.dataLabelFormatCode) || 'General', "\" sourceLinked=\"0\"/>");
                strXml += '  <c:spPr/><c:txPr>';
                strXml += '   <a:bodyPr/><a:lstStyle/>';
                strXml += '   <a:p><a:pPr>';
                strXml += "   <a:defRPr sz=\"".concat(Math.round((opts.dataLabelFontSize || DEF_FONT_SIZE) * 100), "\" b=\"").concat(opts.dataLabelFontBold ? 1 : 0, "\" i=\"").concat(opts.dataLabelFontItalic ? 1 : 0, "\" u=\"none\" strike=\"noStrike\">");
                strXml += '    <a:solidFill>' + createColorElement(opts.dataLabelColor || DEF_FONT_COLOR) + '</a:solidFill>';
                strXml += "    <a:latin typeface=\"".concat(opts.dataLabelFontFace || 'Arial', "\"/>");
                strXml += '   </a:defRPr>';
                strXml += '      </a:pPr></a:p>';
                strXml += '    </c:txPr>';
                if (chartType === CHART_TYPE.PIE && opts.dataLabelPosition)
                    strXml += "<c:dLblPos val=\"".concat(opts.dataLabelPosition, "\"/>");
                strXml += '    <c:showLegendKey val="0"/>';
                strXml += '    <c:showVal val="' + (opts.showValue ? '1' : '0') + '"/>';
                strXml += '    <c:showCatName val="' + (opts.showLabel ? '1' : '0') + '"/>';
                strXml += '    <c:showSerName val="' + (opts.showSerName ? '1' : '0') + '"/>';
                strXml += '    <c:showPercent val="' + (opts.showPercent ? '1' : '0') + '"/>';
                strXml += '    <c:showBubbleSize val="0"/>';
                strXml += '  </c:dLbl>';
            });
            strXml += " <c:numFmt formatCode=\"".concat(encodeXmlEntities(opts.dataLabelFormatCode) || 'General', "\" sourceLinked=\"0\"/>");
            strXml += '    <c:txPr>';
            strXml += '      <a:bodyPr/>';
            strXml += '      <a:lstStyle/>';
            strXml += '      <a:p>';
            strXml += '        <a:pPr>';
            strXml += "          <a:defRPr sz=\"1800\" b=\"".concat(opts.dataLabelFontBold ? '1' : '0', "\" i=\"").concat(opts.dataLabelFontItalic ? '1' : '0', "\" u=\"none\" strike=\"noStrike\">");
            strXml += '            <a:solidFill><a:srgbClr val="000000"/></a:solidFill><a:latin typeface="Arial"/>';
            strXml += '          </a:defRPr>';
            strXml += '        </a:pPr>';
            strXml += '      </a:p>';
            strXml += '    </c:txPr>';
            strXml += chartType === CHART_TYPE.PIE ? '<c:dLblPos val="ctr"/>' : '';
            strXml += '    <c:showLegendKey val="0"/>';
            strXml += '    <c:showVal val="0"/>';
            strXml += '    <c:showCatName val="1"/>';
            strXml += '    <c:showSerName val="0"/>';
            strXml += '    <c:showPercent val="1"/>';
            strXml += '    <c:showBubbleSize val="0"/>';
            strXml += " <c:showLeaderLines val=\"".concat(opts.showLeaderLines ? '1' : '0', "\"/>");
            strXml += '</c:dLbls>';
            // 2: "Categories"
            strXml += '<c:cat>';
            strXml += '  <c:strRef>';
            strXml += "    <c:f>Sheet1!$A$2:$A$".concat(optsChartData.labels[0].length + 1, "</c:f>");
            strXml += '    <c:strCache>';
            strXml += "         <c:ptCount val=\"".concat(optsChartData.labels[0].length, "\"/>");
            optsChartData.labels[0].forEach(function (label, idx) {
                strXml += "<c:pt idx=\"".concat(idx, "\"><c:v>").concat(encodeXmlEntities(label), "</c:v></c:pt>");
            });
            strXml += '    </c:strCache>';
            strXml += '  </c:strRef>';
            strXml += '</c:cat>';
            // 3: Create vals
            strXml += '  <c:val>';
            strXml += '    <c:numRef>';
            strXml += "      <c:f>Sheet1!$B$2:$B$".concat(optsChartData.labels[0].length + 1, "</c:f>");
            strXml += '      <c:numCache>';
            strXml += "           <c:ptCount val=\"".concat(optsChartData.labels[0].length, "\"/>");
            optsChartData.values.forEach(function (value, idx) {
                strXml += "<c:pt idx=\"".concat(idx, "\"><c:v>").concat(value || value === 0 ? value : '', "</c:v></c:pt>");
            });
            strXml += '      </c:numCache>';
            strXml += '    </c:numRef>';
            strXml += '  </c:val>';
            // 4: Close "SERIES"
            strXml += '  </c:ser>';
            strXml += "  <c:firstSliceAng val=\"".concat(opts.firstSliceAng ? Math.round(opts.firstSliceAng) : 0, "\"/>");
            if (chartType === CHART_TYPE.DOUGHNUT)
                strXml += "<c:holeSize val=\"".concat(typeof opts.holeSize === 'number' ? opts.holeSize : '50', "\"/>");
            strXml += '</c:' + chartType + 'Chart>';
            // Done with Doughnut/Pie
            break;
        default:
            strXml += '';
            break;
    }
    return strXml;
}
/**
 * Create Category axis
 * @param {IChartOptsLib} opts - chart options
 * @param {string} axisId - value
 * @param {string} valAxisId - value
 * @return {string} XML
 */
function makeCatAxis(opts, axisId, valAxisId) {
    var strXml = '';
    // Build cat axis tag
    // NOTE: Scatter and Bubble chart need two Val axises as they display numbers on x axis
    if (opts._type === CHART_TYPE.SCATTER || opts._type === CHART_TYPE.BUBBLE || opts._type === CHART_TYPE.BUBBLE3D) {
        strXml += '<c:valAx>';
    }
    else {
        strXml += '<c:' + (opts.catLabelFormatCode ? 'dateAx' : 'catAx') + '>';
    }
    strXml += '  <c:axId val="' + axisId + '"/>';
    strXml += '  <c:scaling>';
    strXml += '<c:orientation val="' + (opts.catAxisOrientation || (opts.barDir === 'col' ? 'minMax' : 'minMax')) + '"/>';
    if (opts.catAxisMaxVal || opts.catAxisMaxVal === 0)
        strXml += "<c:max val=\"".concat(opts.catAxisMaxVal, "\"/>");
    if (opts.catAxisMinVal || opts.catAxisMinVal === 0)
        strXml += "<c:min val=\"".concat(opts.catAxisMinVal, "\"/>");
    strXml += '</c:scaling>';
    strXml += '  <c:delete val="' + (opts.catAxisHidden ? '1' : '0') + '"/>';
    strXml += '  <c:axPos val="' + (opts.barDir === 'col' ? 'b' : 'l') + '"/>';
    strXml += opts.catGridLine.style !== 'none' ? createGridLineElement(opts.catGridLine) : '';
    // '<c:title>' comes between '</c:majorGridlines>' and '<c:numFmt>'
    if (opts.showCatAxisTitle) {
        strXml += genXmlTitle({
            color: opts.catAxisTitleColor,
            fontFace: opts.catAxisTitleFontFace,
            fontSize: opts.catAxisTitleFontSize,
            titleRotate: opts.catAxisTitleRotate,
            title: opts.catAxisTitle || 'Axis Title',
        });
    }
    // NOTE: Adding Val Axis Formatting if scatter or bubble charts
    if (opts._type === CHART_TYPE.SCATTER || opts._type === CHART_TYPE.BUBBLE || opts._type === CHART_TYPE.BUBBLE3D) {
        strXml += '  <c:numFmt formatCode="' + (opts.valAxisLabelFormatCode ? encodeXmlEntities(opts.valAxisLabelFormatCode) : 'General') + '" sourceLinked="1"/>';
    }
    else {
        strXml += '  <c:numFmt formatCode="' + (encodeXmlEntities(opts.catLabelFormatCode) || 'General') + '" sourceLinked="1"/>';
    }
    if (opts._type === CHART_TYPE.SCATTER) {
        strXml += '  <c:majorTickMark val="none"/>';
        strXml += '  <c:minorTickMark val="none"/>';
        strXml += '  <c:tickLblPos val="nextTo"/>';
    }
    else {
        strXml += '  <c:majorTickMark val="' + (opts.catAxisMajorTickMark || 'out') + '"/>';
        strXml += '  <c:minorTickMark val="' + (opts.catAxisMinorTickMark || 'none') + '"/>';
        strXml += '  <c:tickLblPos val="' + (opts.catAxisLabelPos || (opts.barDir === 'col' ? 'low' : 'nextTo')) + '"/>';
    }
    strXml += '  <c:spPr>';
    strXml += "    <a:ln w=\"".concat(opts.catAxisLineSize ? valToPts(opts.catAxisLineSize) : ONEPT, "\" cap=\"flat\">");
    strXml += !opts.catAxisLineShow ? '<a:noFill/>' : '<a:solidFill>' + createColorElement(opts.catAxisLineColor || DEF_CHART_GRIDLINE.color) + '</a:solidFill>';
    strXml += '      <a:prstDash val="' + (opts.catAxisLineStyle || 'solid') + '"/>';
    strXml += '      <a:round/>';
    strXml += '    </a:ln>';
    strXml += '  </c:spPr>';
    strXml += '  <c:txPr>';
    if (opts.catAxisLabelRotate) {
        strXml += "<a:bodyPr rot=\"".concat(convertRotationDegrees(opts.catAxisLabelRotate), "\"/>");
    }
    else {
        // NOTE: don't specify "`rot=0" - that way the object will be auto behavior
        strXml += '<a:bodyPr/>';
    }
    strXml += '    <a:lstStyle/>';
    strXml += '    <a:p>';
    strXml += '    <a:pPr>';
    strXml += "      <a:defRPr sz=\"".concat(Math.round((opts.catAxisLabelFontSize || DEF_FONT_SIZE) * 100), "\" b=\"").concat(opts.catAxisLabelFontBold ? 1 : 0, "\" i=\"").concat(opts.catAxisLabelFontItalic ? 1 : 0, "\" u=\"none\" strike=\"noStrike\">");
    strXml += '      <a:solidFill>' + createColorElement(opts.catAxisLabelColor || DEF_FONT_COLOR) + '</a:solidFill>';
    strXml += '      <a:latin typeface="' + (opts.catAxisLabelFontFace || 'Arial') + '"/>';
    strXml += '   </a:defRPr>';
    strXml += '  </a:pPr>';
    strXml += '  <a:endParaRPr lang="' + (opts.lang || 'en-US') + '"/>';
    strXml += '  </a:p>';
    strXml += ' </c:txPr>';
    strXml += ' <c:crossAx val="' + valAxisId + '"/>';
    strXml += " <c:".concat(typeof opts.valAxisCrossesAt === 'number' ? 'crossesAt' : 'crosses', " val=\"").concat(opts.valAxisCrossesAt || 'autoZero', "\"/>");
    strXml += ' <c:auto val="1"/>';
    strXml += ' <c:lblAlgn val="ctr"/>';
    strXml += " <c:noMultiLvlLbl val=\"".concat(opts.catAxisMultiLevelLabels ? 0 : 1, "\"/>");
    if (opts.catAxisLabelFrequency)
        strXml += ' <c:tickLblSkip val="' + opts.catAxisLabelFrequency + '"/>';
    // Issue#149: PPT will auto-adjust these as needed after calcing the date bounds, so we only include them when specified by user
    // Allow major and minor units to be set for double value axis charts
    if (opts.catLabelFormatCode || opts._type === CHART_TYPE.SCATTER || opts._type === CHART_TYPE.BUBBLE || opts._type === CHART_TYPE.BUBBLE3D) {
        if (opts.catLabelFormatCode) {
            ['catAxisBaseTimeUnit', 'catAxisMajorTimeUnit', 'catAxisMinorTimeUnit'].forEach(function (opt) {
                // Validate input as poorly chosen/garbage options will cause chart corruption and it wont render at all!
                if (opts[opt] && (typeof opts[opt] !== 'string' || !['days', 'months', 'years'].includes(opts[opt].toLowerCase()))) {
                    console.warn("\"".concat(opt, "\" must be one of: 'days','months','years' !"));
                    opts[opt] = null;
                }
            });
            if (opts.catAxisBaseTimeUnit)
                strXml += '<c:baseTimeUnit val="' + opts.catAxisBaseTimeUnit.toLowerCase() + '"/>';
            if (opts.catAxisMajorTimeUnit)
                strXml += '<c:majorTimeUnit val="' + opts.catAxisMajorTimeUnit.toLowerCase() + '"/>';
            if (opts.catAxisMinorTimeUnit)
                strXml += '<c:minorTimeUnit val="' + opts.catAxisMinorTimeUnit.toLowerCase() + '"/>';
        }
        if (opts.catAxisMajorUnit)
            strXml += "<c:majorUnit val=\"".concat(opts.catAxisMajorUnit, "\"/>");
        if (opts.catAxisMinorUnit)
            strXml += "<c:minorUnit val=\"".concat(opts.catAxisMinorUnit, "\"/>");
    }
    // Close cat axis tag
    // NOTE: Added closing tag of val or cat axis based on chart type
    if (opts._type === CHART_TYPE.SCATTER || opts._type === CHART_TYPE.BUBBLE || opts._type === CHART_TYPE.BUBBLE3D) {
        strXml += '</c:valAx>';
    }
    else {
        strXml += '</c:' + (opts.catLabelFormatCode ? 'dateAx' : 'catAx') + '>';
    }
    return strXml;
}
/**
 * Create Value Axis (Used by `bar3D`)
 * @param {IChartOptsLib} opts - chart options
 * @param {string} valAxisId - value
 * @return {string} XML
 */
function makeValAxis(opts, valAxisId) {
    var axisPos = valAxisId === AXIS_ID_VALUE_PRIMARY ? (opts.barDir === 'col' ? 'l' : 'b') : opts.barDir !== 'col' ? 'r' : 't';
    if (valAxisId === AXIS_ID_VALUE_SECONDARY)
        axisPos = 'r'; // default behavior for PPT is showing 2nd val axis on right (primary axis on left)
    var crossAxId = valAxisId === AXIS_ID_VALUE_PRIMARY ? AXIS_ID_CATEGORY_PRIMARY : AXIS_ID_CATEGORY_SECONDARY;
    var strXml = '';
    strXml += '<c:valAx>';
    strXml += '  <c:axId val="' + valAxisId + '"/>';
    strXml += '  <c:scaling>';
    if (opts.valAxisLogScaleBase)
        strXml += "<c:logBase val=\"".concat(opts.valAxisLogScaleBase, "\"/>");
    strXml += '<c:orientation val="' + (opts.valAxisOrientation || (opts.barDir === 'col' ? 'minMax' : 'minMax')) + '"/>';
    if (opts.valAxisMaxVal || opts.valAxisMaxVal === 0)
        strXml += "<c:max val=\"".concat(opts.valAxisMaxVal, "\"/>");
    if (opts.valAxisMinVal || opts.valAxisMinVal === 0)
        strXml += "<c:min val=\"".concat(opts.valAxisMinVal, "\"/>");
    strXml += '  </c:scaling>';
    strXml += "  <c:delete val=\"".concat(opts.valAxisHidden ? 1 : 0, "\"/>");
    strXml += '  <c:axPos val="' + axisPos + '"/>';
    if (opts.valGridLine.style !== 'none')
        strXml += createGridLineElement(opts.valGridLine);
    // '<c:title>' comes between '</c:majorGridlines>' and '<c:numFmt>'
    if (opts.showValAxisTitle) {
        strXml += genXmlTitle({
            color: opts.valAxisTitleColor,
            fontFace: opts.valAxisTitleFontFace,
            fontSize: opts.valAxisTitleFontSize,
            titleRotate: opts.valAxisTitleRotate,
            title: opts.valAxisTitle || 'Axis Title',
        });
    }
    strXml += "<c:numFmt formatCode=\"".concat(opts.valAxisLabelFormatCode ? encodeXmlEntities(opts.valAxisLabelFormatCode) : 'General', "\" sourceLinked=\"0\"/>");
    if (opts._type === CHART_TYPE.SCATTER) {
        strXml += '  <c:majorTickMark val="none"/>';
        strXml += '  <c:minorTickMark val="none"/>';
        strXml += '  <c:tickLblPos val="nextTo"/>';
    }
    else {
        strXml += ' <c:majorTickMark val="' + (opts.valAxisMajorTickMark || 'out') + '"/>';
        strXml += ' <c:minorTickMark val="' + (opts.valAxisMinorTickMark || 'none') + '"/>';
        strXml += ' <c:tickLblPos val="' + (opts.valAxisLabelPos || (opts.barDir === 'col' ? 'nextTo' : 'low')) + '"/>';
    }
    strXml += ' <c:spPr>';
    strXml += "   <a:ln w=\"".concat(opts.valAxisLineSize ? valToPts(opts.valAxisLineSize) : ONEPT, "\" cap=\"flat\">");
    strXml += !opts.valAxisLineShow ? '<a:noFill/>' : '<a:solidFill>' + createColorElement(opts.valAxisLineColor || DEF_CHART_GRIDLINE.color) + '</a:solidFill>';
    strXml += '     <a:prstDash val="' + (opts.valAxisLineStyle || 'solid') + '"/>';
    strXml += '     <a:round/>';
    strXml += '   </a:ln>';
    strXml += ' </c:spPr>';
    strXml += ' <c:txPr>';
    strXml += "  <a:bodyPr".concat(opts.valAxisLabelRotate ? (' rot="' + convertRotationDegrees(opts.valAxisLabelRotate).toString() + '"') : '', "/>"); // don't specify rot 0 so we get the auto behavior
    strXml += '  <a:lstStyle/>';
    strXml += '  <a:p>';
    strXml += '    <a:pPr>';
    strXml += "      <a:defRPr sz=\"".concat(Math.round((opts.valAxisLabelFontSize || DEF_FONT_SIZE) * 100), "\" b=\"").concat(opts.valAxisLabelFontBold ? 1 : 0, "\" i=\"").concat(opts.valAxisLabelFontItalic ? 1 : 0, "\" u=\"none\" strike=\"noStrike\">");
    strXml += '        <a:solidFill>' + createColorElement(opts.valAxisLabelColor || DEF_FONT_COLOR) + '</a:solidFill>';
    strXml += '        <a:latin typeface="' + (opts.valAxisLabelFontFace || 'Arial') + '"/>';
    strXml += '      </a:defRPr>';
    strXml += '    </a:pPr>';
    strXml += '  <a:endParaRPr lang="' + (opts.lang || 'en-US') + '"/>';
    strXml += '  </a:p>';
    strXml += ' </c:txPr>';
    strXml += ' <c:crossAx val="' + crossAxId + '"/>';
    if (typeof opts.catAxisCrossesAt === 'number') {
        strXml += " <c:crossesAt val=\"".concat(opts.catAxisCrossesAt, "\"/>");
    }
    else if (typeof opts.catAxisCrossesAt === 'string') {
        strXml += ' <c:crosses val="' + opts.catAxisCrossesAt + '"/>';
    }
    else {
        var isRight = axisPos === 'r' || axisPos === 't';
        var crosses = isRight ? 'max' : 'autoZero';
        strXml += ' <c:crosses val="' + crosses + '"/>';
    }
    strXml +=
        ' <c:crossBetween val="' +
            (opts._type === CHART_TYPE.SCATTER || (!!(Array.isArray(opts._type) && opts._type.filter(function (type) { return type.type === CHART_TYPE.AREA; }).length > 0)) ? 'midCat' : 'between') +
            '"/>';
    if (opts.valAxisMajorUnit)
        strXml += " <c:majorUnit val=\"".concat(opts.valAxisMajorUnit, "\"/>");
    if (opts.valAxisDisplayUnit) {
        strXml += "<c:dispUnits><c:builtInUnit val=\"".concat(opts.valAxisDisplayUnit, "\"/>").concat(opts.valAxisDisplayUnitLabel ? '<c:dispUnitsLbl/>' : '', "</c:dispUnits>");
    }
    strXml += '</c:valAx>';
    return strXml;
}
/**
 * Create Series Axis (Used by `bar3D`)
 * @param {IChartOptsLib} opts - chart options
 * @param {string} axisId - axis ID
 * @param {string} valAxisId - value
 * @return {string} XML
 */
function makeSerAxis(opts, axisId, valAxisId) {
    var strXml = '';
    // Build ser axis tag
    strXml += '<c:serAx>';
    strXml += '  <c:axId val="' + axisId + '"/>';
    strXml += '  <c:scaling><c:orientation val="' + (opts.serAxisOrientation || (opts.barDir === 'col' ? 'minMax' : 'minMax')) + '"/></c:scaling>';
    strXml += '  <c:delete val="' + (opts.serAxisHidden ? '1' : '0') + '"/>';
    strXml += '  <c:axPos val="' + (opts.barDir === 'col' ? 'b' : 'l') + '"/>';
    strXml += opts.serGridLine.style !== 'none' ? createGridLineElement(opts.serGridLine) : '';
    // '<c:title>' comes between '</c:majorGridlines>' and '<c:numFmt>'
    if (opts.showSerAxisTitle) {
        strXml += genXmlTitle({
            color: opts.serAxisTitleColor,
            fontFace: opts.serAxisTitleFontFace,
            fontSize: opts.serAxisTitleFontSize,
            titleRotate: opts.serAxisTitleRotate,
            title: opts.serAxisTitle || 'Axis Title',
        });
    }
    strXml += "  <c:numFmt formatCode=\"".concat(encodeXmlEntities(opts.serLabelFormatCode) || 'General', "\" sourceLinked=\"0\"/>");
    strXml += '  <c:majorTickMark val="out"/>';
    strXml += '  <c:minorTickMark val="none"/>';
    strXml += "  <c:tickLblPos val=\"".concat(opts.serAxisLabelPos || opts.barDir === 'col' ? 'low' : 'nextTo', "\"/>");
    strXml += '  <c:spPr>';
    strXml += '    <a:ln w="12700" cap="flat">';
    strXml += !opts.serAxisLineShow ? '<a:noFill/>' : "<a:solidFill>".concat(createColorElement(opts.serAxisLineColor || DEF_CHART_GRIDLINE.color), "</a:solidFill>");
    strXml += '      <a:prstDash val="solid"/>';
    strXml += '      <a:round/>';
    strXml += '    </a:ln>';
    strXml += '  </c:spPr>';
    strXml += '  <c:txPr>';
    strXml += '    <a:bodyPr/>'; // don't specify rot 0 so we get the auto behavior
    strXml += '    <a:lstStyle/>';
    strXml += '    <a:p>';
    strXml += '    <a:pPr>';
    strXml += "    <a:defRPr sz=\"".concat(Math.round((opts.serAxisLabelFontSize || DEF_FONT_SIZE) * 100), "\" b=\"").concat(opts.serAxisLabelFontBold ? '1' : '0', "\" i=\"").concat(opts.serAxisLabelFontItalic ? '1' : '0', "\" u=\"none\" strike=\"noStrike\">");
    strXml += "      <a:solidFill>".concat(createColorElement(opts.serAxisLabelColor || DEF_FONT_COLOR), "</a:solidFill>");
    strXml += "      <a:latin typeface=\"".concat(opts.serAxisLabelFontFace || 'Arial', "\"/>");
    strXml += '   </a:defRPr>';
    strXml += '  </a:pPr>';
    strXml += '  <a:endParaRPr lang="' + (opts.lang || 'en-US') + '"/>';
    strXml += '  </a:p>';
    strXml += ' </c:txPr>';
    strXml += ' <c:crossAx val="' + valAxisId + '"/>';
    strXml += ' <c:crosses val="autoZero"/>';
    if (opts.serAxisLabelFrequency)
        strXml += ' <c:tickLblSkip val="' + opts.serAxisLabelFrequency + '"/>';
    // Issue#149: PPT will auto-adjust these as needed after calcing the date bounds, so we only include them when specified by user
    if (opts.serLabelFormatCode) {
        ['serAxisBaseTimeUnit', 'serAxisMajorTimeUnit', 'serAxisMinorTimeUnit'].forEach(function (opt) {
            // Validate input as poorly chosen/garbage options will cause chart corruption and it wont render at all!
            if (opts[opt] && (typeof opts[opt] !== 'string' || !['days', 'months', 'years'].includes(opt.toLowerCase()))) {
                console.warn("\"".concat(opt, "\" must be one of: 'days','months','years' !"));
                opts[opt] = null;
            }
        });
        if (opts.serAxisBaseTimeUnit)
            strXml += " <c:baseTimeUnit  val=\"".concat(opts.serAxisBaseTimeUnit.toLowerCase(), "\"/>");
        if (opts.serAxisMajorTimeUnit)
            strXml += " <c:majorTimeUnit val=\"".concat(opts.serAxisMajorTimeUnit.toLowerCase(), "\"/>");
        if (opts.serAxisMinorTimeUnit)
            strXml += " <c:minorTimeUnit val=\"".concat(opts.serAxisMinorTimeUnit.toLowerCase(), "\"/>");
        if (opts.serAxisMajorUnit)
            strXml += " <c:majorUnit val=\"".concat(opts.serAxisMajorUnit, "\"/>");
        if (opts.serAxisMinorUnit)
            strXml += " <c:minorUnit val=\"".concat(opts.serAxisMinorUnit, "\"/>");
    }
    // Close ser axis tag
    strXml += '</c:serAx>';
    return strXml;
}
/**
 * Create char title elements
 * @param {IChartPropsTitle} opts - options
 * @return {string} XML `<c:title>`
 */
function genXmlTitle(opts, chartX, chartY) {
    var align = opts.titleAlign === 'left' || opts.titleAlign === 'right' ? "<a:pPr algn=\"".concat(opts.titleAlign.substring(0, 1), "\">") : '<a:pPr>';
    var rotate = opts.titleRotate ? "<a:bodyPr rot=\"".concat(convertRotationDegrees(opts.titleRotate), "\"/>") : '<a:bodyPr/>'; // don't specify rotation to get default (ex. vertical for cat axis)
    var sizeAttr = opts.fontSize ? "sz=\"".concat(Math.round(opts.fontSize * 100), "\"") : ''; // only set the font size if specified.  Powerpoint will handle the default size
    var titleBold = opts.titleBold ? 1 : 0;
    var layout = '<c:layout/>';
    if (opts.titlePos && typeof opts.titlePos.x === 'number' && typeof opts.titlePos.y === 'number') {
        // NOTE: manualLayout x/y vals are *relative to entire slide*
        var totalX = opts.titlePos.x + chartX;
        var totalY = opts.titlePos.y + chartY;
        var valX = totalX === 0 ? 0 : (totalX * (totalX / 5)) / 10;
        if (valX >= 1)
            valX = valX / 10;
        if (valX >= 0.1)
            valX = valX / 10;
        var valY = totalY === 0 ? 0 : (totalY * (totalY / 5)) / 10;
        if (valY >= 1)
            valY = valY / 10;
        if (valY >= 0.1)
            valY = valY / 10;
        layout = "<c:layout><c:manualLayout><c:xMode val=\"edge\"/><c:yMode val=\"edge\"/><c:x val=\"".concat(valX, "\"/><c:y val=\"").concat(valY, "\"/></c:manualLayout></c:layout>");
    }
    return "<c:title>\n      <c:tx>\n        <c:rich>\n          ".concat(rotate, "\n          <a:lstStyle/>\n          <a:p>\n            ").concat(align, "\n            <a:defRPr ").concat(sizeAttr, " b=\"").concat(titleBold, "\" i=\"0\" u=\"none\" strike=\"noStrike\">\n              <a:solidFill>").concat(createColorElement(opts.color || DEF_FONT_COLOR), "</a:solidFill>\n              <a:latin typeface=\"").concat(opts.fontFace || 'Arial', "\"/>\n            </a:defRPr>\n          </a:pPr>\n          <a:r>\n            <a:rPr ").concat(sizeAttr, " b=\"").concat(titleBold, "\" i=\"0\" u=\"none\" strike=\"noStrike\">\n              <a:solidFill>").concat(createColorElement(opts.color || DEF_FONT_COLOR), "</a:solidFill>\n              <a:latin typeface=\"").concat(opts.fontFace || 'Arial', "\"/>\n            </a:rPr>\n            <a:t>").concat(encodeXmlEntities(opts.title) || '', "</a:t>\n          </a:r>\n        </a:p>\n        </c:rich>\n      </c:tx>\n      ").concat(layout, "\n      <c:overlay val=\"0\"/>\n    </c:title>");
}
/**
 * Calc and return excel column name for a given column length
 * @param colIndex column index
 * @return column name
 * @example 1 returns 'A'
 * @example 27 returns 'AA'
 */
function getExcelColName(colIndex) {
    var colStr = '';
    var colIdx = colIndex - 1; // Subtract 1 so `LETTERS[columnIndex]` returns "A" etc
    if (colIdx <= 25) {
        // A-Z
        colStr = LETTERS[colIdx];
    }
    else {
        // AA-ZZ (ZZ = index 702)
        colStr = "".concat(LETTERS[Math.floor(colIdx / LETTERS.length - 1)]).concat(LETTERS[colIdx % LETTERS.length]);
    }
    return colStr;
}
/**
 * Creates `a:innerShdw` or `a:outerShdw` depending on pass options `opts`.
 * @param {Object} opts optional shadow properties
 * @param {Object} defaults defaults for unspecified properties in `opts`
 * @see http://officeopenxml.com/drwSp-effects.php
 * @example { type: 'outer', blur: 3, offset: (23000 / 12700), angle: 90, color: '000000', opacity: 0.35, rotateWithShape: true };
 * @return {string} XML
 */
function createShadowElement(options, defaults) {
    if (!options) {
        return '<a:effectLst/>';
    }
    else if (typeof options !== 'object') {
        console.warn('`shadow` options must be an object. Ex: `{shadow: {type:\'none\'}}`');
        return '<a:effectLst/>';
    }
    var strXml = '<a:effectLst>';
    var opts = __assign(__assign({}, defaults), options);
    var type = opts.type || 'outer';
    var blur = valToPts(opts.blur);
    var offset = valToPts(opts.offset);
    var angle = Math.round(opts.angle * 60000);
    var color = opts.color;
    var opacity = Math.round(opts.opacity * 100000);
    var rotShape = opts.rotateWithShape ? 1 : 0;
    strXml += "<a:".concat(type, "Shdw sx=\"100000\" sy=\"100000\" kx=\"0\" ky=\"0\"  algn=\"bl\" blurRad=\"").concat(blur, "\" rotWithShape=\"").concat(rotShape, "\" dist=\"").concat(offset, "\" dir=\"").concat(angle, "\">");
    strXml += "<a:srgbClr val=\"".concat(color, "\">");
    strXml += "<a:alpha val=\"".concat(opacity, "\"/></a:srgbClr>");
    strXml += "</a:".concat(type, "Shdw>");
    strXml += '</a:effectLst>';
    return strXml;
}
/**
 * Create Grid Line Element
 * @param {OptsChartGridLine} glOpts {size, color, style}
 * @return {string} XML
 */
function createGridLineElement(glOpts) {
    var strXml = '<c:majorGridlines>';
    strXml += ' <c:spPr>';
    strXml += "  <a:ln w=\"".concat(valToPts(glOpts.size || DEF_CHART_GRIDLINE.size), "\" cap=\"").concat(createLineCap(glOpts.cap || DEF_CHART_GRIDLINE.cap), "\">");
    strXml += '  <a:solidFill><a:srgbClr val="' + (glOpts.color || DEF_CHART_GRIDLINE.color) + '"/></a:solidFill>'; // should accept scheme colors as implemented in [Pull #135]
    strXml += '   <a:prstDash val="' + (glOpts.style || DEF_CHART_GRIDLINE.style) + '"/><a:round/>';
    strXml += '  </a:ln>';
    strXml += ' </c:spPr>';
    strXml += '</c:majorGridlines>';
    return strXml;
}
function createLineCap(lineCap) {
    if (!lineCap || lineCap === 'flat') {
        return 'flat';
    }
    else if (lineCap === 'square') {
        return 'sq';
    }
    else if (lineCap === 'round') {
        return 'rnd';
    }
    else {
        var neverLineCap = lineCap;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error("Invalid chart line cap: ".concat(neverLineCap));
    }
}

/**
 * PptxGenJS: Media Methods
 */
/**
 * Encode Image/Audio/Video into base64
 * @param {PresSlide | SlideLayout} layout - slide layout
 * @return {Promise} promise
 */
function encodeSlideMediaRels(layout) {
    var fs = typeof require !== 'undefined' && typeof window === 'undefined' ? require('fs') : null; // NodeJS
    var https = typeof require !== 'undefined' && typeof window === 'undefined' ? require('https') : null; // NodeJS
    var imageProms = [];
    // A: Capture all audio/image/video candidates for encoding (filtering online/pre-encoded)
    var candidateRels = layout._relsMedia.filter(function (rel) { return rel.type !== 'online' && !rel.data && (!rel.path || (rel.path && !rel.path.includes('preencoded'))); });
    // B: PERF: Mark dupes (same `path`) so that we dont load same media over-and-over
    var unqPaths = [];
    candidateRels.forEach(function (rel) {
        if (!unqPaths.includes(rel.path)) {
            rel.isDuplicate = false;
            unqPaths.push(rel.path);
        }
        else {
            rel.isDuplicate = true;
        }
    });
    // C: Read/Encode each unique audio/image/video path
    candidateRels
        .filter(function (rel) { return !rel.isDuplicate; })
        .forEach(function (rel) {
        imageProms.push(new Promise(function (resolve, reject) {
            if (fs && rel.path.indexOf('http') !== 0) {
                // DESIGN: Node local-file encoding is syncronous, so we can load all images here, then call export with a callback (if any)
                try {
                    var bitmap = fs.readFileSync(rel.path);
                    rel.data = Buffer.from(bitmap).toString('base64');
                    candidateRels.filter(function (dupe) { return dupe.isDuplicate && dupe.path === rel.path; }).forEach(function (dupe) { return (dupe.data = rel.data); });
                    resolve('done');
                }
                catch (ex) {
                    rel.data = IMG_BROKEN;
                    candidateRels.filter(function (dupe) { return dupe.isDuplicate && dupe.path === rel.path; }).forEach(function (dupe) { return (dupe.data = rel.data); });
                    reject(new Error("ERROR: Unable to read media: \"".concat(rel.path, "\"\n").concat(String(ex))));
                }
            }
            else if (fs && https && rel.path.indexOf('http') === 0) {
                https.get(rel.path, function (res) {
                    var rawData = '';
                    res.setEncoding('binary'); // IMPORTANT: Only binary encoding works
                    res.on('data', function (chunk) { return (rawData += chunk); });
                    res.on('end', function () {
                        rel.data = Buffer.from(rawData, 'binary').toString('base64');
                        candidateRels.filter(function (dupe) { return dupe.isDuplicate && dupe.path === rel.path; }).forEach(function (dupe) { return (dupe.data = rel.data); });
                        resolve('done');
                    });
                    res.on('error', function (_ex) {
                        rel.data = IMG_BROKEN;
                        candidateRels.filter(function (dupe) { return dupe.isDuplicate && dupe.path === rel.path; }).forEach(function (dupe) { return (dupe.data = rel.data); });
                        reject(new Error("ERROR! Unable to load image (https.get): ".concat(rel.path)));
                    });
                });
            }
            else {
                // A: Declare XHR and onload/onerror handlers
                // DESIGN: `XMLHttpRequest()` plus `FileReader()` = Ablity to read any file into base64!
                var xhr_1 = new XMLHttpRequest();
                xhr_1.onload = function () {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        rel.data = reader.result;
                        candidateRels.filter(function (dupe) { return dupe.isDuplicate && dupe.path === rel.path; }).forEach(function (dupe) { return (dupe.data = rel.data); });
                        if (!rel.isSvgPng) {
                            resolve('done');
                        }
                        else {
                            createSvgPngPreview(rel)
                                .then(function () {
                                resolve('done');
                            })
                                .catch(function (ex) {
                                reject(ex);
                            });
                        }
                    };
                    reader.readAsDataURL(xhr_1.response);
                };
                xhr_1.onerror = function (ex) {
                    rel.data = IMG_BROKEN;
                    candidateRels.filter(function (dupe) { return dupe.isDuplicate && dupe.path === rel.path; }).forEach(function (dupe) { return (dupe.data = rel.data); });
                    reject(new Error("ERROR! Unable to load image (xhr.onerror): ".concat(rel.path)));
                };
                // B: Execute request
                xhr_1.open('GET', rel.path);
                xhr_1.responseType = 'blob';
                xhr_1.send();
            }
        }));
    });
    // B: SVG: base64 data still requires a png to be generated (`isSvgPng` flag this as the preview image, not the SVG itself)
    layout._relsMedia
        .filter(function (rel) { return rel.isSvgPng && rel.data; })
        .forEach(function (rel) {
        if (fs) {
            // console.log('Sorry, SVG is not supported in Node (more info: https://github.com/gitbrent/PptxGenJS/issues/401)')
            rel.data = IMG_BROKEN;
            imageProms.push(Promise.resolve().then(function () { return 'done'; }));
        }
        else {
            imageProms.push(createSvgPngPreview(rel));
        }
    });
    return imageProms;
}
/**
 * Create SVG preview image
 * @param {ISlideRelMedia} rel - slide rel
 * @return {Promise} promise
 */
function createSvgPngPreview(rel) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        // A: Create
                        var image = new Image();
                        // B: Set onload event
                        image.onload = function () {
                            // First: Check for any errors: This is the best method (try/catch wont work, etc.)
                            if (image.width + image.height === 0) {
                                image.onerror('h/w=0');
                            }
                            var canvas = document.createElement('CANVAS');
                            var ctx = canvas.getContext('2d');
                            canvas.width = image.width;
                            canvas.height = image.height;
                            ctx.drawImage(image, 0, 0);
                            // Users running on local machine will get the following error:
                            // "SecurityError: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported."
                            // when the canvas.toDataURL call executes below.
                            try {
                                rel.data = canvas.toDataURL(rel.type);
                                resolve('done');
                            }
                            catch (ex) {
                                image.onerror(ex);
                            }
                            canvas = null;
                        };
                        image.onerror = function (ex) {
                            rel.data = IMG_BROKEN;
                            reject(new Error("ERROR! Unable to load image (image.onerror): ".concat(rel.path)));
                        };
                        // C: Load image
                        image.src = typeof rel.data === 'string' ? rel.data : IMG_BROKEN;
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}

/**
 * PptxGenJS: XML Generation
 */
var ImageSizingXml = {
    cover: function (imgSize, boxDim) {
        var imgRatio = imgSize.h / imgSize.w;
        var boxRatio = boxDim.h / boxDim.w;
        var isBoxBased = boxRatio > imgRatio;
        var width = isBoxBased ? boxDim.h / imgRatio : boxDim.w;
        var height = isBoxBased ? boxDim.h : boxDim.w * imgRatio;
        var hzPerc = Math.round(1e5 * 0.5 * (1 - boxDim.w / width));
        var vzPerc = Math.round(1e5 * 0.5 * (1 - boxDim.h / height));
        return "<a:srcRect l=\"".concat(hzPerc, "\" r=\"").concat(hzPerc, "\" t=\"").concat(vzPerc, "\" b=\"").concat(vzPerc, "\"/><a:stretch/>");
    },
    contain: function (imgSize, boxDim) {
        var imgRatio = imgSize.h / imgSize.w;
        var boxRatio = boxDim.h / boxDim.w;
        var widthBased = boxRatio > imgRatio;
        var width = widthBased ? boxDim.w : boxDim.h / imgRatio;
        var height = widthBased ? boxDim.w * imgRatio : boxDim.h;
        var hzPerc = Math.round(1e5 * 0.5 * (1 - boxDim.w / width));
        var vzPerc = Math.round(1e5 * 0.5 * (1 - boxDim.h / height));
        return "<a:srcRect l=\"".concat(hzPerc, "\" r=\"").concat(hzPerc, "\" t=\"").concat(vzPerc, "\" b=\"").concat(vzPerc, "\"/><a:stretch/>");
    },
    crop: function (imgSize, boxDim) {
        var l = boxDim.x;
        var r = imgSize.w - (boxDim.x + boxDim.w);
        var t = boxDim.y;
        var b = imgSize.h - (boxDim.y + boxDim.h);
        var lPerc = Math.round(1e5 * (l / imgSize.w));
        var rPerc = Math.round(1e5 * (r / imgSize.w));
        var tPerc = Math.round(1e5 * (t / imgSize.h));
        var bPerc = Math.round(1e5 * (b / imgSize.h));
        return "<a:srcRect l=\"".concat(lPerc, "\" r=\"").concat(rPerc, "\" t=\"").concat(tPerc, "\" b=\"").concat(bPerc, "\"/><a:stretch/>");
    },
};
/**
 * Transforms a slide or slideLayout to resulting XML string - Creates `ppt/slide*.xml`
 * @param {PresSlide|SlideLayout} slideObject - slide object created within createSlideObject
 * @return {string} XML string with <p:cSld> as the root
 */
function slideObjectToXml(slide) {
    var _a;
    var strSlideXml = slide._name ? '<p:cSld name="' + slide._name + '">' : '<p:cSld>';
    var intTableNum = 1;
    // STEP 1: Add background color/image (ensure only a single `<p:bg>` tag is created, ex: when master-baskground has both `color` and `path`)
    if (slide._bkgdImgRid) {
        strSlideXml += "<p:bg><p:bgPr><a:blipFill dpi=\"0\" rotWithShape=\"1\"><a:blip r:embed=\"rId".concat(slide._bkgdImgRid, "\"><a:lum/></a:blip><a:srcRect/><a:stretch><a:fillRect/></a:stretch></a:blipFill><a:effectLst/></p:bgPr></p:bg>");
    }
    else if ((_a = slide.background) === null || _a === void 0 ? void 0 : _a.color) {
        strSlideXml += "<p:bg><p:bgPr>".concat(genXmlColorSelection(slide.background), "</p:bgPr></p:bg>");
    }
    else if (!slide.bkgd && slide._name && slide._name === DEF_PRES_LAYOUT_NAME) {
        // NOTE: Default [white] background is needed on slideMaster1.xml to avoid gray background in Keynote (and Finder previews)
        strSlideXml += '<p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg>';
    }
    // STEP 2: Continue slide by starting spTree node
    strSlideXml += '<p:spTree>';
    strSlideXml += '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>';
    strSlideXml += '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/>';
    strSlideXml += '<a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>';
    // STEP 3: Loop over all Slide.data objects and add them to this slide
    slide._slideObjects.forEach(function (slideItemObj, idx) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var x = 0;
        var y = 0;
        var cx = getSmartParseNumber('75%', 'X', slide._presLayout);
        var cy = 0;
        var placeholderObj;
        var locationAttr = '';
        var arrTabRows = null;
        var objTabOpts = null;
        var intColCnt = 0;
        var intColW = 0;
        var cellOpts = null;
        var strXml = null;
        var sizing = (_a = slideItemObj.options) === null || _a === void 0 ? void 0 : _a.sizing;
        var rounding = (_b = slideItemObj.options) === null || _b === void 0 ? void 0 : _b.rounding;
        if (slide._slideLayout !== undefined &&
            slide._slideLayout._slideObjects !== undefined &&
            slideItemObj.options &&
            slideItemObj.options.placeholder) {
            placeholderObj = slide._slideLayout._slideObjects.filter(function (object) { return object.options.placeholder === slideItemObj.options.placeholder; })[0];
        }
        // A: Set option vars
        slideItemObj.options = slideItemObj.options || {};
        if (typeof slideItemObj.options.x !== 'undefined')
            x = getSmartParseNumber(slideItemObj.options.x, 'X', slide._presLayout);
        if (typeof slideItemObj.options.y !== 'undefined')
            y = getSmartParseNumber(slideItemObj.options.y, 'Y', slide._presLayout);
        if (typeof slideItemObj.options.w !== 'undefined')
            cx = getSmartParseNumber(slideItemObj.options.w, 'X', slide._presLayout);
        if (typeof slideItemObj.options.h !== 'undefined')
            cy = getSmartParseNumber(slideItemObj.options.h, 'Y', slide._presLayout);
        // Set w/h now that smart parse is done
        var imgWidth = cx;
        var imgHeight = cy;
        // If using a placeholder then inherit it's position
        if (placeholderObj) {
            if (placeholderObj.options.x || placeholderObj.options.x === 0)
                x = getSmartParseNumber(placeholderObj.options.x, 'X', slide._presLayout);
            if (placeholderObj.options.y || placeholderObj.options.y === 0)
                y = getSmartParseNumber(placeholderObj.options.y, 'Y', slide._presLayout);
            if (placeholderObj.options.w || placeholderObj.options.w === 0)
                cx = getSmartParseNumber(placeholderObj.options.w, 'X', slide._presLayout);
            if (placeholderObj.options.h || placeholderObj.options.h === 0)
                cy = getSmartParseNumber(placeholderObj.options.h, 'Y', slide._presLayout);
        }
        //
        if (slideItemObj.options.flipH)
            locationAttr += ' flipH="1"';
        if (slideItemObj.options.flipV)
            locationAttr += ' flipV="1"';
        if (slideItemObj.options.rotate)
            locationAttr += " rot=\"".concat(convertRotationDegrees(slideItemObj.options.rotate), "\"");
        // B: Add OBJECT to the current Slide
        switch (slideItemObj._type) {
            case SLIDE_OBJECT_TYPES.table:
                arrTabRows = slideItemObj.arrTabRows;
                objTabOpts = slideItemObj.options;
                intColCnt = 0;
                intColW = 0;
                // Calc number of columns
                // NOTE: Cells may have a colspan, so merely taking the length of the [0] (or any other) row is not
                // ....: sufficient to determine column count. Therefore, check each cell for a colspan and total cols as reqd
                arrTabRows[0].forEach(function (cell) {
                    cellOpts = cell.options || null;
                    intColCnt += (cellOpts === null || cellOpts === void 0 ? void 0 : cellOpts.colspan) ? Number(cellOpts.colspan) : 1;
                });
                // STEP 1: Start Table XML
                // NOTE: Non-numeric cNvPr id values will trigger "presentation needs repair" type warning in MS-PPT-2013
                strXml = "<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id=\"".concat(intTableNum * slide._slideNum + 1, "\" name=\"").concat(slideItemObj.options.objectName, "\"/>");
                strXml +=
                    '<p:cNvGraphicFramePr><a:graphicFrameLocks noGrp="1"/></p:cNvGraphicFramePr>' +
                        '  <p:nvPr><p:extLst><p:ext uri="{D42A27DB-BD31-4B8C-83A1-F6EECF244321}"><p14:modId xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" val="1579011935"/></p:ext></p:extLst></p:nvPr>' +
                        '</p:nvGraphicFramePr>';
                strXml += "<p:xfrm><a:off x=\"".concat(x || (x === 0 ? 0 : EMU), "\" y=\"").concat(y || (y === 0 ? 0 : EMU), "\"/><a:ext cx=\"").concat(cx || (cx === 0 ? 0 : EMU), "\" cy=\"").concat(cy || EMU, "\"/></p:xfrm>");
                strXml += '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table"><a:tbl><a:tblPr/>';
                // + '        <a:tblPr bandRow="1"/>';
                // TODO: Support banded rows, first/last row, etc.
                // NOTE: Banding, etc. only shows when using a table style! (or set alt row color if banding)
                // <a:tblPr firstCol="0" firstRow="0" lastCol="0" lastRow="0" bandCol="0" bandRow="1">
                // STEP 2: Set column widths
                // Evenly distribute cols/rows across size provided when applicable (calc them if only overall dimensions were provided)
                // A: Col widths provided?
                // B: Table Width provided without colW? Then distribute cols
                if (Array.isArray(objTabOpts.colW)) {
                    strXml += '<a:tblGrid>';
                    for (var col = 0; col < intColCnt; col++) {
                        var w = inch2Emu(objTabOpts.colW[col]);
                        if (w == null || isNaN(w)) {
                            w = (typeof slideItemObj.options.w === 'number' ? slideItemObj.options.w : 1) / intColCnt;
                        }
                        strXml += "<a:gridCol w=\"".concat(Math.round(w), "\"/>");
                    }
                    strXml += '</a:tblGrid>';
                }
                else {
                    intColW = objTabOpts.colW ? objTabOpts.colW : EMU;
                    if (slideItemObj.options.w && !objTabOpts.colW)
                        intColW = Math.round((typeof slideItemObj.options.w === 'number' ? slideItemObj.options.w : 1) / intColCnt);
                    strXml += '<a:tblGrid>';
                    for (var colw = 0; colw < intColCnt; colw++) {
                        strXml += "<a:gridCol w=\"".concat(intColW, "\"/>");
                    }
                    strXml += '</a:tblGrid>';
                }
                // STEP 3: Build our row arrays into an actual grid to match the XML we will be building next (ISSUE #36)
                // Note row arrays can arrive "lopsided" as in row1:[1,2,3] row2:[3] when first two cols rowspan!,
                // so a simple loop below in XML building wont suffice to build table correctly.
                // We have to build an actual grid now
                /*
                    EX: (A0:rowspan=3, B1:rowspan=2, C1:colspan=2)

                    /------|------|------|------\
                    |  A0  |  B0  |  C0  |  D0  |
                    |      |  B1  |  C1  |      |
                    |      |      |  C2  |  D2  |
                    \------|------|------|------/
                */
                // A: add _hmerge cell for colspan. should reserve rowspan
                arrTabRows.forEach(function (cells) {
                    var _a, _b;
                    var _loop_1 = function (cIdx) {
                        var cell = cells[cIdx];
                        var colspan = (_a = cell.options) === null || _a === void 0 ? void 0 : _a.colspan;
                        var rowspan = (_b = cell.options) === null || _b === void 0 ? void 0 : _b.rowspan;
                        if (colspan && colspan > 1) {
                            var vMergeCells = new Array(colspan - 1).fill(undefined).map(function (_) {
                                return { _type: SLIDE_OBJECT_TYPES.tablecell, options: { rowspan: rowspan }, _hmerge: true };
                            });
                            cells.splice.apply(cells, __spreadArray([cIdx + 1, 0], vMergeCells, false));
                            cIdx += colspan;
                        }
                        else {
                            cIdx += 1;
                        }
                        out_cIdx_1 = cIdx;
                    };
                    var out_cIdx_1;
                    for (var cIdx = 0; cIdx < cells.length;) {
                        _loop_1(cIdx);
                        cIdx = out_cIdx_1;
                    }
                });
                // B: add _vmerge cell for rowspan. should reserve colspan/_hmerge
                arrTabRows.forEach(function (cells, rIdx) {
                    var nextRow = arrTabRows[rIdx + 1];
                    if (!nextRow)
                        return;
                    cells.forEach(function (cell, cIdx) {
                        var _a, _b;
                        var rowspan = cell._rowContinue || ((_a = cell.options) === null || _a === void 0 ? void 0 : _a.rowspan);
                        var colspan = (_b = cell.options) === null || _b === void 0 ? void 0 : _b.colspan;
                        var _hmerge = cell._hmerge;
                        if (rowspan && rowspan > 1) {
                            var hMergeCell = { _type: SLIDE_OBJECT_TYPES.tablecell, options: { colspan: colspan }, _rowContinue: rowspan - 1, _vmerge: true, _hmerge: _hmerge };
                            nextRow.splice(cIdx, 0, hMergeCell);
                        }
                    });
                });
                // STEP 4: Build table rows/cells
                arrTabRows.forEach(function (cells, rIdx) {
                    // A: Table Height provided without rowH? Then distribute rows
                    var intRowH = 0; // IMPORTANT: Default must be zero for auto-sizing to work
                    if (Array.isArray(objTabOpts.rowH) && objTabOpts.rowH[rIdx])
                        intRowH = inch2Emu(Number(objTabOpts.rowH[rIdx]));
                    else if (objTabOpts.rowH && !isNaN(Number(objTabOpts.rowH)))
                        intRowH = inch2Emu(Number(objTabOpts.rowH));
                    else if (slideItemObj.options.cy || slideItemObj.options.h) {
                        intRowH = Math.round((slideItemObj.options.h ? inch2Emu(slideItemObj.options.h) : typeof slideItemObj.options.cy === 'number' ? slideItemObj.options.cy : 1) /
                            arrTabRows.length);
                    }
                    // B: Start row
                    strXml += "<a:tr h=\"".concat(intRowH, "\">");
                    // C: Loop over each CELL
                    cells.forEach(function (cellObj) {
                        var _a, _b, _c, _d, _e;
                        var cell = cellObj;
                        var cellSpanAttrs = {
                            rowSpan: ((_a = cell.options) === null || _a === void 0 ? void 0 : _a.rowspan) > 1 ? cell.options.rowspan : undefined,
                            gridSpan: ((_b = cell.options) === null || _b === void 0 ? void 0 : _b.colspan) > 1 ? cell.options.colspan : undefined,
                            vMerge: cell._vmerge ? 1 : undefined,
                            hMerge: cell._hmerge ? 1 : undefined,
                        };
                        var cellSpanAttrStr = Object.keys(cellSpanAttrs)
                            .map(function (k) { return [k, cellSpanAttrs[k]]; })
                            .filter(function (_a) {
                            _a[0]; var v = _a[1];
                            return !!v;
                        })
                            .map(function (_a) {
                            var k = _a[0], v = _a[1];
                            return "".concat(String(k), "=\"").concat(String(v), "\"");
                        })
                            .join(' ');
                        if (cellSpanAttrStr)
                            cellSpanAttrStr = ' ' + cellSpanAttrStr;
                        // 1: COLSPAN/ROWSPAN: Add dummy cells for any active colspan/rowspan
                        if (cell._hmerge || cell._vmerge) {
                            strXml += "<a:tc".concat(cellSpanAttrStr, "><a:tcPr/></a:tc>");
                            return;
                        }
                        // 2: OPTIONS: Build/set cell options
                        var cellOpts = cell.options || {};
                        cell.options = cellOpts;
                        ['align', 'bold', 'border', 'color', 'fill', 'fontFace', 'fontSize', 'margin', 'underline', 'valign'].forEach(function (name) {
                            if (objTabOpts[name] && !cellOpts[name] && cellOpts[name] !== 0)
                                cellOpts[name] = objTabOpts[name];
                        });
                        var cellValign = cellOpts.valign
                            ? " anchor=\"".concat(cellOpts.valign.replace(/^c$/i, 'ctr').replace(/^m$/i, 'ctr').replace('center', 'ctr').replace('middle', 'ctr').replace('top', 't').replace('btm', 'b').replace('bottom', 'b'), "\"")
                            : '';
                        var fillColor = ((_d = (_c = cell._optImp) === null || _c === void 0 ? void 0 : _c.fill) === null || _d === void 0 ? void 0 : _d.color)
                            ? cell._optImp.fill.color
                            : ((_e = cell._optImp) === null || _e === void 0 ? void 0 : _e.fill) && typeof cell._optImp.fill === 'string'
                                ? cell._optImp.fill
                                : '';
                        fillColor = fillColor || cellOpts.fill ? cellOpts.fill : '';
                        var cellFill = fillColor ? genXmlColorSelection(fillColor) : '';
                        var cellMargin = cellOpts.margin === 0 || cellOpts.margin ? cellOpts.margin : DEF_CELL_MARGIN_IN;
                        if (!Array.isArray(cellMargin) && typeof cellMargin === 'number')
                            cellMargin = [cellMargin, cellMargin, cellMargin, cellMargin];
                        /** FUTURE: DEPRECATED:
                         * - Backwards-Compat: Oops! Discovered we were still using points for cell margin before v3.8.0 (UGH!)
                         * - We cant introduce a breaking change before v4.0, so...
                         */
                        var cellMarginXml = '';
                        if (cellMargin[0] >= 1) {
                            cellMarginXml = " marL=\"".concat(valToPts(cellMargin[3]), "\" marR=\"").concat(valToPts(cellMargin[1]), "\" marT=\"").concat(valToPts(cellMargin[0]), "\" marB=\"").concat(valToPts(cellMargin[2]), "\"");
                        }
                        else {
                            cellMarginXml = " marL=\"".concat(inch2Emu(cellMargin[3]), "\" marR=\"").concat(inch2Emu(cellMargin[1]), "\" marT=\"").concat(inch2Emu(cellMargin[0]), "\" marB=\"").concat(inch2Emu(cellMargin[2]), "\"");
                        }
                        // FUTURE: Cell NOWRAP property (textwrap: add to a:tcPr (horzOverflow="overflow" or whatever options exist)
                        // 4: Set CELL content and properties ==================================
                        strXml += "<a:tc".concat(cellSpanAttrStr, ">").concat(genXmlTextBody(cell), "<a:tcPr").concat(cellMarginXml).concat(cellValign, ">");
                        // strXml += `<a:tc${cellColspan}${cellRowspan}>${genXmlTextBody(cell)}<a:tcPr${cellMarginXml}${cellValign}${cellTextDir}>`
                        // FIXME: 20200525: ^^^
                        // <a:tcPr marL="38100" marR="38100" marT="38100" marB="38100" vert="vert270">
                        // 5: Borders: Add any borders
                        if (cellOpts.border && Array.isArray(cellOpts.border)) {
                            // NOTE: *** IMPORTANT! *** LRTB order matters! (Reorder a line below to watch the borders go wonky in MS-PPT-2013!!)
                            [
                                { idx: 3, name: 'lnL' },
                                { idx: 1, name: 'lnR' },
                                { idx: 0, name: 'lnT' },
                                { idx: 2, name: 'lnB' },
                            ].forEach(function (obj) {
                                if (cellOpts.border[obj.idx].type !== 'none') {
                                    strXml += "<a:".concat(obj.name, " w=\"").concat(valToPts(cellOpts.border[obj.idx].pt), "\" cap=\"flat\" cmpd=\"sng\" algn=\"ctr\">");
                                    strXml += "<a:solidFill>".concat(createColorElement(cellOpts.border[obj.idx].color), "</a:solidFill>");
                                    strXml += "<a:prstDash val=\"".concat(cellOpts.border[obj.idx].type === 'dash' ? 'sysDash' : 'solid', "\"/><a:round/><a:headEnd type=\"none\" w=\"med\" len=\"med\"/><a:tailEnd type=\"none\" w=\"med\" len=\"med\"/>");
                                    strXml += "</a:".concat(obj.name, ">");
                                }
                                else {
                                    strXml += "<a:".concat(obj.name, " w=\"0\" cap=\"flat\" cmpd=\"sng\" algn=\"ctr\"><a:noFill/></a:").concat(obj.name, ">");
                                }
                            });
                        }
                        // 6: Close cell Properties & Cell
                        strXml += cellFill;
                        strXml += '  </a:tcPr>';
                        strXml += ' </a:tc>';
                    });
                    // D: Complete row
                    strXml += '</a:tr>';
                });
                // STEP 5: Complete table
                strXml += '      </a:tbl>';
                strXml += '    </a:graphicData>';
                strXml += '  </a:graphic>';
                strXml += '</p:graphicFrame>';
                // STEP 6: Set table XML
                strSlideXml += strXml;
                // LAST: Increment counter
                intTableNum++;
                break;
            case SLIDE_OBJECT_TYPES.text:
            case SLIDE_OBJECT_TYPES.placeholder:
                // Lines can have zero cy, but text should not
                if (!slideItemObj.options.line && cy === 0)
                    cy = EMU * 0.3;
                // Margin/Padding/Inset for textboxes
                if (!slideItemObj.options._bodyProp)
                    slideItemObj.options._bodyProp = {};
                if (slideItemObj.options.margin && Array.isArray(slideItemObj.options.margin)) {
                    slideItemObj.options._bodyProp.lIns = valToPts(slideItemObj.options.margin[0] || 0);
                    slideItemObj.options._bodyProp.rIns = valToPts(slideItemObj.options.margin[1] || 0);
                    slideItemObj.options._bodyProp.bIns = valToPts(slideItemObj.options.margin[2] || 0);
                    slideItemObj.options._bodyProp.tIns = valToPts(slideItemObj.options.margin[3] || 0);
                }
                else if (typeof slideItemObj.options.margin === 'number') {
                    slideItemObj.options._bodyProp.lIns = valToPts(slideItemObj.options.margin);
                    slideItemObj.options._bodyProp.rIns = valToPts(slideItemObj.options.margin);
                    slideItemObj.options._bodyProp.bIns = valToPts(slideItemObj.options.margin);
                    slideItemObj.options._bodyProp.tIns = valToPts(slideItemObj.options.margin);
                }
                // A: Start SHAPE =======================================================
                strSlideXml += '<p:sp>';
                // B: The addition of the "txBox" attribute is the sole determiner of if an object is a shape or textbox
                strSlideXml += "<p:nvSpPr><p:cNvPr id=\"".concat(idx + 2, "\" name=\"").concat(slideItemObj.options.objectName, "\">");
                // <Hyperlink>
                if ((_c = slideItemObj.options.hyperlink) === null || _c === void 0 ? void 0 : _c.url) {
                    strSlideXml += "<a:hlinkClick r:id=\"rId".concat(slideItemObj.options.hyperlink._rId, "\" tooltip=\"").concat(slideItemObj.options.hyperlink.tooltip ? encodeXmlEntities(slideItemObj.options.hyperlink.tooltip) : '', "\"/>");
                }
                if ((_d = slideItemObj.options.hyperlink) === null || _d === void 0 ? void 0 : _d.slide) {
                    strSlideXml += "<a:hlinkClick r:id=\"rId".concat(slideItemObj.options.hyperlink._rId, "\" tooltip=\"").concat(slideItemObj.options.hyperlink.tooltip ? encodeXmlEntities(slideItemObj.options.hyperlink.tooltip) : '', "\" action=\"ppaction://hlinksldjump\"/>");
                }
                // </Hyperlink>
                strSlideXml += '</p:cNvPr>';
                strSlideXml += '<p:cNvSpPr' + (((_e = slideItemObj.options) === null || _e === void 0 ? void 0 : _e.isTextBox) ? ' txBox="1"/>' : '/>');
                strSlideXml += "<p:nvPr>".concat(slideItemObj._type === 'placeholder' ? genXmlPlaceholder(slideItemObj) : genXmlPlaceholder(placeholderObj), "</p:nvPr>");
                strSlideXml += '</p:nvSpPr><p:spPr>';
                strSlideXml += "<a:xfrm".concat(locationAttr, ">");
                strSlideXml += "<a:off x=\"".concat(x, "\" y=\"").concat(y, "\"/>");
                strSlideXml += "<a:ext cx=\"".concat(cx, "\" cy=\"").concat(cy, "\"/></a:xfrm>");
                if (slideItemObj.shape === 'custGeom') {
                    strSlideXml += '<a:custGeom><a:avLst />';
                    strSlideXml += '<a:gdLst>';
                    strSlideXml += '</a:gdLst>';
                    strSlideXml += '<a:ahLst />';
                    strSlideXml += '<a:cxnLst>';
                    strSlideXml += '</a:cxnLst>';
                    strSlideXml += '<a:rect l="l" t="t" r="r" b="b" />';
                    strSlideXml += '<a:pathLst>';
                    strSlideXml += "<a:path w=\"".concat(cx, "\" h=\"").concat(cy, "\">");
                    (_f = slideItemObj.options.points) === null || _f === void 0 ? void 0 : _f.forEach(function (point, i) {
                        if ('curve' in point) {
                            switch (point.curve.type) {
                                case 'arc':
                                    strSlideXml += "<a:arcTo hR=\"".concat(getSmartParseNumber(point.curve.hR, 'Y', slide._presLayout), "\" wR=\"").concat(getSmartParseNumber(point.curve.wR, 'X', slide._presLayout), "\" stAng=\"").concat(convertRotationDegrees(point.curve.stAng), "\" swAng=\"").concat(convertRotationDegrees(point.curve.swAng), "\" />");
                                    break;
                                case 'cubic':
                                    strSlideXml += "<a:cubicBezTo>\n\t\t\t\t\t\t\t\t\t<a:pt x=\"".concat(getSmartParseNumber(point.curve.x1, 'X', slide._presLayout), "\" y=\"").concat(getSmartParseNumber(point.curve.y1, 'Y', slide._presLayout), "\" />\n\t\t\t\t\t\t\t\t\t<a:pt x=\"").concat(getSmartParseNumber(point.curve.x2, 'X', slide._presLayout), "\" y=\"").concat(getSmartParseNumber(point.curve.y2, 'Y', slide._presLayout), "\" />\n\t\t\t\t\t\t\t\t\t<a:pt x=\"").concat(getSmartParseNumber(point.x, 'X', slide._presLayout), "\" y=\"").concat(getSmartParseNumber(point.y, 'Y', slide._presLayout), "\" />\n\t\t\t\t\t\t\t\t\t</a:cubicBezTo>");
                                    break;
                                case 'quadratic':
                                    strSlideXml += "<a:quadBezTo>\n\t\t\t\t\t\t\t\t\t<a:pt x=\"".concat(getSmartParseNumber(point.curve.x1, 'X', slide._presLayout), "\" y=\"").concat(getSmartParseNumber(point.curve.y1, 'Y', slide._presLayout), "\" />\n\t\t\t\t\t\t\t\t\t<a:pt x=\"").concat(getSmartParseNumber(point.x, 'X', slide._presLayout), "\" y=\"").concat(getSmartParseNumber(point.y, 'Y', slide._presLayout), "\" />\n\t\t\t\t\t\t\t\t\t</a:quadBezTo>");
                                    break;
                            }
                        }
                        else if ('close' in point) {
                            strSlideXml += '<a:close />';
                        }
                        else if (point.moveTo || i === 0) {
                            strSlideXml += "<a:moveTo><a:pt x=\"".concat(getSmartParseNumber(point.x, 'X', slide._presLayout), "\" y=\"").concat(getSmartParseNumber(point.y, 'Y', slide._presLayout), "\" /></a:moveTo>");
                        }
                        else {
                            strSlideXml += "<a:lnTo><a:pt x=\"".concat(getSmartParseNumber(point.x, 'X', slide._presLayout), "\" y=\"").concat(getSmartParseNumber(point.y, 'Y', slide._presLayout), "\" /></a:lnTo>");
                        }
                    });
                    strSlideXml += '</a:path>';
                    strSlideXml += '</a:pathLst>';
                    strSlideXml += '</a:custGeom>';
                }
                else {
                    strSlideXml += '<a:prstGeom prst="' + slideItemObj.shape + '"><a:avLst>';
                    if (slideItemObj.options.rectRadius) {
                        strSlideXml += "<a:gd name=\"adj\" fmla=\"val ".concat(Math.round((slideItemObj.options.rectRadius * EMU * 100000) / Math.min(cx, cy)), "\"/>");
                    }
                    else if (slideItemObj.options.angleRange) {
                        for (var i = 0; i < 2; i++) {
                            var angle = slideItemObj.options.angleRange[i];
                            strSlideXml += "<a:gd name=\"adj".concat(i + 1, "\" fmla=\"val ").concat(convertRotationDegrees(angle), "\" />");
                        }
                        if (slideItemObj.options.arcThicknessRatio) {
                            strSlideXml += "<a:gd name=\"adj3\" fmla=\"val ".concat(Math.round(slideItemObj.options.arcThicknessRatio * 50000), "\" />");
                        }
                    }
                    strSlideXml += '</a:avLst></a:prstGeom>';
                }
                // Option: FILL
                strSlideXml += slideItemObj.options.fill ? genXmlColorSelection(slideItemObj.options.fill) : '<a:noFill/>';
                // shape Type: LINE: line color
                if (slideItemObj.options.line) {
                    strSlideXml += slideItemObj.options.line.width ? "<a:ln w=\"".concat(valToPts(slideItemObj.options.line.width), "\">") : '<a:ln>';
                    if (slideItemObj.options.line.color)
                        strSlideXml += genXmlColorSelection(slideItemObj.options.line);
                    if (slideItemObj.options.line.dashType)
                        strSlideXml += "<a:prstDash val=\"".concat(slideItemObj.options.line.dashType, "\"/>");
                    if (slideItemObj.options.line.beginArrowType)
                        strSlideXml += "<a:headEnd type=\"".concat(slideItemObj.options.line.beginArrowType, "\"/>");
                    if (slideItemObj.options.line.endArrowType)
                        strSlideXml += "<a:tailEnd type=\"".concat(slideItemObj.options.line.endArrowType, "\"/>");
                    // FUTURE: `endArrowSize` < a: headEnd type = "arrow" w = "lg" len = "lg" /> 'sm' | 'med' | 'lg'(values are 1 - 9, making a 3x3 grid of w / len possibilities)
                    strSlideXml += '</a:ln>';
                }
                // EFFECTS > SHADOW: REF: @see http://officeopenxml.com/drwSp-effects.php
                if (slideItemObj.options.shadow && slideItemObj.options.shadow.type !== 'none') {
                    slideItemObj.options.shadow.type = slideItemObj.options.shadow.type || 'outer';
                    slideItemObj.options.shadow.blur = valToPts(slideItemObj.options.shadow.blur || 8);
                    slideItemObj.options.shadow.offset = valToPts(slideItemObj.options.shadow.offset || 4);
                    slideItemObj.options.shadow.angle = Math.round((slideItemObj.options.shadow.angle || 270) * 60000);
                    slideItemObj.options.shadow.opacity = Math.round((slideItemObj.options.shadow.opacity || 0.75) * 100000);
                    slideItemObj.options.shadow.color = slideItemObj.options.shadow.color || DEF_TEXT_SHADOW.color;
                    strSlideXml += '<a:effectLst>';
                    strSlideXml += " <a:".concat(slideItemObj.options.shadow.type, "Shdw ").concat(slideItemObj.options.shadow.type === 'outer' ? 'sx="100000" sy="100000" kx="0" ky="0" algn="bl" rotWithShape="0"' : '', " blurRad=\"").concat(slideItemObj.options.shadow.blur, "\" dist=\"").concat(slideItemObj.options.shadow.offset, "\" dir=\"").concat(slideItemObj.options.shadow.angle, "\">");
                    strSlideXml += " <a:srgbClr val=\"".concat(slideItemObj.options.shadow.color, "\">");
                    strSlideXml += " <a:alpha val=\"".concat(slideItemObj.options.shadow.opacity, "\"/></a:srgbClr>");
                    strSlideXml += ' </a:outerShdw>';
                    strSlideXml += '</a:effectLst>';
                }
                /* TODO: FUTURE: Text wrapping (copied from MS-PPTX export)
                    // Commented out b/c i'm not even sure this works - current code produces text that wraps in shapes and textboxes, so...
                    if ( slideItemObj.options.textWrap ) {
                        strSlideXml += '<a:extLst>'
                                    + '<a:ext uri="{C572A759-6A51-4108-AA02-DFA0A04FC94B}">'
                                    + '<ma14:wrappingTextBoxFlag xmlns:ma14="http://schemas.microsoft.com/office/mac/drawingml/2011/main" val="1"/>'
                                    + '</a:ext>'
                                    + '</a:extLst>';
                    }
                */
                // B: Close shape Properties
                strSlideXml += '</p:spPr>';
                // C: Add formatted text (text body "bodyPr")
                strSlideXml += genXmlTextBody(slideItemObj);
                // LAST: Close SHAPE =======================================================
                strSlideXml += '</p:sp>';
                break;
            case SLIDE_OBJECT_TYPES.image:
                strSlideXml += '<p:pic>';
                strSlideXml += '  <p:nvPicPr>';
                strSlideXml += "<p:cNvPr id=\"".concat(idx + 2, "\" name=\"").concat(slideItemObj.options.objectName, "\" descr=\"").concat(encodeXmlEntities(slideItemObj.options.altText || slideItemObj.image), "\">");
                if ((_g = slideItemObj.hyperlink) === null || _g === void 0 ? void 0 : _g.url) {
                    strSlideXml += "<a:hlinkClick r:id=\"rId".concat(slideItemObj.hyperlink._rId, "\" tooltip=\"").concat(slideItemObj.hyperlink.tooltip ? encodeXmlEntities(slideItemObj.hyperlink.tooltip) : '', "\"/>");
                }
                if ((_h = slideItemObj.hyperlink) === null || _h === void 0 ? void 0 : _h.slide) {
                    strSlideXml += "<a:hlinkClick r:id=\"rId".concat(slideItemObj.hyperlink._rId, "\" tooltip=\"").concat(slideItemObj.hyperlink.tooltip ? encodeXmlEntities(slideItemObj.hyperlink.tooltip) : '', "\" action=\"ppaction://hlinksldjump\"/>");
                }
                strSlideXml += '    </p:cNvPr>';
                strSlideXml += '    <p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr>';
                strSlideXml += '    <p:nvPr>' + genXmlPlaceholder(placeholderObj) + '</p:nvPr>';
                strSlideXml += '  </p:nvPicPr>';
                strSlideXml += '<p:blipFill>';
                // NOTE: This works for both cases: either `path` or `data` contains the SVG
                if ((slide._relsMedia || []).filter(function (rel) { return rel.rId === slideItemObj.imageRid; })[0] &&
                    (slide._relsMedia || []).filter(function (rel) { return rel.rId === slideItemObj.imageRid; })[0].extn === 'svg') {
                    strSlideXml += "<a:blip r:embed=\"rId".concat(slideItemObj.imageRid - 1, "\">");
                    strSlideXml += slideItemObj.options.transparency ? " <a:alphaModFix amt=\"".concat(Math.round((100 - slideItemObj.options.transparency) * 1000), "\"/>") : '';
                    strSlideXml += ' <a:extLst>';
                    strSlideXml += '  <a:ext uri="{96DAC541-7B7A-43D3-8B79-37D633B846F1}">';
                    strSlideXml += "   <asvg:svgBlip xmlns:asvg=\"http://schemas.microsoft.com/office/drawing/2016/SVG/main\" r:embed=\"rId".concat(slideItemObj.imageRid, "\"/>");
                    strSlideXml += '  </a:ext>';
                    strSlideXml += ' </a:extLst>';
                    strSlideXml += '</a:blip>';
                }
                else {
                    strSlideXml += "<a:blip r:embed=\"rId".concat(slideItemObj.imageRid, "\">");
                    strSlideXml += slideItemObj.options.transparency ? "<a:alphaModFix amt=\"".concat(Math.round((100 - slideItemObj.options.transparency) * 1000), "\"/>") : '';
                    strSlideXml += '</a:blip>';
                }
                if (sizing === null || sizing === void 0 ? void 0 : sizing.type) {
                    var boxW = sizing.w ? getSmartParseNumber(sizing.w, 'X', slide._presLayout) : cx;
                    var boxH = sizing.h ? getSmartParseNumber(sizing.h, 'Y', slide._presLayout) : cy;
                    var boxX = getSmartParseNumber(sizing.x || 0, 'X', slide._presLayout);
                    var boxY = getSmartParseNumber(sizing.y || 0, 'Y', slide._presLayout);
                    strSlideXml += ImageSizingXml[sizing.type]({ w: imgWidth, h: imgHeight }, { w: boxW, h: boxH, x: boxX, y: boxY });
                    imgWidth = boxW;
                    imgHeight = boxH;
                }
                else {
                    strSlideXml += '  <a:stretch><a:fillRect/></a:stretch>';
                }
                strSlideXml += '</p:blipFill>';
                strSlideXml += '<p:spPr>';
                strSlideXml += ' <a:xfrm' + locationAttr + '>';
                strSlideXml += "  <a:off x=\"".concat(x, "\" y=\"").concat(y, "\"/>");
                strSlideXml += "  <a:ext cx=\"".concat(imgWidth, "\" cy=\"").concat(imgHeight, "\"/>");
                strSlideXml += ' </a:xfrm>';
                strSlideXml += " <a:prstGeom prst=\"".concat(rounding ? 'ellipse' : 'rect', "\"><a:avLst/></a:prstGeom>");
                // EFFECTS > SHADOW: REF: @see http://officeopenxml.com/drwSp-effects.php
                if (slideItemObj.options.shadow && slideItemObj.options.shadow.type !== 'none') {
                    slideItemObj.options.shadow.type = slideItemObj.options.shadow.type || 'outer';
                    slideItemObj.options.shadow.blur = valToPts(slideItemObj.options.shadow.blur || 8);
                    slideItemObj.options.shadow.offset = valToPts(slideItemObj.options.shadow.offset || 4);
                    slideItemObj.options.shadow.angle = Math.round((slideItemObj.options.shadow.angle || 270) * 60000);
                    slideItemObj.options.shadow.opacity = Math.round((slideItemObj.options.shadow.opacity || 0.75) * 100000);
                    slideItemObj.options.shadow.color = slideItemObj.options.shadow.color || DEF_TEXT_SHADOW.color;
                    strSlideXml += '<a:effectLst>';
                    strSlideXml += "<a:".concat(slideItemObj.options.shadow.type, "Shdw ").concat(slideItemObj.options.shadow.type === 'outer' ? 'sx="100000" sy="100000" kx="0" ky="0" algn="bl" rotWithShape="0"' : '', " blurRad=\"").concat(slideItemObj.options.shadow.blur, "\" dist=\"").concat(slideItemObj.options.shadow.offset, "\" dir=\"").concat(slideItemObj.options.shadow.angle, "\">");
                    strSlideXml += "<a:srgbClr val=\"".concat(slideItemObj.options.shadow.color, "\">");
                    strSlideXml += "<a:alpha val=\"".concat(slideItemObj.options.shadow.opacity, "\"/></a:srgbClr>");
                    strSlideXml += "</a:".concat(slideItemObj.options.shadow.type, "Shdw>");
                    strSlideXml += '</a:effectLst>';
                }
                strSlideXml += '</p:spPr>';
                strSlideXml += '</p:pic>';
                break;
            case SLIDE_OBJECT_TYPES.media:
                if (slideItemObj.mtype === 'online') {
                    strSlideXml += '<p:pic>';
                    strSlideXml += ' <p:nvPicPr>';
                    // IMPORTANT: <p:cNvPr id="" value is critical - if its not the same number as preview image `rId`, PowerPoint throws error!
                    strSlideXml += "<p:cNvPr id=\"".concat(slideItemObj.mediaRid + 2, "\" name=\"").concat(slideItemObj.options.objectName, "\"/>");
                    strSlideXml += ' <p:cNvPicPr/>';
                    strSlideXml += ' <p:nvPr>';
                    strSlideXml += "  <a:videoFile r:link=\"rId".concat(slideItemObj.mediaRid, "\"/>");
                    strSlideXml += ' </p:nvPr>';
                    strSlideXml += ' </p:nvPicPr>';
                    // NOTE: `blip` is diferent than videos; also there's no preview "p:extLst" above but exists in videos
                    strSlideXml += " <p:blipFill><a:blip r:embed=\"rId".concat(slideItemObj.mediaRid + 1, "\"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>"); // NOTE: Preview image is required!
                    strSlideXml += ' <p:spPr>';
                    strSlideXml += "  <a:xfrm".concat(locationAttr, "><a:off x=\"").concat(x, "\" y=\"").concat(y, "\"/><a:ext cx=\"").concat(cx, "\" cy=\"").concat(cy, "\"/></a:xfrm>");
                    strSlideXml += '  <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>';
                    strSlideXml += ' </p:spPr>';
                    strSlideXml += '</p:pic>';
                }
                else {
                    strSlideXml += '<p:pic>';
                    strSlideXml += ' <p:nvPicPr>';
                    // IMPORTANT: <p:cNvPr id="" value is critical - if not the same number as preiew image rId, PowerPoint throws error!
                    strSlideXml += "<p:cNvPr id=\"".concat(slideItemObj.mediaRid + 2, "\" name=\"").concat(slideItemObj.options.objectName, "\"><a:hlinkClick r:id=\"\" action=\"ppaction://media\"/></p:cNvPr>");
                    strSlideXml += ' <p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr>';
                    strSlideXml += ' <p:nvPr>';
                    strSlideXml += "  <a:videoFile r:link=\"rId".concat(slideItemObj.mediaRid, "\"/>");
                    strSlideXml += '  <p:extLst>';
                    strSlideXml += '   <p:ext uri="{DAA4B4D4-6D71-4841-9C94-3DE7FCFB9230}">';
                    strSlideXml += "    <p14:media xmlns:p14=\"http://schemas.microsoft.com/office/powerpoint/2010/main\" r:embed=\"rId".concat(slideItemObj.mediaRid + 1, "\"/>");
                    strSlideXml += '   </p:ext>';
                    strSlideXml += '  </p:extLst>';
                    strSlideXml += ' </p:nvPr>';
                    strSlideXml += ' </p:nvPicPr>';
                    strSlideXml += " <p:blipFill><a:blip r:embed=\"rId".concat(slideItemObj.mediaRid + 2, "\"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>"); // NOTE: Preview image is required!
                    strSlideXml += ' <p:spPr>';
                    strSlideXml += "  <a:xfrm".concat(locationAttr, "><a:off x=\"").concat(x, "\" y=\"").concat(y, "\"/><a:ext cx=\"").concat(cx, "\" cy=\"").concat(cy, "\"/></a:xfrm>");
                    strSlideXml += '  <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>';
                    strSlideXml += ' </p:spPr>';
                    strSlideXml += '</p:pic>';
                }
                break;
            case SLIDE_OBJECT_TYPES.chart:
                strSlideXml += '<p:graphicFrame>';
                strSlideXml += ' <p:nvGraphicFramePr>';
                strSlideXml += "   <p:cNvPr id=\"".concat(idx + 2, "\" name=\"").concat(slideItemObj.options.objectName, "\" descr=\"").concat(encodeXmlEntities(slideItemObj.options.altText || ''), "\"/>");
                strSlideXml += '   <p:cNvGraphicFramePr/>';
                strSlideXml += "   <p:nvPr>".concat(genXmlPlaceholder(placeholderObj), "</p:nvPr>");
                strSlideXml += ' </p:nvGraphicFramePr>';
                strSlideXml += " <p:xfrm><a:off x=\"".concat(x, "\" y=\"").concat(y, "\"/><a:ext cx=\"").concat(cx, "\" cy=\"").concat(cy, "\"/></p:xfrm>");
                strSlideXml += ' <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">';
                strSlideXml += '  <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">';
                strSlideXml += "   <c:chart r:id=\"rId".concat(slideItemObj.chartRid, "\" xmlns:c=\"http://schemas.openxmlformats.org/drawingml/2006/chart\"/>");
                strSlideXml += '  </a:graphicData>';
                strSlideXml += ' </a:graphic>';
                strSlideXml += '</p:graphicFrame>';
                break;
            default:
                strSlideXml += '';
                break;
        }
    });
    // STEP 4: Add slide numbers (if any) last
    if (slide._slideNumberProps) {
        // Set some defaults (done here b/c SlideNumber canbe added to masters or slides and has numerous entry points)
        if (!slide._slideNumberProps.align)
            slide._slideNumberProps.align = 'left';
        strSlideXml += '<p:sp>';
        strSlideXml += ' <p:nvSpPr>';
        strSlideXml += '  <p:cNvPr id="25" name="Slide Number Placeholder 0"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>';
        strSlideXml += '  <p:nvPr><p:ph type="sldNum" sz="quarter" idx="4294967295"/></p:nvPr>';
        strSlideXml += ' </p:nvSpPr>';
        strSlideXml += ' <p:spPr>';
        strSlideXml += '<a:xfrm>' +
            "<a:off x=\"".concat(getSmartParseNumber(slide._slideNumberProps.x, 'X', slide._presLayout), "\" y=\"").concat(getSmartParseNumber(slide._slideNumberProps.y, 'Y', slide._presLayout), "\"/>") +
            "<a:ext cx=\"".concat(slide._slideNumberProps.w ? getSmartParseNumber(slide._slideNumberProps.w, 'X', slide._presLayout) : '800000', "\" cy=\"").concat(slide._slideNumberProps.h ? getSmartParseNumber(slide._slideNumberProps.h, 'Y', slide._presLayout) : '300000', "\"/>") +
            '</a:xfrm>' +
            ' <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>' +
            ' <a:extLst><a:ext uri="{C572A759-6A51-4108-AA02-DFA0A04FC94B}"><ma14:wrappingTextBoxFlag val="0" xmlns:ma14="http://schemas.microsoft.com/office/mac/drawingml/2011/main"/></a:ext></a:extLst>' +
            '</p:spPr>';
        strSlideXml += '<p:txBody>';
        strSlideXml += '<a:bodyPr';
        if (slide._slideNumberProps.margin && Array.isArray(slide._slideNumberProps.margin)) {
            strSlideXml += " lIns=\"".concat(valToPts(slide._slideNumberProps.margin[3] || 0), "\"");
            strSlideXml += " tIns=\"".concat(valToPts(slide._slideNumberProps.margin[0] || 0), "\"");
            strSlideXml += " rIns=\"".concat(valToPts(slide._slideNumberProps.margin[1] || 0), "\"");
            strSlideXml += " bIns=\"".concat(valToPts(slide._slideNumberProps.margin[2] || 0), "\"");
        }
        else if (typeof slide._slideNumberProps.margin === 'number') {
            strSlideXml += " lIns=\"".concat(valToPts(slide._slideNumberProps.margin || 0), "\"");
            strSlideXml += " tIns=\"".concat(valToPts(slide._slideNumberProps.margin || 0), "\"");
            strSlideXml += " rIns=\"".concat(valToPts(slide._slideNumberProps.margin || 0), "\"");
            strSlideXml += " bIns=\"".concat(valToPts(slide._slideNumberProps.margin || 0), "\"");
        }
        if (slide._slideNumberProps.valign) {
            strSlideXml += " anchor=\"".concat(slide._slideNumberProps.valign.replace('top', 't').replace('middle', 'ctr').replace('bottom', 'b'), "\"");
        }
        strSlideXml += '/>';
        strSlideXml += '  <a:lstStyle><a:lvl1pPr>';
        if (slide._slideNumberProps.fontFace || slide._slideNumberProps.fontSize || slide._slideNumberProps.color) {
            strSlideXml += "<a:defRPr sz=\"".concat(Math.round((slide._slideNumberProps.fontSize || 12) * 100), "\">");
            if (slide._slideNumberProps.color)
                strSlideXml += genXmlColorSelection(slide._slideNumberProps.color);
            if (slide._slideNumberProps.fontFace) {
                strSlideXml += "<a:latin typeface=\"".concat(slide._slideNumberProps.fontFace, "\"/><a:ea typeface=\"").concat(slide._slideNumberProps.fontFace, "\"/><a:cs typeface=\"").concat(slide._slideNumberProps.fontFace, "\"/>");
            }
            strSlideXml += '</a:defRPr>';
        }
        strSlideXml += '</a:lvl1pPr></a:lstStyle>';
        strSlideXml += '<a:p>';
        if (slide._slideNumberProps.align.startsWith('l'))
            strSlideXml += '<a:pPr algn="l"/>';
        else if (slide._slideNumberProps.align.startsWith('c'))
            strSlideXml += '<a:pPr algn="ctr"/>';
        else if (slide._slideNumberProps.align.startsWith('r'))
            strSlideXml += '<a:pPr algn="r"/>';
        else
            strSlideXml += '<a:pPr algn="l"/>';
        strSlideXml += "<a:fld id=\"".concat(SLDNUMFLDID, "\" type=\"slidenum\"><a:rPr b=\"").concat(slide._slideNumberProps.bold ? 1 : 0, "\" lang=\"en-US\"/>");
        strSlideXml += "<a:t>".concat(slide._slideNum, "</a:t></a:fld><a:endParaRPr lang=\"en-US\"/></a:p>");
        strSlideXml += '</p:txBody></p:sp>';
    }
    // STEP 5: Close spTree and finalize slide XML
    strSlideXml += '</p:spTree>';
    strSlideXml += '</p:cSld>';
    // LAST: Return
    return strSlideXml;
}
/**
 * Transforms slide relations to XML string.
 * Extra relations that are not dynamic can be passed using the 2nd arg (e.g. theme relation in master file).
 * These relations use rId series that starts with 1-increased maximum of rIds used for dynamic relations.
 * @param {PresSlide | SlideLayout} slide - slide object whose relations are being transformed
 * @param {{ target: string; type: string }[]} defaultRels - array of default relations
 * @return {string} XML
 */
function slideObjectRelationsToXml(slide, defaultRels) {
    var lastRid = 0; // stores maximum rId used for dynamic relations
    var strXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + CRLF + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
    // STEP 1: Add all rels for this Slide
    slide._rels.forEach(function (rel) {
        lastRid = Math.max(lastRid, rel.rId);
        if (rel.type.toLowerCase().includes('hyperlink')) {
            if (rel.data === 'slide') {
                strXml += "<Relationship Id=\"rId".concat(rel.rId, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide\" Target=\"slide").concat(rel.Target, ".xml\"/>");
            }
            else {
                strXml += "<Relationship Id=\"rId".concat(rel.rId, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink\" Target=\"").concat(rel.Target, "\" TargetMode=\"External\"/>");
            }
        }
        else if (rel.type.toLowerCase().includes('notesSlide')) {
            strXml += "<Relationship Id=\"rId".concat(rel.rId, "\" Target=\"").concat(rel.Target, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide\"/>");
        }
    });
    (slide._relsChart || []).forEach(function (rel) {
        lastRid = Math.max(lastRid, rel.rId);
        strXml += "<Relationship Id=\"rId".concat(rel.rId, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart\" Target=\"").concat(rel.Target, "\"/>");
    });
    (slide._relsMedia || []).forEach(function (rel) {
        var relRid = rel.rId.toString();
        lastRid = Math.max(lastRid, rel.rId);
        if (rel.type.toLowerCase().includes('image')) {
            strXml += '<Relationship Id="rId' + relRid + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="' + rel.Target + '"/>';
        }
        else if (rel.type.toLowerCase().includes('audio')) {
            // As media has *TWO* rel entries per item, check for first one, if found add second rel with alt style
            if (strXml.includes(' Target="' + rel.Target + '"')) {
                strXml += '<Relationship Id="rId' + relRid + '" Type="http://schemas.microsoft.com/office/2007/relationships/media" Target="' + rel.Target + '"/>';
            }
            else {
                strXml += '<Relationship Id="rId' + relRid + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/audio" Target="' + rel.Target + '"/>';
            }
        }
        else if (rel.type.toLowerCase().includes('video')) {
            // As media has *TWO* rel entries per item, check for first one, if found add second rel with alt style
            if (strXml.includes(' Target="' + rel.Target + '"')) {
                strXml += '<Relationship Id="rId' + relRid + '" Type="http://schemas.microsoft.com/office/2007/relationships/media" Target="' + rel.Target + '"/>';
            }
            else {
                strXml += '<Relationship Id="rId' + relRid + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/video" Target="' + rel.Target + '"/>';
            }
        }
        else if (rel.type.toLowerCase().includes('online')) {
            // As media has *TWO* rel entries per item, check for first one, if found add second rel with alt style
            if (strXml.includes(' Target="' + rel.Target + '"')) {
                strXml += '<Relationship Id="rId' + relRid + '" Type="http://schemas.microsoft.com/office/2007/relationships/image" Target="' + rel.Target + '"/>';
            }
            else {
                strXml += '<Relationship Id="rId' + relRid + '" Target="' + rel.Target + '" TargetMode="External" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/video"/>';
            }
        }
    });
    // STEP 2: Add default rels
    defaultRels.forEach(function (rel, idx) {
        strXml += "<Relationship Id=\"rId".concat(lastRid + idx + 1, "\" Type=\"").concat(rel.type, "\" Target=\"").concat(rel.target, "\"/>");
    });
    strXml += '</Relationships>';
    return strXml;
}
/**
 * Generate XML Paragraph Properties
 * @param {ISlideObject|TextProps} textObj - text object
 * @param {boolean} isDefault - array of default relations
 * @return {string} XML
 */
function genXmlParagraphProperties(textObj, isDefault) {
    var _a, _b;
    var strXmlBullet = '';
    var strXmlLnSpc = '';
    var strXmlParaSpc = '';
    var strXmlTabStops = '';
    var tag = isDefault ? 'a:lvl1pPr' : 'a:pPr';
    var bulletMarL = valToPts(DEF_BULLET_MARGIN);
    var paragraphPropXml = "<".concat(tag).concat(textObj.options.rtlMode ? ' rtl="1" ' : '');
    // A: Build paragraphProperties
    {
        // OPTION: align
        if (textObj.options.align) {
            switch (textObj.options.align) {
                case 'left':
                    paragraphPropXml += ' algn="l"';
                    break;
                case 'right':
                    paragraphPropXml += ' algn="r"';
                    break;
                case 'center':
                    paragraphPropXml += ' algn="ctr"';
                    break;
                case 'justify':
                    paragraphPropXml += ' algn="just"';
                    break;
                default:
                    paragraphPropXml += '';
                    break;
            }
        }
        if (textObj.options.lineSpacing) {
            strXmlLnSpc = "<a:lnSpc><a:spcPts val=\"".concat(Math.round(textObj.options.lineSpacing * 100), "\"/></a:lnSpc>");
        }
        else if (textObj.options.lineSpacingMultiple) {
            strXmlLnSpc = "<a:lnSpc><a:spcPct val=\"".concat(Math.round(textObj.options.lineSpacingMultiple * 100000), "\"/></a:lnSpc>");
        }
        // OPTION: indent
        if (textObj.options.indentLevel && !isNaN(Number(textObj.options.indentLevel)) && textObj.options.indentLevel > 0) {
            paragraphPropXml += " lvl=\"".concat(textObj.options.indentLevel, "\"");
        }
        // OPTION: Paragraph Spacing: Before/After
        if (textObj.options.paraSpaceBefore && !isNaN(Number(textObj.options.paraSpaceBefore)) && textObj.options.paraSpaceBefore > 0) {
            strXmlParaSpc += "<a:spcBef><a:spcPts val=\"".concat(Math.round(textObj.options.paraSpaceBefore * 100), "\"/></a:spcBef>");
        }
        if (textObj.options.paraSpaceAfter && !isNaN(Number(textObj.options.paraSpaceAfter)) && textObj.options.paraSpaceAfter > 0) {
            strXmlParaSpc += "<a:spcAft><a:spcPts val=\"".concat(Math.round(textObj.options.paraSpaceAfter * 100), "\"/></a:spcAft>");
        }
        // OPTION: bullet
        // NOTE: OOXML uses the unicode character set for Bullets
        // EX: Unicode Character 'BULLET' (U+2022) ==> '<a:buChar char="&#x2022;"/>'
        if (typeof textObj.options.bullet === 'object') {
            if ((_b = (_a = textObj === null || textObj === void 0 ? void 0 : textObj.options) === null || _a === void 0 ? void 0 : _a.bullet) === null || _b === void 0 ? void 0 : _b.indent)
                bulletMarL = valToPts(textObj.options.bullet.indent);
            if (textObj.options.bullet.type) {
                if (textObj.options.bullet.type.toString().toLowerCase() === 'number') {
                    paragraphPropXml += " marL=\"".concat(textObj.options.indentLevel && textObj.options.indentLevel > 0 ? bulletMarL + bulletMarL * textObj.options.indentLevel : bulletMarL, "\" indent=\"-").concat(bulletMarL, "\"");
                    strXmlBullet = "<a:buSzPct val=\"100000\"/><a:buFont typeface=\"+mj-lt\"/><a:buAutoNum type=\"".concat(textObj.options.bullet.style || 'arabicPeriod', "\" startAt=\"").concat(textObj.options.bullet.numberStartAt || textObj.options.bullet.startAt || '1', "\"/>");
                }
            }
            else if (textObj.options.bullet.characterCode) {
                var bulletCode = "&#x".concat(textObj.options.bullet.characterCode, ";");
                // Check value for hex-ness (s/b 4 char hex)
                if (!/^[0-9A-Fa-f]{4}$/.test(textObj.options.bullet.characterCode)) {
                    console.warn('Warning: `bullet.characterCode should be a 4-digit unicode charatcer (ex: 22AB)`!');
                    bulletCode = BULLET_TYPES.DEFAULT;
                }
                paragraphPropXml += " marL=\"".concat(textObj.options.indentLevel && textObj.options.indentLevel > 0 ? bulletMarL + bulletMarL * textObj.options.indentLevel : bulletMarL, "\" indent=\"-").concat(bulletMarL, "\"");
                strXmlBullet = '<a:buSzPct val="100000"/><a:buChar char="' + bulletCode + '"/>';
            }
            else if (textObj.options.bullet.code) {
                // @deprecated `bullet.code` v3.3.0
                var bulletCode = "&#x".concat(textObj.options.bullet.code, ";");
                // Check value for hex-ness (s/b 4 char hex)
                if (!/^[0-9A-Fa-f]{4}$/.test(textObj.options.bullet.code)) {
                    console.warn('Warning: `bullet.code should be a 4-digit hex code (ex: 22AB)`!');
                    bulletCode = BULLET_TYPES.DEFAULT;
                }
                paragraphPropXml += " marL=\"".concat(textObj.options.indentLevel && textObj.options.indentLevel > 0 ? bulletMarL + bulletMarL * textObj.options.indentLevel : bulletMarL, "\" indent=\"-").concat(bulletMarL, "\"");
                strXmlBullet = '<a:buSzPct val="100000"/><a:buChar char="' + bulletCode + '"/>';
            }
            else {
                paragraphPropXml += " marL=\"".concat(textObj.options.indentLevel && textObj.options.indentLevel > 0 ? bulletMarL + bulletMarL * textObj.options.indentLevel : bulletMarL, "\" indent=\"-").concat(bulletMarL, "\"");
                strXmlBullet = "<a:buSzPct val=\"100000\"/><a:buChar char=\"".concat(BULLET_TYPES.DEFAULT, "\"/>");
            }
        }
        else if (textObj.options.bullet) {
            paragraphPropXml += " marL=\"".concat(textObj.options.indentLevel && textObj.options.indentLevel > 0 ? bulletMarL + bulletMarL * textObj.options.indentLevel : bulletMarL, "\" indent=\"-").concat(bulletMarL, "\"");
            strXmlBullet = "<a:buSzPct val=\"100000\"/><a:buChar char=\"".concat(BULLET_TYPES.DEFAULT, "\"/>");
        }
        else if (!textObj.options.bullet) {
            // We only add this when the user explicitely asks for no bullet, otherwise, it can override the master defaults!
            paragraphPropXml += ' indent="0" marL="0"'; // FIX: ISSUE#589 - specify zero indent and marL or default will be hanging paragraph
            strXmlBullet = '<a:buNone/>';
        }
        // OPTION: tabStops
        if (textObj.options.tabStops && Array.isArray(textObj.options.tabStops)) {
            var tabStopsXml = textObj.options.tabStops.map(function (stop) { return "<a:tab pos=\"".concat(inch2Emu(stop.position || 1), "\" algn=\"").concat(stop.alignment || 'l', "\"/>"); }).join('');
            strXmlTabStops = "<a:tabLst>".concat(tabStopsXml, "</a:tabLst>");
        }
        // B: Close Paragraph-Properties
        // IMPORTANT: strXmlLnSpc, strXmlParaSpc, and strXmlBullet require strict ordering - anything out of order is ignored. (PPT-Online, PPT for Mac)
        paragraphPropXml += '>' + strXmlLnSpc + strXmlParaSpc + strXmlBullet + strXmlTabStops;
        if (isDefault)
            paragraphPropXml += genXmlTextRunProperties(textObj.options, true);
        paragraphPropXml += '</' + tag + '>';
    }
    return paragraphPropXml;
}
/**
 * Generate XML Text Run Properties (`a:rPr`)
 * @param {ObjectOptions|TextPropsOptions} opts - text options
 * @param {boolean} isDefault - whether these are the default text run properties
 * @return {string} XML
 */
function genXmlTextRunProperties(opts, isDefault) {
    var _a;
    var runProps = '';
    var runPropsTag = isDefault ? 'a:defRPr' : 'a:rPr';
    // BEGIN runProperties (ex: `<a:rPr lang="en-US" sz="1600" b="1" dirty="0">`)
    runProps += '<' + runPropsTag + ' lang="' + (opts.lang ? opts.lang : 'en-US') + '"' + (opts.lang ? ' altLang="en-US"' : '');
    runProps += opts.fontSize ? " sz=\"".concat(Math.round(opts.fontSize * 100), "\"") : ''; // NOTE: Use round so sizes like '7.5' wont cause corrupt presentations
    runProps += (opts === null || opts === void 0 ? void 0 : opts.bold) ? " b=\"".concat(opts.bold ? '1' : '0', "\"") : '';
    runProps += (opts === null || opts === void 0 ? void 0 : opts.italic) ? " i=\"".concat(opts.italic ? '1' : '0', "\"") : '';
    runProps += (opts === null || opts === void 0 ? void 0 : opts.strike) ? " strike=\"".concat(typeof opts.strike === 'string' ? opts.strike : 'sngStrike', "\"") : '';
    if (typeof opts.underline === 'object' && ((_a = opts.underline) === null || _a === void 0 ? void 0 : _a.style)) {
        runProps += " u=\"".concat(opts.underline.style, "\"");
    }
    else if (typeof opts.underline === 'string') {
        // DEPRECATED: opts.underline is an object as of v3.5.0
        runProps += " u=\"".concat(String(opts.underline), "\"");
    }
    else if (opts.hyperlink) {
        runProps += ' u="sng"';
    }
    if (opts.baseline) {
        runProps += " baseline=\"".concat(Math.round(opts.baseline * 50), "\"");
    }
    else if (opts.subscript) {
        runProps += ' baseline="-40000"';
    }
    else if (opts.superscript) {
        runProps += ' baseline="30000"';
    }
    runProps += opts.charSpacing ? " spc=\"".concat(Math.round(opts.charSpacing * 100), "\" kern=\"0\"") : ''; // IMPORTANT: Also disable kerning; otherwise text won't actually expand
    runProps += ' dirty="0">';
    // Color / Font / Highlight / Outline are children of <a:rPr>, so add them now before closing the runProperties tag
    if (opts.color || opts.fontFace || opts.outline || (typeof opts.underline === 'object' && opts.underline.color)) {
        if (opts.outline && typeof opts.outline === 'object') {
            runProps += "<a:ln w=\"".concat(valToPts(opts.outline.size || 0.75), "\">").concat(genXmlColorSelection(opts.outline.color || 'FFFFFF'), "</a:ln>");
        }
        if (opts.color)
            runProps += genXmlColorSelection({ color: opts.color, transparency: opts.transparency });
        if (opts.highlight)
            runProps += "<a:highlight>".concat(createColorElement(opts.highlight), "</a:highlight>");
        if (typeof opts.underline === 'object' && opts.underline.color)
            runProps += "<a:uFill>".concat(genXmlColorSelection(opts.underline.color), "</a:uFill>");
        if (opts.glow)
            runProps += "<a:effectLst>".concat(createGlowElement(opts.glow, DEF_TEXT_GLOW), "</a:effectLst>");
        if (opts.fontFace) {
            // NOTE: 'cs' = Complex Script, 'ea' = East Asian (use "-120" instead of "0" - per Issue #174); ea must come first (Issue #174)
            runProps += "<a:latin typeface=\"".concat(opts.fontFace, "\" pitchFamily=\"34\" charset=\"0\"/><a:ea typeface=\"").concat(opts.fontFace, "\" pitchFamily=\"34\" charset=\"-122\"/><a:cs typeface=\"").concat(opts.fontFace, "\" pitchFamily=\"34\" charset=\"-120\"/>");
        }
    }
    // Hyperlink support
    if (opts.hyperlink) {
        if (typeof opts.hyperlink !== 'object')
            throw new Error('ERROR: text `hyperlink` option should be an object. Ex: `hyperlink:{url:\'https://github.com\'}` ');
        else if (!opts.hyperlink.url && !opts.hyperlink.slide)
            throw new Error('ERROR: \'hyperlink requires either `url` or `slide`\'');
        else if (opts.hyperlink.url) {
            // runProps += '<a:uFill>'+ genXmlColorSelection('0000FF') +'</a:uFill>'; // Breaks PPT2010! (Issue#74)
            runProps += "<a:hlinkClick r:id=\"rId".concat(opts.hyperlink._rId, "\" invalidUrl=\"\" action=\"\" tgtFrame=\"\" tooltip=\"").concat(opts.hyperlink.tooltip ? encodeXmlEntities(opts.hyperlink.tooltip) : '', "\" history=\"1\" highlightClick=\"0\" endSnd=\"0\"").concat(opts.color ? '>' : '/>');
        }
        else if (opts.hyperlink.slide) {
            runProps += "<a:hlinkClick r:id=\"rId".concat(opts.hyperlink._rId, "\" action=\"ppaction://hlinksldjump\" tooltip=\"").concat(opts.hyperlink.tooltip ? encodeXmlEntities(opts.hyperlink.tooltip) : '', "\"").concat(opts.color ? '>' : '/>');
        }
        if (opts.color) {
            runProps += ' <a:extLst>';
            runProps += '  <a:ext uri="{A12FA001-AC4F-418D-AE19-62706E023703}">';
            runProps += '   <ahyp:hlinkClr xmlns:ahyp="http://schemas.microsoft.com/office/drawing/2018/hyperlinkcolor" val="tx"/>';
            runProps += '  </a:ext>';
            runProps += ' </a:extLst>';
            runProps += '</a:hlinkClick>';
        }
    }
    // END runProperties
    runProps += "</".concat(runPropsTag, ">");
    return runProps;
}
/**
 * Build textBody text runs [`<a:r></a:r>`] for paragraphs [`<a:p>`]
 * @param {TextProps} textObj - Text object
 * @return {string} XML string
 */
function genXmlTextRun(textObj) {
    // NOTE: Dont create full rPr runProps for empty [lineBreak] runs
    // Why? The size of the lineBreak wont match (eg: below it will be 18px instead of the correct 36px)
    // Do this:
    /*
        <a:p>
            <a:pPr algn="r"/>
            <a:endParaRPr lang="en-US" sz="3600" dirty="0"/>
        </a:p>
    */
    // NOT this:
    /*
        <a:p>
            <a:pPr algn="r"/>
            <a:r>
                <a:rPr lang="en-US" sz="3600" dirty="0">
                    <a:solidFill>
                        <a:schemeClr val="accent5"/>
                    </a:solidFill>
                    <a:latin typeface="Times" pitchFamily="34" charset="0"/>
                    <a:ea typeface="Times" pitchFamily="34" charset="-122"/>
                    <a:cs typeface="Times" pitchFamily="34" charset="-120"/>
                </a:rPr>
                <a:t></a:t>
            </a:r>
            <a:endParaRPr lang="en-US" dirty="0"/>
        </a:p>
    */
    // Return paragraph with text run
    return textObj.text ? "<a:r>".concat(genXmlTextRunProperties(textObj.options, false), "<a:t>").concat(encodeXmlEntities(textObj.text), "</a:t></a:r>") : '';
}
/**
 * Builds `<a:bodyPr></a:bodyPr>` tag for "genXmlTextBody()"
 * @param {ISlideObject | TableCell} slideObject - various options
 * @return {string} XML string
 */
function genXmlBodyProperties(slideObject) {
    var bodyProperties = '<a:bodyPr';
    if (slideObject && slideObject._type === SLIDE_OBJECT_TYPES.text && slideObject.options._bodyProp) {
        // PPT-2019 EX: <a:bodyPr wrap="square" lIns="1270" tIns="1270" rIns="1270" bIns="1270" rtlCol="0" anchor="ctr"/>
        // A: Enable or disable textwrapping none or square
        bodyProperties += slideObject.options._bodyProp.wrap ? ' wrap="square"' : ' wrap="none"';
        // B: Textbox margins [padding]
        if (slideObject.options._bodyProp.lIns || slideObject.options._bodyProp.lIns === 0)
            bodyProperties += " lIns=\"".concat(slideObject.options._bodyProp.lIns, "\"");
        if (slideObject.options._bodyProp.tIns || slideObject.options._bodyProp.tIns === 0)
            bodyProperties += " tIns=\"".concat(slideObject.options._bodyProp.tIns, "\"");
        if (slideObject.options._bodyProp.rIns || slideObject.options._bodyProp.rIns === 0)
            bodyProperties += " rIns=\"".concat(slideObject.options._bodyProp.rIns, "\"");
        if (slideObject.options._bodyProp.bIns || slideObject.options._bodyProp.bIns === 0)
            bodyProperties += " bIns=\"".concat(slideObject.options._bodyProp.bIns, "\"");
        // C: Add rtl after margins
        bodyProperties += ' rtlCol="0"';
        // D: Add anchorPoints
        if (slideObject.options._bodyProp.anchor)
            bodyProperties += ' anchor="' + slideObject.options._bodyProp.anchor + '"'; // VALS: [t,ctr,b]
        if (slideObject.options._bodyProp.vert)
            bodyProperties += ' vert="' + slideObject.options._bodyProp.vert + '"'; // VALS: [eaVert,horz,mongolianVert,vert,vert270,wordArtVert,wordArtVertRtl]
        // E: Close <a:bodyPr element
        bodyProperties += '>';
        /**
         * F: Text Fit/AutoFit/Shrink option
         * @see: http://officeopenxml.com/drwSp-text-bodyPr-fit.php
         * @see: http://www.datypic.com/sc/ooxml/g-a_EG_TextAutofit.html
         */
        if (slideObject.options.fit) {
            // NOTE: Use of '<a:noAutofit/>' instead of '' causes issues in PPT-2013!
            if (slideObject.options.fit === 'none')
                bodyProperties += '';
            // NOTE: Shrink does not work automatically - PowerPoint calculates the `fontScale` value dynamically upon resize
            // else if (slideObject.options.fit === 'shrink') bodyProperties += '<a:normAutofit fontScale="85000" lnSpcReduction="20000"/>' // MS-PPT > Format shape > Text Options: "Shrink text on overflow"
            else if (slideObject.options.fit === 'shrink')
                bodyProperties += '<a:normAutofit/>';
            else if (slideObject.options.fit === 'resize')
                bodyProperties += '<a:spAutoFit/>';
        }
        //
        // DEPRECATED: below (@deprecated v3.3.0)
        if (slideObject.options.shrinkText)
            bodyProperties += '<a:normAutofit/>'; // MS-PPT > Format shape > Text Options: "Shrink text on overflow"
        /* DEPRECATED: below (@deprecated v3.3.0)
         * MS-PPT > Format shape > Text Options: "Resize shape to fit text" [spAutoFit]
         * NOTE: Use of '<a:noAutofit/>' in lieu of '' below causes issues in PPT-2013
         */
        bodyProperties += slideObject.options._bodyProp.autoFit ? '<a:spAutoFit/>' : '';
        // LAST: Close _bodyProp
        bodyProperties += '</a:bodyPr>';
    }
    else {
        // DEFAULT:
        bodyProperties += ' wrap="square" rtlCol="0">';
        bodyProperties += '</a:bodyPr>';
    }
    // LAST: Return Close _bodyProp
    return slideObject._type === SLIDE_OBJECT_TYPES.tablecell ? '<a:bodyPr/>' : bodyProperties;
}
/**
 * Generate the XML for text and its options (bold, bullet, etc) including text runs (word-level formatting)
 * @param {ISlideObject|TableCell} slideObj - slideObj or tableCell
 * @note PPT text lines [lines followed by line-breaks] are created using <p>-aragraph's
 * @note Bullets are a paragragh-level formatting device
 * @template
 *    <p:txBody>
 *        <a:bodyPr wrap="square" rtlCol="0">
 *            <a:spAutoFit/>
 *        </a:bodyPr>
 *        <a:lstStyle/>
 *        <a:p>
 *            <a:pPr algn="ctr"/>
 *            <a:r>
 *                <a:rPr lang="en-US" dirty="0" err="1"/>
 *                <a:t>textbox text</a:t>
 *            </a:r>
 *            <a:endParaRPr lang="en-US" dirty="0"/>
 *        </a:p>
 *    </p:txBody>
 * @returns XML containing the param object's text and formatting
 */
function genXmlTextBody(slideObj) {
    var opts = slideObj.options || {};
    var tmpTextObjects = [];
    var arrTextObjects = [];
    // FIRST: Shapes without text, etc. may be sent here during build, but have no text to render so return an empty string
    if (opts && slideObj._type !== SLIDE_OBJECT_TYPES.tablecell && (typeof slideObj.text === 'undefined' || slideObj.text === null))
        return '';
    // STEP 1: Start textBody
    var strSlideXml = slideObj._type === SLIDE_OBJECT_TYPES.tablecell ? '<a:txBody>' : '<p:txBody>';
    // STEP 2: Add bodyProperties
    {
        // A: 'bodyPr'
        strSlideXml += genXmlBodyProperties(slideObj);
        // B: 'lstStyle'
        // NOTE: shape type 'LINE' has different text align needs (a lstStyle.lvl1pPr between bodyPr and p)
        // FIXME: LINE horiz-align doesnt work (text is always to the left inside line) (FYI: the PPT code diff is substantial!)
        if (opts.h === 0 && opts.line && opts.align)
            strSlideXml += '<a:lstStyle><a:lvl1pPr algn="l"/></a:lstStyle>';
        else if (slideObj._type === 'placeholder')
            strSlideXml += "<a:lstStyle>".concat(genXmlParagraphProperties(slideObj, true), "</a:lstStyle>");
        else
            strSlideXml += '<a:lstStyle/>';
    }
    /* STEP 3: Modify slideObj.text to array
        CASES:
        addText( 'string' ) // string
        addText( 'line1\n line2' ) // string with lineBreak
        addText( {text:'word1'} ) // TextProps object
        addText( ['barry','allen'] ) // array of strings
        addText( [{text:'word1'}, {text:'word2'}] ) // TextProps object array
        addText( [{text:'line1\n line2'}, {text:'end word'}] ) // TextProps object array with lineBreak
    */
    if (typeof slideObj.text === 'string' || typeof slideObj.text === 'number') {
        // Handle cases 1,2
        tmpTextObjects.push({ text: slideObj.text.toString(), options: opts || {} });
    }
    else if (slideObj.text && !Array.isArray(slideObj.text) && typeof slideObj.text === 'object' && Object.keys(slideObj.text).includes('text')) {
        // } else if (!Array.isArray(slideObj.text) && slideObj.text!.hasOwnProperty('text')) { // 20210706: replaced with below as ts compiler rejected it
        // Handle case 3
        tmpTextObjects.push({ text: slideObj.text || '', options: slideObj.options || {} });
    }
    else if (Array.isArray(slideObj.text)) {
        // Handle cases 4,5,6
        // NOTE: use cast as text is TextProps[]|TableCell[] and their `options` dont overlap (they share the same TextBaseProps though)
        tmpTextObjects = slideObj.text.map(function (item) { return ({ text: item.text, options: item.options }); });
    }
    // STEP 4: Iterate over text objects, set text/options, break into pieces if '\n'/breakLine found
    tmpTextObjects.forEach(function (itext, idx) {
        if (!itext.text)
            itext.text = '';
        // A: Set options
        itext.options = itext.options || opts || {};
        if (idx === 0 && itext.options && !itext.options.bullet && opts.bullet)
            itext.options.bullet = opts.bullet;
        // B: Cast to text-object and fix line-breaks (if needed)
        if (typeof itext.text === 'string' || typeof itext.text === 'number') {
            // 1: Convert "\n" or any variation into CRLF
            itext.text = itext.text.toString().replace(/\r*\n/g, CRLF);
        }
        // C: If text string has line-breaks, then create a separate text-object for each (much easier than dealing with split inside a loop below)
        // NOTE: Filter for trailing lineBreak prevents the creation of an empty textObj as the last item
        if (itext.text.includes(CRLF) && itext.text.match(/\n$/g) === null) {
            itext.text.split(CRLF).forEach(function (line) {
                itext.options.breakLine = true;
                arrTextObjects.push({ text: line, options: itext.options });
            });
        }
        else {
            arrTextObjects.push(itext);
        }
    });
    // STEP 5: Group textObj into lines by checking for lineBreak, bullets, alignment change, etc.
    var arrLines = [];
    var arrTexts = [];
    arrTextObjects.forEach(function (textObj, idx) {
        // A: Align or Bullet trigger new line
        if (arrTexts.length > 0 && (textObj.options.align || opts.align)) {
            // Only start a new paragraph when align *changes*
            if (textObj.options.align !== arrTextObjects[idx - 1].options.align) {
                arrLines.push(arrTexts);
                arrTexts = [];
            }
        }
        else if (arrTexts.length > 0 && textObj.options.bullet && arrTexts.length > 0) {
            arrLines.push(arrTexts);
            arrTexts = [];
            textObj.options.breakLine = false; // For cases with both `bullet` and `brekaLine` - prevent double lineBreak
        }
        // B: Add this text to current line
        arrTexts.push(textObj);
        // C: BreakLine begins new line **after** adding current text
        if (arrTexts.length > 0 && textObj.options.breakLine) {
            // Avoid starting a para right as loop is exhausted
            if (idx + 1 < arrTextObjects.length) {
                arrLines.push(arrTexts);
                arrTexts = [];
            }
        }
        // D: Flush buffer
        if (idx + 1 === arrTextObjects.length)
            arrLines.push(arrTexts);
    });
    // STEP 6: Loop over each line and create paragraph props, text run, etc.
    arrLines.forEach(function (line) {
        var _a;
        var reqsClosingFontSize = false;
        // A: Start paragraph, add paraProps
        strSlideXml += '<a:p>';
        // NOTE: `rtlMode` is like other opts, its propagated up to each text:options, so just check the 1st one
        var paragraphPropXml = "<a:pPr ".concat(((_a = line[0].options) === null || _a === void 0 ? void 0 : _a.rtlMode) ? ' rtl="1" ' : '');
        // B: Start paragraph, loop over lines and add text runs
        line.forEach(function (textObj, idx) {
            // A: Set line index
            textObj.options._lineIdx = idx;
            // A.1: Add soft break if not the first run of the line.
            if (idx > 0 && textObj.options.softBreakBefore) {
                strSlideXml += '<a:br/>';
            }
            // B: Inherit pPr-type options from parent shape's `options`
            textObj.options.align = textObj.options.align || opts.align;
            textObj.options.lineSpacing = textObj.options.lineSpacing || opts.lineSpacing;
            textObj.options.lineSpacingMultiple = textObj.options.lineSpacingMultiple || opts.lineSpacingMultiple;
            textObj.options.indentLevel = textObj.options.indentLevel || opts.indentLevel;
            textObj.options.paraSpaceBefore = textObj.options.paraSpaceBefore || opts.paraSpaceBefore;
            textObj.options.paraSpaceAfter = textObj.options.paraSpaceAfter || opts.paraSpaceAfter;
            paragraphPropXml = genXmlParagraphProperties(textObj, false);
            strSlideXml += paragraphPropXml.replace('<a:pPr></a:pPr>', ''); // IMPORTANT: Empty "pPr" blocks will generate needs-repair/corrupt msg
            // C: Inherit any main options (color, fontSize, etc.)
            // NOTE: We only pass the text.options to genXmlTextRun (not the Slide.options),
            // so the run building function cant just fallback to Slide.color, therefore, we need to do that here before passing options below.
            // FILTER RULE: Hyperlinks should not inherit `color` from main options (let PPT default to local color, eg: blue on MacOS)
            Object.entries(opts).filter(function (_a) {
                var key = _a[0]; _a[1];
                return !(textObj.options.hyperlink && key === 'color');
            }).forEach(function (_a) {
                var key = _a[0], val = _a[1];
                // if (textObj.options.hyperlink && key === 'color') null
                // NOTE: This loop will pick up unecessary keys (`x`, etc.), but it doesnt hurt anything
                if (key !== 'bullet' && !textObj.options[key])
                    textObj.options[key] = val;
            });
            // D: Add formatted textrun
            strSlideXml += genXmlTextRun(textObj);
            // E: Flag close fontSize for empty [lineBreak] elements
            if ((!textObj.text && opts.fontSize) || textObj.options.fontSize) {
                reqsClosingFontSize = true;
                opts.fontSize = opts.fontSize || textObj.options.fontSize;
            }
        });
        /* C: Append 'endParaRPr' (when needed) and close current open paragraph
         * NOTE: (ISSUE#20, ISSUE#193): Add 'endParaRPr' with font/size props or PPT default (Arial/18pt en-us) is used making row "too tall"/not honoring options
         */
        if (slideObj._type === SLIDE_OBJECT_TYPES.tablecell && (opts.fontSize || opts.fontFace)) {
            if (opts.fontFace) {
                strSlideXml += "<a:endParaRPr lang=\"".concat(opts.lang || 'en-US', "\"") + (opts.fontSize ? " sz=\"".concat(Math.round(opts.fontSize * 100), "\"") : '') + ' dirty="0">';
                strSlideXml += "<a:latin typeface=\"".concat(opts.fontFace, "\" charset=\"0\"/>");
                strSlideXml += "<a:ea typeface=\"".concat(opts.fontFace, "\" charset=\"0\"/>");
                strSlideXml += "<a:cs typeface=\"".concat(opts.fontFace, "\" charset=\"0\"/>");
                strSlideXml += '</a:endParaRPr>';
            }
            else {
                strSlideXml += "<a:endParaRPr lang=\"".concat(opts.lang || 'en-US', "\"") + (opts.fontSize ? " sz=\"".concat(Math.round(opts.fontSize * 100), "\"") : '') + ' dirty="0"/>';
            }
        }
        else if (reqsClosingFontSize) {
            // Empty [lineBreak] lines should not contain runProp, however, they need to specify fontSize in `endParaRPr`
            strSlideXml += "<a:endParaRPr lang=\"".concat(opts.lang || 'en-US', "\"") + (opts.fontSize ? " sz=\"".concat(Math.round(opts.fontSize * 100), "\"") : '') + ' dirty="0"/>';
        }
        else {
            strSlideXml += "<a:endParaRPr lang=\"".concat(opts.lang || 'en-US', "\" dirty=\"0\"/>"); // Added 20180101 to address PPT-2007 issues
        }
        // D: End paragraph
        strSlideXml += '</a:p>';
    });
    // STEP 7: Close the textBody
    strSlideXml += slideObj._type === SLIDE_OBJECT_TYPES.tablecell ? '</a:txBody>' : '</p:txBody>';
    // LAST: Return XML
    return strSlideXml;
}
/**
 * Generate an XML Placeholder
 * @param {ISlideObject} placeholderObj
 * @returns XML
 */
function genXmlPlaceholder(placeholderObj) {
    var _a, _b;
    if (!placeholderObj)
        return '';
    var placeholderIdx = ((_a = placeholderObj.options) === null || _a === void 0 ? void 0 : _a._placeholderIdx) ? placeholderObj.options._placeholderIdx : '';
    var placeholderTyp = ((_b = placeholderObj.options) === null || _b === void 0 ? void 0 : _b._placeholderType) ? placeholderObj.options._placeholderType : '';
    var placeholderType = placeholderTyp && PLACEHOLDER_TYPES[placeholderTyp] ? (PLACEHOLDER_TYPES[placeholderTyp]).toString() : '';
    return "<p:ph\n\t\t".concat(placeholderIdx ? ' idx="' + placeholderIdx.toString() + '"' : '', "\n\t\t").concat(placeholderType && PLACEHOLDER_TYPES[placeholderType] ? " type=\"".concat(placeholderType, "\"") : '', "\n\t\t").concat(placeholderObj.text && placeholderObj.text.length > 0 ? ' hasCustomPrompt="1"' : '', "\n\t\t/>");
}
// XML-GEN: First 6 functions create the base /ppt files
/**
 * Generate XML ContentType
 * @param {PresSlide[]} slides - slides
 * @param {SlideLayout[]} slideLayouts - slide layouts
 * @param {PresSlide} masterSlide - master slide
 * @returns XML
 */
function makeXmlContTypes(slides, slideLayouts, masterSlide) {
    var strXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + CRLF;
    strXml += '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">';
    strXml += '<Default Extension="xml" ContentType="application/xml"/>';
    strXml += '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>';
    strXml += '<Default Extension="jpeg" ContentType="image/jpeg"/>';
    strXml += '<Default Extension="jpg" ContentType="image/jpg"/>';
    strXml += '<Default Extension="svg" ContentType="image/svg+xml"/>';
    // STEP 1: Add standard/any media types used in Presentation
    strXml += '<Default Extension="png" ContentType="image/png"/>';
    strXml += '<Default Extension="gif" ContentType="image/gif"/>';
    strXml += '<Default Extension="m4v" ContentType="video/mp4"/>'; // NOTE: Hard-Code this extension as it wont be created in loop below (as extn !== type)
    strXml += '<Default Extension="mp4" ContentType="video/mp4"/>'; // NOTE: Hard-Code this extension as it wont be created in loop below (as extn !== type)
    slides.forEach(function (slide) {
        (slide._relsMedia || []).forEach(function (rel) {
            if (rel.type !== 'image' && rel.type !== 'online' && rel.type !== 'chart' && rel.extn !== 'm4v' && !strXml.includes(rel.type)) {
                strXml += '<Default Extension="' + rel.extn + '" ContentType="' + rel.type + '"/>';
            }
        });
    });
    strXml += '<Default Extension="vml" ContentType="application/vnd.openxmlformats-officedocument.vmlDrawing"/>';
    strXml += '<Default Extension="xlsx" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>';
    // STEP 2: Add presentation and slide master(s)/slide(s)
    strXml += '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>';
    strXml += '<Override PartName="/ppt/notesMasters/notesMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.notesMaster+xml"/>';
    slides.forEach(function (slide, idx) {
        strXml += "<Override PartName=\"/ppt/slideMasters/slideMaster".concat(idx + 1, ".xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml\"/>");
        strXml += "<Override PartName=\"/ppt/slides/slide".concat(idx + 1, ".xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.slide+xml\"/>");
        // Add charts if any
        slide._relsChart.forEach(function (rel) {
            strXml += "<Override PartName=\"".concat(rel.Target, "\" ContentType=\"application/vnd.openxmlformats-officedocument.drawingml.chart+xml\"/>");
        });
    });
    // STEP 3: Core PPT
    strXml += '<Override PartName="/ppt/presProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presProps+xml"/>';
    strXml += '<Override PartName="/ppt/viewProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml"/>';
    strXml += '<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>';
    strXml += '<Override PartName="/ppt/tableStyles.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml"/>';
    // STEP 4: Add Slide Layouts
    slideLayouts.forEach(function (layout, idx) {
        strXml += "<Override PartName=\"/ppt/slideLayouts/slideLayout".concat(idx + 1, ".xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml\"/>");
        (layout._relsChart || []).forEach(function (rel) {
            strXml += ' <Override PartName="' + rel.Target + '" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>';
        });
    });
    // STEP 5: Add notes slide(s)
    slides.forEach(function (_slide, idx) {
        strXml += "<Override PartName=\"/ppt/notesSlides/notesSlide".concat(idx + 1, ".xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml\"/>");
    });
    // STEP 6: Add rels
    masterSlide._relsChart.forEach(function (rel) {
        strXml += ' <Override PartName="' + rel.Target + '" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>';
    });
    masterSlide._relsMedia.forEach(function (rel) {
        if (rel.type !== 'image' && rel.type !== 'online' && rel.type !== 'chart' && rel.extn !== 'm4v' && !strXml.includes(rel.type)) {
            strXml += ' <Default Extension="' + rel.extn + '" ContentType="' + rel.type + '"/>';
        }
    });
    // LAST: Finish XML (Resume core)
    strXml += ' <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>';
    strXml += ' <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>';
    strXml += '</Types>';
    return strXml;
}
/**
 * Creates `_rels/.rels`
 * @returns XML
 */
function makeXmlRootRels() {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>".concat(CRLF, "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">\n\t\t<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties\" Target=\"docProps/app.xml\"/>\n\t\t<Relationship Id=\"rId2\" Type=\"http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties\" Target=\"docProps/core.xml\"/>\n\t\t<Relationship Id=\"rId3\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\" Target=\"ppt/presentation.xml\"/>\n\t\t</Relationships>");
}
/**
 * Creates `docProps/app.xml`
 * @param {PresSlide[]} slides - Presenation Slides
 * @param {string} company - "Company" metadata
 * @returns XML
 */
function makeXmlApp(slides, company) {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>".concat(CRLF, "<Properties xmlns=\"http://schemas.openxmlformats.org/officeDocument/2006/extended-properties\" xmlns:vt=\"http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes\">\n\t<TotalTime>0</TotalTime>\n\t<Words>0</Words>\n\t<Application>Microsoft Office PowerPoint</Application>\n\t<PresentationFormat>On-screen Show (16:9)</PresentationFormat>\n\t<Paragraphs>0</Paragraphs>\n\t<Slides>").concat(slides.length, "</Slides>\n\t<Notes>").concat(slides.length, "</Notes>\n\t<HiddenSlides>0</HiddenSlides>\n\t<MMClips>0</MMClips>\n\t<ScaleCrop>false</ScaleCrop>\n\t<HeadingPairs>\n\t\t<vt:vector size=\"6\" baseType=\"variant\">\n\t\t\t<vt:variant><vt:lpstr>Fonts Used</vt:lpstr></vt:variant>\n\t\t\t<vt:variant><vt:i4>2</vt:i4></vt:variant>\n\t\t\t<vt:variant><vt:lpstr>Theme</vt:lpstr></vt:variant>\n\t\t\t<vt:variant><vt:i4>1</vt:i4></vt:variant>\n\t\t\t<vt:variant><vt:lpstr>Slide Titles</vt:lpstr></vt:variant>\n\t\t\t<vt:variant><vt:i4>").concat(slides.length, "</vt:i4></vt:variant>\n\t\t</vt:vector>\n\t</HeadingPairs>\n\t<TitlesOfParts>\n\t\t<vt:vector size=\"").concat(slides.length + 1 + 2, "\" baseType=\"lpstr\">\n\t\t\t<vt:lpstr>Arial</vt:lpstr>\n\t\t\t<vt:lpstr>Calibri</vt:lpstr>\n\t\t\t<vt:lpstr>Office Theme</vt:lpstr>\n\t\t\t").concat(slides.map(function (_slideObj, idx) { return "<vt:lpstr>Slide ".concat(idx + 1, "</vt:lpstr>"); }).join(''), "\n\t\t</vt:vector>\n\t</TitlesOfParts>\n\t<Company>").concat(company, "</Company>\n\t<LinksUpToDate>false</LinksUpToDate>\n\t<SharedDoc>false</SharedDoc>\n\t<HyperlinksChanged>false</HyperlinksChanged>\n\t<AppVersion>16.0000</AppVersion>\n\t</Properties>");
}
/**
 * Creates `docProps/core.xml`
 * @param {string} title - metadata data
 * @param {string} subject - metadata data
 * @param {string} author - metadata value
 * @param {string} revision - metadata value
 * @returns XML
 */
function makeXmlCore(title, subject, author, revision) {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n\t<cp:coreProperties xmlns:cp=\"http://schemas.openxmlformats.org/package/2006/metadata/core-properties\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:dcterms=\"http://purl.org/dc/terms/\" xmlns:dcmitype=\"http://purl.org/dc/dcmitype/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n\t\t<dc:title>".concat(encodeXmlEntities(title), "</dc:title>\n\t\t<dc:subject>").concat(encodeXmlEntities(subject), "</dc:subject>\n\t\t<dc:creator>").concat(encodeXmlEntities(author), "</dc:creator>\n\t\t<cp:lastModifiedBy>").concat(encodeXmlEntities(author), "</cp:lastModifiedBy>\n\t\t<cp:revision>").concat(revision, "</cp:revision>\n\t\t<dcterms:created xsi:type=\"dcterms:W3CDTF\">").concat(new Date().toISOString().replace(/\.\d\d\dZ/, 'Z'), "</dcterms:created>\n\t\t<dcterms:modified xsi:type=\"dcterms:W3CDTF\">").concat(new Date().toISOString().replace(/\.\d\d\dZ/, 'Z'), "</dcterms:modified>\n\t</cp:coreProperties>");
}
/**
 * Creates `ppt/_rels/presentation.xml.rels`
 * @param {PresSlide[]} slides - Presenation Slides
 * @returns XML
 */
function makeXmlPresentationRels(slides) {
    var intRelNum = 1;
    var strXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + CRLF;
    strXml += '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
    strXml += '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>';
    for (var idx = 1; idx <= slides.length; idx++) {
        strXml += "<Relationship Id=\"rId".concat(++intRelNum, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide\" Target=\"slides/slide").concat(idx, ".xml\"/>");
    }
    intRelNum++;
    strXml +=
        "<Relationship Id=\"rId".concat(intRelNum + 0, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesMaster\" Target=\"notesMasters/notesMaster1.xml\"/>") +
            "<Relationship Id=\"rId".concat(intRelNum + 1, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/presProps\" Target=\"presProps.xml\"/>") +
            "<Relationship Id=\"rId".concat(intRelNum + 2, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/viewProps\" Target=\"viewProps.xml\"/>") +
            "<Relationship Id=\"rId".concat(intRelNum + 3, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme\" Target=\"theme/theme1.xml\"/>") +
            "<Relationship Id=\"rId".concat(intRelNum + 4, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableStyles\" Target=\"tableStyles.xml\"/>") +
            '</Relationships>';
    return strXml;
}
// XML-GEN: Functions that run 1-N times (once for each Slide)
/**
 * Generates XML for the slide file (`ppt/slides/slide1.xml`)
 * @param {PresSlide} slide - the slide object to transform into XML
 * @return {string} XML
 */
function makeXmlSlide(slide) {
    return ("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>".concat(CRLF) +
        '<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
        'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"' +
        "".concat((slide === null || slide === void 0 ? void 0 : slide.hidden) ? ' show="0"' : '', ">") +
        "".concat(slideObjectToXml(slide)) +
        '<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>');
}
/**
 * Get text content of Notes from Slide
 * @param {PresSlide} slide - the slide object to transform into XML
 * @return {string} notes text
 */
function getNotesFromSlide(slide) {
    var notesText = '';
    slide._slideObjects.forEach(function (data) {
        if (data._type === SLIDE_OBJECT_TYPES.notes)
            notesText += (data === null || data === void 0 ? void 0 : data.text) && data.text[0] ? data.text[0].text : '';
    });
    return notesText.replace(/\r*\n/g, CRLF);
}
/**
 * Generate XML for Notes Master (notesMaster1.xml)
 * @returns {string} XML
 */
function makeXmlNotesMaster() {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>".concat(CRLF, "<p:notesMaster xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:p=\"http://schemas.openxmlformats.org/presentationml/2006/main\"><p:cSld><p:bg><p:bgRef idx=\"1001\"><a:schemeClr val=\"bg1\"/></p:bgRef></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id=\"1\" name=\"\"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x=\"0\" y=\"0\"/><a:ext cx=\"0\" cy=\"0\"/><a:chOff x=\"0\" y=\"0\"/><a:chExt cx=\"0\" cy=\"0\"/></a:xfrm></p:grpSpPr><p:sp><p:nvSpPr><p:cNvPr id=\"2\" name=\"Header Placeholder 1\"/><p:cNvSpPr><a:spLocks noGrp=\"1\"/></p:cNvSpPr><p:nvPr><p:ph type=\"hdr\" sz=\"quarter\"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x=\"0\" y=\"0\"/><a:ext cx=\"2971800\" cy=\"458788\"/></a:xfrm><a:prstGeom prst=\"rect\"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert=\"horz\" lIns=\"91440\" tIns=\"45720\" rIns=\"91440\" bIns=\"45720\" rtlCol=\"0\"/><a:lstStyle><a:lvl1pPr algn=\"l\"><a:defRPr sz=\"1200\"/></a:lvl1pPr></a:lstStyle><a:p><a:endParaRPr lang=\"en-US\"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id=\"3\" name=\"Date Placeholder 2\"/><p:cNvSpPr><a:spLocks noGrp=\"1\"/></p:cNvSpPr><p:nvPr><p:ph type=\"dt\" idx=\"1\"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x=\"3884613\" y=\"0\"/><a:ext cx=\"2971800\" cy=\"458788\"/></a:xfrm><a:prstGeom prst=\"rect\"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert=\"horz\" lIns=\"91440\" tIns=\"45720\" rIns=\"91440\" bIns=\"45720\" rtlCol=\"0\"/><a:lstStyle><a:lvl1pPr algn=\"r\"><a:defRPr sz=\"1200\"/></a:lvl1pPr></a:lstStyle><a:p><a:fld id=\"{5282F153-3F37-0F45-9E97-73ACFA13230C}\" type=\"datetimeFigureOut\"><a:rPr lang=\"en-US\"/><a:t>7/23/19</a:t></a:fld><a:endParaRPr lang=\"en-US\"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id=\"4\" name=\"Slide Image Placeholder 3\"/><p:cNvSpPr><a:spLocks noGrp=\"1\" noRot=\"1\" noChangeAspect=\"1\"/></p:cNvSpPr><p:nvPr><p:ph type=\"sldImg\" idx=\"2\"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x=\"685800\" y=\"1143000\"/><a:ext cx=\"5486400\" cy=\"3086100\"/></a:xfrm><a:prstGeom prst=\"rect\"><a:avLst/></a:prstGeom><a:noFill/><a:ln w=\"12700\"><a:solidFill><a:prstClr val=\"black\"/></a:solidFill></a:ln></p:spPr><p:txBody><a:bodyPr vert=\"horz\" lIns=\"91440\" tIns=\"45720\" rIns=\"91440\" bIns=\"45720\" rtlCol=\"0\" anchor=\"ctr\"/><a:lstStyle/><a:p><a:endParaRPr lang=\"en-US\"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id=\"5\" name=\"Notes Placeholder 4\"/><p:cNvSpPr><a:spLocks noGrp=\"1\"/></p:cNvSpPr><p:nvPr><p:ph type=\"body\" sz=\"quarter\" idx=\"3\"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x=\"685800\" y=\"4400550\"/><a:ext cx=\"5486400\" cy=\"3600450\"/></a:xfrm><a:prstGeom prst=\"rect\"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert=\"horz\" lIns=\"91440\" tIns=\"45720\" rIns=\"91440\" bIns=\"45720\" rtlCol=\"0\"/><a:lstStyle/><a:p><a:pPr lvl=\"0\"/><a:r><a:rPr lang=\"en-US\"/><a:t>Click to edit Master text styles</a:t></a:r></a:p><a:p><a:pPr lvl=\"1\"/><a:r><a:rPr lang=\"en-US\"/><a:t>Second level</a:t></a:r></a:p><a:p><a:pPr lvl=\"2\"/><a:r><a:rPr lang=\"en-US\"/><a:t>Third level</a:t></a:r></a:p><a:p><a:pPr lvl=\"3\"/><a:r><a:rPr lang=\"en-US\"/><a:t>Fourth level</a:t></a:r></a:p><a:p><a:pPr lvl=\"4\"/><a:r><a:rPr lang=\"en-US\"/><a:t>Fifth level</a:t></a:r></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id=\"6\" name=\"Footer Placeholder 5\"/><p:cNvSpPr><a:spLocks noGrp=\"1\"/></p:cNvSpPr><p:nvPr><p:ph type=\"ftr\" sz=\"quarter\" idx=\"4\"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x=\"0\" y=\"8685213\"/><a:ext cx=\"2971800\" cy=\"458787\"/></a:xfrm><a:prstGeom prst=\"rect\"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert=\"horz\" lIns=\"91440\" tIns=\"45720\" rIns=\"91440\" bIns=\"45720\" rtlCol=\"0\" anchor=\"b\"/><a:lstStyle><a:lvl1pPr algn=\"l\"><a:defRPr sz=\"1200\"/></a:lvl1pPr></a:lstStyle><a:p><a:endParaRPr lang=\"en-US\"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id=\"7\" name=\"Slide Number Placeholder 6\"/><p:cNvSpPr><a:spLocks noGrp=\"1\"/></p:cNvSpPr><p:nvPr><p:ph type=\"sldNum\" sz=\"quarter\" idx=\"5\"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x=\"3884613\" y=\"8685213\"/><a:ext cx=\"2971800\" cy=\"458787\"/></a:xfrm><a:prstGeom prst=\"rect\"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert=\"horz\" lIns=\"91440\" tIns=\"45720\" rIns=\"91440\" bIns=\"45720\" rtlCol=\"0\" anchor=\"b\"/><a:lstStyle><a:lvl1pPr algn=\"r\"><a:defRPr sz=\"1200\"/></a:lvl1pPr></a:lstStyle><a:p><a:fld id=\"{CE5E9CC1-C706-0F49-92D6-E571CC5EEA8F}\" type=\"slidenum\"><a:rPr lang=\"en-US\"/><a:t>\u2039#\u203A</a:t></a:fld><a:endParaRPr lang=\"en-US\"/></a:p></p:txBody></p:sp></p:spTree><p:extLst><p:ext uri=\"{BB962C8B-B14F-4D97-AF65-F5344CB8AC3E}\"><p14:creationId xmlns:p14=\"http://schemas.microsoft.com/office/powerpoint/2010/main\" val=\"1024086991\"/></p:ext></p:extLst></p:cSld><p:clrMap bg1=\"lt1\" tx1=\"dk1\" bg2=\"lt2\" tx2=\"dk2\" accent1=\"accent1\" accent2=\"accent2\" accent3=\"accent3\" accent4=\"accent4\" accent5=\"accent5\" accent6=\"accent6\" hlink=\"hlink\" folHlink=\"folHlink\"/><p:notesStyle><a:lvl1pPr marL=\"0\" algn=\"l\" defTabSz=\"914400\" rtl=\"0\" eaLnBrk=\"1\" latinLnBrk=\"0\" hangingPunct=\"1\"><a:defRPr sz=\"1200\" kern=\"1200\"><a:solidFill><a:schemeClr val=\"tx1\"/></a:solidFill><a:latin typeface=\"+mn-lt\"/><a:ea typeface=\"+mn-ea\"/><a:cs typeface=\"+mn-cs\"/></a:defRPr></a:lvl1pPr><a:lvl2pPr marL=\"457200\" algn=\"l\" defTabSz=\"914400\" rtl=\"0\" eaLnBrk=\"1\" latinLnBrk=\"0\" hangingPunct=\"1\"><a:defRPr sz=\"1200\" kern=\"1200\"><a:solidFill><a:schemeClr val=\"tx1\"/></a:solidFill><a:latin typeface=\"+mn-lt\"/><a:ea typeface=\"+mn-ea\"/><a:cs typeface=\"+mn-cs\"/></a:defRPr></a:lvl2pPr><a:lvl3pPr marL=\"914400\" algn=\"l\" defTabSz=\"914400\" rtl=\"0\" eaLnBrk=\"1\" latinLnBrk=\"0\" hangingPunct=\"1\"><a:defRPr sz=\"1200\" kern=\"1200\"><a:solidFill><a:schemeClr val=\"tx1\"/></a:solidFill><a:latin typeface=\"+mn-lt\"/><a:ea typeface=\"+mn-ea\"/><a:cs typeface=\"+mn-cs\"/></a:defRPr></a:lvl3pPr><a:lvl4pPr marL=\"1371600\" algn=\"l\" defTabSz=\"914400\" rtl=\"0\" eaLnBrk=\"1\" latinLnBrk=\"0\" hangingPunct=\"1\"><a:defRPr sz=\"1200\" kern=\"1200\"><a:solidFill><a:schemeClr val=\"tx1\"/></a:solidFill><a:latin typeface=\"+mn-lt\"/><a:ea typeface=\"+mn-ea\"/><a:cs typeface=\"+mn-cs\"/></a:defRPr></a:lvl4pPr><a:lvl5pPr marL=\"1828800\" algn=\"l\" defTabSz=\"914400\" rtl=\"0\" eaLnBrk=\"1\" latinLnBrk=\"0\" hangingPunct=\"1\"><a:defRPr sz=\"1200\" kern=\"1200\"><a:solidFill><a:schemeClr val=\"tx1\"/></a:solidFill><a:latin typeface=\"+mn-lt\"/><a:ea typeface=\"+mn-ea\"/><a:cs typeface=\"+mn-cs\"/></a:defRPr></a:lvl5pPr><a:lvl6pPr marL=\"2286000\" algn=\"l\" defTabSz=\"914400\" rtl=\"0\" eaLnBrk=\"1\" latinLnBrk=\"0\" hangingPunct=\"1\"><a:defRPr sz=\"1200\" kern=\"1200\"><a:solidFill><a:schemeClr val=\"tx1\"/></a:solidFill><a:latin typeface=\"+mn-lt\"/><a:ea typeface=\"+mn-ea\"/><a:cs typeface=\"+mn-cs\"/></a:defRPr></a:lvl6pPr><a:lvl7pPr marL=\"2743200\" algn=\"l\" defTabSz=\"914400\" rtl=\"0\" eaLnBrk=\"1\" latinLnBrk=\"0\" hangingPunct=\"1\"><a:defRPr sz=\"1200\" kern=\"1200\"><a:solidFill><a:schemeClr val=\"tx1\"/></a:solidFill><a:latin typeface=\"+mn-lt\"/><a:ea typeface=\"+mn-ea\"/><a:cs typeface=\"+mn-cs\"/></a:defRPr></a:lvl7pPr><a:lvl8pPr marL=\"3200400\" algn=\"l\" defTabSz=\"914400\" rtl=\"0\" eaLnBrk=\"1\" latinLnBrk=\"0\" hangingPunct=\"1\"><a:defRPr sz=\"1200\" kern=\"1200\"><a:solidFill><a:schemeClr val=\"tx1\"/></a:solidFill><a:latin typeface=\"+mn-lt\"/><a:ea typeface=\"+mn-ea\"/><a:cs typeface=\"+mn-cs\"/></a:defRPr></a:lvl8pPr><a:lvl9pPr marL=\"3657600\" algn=\"l\" defTabSz=\"914400\" rtl=\"0\" eaLnBrk=\"1\" latinLnBrk=\"0\" hangingPunct=\"1\"><a:defRPr sz=\"1200\" kern=\"1200\"><a:solidFill><a:schemeClr val=\"tx1\"/></a:solidFill><a:latin typeface=\"+mn-lt\"/><a:ea typeface=\"+mn-ea\"/><a:cs typeface=\"+mn-cs\"/></a:defRPr></a:lvl9pPr></p:notesStyle></p:notesMaster>");
}
/**
 * Creates Notes Slide (`ppt/notesSlides/notesSlide1.xml`)
 * @param {PresSlide} slide - the slide object to transform into XML
 * @return {string} XML
 */
function makeXmlNotesSlide(slide) {
    return ("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>".concat(CRLF, "<p:notes xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:p=\"http://schemas.openxmlformats.org/presentationml/2006/main\"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id=\"1\" name=\"\"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x=\"0\" y=\"0\"/><a:ext cx=\"0\" cy=\"0\"/><a:chOff x=\"0\" y=\"0\"/><a:chExt cx=\"0\" cy=\"0\"/></a:xfrm></p:grpSpPr><p:sp><p:nvSpPr><p:cNvPr id=\"2\" name=\"Slide Image Placeholder 1\"/><p:cNvSpPr><a:spLocks noGrp=\"1\" noRot=\"1\" noChangeAspect=\"1\"/></p:cNvSpPr><p:nvPr><p:ph type=\"sldImg\"/></p:nvPr></p:nvSpPr><p:spPr/></p:sp><p:sp><p:nvSpPr><p:cNvPr id=\"3\" name=\"Notes Placeholder 2\"/><p:cNvSpPr><a:spLocks noGrp=\"1\"/></p:cNvSpPr><p:nvPr><p:ph type=\"body\" idx=\"1\"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang=\"en-US\" dirty=\"0\"/><a:t>").concat(encodeXmlEntities(getNotesFromSlide(slide)), "</a:t></a:r><a:endParaRPr lang=\"en-US\" dirty=\"0\"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id=\"4\" name=\"Slide Number Placeholder 3\"/><p:cNvSpPr><a:spLocks noGrp=\"1\"/></p:cNvSpPr><p:nvPr><p:ph type=\"sldNum\" sz=\"quarter\" idx=\"10\"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:fld id=\"").concat(SLDNUMFLDID, "\" type=\"slidenum\"><a:rPr lang=\"en-US\"/><a:t>").concat(slide._slideNum, "</a:t></a:fld><a:endParaRPr lang=\"en-US\"/></a:p></p:txBody></p:sp></p:spTree><p:extLst><p:ext uri=\"{BB962C8B-B14F-4D97-AF65-F5344CB8AC3E}\"><p14:creationId xmlns:p14=\"http://schemas.microsoft.com/office/powerpoint/2010/main\" val=\"1024086991\"/></p:ext></p:extLst></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:notes>"));
}
/**
 * Generates the XML layout resource from a layout object
 * @param {SlideLayout} layout - slide layout (master)
 * @return {string} XML
 */
function makeXmlLayout(layout) {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n\t\t<p:sldLayout xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:p=\"http://schemas.openxmlformats.org/presentationml/2006/main\" preserve=\"1\">\n\t\t".concat(slideObjectToXml(layout), "\n\t\t<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>");
}
/**
 * Creates Slide Master 1 (`ppt/slideMasters/slideMaster1.xml`)
 * @param {PresSlide} slide - slide object that represents master slide layout
 * @param {SlideLayout[]} layouts - slide layouts
 * @return {string} XML
 */
function makeXmlMaster(slide, layouts) {
    // NOTE: Pass layouts as static rels because they are not referenced any time
    var layoutDefs = layouts.map(function (_layoutDef, idx) { return "<p:sldLayoutId id=\"".concat(LAYOUT_IDX_SERIES_BASE + idx, "\" r:id=\"rId").concat(slide._rels.length + idx + 1, "\"/>"); });
    var strXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + CRLF;
    strXml +=
        '<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">';
    strXml += slideObjectToXml(slide);
    strXml +=
        '<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>';
    strXml += '<p:sldLayoutIdLst>' + layoutDefs.join('') + '</p:sldLayoutIdLst>';
    strXml += '<p:hf sldNum="0" hdr="0" ftr="0" dt="0"/>';
    strXml +=
        '<p:txStyles>' +
            ' <p:titleStyle>' +
            '  <a:lvl1pPr algn="ctr" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="0"/></a:spcBef><a:buNone/><a:defRPr sz="4400" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mj-lt"/><a:ea typeface="+mj-ea"/><a:cs typeface="+mj-cs"/></a:defRPr></a:lvl1pPr>' +
            ' </p:titleStyle>' +
            ' <p:bodyStyle>' +
            '  <a:lvl1pPr marL="342900" indent="-342900" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="•"/><a:defRPr sz="3200" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl1pPr>' +
            '  <a:lvl2pPr marL="742950" indent="-285750" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="–"/><a:defRPr sz="2800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl2pPr>' +
            '  <a:lvl3pPr marL="1143000" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="•"/><a:defRPr sz="2400" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl3pPr>' +
            '  <a:lvl4pPr marL="1600200" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="–"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl4pPr>' +
            '  <a:lvl5pPr marL="2057400" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="»"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl5pPr>' +
            '  <a:lvl6pPr marL="2514600" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="•"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl6pPr>' +
            '  <a:lvl7pPr marL="2971800" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="•"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl7pPr>' +
            '  <a:lvl8pPr marL="3429000" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="•"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl8pPr>' +
            '  <a:lvl9pPr marL="3886200" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="•"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl9pPr>' +
            ' </p:bodyStyle>' +
            ' <p:otherStyle>' +
            '  <a:defPPr><a:defRPr lang="en-US"/></a:defPPr>' +
            '  <a:lvl1pPr marL="0" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl1pPr>' +
            '  <a:lvl2pPr marL="457200" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl2pPr>' +
            '  <a:lvl3pPr marL="914400" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl3pPr>' +
            '  <a:lvl4pPr marL="1371600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl4pPr>' +
            '  <a:lvl5pPr marL="1828800" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl5pPr>' +
            '  <a:lvl6pPr marL="2286000" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl6pPr>' +
            '  <a:lvl7pPr marL="2743200" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl7pPr>' +
            '  <a:lvl8pPr marL="3200400" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl8pPr>' +
            '  <a:lvl9pPr marL="3657600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl9pPr>' +
            ' </p:otherStyle>' +
            '</p:txStyles>';
    strXml += '</p:sldMaster>';
    return strXml;
}
/**
 * Generates XML string for a slide layout relation file
 * @param {number} layoutNumber - 1-indexed number of a layout that relations are generated for
 * @param {SlideLayout[]} slideLayouts - Slide Layouts
 * @return {string} XML
 */
function makeXmlSlideLayoutRel(layoutNumber, slideLayouts) {
    return slideObjectRelationsToXml(slideLayouts[layoutNumber - 1], [
        {
            target: '../slideMasters/slideMaster1.xml',
            type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster',
        },
    ]);
}
/**
 * Creates `ppt/_rels/slide*.xml.rels`
 * @param {PresSlide[]} slides
 * @param {SlideLayout[]} slideLayouts - Slide Layout(s)
 * @param {number} `slideNumber` 1-indexed number of a layout that relations are generated for
 * @return {string} XML
 */
function makeXmlSlideRel(slides, slideLayouts, slideNumber) {
    return slideObjectRelationsToXml(slides[slideNumber - 1], [
        {
            target: "../slideLayouts/slideLayout".concat(getLayoutIdxForSlide(slides, slideLayouts, slideNumber), ".xml"),
            type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout',
        },
        {
            target: "../notesSlides/notesSlide".concat(slideNumber, ".xml"),
            type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide',
        },
    ]);
}
/**
 * Generates XML string for a slide relation file.
 * @param {number} slideNumber - 1-indexed number of a layout that relations are generated for
 * @return {string} XML
 */
function makeXmlNotesSlideRel(slideNumber) {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n\t\t<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">\n\t\t\t<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesMaster\" Target=\"../notesMasters/notesMaster1.xml\"/>\n\t\t\t<Relationship Id=\"rId2\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide\" Target=\"../slides/slide".concat(slideNumber, ".xml\"/>\n\t\t</Relationships>");
}
/**
 * Creates `ppt/slideMasters/_rels/slideMaster1.xml.rels`
 * @param {PresSlide} masterSlide - Slide object
 * @param {SlideLayout[]} slideLayouts - Slide Layouts
 * @return {string} XML
 */
function makeXmlMasterRel(masterSlide, slideLayouts) {
    var defaultRels = slideLayouts.map(function (_layoutDef, idx) { return ({
        target: "../slideLayouts/slideLayout".concat(idx + 1, ".xml"),
        type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout',
    }); });
    defaultRels.push({ target: '../theme/theme1.xml', type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme' });
    return slideObjectRelationsToXml(masterSlide, defaultRels);
}
/**
 * Creates `ppt/notesMasters/_rels/notesMaster1.xml.rels`
 * @return {string} XML
 */
function makeXmlNotesMasterRel() {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>".concat(CRLF, "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">\n\t\t<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme\" Target=\"../theme/theme1.xml\"/>\n\t\t</Relationships>");
}
/**
 * For the passed slide number, resolves name of a layout that is used for.
 * @param {PresSlide[]} slides - srray of slides
 * @param {SlideLayout[]} slideLayouts - array of slideLayouts
 * @param {number} slideNumber
 * @return {number} slide number
 */
function getLayoutIdxForSlide(slides, slideLayouts, slideNumber) {
    for (var i = 0; i < slideLayouts.length; i++) {
        if (slideLayouts[i]._name === slides[slideNumber - 1]._slideLayout._name) {
            return i + 1;
        }
    }
    // IMPORTANT: Return 1 (for `slideLayout1.xml`) when no def is found
    // So all objects are in Layout1 and every slide that references it uses this layout.
    return 1;
}
// XML-GEN: Last 5 functions create root /ppt files
/**
 * Creates `ppt/theme/theme1.xml`
 * @return {string} XML
 */
function makeXmlTheme(pres) {
    var _a, _b, _c, _d;
    var majorFont = ((_a = pres.theme) === null || _a === void 0 ? void 0 : _a.headFontFace) ? "<a:latin typeface=\"".concat((_b = pres.theme) === null || _b === void 0 ? void 0 : _b.headFontFace, "\"/>") : '<a:latin typeface="Calibri Light" panose="020F0302020204030204"/>';
    var minorFont = ((_c = pres.theme) === null || _c === void 0 ? void 0 : _c.bodyFontFace) ? "<a:latin typeface=\"".concat((_d = pres.theme) === null || _d === void 0 ? void 0 : _d.bodyFontFace, "\"/>") : '<a:latin typeface="Calibri" panose="020F0502020204030204"/>';
    return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><a:theme xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" name=\"Office Theme\"><a:themeElements><a:clrScheme name=\"Office\"><a:dk1><a:sysClr val=\"windowText\" lastClr=\"000000\"/></a:dk1><a:lt1><a:sysClr val=\"window\" lastClr=\"FFFFFF\"/></a:lt1><a:dk2><a:srgbClr val=\"44546A\"/></a:dk2><a:lt2><a:srgbClr val=\"E7E6E6\"/></a:lt2><a:accent1><a:srgbClr val=\"4472C4\"/></a:accent1><a:accent2><a:srgbClr val=\"ED7D31\"/></a:accent2><a:accent3><a:srgbClr val=\"A5A5A5\"/></a:accent3><a:accent4><a:srgbClr val=\"FFC000\"/></a:accent4><a:accent5><a:srgbClr val=\"5B9BD5\"/></a:accent5><a:accent6><a:srgbClr val=\"70AD47\"/></a:accent6><a:hlink><a:srgbClr val=\"0563C1\"/></a:hlink><a:folHlink><a:srgbClr val=\"954F72\"/></a:folHlink></a:clrScheme><a:fontScheme name=\"Office\"><a:majorFont>".concat(majorFont, "<a:ea typeface=\"\"/><a:cs typeface=\"\"/><a:font script=\"Jpan\" typeface=\"\u6E38\u30B4\u30B7\u30C3\u30AF Light\"/><a:font script=\"Hang\" typeface=\"\uB9D1\uC740 \uACE0\uB515\"/><a:font script=\"Hans\" typeface=\"\u7B49\u7EBF Light\"/><a:font script=\"Hant\" typeface=\"\u65B0\u7D30\u660E\u9AD4\"/><a:font script=\"Arab\" typeface=\"Times New Roman\"/><a:font script=\"Hebr\" typeface=\"Times New Roman\"/><a:font script=\"Thai\" typeface=\"Angsana New\"/><a:font script=\"Ethi\" typeface=\"Nyala\"/><a:font script=\"Beng\" typeface=\"Vrinda\"/><a:font script=\"Gujr\" typeface=\"Shruti\"/><a:font script=\"Khmr\" typeface=\"MoolBoran\"/><a:font script=\"Knda\" typeface=\"Tunga\"/><a:font script=\"Guru\" typeface=\"Raavi\"/><a:font script=\"Cans\" typeface=\"Euphemia\"/><a:font script=\"Cher\" typeface=\"Plantagenet Cherokee\"/><a:font script=\"Yiii\" typeface=\"Microsoft Yi Baiti\"/><a:font script=\"Tibt\" typeface=\"Microsoft Himalaya\"/><a:font script=\"Thaa\" typeface=\"MV Boli\"/><a:font script=\"Deva\" typeface=\"Mangal\"/><a:font script=\"Telu\" typeface=\"Gautami\"/><a:font script=\"Taml\" typeface=\"Latha\"/><a:font script=\"Syrc\" typeface=\"Estrangelo Edessa\"/><a:font script=\"Orya\" typeface=\"Kalinga\"/><a:font script=\"Mlym\" typeface=\"Kartika\"/><a:font script=\"Laoo\" typeface=\"DokChampa\"/><a:font script=\"Sinh\" typeface=\"Iskoola Pota\"/><a:font script=\"Mong\" typeface=\"Mongolian Baiti\"/><a:font script=\"Viet\" typeface=\"Times New Roman\"/><a:font script=\"Uigh\" typeface=\"Microsoft Uighur\"/><a:font script=\"Geor\" typeface=\"Sylfaen\"/><a:font script=\"Armn\" typeface=\"Arial\"/><a:font script=\"Bugi\" typeface=\"Leelawadee UI\"/><a:font script=\"Bopo\" typeface=\"Microsoft JhengHei\"/><a:font script=\"Java\" typeface=\"Javanese Text\"/><a:font script=\"Lisu\" typeface=\"Segoe UI\"/><a:font script=\"Mymr\" typeface=\"Myanmar Text\"/><a:font script=\"Nkoo\" typeface=\"Ebrima\"/><a:font script=\"Olck\" typeface=\"Nirmala UI\"/><a:font script=\"Osma\" typeface=\"Ebrima\"/><a:font script=\"Phag\" typeface=\"Phagspa\"/><a:font script=\"Syrn\" typeface=\"Estrangelo Edessa\"/><a:font script=\"Syrj\" typeface=\"Estrangelo Edessa\"/><a:font script=\"Syre\" typeface=\"Estrangelo Edessa\"/><a:font script=\"Sora\" typeface=\"Nirmala UI\"/><a:font script=\"Tale\" typeface=\"Microsoft Tai Le\"/><a:font script=\"Talu\" typeface=\"Microsoft New Tai Lue\"/><a:font script=\"Tfng\" typeface=\"Ebrima\"/></a:majorFont><a:minorFont>").concat(minorFont, "<a:ea typeface=\"\"/><a:cs typeface=\"\"/><a:font script=\"Jpan\" typeface=\"\u6E38\u30B4\u30B7\u30C3\u30AF\"/><a:font script=\"Hang\" typeface=\"\uB9D1\uC740 \uACE0\uB515\"/><a:font script=\"Hans\" typeface=\"\u7B49\u7EBF\"/><a:font script=\"Hant\" typeface=\"\u65B0\u7D30\u660E\u9AD4\"/><a:font script=\"Arab\" typeface=\"Arial\"/><a:font script=\"Hebr\" typeface=\"Arial\"/><a:font script=\"Thai\" typeface=\"Cordia New\"/><a:font script=\"Ethi\" typeface=\"Nyala\"/><a:font script=\"Beng\" typeface=\"Vrinda\"/><a:font script=\"Gujr\" typeface=\"Shruti\"/><a:font script=\"Khmr\" typeface=\"DaunPenh\"/><a:font script=\"Knda\" typeface=\"Tunga\"/><a:font script=\"Guru\" typeface=\"Raavi\"/><a:font script=\"Cans\" typeface=\"Euphemia\"/><a:font script=\"Cher\" typeface=\"Plantagenet Cherokee\"/><a:font script=\"Yiii\" typeface=\"Microsoft Yi Baiti\"/><a:font script=\"Tibt\" typeface=\"Microsoft Himalaya\"/><a:font script=\"Thaa\" typeface=\"MV Boli\"/><a:font script=\"Deva\" typeface=\"Mangal\"/><a:font script=\"Telu\" typeface=\"Gautami\"/><a:font script=\"Taml\" typeface=\"Latha\"/><a:font script=\"Syrc\" typeface=\"Estrangelo Edessa\"/><a:font script=\"Orya\" typeface=\"Kalinga\"/><a:font script=\"Mlym\" typeface=\"Kartika\"/><a:font script=\"Laoo\" typeface=\"DokChampa\"/><a:font script=\"Sinh\" typeface=\"Iskoola Pota\"/><a:font script=\"Mong\" typeface=\"Mongolian Baiti\"/><a:font script=\"Viet\" typeface=\"Arial\"/><a:font script=\"Uigh\" typeface=\"Microsoft Uighur\"/><a:font script=\"Geor\" typeface=\"Sylfaen\"/><a:font script=\"Armn\" typeface=\"Arial\"/><a:font script=\"Bugi\" typeface=\"Leelawadee UI\"/><a:font script=\"Bopo\" typeface=\"Microsoft JhengHei\"/><a:font script=\"Java\" typeface=\"Javanese Text\"/><a:font script=\"Lisu\" typeface=\"Segoe UI\"/><a:font script=\"Mymr\" typeface=\"Myanmar Text\"/><a:font script=\"Nkoo\" typeface=\"Ebrima\"/><a:font script=\"Olck\" typeface=\"Nirmala UI\"/><a:font script=\"Osma\" typeface=\"Ebrima\"/><a:font script=\"Phag\" typeface=\"Phagspa\"/><a:font script=\"Syrn\" typeface=\"Estrangelo Edessa\"/><a:font script=\"Syrj\" typeface=\"Estrangelo Edessa\"/><a:font script=\"Syre\" typeface=\"Estrangelo Edessa\"/><a:font script=\"Sora\" typeface=\"Nirmala UI\"/><a:font script=\"Tale\" typeface=\"Microsoft Tai Le\"/><a:font script=\"Talu\" typeface=\"Microsoft New Tai Lue\"/><a:font script=\"Tfng\" typeface=\"Ebrima\"/></a:minorFont></a:fontScheme><a:fmtScheme name=\"Office\"><a:fillStyleLst><a:solidFill><a:schemeClr val=\"phClr\"/></a:solidFill><a:gradFill rotWithShape=\"1\"><a:gsLst><a:gs pos=\"0\"><a:schemeClr val=\"phClr\"><a:lumMod val=\"110000\"/><a:satMod val=\"105000\"/><a:tint val=\"67000\"/></a:schemeClr></a:gs><a:gs pos=\"50000\"><a:schemeClr val=\"phClr\"><a:lumMod val=\"105000\"/><a:satMod val=\"103000\"/><a:tint val=\"73000\"/></a:schemeClr></a:gs><a:gs pos=\"100000\"><a:schemeClr val=\"phClr\"><a:lumMod val=\"105000\"/><a:satMod val=\"109000\"/><a:tint val=\"81000\"/></a:schemeClr></a:gs></a:gsLst><a:lin ang=\"5400000\" scaled=\"0\"/></a:gradFill><a:gradFill rotWithShape=\"1\"><a:gsLst><a:gs pos=\"0\"><a:schemeClr val=\"phClr\"><a:satMod val=\"103000\"/><a:lumMod val=\"102000\"/><a:tint val=\"94000\"/></a:schemeClr></a:gs><a:gs pos=\"50000\"><a:schemeClr val=\"phClr\"><a:satMod val=\"110000\"/><a:lumMod val=\"100000\"/><a:shade val=\"100000\"/></a:schemeClr></a:gs><a:gs pos=\"100000\"><a:schemeClr val=\"phClr\"><a:lumMod val=\"99000\"/><a:satMod val=\"120000\"/><a:shade val=\"78000\"/></a:schemeClr></a:gs></a:gsLst><a:lin ang=\"5400000\" scaled=\"0\"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w=\"6350\" cap=\"flat\" cmpd=\"sng\" algn=\"ctr\"><a:solidFill><a:schemeClr val=\"phClr\"/></a:solidFill><a:prstDash val=\"solid\"/><a:miter lim=\"800000\"/></a:ln><a:ln w=\"12700\" cap=\"flat\" cmpd=\"sng\" algn=\"ctr\"><a:solidFill><a:schemeClr val=\"phClr\"/></a:solidFill><a:prstDash val=\"solid\"/><a:miter lim=\"800000\"/></a:ln><a:ln w=\"19050\" cap=\"flat\" cmpd=\"sng\" algn=\"ctr\"><a:solidFill><a:schemeClr val=\"phClr\"/></a:solidFill><a:prstDash val=\"solid\"/><a:miter lim=\"800000\"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad=\"57150\" dist=\"19050\" dir=\"5400000\" algn=\"ctr\" rotWithShape=\"0\"><a:srgbClr val=\"000000\"><a:alpha val=\"63000\"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val=\"phClr\"/></a:solidFill><a:solidFill><a:schemeClr val=\"phClr\"><a:tint val=\"95000\"/><a:satMod val=\"170000\"/></a:schemeClr></a:solidFill><a:gradFill rotWithShape=\"1\"><a:gsLst><a:gs pos=\"0\"><a:schemeClr val=\"phClr\"><a:tint val=\"93000\"/><a:satMod val=\"150000\"/><a:shade val=\"98000\"/><a:lumMod val=\"102000\"/></a:schemeClr></a:gs><a:gs pos=\"50000\"><a:schemeClr val=\"phClr\"><a:tint val=\"98000\"/><a:satMod val=\"130000\"/><a:shade val=\"90000\"/><a:lumMod val=\"103000\"/></a:schemeClr></a:gs><a:gs pos=\"100000\"><a:schemeClr val=\"phClr\"><a:shade val=\"63000\"/><a:satMod val=\"120000\"/></a:schemeClr></a:gs></a:gsLst><a:lin ang=\"5400000\" scaled=\"0\"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/><a:extLst><a:ext uri=\"{05A4C25C-085E-4340-85A3-A5531E510DB2}\"><thm15:themeFamily xmlns:thm15=\"http://schemas.microsoft.com/office/thememl/2012/main\" name=\"Office Theme\" id=\"{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}\" vid=\"{4A3C46E8-61CC-4603-A589-7422A47A8E4A}\"/></a:ext></a:extLst></a:theme>");
}
/**
 * Create presentation file (`ppt/presentation.xml`)
 * @see https://docs.microsoft.com/en-us/office/open-xml/structure-of-a-presentationml-document
 * @see http://www.datypic.com/sc/ooxml/t-p_CT_Presentation.html
 * @param {IPresentationProps} pres - presentation
 * @return {string} XML
 */
function makeXmlPresentation(pres) {
    var strXml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>".concat(CRLF) +
        '<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
        "xmlns:p=\"http://schemas.openxmlformats.org/presentationml/2006/main\" ".concat(pres.rtlMode ? 'rtl="1"' : '', " saveSubsetFonts=\"1\" autoCompressPictures=\"0\">");
    // STEP 1: Add slide master (SPEC: tag 1 under <presentation>)
    strXml += '<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>';
    // STEP 2: Add all Slides (SPEC: tag 3 under <presentation>)
    strXml += '<p:sldIdLst>';
    pres.slides.forEach(function (slide) { return (strXml += "<p:sldId id=\"".concat(slide._slideId, "\" r:id=\"rId").concat(slide._rId, "\"/>")); });
    strXml += '</p:sldIdLst>';
    // STEP 3: Add Notes Master (SPEC: tag 2 under <presentation>)
    // (NOTE: length+2 is from `presentation.xml.rels` func (since we have to match this rId, we just use same logic))
    // IMPORTANT: In this order (matches PPT2019) PPT will give corruption message on open!
    // IMPORTANT: Placing this before `<p:sldIdLst>` causes warning in modern powerpoint!
    // IMPORTANT: Presentations open without warning Without this line, however, the pres isnt preview in Finder anymore or viewable in iOS!
    strXml += "<p:notesMasterIdLst><p:notesMasterId r:id=\"rId".concat(pres.slides.length + 2, "\"/></p:notesMasterIdLst>");
    // STEP 4: Add sizes
    strXml += "<p:sldSz cx=\"".concat(pres.presLayout.width, "\" cy=\"").concat(pres.presLayout.height, "\"/>");
    strXml += "<p:notesSz cx=\"".concat(pres.presLayout.height, "\" cy=\"").concat(pres.presLayout.width, "\"/>");
    // STEP 5: Add text styles
    strXml += '<p:defaultTextStyle>';
    for (var idy = 1; idy < 10; idy++) {
        strXml +=
            "<a:lvl".concat(idy, "pPr marL=\"").concat((idy - 1) * 457200, "\" algn=\"l\" defTabSz=\"914400\" rtl=\"0\" eaLnBrk=\"1\" latinLnBrk=\"0\" hangingPunct=\"1\">") +
                '<a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/>' +
                "</a:defRPr></a:lvl".concat(idy, "pPr>");
    }
    strXml += '</p:defaultTextStyle>';
    // STEP 6: Add Sections (if any)
    if (pres.sections && pres.sections.length > 0) {
        strXml += '<p:extLst><p:ext uri="{521415D9-36F7-43E2-AB2F-B90AF26B5E84}">';
        strXml += '<p14:sectionLst xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main">';
        pres.sections.forEach(function (sect) {
            strXml += "<p14:section name=\"".concat(encodeXmlEntities(sect.title), "\" id=\"{").concat(getUuid('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'), "}\"><p14:sldIdLst>");
            sect._slides.forEach(function (slide) { return (strXml += "<p14:sldId id=\"".concat(slide._slideId, "\"/>")); });
            strXml += '</p14:sldIdLst></p14:section>';
        });
        strXml += '</p14:sectionLst></p:ext>';
        strXml += '<p:ext uri="{EFAFB233-063F-42B5-8137-9DF3F51BA10A}"><p15:sldGuideLst xmlns:p15="http://schemas.microsoft.com/office/powerpoint/2012/main"/></p:ext>';
        strXml += '</p:extLst>';
    }
    // Done
    strXml += '</p:presentation>';
    return strXml;
}
/**
 * Create `ppt/presProps.xml`
 * @return {string} XML
 */
function makeXmlPresProps() {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>".concat(CRLF, "<p:presentationPr xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:p=\"http://schemas.openxmlformats.org/presentationml/2006/main\"/>");
}
/**
 * Create `ppt/tableStyles.xml`
 * @see: http://openxmldeveloper.org/discussions/formats/f/13/p/2398/8107.aspx
 * @return {string} XML
 */
function makeXmlTableStyles() {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>".concat(CRLF, "<a:tblStyleLst xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" def=\"{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}\"/>");
}
/**
 * Creates `ppt/viewProps.xml`
 * @return {string} XML
 */
function makeXmlViewProps() {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>".concat(CRLF, "<p:viewPr xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:p=\"http://schemas.openxmlformats.org/presentationml/2006/main\"><p:normalViewPr horzBarState=\"maximized\"><p:restoredLeft sz=\"15611\"/><p:restoredTop sz=\"94610\"/></p:normalViewPr><p:slideViewPr><p:cSldViewPr snapToGrid=\"0\" snapToObjects=\"1\"><p:cViewPr varScale=\"1\"><p:scale><a:sx n=\"136\" d=\"100\"/><a:sy n=\"136\" d=\"100\"/></p:scale><p:origin x=\"216\" y=\"312\"/></p:cViewPr><p:guideLst/></p:cSldViewPr></p:slideViewPr><p:notesTextViewPr><p:cViewPr><p:scale><a:sx n=\"1\" d=\"1\"/><a:sy n=\"1\" d=\"1\"/></p:scale><p:origin x=\"0\" y=\"0\"/></p:cViewPr></p:notesTextViewPr><p:gridSpacing cx=\"76200\" cy=\"76200\"/></p:viewPr>");
}

/**
 *  :: pptxgen.ts ::
 *
 *  JavaScript framework that creates PowerPoint (pptx) presentations
 *  https://github.com/gitbrent/PptxGenJS
 *
 *  This framework is released under the MIT Public License (MIT)
 *
 *  PptxGenJS (C) 2015-present Brent Ely -- https://github.com/gitbrent
 *
 *  Some code derived from the OfficeGen project:
 *  github.com/Ziv-Barber/officegen/ (Copyright 2013 Ziv Barber)
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */
var VERSION = '3.12.0';
var PptxGenJS = /** @class */ (function () {
    function PptxGenJS() {
        var _this = this;
        /**
         * PptxGenJS Library Version
         */
        this._version = VERSION;
        // Exposed class props
        this._alignH = AlignH;
        this._alignV = AlignV;
        this._chartType = ChartType;
        this._outputType = OutputType;
        this._schemeColor = SchemeColor;
        this._shapeType = ShapeType;
        /**
         * @depricated use `ChartType`
         */
        this._charts = CHART_TYPE;
        /**
         * @depricated use `SchemeColor`
         */
        this._colors = SCHEME_COLOR_NAMES;
        /**
         * @depricated use `ShapeType`
         */
        this._shapes = SHAPE_TYPE;
        /**
         * Provides an API for `addTableDefinition` to create slides as needed for auto-paging
         * @param {AddSlideProps} options - slide masterName and/or sectionTitle
         * @return {PresSlide} new Slide
         */
        this.addNewSlide = function (options) {
            // Continue using sections if the first slide using auto-paging has a Section
            var sectAlreadyInUse = _this.sections.length > 0 &&
                _this.sections[_this.sections.length - 1]._slides.filter(function (slide) { return slide._slideNum === _this.slides[_this.slides.length - 1]._slideNum; }).length > 0;
            options.sectionTitle = sectAlreadyInUse ? _this.sections[_this.sections.length - 1].title : null;
            return _this.addSlide(options);
        };
        /**
         * Provides an API for `addTableDefinition` to get slide reference by number
         * @param {number} slideNum - slide number
         * @return {PresSlide} Slide
         * @since 3.0.0
         */
        this.getSlide = function (slideNum) { return _this.slides.filter(function (slide) { return slide._slideNum === slideNum; })[0]; };
        /**
         * Enables the `Slide` class to set PptxGenJS [Presentation] master/layout slidenumbers
         * @param {SlideNumberProps} slideNum - slide number config
         */
        this.setSlideNumber = function (slideNum) {
            // 1: Add slideNumber to slideMaster1.xml
            _this.masterSlide._slideNumberProps = slideNum;
            // 2: Add slideNumber to DEF_PRES_LAYOUT_NAME layout
            _this.slideLayouts.filter(function (layout) { return layout._name === DEF_PRES_LAYOUT_NAME; })[0]._slideNumberProps = slideNum;
        };
        /**
         * Create all chart and media rels for this Presentation
         * @param {PresSlide | SlideLayout} slide - slide with rels
         * @param {JSZip} zip - JSZip instance
         * @param {Promise<string>[]} chartPromises - promise array
         */
        this.createChartMediaRels = function (slide, zip, chartPromises) {
            slide._relsChart.forEach(function (rel) { return chartPromises.push(createExcelWorksheet(rel, zip)); });
            slide._relsMedia.forEach(function (rel) {
                if (rel.type !== 'online' && rel.type !== 'hyperlink') {
                    // A: Loop vars
                    var data = rel.data && typeof rel.data === 'string' ? rel.data : '';
                    // B: Users will undoubtedly pass various string formats, so correct prefixes as needed
                    if (!data.includes(',') && !data.includes(';'))
                        data = 'image/png;base64,' + data;
                    else if (!data.includes(','))
                        data = 'image/png;base64,' + data;
                    else if (!data.includes(';'))
                        data = 'image/png;' + data;
                    // C: Add media
                    zip.file(rel.Target.replace('..', 'ppt'), data.split(',').pop(), { base64: true });
                }
            });
        };
        /**
         * Create and export the .pptx file
         * @param {string} exportName - output file type
         * @param {Blob} blobContent - Blob content
         * @return {Promise<string>} Promise with file name
         */
        this.writeFileToBrowser = function (exportName, blobContent) { return __awaiter(_this, void 0, void 0, function () {
            var eleLink, url_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eleLink = document.createElement('a');
                        eleLink.setAttribute('style', 'display:none;');
                        eleLink.dataset.interception = 'off'; // @see https://docs.microsoft.com/en-us/sharepoint/dev/spfx/hyperlinking
                        document.body.appendChild(eleLink);
                        if (!window.URL.createObjectURL) return [3 /*break*/, 2];
                        url_1 = window.URL.createObjectURL(new Blob([blobContent], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }));
                        eleLink.href = url_1;
                        eleLink.download = exportName;
                        eleLink.click();
                        // Clean-up (NOTE: Add a slight delay before removing to avoid 'blob:null' error in Firefox Issue#81)
                        setTimeout(function () {
                            window.URL.revokeObjectURL(url_1);
                            document.body.removeChild(eleLink);
                        }, 100);
                        return [4 /*yield*/, Promise.resolve(exportName)];
                    case 1: 
                    // Done
                    return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Create and export the .pptx file
         * @param {WRITE_OUTPUT_TYPE} outputType - output file type
         * @return {Promise<string | ArrayBuffer | Blob | Buffer | Uint8Array>} Promise with data or stream (node) or filename (browser)
         */
        this.exportPresentation = function (props) { return __awaiter(_this, void 0, void 0, function () {
            var arrChartPromises, arrMediaPromises, zip;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        arrChartPromises = [];
                        arrMediaPromises = [];
                        zip = new JSZip__default["default"]();
                        // STEP 1: Read/Encode all Media before zip as base64 content, etc. is required
                        this.slides.forEach(function (slide) {
                            arrMediaPromises = arrMediaPromises.concat(encodeSlideMediaRels(slide));
                        });
                        this.slideLayouts.forEach(function (layout) {
                            arrMediaPromises = arrMediaPromises.concat(encodeSlideMediaRels(layout));
                        });
                        arrMediaPromises = arrMediaPromises.concat(encodeSlideMediaRels(this.masterSlide));
                        return [4 /*yield*/, Promise.all(arrMediaPromises).then(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            // A: Add empty placeholder objects to slides that don't already have them
                                            this.slides.forEach(function (slide) {
                                                if (slide._slideLayout)
                                                    addPlaceholdersToSlideLayouts(slide);
                                            });
                                            // B: Add all required folders and files
                                            zip.folder('_rels');
                                            zip.folder('docProps');
                                            zip.folder('ppt').folder('_rels');
                                            zip.folder('ppt/charts').folder('_rels');
                                            zip.folder('ppt/embeddings');
                                            zip.folder('ppt/media');
                                            zip.folder('ppt/slideLayouts').folder('_rels');
                                            zip.folder('ppt/slideMasters').folder('_rels');
                                            zip.folder('ppt/slides').folder('_rels');
                                            zip.folder('ppt/theme');
                                            zip.folder('ppt/notesMasters').folder('_rels');
                                            zip.folder('ppt/notesSlides').folder('_rels');
                                            zip.file('[Content_Types].xml', makeXmlContTypes(this.slides, this.slideLayouts, this.masterSlide)); // TODO: pass only `this` like below! 20200206
                                            zip.file('_rels/.rels', makeXmlRootRels());
                                            zip.file('docProps/app.xml', makeXmlApp(this.slides, this.company)); // TODO: pass only `this` like below! 20200206
                                            zip.file('docProps/core.xml', makeXmlCore(this.title, this.subject, this.author, this.revision)); // TODO: pass only `this` like below! 20200206
                                            zip.file('ppt/_rels/presentation.xml.rels', makeXmlPresentationRels(this.slides));
                                            zip.file('ppt/theme/theme1.xml', makeXmlTheme(this));
                                            zip.file('ppt/presentation.xml', makeXmlPresentation(this));
                                            zip.file('ppt/presProps.xml', makeXmlPresProps());
                                            zip.file('ppt/tableStyles.xml', makeXmlTableStyles());
                                            zip.file('ppt/viewProps.xml', makeXmlViewProps());
                                            // C: Create a Layout/Master/Rel/Slide file for each SlideLayout and Slide
                                            this.slideLayouts.forEach(function (layout, idx) {
                                                zip.file("ppt/slideLayouts/slideLayout".concat(idx + 1, ".xml"), makeXmlLayout(layout));
                                                zip.file("ppt/slideLayouts/_rels/slideLayout".concat(idx + 1, ".xml.rels"), makeXmlSlideLayoutRel(idx + 1, _this.slideLayouts));
                                            });
                                            this.slides.forEach(function (slide, idx) {
                                                zip.file("ppt/slides/slide".concat(idx + 1, ".xml"), makeXmlSlide(slide));
                                                zip.file("ppt/slides/_rels/slide".concat(idx + 1, ".xml.rels"), makeXmlSlideRel(_this.slides, _this.slideLayouts, idx + 1));
                                                // Create all slide notes related items. Notes of empty strings are created for slides which do not have notes specified, to keep track of _rels.
                                                zip.file("ppt/notesSlides/notesSlide".concat(idx + 1, ".xml"), makeXmlNotesSlide(slide));
                                                zip.file("ppt/notesSlides/_rels/notesSlide".concat(idx + 1, ".xml.rels"), makeXmlNotesSlideRel(idx + 1));
                                            });
                                            zip.file('ppt/slideMasters/slideMaster1.xml', makeXmlMaster(this.masterSlide, this.slideLayouts));
                                            zip.file('ppt/slideMasters/_rels/slideMaster1.xml.rels', makeXmlMasterRel(this.masterSlide, this.slideLayouts));
                                            zip.file('ppt/notesMasters/notesMaster1.xml', makeXmlNotesMaster());
                                            zip.file('ppt/notesMasters/_rels/notesMaster1.xml.rels', makeXmlNotesMasterRel());
                                            // D: Create all Rels (images, media, chart data)
                                            this.slideLayouts.forEach(function (layout) {
                                                _this.createChartMediaRels(layout, zip, arrChartPromises);
                                            });
                                            this.slides.forEach(function (slide) {
                                                _this.createChartMediaRels(slide, zip, arrChartPromises);
                                            });
                                            this.createChartMediaRels(this.masterSlide, zip, arrChartPromises);
                                            return [4 /*yield*/, Promise.all(arrChartPromises).then(function () { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                if (!(props.outputType === 'STREAM')) return [3 /*break*/, 2];
                                                                return [4 /*yield*/, zip.generateAsync({ type: 'nodebuffer', compression: props.compression ? 'DEFLATE' : 'STORE' })];
                                                            case 1: 
                                                            // A: stream file
                                                            return [2 /*return*/, _a.sent()];
                                                            case 2:
                                                                if (!props.outputType) return [3 /*break*/, 4];
                                                                return [4 /*yield*/, zip.generateAsync({ type: props.outputType })];
                                                            case 3: 
                                                            // B: Node [fs]: Output type user option or default
                                                            return [2 /*return*/, _a.sent()];
                                                            case 4: return [4 /*yield*/, zip.generateAsync({ type: 'blob', compression: props.compression ? 'DEFLATE' : 'STORE' })];
                                                            case 5: 
                                                            // C: Browser: Output blob as app/ms-pptx
                                                            return [2 /*return*/, _a.sent()];
                                                        }
                                                    });
                                                }); })];
                                        case 1: 
                                        // E: Wait for Promises (if any) then generate the PPTX file
                                        return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 1: 
                    // STEP 2: Wait for Promises (if any) then generate the PPTX file
                    return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        var layout4x3 = { name: 'screen4x3', width: 9144000, height: 6858000 };
        var layout16x9 = { name: 'screen16x9', width: 9144000, height: 5143500 };
        var layout16x10 = { name: 'screen16x10', width: 9144000, height: 5715000 };
        var layoutWide = { name: 'custom', width: 12192000, height: 6858000 };
        // Set available layouts
        this.LAYOUTS = {
            LAYOUT_4x3: layout4x3,
            LAYOUT_16x9: layout16x9,
            LAYOUT_16x10: layout16x10,
            LAYOUT_WIDE: layoutWide,
        };
        // Core
        this._author = 'PptxGenJS';
        this._company = 'PptxGenJS';
        this._revision = '1'; // Note: Must be a whole number
        this._subject = 'PptxGenJS Presentation';
        this._title = 'PptxGenJS Presentation';
        // PptxGenJS props
        this._presLayout = {
            name: this.LAYOUTS[DEF_PRES_LAYOUT].name,
            _sizeW: this.LAYOUTS[DEF_PRES_LAYOUT].width,
            _sizeH: this.LAYOUTS[DEF_PRES_LAYOUT].height,
            width: this.LAYOUTS[DEF_PRES_LAYOUT].width,
            height: this.LAYOUTS[DEF_PRES_LAYOUT].height,
        };
        this._rtlMode = false;
        //
        this._slideLayouts = [
            {
                _margin: DEF_SLIDE_MARGIN_IN,
                _name: DEF_PRES_LAYOUT_NAME,
                _presLayout: this._presLayout,
                _rels: [],
                _relsChart: [],
                _relsMedia: [],
                _slide: null,
                _slideNum: 1000,
                _slideNumberProps: null,
                _slideObjects: [],
            },
        ];
        this._slides = [];
        this._sections = [];
        this._masterSlide = {
            addChart: null,
            addImage: null,
            addMedia: null,
            addNotes: null,
            addShape: null,
            addTable: null,
            addText: null,
            //
            _name: null,
            _presLayout: this._presLayout,
            _rId: null,
            _rels: [],
            _relsChart: [],
            _relsMedia: [],
            _slideId: null,
            _slideLayout: null,
            _slideNum: null,
            _slideNumberProps: null,
            _slideObjects: [],
        };
    }
    Object.defineProperty(PptxGenJS.prototype, "layout", {
        get: function () {
            return this._layout;
        },
        set: function (value) {
            var newLayout = this.LAYOUTS[value];
            if (newLayout) {
                this._layout = value;
                this._presLayout = newLayout;
            }
            else {
                throw new Error('UNKNOWN-LAYOUT');
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "version", {
        get: function () {
            return this._version;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "author", {
        get: function () {
            return this._author;
        },
        set: function (value) {
            this._author = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "company", {
        get: function () {
            return this._company;
        },
        set: function (value) {
            this._company = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "revision", {
        get: function () {
            return this._revision;
        },
        set: function (value) {
            this._revision = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "subject", {
        get: function () {
            return this._subject;
        },
        set: function (value) {
            this._subject = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "theme", {
        get: function () {
            return this._theme;
        },
        set: function (value) {
            this._theme = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            this._title = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "rtlMode", {
        get: function () {
            return this._rtlMode;
        },
        set: function (value) {
            this._rtlMode = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "masterSlide", {
        get: function () {
            return this._masterSlide;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "slides", {
        get: function () {
            return this._slides;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "sections", {
        get: function () {
            return this._sections;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "slideLayouts", {
        get: function () {
            return this._slideLayouts;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "AlignH", {
        get: function () {
            return this._alignH;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "AlignV", {
        get: function () {
            return this._alignV;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "ChartType", {
        get: function () {
            return this._chartType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "OutputType", {
        get: function () {
            return this._outputType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "presLayout", {
        get: function () {
            return this._presLayout;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "SchemeColor", {
        get: function () {
            return this._schemeColor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "ShapeType", {
        get: function () {
            return this._shapeType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "charts", {
        get: function () {
            return this._charts;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "colors", {
        get: function () {
            return this._colors;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PptxGenJS.prototype, "shapes", {
        get: function () {
            return this._shapes;
        },
        enumerable: false,
        configurable: true
    });
    // EXPORT METHODS
    /**
     * Export the current Presentation to stream
     * @param {WriteBaseProps} props - output properties
     * @returns {Promise<string | ArrayBuffer | Blob | Buffer | Uint8Array>} file stream
     */
    PptxGenJS.prototype.stream = function (props) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.exportPresentation({
                            compression: props === null || props === void 0 ? void 0 : props.compression,
                            outputType: 'STREAM',
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Export the current Presentation as JSZip content with the selected type
     * @param {WriteProps} props output properties
     * @returns {Promise<string | ArrayBuffer | Blob | Buffer | Uint8Array>} file content in selected type
     */
    PptxGenJS.prototype.write = function (props) {
        return __awaiter(this, void 0, void 0, function () {
            var propsOutpType, propsCompress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        propsOutpType = typeof props === 'object' && (props === null || props === void 0 ? void 0 : props.outputType) ? props.outputType : props ? props : null;
                        propsCompress = typeof props === 'object' && (props === null || props === void 0 ? void 0 : props.compression) ? props.compression : false;
                        return [4 /*yield*/, this.exportPresentation({
                                compression: propsCompress,
                                outputType: propsOutpType,
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Export the current Presentation. Writes file to local file system if `fs` exists, otherwise, initiates download in browsers
     * @param {WriteFileProps} props - output file properties
     * @returns {Promise<string>} the presentation name
     */
    PptxGenJS.prototype.writeFile = function (props) {
        return __awaiter(this, void 0, void 0, function () {
            var fs, propsExpName, propsCompress, fileName;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fs = typeof require !== 'undefined' && typeof window === 'undefined' ? require('fs') : null // NodeJS
                        ;
                        // DEPRECATED: @deprecated v3.5.0 - fileName - [[remove in v4.0.0]]
                        if (typeof props === 'string')
                            console.log('Warning: `writeFile(filename)` is deprecated - please use `WriteFileProps` argument (v3.5.0)');
                        propsExpName = typeof props === 'object' && (props === null || props === void 0 ? void 0 : props.fileName) ? props.fileName : typeof props === 'string' ? props : '';
                        propsCompress = typeof props === 'object' && (props === null || props === void 0 ? void 0 : props.compression) ? props.compression : false;
                        fileName = propsExpName ? (propsExpName.toString().toLowerCase().endsWith('.pptx') ? propsExpName : propsExpName + '.pptx') : 'Presentation.pptx';
                        return [4 /*yield*/, this.exportPresentation({
                                compression: propsCompress,
                                outputType: fs ? 'nodebuffer' : null,
                            }).then(function (content) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!fs) return [3 /*break*/, 2];
                                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                    fs.writeFile(fileName, content, function (err) {
                                                        if (err) {
                                                            reject(err);
                                                        }
                                                        else {
                                                            resolve(fileName);
                                                        }
                                                    });
                                                })];
                                        case 1: 
                                        // Node: Output
                                        return [2 /*return*/, _a.sent()];
                                        case 2: return [4 /*yield*/, this.writeFileToBrowser(fileName, content)];
                                        case 3: 
                                        // Browser: Output blob as app/ms-pptx
                                        return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // PRESENTATION METHODS
    /**
     * Add a new Section to Presentation
     * @param {ISectionProps} section - section properties
     * @example pptx.addSection({ title:'Charts' });
     */
    PptxGenJS.prototype.addSection = function (section) {
        if (!section)
            console.warn('addSection requires an argument');
        else if (!section.title)
            console.warn('addSection requires a title');
        var newSection = {
            _type: 'user',
            _slides: [],
            title: section.title,
        };
        if (section.order)
            this.sections.splice(section.order, 0, newSection);
        else
            this._sections.push(newSection);
    };
    /**
     * Add a new Slide to Presentation
     * @param {AddSlideProps} options - slide options
     * @returns {PresSlide} the new Slide
     */
    PptxGenJS.prototype.addSlide = function (options) {
        // TODO: DEPRECATED: arg0 string "masterSlideName" dep as of 3.2.0
        var masterSlideName = typeof options === 'string' ? options : (options === null || options === void 0 ? void 0 : options.masterName) ? options.masterName : '';
        var slideLayout = {
            _name: this.LAYOUTS[DEF_PRES_LAYOUT].name,
            _presLayout: this.presLayout,
            _rels: [],
            _relsChart: [],
            _relsMedia: [],
            _slideNum: this.slides.length + 1,
        };
        if (masterSlideName) {
            var tmpLayout = this.slideLayouts.filter(function (layout) { return layout._name === masterSlideName; })[0];
            if (tmpLayout)
                slideLayout = tmpLayout;
        }
        var newSlide = new Slide({
            addSlide: this.addNewSlide,
            getSlide: this.getSlide,
            presLayout: this.presLayout,
            setSlideNum: this.setSlideNumber,
            slideId: this.slides.length + 256,
            slideRId: this.slides.length + 2,
            slideNumber: this.slides.length + 1,
            slideLayout: slideLayout,
        });
        // A: Add slide to pres
        this._slides.push(newSlide);
        // B: Sections
        // B-1: Add slide to section (if any provided)
        // B-2: Handle slides without a section when sections are already is use ("loose" slides arent allowed, they all need a section)
        if (options === null || options === void 0 ? void 0 : options.sectionTitle) {
            var sect = this.sections.filter(function (section) { return section.title === options.sectionTitle; })[0];
            if (!sect)
                console.warn("addSlide: unable to find section with title: \"".concat(options.sectionTitle, "\""));
            else
                sect._slides.push(newSlide);
        }
        else if (this.sections && this.sections.length > 0 && (!(options === null || options === void 0 ? void 0 : options.sectionTitle))) {
            var lastSect = this._sections[this.sections.length - 1];
            // CASE 1: The latest section is a default type - just add this one
            if (lastSect._type === 'default')
                lastSect._slides.push(newSlide);
            // CASE 2: There latest section is NOT a default type - create the defualt, add this slide
            else {
                this._sections.push({
                    title: "Default-".concat(this.sections.filter(function (sect) { return sect._type === 'default'; }).length + 1),
                    _type: 'default',
                    _slides: [newSlide],
                });
            }
        }
        return newSlide;
    };
    /**
     * Create a custom Slide Layout in any size
     * @param {PresLayout} layout - layout properties
     * @example pptx.defineLayout({ name:'A3', width:16.5, height:11.7 });
     */
    PptxGenJS.prototype.defineLayout = function (layout) {
        // @see https://support.office.com/en-us/article/Change-the-size-of-your-slides-040a811c-be43-40b9-8d04-0de5ed79987e
        if (!layout)
            console.warn('defineLayout requires `{name, width, height}`');
        else if (!layout.name)
            console.warn('defineLayout requires `name`');
        else if (!layout.width)
            console.warn('defineLayout requires `width`');
        else if (!layout.height)
            console.warn('defineLayout requires `height`');
        else if (typeof layout.height !== 'number')
            console.warn('defineLayout `height` should be a number (inches)');
        else if (typeof layout.width !== 'number')
            console.warn('defineLayout `width` should be a number (inches)');
        this.LAYOUTS[layout.name] = {
            name: layout.name,
            _sizeW: Math.round(Number(layout.width) * EMU),
            _sizeH: Math.round(Number(layout.height) * EMU),
            width: Math.round(Number(layout.width) * EMU),
            height: Math.round(Number(layout.height) * EMU),
        };
    };
    /**
     * Create a new slide master [layout] for the Presentation
     * @param {SlideMasterProps} props - layout properties
     */
    PptxGenJS.prototype.defineSlideMaster = function (props) {
        if (!props.title)
            throw new Error('defineSlideMaster() object argument requires a `title` value. (https://gitbrent.github.io/PptxGenJS/docs/masters.html)');
        var newLayout = {
            _margin: props.margin || DEF_SLIDE_MARGIN_IN,
            _name: props.title,
            _presLayout: this.presLayout,
            _rels: [],
            _relsChart: [],
            _relsMedia: [],
            _slide: null,
            _slideNum: 1000 + this.slideLayouts.length + 1,
            _slideNumberProps: props.slideNumber || null,
            _slideObjects: [],
            background: props.background || null,
            bkgd: props.bkgd || null,
        };
        // STEP 1: Create the Slide Master/Layout
        createSlideMaster(props, newLayout);
        // STEP 2: Add it to layout defs
        this.slideLayouts.push(newLayout);
        // STEP 3: Add background (image data/path must be captured before `exportPresentation()` is called)
        if (props.background || props.bkgd)
            addBackgroundDefinition(props.background, newLayout);
        // STEP 4: Add slideNumber to master slide (if any)
        if (newLayout._slideNumberProps && !this.masterSlide._slideNumberProps)
            this.masterSlide._slideNumberProps = newLayout._slideNumberProps;
    };
    // HTML-TO-SLIDES METHODS
    /**
     * Reproduces an HTML table as a PowerPoint table - including column widths, style, etc. - creates 1 or more slides as needed
     * @param {string} eleId - table HTML element ID
     * @param {TableToSlidesProps} options - generation options
     */
    PptxGenJS.prototype.tableToSlides = function (eleId, options) {
        if (options === void 0) { options = {}; }
        // @note `verbose` option is undocumented; used for verbose output of layout process
        genTableToSlides(this, eleId, options, (options === null || options === void 0 ? void 0 : options.masterSlideName) ? this.slideLayouts.filter(function (layout) { return layout._name === options.masterSlideName; })[0] : null);
    };
    return PptxGenJS;
}());

module.exports = PptxGenJS;
