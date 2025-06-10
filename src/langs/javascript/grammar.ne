@{%
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

%}
@preprocessor typescript
@lexer JSLexer

program -> statement_list %EOF

statement_list -> (statement:*) {% (d) => d[0] %}

statement -> (
    declaration
    | expression_statement
    | block
    | if_statement
    | iteration_statement
    | break_statement
    | continue_statement
    | return_statement
    | throw_statement
    | try_statement
    | empty_statement) {% (d) => {return d[0]} %}


declaration -> (
    variable_declaration
    | function_declaration
    | class_declaration) {% (d) => d[0] %}

variable_declaration -> 
    ("const" identifier %assign expression %semicolon) {% (d) => d[0] %}
    | ("let" identifier %assign expression %semicolon) {% (d) => d[0] %}
    | ("var" identifier %assign expression %semicolon) {% (d) => d[0] %}

function_declaration -> 
    "async":? "function" identifier parameter_list block

class_declaration -> 
    "class" identifier class_body

class_body -> 
    %lbracket class_element_list:? %rbracket


class_element_list -> 
    class_element {% (d) => d[0] %}
    | class_element_list class_element 

class_element -> 
    method_definition {% (d) => d[0] %}
    | "static" method_definition
    | constructor_definition {% (d) => d[0] %}

constructor_definition -> 
    "constructor" parameter_list block 

method_definition -> 
    property_name parameter_list  block

property_name -> 
    identifier {% (d) => d[0] %}
    | %string {% (d) => d[0] %}
    | %number {% (d) => d[0] %}
    | %lsquare expression %rsquare

parameter_list -> %lparen (identifier ("," identifier):*):? %rparen

block -> 
    %lbracket statement:* %rbracket

if_statement -> 
    "if" %lparen expression %rparen statement
    | "if" %lparen expression %rparen statement "else" statement

iteration_statement -> 
    "while" %lparen expression %rparen statement
    | "for" %lparen for_initializer:? ";" expression:? ";" expression:? %rparen statement

for_initializer -> 
    variable_declaration {% (d) => d[0] %}
    | expression {% (d) => d[0] %}

break_statement -> 
    "break" %semicolon

continue_statement -> 
    "continue" %semicolon

return_statement -> 
    "return" expression:? %semicolon

throw_statement -> 
    "throw" expression %semicolon

try_statement -> 
    "try" block catch_clause
    | "try" block catch_clause "finally" block

catch_clause -> 
    "catch" %lparen identifier %rparen block

empty_statement -> 
    %semicolon {% (d) => d[0] %}

expression_statement -> 
    assignment_expression %semicolon 

expression -> 
    conditional_expression {% (d) => d[0] %}

assignment_expression -> 
    conditional_expression {% (d) => d[0] %}
    | identifier %assign assignment_expression

arrow_function -> 
    parameter_list "=>" ((%lbracket statement_list:? %rbracket) | expression)

conditional_expression -> 
    logical_or_expression {% (d) => d[0] %}
    | logical_or_expression "?" assignment_expression ":" assignment_expression

logical_or_expression -> 
    logical_and_expression {% (d) => d[0] %}
    | logical_or_expression "||" logical_and_expression

logical_and_expression -> 
    equality_expression {% (d) => d[0] %}
    | logical_and_expression "&&" equality_expression

equality_expression -> 
    relational_expression {% (d) => d[0] %}
    | equality_expression "===" relational_expression
    | equality_expression "!=" relational_expression
    | equality_expression "!==" relational_expression
    | equality_expression "==" relational_expression

relational_expression -> 
    additive_expression {% (d) => d[0] %}
    | relational_expression "<" additive_expression
    | relational_expression ">" additive_expression
    | relational_expression "<=" additive_expression
    | relational_expression ">=" additive_expression

additive_expression -> 
    multiplicative_expression {% (d) => d[0] %}
    | additive_expression "+" multiplicative_expression
    | additive_expression "-" multiplicative_expression

multiplicative_expression -> 
    unary_expression {% (d) => d[0] %}
    | multiplicative_expression "*" unary_expression
    | multiplicative_expression "/" unary_expression
    | multiplicative_expression "%" unary_expression

unary_expression -> 
    primary_expression {% (d) => d[0] %}
    | "!" unary_expression
    | "-" unary_expression
    | "+" unary_expression
    | "await" unary_expression
    | "delete" unary_expression
    | "typeof" unary_expression
    | "void" unary_expression

primary_expression -> 
    (call_expression
    | member_expression
    | identifier
    | %number
    | %string
    | "true" | "false" | "null" | "undefined"
    | "this"
    | array_literal
    | object_literal) {% (d) => d[0] %} 
    | %lparen expression %rparen
    | "new" primary_expression argument_list


member_expression -> 
    primary_expression %dot call_expression
    | primary_expression %dot identifier
    | primary_expression %lsquare expression %rsquare

call_expression -> 
    (primary_expression | "then" | "catch" | "finally") argument_list

argument_list -> %lparen (expression ("," expression):*):? %rparen {%(d)=> {console.log(util.inspect(d, false, null, true)); return d}%}

array_literal -> 
    %lsquare element_list:? %rsquare

element_list -> 
    expression {% (d) => d[0] %}
    | (element_list {% (d) => d[0] %}) "," expression

object_literal -> 
    %lbracket property_definition_list:? %rbracket

property_definition_list -> 
    property_definition {% (d) => d[0] %}
    | (property_definition_list {% (d) => d[0] %}) "," property_definition

property_definition -> 
    identifier ":" expression
    | identifier {% (d) => d[0] %}

identifier -> 
    %identifier {% (d) => d[0] %}

##statement -> 
##    "const" identifier %assign expression %semicolon:? NL:* {% (d) => {return parseStatement(filter(d))} %}
##    | "let" identifier %assign expression %semicolon:? NL:* {% (d) => {return parseStatement(filter(d))} %}
##    | "var" identifier %assign expression %semicolon:? NL:* {% (d) => {return parseStatement(filter(d))} %}
##    | identifier %assign expression %semicolon:? NL:* {% (d) => {return parseStatement(filter(d))} %}
##
##expression ->
##    term {% (d) => {return parseExpression(filter(d))} %}
##    | term "+" term {% (d) => {return parseExpression(filter(d))} %}
##    | term "-" term {% (d) => {return parseExpression(filter(d))} %}
##    | term ">=" term {% (d) => {return parseExpression(filter(d))} %}
##
##term -> 
##    primary {% (d) => {return parseTerm(filter(d))}%}
##    | primary "*" primary {% (d) => {return parseTerm(filter(d))}%}
##    | primary "/" primary {% (d) => {return parseTerm(filter(d))}%}
##
##
##primary -> 
##    identifier {% (d) => {return parsePrimary(filter(d))}%}
##    | %number {% (d) => {return parsePrimary(filter(d))}%}
##    | %string {% (d) => {return parsePrimary(filter(d))}%}
##    | %lparen expression %rparen {% (d) => {return parsePrimary(filter(d))}%}
##
##identifier -> %identifier {%(d) => {return parseIdentifier(filter(d))}%}
##-> " ":+ {% (d) => {return null} %}  Ignore whitespaces