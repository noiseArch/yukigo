@{%
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

%}
@preprocessor typescript
@lexer HSLexer

program -> (declaration):* {% (d) => filter(d.flat(Infinity)) %}

expression -> concatenation {% (d) => parseExpression(d[0]) %}

lambda_expression -> 
    "(" _ "\\" _ parameter_list _ "->" _ expression _ ")" {% (d) => parseLambda([d[4], d[8]]) %}

concatenation ->
    comparison _ "++" _ concatenation {% (d) => ({ type: "Concat", operator: d[2].value, left: {type: "Expression", body:d[0]}, right: {type: "Expression", body:d[4]} }) %}
    | comparison {% (d) => d[0] %}

comparison ->
    addition _ comparison_operator _ comparison {% (d) => ({ type: "Comparison", operator: d[2].value, left: {type: "Expression", body:d[0]}, right: {type: "Expression", body:d[4]} }) %}
    | addition {% (d) => d[0] %}

addition -> 
    multiplication _ "+" _ addition {% (d) => ({ type: "Arithmetic", operator: d[2].value, left: {type: "Expression", body: d[0]}, right: {type: "Expression", body: d[4]} }) %}
    | multiplication _ "-" _ addition {% (d) => ({ type: "Arithmetic", operator: d[2].value, left: {type: "Expression", body: d[0]}, right: {type: "Expression", body: d[4]} }) %}
    | multiplication {% (d) => d[0] %}

multiplication ->
    infix_operator_expression _ "*" _ multiplication {% (d) => ({ type: "Arithmetic", operator: d[2].value, left: {type: "Expression", body: d[0]}, right: {type: "Expression", body: d[4]} }) %}
    | infix_operator_expression _ "/" _ multiplication {% (d) => ({ type: "Arithmetic", operator: d[2].value, left: {type: "Expression", body: d[0]}, right: {type: "Expression", body: d[4]} }) %}
    | infix_operator_expression {% (d) => d[0] %}

infix_operator_expression ->
    application _ "`" _ identifier _ "`" _ infix_operator_expression
    {% (d) => ({
        type: "infix_application",
        operator: d[4].value,
        left: d[0],
        right: d[8]
    }) %}
    | application {% d => d[0] %}

application -> primary (_ primary):* {% (d) => {
    if (d[1].length === 0) return d[0];
    return d[1].reduce((left, right) => parseApplication([left, right[1]]), d[0]);
} %}

primary ->
    %number {% (d) => parsePrimary(d[0]) %}
    | %char {% (d) => parsePrimary(d[0]) %}
    | %string {% (d) => parsePrimary(d[0]) %}
    | %bool {% (d) => parsePrimary(d[0]) %}
    | identifier {% (d) => d[0] %} ## No need to reprocess
    | tuple_expression {% (d) => d[0] %}
    | "(" _ expression _ ")" {% (d) => d[2] %}
    | list_literal {% (d) => parsePrimary({type: "list", body: filter(d[0])}) %}
    | composition_expression {% (d) => d[0] %}
    | lambda_expression {% (d) => d[0] %}
    | if_expression {% d => d[0] %}
    | case_expression {% d => d[0] %}
    | data_expression {% d => d[0] %}
    | let_in_expression {% d => d[0] %}

# Tuple expression: (expr, expr, ...)
tuple_expression -> "(" _ expression (_ "," _ expression):+ _ ")" {% (d) => ({ type: "TupleExpression", elements: [d[2], ...d[3].map(x => x[3])] }) %}

data_expression -> identifier _ %lbracket fields_expressions %rbracket {% (d) => parseDataExpression([d[0], d[3]]) %}

fields_expressions -> _ field_exp _ ("," _ field_exp):* {% (d) => {return filter(d.flat(Infinity)).filter(tok => tok.type !== "comma")}%}

field_exp -> identifier _ "=" _ expression {% (d) => ({type: "FieldExpression", name: d[0], expression: d[4]}) %}

if_expression ->
    "if" _ expression _ "then" _ expression _ "else" _ expression
    {% (d) => ({ type: "if", cond: d[2], then: d[6], else: d[10] }) %}

declaration -> function_declaration | function_type_declaration | type_declaration | data_declaration {% (d) => d[0] %}

data_declaration -> "data" __ identifier _ "=" _ identifier _ %lbracket field_list %rbracket {% (d) => parseDataDeclaration([d[2], d[6], d[9]]) %}

field_list -> _ field _ ("," _ field):* {% (d) => {return filter(d.flat(Infinity)).filter(tok => tok.type !== "comma")}%}

field -> identifier _ "::" _ type {% (d) => ({type: "Field", name: d[0], value: d[4]}) %}

function_type_declaration -> identifier _ "::" _ type {% (d) => parseFunctionType([d[0], d[4]]) %}

function_declaration -> 
    identifier __ parameter_list:? guarded_rhs_list:+ {% (d) => {return parseFunction({type: "function", name: d[0], params: d[2].flat(Infinity), body: d[3], return: d[3], attributes: ["GuardedBody"]})} %}
    | identifier __ parameter_list:? _ "=" _ expression {% (d) => {return parseFunction({type: "function", name: d[0], params: d[2] ? d[2].flat(Infinity) : [], body: d[6], return: d[6], attributes: ["UnguardedBody"]})} %}

guarded_rhs_list -> _ "|" _ guarded_rhs {% (d) => d[3] %}

guarded_rhs -> expression _ "=" _ expression {% (d) => {return { guard: d[0], body: d[4], return: d[4] }} %}

parameter_list -> 
    pattern __ parameter_list {% (d) => filter(d.flat(Infinity)) %}
    | pattern {% (d) => [d[0]] %}

pattern ->
    identifier {% (d) => ({type: "VariablePattern", name: d[0].value}) %}
  | %number {% (d) => ({type: "LiteralPattern", name: d[0].value}) %}
  | %string {% (d) => ({type: "LiteralPattern", name: d[0].value}) %}
  | %anonymousVariable {% (d) => ({type: "WildcardPattern", name: d[0].value}) %}
  | identifier pattern:+
  | "(" _ pattern (_ "," _ pattern):* _ ")" {% (d) => ({type: "TuplePattern", elements: [d[2], ...d[3].map(x => x[3])] }) %}
  | "[" _ parameter_list:? _ "]"
  | "(" _ pattern _ ")"

composition_expression ->
    identifier _ "." _ identifier {% (d) => parseCompositionExpression([d[0], d[4]]) %}

identifier -> %identifier {% (d) => parsePrimary(d[0]) %}

## All of these commented expression require NL to not be ignored. WIP
## TODO: Support newlines  
## Case expression

## case_expression ->
##     "case" __ expression __ "of" _ case_alternatives
##     {% (d) => ({ type: "case", expr: d[2], alts: d[6] }) %}
## 
## case_alternatives ->
##     case_alternative (__ case_alternative):*
##     {% (d) => [d[0], ...(d[1] ? d[1].map(x => x[1]) : [])] %}
## 
## case_alternative ->
##     pattern _ "->" _ expression
##     {% (d) => ({ pattern: d[0], body: d[4] }) %}

## Local bindings

## where_clause ->
##     _ "where" _ let_bindings
##     {% (d) => d[3] %}
## 
## let_in_expression ->
##     "let" __ let_bindings __ "in" __ expression
##     {% (d) => ({ type: "let_in", bindings: d[2], body: d[6] }) %}
## 
## let_bindings ->
##     let_binding (_ let_binding):*
##     {% (d) => [d[0], ...(d[1] ? d[1].map(x => x[3]) : [])] %}
## 
## let_binding -> identifier _ "=" _ expression _ ";" {% (d) => ({ name: d[0].value, value: d[4] }) %}


type_declaration -> "type" __ identifier _ "=" _ type {% (d) => parseTypeAlias([d[2], d[6]]) %}

# Full type parsing
type -> function_type {% (d) => d[0] %}

function_type ->
    (application_type _ "->" _):* application_type {% (d) => (d[0].length > 0 ? { type: "FunctionType", from: d[0].map(x => x[0]), to: d[1] } : d[1]) %}

application_type ->
    simple_type (_ simple_type):* {% (d) =>
        d[1].length === 0 ? d[0] : { type: "TypeApplication", base: d[0], args: d[1].map(x => x[1]) }
    %}

simple_type ->
    %identifier {% (d) => ({ type: "TypeVar", name: d[0].value }) %}
    | %constructor {% (d) => ({ type: "TypeConstructor", name: d[0].value }) %}
    | "[" _ type _ "]" {% (d) => ({ type: "ListType", element: d[2] }) %}
    | "(" _ type (_ "," _ type):+ _ ")" {% (d) =>
        ({ type: "TupleType", elements: [d[2], ...d[3].map(x => x[3])] })
    %}
    | "(" _ type _ ")" {% (d) => d[2] %}

list_literal -> "[" _ expression_list _ "]" {% (d) => d %}

expression_list -> 
    expression _ "," _ expression_list {% (d) => filter([d[0], d[4]]).flat(Infinity) %}
    | expression {% (d) => [d[0]] %}

comparison_operator -> 
    "==" | "/=" | "<" | ">" | "<=" | ">=" {% (d) => d[0] %}

_ -> %WS:* {% (d) => null %}

__ -> %WS:+ {% (d) => null %}
