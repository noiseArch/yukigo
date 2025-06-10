// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var EOF: any;
declare var assign: any;
declare var semicolon: any;
declare var lbracket: any;
declare var rbracket: any;
declare var string: any;
declare var number: any;
declare var lsquare: any;
declare var rsquare: any;
declare var lparen: any;
declare var rparen: any;
declare var template: any;
declare var identifier: any;

import { JSLexer } from "./lexer"
import { 
    parseStatement, 
    parseIdentifier, 
    parseNumber, 
    parsePrimary,
    parseExpression,
    parseTerm,
    parseParenExpression 
    } from "./parser"
import util from "util";

const filter = d => {
    return d.filter((token) => token !== null);
};
JSLexer.next = (next => () => {
    let tok;
    while ((tok = next.call(JSLexer)) && (tok.type === "WS" || tok.type === "NL" ||  tok.type === "comment")) {}
    //console.log(tok);
    return tok;
})(JSLexer.next);


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
  Lexer: JSLexer,
  ParserRules: [
    {"name": "program$ebnf$1", "symbols": []},
    {"name": "program$ebnf$1$subexpression$1", "symbols": ["statement"]},
    {"name": "program$ebnf$1$subexpression$1", "symbols": ["declaration"]},
    {"name": "program$ebnf$1", "symbols": ["program$ebnf$1", "program$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "program", "symbols": ["program$ebnf$1", (JSLexer.has("EOF") ? {type: "EOF"} : EOF)]},
    {"name": "statement_list$subexpression$1$ebnf$1", "symbols": []},
    {"name": "statement_list$subexpression$1$ebnf$1", "symbols": ["statement_list$subexpression$1$ebnf$1", "statement"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "statement_list$subexpression$1", "symbols": ["statement_list$subexpression$1$ebnf$1"]},
    {"name": "statement_list", "symbols": ["statement_list$subexpression$1"], "postprocess": (d) => d[0]},
    {"name": "statement$subexpression$1", "symbols": ["expression", {"literal":";"}]},
    {"name": "statement$subexpression$1", "symbols": ["if_statement"]},
    {"name": "statement$subexpression$1", "symbols": ["block"]},
    {"name": "statement$subexpression$1", "symbols": ["iteration_statement"]},
    {"name": "statement$subexpression$1", "symbols": ["break_statement"]},
    {"name": "statement$subexpression$1", "symbols": ["continue_statement"]},
    {"name": "statement$subexpression$1", "symbols": ["return_statement"]},
    {"name": "statement$subexpression$1", "symbols": ["throw_statement"]},
    {"name": "statement$subexpression$1", "symbols": ["try_statement"]},
    {"name": "statement$subexpression$1", "symbols": ["empty_statement"]},
    {"name": "statement", "symbols": ["statement$subexpression$1"], "postprocess": (d) => {return d[0]}},
    {"name": "declaration$subexpression$1", "symbols": ["variable_declaration"]},
    {"name": "declaration$subexpression$1", "symbols": ["function_declaration"]},
    {"name": "declaration$subexpression$1", "symbols": ["class_declaration"]},
    {"name": "declaration", "symbols": ["declaration$subexpression$1"], "postprocess": (d) => d[0]},
    {"name": "variable_declaration$subexpression$1", "symbols": [{"literal":"const"}, "identifier", (JSLexer.has("assign") ? {type: "assign"} : assign), "expression", (JSLexer.has("semicolon") ? {type: "semicolon"} : semicolon)]},
    {"name": "variable_declaration", "symbols": ["variable_declaration$subexpression$1"], "postprocess": (d) => d[0]},
    {"name": "variable_declaration$subexpression$2$ebnf$1$subexpression$1", "symbols": [(JSLexer.has("assign") ? {type: "assign"} : assign), "expression"]},
    {"name": "variable_declaration$subexpression$2$ebnf$1", "symbols": ["variable_declaration$subexpression$2$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "variable_declaration$subexpression$2$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "variable_declaration$subexpression$2", "symbols": [{"literal":"let"}, "identifier", "variable_declaration$subexpression$2$ebnf$1", (JSLexer.has("semicolon") ? {type: "semicolon"} : semicolon)]},
    {"name": "variable_declaration", "symbols": ["variable_declaration$subexpression$2"], "postprocess": (d) => d[0]},
    {"name": "variable_declaration$subexpression$3$ebnf$1$subexpression$1", "symbols": [(JSLexer.has("assign") ? {type: "assign"} : assign), "expression"]},
    {"name": "variable_declaration$subexpression$3$ebnf$1", "symbols": ["variable_declaration$subexpression$3$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "variable_declaration$subexpression$3$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "variable_declaration$subexpression$3", "symbols": [{"literal":"var"}, "identifier", "variable_declaration$subexpression$3$ebnf$1", (JSLexer.has("semicolon") ? {type: "semicolon"} : semicolon)]},
    {"name": "variable_declaration", "symbols": ["variable_declaration$subexpression$3"], "postprocess": (d) => d[0]},
    {"name": "function_declaration$ebnf$1", "symbols": [{"literal":"async"}], "postprocess": id},
    {"name": "function_declaration$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "function_declaration", "symbols": ["function_declaration$ebnf$1", {"literal":"function"}, "identifier", "parameter_list", "block", {"literal":";"}]},
    {"name": "class_declaration", "symbols": [{"literal":"class"}, "identifier", "class_body", {"literal":";"}]},
    {"name": "class_body$ebnf$1", "symbols": ["class_element_list"], "postprocess": id},
    {"name": "class_body$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "class_body", "symbols": [(JSLexer.has("lbracket") ? {type: "lbracket"} : lbracket), "class_body$ebnf$1", (JSLexer.has("rbracket") ? {type: "rbracket"} : rbracket)]},
    {"name": "class_element_list", "symbols": ["class_element"], "postprocess": (d) => d[0]},
    {"name": "class_element_list", "symbols": ["class_element_list", "class_element"]},
    {"name": "class_element", "symbols": ["method_definition"], "postprocess": (d) => d[0]},
    {"name": "class_element", "symbols": [{"literal":"static"}, "method_definition"]},
    {"name": "class_element", "symbols": ["constructor_definition"], "postprocess": (d) => d[0]},
    {"name": "constructor_definition", "symbols": [{"literal":"constructor"}, "parameter_list", "block"]},
    {"name": "method_definition", "symbols": ["property_name", "parameter_list", "block"]},
    {"name": "property_name", "symbols": ["identifier"], "postprocess": (d) => d[0]},
    {"name": "property_name", "symbols": [(JSLexer.has("string") ? {type: "string"} : string)], "postprocess": (d) => d[0]},
    {"name": "property_name", "symbols": [(JSLexer.has("number") ? {type: "number"} : number)], "postprocess": (d) => d[0]},
    {"name": "property_name", "symbols": [(JSLexer.has("lsquare") ? {type: "lsquare"} : lsquare), "expression", (JSLexer.has("rsquare") ? {type: "rsquare"} : rsquare)]},
    {"name": "parameter_list$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "parameter_list$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "identifier"]},
    {"name": "parameter_list$ebnf$1$subexpression$1$ebnf$1", "symbols": ["parameter_list$ebnf$1$subexpression$1$ebnf$1", "parameter_list$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "parameter_list$ebnf$1$subexpression$1", "symbols": ["identifier", "parameter_list$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "parameter_list$ebnf$1", "symbols": ["parameter_list$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "parameter_list$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "parameter_list", "symbols": [(JSLexer.has("lparen") ? {type: "lparen"} : lparen), "parameter_list$ebnf$1", (JSLexer.has("rparen") ? {type: "rparen"} : rparen)]},
    {"name": "block$ebnf$1", "symbols": []},
    {"name": "block$ebnf$1", "symbols": ["block$ebnf$1", "statement"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "block", "symbols": [(JSLexer.has("lbracket") ? {type: "lbracket"} : lbracket), "block$ebnf$1", (JSLexer.has("rbracket") ? {type: "rbracket"} : rbracket)]},
    {"name": "if_statement", "symbols": [{"literal":"if"}, (JSLexer.has("lparen") ? {type: "lparen"} : lparen), "expression", (JSLexer.has("rparen") ? {type: "rparen"} : rparen), "statement"]},
    {"name": "if_statement", "symbols": [{"literal":"if"}, (JSLexer.has("lparen") ? {type: "lparen"} : lparen), "expression", (JSLexer.has("rparen") ? {type: "rparen"} : rparen), "statement", {"literal":"else"}, "statement"]},
    {"name": "iteration_statement", "symbols": [{"literal":"while"}, (JSLexer.has("lparen") ? {type: "lparen"} : lparen), "expression", (JSLexer.has("rparen") ? {type: "rparen"} : rparen), "statement"]},
    {"name": "iteration_statement$ebnf$1", "symbols": ["for_initializer"], "postprocess": id},
    {"name": "iteration_statement$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "iteration_statement$ebnf$2", "symbols": ["expression"], "postprocess": id},
    {"name": "iteration_statement$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "iteration_statement$ebnf$3", "symbols": ["expression"], "postprocess": id},
    {"name": "iteration_statement$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "iteration_statement", "symbols": [{"literal":"for"}, (JSLexer.has("lparen") ? {type: "lparen"} : lparen), "iteration_statement$ebnf$1", {"literal":";"}, "iteration_statement$ebnf$2", {"literal":";"}, "iteration_statement$ebnf$3", (JSLexer.has("rparen") ? {type: "rparen"} : rparen), "statement"]},
    {"name": "for_initializer", "symbols": ["variable_declaration"], "postprocess": (d) => d[0]},
    {"name": "for_initializer", "symbols": ["expression"], "postprocess": (d) => d[0]},
    {"name": "break_statement", "symbols": [{"literal":"break"}, (JSLexer.has("semicolon") ? {type: "semicolon"} : semicolon)]},
    {"name": "continue_statement", "symbols": [{"literal":"continue"}, (JSLexer.has("semicolon") ? {type: "semicolon"} : semicolon)]},
    {"name": "return_statement$ebnf$1", "symbols": ["expression"], "postprocess": id},
    {"name": "return_statement$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "return_statement", "symbols": [{"literal":"return"}, "return_statement$ebnf$1", (JSLexer.has("semicolon") ? {type: "semicolon"} : semicolon)]},
    {"name": "throw_statement", "symbols": [{"literal":"throw"}, "expression", (JSLexer.has("semicolon") ? {type: "semicolon"} : semicolon)]},
    {"name": "try_statement", "symbols": [{"literal":"try"}, "block", "catch_clause"]},
    {"name": "try_statement", "symbols": [{"literal":"try"}, "block", "catch_clause", {"literal":"finally"}, "block"]},
    {"name": "catch_clause", "symbols": [{"literal":"catch"}, (JSLexer.has("lparen") ? {type: "lparen"} : lparen), "identifier", (JSLexer.has("rparen") ? {type: "rparen"} : rparen), "block"]},
    {"name": "empty_statement", "symbols": [(JSLexer.has("semicolon") ? {type: "semicolon"} : semicolon)], "postprocess": (d) => d[0]},
    {"name": "expression", "symbols": ["ternary_expression"], "postprocess": (d) => d[0]},
    {"name": "expression", "symbols": ["binary_expression"], "postprocess": (d) => d[0]},
    {"name": "expression", "symbols": ["unary_expression"], "postprocess": (d) => d[0]},
    {"name": "expression", "symbols": ["primary_expression"], "postprocess": (d) => d[0]},
    {"name": "expression", "symbols": ["assignment_expression"], "postprocess": (d) => d[0]},
    {"name": "assignment_expression", "symbols": ["primary_expression", {"literal":"="}, "expression"]},
    {"name": "assignment_expression", "symbols": ["primary_expression", {"literal":"+="}, "expression"]},
    {"name": "assignment_expression", "symbols": ["primary_expression", {"literal":"-="}, "expression"]},
    {"name": "assignment_expression", "symbols": ["primary_expression", {"literal":"*="}, "expression"]},
    {"name": "assignment_expression", "symbols": ["primary_expression", {"literal":"/="}, "expression"]},
    {"name": "assignment_expression", "symbols": ["primary_expression", {"literal":"%="}, "expression"]},
    {"name": "assignment_expression", "symbols": ["primary_expression", {"literal":"**="}, "expression"]},
    {"name": "assignment_expression", "symbols": ["primary_expression", {"literal":">>="}, "expression"]},
    {"name": "assignment_expression", "symbols": ["primary_expression", {"literal":"<<="}, "expression"]},
    {"name": "assignment_expression", "symbols": ["primary_expression", {"literal":">>>="}, "expression"]},
    {"name": "assignment_expression", "symbols": ["primary_expression", {"literal":"&="}, "expression"]},
    {"name": "assignment_expression", "symbols": ["primary_expression", {"literal":"^="}, "expression"]},
    {"name": "assignment_expression", "symbols": ["primary_expression", {"literal":"|="}, "expression"]},
    {"name": "assignment_expression", "symbols": ["primary_expression", {"literal":"&&="}, "expression"]},
    {"name": "assignment_expression", "symbols": ["primary_expression", {"literal":"||="}, "expression"]},
    {"name": "assignment_expression", "symbols": ["primary_expression", {"literal":"??="}, "expression"]},
    {"name": "ternary_expression", "symbols": ["binary_expression", {"literal":"?"}, "binary_expression", {"literal":":"}, "binary_expression"]},
    {"name": "binary_expression", "symbols": ["nullish_binary_expression"]},
    {"name": "nullish_binary_expression", "symbols": ["logical_or_binary_expression", {"literal":"??"}, "nullish_binary_expression"]},
    {"name": "nullish_binary_expression", "symbols": ["logical_or_binary_expression"]},
    {"name": "logical_or_binary_expression", "symbols": ["logical_and_binary_expression", {"literal":"||"}, "logical_or_binary_expression"]},
    {"name": "logical_or_binary_expression", "symbols": ["logical_and_binary_expression"]},
    {"name": "logical_and_binary_expression", "symbols": ["bitwise_or_binary_expression", {"literal":"&&"}, "logical_and_binary_expression"]},
    {"name": "logical_and_binary_expression", "symbols": ["bitwise_or_binary_expression"]},
    {"name": "bitwise_or_binary_expression", "symbols": ["bitwise_xor_binary_expression", {"literal":"|"}, "bitwise_or_binary_expression"]},
    {"name": "bitwise_or_binary_expression", "symbols": ["bitwise_xor_binary_expression"]},
    {"name": "bitwise_xor_binary_expression", "symbols": ["bitwise_and_binary_expression", {"literal":"^"}, "bitwise_xor_binary_expression"]},
    {"name": "bitwise_xor_binary_expression", "symbols": ["bitwise_and_binary_expression"]},
    {"name": "bitwise_and_binary_expression", "symbols": ["equality_binary_expression", {"literal":"&"}, "bitwise_and_binary_expression"]},
    {"name": "bitwise_and_binary_expression", "symbols": ["equality_binary_expression"]},
    {"name": "equality_binary_expression", "symbols": ["relational_binary_expression", {"literal":"=="}, "equality_binary_expression"]},
    {"name": "equality_binary_expression", "symbols": ["relational_binary_expression", {"literal":"==="}, "equality_binary_expression"]},
    {"name": "equality_binary_expression", "symbols": ["relational_binary_expression", {"literal":"!="}, "equality_binary_expression"]},
    {"name": "equality_binary_expression", "symbols": ["relational_binary_expression", {"literal":"!=="}, "equality_binary_expression"]},
    {"name": "equality_binary_expression", "symbols": ["relational_binary_expression"]},
    {"name": "relational_binary_expression", "symbols": ["bitwise_shift_binary_expression", {"literal":"<"}, "relational_binary_expression"]},
    {"name": "relational_binary_expression", "symbols": ["bitwise_shift_binary_expression", {"literal":"<="}, "relational_binary_expression"]},
    {"name": "relational_binary_expression", "symbols": ["bitwise_shift_binary_expression", {"literal":">"}, "relational_binary_expression"]},
    {"name": "relational_binary_expression", "symbols": ["bitwise_shift_binary_expression", {"literal":">="}, "relational_binary_expression"]},
    {"name": "relational_binary_expression", "symbols": ["bitwise_shift_binary_expression", {"literal":"??"}, "relational_binary_expression"]},
    {"name": "relational_binary_expression", "symbols": ["bitwise_shift_binary_expression"]},
    {"name": "bitwise_shift_binary_expression", "symbols": ["additive_binary_expression", {"literal":">>"}, "bitwise_shift_binary_expression"]},
    {"name": "bitwise_shift_binary_expression", "symbols": ["additive_binary_expression", {"literal":"<<"}, "bitwise_shift_binary_expression"]},
    {"name": "bitwise_shift_binary_expression", "symbols": ["additive_binary_expression", {"literal":">>>"}, "bitwise_shift_binary_expression"]},
    {"name": "bitwise_shift_binary_expression", "symbols": ["additive_binary_expression"]},
    {"name": "additive_binary_expression", "symbols": ["multiplicative_binary_expression", {"literal":"+"}, "additive_binary_expression"]},
    {"name": "additive_binary_expression", "symbols": ["multiplicative_binary_expression", {"literal":"-"}, "additive_binary_expression"]},
    {"name": "additive_binary_expression", "symbols": ["multiplicative_binary_expression"]},
    {"name": "multiplicative_binary_expression", "symbols": ["unary_expression", {"literal":"*"}, "multiplicative_binary_expression"]},
    {"name": "multiplicative_binary_expression", "symbols": ["unary_expression", {"literal":"/"}, "multiplicative_binary_expression"]},
    {"name": "multiplicative_binary_expression", "symbols": ["unary_expression", {"literal":"%"}, "multiplicative_binary_expression"]},
    {"name": "multiplicative_binary_expression", "symbols": ["unary_expression", {"literal":"**"}, "multiplicative_binary_expression"]},
    {"name": "multiplicative_binary_expression", "symbols": ["unary_expression"]},
    {"name": "unary_expression", "symbols": ["prefix_expression"]},
    {"name": "unary_expression", "symbols": ["postfix_expression"]},
    {"name": "unary_expression", "symbols": ["primary_expression"]},
    {"name": "postfix_expression", "symbols": ["primary_expression", "property_access_postfix"]},
    {"name": "postfix_expression", "symbols": ["primary_expression", "function_call_postfix"]},
    {"name": "postfix_expression", "symbols": ["primary_expression", {"literal":"++"}]},
    {"name": "postfix_expression", "symbols": ["primary_expression", {"literal":"--"}]},
    {"name": "postfix_expression", "symbols": ["primary_expression", (JSLexer.has("template") ? {type: "template"} : template)]},
    {"name": "postfix_expression", "symbols": ["primary_expression", {"literal":"?"}]},
    {"name": "prefix_expression", "symbols": [{"literal":"+"}, "primary_expression"]},
    {"name": "prefix_expression", "symbols": [{"literal":"-"}, "primary_expression"]},
    {"name": "prefix_expression", "symbols": [{"literal":"++"}, "primary_expression"]},
    {"name": "prefix_expression", "symbols": [{"literal":"--"}, "primary_expression"]},
    {"name": "prefix_expression", "symbols": [{"literal":"!"}, "primary_expression"]},
    {"name": "prefix_expression", "symbols": [{"literal":"~"}, "primary_expression"]},
    {"name": "prefix_expression", "symbols": [{"literal":"..."}, "expression"]},
    {"name": "prefix_expression", "symbols": [{"literal":"typeof"}, "expression"]},
    {"name": "prefix_expression", "symbols": [{"literal":"void"}, "expression"]},
    {"name": "prefix_expression", "symbols": [{"literal":"delete"}, "expression"]},
    {"name": "prefix_expression", "symbols": [{"literal":"await"}, "expression"]},
    {"name": "prefix_expression", "symbols": [{"literal":"new"}, "expression"]},
    {"name": "primary_expression", "symbols": [(JSLexer.has("number") ? {type: "number"} : number)], "postprocess": (d) => d[0]},
    {"name": "primary_expression", "symbols": [(JSLexer.has("string") ? {type: "string"} : string)], "postprocess": (d) => d[0]},
    {"name": "primary_expression", "symbols": [{"literal":"null"}]},
    {"name": "primary_expression", "symbols": [{"literal":"undefined"}], "postprocess": (d) => d[0]},
    {"name": "primary_expression", "symbols": [{"literal":"true"}]},
    {"name": "primary_expression", "symbols": [{"literal":"false"}], "postprocess": (d) => d[0]},
    {"name": "primary_expression", "symbols": [(JSLexer.has("template") ? {type: "template"} : template)], "postprocess": (d) => d[0]},
    {"name": "primary_expression", "symbols": ["array_literal"], "postprocess": (d) => d[0]},
    {"name": "primary_expression", "symbols": ["object_literal"], "postprocess": (d) => d[0]},
    {"name": "primary_expression", "symbols": [(JSLexer.has("lparen") ? {type: "lparen"} : lparen), "expression", (JSLexer.has("rparen") ? {type: "rparen"} : rparen)]},
    {"name": "primary_expression", "symbols": ["class_declaration"], "postprocess": (d) => d[0]},
    {"name": "primary_expression", "symbols": ["function_declaration"], "postprocess": (d) => d[0]},
    {"name": "primary_expression", "symbols": [{"literal":"this"}], "postprocess": (d) => d[0]},
    {"name": "primary_expression", "symbols": ["identifier"], "postprocess": (d) => d[0]},
    {"name": "function_call_postfix", "symbols": [(JSLexer.has("lbracket") ? {type: "lbracket"} : lbracket), "comma_separated_expressions", (JSLexer.has("rbracket") ? {type: "rbracket"} : rbracket)]},
    {"name": "comma_separated_expressions$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "expression"]},
    {"name": "comma_separated_expressions$ebnf$1", "symbols": ["comma_separated_expressions$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "comma_separated_expressions$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "comma_separated_expressions", "symbols": ["expression", "comma_separated_expressions$ebnf$1"]},
    {"name": "property_access_postfix", "symbols": ["bracket_notation_property"]},
    {"name": "property_access_postfix", "symbols": ["dot_notation_property"]},
    {"name": "bracket_notation_property$ebnf$1", "symbols": ["bracket_enclosed_expression"]},
    {"name": "bracket_notation_property$ebnf$1", "symbols": ["bracket_notation_property$ebnf$1", "bracket_enclosed_expression"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "bracket_notation_property", "symbols": ["bracket_notation_property$ebnf$1"]},
    {"name": "bracket_enclosed_expression", "symbols": [(JSLexer.has("lsquare") ? {type: "lsquare"} : lsquare), "expression", (JSLexer.has("rsquare") ? {type: "rsquare"} : rsquare)]},
    {"name": "dot_notation_property", "symbols": [{"literal":"."}, "dot_separated_expressions"]},
    {"name": "dot_separated_expressions$ebnf$1", "symbols": []},
    {"name": "dot_separated_expressions$ebnf$1$subexpression$1", "symbols": [{"literal":"."}, "expression"]},
    {"name": "dot_separated_expressions$ebnf$1", "symbols": ["dot_separated_expressions$ebnf$1", "dot_separated_expressions$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "dot_separated_expressions", "symbols": ["expression", "dot_separated_expressions$ebnf$1"]},
    {"name": "argument_list$ebnf$1", "symbols": ["arg_list"], "postprocess": id},
    {"name": "argument_list$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "argument_list", "symbols": [(JSLexer.has("lparen") ? {type: "lparen"} : lparen), "argument_list$ebnf$1", (JSLexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": (d) => {console.log(util.inspect(d.flat(Infinity), false ,null, true)), console.log("\n\n"); return d}},
    {"name": "arg_list$subexpression$1$ebnf$1", "symbols": []},
    {"name": "arg_list$subexpression$1$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "expression"]},
    {"name": "arg_list$subexpression$1$ebnf$1", "symbols": ["arg_list$subexpression$1$ebnf$1", "arg_list$subexpression$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "arg_list$subexpression$1", "symbols": ["expression", "arg_list$subexpression$1$ebnf$1"]},
    {"name": "arg_list", "symbols": ["arg_list$subexpression$1"]},
    {"name": "array_literal$ebnf$1", "symbols": ["element_list"], "postprocess": id},
    {"name": "array_literal$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "array_literal", "symbols": [(JSLexer.has("lsquare") ? {type: "lsquare"} : lsquare), "array_literal$ebnf$1", (JSLexer.has("rsquare") ? {type: "rsquare"} : rsquare)]},
    {"name": "element_list", "symbols": ["expression"], "postprocess": (d) => d[0]},
    {"name": "element_list$subexpression$1", "symbols": ["element_list"], "postprocess": (d) => d[0]},
    {"name": "element_list", "symbols": ["element_list$subexpression$1", {"literal":","}, "expression"]},
    {"name": "object_literal$ebnf$1", "symbols": ["property_definition_list"], "postprocess": id},
    {"name": "object_literal$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "object_literal", "symbols": [(JSLexer.has("lbracket") ? {type: "lbracket"} : lbracket), "object_literal$ebnf$1", (JSLexer.has("rbracket") ? {type: "rbracket"} : rbracket)], "postprocess": (d) => {return d}},
    {"name": "property_definition_list", "symbols": ["property_definition"], "postprocess": (d) => d[0]},
    {"name": "property_definition_list$subexpression$1", "symbols": ["property_definition_list"], "postprocess": (d) => d[0]},
    {"name": "property_definition_list", "symbols": ["property_definition_list$subexpression$1", {"literal":","}, "property_definition"]},
    {"name": "property_definition", "symbols": ["identifier", {"literal":":"}, "expression"]},
    {"name": "property_definition", "symbols": ["identifier"], "postprocess": (d) => d[0]},
    {"name": "identifier", "symbols": [(JSLexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d) => d[0]}
  ],
  ParserStart: "program",
};

export default grammar;
