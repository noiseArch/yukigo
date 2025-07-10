import {
  Expression,
  Modify,
  SymbolPrimitive,
  Type,
  YukigoPrimitive,
} from "../../globals";
import {
  FunctionDeclaration,
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

export type HSFunctionDeclaration = Modify<
  FunctionDeclaration,
  { body: HSExpression; return: HSExpression }
>;
export type HSFunctionExpression = FunctionExpression;
export type HSExpression = Expression | ApplicationExpression;

export const typeMappings: { [key: string]: YukigoPrimitive } = {
  Float: "YuNumber",
  Double: "YuNumber",
  Int: "YuNumber",
  Integer: "YuNumber",
  String: "YuString",
  Char: "YuChar",
  Boolean: "YuBoolean",
};

export const haskellStdLib: Map<string, Type> = new Map([
  [
    "map",
    {
      kind: "function",
      parameters: [
        {
          kind: "function",
          parameters: [{ kind: "variable", id: 0 }],
          return: { kind: "variable", id: 1 },
        },
        {
          kind: "list",
          elementType: { kind: "variable", id: 0 },
        },
      ],
      return: {
        kind: "list",
        elementType: { kind: "variable", id: 1 },
      },
    },
  ],

  [
    "filter",
    {
      kind: "function",
      parameters: [
        {
          kind: "function",
          parameters: [{ kind: "variable", id: 0 }],
          return: { kind: "primitive", name: "Bool" },
        },
        {
          kind: "list",
          elementType: { kind: "variable", id: 0 },
        },
      ],
      return: {
        kind: "list",
        elementType: { kind: "variable", id: 0 },
      },
    },
  ],

  [
    "even",
    {
      kind: "function",
      parameters: [{ kind: "primitive", name: "Int" }],
      return: { kind: "primitive", name: "Bool" },
    },
  ],
]);

export interface ApplicationExpression {
  type: "Application";
  function: SymbolPrimitive;
  parameters: Expression[];
}

export type HSListPrimitive = ListPrimitive;

export interface HSPattern {
  type: "VariablePattern" | "LiteralPattern" | "WildcardPattern";
  name: string;
}

export type HSLamdaExpression = Modify<
  LambdaExpression,
  {
    body: HSExpression;
  }
>;
