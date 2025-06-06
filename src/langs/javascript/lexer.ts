import moo from "moo";
import { keywords } from "./definition";

export const JavascriptLexerConfig = {
  WS: /[ \t]+/,
  comment: /\/\/.*?$|\/\*[\s\S]*?\*\//,
  number:
    /0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|(?:\d*\.\d+|\d+)(?:[eE][+-]?\d+)?/,
  string:
    /"(?:\\["\\bfnrtv0]|\\u[0-9a-fA-F]{4}|[^"\\\n\r])*"|'(?:\\['\\bfnrtv0]|\\u[0-9a-fA-F]{4}|[^'\\\n\r])*'/,
  template: /`(?:\\[\s\S]|[^\\`])*`/,
  lparen: "(",
  rparen: ")",
  lbracket: "{",
  rbracket: "}",
  lsquare: "[",
  rsquare: "]",
  comma: ",",
  dot: ".",
  semicolon: ";",
  colon: ":",
  question: "?",
  assign: "=",
  op: /[+\-*/%&|^!~<>]=?|={2,3}|!==?|&&|\|\||\?\?/,
  identifier: {
    match: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
    type: moo.keywords({
      keyword: keywords,
    }),
  },
  NL: { match: /\r?\n/, lineBreaks: true },
};

export const JSLexer = moo.compile(JavascriptLexerConfig);
