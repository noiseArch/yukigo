@{%
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

%}

@preprocessor typescript
@lexer PrologLexer

program -> (clause %NL | %NL):* {% d => d[0] %}

clause -> head colonDash  %NL:* body dot {% d => ({ type: 'rule', head: d[0], body: d[2] }) %}
        | head dot                 {% d => ({ type: 'fact', head: d[0] }) %}

head -> term {% id %}

body -> term comma %NL:* body      {% d => ({ type: 'conjunction', left: d[0], right: d[2] }) %}
      | term semicolon %NL:* body  {% d => ({ type: 'disjunction', left: d[0], right: d[2] }) %}
      | term {% id %}

term -> atom                {% id %}
      | variable            {% id %}
      | anonymousVariable   {% id %}
      | number              {% id %}
      | string              {% id %}
      | list                {% id %}
      | structure           {% id %}
      | parenthesized_term  {% id %}
      | op_term             {% id %}

parenthesized_term -> lparen term rparen {% d => d[1] %}

list -> lsquare rsquare {% () => ({ type: 'list', elements: [] }) %}
      | lsquare term list_rest rsquare {% d => d %}

list_rest -> comma term_list                         {% d => ({ type: 'elements', elements: d[1] }) %}
           | pipe term                               {% d => ({ type: 'tail', value: d[1] }) %}

term_list -> term comma term_list {% d => [d[0], ...d[2]] %}
           | term                   {% d => [d[0]] %}

structure -> atom lparen term_arguments rparen {% d => ({ type: 'structure', functor: d[0], args: d[2] }) %}
           | keyword lparen term_arguments rparen {% d => ({ type: 'structure', functor: d[0], args: d[2] }) %}

term_arguments -> term_list {% id %}

op_term -> term op term {% d => ({ type: 'infix_op', operator: d[1], left: d[0], right: d[2] }) %}
         | term plus term {% d => ({ type: 'infix_op', operator: d[1], left: d[0], right: d[2] }) %}
         | term minus term {% d => ({ type: 'infix_op', operator: d[1], left: d[0], right: d[2] }) %}
         | term multiply term {% d => ({ type: 'infix_op', operator: d[1], left: d[0], right: d[2] }) %}
         | term divide term {% d => ({ type: 'infix_op', operator: d[1], left: d[0], right: d[2] }) %}
         | term caret term {% d => ({ type: 'infix_op', operator: d[1], left: d[0], right: d[2] }) %}
         | term equality term {% d => ({ type: 'infix_op', operator: d[1], left: d[0], right: d[2] }) %}
         | term notEquals term {% d => ({ type: 'infix_op', operator: d[1], left: d[0], right: d[2] }) %}
         | term notEqualsStrict term {% d => ({ type: 'infix_op', operator: d[1], left: d[0], right: d[2] }) %}
         | term lessThan term {% d => ({ type: 'infix_op', operator: d[1], left: d[0], right: d[2] }) %}
         | term lessThanEquals term {% d => ({ type: 'infix_op', operator: d[1], left: d[0], right: d[2] }) %}
         | term greaterThan term {% d => ({ type: 'infix_op', operator: d[1], left: d[0], right: d[2] }) %}
         | term greaterThanEquals term {% d => ({ type: 'infix_op', operator: d[1], left: d[0], right: d[2] }) %}
         | term univOp term {% d => ({ type: 'infix_op', operator: d[1], left: d[0], right: d[2] }) %}
         | term unifyOp term {% d => ({ type: 'infix_op', operator: d[1], left: d[0], right: d[2] }) %}
         | term "is" term {% d => ({ type: 'is_op', operator: d[1], left: d[0], right: d[2] }) %}
         | cut {% d => ({ type: 'cut', value: d }) %}
         | tilde term {% d => ({ type: 'prefix_op', operator: d[0], operand: d[1] }) %}
         | plus term {% d => ({ type: 'prefix_op', operator: d[0], operand: d[1] }) %}
         | minus term {% d => ({ type: 'prefix_op', operator: d[0], operand: d[1] }) %}

atom -> %atom               {% d => ({ type: 'atom', value: d[0].value }) %}
keyword -> %keyword         {% d => ({ type: 'keyword', value: d[0].value }) %}
variable -> %variable       {% d => ({ type: 'variable', value: d[0].value }) %}
anonymousVariable -> %anonymousVariable {% d => ({ type: 'anonymousVariable', value: d[0].value }) %}
number -> %number           {% d => ({ type: 'number', value: parseFloat(d[0].value) }) %}
string -> %string           {% d => ({ type: 'string', value: d[0].value.slice(1, -1) }) %}

colonDash -> %colonDash
doubleColon -> %doubleColon
arrow -> %arrow
notEqualsStrict -> %notEqualsStrict
notEquals -> %notEquals
lessThanEquals -> %lessThanEquals
greaterThanEquals -> %greaterThanEquals
equality -> %equality
univOp -> %univOp
unifyOp -> %unifyOp
op -> %op
cut -> %cut
plus -> %plus
minus -> %minus
multiply -> %multiply
divide -> %divide
caret -> %caret
pipe -> %pipe
tilde -> %tilde
at -> %at
hash -> %hash
lparen -> %lparen
rparen -> %rparen
lsquare -> %lsquare
rsquare -> %rsquare
lbracket -> %lbracket
rbracket -> %rbracket
comma -> %comma
dot -> %dot
semicolon -> %semicolon
colon -> %colon