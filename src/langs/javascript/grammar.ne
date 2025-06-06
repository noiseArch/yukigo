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

const filter = d => {
    return d.filter((token) => token !== null);
};
JSLexer.next = (next => () => {
    let tok;
    while ((tok = next.call(JSLexer)) && (tok.type === "WS" || tok.type === "NL")) {}
    return tok;
})(JSLexer.next);

%}
@preprocessor typescript
@lexer JSLexer

program -> statementList {% id %}

statementList -> (statement|%comment):*

statement -> block
    | variableStatement
    | importStatement
    | exportStatement
    | emptyStatement
    | classDeclaration
    | functionDeclaration
    | expressionStatement
    | ifStatement
    | iterationStatement
    | continueStatement
    | breakStatement
    | returnStatement
    | yieldStatement
    | withStatement
    | labelledStatement
    | switchStatement
    | throwStatement
    | tryStatement
    | debuggerStatement

block -> "{" statementList:? "}"

importStatement -> "import" importFromBlock

importFromBlock -> importDefault:? (importNamespace | importModuleItems) importFrom eos
    | %string eos

importModuleItems -> "{" importAliasNameList:? "}"
importAliasNameList -> importAliasName ("," importAliasName):* ",":?

importAliasName -> moduleExportName ( "as" importedBinding ):?

moduleExportName -> identifier | %string

importedBinding -> identifier

importDefault -> aliasName ","

importNamespace -> ("*" | identifier) ("as" identifier):?

importFrom -> "from" %string

aliasName -> identifier ("as" identifier):?

exportStatement -> "export" "default":? (exportFromBlock | declaration) eos
    | "export" "default" singleExpression eos

exportFromBlock -> importNamespace importFrom eos
    | exportModuleItems importFrom:? eos

exportModuleItems -> "{" exportAliasNameList:? "}"
exportAliasNameList -> exportAliasName ("," exportAliasName):* ",":?

exportAliasName -> moduleExportName ("as" moduleExportName):?

declaration -> variableStatement | classDeclaration | functionDeclaration

variableStatement -> variableDeclarationList eos

variableDeclarationList -> varModifier variableDeclaration ("," variableDeclaration):*

variableDeclaration -> assignable ("=" singleExpression):?

emptyStatement -> ";"

expressionStatement -> expressionSequence eos

ifStatement -> "if" "(" expressionSequence ")" statement ("else" statement):?

iterationStatement -> "do" statement "while" "(" expressionSequence ")" eos
    | "while" "(" expressionSequence ")" statement
    | "for" "(" (expressionSequence | variableDeclarationList):? ";" expressionSequence:? ";" expressionSequence:? ")" statement
    | "for" "(" (singleExpression | variableDeclarationList) "in" expressionSequence ")" statement
    | "for" "await":? "(" (singleExpression | variableDeclarationList) "of" expressionSequence ")" statement

varModifier -> "var" | "let" | "const"

continueStatement -> "continue" identifier:? eos

breakStatement -> "break" identifier:? eos

returnStatement -> "return" expressionSequence:? eos

yieldStatement -> ("yield" | "yield*") expressionSequence:? eos

withStatement -> "with" "(" expressionSequence ")" statement

switchStatement -> "switch" "(" expressionSequence ")" caseBlock

caseBlock -> "{" caseClauses:? (defaultClause caseClauses:?):? "}"

caseClauses -> caseClause:+

caseClause -> "case" expressionSequence ":" statementList:?

defaultClause -> "default" ":" statementList:?

labelledStatement -> identifier ":" statement

throwStatement -> "throw" expressionSequence eos

tryStatement -> "try" block (catchProduction finallyProduction:? | finallyProduction)

catchProduction -> "catch" ("(" assignable:? ")"):? block

finallyProduction -> "finally" block

debuggerStatement -> "debugger" eos

functionDeclaration -> "async":? "function" "*" :? identifier "(" formalParameterList:? ")" functionBody

classDeclaration -> "class" identifier classTail

classTail -> ("extends" singleExpression):? "{" classElement:* "}"

classElement -> ("static":? identifier):? methodDefinition
    | ("static":? identifier):? fieldDefinition
    | ("static":? identifier) block
    | emptyStatement

methodDefinition -> ("async":? ):? "*" :? classElementName "(" formalParameterList:? ")" functionBody
    | "*" :? getter "(" ")" functionBody
    | "*" :? setter "(" formalParameterList:? ")" functionBody

fieldDefinition -> classElementName initializer:?

classElementName -> propertyName | privateIdentifier

privateIdentifier -> "#" identifier

formalParameterList -> formalParameterArg ("," formalParameterArg):* ("," lastFormalParameterArg):? | lastFormalParameterArg

formalParameterArg -> assignable ("=" singleExpression):?

lastFormalParameterArg -> "..." singleExpression

functionBody -> "{" sourceElements:? "}"

sourceElements -> sourceElement:+

sourceElement -> statement

arrayLiteral -> "[" elementList "]"

elementList -> ",":* arrayElement:? (",":+ arrayElement):* ",":*

arrayElement -> "...":? singleExpression

propertyAssignment -> propertyName ":" singleExpression
    | "[" singleExpression "]" ":" singleExpression
    | "async":? "*" :? propertyName "(" formalParameterList:? ")" functionBody
    | getter "(" ")" functionBody
    | setter "(" formalParameterArg ")" functionBody
    | "...":? singleExpression

propertyName -> identifier | %string | numericLiteral | "[" singleExpression "]"

arguments -> "(" (argument ("," argument):* ",":?):? ")"

argument -> "...":? (singleExpression | identifier)

expressionSequence -> singleExpression ("," singleExpression):*

singleExpression -> assignmentExpression

assignmentExpression -> conditionalExpression
    | leftHandSideExpression assignmentOperator assignmentExpression
    | leftHandSideExpression "=" assignmentExpression

conditionalExpression -> logicalOrExpression
    | logicalOrExpression "?" assignmentExpression ":" assignmentExpression

logicalOrExpression -> logicalAndExpression
    | logicalOrExpression "||" logicalAndExpression

logicalAndExpression -> bitwiseOrExpression
    | logicalAndExpression "&&" bitwiseOrExpression

bitwiseOrExpression -> bitwiseXorExpression
    | bitwiseOrExpression "|" bitwiseXorExpression

bitwiseXorExpression -> bitwiseAndExpression
    | bitwiseXorExpression "^" bitwiseAndExpression

bitwiseAndExpression -> equalityExpression
    | bitwiseAndExpression "&" equalityExpression

equalityExpression -> relationalExpression
    | equalityExpression ("==" | "!=" | "===" | "!==") relationalExpression

relationalExpression -> shiftExpression
    | relationalExpression ("<" | ">" | "<=" | ">=" | "instanceof" | "in") shiftExpression

shiftExpression -> additiveExpression
    | shiftExpression ("<<" | ">>" | ">>>") additiveExpression

additiveExpression -> multiplicativeExpression
    | additiveExpression ("+" | "-") multiplicativeExpression

multiplicativeExpression -> exponentiationExpression
    | multiplicativeExpression ("*" | "/" | "%") exponentiationExpression

exponentiationExpression -> unaryExpression
    | unaryExpression "**" exponentiationExpression

unaryExpression -> ("delete" | "void" | "typeof" | "++" | "--" | "+" | "-" | "~" | "!" | "await") unaryExpression
    | postfixExpression

postfixExpression -> leftHandSideExpression
    | leftHandSideExpression "++"
    | leftHandSideExpression "--"

leftHandSideExpression -> callExpression
    | newExpression
    | primaryExpression

callExpression -> memberExpression arguments
    | callExpression arguments

memberExpression -> primaryExpression
    | memberExpression "[" expressionSequence "]"
    | memberExpression "." identifier

newExpression -> "new" memberExpression arguments
    | "new" memberExpression

primaryExpression -> anonymousFunction
    | "class" identifier:? classTail
    | "this"
    | identifier
    | "super"
    | literal
    | arrayLiteral
    | objectLiteral
    | "(" expressionSequence ")"
    | yieldStatement

initializer -> "=" singleExpression

assignable -> identifier | keyword | arrayLiteral | objectLiteral

objectLiteral -> "{" (propertyAssignment ("," propertyAssignment):* ",":?):? "}"

anonymousFunction -> functionDeclaration
    | "async":? "function" "*" :? "(" formalParameterList:? ")" functionBody
    | "async":? arrowFunctionParameters "=>" arrowFunctionBody

arrowFunctionParameters -> propertyName | "(" formalParameterList:? ")"

arrowFunctionBody -> singleExpression | functionBody

assignmentOperator -> "*=" | "/=" | "%=" | "+=" | "-=" | "<<=" | ">>=" | ">>>=" | "&=" | "^=" | "|=" | "**=" | "??="

literal -> "null" | "true" | "false" | %string | template %string | %regexp | numericLiteral

templateStringLiteral -> "`" templateStringAtom:* "`"

templateStringAtom -> TemplateStringAtom | TemplateStringStartExpression singleExpression TemplateCloseBrace

numericLiteral -> %number

getter -> "get":? identifier classElementName

setter -> "set":? identifier classElementName

identifier -> %identifier

reservedWord -> keyword | "null" | "true" | "false"

keyword -> %keyword

eos -> ";"
##statement -> 
##    "const" WS identifier WS %assign WS expression %semicolon:? NL:* {% (d) => {return parseStatement(filter(d))} %}
##    | "let" WS identifier WS %assign WS expression %semicolon:? NL:* {% (d) => {return parseStatement(filter(d))} %}
##    | "var" WS identifier WS %assign WS expression %semicolon:? NL:* {% (d) => {return parseStatement(filter(d))} %}
##    | identifier WS %assign WS expression %semicolon:? NL:* {% (d) => {return parseStatement(filter(d))} %}
##
##expression ->
##    term {% (d) => {return parseExpression(filter(d))} %}
##    | term WS "+" WS term {% (d) => {return parseExpression(filter(d))} %}
##    | term WS "-" WS term {% (d) => {return parseExpression(filter(d))} %}
##    | term WS ">=" WS term {% (d) => {return parseExpression(filter(d))} %}
##
##term -> 
##    primary {% (d) => {return parseTerm(filter(d))}%}
##    | primary WS "*" WS primary {% (d) => {return parseTerm(filter(d))}%}
##    | primary WS "/" WS primary {% (d) => {return parseTerm(filter(d))}%}
##
##
##primary -> 
##    identifier {% (d) => {return parsePrimary(filter(d))}%}
##    | %number {% (d) => {return parsePrimary(filter(d))}%}
##    | %string {% (d) => {return parsePrimary(filter(d))}%}
##    | %lparen expression %rparen {% (d) => {return parsePrimary(filter(d))}%}
##
##identifier -> %identifier {%(d) => {return parseIdentifier(filter(d))}%}
##WS -> " ":+ {% (d) => {return null} %} ## Ignore whitespaces

