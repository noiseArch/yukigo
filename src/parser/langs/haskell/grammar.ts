// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var number: any;
declare var char: any;
declare var string: any;
declare var bool: any;
declare var lbracket: any;
declare var rbracket: any;
declare var anonymousVariable: any;
declare var identifier: any;
declare var constructor: any;
declare var WS: any;

import { HSLexer } from "./lexer"
import { parseFunction, parsePrimary, parseDataExpression, parseDataDeclaration, parseApplication, parseExpression, parseCompositionExpression, parseTypeAlias, parseFunctionType, parseLambda} from "./parser";
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
    {"name": "concatenation", "symbols": ["comparison", "_", {"literal":"++"}, "_", "concatenation"], "postprocess": (d) => ({ type: "Concat", operator: d[2].value, left: {type: "Expression", body:d[0]}, right: {type: "Expression", body:d[4]} })},
    {"name": "concatenation", "symbols": ["comparison"], "postprocess": (d) => d[0]},
    {"name": "comparison", "symbols": ["addition", "_", "comparison_operator", "_", "comparison"], "postprocess": (d) => ({ type: "Comparison", operator: d[2].value, left: {type: "Expression", body:d[0]}, right: {type: "Expression", body:d[4]} })},
    {"name": "comparison", "symbols": ["addition"], "postprocess": (d) => d[0]},
    {"name": "addition", "symbols": ["multiplication", "_", {"literal":"+"}, "_", "addition"], "postprocess": (d) => ({ type: "Arithmetic", operator: d[2].value, left: {type: "Expression", body: d[0]}, right: {type: "Expression", body: d[4]} })},
    {"name": "addition", "symbols": ["multiplication", "_", {"literal":"-"}, "_", "addition"], "postprocess": (d) => ({ type: "Arithmetic", operator: d[2].value, left: {type: "Expression", body: d[0]}, right: {type: "Expression", body: d[4]} })},
    {"name": "addition", "symbols": ["multiplication"], "postprocess": (d) => d[0]},
    {"name": "multiplication", "symbols": ["infix_operator_expression", "_", {"literal":"*"}, "_", "multiplication"], "postprocess": (d) => ({ type: "Arithmetic", operator: d[2].value, left: {type: "Expression", body: d[0]}, right: {type: "Expression", body: d[4]} })},
    {"name": "multiplication", "symbols": ["infix_operator_expression", "_", {"literal":"/"}, "_", "multiplication"], "postprocess": (d) => ({ type: "Arithmetic", operator: d[2].value, left: {type: "Expression", body: d[0]}, right: {type: "Expression", body: d[4]} })},
    {"name": "multiplication", "symbols": ["infix_operator_expression"], "postprocess": (d) => d[0]},
    {"name": "infix_operator_expression", "symbols": ["application", "_", {"literal":"`"}, "_", "identifier", "_", {"literal":"`"}, "_", "infix_operator_expression"], "postprocess":  (d) => ({
            type: "infix_application",
            operator: d[4].value,
            left: d[0],
            right: d[8]
        }) },
    {"name": "infix_operator_expression", "symbols": ["application"], "postprocess": d => d[0]},
    {"name": "application$ebnf$1", "symbols": []},
    {"name": "application$ebnf$1$subexpression$1", "symbols": ["_", "primary"]},
    {"name": "application$ebnf$1", "symbols": ["application$ebnf$1", "application$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "application", "symbols": ["primary", "application$ebnf$1"], "postprocess":  (d) => {
            if (d[1].length === 0) return d[0];
            return d[1].reduce((left, right) => parseApplication([left, right[1]]), d[0]);
        } },
    {"name": "primary", "symbols": [(HSLexer.has("number") ? {type: "number"} : number)], "postprocess": (d) => parsePrimary(d[0])},
    {"name": "primary", "symbols": [(HSLexer.has("char") ? {type: "char"} : char)], "postprocess": (d) => parsePrimary(d[0])},
    {"name": "primary", "symbols": [(HSLexer.has("string") ? {type: "string"} : string)], "postprocess": (d) => parsePrimary(d[0])},
    {"name": "primary", "symbols": [(HSLexer.has("bool") ? {type: "bool"} : bool)], "postprocess": (d) => parsePrimary(d[0])},
    {"name": "primary", "symbols": ["identifier"], "postprocess": (d) => d[0]},
    {"name": "primary", "symbols": ["tuple_expression"], "postprocess": (d) => d[0]},
    {"name": "primary", "symbols": [{"literal":"("}, "_", "expression", "_", {"literal":")"}], "postprocess": (d) => d[2]},
    {"name": "primary", "symbols": ["list_literal"], "postprocess": (d) => parsePrimary({type: "list", body: filter(d[0])})},
    {"name": "primary", "symbols": ["composition_expression"], "postprocess": (d) => d[0]},
    {"name": "primary", "symbols": ["lambda_expression"], "postprocess": (d) => d[0]},
    {"name": "primary", "symbols": ["if_expression"], "postprocess": d => d[0]},
    {"name": "primary", "symbols": ["case_expression"], "postprocess": d => d[0]},
    {"name": "primary", "symbols": ["data_expression"], "postprocess": d => d[0]},
    {"name": "primary", "symbols": ["let_in_expression"], "postprocess": d => d[0]},
    {"name": "tuple_expression$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "expression"]},
    {"name": "tuple_expression$ebnf$1", "symbols": ["tuple_expression$ebnf$1$subexpression$1"]},
    {"name": "tuple_expression$ebnf$1$subexpression$2", "symbols": ["_", {"literal":","}, "_", "expression"]},
    {"name": "tuple_expression$ebnf$1", "symbols": ["tuple_expression$ebnf$1", "tuple_expression$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "tuple_expression", "symbols": [{"literal":"("}, "_", "expression", "tuple_expression$ebnf$1", "_", {"literal":")"}], "postprocess": (d) => ({ type: "TupleExpression", elements: [d[2], ...d[3].map(x => x[3])] })},
    {"name": "data_expression", "symbols": ["identifier", "_", (HSLexer.has("lbracket") ? {type: "lbracket"} : lbracket), "fields_expressions", (HSLexer.has("rbracket") ? {type: "rbracket"} : rbracket)], "postprocess": (d) => parseDataExpression([d[0], d[3]])},
    {"name": "fields_expressions$ebnf$1", "symbols": []},
    {"name": "fields_expressions$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "_", "field_exp"]},
    {"name": "fields_expressions$ebnf$1", "symbols": ["fields_expressions$ebnf$1", "fields_expressions$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "fields_expressions", "symbols": ["_", "field_exp", "_", "fields_expressions$ebnf$1"], "postprocess": (d) => {return filter(d.flat(Infinity)).filter(tok => tok.type !== "comma")}},
    {"name": "field_exp", "symbols": ["identifier", "_", {"literal":"="}, "_", "expression"], "postprocess": (d) => ({type: "FieldExpression", name: d[0], expression: d[4]})},
    {"name": "if_expression", "symbols": [{"literal":"if"}, "_", "expression", "_", {"literal":"then"}, "_", "expression", "_", {"literal":"else"}, "_", "expression"], "postprocess": (d) => ({ type: "if", cond: d[2], then: d[6], else: d[10] })},
    {"name": "declaration", "symbols": ["function_declaration"]},
    {"name": "declaration", "symbols": ["function_type_declaration"]},
    {"name": "declaration", "symbols": ["type_declaration"]},
    {"name": "declaration", "symbols": ["data_declaration"], "postprocess": (d) => d[0]},
    {"name": "data_declaration", "symbols": [{"literal":"data"}, "__", "identifier", "_", {"literal":"="}, "_", "identifier", "_", (HSLexer.has("lbracket") ? {type: "lbracket"} : lbracket), "field_list", (HSLexer.has("rbracket") ? {type: "rbracket"} : rbracket)], "postprocess": (d) => parseDataDeclaration([d[2], d[6], d[9]])},
    {"name": "field_list$ebnf$1", "symbols": []},
    {"name": "field_list$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "_", "field"]},
    {"name": "field_list$ebnf$1", "symbols": ["field_list$ebnf$1", "field_list$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "field_list", "symbols": ["_", "field", "_", "field_list$ebnf$1"], "postprocess": (d) => {return filter(d.flat(Infinity)).filter(tok => tok.type !== "comma")}},
    {"name": "field", "symbols": ["identifier", "_", {"literal":"::"}, "_", "type"], "postprocess": (d) => ({type: "Field", name: d[0], value: d[4]})},
    {"name": "function_type_declaration", "symbols": ["identifier", "_", {"literal":"::"}, "_", "type"], "postprocess": (d) => parseFunctionType([d[0], d[4]])},
    {"name": "function_declaration$ebnf$1", "symbols": ["parameter_list"], "postprocess": id},
    {"name": "function_declaration$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "function_declaration$ebnf$2", "symbols": ["guarded_rhs_list"]},
    {"name": "function_declaration$ebnf$2", "symbols": ["function_declaration$ebnf$2", "guarded_rhs_list"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "function_declaration", "symbols": ["identifier", "__", "function_declaration$ebnf$1", "function_declaration$ebnf$2"], "postprocess": (d) => {return parseFunction({type: "function", name: d[0], params: d[2].flat(Infinity), body: d[3], return: d[3], attributes: ["GuardedBody"]})}},
    {"name": "function_declaration$ebnf$3", "symbols": ["parameter_list"], "postprocess": id},
    {"name": "function_declaration$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "function_declaration", "symbols": ["identifier", "__", "function_declaration$ebnf$3", "_", {"literal":"="}, "_", "expression"], "postprocess": (d) => {return parseFunction({type: "function", name: d[0], params: d[2] ? d[2].flat(Infinity) : [], body: d[6], return: d[6], attributes: ["UnguardedBody"]})}},
    {"name": "guarded_rhs_list", "symbols": ["_", {"literal":"|"}, "_", "guarded_rhs"], "postprocess": (d) => d[3]},
    {"name": "guarded_rhs", "symbols": ["expression", "_", {"literal":"="}, "_", "expression"], "postprocess": (d) => {return { guard: d[0], body: d[4], return: d[4] }}},
    {"name": "parameter_list", "symbols": ["pattern", "__", "parameter_list"], "postprocess": (d) => filter(d.flat(Infinity))},
    {"name": "parameter_list", "symbols": ["pattern"], "postprocess": (d) => [d[0]]},
    {"name": "pattern", "symbols": ["identifier"], "postprocess": (d) => ({type: "VariablePattern", name: d[0].value})},
    {"name": "pattern", "symbols": [(HSLexer.has("number") ? {type: "number"} : number)], "postprocess": (d) => ({type: "LiteralPattern", name: d[0].value})},
    {"name": "pattern", "symbols": [(HSLexer.has("string") ? {type: "string"} : string)], "postprocess": (d) => ({type: "LiteralPattern", name: d[0].value})},
    {"name": "pattern", "symbols": [(HSLexer.has("anonymousVariable") ? {type: "anonymousVariable"} : anonymousVariable)], "postprocess": (d) => ({type: "WildcardPattern", name: d[0].value})},
    {"name": "pattern$ebnf$1", "symbols": ["pattern"]},
    {"name": "pattern$ebnf$1", "symbols": ["pattern$ebnf$1", "pattern"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "pattern", "symbols": ["identifier", "pattern$ebnf$1"]},
    {"name": "pattern$ebnf$2", "symbols": []},
    {"name": "pattern$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}, "_", "pattern"]},
    {"name": "pattern$ebnf$2", "symbols": ["pattern$ebnf$2", "pattern$ebnf$2$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "pattern", "symbols": [{"literal":"("}, "_", "pattern", "pattern$ebnf$2", "_", {"literal":")"}], "postprocess": (d) => ({type: "TuplePattern", elements: [d[2], ...d[3].map(x => x[3])] })},
    {"name": "pattern$ebnf$3", "symbols": ["parameter_list"], "postprocess": id},
    {"name": "pattern$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "pattern", "symbols": [{"literal":"["}, "_", "pattern$ebnf$3", "_", {"literal":"]"}]},
    {"name": "pattern", "symbols": [{"literal":"("}, "_", "pattern", "_", {"literal":")"}]},
    {"name": "composition_expression", "symbols": ["identifier", "_", {"literal":"."}, "_", "identifier"], "postprocess": (d) => parseCompositionExpression([d[0], d[4]])},
    {"name": "identifier", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d) => parsePrimary(d[0])},
    {"name": "type_declaration", "symbols": [{"literal":"type"}, "__", "identifier", "_", {"literal":"="}, "_", "type"], "postprocess": (d) => parseTypeAlias([d[2], d[6]])},
    {"name": "type", "symbols": ["function_type"], "postprocess": (d) => d[0]},
    {"name": "function_type$ebnf$1", "symbols": []},
    {"name": "function_type$ebnf$1$subexpression$1", "symbols": ["application_type", "_", {"literal":"->"}, "_"]},
    {"name": "function_type$ebnf$1", "symbols": ["function_type$ebnf$1", "function_type$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "function_type", "symbols": ["function_type$ebnf$1", "application_type"], "postprocess": (d) => (d[0].length > 0 ? { type: "FunctionType", from: d[0].map(x => x[0]), to: d[1] } : d[1])},
    {"name": "application_type$ebnf$1", "symbols": []},
    {"name": "application_type$ebnf$1$subexpression$1", "symbols": ["_", "simple_type"]},
    {"name": "application_type$ebnf$1", "symbols": ["application_type$ebnf$1", "application_type$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "application_type", "symbols": ["simple_type", "application_type$ebnf$1"], "postprocess":  (d) =>
        d[1].length === 0 ? d[0] : { type: "TypeApplication", base: d[0], args: d[1].map(x => x[1]) }
            },
    {"name": "simple_type", "symbols": [(HSLexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d) => ({ type: "TypeVar", name: d[0].value })},
    {"name": "simple_type", "symbols": [(HSLexer.has("constructor") ? {type: "constructor"} : constructor)], "postprocess": (d) => ({ type: "TypeConstructor", name: d[0].value })},
    {"name": "simple_type", "symbols": [{"literal":"["}, "_", "type", "_", {"literal":"]"}], "postprocess": (d) => ({ type: "ListType", element: d[2] })},
    {"name": "simple_type$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "type"]},
    {"name": "simple_type$ebnf$1", "symbols": ["simple_type$ebnf$1$subexpression$1"]},
    {"name": "simple_type$ebnf$1$subexpression$2", "symbols": ["_", {"literal":","}, "_", "type"]},
    {"name": "simple_type$ebnf$1", "symbols": ["simple_type$ebnf$1", "simple_type$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "simple_type", "symbols": [{"literal":"("}, "_", "type", "simple_type$ebnf$1", "_", {"literal":")"}], "postprocess":  (d) =>
        ({ type: "TupleType", elements: [d[2], ...d[3].map(x => x[3])] })
            },
    {"name": "simple_type", "symbols": [{"literal":"("}, "_", "type", "_", {"literal":")"}], "postprocess": (d) => d[2]},
    {"name": "list_literal", "symbols": [{"literal":"["}, "_", "expression_list", "_", {"literal":"]"}], "postprocess": (d) => d},
    {"name": "expression_list", "symbols": ["expression", "_", {"literal":","}, "_", "expression_list"], "postprocess": (d) => filter([d[0], d[4]]).flat(Infinity)},
    {"name": "expression_list", "symbols": ["expression"], "postprocess": (d) => [d[0]]},
    {"name": "comparison_operator", "symbols": [{"literal":"=="}]},
    {"name": "comparison_operator", "symbols": [{"literal":"/="}]},
    {"name": "comparison_operator", "symbols": [{"literal":"<"}]},
    {"name": "comparison_operator", "symbols": [{"literal":">"}]},
    {"name": "comparison_operator", "symbols": [{"literal":"<="}]},
    {"name": "comparison_operator", "symbols": [{"literal":">="}], "postprocess": (d) => d[0]},
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
