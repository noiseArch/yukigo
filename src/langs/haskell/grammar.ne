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
    comparison _ "++" _ concatenation {% (d) => filter(d) %}
    | comparison {% (d) => d[0] %}

comparison ->
    addition _ comparison_operator _ comparison {% (d) => ({ type: "comparison", operator: d[2].value, left: d[0], right: d[4] }) %}
    | addition {% (d) => d[0] %}

addition -> 
    multiplication _ "+" _ addition {% (d) => filter(d) %}
    | multiplication _ "-" _ addition {% (d) => filter(d) %}
    | multiplication {% (d) => d[0] %}

multiplication ->
    infix_operator_expression _ "*" _ multiplication {% (d) => filter(d) %}
    | infix_operator_expression _ "/" _ multiplication {% (d) => filter(d) %}
    | infix_operator_expression {% (d) => d[0] %}


infix_operator_expression ->
    application _ "`" _ %identifier _ "`" _ infix_operator_expression
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
    | %identifier {% (d) => parsePrimary(d[0]) %}
    | "(" _ expression _ ")" {% (d) => d[2] %}
    | list_literal {% (d) => parsePrimary({type: "list", body: d[0]}) %}
    | composition_expression {% (d) => {return d[0]} %}
    | lambda_expression {% (d) => {return d[0]} %}
    | if_expression {% d => d[0] %}
    | let_in_expression {% d => d[0] %}

if_expression ->
    "if" _ expression _ "then" _ expression _ "else" _ expression
    {% (d) => ({ type: "if", cond: d[2], then: d[6], else: d[10] }) %}

declaration -> function_declaration | function_type_declaration | type_declaration {% (d) => d[0] %}

function_type_declaration -> %identifier _ "::" _ type_list {% (d) => parseFunctionType([d[0], d[4]]) %}

function_declaration -> %identifier __ parameter_list:? _ "=" _ expression where_clause:? {% (d) => parseFunction(d) %}

parameter_list -> 
    (%identifier|%string|%number| "(" %identifier ":" %identifier ")") __ parameter_list {% (d) => filter(d.flat(Infinity)) %}
    | (%identifier|%string|%number| "(" %identifier ":" %identifier ")") {% (d) => [d[0]] %}

composition_expression ->
    %identifier _ "." _ %identifier {% (d) => parseCompositionExpression([d[0], d[4]]) %}

## Local bindings

where_clause ->
    _ "where" _ let_bindings
    {% (d) => d[3] %}

let_in_expression ->
    "let" __ let_bindings __ "in" __ expression
    {% (d) => ({ type: "let_in", bindings: d[2], body: d[6] }) %}

let_bindings ->
    let_binding (_ let_binding):*
    {% (d) => [d[0], ...(d[1] ? d[1].map(x => x[3]) : [])] %}

let_binding -> %identifier _ "=" _ expression _ ";" {% (d) => ({ name: d[0].value, value: d[4] }) %}

type_declaration -> "type" __ %identifier _ "=" _ type_list {% (d) => parseTypeAlias(d) %}

type_list -> 
    ("[":? %identifier "]":?) _ "->" _ type_list {% (d) => filter(d) %}
    | "[":? %identifier "]":? {% (d) => filter(d) %}

list_literal -> "[" _ expression_list _ "]" {% (d) => d %}

expression_list -> 
    expression _ "," _ expression_list {% (d) => filter([d[0], d[4]]).flat(Infinity) %}
    | expression {% (d) => [d[0]] %}

comparison_operator -> 
    "==" | "/=" | "<" | ">" | "<=" | ">="

_ -> %WS:* {% (d) => null %}

__ -> %WS:+ {% (d) => null %}
