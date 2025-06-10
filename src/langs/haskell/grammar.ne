@{%
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

%}
@preprocessor typescript
@lexer HSLexer

program -> "module" __ %identifier __ "where" (statement|declaration):*

statement -> expression {% (d) => d[0] %}

expression -> addition {% (d) => d[0] %}

addition -> 
    multiplication _ "+" _ multiplication
    | multiplication _ "-" _ multiplication
    | multiplication {% (d) => d[0] %}

multiplication ->
    primary _ "*" _ primary
    | primary _ "/" _ primary
    | primary {% (d) => d[0] %}

primary ->
    %number {% (d) => d[0] %}
    | %string {% (d) => d[0] %}
    | %identifier {% (d) => d[0] %}

declaration -> function_declaration {% (d) => d[0] %}

function_declaration -> %identifier __ parameter_list:? _ "=" _ expression

parameter_list -> 
    %identifier __ parameter_list
    | %identifier {% (d) => d[0] %}


_ -> %WS:*

__ -> %WS
