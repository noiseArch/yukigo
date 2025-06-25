import {
  Expression,
  Modify,
  SymbolPrimitive,
  YukigoPrimitive,
} from "../../globals";
import {
  FunctionDeclaration,
  FunctionExpression,
  ListPrimitive,
  LambdaExpression,
} from "../../paradigms/functional";

export const keywords = [
  "type",
  "where",
  "in",
  "if",
  "else",
  "then",
  "data",
  "case",
  "class",
  "do",
  "default",
  "deriving",
  "import",
  "infix",
  "infixl",
  "infixr",
  "instance",
  "let",
  "module",
  "newtype",
  "of",
  "qualified",
  "as",
  "hiding",
  "foreign",
];

export type HSFunctionDeclaration = Modify<
  FunctionDeclaration,
  { body: HSExpression }
>;
export type HSFunctionExpression = FunctionExpression;
export type HSExpression = Expression | ApplicationExpression;

export const typeMappings: { [key: string]: YukigoPrimitive } = {
  Float: "YuNumber",
  Double: "YuNumber",
  Int: "YuNumber",
  String: "YuString",
  Char: "YuChar",
  Boolean: "YuBoolean",
};

export interface ApplicationExpression {
  type: "application_expression";
  left: SymbolPrimitive;
  operator: "$";
  right: SymbolPrimitive;
}

export type HSListPrimitive = ListPrimitive;

export interface HSPattern {
  type: "VariablePattern" | "LiteralPattern" | "WildcardPattern";
  name: string;
}

export type HSLamdaExpression = Modify<
  LambdaExpression,
  {
    body: HSExpression;
  }
>;
