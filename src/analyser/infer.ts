import { ASTGrouped, BodyExpression, YukigoPrimitive } from "../parser/globals";
import { traverse } from "../ast/visitor";
import {
  FunctionGroup,
  FunctionTypeSignature,
  TypeAlias,
} from "../parser/paradigms/functional";
import { typeMappings } from "../parser/langs/haskell/definition";

type ProcessedType = { type: YukigoPrimitive; isArray: boolean };
type ProcessedSignature = {
  input: ProcessedType[];
  return: ProcessedType;
};
type ProcessedTypeAlias = {
  type: YukigoPrimitive;
  isArray: boolean;
}[];
type InferredType = {
  kind: "primitive" | "function" | "unknown";
  type: YukigoPrimitive | "unknown";
  isArray: boolean;
};

export class TypeChecker {
  private errors: string[] = [];
  private signatureMap = new Map<string, ProcessedSignature>();
  private typeAliasMap = new Map<string, ProcessedTypeAlias>();

  public check(ast: ASTGrouped): string[] {
    traverse(ast, {
      TypeAlias: (node: TypeAlias) => {
        if (this.typeAliasMap.has(node.name.value))
          return this.errors.push(
            `There are multiple declarations of type alias: ${node.name.value}`
          );
        this.typeAliasMap.set(node.name.value, node.typeParameters);
      },
      TypeSignature: (node: FunctionTypeSignature) => {
        if (this.signatureMap.has(node.name.value))
          return this.errors.push(
            `There are multiple signatures for function: ${node.name.value}`
          );

        this.signatureMap.set(node.name.value, {
          input: node.inputTypes.map((type) => ({
            type: typeMappings[type.value],
            isArray: type.isArray,
          })),
          return: {
            type: typeMappings[node.returnType.value],
            isArray: node.returnType.isArray,
          },
        });
      },
    });
    traverse(ast, {
      function: (node: FunctionGroup) => {
        const funcName = node.name.value;
        if (!this.signatureMap.has(funcName))
          return this.errors.push(
            `There is no signature for function: ${funcName}`
          );
        const funcSignature = this.signatureMap.get(funcName);
        for (const func of node.contents) {
          const symbolMap = new Map<
            string,
            { type: YukigoPrimitive; isArray: boolean }
          >();
          func.parameters.forEach((param, i) => {
            const type = funcSignature.input[i];
            if (param.type == "VariablePattern") {
              symbolMap.set(param.name, type);
            }
          });
          console.log(funcName, symbolMap);
          const funcInferredType = this.inferType(func.return.body, symbolMap);
          console.log(funcName, funcInferredType, funcSignature);
          if (
            funcInferredType.type !== funcSignature.return.type ||
            funcInferredType.isArray !== funcSignature.return.isArray
          )
            this.errors.push(
              `Function '${funcName}' does not match it's signature. Expected to return ${
                funcSignature.return.type
              }${funcSignature.return.isArray ? "[]" : ""} and got ${
                funcInferredType.type
              }${funcInferredType.isArray ? "[]" : ""}`
            );
        }
      },
    });

    return this.errors;
  }
  private inferType(
    node: BodyExpression,
    symbolMap: Map<string, ProcessedType>
  ): InferredType {
    switch (node.type) {
      case "YuString": {
        return { kind: "primitive", type: "YuString", isArray: false };
      }
      case "YuNumber":
        return { kind: "primitive", type: "YuNumber", isArray: false };
      case "YuSymbol": {
        if (symbolMap.has(node.value)) {
          const symbol = symbolMap.get(node.value);
          return {
            kind: "primitive",
            type: symbol.type,
            isArray: symbol.isArray,
          };
        }
        if (this.signatureMap.has(node.value)) {
          const signature = this.signatureMap.get(node.value);
          return {
            kind: "function",
            type: signature.return.type,
            isArray: signature.return.isArray,
          };
        }
        this.errors.push(
          `Symbol ${node.value} was not found in local env and global env`
        );
        return {
          kind: "unknown",
          type: "unknown",
          isArray: false,
        };
      }
      case "Arithmetic": {
        const leftHandType = this.inferType(node.left.body, symbolMap);
        const rightHandType = this.inferType(node.right.body, symbolMap);
        if (leftHandType.type !== "YuNumber" || leftHandType.isArray)
          this.errors.push(
            `Left-hand of arithmetic operation is not a number: ${
              leftHandType.type
            }${leftHandType.isArray ? "[]" : ""}`
          );
        if (rightHandType.type !== "YuNumber" || rightHandType.isArray)
          this.errors.push(
            `Right-hand of arithmetic operation is not a number: ${
              rightHandType.type
            }${rightHandType.isArray ? "[]" : ""}`
          );

        return { kind: "primitive", type: "YuNumber", isArray: false };
      }
      case "CompositionExpression": {
        const leftHandType = this.inferType(node.left, symbolMap);
        const rightHandType = this.inferType(node.right, symbolMap);
        if (leftHandType.kind !== "function")
          this.errors.push(
            `Left-hand of composition operation is not a function: ${leftHandType.type}`
          );
        if (rightHandType.kind !== "function")
          this.errors.push(
            `Right-hand of composition operation is not a function: ${rightHandType.type}`
          );
        if (!this.signatureMap.has(node.left.value)) {
          this.errors.push(
            `Left function in composition operation does not have a signature: ${node.left.value}`
          );
        }
        if (!this.signatureMap.has(node.right.value)) {
          this.errors.push(
            `Right function in composition operation does not have a signature: ${node.left.value}`
          );
        }

        const leftSignature = this.signatureMap.get(node.left.value);
        const rightSignature = this.signatureMap.get(node.right.value);
        const leftInput = leftSignature.input[0].type;
        const rightReturn = rightSignature.return.type;
        if (
          leftInput !== rightReturn ||
          leftSignature.input[0].isArray !== rightSignature.return.isArray
        )
          this.errors.push(
            `Right function of composition operation does not match type of left function: Right returns -> ${leftInput}${
              leftSignature.input[0].isArray ? "[]" : ""
            } ; Left inputs -> ${rightReturn}${
              rightSignature.return.isArray ? "[]" : ""
            }`
          );
        return {
          kind: "primitive",
          type: leftHandType.type,
          isArray: leftHandType.isArray,
        };
      }
      case "Concat": {
        const leftHandType = this.inferType(node.left.body, symbolMap);
        const rightHandType = this.inferType(node.right.body, symbolMap);
        if (
          leftHandType.isArray == true &&
          leftHandType.isArray == rightHandType.isArray
        ) {
          if (leftHandType.type !== rightHandType.type)
            this.errors.push(
              `Type mismatch while concatenating two lists: Left type ${leftHandType.type}[] | Right type ${rightHandType.type}[]`
            );
        } else {
          if (leftHandType.type !== "YuString")
            this.errors.push(
              `Left-hand of concat operation is not a string: ${
                leftHandType.type
              }${leftHandType.isArray ? "[]" : ""}`
            );
          if (rightHandType.type !== "YuString")
            this.errors.push(
              `Right-hand of concat operation is not a string: ${
                rightHandType.type
              }${rightHandType.isArray ? "[]" : ""}`
            );
        }

        return {
          kind: "primitive",
          type: "YuString",
          isArray:
            leftHandType.isArray == true && rightHandType.isArray == true,
        };
      }
      default:
        break;
    }
  }
}
