import { SymbolPrimitive } from "../../../globals";
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
  // All the following ones are from JS keywords, this should be updated to Haskell keywords
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "double",

  "enum",
  "eval",
  "export",
  "extends",
  "false",
  "final",
  "finally",
  "float",
  "for",
  "function",
  "goto",
  "implements",
  "import",
  "instanceof",
  "int",
  "interface",
  "let",
  "long",
  "native",
  "new",
  "null",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "short",
  "static",
  "super",
  "switch",
  "synchronized",
  "this",
  "throw",
  "throws",
  "transient",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "volatile",
  "while",
  "with",
  "yield",
];

// For example
// interface HSNumberPrimitive extends NumberPrimitive {
//   numericType: "number" | "bigint";
// }

export type HSFunctionDeclaration = FunctionDeclaration;
export type HSFunctionExpression = FunctionExpression;
export type HSExpression = Expression | ApplicationExpression;

export interface ApplicationExpression {
  type: "application_expression";
  left: SymbolPrimitive;
  operator: "$";
  right: SymbolPrimitive;
}

export interface HSTypeAlias {
  type: "type_alias";
  name: SymbolPrimitive;
  typeParameters: SymbolPrimitive[]; // Optional type parameters
}

export interface HSFunctionTypeDeclaration {
  type: "function_type_declaration";
  name: SymbolPrimitive;
  inputTypes: SymbolPrimitive[];
  returnType: SymbolPrimitive;
}

export type HSListPrimitive = ListPrimitive;

export interface HSLamdaExpression extends LambdaExpression {
  body: HSExpression;
}
