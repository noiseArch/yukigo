import { SymbolPrimitive } from "../../globals";
import {
  FunctionDeclaration,
  Expression,
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

export type HSFunctionDeclaration = FunctionDeclaration;
export type HSFunctionExpression = FunctionExpression;
export type HSExpression = Expression | ApplicationExpression;

export interface ApplicationExpression {
  type: "application_expression";
  left: SymbolPrimitive;
  operator: "$";
  right: SymbolPrimitive;
}

export type HSListPrimitive = ListPrimitive;

export interface HSLamdaExpression extends LambdaExpression {
  body: HSExpression;
}
