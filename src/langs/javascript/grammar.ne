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

program -> (statement|declaration):* %EOF

statement_list -> (statement:*) {% (d) => d[0] %}

statement -> (
    expression ";"
    | if_statement
    # switch_statement
    | block
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
    | ("let" identifier (%assign expression):? %semicolon) {% (d) => d[0] %}
    | ("var" identifier (%assign expression):? %semicolon) {% (d) => d[0] %}

function_declaration -> 
    "async":? "function" identifier parameter_list block ";"

class_declaration -> 
    "class" identifier class_body ";"

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

expression -> 
    ternary_expression {% (d) => d[0] %}
	| binary_expression {% (d) => d[0] %}
	| unary_expression {% (d) => d[0] %}
	| primary_expression {% (d) => d[0] %}
	| assignment_expression {% (d) => d[0] %}
 
assignment_expression ->
    primary_expression "=" expression
	| primary_expression "+=" expression
	| primary_expression "-=" expression
	| primary_expression "*=" expression
	| primary_expression "/=" expression
	| primary_expression "%=" expression
	| primary_expression "**=" expression
	| primary_expression ">>=" expression
	| primary_expression "<<=" expression
	| primary_expression ">>>=" expression
	| primary_expression "&=" expression
	| primary_expression "^=" expression
	| primary_expression "|=" expression
	| primary_expression "&&=" expression
	| primary_expression "||=" expression
	| primary_expression "??=" expression

ternary_expression -> binary_expression "?" binary_expression ":" binary_expression

binary_expression -> 
    nullish_binary_expression

nullish_binary_expression ->
    logical_or_binary_expression "??" nullish_binary_expression
    | logical_or_binary_expression

logical_or_binary_expression -> 
    logical_and_binary_expression "||" logical_or_binary_expression
    | logical_and_binary_expression

logical_and_binary_expression -> 
    bitwise_or_binary_expression "&&" logical_and_binary_expression
    | bitwise_or_binary_expression

bitwise_or_binary_expression -> 
    bitwise_xor_binary_expression "|" bitwise_or_binary_expression
    |bitwise_xor_binary_expression

bitwise_xor_binary_expression -> 
    bitwise_and_binary_expression "^" bitwise_xor_binary_expression
    | bitwise_and_binary_expression

bitwise_and_binary_expression -> 
    equality_binary_expression "&" bitwise_and_binary_expression
    | equality_binary_expression

equality_binary_expression ->
    relational_binary_expression "==" equality_binary_expression
	| relational_binary_expression "===" equality_binary_expression
	| relational_binary_expression "!=" equality_binary_expression
	| relational_binary_expression "!==" equality_binary_expression
    | relational_binary_expression

relational_binary_expression -> 
    bitwise_shift_binary_expression "<" relational_binary_expression
	| bitwise_shift_binary_expression "<=" relational_binary_expression
	| bitwise_shift_binary_expression ">" relational_binary_expression
	| bitwise_shift_binary_expression ">=" relational_binary_expression
	| bitwise_shift_binary_expression "??" relational_binary_expression
    | bitwise_shift_binary_expression

bitwise_shift_binary_expression	-> 
    additive_binary_expression ">>" bitwise_shift_binary_expression
	| additive_binary_expression "<<" bitwise_shift_binary_expression
	| additive_binary_expression ">>>" bitwise_shift_binary_expression
    | additive_binary_expression

additive_binary_expression	-> 
    multiplicative_binary_expression "+" additive_binary_expression
	| multiplicative_binary_expression "-" additive_binary_expression
    | multiplicative_binary_expression

multiplicative_binary_expression -> 
    unary_expression "*" multiplicative_binary_expression
	| unary_expression "/" multiplicative_binary_expression
	| unary_expression "%" multiplicative_binary_expression
	| unary_expression "**" multiplicative_binary_expression
    | unary_expression

unary_expression -> prefix_expression | postfix_expression | primary_expression

postfix_expression ->
    primary_expression property_access_postfix
	| primary_expression function_call_postfix
	| primary_expression "++"
	| primary_expression "--"
	| primary_expression %template
	| primary_expression  "?"

prefix_expression		-> 
    "+" primary_expression
	| "-" primary_expression
	| "++" primary_expression
	| "--" primary_expression
	| "!" primary_expression
	| "~" primary_expression
	| "..." expression
	| "typeof" expression
	| "void" expression
	| "delete" expression
	| "await" expression
	| "new" expression

primary_expression -> 
    %number {% (d) => d[0] %}
    | %string {% (d) => d[0] %}
    | "null" | "undefined" {% (d) => d[0] %}
    | "true" | "false" {% (d) => d[0] %}
    # | %regex 
	| %template {% (d) => d[0] %}
    | array_literal {% (d) => d[0] %}
    | object_literal {% (d) => d[0] %}
	| %lparen expression %rparen
	| class_declaration {% (d) => d[0] %}
	| function_declaration {% (d) => d[0] %}
	# | arrow_function
	| "this" {% (d) => d[0] %}
	| identifier {% (d) => d[0] %}


function_call_postfix -> %lbracket comma_separated_expressions %rbracket
comma_separated_expressions -> expression ("," expression):?

property_access_postfix -> bracket_notation_property | dot_notation_property

bracket_notation_property -> bracket_enclosed_expression:+

bracket_enclosed_expression -> %lsquare expression %rsquare

dot_notation_property -> "." dot_separated_expressions

dot_separated_expressions -> expression ("." expression):*

argument_list -> %lparen arg_list:? %rparen {%(d) => {console.log(util.inspect(d.flat(Infinity), false ,null, true)), console.log("\n\n"); return d}%}

arg_list -> (expression ("," expression):*) 

array_literal -> 
    %lsquare element_list:? %rsquare 

element_list -> 
    expression {% (d) => d[0] %}
    | (element_list {% (d) => d[0] %}) "," expression

object_literal -> 
    %lbracket property_definition_list:? %rbracket {%(d) => {return d}%}

property_definition_list -> 
    property_definition {% (d) => d[0] %}
    | (property_definition_list {% (d) => d[0] %}) "," property_definition

property_definition -> 
    identifier ":" expression
    | identifier {% (d) => d[0] %}

identifier -> 
    %identifier {% (d) => d[0] %}