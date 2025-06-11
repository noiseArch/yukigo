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
import { parseFunction, parsePrimary, parseExpression, parseFunctionExpression, parseCompositionExpression, parseTypeAlias, parseFunctionType, parseLambda} from "./parser";
import util from "util";

const filter = d => {
    return d.filter((token) => token !== null);
};
HSLexer.next = (next => () => {
    let tok;
    while ((tok = next.call(HSLexer)) && (tok.type === "NL" ||  tok.type === "comment")) {}
    //console.log(tok);
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
    {"name": "program$ebnf$1$subexpression$1", "symbols": ["declaration"]},
    {"name": "program$ebnf$1", "symbols": ["program$ebnf$1", "program$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "program", "symbols": ["program$ebnf$1"], "postprocess": (d) => filter(d.flat(Infinity))},
    {"name": "expression", "symbols": ["concatenation"], "postprocess": (d) => parseExpression(d[0])},
    {"name": "lambda_expression", "symbols": [{"literal":"("}, {"literal":"\\"}, "_", "parameter_list", "_", {"literal":"->"}, "_", "expression", {"literal":")"}], "postprocess": (d) => parseLambda([d[3], d[7]])},
    {"name": "function_expression", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"("}, "_", "argument_list", "_", {"literal":")"}, "_"], "postprocess": (d) => parseFunctionExpression([d[0], d[4]])},
    {"name": "function_expression$ebnf$1", "symbols": []},
    {"name": "function_expression$ebnf$1$subexpression$1", "symbols": ["__", "primary"]},
    {"name": "function_expression$ebnf$1", "symbols": ["function_expression$ebnf$1", "function_expression$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "function_expression", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier), "__", "primary", "function_expression$ebnf$1"], "postprocess": (d) => parseFunctionExpression([d[0], d[1], [d[2]]])},
    {"name": "composition_expression", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"."}, "_", (HSLexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d) => parseCompositionExpression([d[0], d[4]])},
    {"name": "argument_list", "symbols": ["primary", "__", "argument_list"], "postprocess": (d) => {console.log(d); return filter(d)}},
    {"name": "argument_list", "symbols": ["primary"], "postprocess": (d) => {console.log(d); return d}},
    {"name": "concatenation", "symbols": ["addition", "_", {"literal":"++"}, "_", "concatenation"], "postprocess": (d) => filter(d)},
    {"name": "concatenation", "symbols": ["addition"], "postprocess": (d) => d[0]},
    {"name": "addition", "symbols": ["multiplication", "_", {"literal":"+"}, "_", "multiplication"], "postprocess": (d) => filter(d)},
    {"name": "addition", "symbols": ["multiplication", "_", {"literal":"-"}, "_", "multiplication"], "postprocess": (d) => filter(d)},
    {"name": "addition", "symbols": ["multiplication"], "postprocess": (d) => d[0]},
    {"name": "multiplication", "symbols": ["primary", "_", {"literal":"*"}, "_", "primary"], "postprocess": (d) => filter(d)},
    {"name": "multiplication", "symbols": ["primary", "_", {"literal":"/"}, "_", "primary"], "postprocess": (d) => filter(d)},
    {"name": "multiplication", "symbols": ["primary"], "postprocess": (d) => d[0]},
    {"name": "primary", "symbols": [(HSLexer.has("number") ? {type: "number"} : number)], "postprocess": (d) => parsePrimary(d[0])},
    {"name": "primary", "symbols": [(HSLexer.has("string") ? {type: "string"} : string)], "postprocess": (d) => parsePrimary(d[0])},
    {"name": "primary", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d) => parsePrimary(d[0])},
    {"name": "primary", "symbols": ["list_literal"], "postprocess": (d) => parsePrimary({type: "list", body: d[0]})},
    {"name": "primary", "symbols": ["function_expression"], "postprocess": (d) => {return d[0]}},
    {"name": "primary", "symbols": ["composition_expression"], "postprocess": (d) => {return d[0]}},
    {"name": "primary", "symbols": ["lambda_expression"], "postprocess": (d) => {return d[0]}},
    {"name": "declaration", "symbols": ["function_declaration"]},
    {"name": "declaration", "symbols": ["function_type_declaration"]},
    {"name": "declaration", "symbols": ["type_declaration"], "postprocess": (d) => d[0]},
    {"name": "function_type_declaration", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"::"}, "_", "type_list"], "postprocess": (d) => parseFunctionType([d[0], d[4]])},
    {"name": "function_declaration$ebnf$1", "symbols": ["parameter_list"], "postprocess": id},
    {"name": "function_declaration$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "function_declaration", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier), "__", "function_declaration$ebnf$1", "_", {"literal":"="}, "_", "expression"], "postprocess": (d) => parseFunction(d)},
    {"name": "parameter_list$subexpression$1", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "parameter_list$subexpression$1", "symbols": [(HSLexer.has("string") ? {type: "string"} : string)]},
    {"name": "parameter_list$subexpression$1", "symbols": [(HSLexer.has("number") ? {type: "number"} : number)]},
    {"name": "parameter_list$subexpression$1", "symbols": [{"literal":"("}, (HSLexer.has("identifier") ? {type: "identifier"} : identifier), {"literal":":"}, (HSLexer.has("identifier") ? {type: "identifier"} : identifier), {"literal":")"}]},
    {"name": "parameter_list", "symbols": ["parameter_list$subexpression$1", "__", "parameter_list"], "postprocess": (d) => filter(d.flat(Infinity))},
    {"name": "parameter_list$subexpression$2", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "parameter_list$subexpression$2", "symbols": [(HSLexer.has("string") ? {type: "string"} : string)]},
    {"name": "parameter_list$subexpression$2", "symbols": [(HSLexer.has("number") ? {type: "number"} : number)]},
    {"name": "parameter_list$subexpression$2", "symbols": [{"literal":"("}, (HSLexer.has("identifier") ? {type: "identifier"} : identifier), {"literal":":"}, (HSLexer.has("identifier") ? {type: "identifier"} : identifier), {"literal":")"}]},
    {"name": "parameter_list", "symbols": ["parameter_list$subexpression$2"], "postprocess": (d) => [d[0]]},
    {"name": "type_declaration", "symbols": [{"literal":"type"}, "__", (HSLexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"="}, "_", "type_list"], "postprocess": (d) => parseTypeAlias(d)},
    {"name": "type_list$subexpression$1$ebnf$1", "symbols": [{"literal":"["}], "postprocess": id},
    {"name": "type_list$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "type_list$subexpression$1$ebnf$2", "symbols": [{"literal":"]"}], "postprocess": id},
    {"name": "type_list$subexpression$1$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "type_list$subexpression$1", "symbols": ["type_list$subexpression$1$ebnf$1", (HSLexer.has("identifier") ? {type: "identifier"} : identifier), "type_list$subexpression$1$ebnf$2"]},
    {"name": "type_list", "symbols": ["type_list$subexpression$1", "_", {"literal":"->"}, "_", "type_list"], "postprocess": (d) => filter(d)},
    {"name": "type_list$ebnf$1", "symbols": [{"literal":"["}], "postprocess": id},
    {"name": "type_list$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "type_list$ebnf$2", "symbols": [{"literal":"]"}], "postprocess": id},
    {"name": "type_list$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "type_list", "symbols": ["type_list$ebnf$1", (HSLexer.has("identifier") ? {type: "identifier"} : identifier), "type_list$ebnf$2"], "postprocess": (d) => filter(d)},
    {"name": "list_literal", "symbols": [{"literal":"["}, "_", "expression_list", "_", {"literal":"]"}], "postprocess": (d) => d},
    {"name": "expression_list", "symbols": ["expression", "_", {"literal":","}, "_", "expression_list"], "postprocess": (d) => filter([d[0], d[4]]).flat(Infinity)},
    {"name": "expression_list", "symbols": ["expression"], "postprocess": (d) => [d[0]]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (HSLexer.has("WS") ? {type: "WS"} : WS)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": (d) => null},
    {"name": "__$ebnf$1", "symbols": [(HSLexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (HSLexer.has("WS") ? {type: "WS"} : WS)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": (d) => null}
  ],
  ParserStart: "program",
};

export default grammar;
