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
    "(" "\\" _ parameter_list _ "->" _ expression ")" {% (d) => parseLambda([d[3], d[7]]) %}

function_expression -> 
    %identifier _ "(" _ argument_list _ ")" _ {% (d) => parseFunctionExpression([d[0], d[4]]) %}
    | %identifier __ primary (__ primary):* {% (d) => parseFunctionExpression([d[0], d[1], [d[2]]]) %}

composition_expression ->
    %identifier _ "." _ %identifier {% (d) => parseCompositionExpression([d[0], d[4]]) %}

argument_list -> 
    primary __ argument_list {% (d) => {console.log(d); return filter(d)} %}
    | primary {% (d) => {console.log(d); return d} %}

concatenation ->
    addition _ "++" _ concatenation {% (d) => filter(d) %}
    | addition {% (d) => d[0] %}

addition -> 
    multiplication _ "+" _ multiplication {% (d) => filter(d) %}
    | multiplication _ "-" _ multiplication {% (d) => filter(d) %}
    | multiplication {% (d) => d[0] %}


multiplication ->
    primary _ "*" _ primary {% (d) => filter(d) %}
    | primary _ "/" _ primary {% (d) => filter(d) %}
    | primary {% (d) => d[0] %}

primary ->
    %number {% (d) => parsePrimary(d[0]) %}
    | %string {% (d) => parsePrimary(d[0]) %}
    | %identifier {% (d) => parsePrimary(d[0]) %}
    ##| "(" _ expression _ ")" {% (d) => d %}
    | list_literal {% (d) => parsePrimary({type: "list", body: d[0]}) %}
    | function_expression {% (d) => {return d[0]} %}
    | composition_expression {% (d) => {return d[0]} %}
    | lambda_expression {% (d) => {return d[0]} %}

declaration -> function_declaration | function_type_declaration | type_declaration {% (d) => d[0] %}

function_type_declaration -> %identifier _ "::" _ type_list {% (d) => parseFunctionType([d[0], d[4]]) %}

function_declaration -> %identifier __ parameter_list:? _ "=" _ expression {% (d) => parseFunction(d) %}

parameter_list -> 
    (%identifier|%string|%number| "(" %identifier ":" %identifier ")") __ parameter_list {% (d) => filter(d.flat(Infinity)) %}
    | (%identifier|%string|%number| "(" %identifier ":" %identifier ")") {% (d) => [d[0]] %}

type_declaration -> "type" __ %identifier _ "=" _ type_list {% (d) => parseTypeAlias(d) %}

type_list -> 
    ("[":? %identifier "]":?) _ "->" _ type_list {% (d) => filter(d) %}
    | "[":? %identifier "]":? {% (d) => filter(d) %}

list_literal -> "[" _ expression_list _ "]" {% (d) => d %}

expression_list -> 
    expression _ "," _ expression_list {% (d) => filter([d[0], d[4]]).flat(Infinity) %}
    | expression {% (d) => [d[0]] %}


_ -> %WS:* {% (d) => null %}

__ -> %WS:+ {% (d) => null %}
