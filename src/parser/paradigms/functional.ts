import { BodyExpression, Expression, SymbolPrimitive } from "../globals";
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
  parameter:  Expression | BodyExpression;
}

export interface TypeAlias {
  type: "TypeAlias";
  name: SymbolPrimitive;
  value: TypeNode; // Optional type parameters
}


export type TypeVar = { type: "TypeVar"; name: string }
export type TypeConstructor = { type: "TypeConstructor"; name: string }
export type FunctionType = { type: "FunctionType"; from: TypeNode[]; to: TypeNode }
export type TypeApplication = { type: "TypeApplication"; base: TypeNode; args: TypeNode[] }
export type ListType = { type: "ListType"; element: TypeNode }
export type TupleType = { type: "TupleType"; elements: TypeNode[] }
export type DataType = { type: "DataType"; name: string; constructor: string, fields: TypeNode[] }

// Recursive type structure for new type system
export type TypeNode =
  | TypeVar
  | TypeConstructor
  | FunctionType
  | TypeApplication
  | ListType
  | TupleType
  | DataType;

export interface FunctionTypeSignature {
  type: "TypeSignature";
  name: SymbolPrimitive;
  inputTypes: TypeNode[];
  returnType: TypeNode;
}
