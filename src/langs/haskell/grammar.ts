// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var identifier: any;
declare var number: any;
declare var string: any;
declare var WS: any;

import { HSLexer } from "./lexer"
import util from "util";

const filter = d => {
    return d.filter((token) => token !== null);
};
HSLexer.next = (next => () => {
    let tok;
    while ((tok = next.call(HSLexer)) && (tok.type === "NL" ||  tok.type === "comment")) {}
    console.log(tok);
    return tok;
})(HSLexer.next);


interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: HSLexer,
  ParserRules: [
    {"name": "program$ebnf$1", "symbols": []},
    {"name": "program$ebnf$1$subexpression$1", "symbols": ["statement"]},
    {"name": "program$ebnf$1$subexpression$1", "symbols": ["declaration"]},
    {"name": "program$ebnf$1", "symbols": ["program$ebnf$1", "program$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "program", "symbols": [{"literal":"module"}, "__", (HSLexer.has("identifier") ? {type: "identifier"} : identifier), "__", {"literal":"where"}, "program$ebnf$1"]},
    {"name": "statement", "symbols": ["expression"], "postprocess": (d) => d[0]},
    {"name": "expression", "symbols": ["addition"], "postprocess": (d) => d[0]},
    {"name": "addition", "symbols": ["multiplication", "_", {"literal":"+"}, "_", "multiplication"]},
    {"name": "addition", "symbols": ["multiplication", "_", {"literal":"-"}, "_", "multiplication"]},
    {"name": "addition", "symbols": ["multiplication"], "postprocess": (d) => d[0]},
    {"name": "multiplication", "symbols": ["primary", "_", {"literal":"*"}, "_", "primary"]},
    {"name": "multiplication", "symbols": ["primary", "_", {"literal":"/"}, "_", "primary"]},
    {"name": "multiplication", "symbols": ["primary"], "postprocess": (d) => d[0]},
    {"name": "primary", "symbols": [(HSLexer.has("number") ? {type: "number"} : number)], "postprocess": (d) => d[0]},
    {"name": "primary", "symbols": [(HSLexer.has("string") ? {type: "string"} : string)], "postprocess": (d) => d[0]},
    {"name": "primary", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d) => d[0]},
    {"name": "declaration", "symbols": ["function_declaration"], "postprocess": (d) => d[0]},
    {"name": "function_declaration$ebnf$1", "symbols": ["parameter_list"], "postprocess": id},
    {"name": "function_declaration$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "function_declaration", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier), "__", "function_declaration$ebnf$1", "_", {"literal":"="}, "_", "expression"]},
    {"name": "parameter_list", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier), "__", "parameter_list"]},
    {"name": "parameter_list", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d) => d[0]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (HSLexer.has("WS") ? {type: "WS"} : WS)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "__", "symbols": [(HSLexer.has("WS") ? {type: "WS"} : WS)]}
  ],
  ParserStart: "program",
};

export default grammar;
