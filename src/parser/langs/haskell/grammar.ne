@{%
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

%}
@preprocessor typescript
@lexer HSLexer

program -> (declaration):* {% (d) => filter(d.flat(Infinity)) %}

expression -> concatenation {% (d) => parseExpression(d[0]) %}

lambda_expression -> 
    "(" _ "\\" _ parameter_list _ "->" _ expression _ ")" {% (d) => parseLambda([d[4], d[8]]) %}

concatenation ->
    comparison _ "++" _ concatenation {% (d) => ({ type: "concatenation", operator: d[2].value, left: d[0], right: d[4] }) %}
    | comparison {% (d) => d[0] %}

comparison ->
    addition _ comparison_operator _ comparison {% (d) => ({ type: "comparison", operator: d[2].value, left: d[0], right: d[4] }) %}
    | addition {% (d) => d[0] %}

addition -> 
    multiplication _ "+" _ addition {% (d) => ({ type: "addition", operator: d[2].value, left: d[0], right: d[4] }) %}
    | multiplication _ "-" _ addition {% (d) => ({ type: "subtraction", operator: d[2].value, left: d[0], right: d[4] }) %}
    | multiplication {% (d) => d[0] %}

multiplication ->
    infix_operator_expression _ "*" _ multiplication {% (d) => ({ type: "multiplication", operator: d[2].value, left: d[0], right: d[4] }) %}
    | infix_operator_expression _ "/" _ multiplication {% (d) => ({ type: "division", operator: d[2].value, left: d[0], right: d[4] }) %}
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

application ->
    primary __ application {% (d) => {return {type: "application", body: filter(d).flat(Infinity)}} %}
    | primary {% (d) => { return d[0] } %}

primary ->
    %number {% (d) => parsePrimary(d[0]) %}
    | %string {% (d) => parsePrimary(d[0]) %}
    | %bool {% (d) => ({type: "Boolean", value: d[0]}) %}
    | identifier {% (d) => d[0] %} ## No need to reprocess
    | "(" _ expression _ ")" {% (d) => d[2] %}
    | list_literal {% (d) => parsePrimary({type: "list", body: d[0]}) %}
    | composition_expression {% (d) => {return d[0]} %}
    | lambda_expression {% (d) => {return d[0]} %}
    | if_expression {% d => d[0] %}
    | case_expression {% d => d[0] %}
    | data_expression {% d => d[0] %}
    | let_in_expression {% d => d[0] %}

data_expression -> identifier _ %lbracket fields_expressions %rbracket {% (d) => ({type: "DataExpression", name: d[0], contents: d[3]}) %}

fields_expressions -> _ field_exp _ ("," _ field_exp):* {% (d) => {return filter(d.flat(Infinity)).filter(tok => tok.type !== "comma")}%}

field_exp -> identifier _ "=" _ expression {% (d) => ({type: "FieldExpression", name: d[0], contents: d[4]}) %}

if_expression ->
    "if" _ expression _ "then" _ expression _ "else" _ expression
    {% (d) => ({ type: "if", cond: d[2], then: d[6], else: d[10] }) %}

declaration -> function_declaration | function_type_declaration | type_declaration | data_declaration {% (d) => d[0] %}

data_declaration -> "data" __ identifier _ "=" _ identifier _ %lbracket field_list %rbracket {% (d) => ({type: "Record", name: d[6], contents: d[9]}) %}

field_list -> _ field _ ("," _ field):* {% (d) => {return filter(d.flat(Infinity)).filter(tok => tok.type !== "comma")}%}

field -> identifier _ "::" _ type_list {% (d) => ({type: "Field", name: d[0], contents: d[4]}) %}

function_type_declaration -> identifier _ "::" _ type_list {% (d) => parseFunctionType([d[0], d[4]]) %}

function_declaration -> 
    identifier __ parameter_list:? guarded_rhs_list:+ {% (d) => {return parseFunction({type: "function", name: d[0], params: d[2].flat(Infinity), body: d[3], attributes: ["GuardedBody"]})} %}
    | identifier __ parameter_list:? _ "=" _ expression {% (d) => {return parseFunction({type: "function", name: d[0], params: d[2] ? d[2].flat(Infinity) : [], body: d[6], attributes: ["UnguardedBody"]})} %}

guarded_rhs_list -> _ "|" _ guarded_rhs {% (d) => d[3] %}

guarded_rhs -> expression _ "=" _ expression {% (d) => {return { guard: d[0], body: d[4] }} %}

parameter_list -> 
    pattern __ parameter_list {% (d) => filter(d.flat(Infinity)) %}
    | pattern {% (d) => [d[0]] %}

pattern ->
    identifier {% (d) => ({type: "VariablePattern", name: d[0].value}) %}
  | %number {% (d) => ({type: "LiteralPattern", name: d[0].value}) %}
  | %string {% (d) => ({type: "LiteralPattern", name: d[0].value}) %}
  | %anonymousVariable {% (d) => ({type: "WildcardPattern", name: d[0].value}) %}
  | identifier pattern:+
  | "(" _ pattern (_ "," _ pattern):* _ ")"
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

type_declaration -> "type" __ identifier _ "=" _ type_list {% (d) => parseTypeAlias(d) %}

type_list -> 
    ("[":? identifier "]":?) _ "->" _ type_list {% (d) => filter(d) %}
    | "[":? identifier "]":? {% (d) => filter(d) %}

list_literal -> "[" _ expression_list _ "]" {% (d) => d %}

expression_list -> 
    expression _ "," _ expression_list {% (d) => filter([d[0], d[4]]).flat(Infinity) %}
    | expression {% (d) => [d[0]] %}

comparison_operator -> 
    "==" | "/=" | "<" | ">" | "<=" | ">=" {% (d) => d[0] %}

_ -> %WS:* {% (d) => null %}

__ -> %WS:+ {% (d) => null %}
