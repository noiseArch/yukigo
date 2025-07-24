import { Expression, Primitive, SymbolPrimitive } from "../globals";
import { BlockExpression } from "./objects";

export interface FunctionDeclaration {
  type: "function";
  name: SymbolPrimitive;
  parameters: Pattern[];
  body: Expression | BlockExpression;
  return: Expression;
  attributes: string[];
  //loc: SourceLocation;
}

export interface VariablePattern {
  type: "VariablePattern" | "LiteralPattern" | "WildcardPattern";
  name: string;
}
export interface TuplePattern {
  type: "TuplePattern"
  elements: Pattern[]
}

export type Pattern = VariablePattern | TuplePattern

export interface Func {
  parameters: Pattern[];
  body: Expression | BlockExpression;
  attributes: string[];
  return: Expression;
}
export interface FunctionGroup {
  type: "function";
  name: SymbolPrimitive;
  contents: Func[];
}

export interface FunctionExpression {
  type: "function_expression";
  name: SymbolPrimitive;
  parameters: SymbolPrimitive[];
  //loc: SourceLocation;
}

export interface CompositionExpression {
  type: "CompositionExpression";
  left: SymbolPrimitive;
  right: SymbolPrimitive;
  //loc: SourceLocation;
}

export type ListPrimitive = {
  type: "list";
  elements: Expression[];
  //loc: SourceLocation;
};

export interface LambdaExpression {
  type: "LambdaExpression";
  parameters: Pattern[];
  body: Expression | BlockExpression;
  //loc: SourceLocation;
}

export interface ApplicationExpression {
  type: "Application";
  function: Expression;
  parameter: Primitive;
}

export interface TypeAlias {
  type: "TypeAlias";
  name: SymbolPrimitive;
  value: TypeNode[]; // Optional type parameters
}

// Recursive type structure for new type system
export type TypeNode =
  | { type: "TypeVar"; name: string }
  | { type: "TypeConstructor"; name: string }
  | { type: "FunctionType"; from: TypeNode[]; to: TypeNode }
  | { type: "TypeApplication"; base: TypeNode; args: TypeNode[] }
  | { type: "ListType"; element: TypeNode }
  | { type: "TupleType"; elements: TypeNode[] };

export interface FunctionTypeSignature {
  type: "TypeSignature";
  name: SymbolPrimitive;
  inputTypes: TypeNode[];
  returnType: TypeNode;
}
