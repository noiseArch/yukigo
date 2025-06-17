// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var NL: any;
declare var atom: any;
declare var keyword: any;
declare var variable: any;
declare var anonymousVariable: any;
declare var number: any;
declare var string: any;
declare var colonDash: any;
declare var doubleColon: any;
declare var arrow: any;
declare var notEqualsStrict: any;
declare var notEquals: any;
declare var lessThanEquals: any;
declare var greaterThanEquals: any;
declare var equality: any;
declare var univOp: any;
declare var unifyOp: any;
declare var op: any;
declare var cut: any;
declare var plus: any;
declare var minus: any;
declare var multiply: any;
declare var divide: any;
declare var caret: any;
declare var pipe: any;
declare var tilde: any;
declare var at: any;
declare var hash: any;
declare var lparen: any;
declare var rparen: any;
declare var lsquare: any;
declare var rsquare: any;
declare var lbracket: any;
declare var rbracket: any;
declare var comma: any;
declare var dot: any;
declare var semicolon: any;
declare var colon: any;

import { PrologLexer } from "./lexer"
//import { parseFunction, parsePrimary, parseExpression, parseFunctionExpression, parseCompositionExpression, parseTypeAlias, parseFunctionType, parseLambda} from "./parser";
import util from "util";

const filter = d => {
    return d.filter((token) => token !== null);
};
PrologLexer.next = (next => () => {
    let tok;
    while ((tok = next.call(PrologLexer)) && (tok.type === "comment")) {}
    //console.log(tok);
    return tok;
})(PrologLexer.next);


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
  Lexer: PrologLexer,
  ParserRules: [
    {"name": "program$ebnf$1", "symbols": []},
    {"name": "program$ebnf$1$subexpression$1", "symbols": ["clause", (PrologLexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "program$ebnf$1$subexpression$1", "symbols": [(PrologLexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "program$ebnf$1", "symbols": ["program$ebnf$1", "program$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "program", "symbols": ["program$ebnf$1"], "postprocess": d => d[0]},
    {"name": "clause$ebnf$1", "symbols": []},
    {"name": "clause$ebnf$1", "symbols": ["clause$ebnf$1", (PrologLexer.has("NL") ? {type: "NL"} : NL)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "clause", "symbols": ["head", "colonDash", "clause$ebnf$1", "body", "dot"], "postprocess": d => ({ type: 'rule', head: d[0], body: d[2] })},
    {"name": "clause", "symbols": ["head", "dot"], "postprocess": d => ({ type: 'fact', head: d[0] })},
    {"name": "head", "symbols": ["term"], "postprocess": id},
    {"name": "body$ebnf$1", "symbols": []},
    {"name": "body$ebnf$1", "symbols": ["body$ebnf$1", (PrologLexer.has("NL") ? {type: "NL"} : NL)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "body", "symbols": ["term", "comma", "body$ebnf$1", "body"], "postprocess": d => ({ type: 'conjunction', left: d[0], right: d[2] })},
    {"name": "body$ebnf$2", "symbols": []},
    {"name": "body$ebnf$2", "symbols": ["body$ebnf$2", (PrologLexer.has("NL") ? {type: "NL"} : NL)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "body", "symbols": ["term", "semicolon", "body$ebnf$2", "body"], "postprocess": d => ({ type: 'disjunction', left: d[0], right: d[2] })},
    {"name": "body", "symbols": ["term"], "postprocess": id},
    {"name": "term", "symbols": ["disjunction"], "postprocess": id},
    {"name": "parenthesized_term", "symbols": ["lparen", "term", "rparen"], "postprocess": d => d[1]},
    {"name": "list", "symbols": ["lsquare", "rsquare"], "postprocess": () => ({ type: 'list', elements: [] })},
    {"name": "list", "symbols": ["lsquare", "term", "list_rest", "rsquare"], "postprocess": d => d},
    {"name": "list_rest", "symbols": ["comma", "term_list"], "postprocess": d => ({ type: 'elements', elements: d[1] })},
    {"name": "list_rest", "symbols": ["pipe", "term"], "postprocess": d => ({ type: 'tail', value: d[1] })},
    {"name": "term_list", "symbols": ["term", "comma", "term_list"], "postprocess": d => [d[0], ...d[2]]},
    {"name": "term_list", "symbols": ["term"], "postprocess": d => [d[0]]},
    {"name": "structure", "symbols": ["atom", "lparen", "term_arguments", "rparen"], "postprocess": d => ({ type: 'structure', functor: d[0], args: d[2] })},
    {"name": "structure", "symbols": ["keyword", "lparen", "term_arguments", "rparen"], "postprocess": d => ({ type: 'structure', functor: d[0], args: d[2] })},
    {"name": "term_arguments", "symbols": ["term_list"], "postprocess": id},
    {"name": "disjunction$ebnf$1", "symbols": []},
    {"name": "disjunction$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "disjunction$ebnf$1$subexpression$1$ebnf$1", "symbols": ["disjunction$ebnf$1$subexpression$1$ebnf$1", (PrologLexer.has("NL") ? {type: "NL"} : NL)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "disjunction$ebnf$1$subexpression$1", "symbols": ["semicolon", "disjunction$ebnf$1$subexpression$1$ebnf$1", "conjunction"]},
    {"name": "disjunction$ebnf$1", "symbols": ["disjunction$ebnf$1", "disjunction$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "disjunction", "symbols": ["conjunction", "disjunction$ebnf$1"], "postprocess": id},
    {"name": "conjunction$ebnf$1", "symbols": []},
    {"name": "conjunction$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "conjunction$ebnf$1$subexpression$1$ebnf$1", "symbols": ["conjunction$ebnf$1$subexpression$1$ebnf$1", (PrologLexer.has("NL") ? {type: "NL"} : NL)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "conjunction$ebnf$1$subexpression$1", "symbols": ["comma", "conjunction$ebnf$1$subexpression$1$ebnf$1", "equality"]},
    {"name": "conjunction$ebnf$1", "symbols": ["conjunction$ebnf$1", "conjunction$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "conjunction", "symbols": ["equality", "conjunction$ebnf$1"], "postprocess": id},
    {"name": "equality$ebnf$1", "symbols": []},
    {"name": "equality$ebnf$1$subexpression$1$subexpression$1", "symbols": ["equality"]},
    {"name": "equality$ebnf$1$subexpression$1$subexpression$1", "symbols": ["notEquals"]},
    {"name": "equality$ebnf$1$subexpression$1$subexpression$1", "symbols": ["notEqualsStrict"]},
    {"name": "equality$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"is"}]},
    {"name": "equality$ebnf$1$subexpression$1$subexpression$1", "symbols": ["unifyOp"]},
    {"name": "equality$ebnf$1$subexpression$1$subexpression$1", "symbols": ["univOp"]},
    {"name": "equality$ebnf$1$subexpression$1", "symbols": ["equality$ebnf$1$subexpression$1$subexpression$1", "relational"]},
    {"name": "equality$ebnf$1", "symbols": ["equality$ebnf$1", "equality$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "equality", "symbols": ["relational", "equality$ebnf$1"], "postprocess": id},
    {"name": "relational$ebnf$1", "symbols": []},
    {"name": "relational$ebnf$1$subexpression$1$subexpression$1", "symbols": ["lessThan"]},
    {"name": "relational$ebnf$1$subexpression$1$subexpression$1", "symbols": ["lessThanEquals"]},
    {"name": "relational$ebnf$1$subexpression$1$subexpression$1", "symbols": ["greaterThan"]},
    {"name": "relational$ebnf$1$subexpression$1$subexpression$1", "symbols": ["greaterThanEquals"]},
    {"name": "relational$ebnf$1$subexpression$1", "symbols": ["relational$ebnf$1$subexpression$1$subexpression$1", "additive"]},
    {"name": "relational$ebnf$1", "symbols": ["relational$ebnf$1", "relational$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "relational", "symbols": ["additive", "relational$ebnf$1"], "postprocess": id},
    {"name": "additive$ebnf$1", "symbols": []},
    {"name": "additive$ebnf$1$subexpression$1$subexpression$1", "symbols": ["plus"]},
    {"name": "additive$ebnf$1$subexpression$1$subexpression$1", "symbols": ["minus"]},
    {"name": "additive$ebnf$1$subexpression$1", "symbols": ["additive$ebnf$1$subexpression$1$subexpression$1", "multiplicative"]},
    {"name": "additive$ebnf$1", "symbols": ["additive$ebnf$1", "additive$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "additive", "symbols": ["multiplicative", "additive$ebnf$1"], "postprocess": id},
    {"name": "multiplicative$ebnf$1", "symbols": []},
    {"name": "multiplicative$ebnf$1$subexpression$1$subexpression$1", "symbols": ["multiply"]},
    {"name": "multiplicative$ebnf$1$subexpression$1$subexpression$1", "symbols": ["divide"]},
    {"name": "multiplicative$ebnf$1$subexpression$1", "symbols": ["multiplicative$ebnf$1$subexpression$1$subexpression$1", "power"]},
    {"name": "multiplicative$ebnf$1", "symbols": ["multiplicative$ebnf$1", "multiplicative$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "multiplicative", "symbols": ["power", "multiplicative$ebnf$1"], "postprocess": id},
    {"name": "power$ebnf$1", "symbols": []},
    {"name": "power$ebnf$1$subexpression$1", "symbols": ["caret", "prefix"]},
    {"name": "power$ebnf$1", "symbols": ["power$ebnf$1", "power$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "power", "symbols": ["prefix", "power$ebnf$1"], "postprocess": id},
    {"name": "prefix$subexpression$1", "symbols": ["plus"]},
    {"name": "prefix$subexpression$1", "symbols": ["minus"]},
    {"name": "prefix$subexpression$1", "symbols": ["tilde"]},
    {"name": "prefix", "symbols": ["prefix$subexpression$1", "prefix"], "postprocess": id},
    {"name": "prefix", "symbols": ["atom"]},
    {"name": "prefix", "symbols": ["variable"]},
    {"name": "prefix", "symbols": ["anonymousVariable"]},
    {"name": "prefix", "symbols": ["number"]},
    {"name": "prefix", "symbols": ["string"]},
    {"name": "prefix", "symbols": ["list"]},
    {"name": "prefix", "symbols": ["structure"]},
    {"name": "prefix", "symbols": ["parenthesized_term"]},
    {"name": "prefix", "symbols": ["cut"]},
    {"name": "atom", "symbols": [(PrologLexer.has("atom") ? {type: "atom"} : atom)], "postprocess": d => ({ type: 'atom', value: d[0].value })},
    {"name": "keyword", "symbols": [(PrologLexer.has("keyword") ? {type: "keyword"} : keyword)], "postprocess": d => ({ type: 'keyword', value: d[0].value })},
    {"name": "variable", "symbols": [(PrologLexer.has("variable") ? {type: "variable"} : variable)], "postprocess": d => ({ type: 'variable', value: d[0].value })},
    {"name": "anonymousVariable", "symbols": [(PrologLexer.has("anonymousVariable") ? {type: "anonymousVariable"} : anonymousVariable)], "postprocess": d => ({ type: 'anonymousVariable', value: d[0].value })},
    {"name": "number", "symbols": [(PrologLexer.has("number") ? {type: "number"} : number)], "postprocess": d => ({ type: 'number', value: parseFloat(d[0].value) })},
    {"name": "string", "symbols": [(PrologLexer.has("string") ? {type: "string"} : string)], "postprocess": d => ({ type: 'string', value: d[0].value.slice(1, -1) })},
    {"name": "colonDash", "symbols": [(PrologLexer.has("colonDash") ? {type: "colonDash"} : colonDash)]},
    {"name": "doubleColon", "symbols": [(PrologLexer.has("doubleColon") ? {type: "doubleColon"} : doubleColon)]},
    {"name": "arrow", "symbols": [(PrologLexer.has("arrow") ? {type: "arrow"} : arrow)]},
    {"name": "notEqualsStrict", "symbols": [(PrologLexer.has("notEqualsStrict") ? {type: "notEqualsStrict"} : notEqualsStrict)]},
    {"name": "notEquals", "symbols": [(PrologLexer.has("notEquals") ? {type: "notEquals"} : notEquals)]},
    {"name": "lessThanEquals", "symbols": [(PrologLexer.has("lessThanEquals") ? {type: "lessThanEquals"} : lessThanEquals)]},
    {"name": "greaterThanEquals", "symbols": [(PrologLexer.has("greaterThanEquals") ? {type: "greaterThanEquals"} : greaterThanEquals)]},
    {"name": "equality", "symbols": [(PrologLexer.has("equality") ? {type: "equality"} : equality)]},
    {"name": "univOp", "symbols": [(PrologLexer.has("univOp") ? {type: "univOp"} : univOp)]},
    {"name": "unifyOp", "symbols": [(PrologLexer.has("unifyOp") ? {type: "unifyOp"} : unifyOp)]},
    {"name": "op", "symbols": [(PrologLexer.has("op") ? {type: "op"} : op)]},
    {"name": "cut", "symbols": [(PrologLexer.has("cut") ? {type: "cut"} : cut)]},
    {"name": "plus", "symbols": [(PrologLexer.has("plus") ? {type: "plus"} : plus)]},
    {"name": "minus", "symbols": [(PrologLexer.has("minus") ? {type: "minus"} : minus)]},
    {"name": "multiply", "symbols": [(PrologLexer.has("multiply") ? {type: "multiply"} : multiply)]},
    {"name": "divide", "symbols": [(PrologLexer.has("divide") ? {type: "divide"} : divide)]},
    {"name": "caret", "symbols": [(PrologLexer.has("caret") ? {type: "caret"} : caret)]},
    {"name": "pipe", "symbols": [(PrologLexer.has("pipe") ? {type: "pipe"} : pipe)]},
    {"name": "tilde", "symbols": [(PrologLexer.has("tilde") ? {type: "tilde"} : tilde)]},
    {"name": "at", "symbols": [(PrologLexer.has("at") ? {type: "at"} : at)]},
    {"name": "hash", "symbols": [(PrologLexer.has("hash") ? {type: "hash"} : hash)]},
    {"name": "lparen", "symbols": [(PrologLexer.has("lparen") ? {type: "lparen"} : lparen)]},
    {"name": "rparen", "symbols": [(PrologLexer.has("rparen") ? {type: "rparen"} : rparen)]},
    {"name": "lsquare", "symbols": [(PrologLexer.has("lsquare") ? {type: "lsquare"} : lsquare)]},
    {"name": "rsquare", "symbols": [(PrologLexer.has("rsquare") ? {type: "rsquare"} : rsquare)]},
    {"name": "lbracket", "symbols": [(PrologLexer.has("lbracket") ? {type: "lbracket"} : lbracket)]},
    {"name": "rbracket", "symbols": [(PrologLexer.has("rbracket") ? {type: "rbracket"} : rbracket)]},
    {"name": "comma", "symbols": [(PrologLexer.has("comma") ? {type: "comma"} : comma)]},
    {"name": "dot", "symbols": [(PrologLexer.has("dot") ? {type: "dot"} : dot)]},
    {"name": "semicolon", "symbols": [(PrologLexer.has("semicolon") ? {type: "semicolon"} : semicolon)]},
    {"name": "colon", "symbols": [(PrologLexer.has("colon") ? {type: "colon"} : colon)]}
  ],
  ParserStart: "program",
};

export default grammar;
