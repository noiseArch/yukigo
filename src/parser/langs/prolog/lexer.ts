import moo from "moo";
import { makeLexer } from "moo-ignore";

const keywords = [
  "if",
  "then",
  "else", // Common in some Prolog extensions/libraries
  "is",
  "call",
  "not",
  "once",
  "abolish",
  "current_predicate",
  "asserta",
  "assertz",
  "retract",
  "retractall",
  "clause",
  "findall",
  "bagof",
  "setof",
  "consult",
  "use_module",
  "reconsult",
  "module",
  "export",
  "import",
  "pred",
  "op", // Operator declaration predicate
  "true",
  "false",
  "fail",
  "repeat",
  "catch",
  "throw",
  "write",
  "read",
  "nl",
  "display",
  "format",
  "atom",
  "number",
  "var",
  "nonvar",
  "atomic",
  "compound",
  "callable",
  "functor",
  "arg",
  "name",
  "current_op",
  "unify_with_occurs_check",
];

export const PrologLexerConfig = {
  WS: /[ \t\r]+/,
  comment: {
    match: /%.*?$|\/\*[\s\S]*?\*\//,
    lineBreaks: true,
  },

  colonDash: ":-",
  doubleColon: "::",
  arrow: "->",
  notEqualsStrict: "\\==", 
  notEquals: "\\=",
  lessThanEquals: "<=",
  greaterThanEquals: ">=",
  equality: "==",
  univOp: "=..",
  unifyOp: "=",

  op: /[?#$%&]+/,

  cut: "!",
  plus: "+",
  minus: "-",
  multiply: "*",
  divide: "/",
  caret: "^",
  pipe: "|",
  tilde: "~",
  at: "@",
  hash: "#",

  lparen: "(",
  rparen: ")",
  lsquare: "[",
  rsquare: "]",
  lbracket: "{", 
  rbracket: "}",
  comma: ",",
  dot: ".",
  semicolon: ";",
  colon: ":",

  number:
    /0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|(?:\d*\.\d+|\d+)(?:[eE][+-]?\d+)?/,

  string: /'(?:\\['\\bfnrtv0]|\\u[0-9a-fA-F]{4}|[^'\\\n\r])*'/,

  anonymousVariable: {
    match: "_",
    value: (v) => v,
  },

  variable: /[A-Z][a-zA-Z0-9_]*/,

  atom: {
    match: /[a-z][a-zA-Z0-9_]*/,
    type: moo.keywords({
      keyword: keywords,
    }),
  },

  NL: { match: /\n/, lineBreaks: true },
};

export const PrologLexer = makeLexer(PrologLexerConfig, ["WS", "comment"]);
