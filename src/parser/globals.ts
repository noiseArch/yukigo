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
  value: number | bigint;
}

/**
 * Boolean values (true/false)
 * - Universal truth values
 */
export interface BooleanPrimitive extends BasePrimitive {
  type: "YuBoolean";
  value: boolean;
}

/**
 * String values
 * - Represents textual data
 * - Includes encoding information when relevant
 */
export interface StringPrimitive extends BasePrimitive {
  type: "YuString";
  value: string;
  encoding?: "utf8" | "utf16" | "ascii"; // Default: utf8
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
};

// Union export type for all primitives
export type Primitive =
  | NumberPrimitive
  | BooleanPrimitive
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

/* 
##### OPERATIONS
*/

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
  type: "arithmetic";
  operator: "+" | "-" | "*" | "/" | "%" | "**";
}

/**
 * Comparison operations
 * - Universal comparison semantics
 */
export interface ComparisonOperation extends BaseOperation {
  type: "comparison";
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

export type Operation =
  | ArithmeticOperation
  | ComparisonOperation
  | LogicalOperation
  | BitwiseOperation;

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

export interface MapEntry {
  key: Expression;
  value: Expression;
}


export type Expression = Primitive | Operation 