import { BaseOperation, Primitive, SymbolPrimitive } from "../globals";
import { BlockExpression } from "./objects";

export interface FunctionDeclaration {
  type: "function";
  name: SymbolPrimitive;
  parameters: SymbolPrimitive[];
  body: Expression | BlockExpression;
  //loc: SourceLocation;
}
export interface FunctionExpression {
  type: "function_expression";
  name: SymbolPrimitive;
  parameters: SymbolPrimitive[];
  //loc: SourceLocation;
}

export interface CompositionExpression {
  type: "composition_expression";
  left: SymbolPrimitive;
  right: SymbolPrimitive;
  //loc: SourceLocation;
}

export type Expression = Primitive | BaseOperation;

export type ListPrimitive = {
  type: "list";
  elements: Expression[];
  //loc: SourceLocation;
};

export interface LambdaExpression {
  type: "lambda_expression";
  parameters: SymbolPrimitive[];
  body: Expression | BlockExpression;
  //loc: SourceLocation;
}