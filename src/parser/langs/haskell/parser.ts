import { inspect } from "util";
import {
  BodyExpression,
  BooleanPrimitive,
  CharPrimitive,
  ControlFlowConditional,
  DataExpression,
  Expression,
  Field,
  FieldExpression,
  ListPrimitive,
  NumberPrimitive,
  Primitive,
  Record,
  StringPrimitive,
  SymbolPrimitive,
} from "../../globals";
import {
  CompositionExpression,
  ApplicationExpression,
  FunctionTypeSignature,
  TypeAlias,
  Pattern,
  TypeNode,
  LambdaExpression,
  FunctionDeclaration,
  InfixApplicationExpression,
  Constraint,
} from "../../paradigms/functional";

interface BaseMooToken {
  type: string;
  value: string;
  text: string;
  toString: () => string;
  offset: number;
  lineBreaks: number;
  line: number;
  col: number;
}

interface ListToken {
  type: "list";
  body: [
    {
      type: "lsquare";
      value: "[";
      text: "[";
      toString: () => string;
      offset: 1143;
      lineBreaks: 0;
      line: 55;
      col: 13;
    },
    Expression[],
    {
      type: "rsquare";
      value: "]";
      text: "]";
      toString: [() => string];
      offset: 1157;
      lineBreaks: 0;
      line: 55;
      col: 27;
    }
  ];
}

type Token = BaseMooToken | ListToken;

function parseFunction(token: {
  type: "function";
  name: SymbolPrimitive;
  params: Pattern[];
  body: Expression;
  return: Expression;
  attributes: string[];
}): FunctionDeclaration {
  //console.log("Function", inspect(token, false, null, true));
  return {
    type: "function",
    name: token.name,
    parameters: token.params,
    body: token.body,
    return: token.return,
    attributes: token.attributes,
  };
}

function parseFunctionType(
  token: [SymbolPrimitive, TypeNode]
): FunctionTypeSignature {
  let constraints: Constraint[] = [];
  let body: TypeNode = token[1];
  if (token[1].type === "ConstrainedType") {
    constraints = token[1].context;
    body = token[1].body;
  }
  if (body.type === "FunctionType") {
    return {
      type: "TypeSignature",
      name: token[0],
      constraints,
      inputTypes: body.from,
      returnType: body.to,
    };
  }
  return {
    type: "TypeSignature",
    name: token[0],
    constraints,
    inputTypes: [],
    returnType: body,
  };
}

function parseTypeAlias(token: [SymbolPrimitive, TypeNode]): TypeAlias {
  //console.log("Type Alias TypeNode", inspect(token, false, null, true));
  return {
    type: "TypeAlias",
    name: token[0],
    value: token[1],
  };
}

function parseExpression(token: BodyExpression): Expression {
  //console.log("Expression", inspect(token, false, null, true));
  return { type: "Expression", body: token };
}

function parseLambda(token: [Pattern[], Expression]): LambdaExpression {
  //console.log("Lambda", util.inspect(token, false, null, true));
  const lambda: LambdaExpression = {
    type: "LambdaExpression",
    parameters: token[0],
    body: token[1],
  };
  return lambda;
}

function parseCompositionExpression(
  token: [SymbolPrimitive, SymbolPrimitive]
): CompositionExpression {
  //console.log("Composition Expr", util.inspect(token, false, null, true));
  const compositionExpression: CompositionExpression = {
    type: "CompositionExpression",
    left: token[0],
    right: token[1],
  };
  return compositionExpression;
}

function parseApplication(
  token: [BodyExpression, Expression | BodyExpression]
): ApplicationExpression {
  //console.log("Application", util.inspect(token, false, null, true));
  return {
    type: "Application",
    function: { type: "Expression", body: token[0] },
    parameter: token[1],
  };
}

function parseInfixApplication(
  token: [SymbolPrimitive, BodyExpression, BodyExpression]
): InfixApplicationExpression {
  return {
    type: "InfixApplication",
    operator: token[0],
    left: { type: "Expression", body: token[1] },
    right: { type: "Expression", body: token[2] },
  };
}

function parseDataExpression(
  token: [SymbolPrimitive, FieldExpression[]]
): DataExpression {
  return { type: "DataExpression", name: token[0], contents: token[1] };
}

function parseDataDeclaration(
  token: [SymbolPrimitive, Field[]]
): Record {
  return {
    type: "Record",
    name: token[0],
    contents: token[1],
  };
}
function parseConditional(
  token: [Expression, Expression, Expression]
): ControlFlowConditional {
  return {
    type: "IfThenElse",
    condition: token[0],
    then: token[1],
    else: token[2],
  };
}

function parsePrimary(token: Token): Primitive {
  //console.log("Primary", token);
  switch (token.type) {
    case "constructor":
    case "variable": {
      const identifierPrimitive: SymbolPrimitive = {
        type: "YuSymbol",
        value: token.value,
      };
      return identifierPrimitive;
    }
    case "number": {
      const numberPrimitive: NumberPrimitive = {
        type: "YuNumber",
        numericType: "number", // Assuming all numbers are of type "number"
        value: Number(token.value),
      };
      return numberPrimitive;
    }
    case "char": {
      const stringPrimitive: CharPrimitive = {
        type: "YuChar",
        value: token.value,
      };
      return stringPrimitive;
    }
    case "string": {
      const stringPrimitive: StringPrimitive = {
        type: "YuString",
        value: token.value,
      };
      return stringPrimitive;
    }
    case "list": {
      const listPrimitive: ListPrimitive = {
        type: "YuList",
        elements: (token as ListToken).body[1],
      };
      return listPrimitive;
    }
    case "bool": {
      const booleanPrimitive: BooleanPrimitive = {
        type: "YuBoolean",
        value: token.value,
      };
      return booleanPrimitive;
    }
    default:
      throw new Error(
        `Error parsing Primary. Unknown token type: ${token.type}`
      );
  }
}

export {
  parseFunction,
  parsePrimary,
  parseExpression,
  parseConditional,
  parseCompositionExpression,
  parseTypeAlias,
  parseDataDeclaration,
  parseFunctionType,
  parseInfixApplication,
  parseApplication,
  parseDataExpression,
  parseLambda,
};
