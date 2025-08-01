import {
  ApplicationExpression,
  CompositionExpression,
  FunctionDeclaration,
  FunctionGroup,
  FunctionTypeSignature,
  InfixApplicationExpression,
  LambdaExpression,
  TypeAlias,
  TypeNode,
} from "./paradigms/functional";

export type Modify<T, R> = Omit<T, keyof R> & R;

// Universal primitive value types
export type YukigoPrimitive =
  | "YuNumber"
  | "YuString"
  | "YuChar"
  | "YuBoolean"
  | "YuList"
  | "YuNull"
  | "YuUndefined"
  | "YuSymbol";
export type PrimitiveValue =
  | number
  | boolean
  | string
  | bigint
  | symbol
  | null
  | undefined;

/**
 * Base interface for all primitive values
 * - Includes location information for source mapping
 * - Language-agnostic representation
 */
export interface BasePrimitive {
  type: YukigoPrimitive;
  value: PrimitiveValue | PrimitiveValue[];
  //loc: SourceLocation;
}

/**
 * Numeric values (integers, floats, etc.)
 * - Represents all numeric types across languages
 */
export interface NumberPrimitive extends BasePrimitive {
  type: "YuNumber";
  numericType: string;
  value: number;
}

/**
 * Boolean values (true/false)
 * - Universal truth values
 */
export interface BooleanPrimitive extends BasePrimitive {
  type: "YuBoolean";
  value: string;
}

/**
 * String values
 * - Represents textual data
 * - Includes encoding information when relevant
 */
export interface CharPrimitive extends BasePrimitive {
  type: "YuChar";
  value: string;
}
export interface StringPrimitive extends BasePrimitive {
  type: "YuString";
  value: string;
}

/**
 * Null value
 * - Explicit absence of value
 */
export interface NullPrimitive extends BasePrimitive {
  type: "YuNull";
  value: null;
}

/**
 * Undefined value
 * - Represents uninitialized state
 */
export interface UndefinedPrimitive extends BasePrimitive {
  type: "YuUndefined";
  value: undefined;
}

/**
 * Symbol primitive
 * - Unique identifier primitive
 */
export interface SymbolPrimitive extends BasePrimitive {
  type: "YuSymbol";
  value: string;
  description?: string;
}
/**
 * Symbol primitive
 * - Unique identifier primitive
 */
export interface ListPrimitive {
  type: "YuList";
  elements: Expression[];
  //loc: SourceLocation;
}

// Union export type for all primitives
export type Primitive =
  | NumberPrimitive
  | BooleanPrimitive
  | CharPrimitive
  | StringPrimitive
  | NullPrimitive
  | UndefinedPrimitive
  | SymbolPrimitive
  | ListPrimitive;

// Source location information
export interface SourceLocation {
  start: Position;
  end: Position;
  filePath: string;
  language: string;
}

export interface Position {
  line: number;
  column: number;
  offset: number;
}

// OPERATORS

/**
 * Base interface for all operations
 */
export interface BaseOperation {
  type: string;
  operator: string;
  right: Expression;
  left: Expression;
  //loc: SourceLocation;
}

/**
 * Arithmetic operations
 * - Common across all languages
 */
export interface ArithmeticOperation extends BaseOperation {
  type: "Arithmetic";
  operator: "+" | "-" | "*" | "/" | "%" | "**";
}

/**
 * Comparison operations
 * - Universal comparison semantics
 */
export interface ComparisonOperation extends BaseOperation {
  type: "Comparison";
  operator: "==" | "!=" | "===" | "!==" | "<" | ">" | "<=" | ">=";
}

/**
 * Logical operations
 * - Boolean logic fundamentals
 */
export interface LogicalOperation extends BaseOperation {
  type: "logical";
  operator: "&&" | "||" | "??"; // AND, OR, nullish coalescing
}

/**
 * Bitwise operations
 * - Low-level bit manipulation
 */
export interface BitwiseOperation extends BaseOperation {
  type: "bitwise";
  operator: "&" | "|" | "^" | "~" | "<<" | ">>" | ">>>";
}
/**
 * Transform operations
 * - Higher-order functions map-like
 * - Used for transforming collections
 */
export interface TransformOperation {
  type: "Transform";
  operator: "map";
  function: Expression;
  list: Expression;
  //loc: SourceLocation;
}
export interface SelectOperation {
  type: "Select";
  operator: "filter";
  function: Expression;
  list: Expression;
  //loc: SourceLocation;
}

export interface ConcatOperation {
  type: "Concat";
  operator: string;
  left: Expression;
  right: Expression;
}

export type StringOperation = ConcatOperation;

export type Operation =
  | ArithmeticOperation
  | ComparisonOperation
  | LogicalOperation
  | BitwiseOperation
  | StringOperation;

/* 
### COLLECTIONS
*/

/**
 * Base collection interface
 */
export interface BaseCollection {
  type: string;
  elements: Expression[];
  //loc: SourceLocation;
}

/**
 * Array-like collection
 * - Ordered sequence of values
 */
export interface ArrayCollection extends BaseCollection {
  type: "array";
}

/**
 * Set collection
 * - Unique value collection
 */
export interface SetCollection extends BaseCollection {
  type: "set";
}

/**
 * Key-value mapping
 * - Represents objects, maps, dictionaries
 */
export interface MapCollection {
  type: "map";
  entries: MapEntry[];
  loc: SourceLocation;
}

export interface TupleExpression {
  type: "TupleExpression";
  elements: Expression[];
}

export interface FieldExpression {
  type: "FieldExpression";
  name: SymbolPrimitive;
  expression: Expression;
}

export interface DataExpression {
  type: "DataExpression";
  name: SymbolPrimitive;
  contents: FieldExpression[];
}

export interface MapEntry {
  key: Expression;
  value: Expression;
}

export interface ControlFlowConditional {
  type: "IfThenElse";
  condition: Expression;
  then: Expression;
  else: Expression;
}

export type BodyExpression =
  | Primitive
  | Operation
  | TupleExpression
  | ControlFlowConditional
  // Functional expressions
  | DataExpression
  | CompositionExpression
  | LambdaExpression
  | ApplicationExpression
  | InfixApplicationExpression;

export type Expression = {
  type: "Expression";
  body: BodyExpression;
};

export interface Field {
  type: "Field";
  name: SymbolPrimitive;
  value: TypeNode;
}


export interface Record {
  type: "Record";
  name: SymbolPrimitive;
  constructor: SymbolPrimitive;
  contents: Field[];
}

export type Type =
  | { kind: "primitive"; name: string }
  | { kind: "function"; parameters: Type[]; return: Type }
  | { kind: "list"; elementType: Type }
  | { kind: "tuple"; elements: Type[] }
  | { kind: "variable"; id: number }; // For generics/inference

export type Environment = Map<string, Type>;

export type AST = (TypeAlias | FunctionTypeSignature | FunctionDeclaration)[];
export type ASTGrouped = (TypeAlias | FunctionTypeSignature | FunctionGroup)[];
