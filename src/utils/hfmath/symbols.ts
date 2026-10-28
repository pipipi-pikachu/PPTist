/*
https://oeis.org/wiki/List_of_LaTeX_mathematical_symbols
https://en.wikibooks.org/wiki/LaTeX/Mathematics
*/
export interface Symb{
  glyph : number;
  arity?: number;
  flags : Record<string, boolean>;
}
const SYMB : Record<string, Symb> = {
  '\\frac': {glyph: 0, arity: 2, flags: {}},
  '\\binom': {glyph: 0, arity: 2, flags: {}},
  '\\sqrt': {glyph: 2267, arity: 1, flags: {opt: true, xfl: true, yfl: true}},
  '^': {glyph: 0, arity: 1, flags: {}},
  '_': {glyph: 0, arity: 1, flags: {}},
  '(': {glyph: 2221, arity: 0, flags: {yfl: true}},
  ')': {glyph: 2222, arity: 0, flags: {yfl: true}},
  '[': {glyph: 2223, arity: 0, flags: {yfl: true}},
  ']': {glyph: 2224, arity: 0, flags: {yfl: true}},
  '\\langle': {glyph: 2227, arity: 0, flags: {yfl: true}},
  '\\rangle': {glyph: 2228, arity: 0, flags: {yfl: true}},
  '|': {glyph: 2229, arity: 0, flags: {yfl: true}},
  
  '\\|': {glyph: 2230, arity: 0, flags: {yfl: true}},
  '\\{': {glyph: 2225, arity: 0, flags: {yfl: true}},
  '\\}': {glyph: 2226, arity: 0, flags: {yfl: true}},

  '\\#': {glyph: 2275, arity: 0, flags: {}},
  '\\$': {glyph: 2274, arity: 0, flags: {}},
  '\\&': {glyph: 2273, arity: 0, flags: {}},
  '\\%': {glyph: 2271, arity: 0, flags: {}},

  /* semantics*/
  '\\begin': {glyph: 0, arity: 1, flags: {}},
  '\\end': {glyph: 0, arity: 1, flags: {}},
  '\\left': {glyph: 0, arity: 1, flags: {}},
  '\\right': {glyph: 0, arity: 1, flags: {}},
  '\\middle': {glyph: 0, arity: 1, flags: {}},

  /* operators*/
  '\\cdot': {glyph: 2236, arity: 0, flags: {}},
  '\\pm': {glyph: 2233, arity: 0, flags: {}},
  '\\mp': {glyph: 2234, arity: 0, flags: {}},
  '\\times': {glyph: 2235, arity: 0, flags: {}},
  '\\div': {glyph: 2237, arity: 0, flags: {}},
  '\\leqq': {glyph: 2243, arity: 0, flags: {}},
  '\\geqq': {glyph: 2244, arity: 0, flags: {}},
  '\\leq': {glyph: 2243, arity: 0, flags: {}},
  '\\geq': {glyph: 2244, arity: 0, flags: {}},
  '\\propto': {glyph: 2245, arity: 0, flags: {}},
  '\\sim': {glyph: 2246, arity: 0, flags: {}},
  '\\equiv': {glyph: 2240, arity: 0, flags: {}},
  '\\dagger': {glyph: 2277, arity: 0, flags: {}},
  '\\ddagger': {glyph: 2278, arity: 0, flags: {}},
  '\\ell': {glyph: 662, arity: 0, flags: {}},

  
  /* accents*/
  '\\vec': {glyph: 2261, arity: 1, flags: {hat: true, xfl: true, yfl: true}},
  '\\overrightarrow': {glyph: 2261, arity: 1, flags: {hat: true, xfl: true, yfl: true}},
  '\\overleftarrow': {glyph: 2263, arity: 1, flags: {hat: true, xfl: true, yfl: true}},
  '\\bar': {glyph: 2231, arity: 1, flags: {hat: true, xfl: true}},
  '\\overline': {glyph: 2231, arity: 1, flags: {hat: true, xfl: true}},
  '\\widehat': {glyph: 2247, arity: 1, flags: {hat: true, xfl: true, yfl: true}},
  '\\hat': {glyph: 2247, arity: 1, flags: {hat: true}},
  '\\acute': {glyph: 2248, arity: 1, flags: {hat: true}},
  '\\grave': {glyph: 2249, arity: 1, flags: {hat: true}},
  '\\breve': {glyph: 2250, arity: 1, flags: {hat: true}},
  '\\tilde': {glyph: 2246, arity: 1, flags: {hat: true}},
  '\\underline': {glyph: 2231, arity: 1, flags: {mat: true, xfl: true}},
  

  '\\not': {glyph: 2220, arity: 1, flags: {}},

  '\\neq': {glyph: 2239, arity: 1, flags: {}},
  '\\ne': {glyph: 2239, arity: 1, flags: {}},
  '\\exists': {glyph: 2279, arity: 0, flags: {}},
  '\\in': {glyph: 2260, arity: 0, flags: {}},
  '\\subset': {glyph: 2256, arity: 0, flags: {}},
  '\\supset': {glyph: 2258, arity: 0, flags: {}},
  '\\cup': {glyph: 2257, arity: 0, flags: {}},
  '\\cap': {glyph: 2259, arity: 0, flags: {}},
  '\\infty': {glyph: 2270, arity: 0, flags: {}},
  '\\partial': {glyph: 2265, arity: 0, flags: {}},
  '\\nabla': {glyph: 2266, arity: 0, flags: {}},
  '\\aleph': {glyph: 2077, arity: 0, flags: {}},
  '\\wp': {glyph: 2190, arity: 0, flags: {}},
  '\\therefore': {glyph: 740, arity: 0, flags: {}},
  '\\mid': {glyph: 2229, arity: 0, flags: {}},

  '\\sum': {glyph: 2402, arity: 0, flags: {big: true}},
  '\\prod': {glyph: 2401, arity: 0, flags: {big: true}},
  '\\bigoplus': {glyph: 2284, arity: 0, flags: {big: true}},
  '\\bigodot': {glyph: 2281, arity: 0, flags: {big: true}},
  '\\int': {glyph: 2412, arity: 0, flags: {yfl: true}},
  '\\oint': {glyph: 2269, arity: 0, flags: {yfl: true}},
  '\\oplus': {glyph: 1284, arity: 0, flags: {}},
  '\\odot': {glyph: 1281, arity: 0, flags: {}},
  '\\perp': {glyph: 738, arity: 0, flags: {}},
  '\\angle': {glyph: 739, arity: 0, flags: {}},
  '\\triangle': {glyph: 842, arity: 0, flags: {}},
  '\\Box': {glyph: 841, arity: 0, flags: {}},

  '\\rightarrow': {glyph: 2261, arity: 0, flags: {}},
  '\\to': {glyph: 2261, arity: 0, flags: {}},
  '\\leftarrow': {glyph: 2263, arity: 0, flags: {}},
  '\\gets': {glyph: 2263, arity: 0, flags: {}},
  '\\circ': {glyph: 902, arity: 0, flags: {}},
  '\\bigcirc': {glyph: 904, arity: 0, flags: {}},
  '\\bullet': {glyph: 828, arity: 0, flags: {}},
  '\\star': {glyph: 856, arity: 0, flags: {}},
  '\\diamond': {glyph: 743, arity: 0, flags: {}},
  '\\ast': {glyph: 728, arity: 0, flags: {}},

  /* verbatim symbols*/
  '\\log': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\ln': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\exp': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\mod': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\lim': {glyph: 0, arity: 0, flags: {txt: true, big: true}},

  '\\sin': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\cos': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\tan': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\csc': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\sec': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\cot': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\sinh': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\cosh': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\tanh': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\csch': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\sech': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\coth': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\arcsin': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\arccos': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\arctan': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\arccsc': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\arcsec': {glyph: 0, arity: 0, flags: {txt: true}},
  '\\arccot': {glyph: 0, arity: 0, flags: {txt: true}},

  /* font modes*/
  '\\text': {glyph: 0, arity: 1, flags: {}},
  '\\mathnormal': {glyph: 0, arity: 1, flags: {}},
  '\\mathrm': {glyph: 0, arity: 1, flags: {}},
  '\\mathit': {glyph: 0, arity: 1, flags: {}},
  '\\mathbf': {glyph: 0, arity: 1, flags: {}},
  '\\mathsf': {glyph: 0, arity: 1, flags: {}},
  '\\mathtt': {glyph: 0, arity: 1, flags: {}},
  '\\mathfrak': {glyph: 0, arity: 1, flags: {}},
  '\\mathcal': {glyph: 0, arity: 1, flags: {}},
  '\\mathbb': {glyph: 0, arity: 1, flags: {}},
  '\\mathscr': {glyph: 0, arity: 1, flags: {}},
  '\\rm': {glyph: 0, arity: 1, flags: {}},
  '\\it': {glyph: 0, arity: 1, flags: {}},
  '\\bf': {glyph: 0, arity: 1, flags: {}},
  '\\sf': {glyph: 0, arity: 1, flags: {}},
  '\\tt': {glyph: 0, arity: 1, flags: {}},
  '\\frak': {glyph: 0, arity: 1, flags: {}},
  '\\cal': {glyph: 0, arity: 1, flags: {}},
  '\\bb': {glyph: 0, arity: 1, flags: {}},
  '\\scr': {glyph: 0, arity: 1, flags: {}},

  '\\quad': {glyph: 0, arity: 0, flags: {}},
  '\\,': {glyph: 0, arity: 0, flags: {}},
  '\\.': {glyph: 0, arity: 0, flags: {}},
  '\\;': {glyph: 0, arity: 0, flags: {}},
  '\\!': {glyph: 0, arity: 0, flags: {}},

  /* greek letters*/
  '\\alpha': {glyph: 2127, flags: {}},
  '\\beta': {glyph: 2128, flags: {}},
  '\\gamma': {glyph: 2129, flags: {}},
  '\\delta': {glyph: 2130, flags: {}},
  '\\varepsilon': {glyph: 2131, flags: {}},
  '\\zeta': {glyph: 2132, flags: {}},
  '\\eta': {glyph: 2133, flags: {}},
  '\\vartheta': {glyph: 2134, flags: {}},
  '\\iota': {glyph: 2135, flags: {}},
  '\\kappa': {glyph: 2136, flags: {}},
  '\\lambda': {glyph: 2137, flags: {}},
  '\\mu': {glyph: 2138, flags: {}},
  '\\nu': {glyph: 2139, flags: {}},
  '\\xi': {glyph: 2140, flags: {}},
  '\\omicron': {glyph: 2141, flags: {}},
  '\\pi': {glyph: 2142, flags: {}},
  '\\rho': {glyph: 2143, flags: {}},
  '\\sigma': {glyph: 2144, flags: {}},
  '\\tau': {glyph: 2145, flags: {}},
  '\\upsilon': {glyph: 2146, flags: {}},
  '\\varphi': {glyph: 2147, flags: {}},
  '\\chi': {glyph: 2148, flags: {}},
  '\\psi': {glyph: 2149, flags: {}},
  '\\omega': {glyph: 2150, flags: {}},

  '\\epsilon': {glyph: 2184, flags: {}},
  '\\theta': {glyph: 2185, flags: {}},
  '\\phi': {glyph: 2186, flags: {}},
  '\\varsigma': {glyph: 2187, flags: {}},

  '\\Alpha': {glyph: 2027, flags: {}},
  '\\Beta': {glyph: 2028, flags: {}},
  '\\Gamma': {glyph: 2029, flags: {}},
  '\\Delta': {glyph: 2030, flags: {}},
  '\\Epsilon': {glyph: 2031, flags: {}},
  '\\Zeta': {glyph: 2032, flags: {}},
  '\\Eta': {glyph: 2033, flags: {}},
  '\\Theta': {glyph: 2034, flags: {}},
  '\\Iota': {glyph: 2035, flags: {}},
  '\\Kappa': {glyph: 2036, flags: {}},
  '\\Lambda': {glyph: 2037, flags: {}},
  '\\Mu': {glyph: 2038, flags: {}},
  '\\Nu': {glyph: 2039, flags: {}},
  '\\Xi': {glyph: 2040, flags: {}},
  '\\Omicron': {glyph: 2041, flags: {}},
  '\\Pi': {glyph: 2042, flags: {}},
  '\\Rho': {glyph: 2043, flags: {}},
  '\\Sigma': {glyph: 2044, flags: {}},
  '\\Tau': {glyph: 2045, flags: {}},
  '\\Upsilon': {glyph: 2046, flags: {}},
  '\\Phi': {glyph: 2047, flags: {}},
  '\\Chi': {glyph: 2048, flags: {}},
  '\\Psi': {glyph: 2049, flags: {}},
  '\\Omega': {glyph: 2050, flags: {}},




}
export {SYMB}
export function asciiMap(x:string, mode:string = 'math') : number | undefined {
  const c = x.charCodeAt(0)
  if (65 <= c && c <= 90) {
    const d = c - 65
    if (mode === 'text' || mode === 'rm') {
      return d + 2001
    }
    else if (mode === 'tt') {
      return d + 501
    }
    else if (mode === 'bf' || mode === 'bb') {
      return d + 3001
    }
    else if (mode === 'sf') {
      return d + 2501
    }
    else if (mode === 'frak') {
      return d + 3301
    }
    else if (mode === 'scr' || mode === 'cal') {
      return d + 2551
    }
    return d + 2051
    
  }
  if (97 <= c && c <= 122) {
    const d = c - 97
    if (mode === 'text' || mode === 'rm') {
      return d + 2101
    }
    else if (mode === 'tt') {
      return d + 601
    }
    else if (mode === 'bf' || mode === 'bb') {
      return d + 3101
    }
    else if (mode === 'sf') {
      return d + 2601
    }
    else if (mode === 'frak') {
      return d + 3401
    }
    else if (mode === 'scr' || mode === 'cal') {
      return d + 2651
    }
    return d + 2151
    
  }
  if (48 <= c && c <= 57) {
    const d = c - 48
    if (mode === 'it') {
      return d + 2750
    }
    else if (mode === 'bf') {
      return d + 3200
    }
    else if (mode === 'tt') {
      return d + 700
    }
    return d + 2200
    
  }

  return {
    '.': 2210,
    ',': 2211,
    ':': 2212,
    ';': 2213,
    '!': 2214,
    '?': 2215,
    "'": 2216,
    '"': 2217,
    '*': 2219,
    '/': 2220,
    '-': 2231,
    '+': 2232,
    '=': 2238,
    '<': 2241,
    '>': 2242,
    '~': 2246,
    '@': 2273,
    '\\': 804,
  }[x]
}
