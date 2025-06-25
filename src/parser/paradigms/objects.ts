import {
  BooleanPrimitive,
  Expression,
  SourceLocation,
  StringPrimitive,
  SymbolPrimitive,
} from "../globals";

// Core OOP Interfaces
export interface ClassDefinition {
  type: "class";
  name: string;
  superClass?: ClassReference;
  fields: FieldDefinition[];
  methods: MethodDefinition[];
  staticFields: FieldDefinition[];
  staticMethods: MethodDefinition[];
  accessModifier: "public" | "private" | "protected" | "internal";
  loc: SourceLocation;
}

export interface ObjectInstance {
  type: "object";
  classRef: ClassReference;
  fields: { [key: string]: ObjectsExpression };
  loc: SourceLocation;
}

export interface FieldDefinition {
  type: "field";
  name: StringPrimitive;
  //valueType: TypeAnnotation;
  defaultValue?: ObjectsExpression;
  accessModifier: "public" | "private" | "protected";
  isStatic: BooleanPrimitive;
  loc: SourceLocation;
}

export interface MethodDefinition {
  type: "method";
  name: string;
  parameters: Parameter[];
  //returnType: TypeAnnotation;
  body: BlockExpression;
  accessModifier: "public" | "private" | "protected";
  isStatic: BooleanPrimitive;
  isAbstract: BooleanPrimitive;
  isFinal: BooleanPrimitive;
  loc: SourceLocation;
}

// Supporting Types
export interface ClassReference {
  type: "classRef";
  name: string;
  //generics?: TypeAnnotation[];
  loc: SourceLocation;
}

export interface Parameter {
  type: "parameter";
  name: StringPrimitive;
  //valueType: TypeAnnotation;
  defaultValue?: ObjectsExpression;
  loc: SourceLocation;
}

/* export interface TypeAnnotation {
  type: "typeAnnotation";
  name: string;
  generics?: TypeAnnotation[];
  isNullable: BooleanPrimitive;
  loc: SourceLocation;
} */

export interface BlockExpression {
  type: "block";
  statements: Statement[];
  loc: SourceLocation;
}

// OOP-specific Expressions
export interface NewExpression {
  type: "new";
  classRef: ClassReference;
  arguments: ObjectsExpression[];
  loc: SourceLocation;
}

export interface MethodCall {
  type: "methodCall";
  object: ObjectsExpression;
  methodName: StringPrimitive;
  arguments: ObjectsExpression[];
  loc: SourceLocation;
}

export interface PropertyAccess {
  type: "propertyAccess";
  object: ObjectsExpression;
  propertyName: StringPrimitive;
  loc: SourceLocation;
}

export interface ThisExpression {
  type: "this";
  loc: SourceLocation;
}

export interface SuperExpression {
  type: "super";
  loc: SourceLocation;
}

export interface InstanceOfExpression {
  type: "instanceOf";
  object: ObjectsExpression;
  classRef: ClassReference;
  loc: SourceLocation;
}

export interface VariableDeclaration {
  type: "variableDeclaration";
  name: SymbolPrimitive;
  //valueType: TypeAnnotation;
  value: ObjectsExpression;
  isMutable: boolean;
  accessModifier?: "public" | "private" | "protected" | "package";
  //loc: SourceLocation;
}

export interface ReturnStatement {
  type: "return";
  value?: ObjectsExpression;
  loc: SourceLocation;
}

export interface BaseControlFlow {
  type: string;
  loc: SourceLocation;
}

// Conditional statements
export interface IfStatement extends BaseControlFlow {
  type: "if";
  condition: ObjectsExpression;
  thenBlock: BlockExpression;
  elseBlock?: BlockExpression | IfStatement; // For else-if chains
}

export interface SwitchStatement extends BaseControlFlow {
  type: "switch";
  expression: ObjectsExpression;
  cases: SwitchCase[];
  defaultCase?: BlockExpression;
}

export interface SwitchCase {
  type: "case";
  value: ObjectsExpression;
  block: BlockExpression;
  loc: SourceLocation;
}

// Looping statements
export interface WhileStatement extends BaseControlFlow {
  type: "while";
  condition: ObjectsExpression;
  body: BlockExpression;
}

export interface DoWhileStatement extends BaseControlFlow {
  type: "doWhile";
  condition: ObjectsExpression;
  body: BlockExpression;
}

export interface ForStatement extends BaseControlFlow {
  type: "for";
  init?: VariableDeclaration | ObjectsExpression;
  condition?: ObjectsExpression;
  update?: ObjectsExpression;
  body: BlockExpression;
}

export interface ForInStatement extends BaseControlFlow {
  type: "forIn";
  variable: VariableDeclaration | StringPrimitive;
  iterable: ObjectsExpression;
  body: BlockExpression;
}

export interface ForOfStatement extends BaseControlFlow {
  type: "forOf";
  variable: VariableDeclaration | StringPrimitive;
  iterable: ObjectsExpression;
  body: BlockExpression;
}

// Jump statements
export interface BreakStatement extends BaseControlFlow {
  type: "break";
  label?: StringPrimitive;
}

export interface ContinueStatement extends BaseControlFlow {
  type: "continue";
  label?: StringPrimitive;
}

export interface ThrowStatement extends BaseControlFlow {
  type: "throw";
  expression: ObjectsExpression;
}

export interface TryCatchStatement extends BaseControlFlow {
  type: "tryCatch";
  tryBlock: BlockExpression;
  catchParameter?: Parameter;
  catchBlock: BlockExpression;
  finallyBlock?: BlockExpression;
}

// Union Types

export type ControlFlowStatement =
  | IfStatement
  | SwitchStatement
  | WhileStatement
  | DoWhileStatement
  | ForStatement
  | ForInStatement
  | ForOfStatement
  | BreakStatement
  | ContinueStatement
  | ThrowStatement
  | TryCatchStatement;

export type ObjectsExpression =
  | Expression
  | NewExpression
  | MethodCall
  | PropertyAccess
  | ThisExpression
  | SuperExpression
  | InstanceOfExpression;

export type Statement =
  | ObjectsExpression
  | ClassDefinition
  | VariableDeclaration
  | ReturnStatement
  | ControlFlowStatement;
