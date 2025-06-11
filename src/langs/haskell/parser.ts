import {
  ArrayCollection,
  NumberPrimitive,
  StringPrimitive,
  SymbolPrimitive,
} from "../../globals";
import {
  CompositionExpression,
  FunctionExpression,
  ListPrimitive,
} from "../../paradigms/functional";
import {
  HSExpression,
  HSFunctionDeclaration,
  HSFunctionTypeDeclaration,
  HSLamdaExpression,
  HSListPrimitive,
  HSTypeAlias,
} from "./definition";
import util from "util";

function parseFunction(token: any) {
  console.log("Function", util.inspect(token, false, null, true));
  const funcDecl: HSFunctionDeclaration = {
    type: "function",
    name: { type: "symbol", value: token[0].value },
    parameters: token[2]
      ? token[2].map((param: any) => {
          return { type: "symbol", value: param.value };
        })
      : [],
    body: token[6],
  };

  return funcDecl;
}

function parseFunctionType(token: any) {
  console.log("Function Type Exp", util.inspect(token, false, null, true));
  const inputTypes =
    token[1].length > 1
      ? token[1].slice(0, -1).map((param: any) => {
          return { type: "symbol", value: param.value };
        })
      : [];
  const returnType = token[1][token[1].length - 1];
  const functionType: HSFunctionTypeDeclaration = {
    type: "function_type_declaration",
    name: { type: "symbol", value: token[0].value },
    inputTypes: inputTypes,
    returnType: returnType,
  };
  return functionType;
}

function parseTypeAlias(token: any) {
  //console.log(token);
  const typeAlias: HSTypeAlias = {
    type: "type_alias",
    name: { type: "symbol", value: token[2].value },
    typeParameters: token[6],
  };
  return typeAlias;
}

function parseExpression(token: any) {
  if (!token[1]) return token;
  const expression: HSExpression = {
    type: "expression",
    left: token[0],
    operator: token[1].value,
    right: token[2],
  };
  return expression;
}

function parseLambda(token: any) {
  //console.log("Lambda", util.inspect(token, false, null, true));
  const lambda: HSLamdaExpression = {
    type: "lambda_expression",
    parameters: token[0].map((param: any) => {
      return { type: "symbol", value: param.value };
    }),
    body: token[1],
  }
  return lambda
}

function parseFunctionExpression(token: any) {
  //console.log("Function Expression", util.inspect(token, false, null, true));
  const funcExpr: FunctionExpression = {
    type: "function_expression",
    name: { type: "symbol", value: token[0].value },
    parameters: token[2]
      ? token[2].map((param: any) => {
          return { type: "symbol", value: param.value };
        })
      : [],
  };
  return funcExpr;
}

function parseCompositionExpression(token: any) {
  const compositionExpression: CompositionExpression = {
    type: "composition_expression",
    left: { type: "symbol", value: token[0].value },
    right: { type: "symbol", value: token[1].value },
  };
  return compositionExpression;
}

function parsePrimary(token: any) {
  //console.log("Primary", util.inspect(token, false, null, true));
  switch (token.type) {
    case "identifier": {
      const identifierPrimitive: SymbolPrimitive = {
        type: "symbol",
        value: token.value,
      };
      return identifierPrimitive;
    }
    case "number": {
      const numberPrimitive: NumberPrimitive = {
        type: "number",
        numericType: "number", // Assuming all numbers are of type "number"
        value: token.value,
      };
      return numberPrimitive;
    }
    case "string": {
      const stringPrimitive: StringPrimitive = {
        type: "string",
        value: token.value,
      };
      return stringPrimitive;
    }
    case "list": {
      const listPrimitive: HSListPrimitive = {
        type: "list",
        elements: token.body[2]
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
  parseFunctionExpression,
  parseCompositionExpression,
  parseTypeAlias,
  parseFunctionType,
  parseLambda
};
