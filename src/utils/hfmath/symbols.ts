export interface Symb {
  glyph : number;
  arity?: number;
  text?: string;
  size?: number;
  flags : Record<string, boolean>;
}
const SYMB : Record<string, Symb> = {
  '\\frac': {glyph: 0, arity: 2, flags: {frac: true}},
  '\\dfrac': {glyph: 0, arity: 2, flags: {frac: true}},
  '\\tfrac': {glyph: 0, arity: 2, flags: {frac: true}},
  '\\binom': {glyph: 0, arity: 2, flags: {binom: true}},
  '\\dbinom': {glyph: 0, arity: 2, flags: {binom: true}},
  '\\tbinom': {glyph: 0, arity: 2, flags: {binom: true}},
  '\\overset': {glyph: 0, arity: 2, flags: {above: true}},
  '\\stackrel': {glyph: 0, arity: 2, flags: {above: true}},
  '\\underset': {glyph: 0, arity: 2, flags: {below: true}},
  '\\operatorname': {glyph: 0, arity: 1, flags: {}},
  '\\operatorname*': {glyph: 0, arity: 1, flags: {big: true}},
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
  '\\lparen': {glyph: 2221, flags: {yfl: true}},
  '\\rparen': {glyph: 2222, flags: {yfl: true}},
  '\\lbrack': {glyph: 2223, flags: {yfl: true}},
  '\\rbrack': {glyph: 2224, flags: {yfl: true}},
  '\\lbrace': {glyph: 2225, flags: {yfl: true}},
  '\\rbrace': {glyph: 2226, flags: {yfl: true}},
  '\\lvert': {glyph: 2229, flags: {yfl: true}},
  '\\rvert': {glyph: 2229, flags: {yfl: true}},
  '\\vert': {glyph: 2229, flags: {yfl: true}},
  '\\lVert': {glyph: 2230, flags: {yfl: true}},
  '\\rVert': {glyph: 2230, flags: {yfl: true}},
  '\\Vert': {glyph: 2230, flags: {yfl: true}},
  '\\lfloor': {glyph: 5051, flags: {yfl: true}},
  '\\rfloor': {glyph: 5052, flags: {yfl: true}},
  '\\lceil': {glyph: 5053, flags: {yfl: true}},
  '\\rceil': {glyph: 5054, flags: {yfl: true}},
  '\\backslash': {glyph: 5055, flags: {yfl: true}},

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
  '\\big': {glyph: 0, arity: 1, size: 1.2, flags: {}},
  '\\bigl': {glyph: 0, arity: 1, size: 1.2, flags: {}},
  '\\bigr': {glyph: 0, arity: 1, size: 1.2, flags: {}},
  '\\bigm': {glyph: 0, arity: 1, size: 1.2, flags: {}},
  '\\Big': {glyph: 0, arity: 1, size: 1.6, flags: {}},
  '\\Bigl': {glyph: 0, arity: 1, size: 1.6, flags: {}},
  '\\Bigr': {glyph: 0, arity: 1, size: 1.6, flags: {}},
  '\\Bigm': {glyph: 0, arity: 1, size: 1.6, flags: {}},
  '\\bigg': {glyph: 0, arity: 1, size: 2, flags: {}},
  '\\biggl': {glyph: 0, arity: 1, size: 2, flags: {}},
  '\\biggr': {glyph: 0, arity: 1, size: 2, flags: {}},
  '\\biggm': {glyph: 0, arity: 1, size: 2, flags: {}},
  '\\Bigg': {glyph: 0, arity: 1, size: 2.5, flags: {}},
  '\\Biggl': {glyph: 0, arity: 1, size: 2.5, flags: {}},
  '\\Biggr': {glyph: 0, arity: 1, size: 2.5, flags: {}},
  '\\Biggm': {glyph: 0, arity: 1, size: 2.5, flags: {}},

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
  '\\otimes': {glyph: 5035, flags: {}},
  '\\ominus': {glyph: 5036, flags: {}},
  '\\oslash': {glyph: 5037, flags: {}},
  '\\uplus': {glyph: 5038, flags: {}},
  '\\parallel': {glyph: 5039, flags: {}},
  '\\nparallel': {glyph: 5040, flags: {}},
  '\\nmid': {glyph: 5041, flags: {}},
  '\\ll': {glyph: 5042, flags: {}},
  '\\gg': {glyph: 5043, flags: {}},
  '\\cong': {glyph: 5044, flags: {}},
  '\\asymp': {glyph: 5045, flags: {}},
  '\\prec': {glyph: 5046, flags: {}},
  '\\succ': {glyph: 5047, flags: {}},
  '\\preceq': {glyph: 5048, flags: {}},
  '\\succeq': {glyph: 5049, flags: {}},
  '\\vdash': {glyph: 5056, flags: {}},
  '\\dashv': {glyph: 5057, flags: {}},
  '\\models': {glyph: 5058, flags: {}},

  /* ellipses: dots selects the baseline or centered form from its context. */
  '\\dots': {glyph: 5030, flags: {}},
  '\\ldots': {glyph: 5030, flags: {}},
  '\\cdots': {glyph: 5031, flags: {}},
  '\\vdots': {glyph: 5032, flags: {}},
  '\\ddots': {glyph: 5033, flags: {}},

  
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
  '\\dot': {glyph: 2236, arity: 1, flags: {hat: true}},
  '\\ddot': {glyph: 5034, arity: 1, flags: {hat: true}},
  '\\check': {glyph: 5059, arity: 1, flags: {hat: true}},
  '\\mathring': {glyph: 5060, arity: 1, flags: {hat: true}},
  '\\widetilde': {glyph: 2246, arity: 1, flags: {hat: true, xfl: true, yfl: true}},
  '\\overleftrightarrow': {glyph: 5015, arity: 1, flags: {hat: true, xfl: true, yfl: true}},
  '\\boxed': {glyph: 5050, arity: 1, flags: {xfl: true, yfl: true}},
  

  '\\not': {glyph: 2220, arity: 1, flags: {}},

  '\\neq': {glyph: 2239, arity: 0, flags: {}},
  '\\ne': {glyph: 2239, arity: 0, flags: {}},
  '\\le': {glyph: 2243, flags: {}},
  '\\ge': {glyph: 2244, flags: {}},
  '\\approx': {glyph: 5011, flags: {}},
  '\\simeq': {glyph: 5012, flags: {}},
  '\\forall': {glyph: 5000, flags: {}},
  '\\nexists': {glyph: 5001, flags: {}},
  '\\notin': {glyph: 5002, flags: {}},
  '\\ni': {glyph: 5003, flags: {}},
  '\\owns': {glyph: 5003, flags: {}},
  '\\emptyset': {glyph: 5004, flags: {}},
  '\\varnothing': {glyph: 5004, flags: {}},
  '\\subseteq': {glyph: 5005, flags: {}},
  '\\supseteq': {glyph: 5006, flags: {}},
  '\\nsubseteq': {glyph: 5007, flags: {}},
  '\\nsupseteq': {glyph: 5008, flags: {}},
  '\\land': {glyph: 5009, flags: {}},
  '\\wedge': {glyph: 5009, flags: {}},
  '\\lor': {glyph: 5010, flags: {}},
  '\\vee': {glyph: 5010, flags: {}},
  '\\neg': {glyph: 5013, flags: {}},
  '\\lnot': {glyph: 5013, flags: {}},
  '\\setminus': {glyph: 5014, flags: {}},
  '\\smallsetminus': {glyph: 5014, flags: {}},
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
  '\\bigotimes': {glyph: 5035, flags: {big: true, xfl: true, yfl: true}},
  '\\bigcup': {glyph: 2257, flags: {big: true, xfl: true, yfl: true}},
  '\\bigcap': {glyph: 2259, flags: {big: true, xfl: true, yfl: true}},
  '\\bigvee': {glyph: 5010, flags: {big: true, xfl: true, yfl: true}},
  '\\bigwedge': {glyph: 5009, flags: {big: true, xfl: true, yfl: true}},
  '\\biguplus': {glyph: 5038, flags: {big: true, xfl: true, yfl: true}},
  '\\int': {glyph: 2412, arity: 0, flags: {yfl: true, integral: true}},
  '\\oint': {glyph: 2269, arity: 0, flags: {yfl: true, integral: true}},
  '\\iint': {glyph: 5020, flags: {yfl: true, integral: true}},
  '\\iiint': {glyph: 5021, flags: {yfl: true, integral: true}},
  '\\iiiint': {glyph: 5022, flags: {yfl: true, integral: true}},
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
  '\\leftrightarrow': {glyph: 5015, flags: {}},
  '\\Rightarrow': {glyph: 5016, flags: {}},
  '\\implies': {glyph: 5016, flags: {}},
  '\\Leftarrow': {glyph: 5017, flags: {}},
  '\\impliedby': {glyph: 5017, flags: {}},
  '\\Leftrightarrow': {glyph: 5018, flags: {}},
  '\\iff': {glyph: 5018, flags: {}},
  '\\mapsto': {glyph: 5019, flags: {}},
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
  '\\det': {glyph: 0, flags: {txt: true}},
  '\\gcd': {glyph: 0, flags: {txt: true, big: true}},
  '\\max': {glyph: 0, flags: {txt: true, big: true}},
  '\\min': {glyph: 0, flags: {txt: true, big: true}},
  '\\sup': {glyph: 0, flags: {txt: true, big: true}},
  '\\inf': {glyph: 0, flags: {txt: true, big: true}},
  '\\limsup': {glyph: 0, text: 'lim sup', flags: {txt: true, big: true}},
  '\\liminf': {glyph: 0, text: 'lim inf', flags: {txt: true, big: true}},
  '\\arg': {glyph: 0, flags: {txt: true}},
  '\\ker': {glyph: 0, flags: {txt: true}},
  '\\dim': {glyph: 0, flags: {txt: true}},
  '\\deg': {glyph: 0, flags: {txt: true}},
  '\\Pr': {glyph: 0, flags: {txt: true, big: true}},

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
