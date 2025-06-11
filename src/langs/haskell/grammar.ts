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
    {"name": "lambda_expression", "symbols": [{"literal":"("}, "_", {"literal":"\\"}, "_", "parameter_list", "_", {"literal":"->"}, "_", "expression", "_", {"literal":")"}], "postprocess": (d) => parseLambda([d[4], d[8]])},
    {"name": "concatenation", "symbols": ["comparison", "_", {"literal":"++"}, "_", "concatenation"], "postprocess": (d) => filter(d)},
    {"name": "concatenation", "symbols": ["comparison"], "postprocess": (d) => d[0]},
    {"name": "comparison", "symbols": ["addition", "_", "comparison_operator", "_", "comparison"], "postprocess": (d) => ({ type: "comparison", operator: d[2].value, left: d[0], right: d[4] })},
    {"name": "comparison", "symbols": ["addition"], "postprocess": (d) => d[0]},
    {"name": "addition", "symbols": ["multiplication", "_", {"literal":"+"}, "_", "addition"], "postprocess": (d) => filter(d)},
    {"name": "addition", "symbols": ["multiplication", "_", {"literal":"-"}, "_", "addition"], "postprocess": (d) => filter(d)},
    {"name": "addition", "symbols": ["multiplication"], "postprocess": (d) => d[0]},
    {"name": "multiplication", "symbols": ["infix_operator_expression", "_", {"literal":"*"}, "_", "multiplication"], "postprocess": (d) => filter(d)},
    {"name": "multiplication", "symbols": ["infix_operator_expression", "_", {"literal":"/"}, "_", "multiplication"], "postprocess": (d) => filter(d)},
    {"name": "multiplication", "symbols": ["infix_operator_expression"], "postprocess": (d) => d[0]},
    {"name": "infix_operator_expression", "symbols": ["application", "_", {"literal":"`"}, "_", (HSLexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"`"}, "_", "infix_operator_expression"], "postprocess":  (d) => ({
            type: "infix_application",
            operator: d[4].value,
            left: d[0],
            right: d[8]
        }) },
    {"name": "infix_operator_expression", "symbols": ["application"], "postprocess": d => d[0]},
    {"name": "application", "symbols": ["primary", "__", "application"], "postprocess": (d) => {return {type: "application", body: filter(d).flat(Infinity)}}},
    {"name": "application", "symbols": ["primary"], "postprocess": (d) => { return d[0] }},
    {"name": "primary", "symbols": [(HSLexer.has("number") ? {type: "number"} : number)], "postprocess": (d) => parsePrimary(d[0])},
    {"name": "primary", "symbols": [(HSLexer.has("string") ? {type: "string"} : string)], "postprocess": (d) => parsePrimary(d[0])},
    {"name": "primary", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d) => parsePrimary(d[0])},
    {"name": "primary", "symbols": [{"literal":"("}, "_", "expression", "_", {"literal":")"}], "postprocess": (d) => d[2]},
    {"name": "primary", "symbols": ["list_literal"], "postprocess": (d) => parsePrimary({type: "list", body: d[0]})},
    {"name": "primary", "symbols": ["composition_expression"], "postprocess": (d) => {return d[0]}},
    {"name": "primary", "symbols": ["lambda_expression"], "postprocess": (d) => {return d[0]}},
    {"name": "primary", "symbols": ["if_expression"], "postprocess": d => d[0]},
    {"name": "primary", "symbols": ["let_in_expression"], "postprocess": d => d[0]},
    {"name": "if_expression", "symbols": [{"literal":"if"}, "_", "expression", "_", {"literal":"then"}, "_", "expression", "_", {"literal":"else"}, "_", "expression"], "postprocess": (d) => ({ type: "if", cond: d[2], then: d[6], else: d[10] })},
    {"name": "declaration", "symbols": ["function_declaration"]},
    {"name": "declaration", "symbols": ["function_type_declaration"]},
    {"name": "declaration", "symbols": ["type_declaration"], "postprocess": (d) => d[0]},
    {"name": "function_type_declaration", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"::"}, "_", "type_list"], "postprocess": (d) => parseFunctionType([d[0], d[4]])},
    {"name": "function_declaration$ebnf$1", "symbols": ["parameter_list"], "postprocess": id},
    {"name": "function_declaration$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "function_declaration$ebnf$2", "symbols": ["where_clause"], "postprocess": id},
    {"name": "function_declaration$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "function_declaration", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier), "__", "function_declaration$ebnf$1", "_", {"literal":"="}, "_", "expression", "function_declaration$ebnf$2"], "postprocess": (d) => parseFunction(d)},
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
    {"name": "composition_expression", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"."}, "_", (HSLexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d) => parseCompositionExpression([d[0], d[4]])},
    {"name": "where_clause", "symbols": ["_", {"literal":"where"}, "_", "let_bindings"], "postprocess": (d) => d[3]},
    {"name": "let_in_expression", "symbols": [{"literal":"let"}, "__", "let_bindings", "__", {"literal":"in"}, "__", "expression"], "postprocess": (d) => ({ type: "let_in", bindings: d[2], body: d[6] })},
    {"name": "let_bindings$ebnf$1", "symbols": []},
    {"name": "let_bindings$ebnf$1$subexpression$1", "symbols": ["_", "let_binding"]},
    {"name": "let_bindings$ebnf$1", "symbols": ["let_bindings$ebnf$1", "let_bindings$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "let_bindings", "symbols": ["let_binding", "let_bindings$ebnf$1"], "postprocess": (d) => [d[0], ...(d[1] ? d[1].map(x => x[3]) : [])]},
    {"name": "let_binding", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"="}, "_", "expression", "_", {"literal":";"}], "postprocess": (d) => ({ name: d[0].value, value: d[4] })},
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
    {"name": "comparison_operator", "symbols": [{"literal":"=="}]},
    {"name": "comparison_operator", "symbols": [{"literal":"/="}]},
    {"name": "comparison_operator", "symbols": [{"literal":"<"}]},
    {"name": "comparison_operator", "symbols": [{"literal":">"}]},
    {"name": "comparison_operator", "symbols": [{"literal":"<="}]},
    {"name": "comparison_operator", "symbols": [{"literal":">="}]},
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
