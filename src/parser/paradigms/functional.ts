import { Expression, SymbolPrimitive } from "../globals";
import { BlockExpression } from "./objects";

export interface FunctionDeclaration {
  type: "function";
  name: SymbolPrimitive;
  parameters: SymbolPrimitive[];
  body: Expression | BlockExpression;
  attributes: string[];
  //loc: SourceLocation;
}

export interface FunctionGroup {
  type: "function";
  name: SymbolPrimitive;
  contents: {
    parameters: SymbolPrimitive[];
    body: Expression | BlockExpression;
    attributes: string[];
  }[];
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
  parameters: SymbolPrimitive[];
  body: Expression | BlockExpression;
  //loc: SourceLocation;
}

export interface TypeAlias {
  type: "TypeAlias";
  name: SymbolPrimitive;
  typeParameters: SymbolPrimitive[]; // Optional type parameters
}


export interface FunctionTypeSignature {
  type: "TypeSignature";
  name: SymbolPrimitive;
  inputTypes: SymbolPrimitive[];
  returnType: SymbolPrimitive;
}