import { Primitive, SymbolPrimitive } from "../../../globals";
import { Expression, Statement } from "../../paradigms/objects";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Token = any; // TODO: Define the type of the data from the postprocessor function at grammar.ne

export function parseExpression(data: Token[]) {
  if (data.length == 1) return data[0];
  let expression: Expression;
  switch (data[1].type) {
    case "op":
      expression = {
        type: "operation",
        operator: data[1].value,
        right: data[0],
        left: data[2],
      };
      break;
    default:
      break;
  }
  return expression;
}

export function parseStatement(data: Token[]) {
  console.log(data);
  if (data[0].type == "keyword") {
    const isMutable = data[0].value !== "const";
    const symbol: SymbolPrimitive = data[1];
    const expression: Expression = data[3];
    const variableDeclaration: Statement = {
      type: "variableDeclaration",
      name: symbol,
      value: expression,
      isMutable,
    };
    //console.log(variableDeclaration)
    return variableDeclaration;
  }
  if (data[0].type == "symbol") {
    const symbol: SymbolPrimitive = data[0];
    const expression: Expression = data[2];
    const assignmentOperation: Statement = {
      type: "assignment",
      operator: "=",
      right: symbol,
      left: expression,
    };
    return assignmentOperation;
  }
}

export function parseTerm(data: Token[]) {
  if (data.length == 1) return data[0];
  let expression: Expression;
  switch (data[1].type) {
    case "op":
      expression = {
        type: "operation",
        operator: data[1].value,
        right: data[0],
        left: data[2],
      };
      break;
    default:
      break;
  }
  return expression;
}

export function parsePrimary(data) {
  switch (data[0].type) {
    case "symbol":
      return parseIdentifier(data);
    case "number":
      return parseNumber(data);
    case "string":
      return parseString(data);
    case "lparen":
      return parseParenExpression(data);
    default:
      throw Error(`Unexpected primary: ${data[0].type}`);
  }
}

export function parseIdentifier(data) {
  const identifierPrimitive: Primitive = {
    type: "symbol",
    value: data[0].value,
  };
  return identifierPrimitive;
}

export function parseNumber(data) {
  const numberPrimitive: Primitive = {
    type: "number",
    numericType: "number",
    value: data[0].value,
  };
  return numberPrimitive;
}
export function parseString(data) {
  const stringPrimitive: Primitive = {
    type: "string",
    value: data[0].value,
  };
  return stringPrimitive;
}

export function parseParenExpression(data) {
  return data[1];
}
