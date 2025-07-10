import fs from "fs";
import { argv } from "process";
import { parse } from "../parser/parser";
import { traverse } from "../ast/visitor";
import {
  FunctionGroup,
  FunctionTypeSignature,
} from "../parser/paradigms/functional";
import util from "util";
import {
  ArithmeticOperation,
  Expression,
  NumberPrimitive,
  SymbolPrimitive,
  YukigoPrimitive,
} from "../parser/globals";
import { typeMappings } from "../parser/langs/haskell/definition";
const filePath = argv[2];
console.log(filePath);
console.log(`Parsing: ${filePath}`);
const code = fs.readFileSync(filePath, "utf-8");
const ast = parse(code);

const parameterTypes: Map<string, { type: YukigoPrimitive; isArray: boolean }> =
  new Map();

const inferType = (node: any): string => {
  switch (node.type) {
    case "function":
      if (node.name) {
        let i = 0;
        traverse(node, {
          VariablePattern: (pattern: { type: string; name: string }) => {
            traverse(ast, {
              TypeSignature: (typeSig: FunctionTypeSignature) => {
                if (node.name.value === typeSig.name.value) {
                  const yukigoEq = typeMappings[typeSig.inputTypes[i].value];
                  parameterTypes.set(pattern.name, {
                    type: yukigoEq,
                    isArray: typeSig.inputTypes[i].isArray,
                  });
                  i++;
                }
              },
            });
          },
        });
        console.log(parameterTypes);
        const returnTypes = node.contents
          .filter((content: any) => content.return)
          .map((content: any) => inferType(content.return.body));
        return returnTypes.length === 1
          ? returnTypes[0]
          : returnTypes.join(" ");
      }
      break;
    case "Arithmetic": {
      const leftType = inferType(node.left);
      const rightType = inferType(node.right);
      return leftType + " " + rightType;
    }
    case "Application": {
      const functionType = inferType(node.function);
      return functionType;
    }
    case "YuNumber": {
      return "YuNumber";
    }
    case "YuSymbol": {
      console.log(node);
      if (parameterTypes.has(node.value)) {
        return parameterTypes.get(node.value).type;
      }
      return "YuSymbol";
    }
    default:
      return "Unknown";
  }
};
traverse(ast, {
  function: (func: FunctionGroup) => {
    console.log(inferType(func));
  },
});
