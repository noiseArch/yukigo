import { BodyExpression, Expression, SymbolPrimitive } from "../globals";

interface BaseFunctionDeclaration {
  type: "function";
  name: SymbolPrimitive;
  parameters: Pattern[];
  attributes: string[];
  //loc: SourceLocation; // Uncomment if you need this
}

interface Guard {
  condition: Expression;
  body: Expression;
  return: Expression;
}

export interface GuardedFunctionDeclaration extends BaseFunctionDeclaration {
  body: Guard[];
  return: Guard[];
}

export interface UnguardedFunctionDeclaration extends BaseFunctionDeclaration {
  body: Expression;
  return: Expression;
}

export type FunctionDeclaration =
  | GuardedFunctionDeclaration
  | UnguardedFunctionDeclaration;

export interface VariablePattern {
  type: "VariablePattern" | "LiteralPattern" | "WildcardPattern";
  name: string;
}
export interface TuplePattern {
  type: "TuplePattern";
  elements: Pattern[];
}

export type Pattern = VariablePattern | TuplePattern;

export interface FunctionGroup {
  type: "function";
  name: SymbolPrimitive;
  contents: Omit<FunctionDeclaration, "name" | "type">[];
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
  body: Expression;
  //loc: SourceLocation;
}

export interface InfixApplicationExpression {
  type: "InfixApplication";
  operator: SymbolPrimitive;
  left: Expression;
  right: Expression;
}
export interface ApplicationExpression {
  type: "Application";
  function: Expression;
  parameter: Expression | BodyExpression;
}

export interface TypeAlias {
  type: "TypeAlias";
  name: SymbolPrimitive;
  value: TypeNode; // Optional type parameters
}

export type TypeVar = { type: "TypeVar"; name: string };
export type TypeConstructor = { type: "TypeConstructor"; name: string };



export type Constraint = {
  type: "Constraint";
  className: string;
  params: TypeNode[];
};
export type ConstrainedType = {
  type: "ConstrainedType";
  context: Constraint[];
  body: TypeNode;
};


export type FunctionType = {
  type: "FunctionType";
  from: TypeNode[];
  to: TypeNode;
};
export type TypeApplication = {
  type: "TypeApplication";
  base: TypeNode;
  args: TypeNode[];
};
export type ListType = { type: "ListType"; element: TypeNode };
export type TupleType = { type: "TupleType"; elements: TypeNode[] };
export type DataType = {
  type: "DataType";
  name: string;
  constructor: string;
  fields: TypeNode[];
};
export type IfTheElseType = {
  type: "IfTheElseType";
  condition: TypeNode;
  then: TypeNode;
  else: TypeNode;
};

// Recursive type structure for new type system
export type TypeNode =
  | TypeVar
  | TypeConstructor
  | Constraint
  | ConstrainedType
  | FunctionType
  | TypeApplication
  | ListType
  | TupleType
  | DataType
  | IfTheElseType;

export interface FunctionTypeSignature {
  type: "TypeSignature";
  name: SymbolPrimitive;
  constraints: Constraint[],
  inputTypes: TypeNode[];
  returnType: TypeNode;
}
