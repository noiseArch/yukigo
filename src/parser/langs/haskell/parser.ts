import {
  ListPrimitive,
  NumberPrimitive,
  Primitive,
  StringPrimitive,
  SymbolPrimitive,
  YukigoPrimitive,
} from "../../globals";
import {
  CompositionExpression,
  FunctionTypeSignature,
  TypeAlias,
} from "../../paradigms/functional";
import {
  HSExpression,
  HSFunctionDeclaration,
  HSLamdaExpression,
  HSPattern,
} from "./definition";

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
    Primitive[],
    {
      type: "rsquare";
      value: "]";
      text: "]";
      toString: [Function: () => string];
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
  params: SymbolPrimitive[];
  body: HSExpression;
  attributes: string[];
}) {
  //console.log("Function", util.inspect(token, false, null, true));
  const funcDecl: HSFunctionDeclaration = {
    type: "function",
    name: token.name,
    parameters: token.params,
    body: token.body,
    attributes: token.attributes,
  };

  return funcDecl;
}

function parseFunctionType(token: [SymbolPrimitive, [SymbolPrimitive & {isArray: boolean}]]) {
  //console.log("FunctionSignature", util.inspect(token, false, null, true));

  const bodyType: SymbolPrimitive[] = token[1].map(
    (t) => ({ type: "YuSymbol", value: t.value } satisfies SymbolPrimitive)
  );
  const inputTypes = bodyType.length > 1 ? bodyType.slice(0, -1) : [];
  const returnType = bodyType[bodyType.length - 1];
  const functionType: FunctionTypeSignature = {
    type: "TypeSignature",
    name: { type: "YuSymbol", value: token[0].value },
    inputTypes: inputTypes,
    returnType: returnType,
  };
  return functionType;
}

function parseTypeAlias(
  token: [Token, SymbolPrimitive, Token, SymbolPrimitive[]]
) {
  //console.log(token);
  const typeAlias: TypeAlias = {
    type: "TypeAlias",
    name: token[1],
    typeParameters: token[3],
  };
  return typeAlias;
}

function parseExpression(token: HSExpression) {
  //console.log("Expression", util.inspect(token, false, null, true));
  return token;
}

function parseLambda(token: [HSPattern[], HSExpression]) {
  //console.log("Lambda", util.inspect(token, false, null, true));
  const lambda: HSLamdaExpression = {
    type: "LambdaExpression",
    parameters: token[0].map((param) => {
      return { type: "YuSymbol", value: param.name } satisfies SymbolPrimitive;
    }),
    body: token[1],
  };
  return lambda;
}

function parseCompositionExpression(
  token: { type: YukigoPrimitive; value: string }[]
) {
  //console.log("Composition Expr", util.inspect(token, false, null, true));
  const compositionExpression: CompositionExpression = {
    type: "CompositionExpression",
    left: { type: "YuSymbol", value: token[0].value },
    right: { type: "YuSymbol", value: token[1].value },
  };
  return compositionExpression;
}

function parsePrimary(token: Token) {
  //console.log("Primary", util.inspect(token, false, null, true));
  switch (token.type) {
    case "identifier": {
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
  parseCompositionExpression,
  parseTypeAlias,
  parseFunctionType,
  parseLambda,
};
