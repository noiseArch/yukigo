import { ASTGrouped, BodyExpression } from "../parser/globals";
import { traverse } from "../ast/visitor";
import {
  FunctionGroup,
  FunctionTypeSignature,
  Pattern,
  TypeAlias,
  TypeNode,
} from "../parser/paradigms/functional";
import { typeMappings } from "../parser/langs/haskell/definition";
import assert from "assert";

type Substitution = Map<string, TypeNode>;

export class TypeChecker {
  private errors: string[] = [];
  private signatureMap = new Map<string, TypeNode>();
  private typeAliasMap = new Map<string, TypeNode>();

  public check(ast: ASTGrouped): string[] {
    this.buildGlobalEnvironment(ast);
    traverse(ast, {
      function: (node: FunctionGroup) => {
        const funcName = node.name.value;
        if (!this.signatureMap.has(funcName)) {
          this.errors.push(`There is no signature for function: ${funcName}`);
          return;
        }
        const funcType: TypeNode = this.signatureMap.get(funcName);
        for (const func of node.contents) {
          console.log(`Checking ${funcName}`);
          assert(
            funcType.type === "FunctionType",
            "func is not a FunctionType"
          );

          const substitutions: Substitution = new Map();

          const paramTypes: TypeNode[] = funcType.from.map((t) =>
            this.mapTypeNodePrimitives(t)
          );
          const returnType: TypeNode = funcType.to;
          const symbolMap = new Map<string, TypeNode>();
          func.parameters.forEach((param, i) => {
            this.resolvePatterns(param, symbolMap, paramTypes, i);
          });
          const funcInferredType = this.inferType(
            func.return.body,
            symbolMap,
            substitutions
          );
          const subReturnType = this.applySubstitution(
            returnType,
            substitutions
          );
          const subInferredType = this.applySubstitution(
            funcInferredType,
            substitutions
          );
          console.log(subReturnType);
          console.log(subInferredType);
          if (!this.typeEquals(subReturnType, subInferredType)) {
            this.errors.push(
              `Type mismatch in function '${funcName}'. Expected ${JSON.stringify(
                subReturnType
              )} and got ${JSON.stringify(subInferredType)}`
            );
          }
        }
      },
    });

    return this.errors;
  }

  private resolvePatterns(
    param: Pattern,
    symbolMap: Map<string, TypeNode>,
    paramTypes: TypeNode[],
    i: number
  ) {
    switch (param.type) {
      case "VariablePattern":
        symbolMap.set(
          param.name,
          paramTypes[i] ?? { type: "TypeVar", name: param.name }
        );
        break;
      case "TuplePattern": {
        const tupleParamType = paramTypes[i];
        if (tupleParamType.type === "TupleType") {
          if (
            Array.isArray(param.elements) &&
            Array.isArray(tupleParamType.elements)
          ) {
            param.elements.forEach((pattern, idx) => {
              this.resolvePatterns(
                pattern,
                symbolMap,
                tupleParamType.elements,
                idx
              );
            });
          }
        } else {
          this.errors.push(`Type signature does not match Tuple type of`);
        }
        break;
      }
      default:
        break;
    }
  }

  private mapTypeNodePrimitives(type: TypeNode): TypeNode {
    switch (type.type) {
      case "TypeVar":
      case "TypeConstructor":
        if (this.typeAliasMap.has(type.name)) {
          return this.typeAliasMap.get(type.name);
        }
        if (type.name in typeMappings) {
          return {
            ...type,
            type: "TypeConstructor",
            name: typeMappings[type.name],
          };
        }
        return type;
      case "FunctionType":
        return {
          type: "FunctionType",
          from: type.from.map((t) => this.mapTypeNodePrimitives(t)),
          to: this.mapTypeNodePrimitives(type.to),
        };
      case "TypeApplication":
        return {
          type: "TypeApplication",
          base: type.base,
          args: type.args.map((t) => this.mapTypeNodePrimitives(t)),
        };
      case "ListType":
        return {
          type: "ListType",
          element: this.mapTypeNodePrimitives(type.element),
        };
      case "TupleType":
        return {
          type: "TupleType",
          elements: type.elements.map((t) => this.mapTypeNodePrimitives(t)),
        };

      default:
        return type;
    }
  }

  private buildGlobalEnvironment(ast: ASTGrouped) {
    traverse(ast, {
      TypeAlias: (node: TypeAlias) => {
        console.log(node);
        if (this.typeAliasMap.has(node.name.value))
          return this.errors.push(
            `There are multiple declarations of type alias: ${node.name.value}`
          );
        this.typeAliasMap.set(
          node.name.value,
          this.mapTypeNodePrimitives(node.value)
        );
      },
      TypeSignature: (node: FunctionTypeSignature) => {
        if (this.signatureMap.has(node.name.value))
          return this.errors.push(
            `There are multiple signatures for function: ${node.name.value}`
          );
        this.signatureMap.set(
          node.name.value,
          this.mapTypeNodePrimitives({
            type: "FunctionType",
            from: node.inputTypes,
            to: node.returnType,
          })
        );
      },
    });
    //console.log(inspect(this.signatureMap, false, null, true));
    //console.log(this.typeAliasMap);
  }

  private inferType(
    node: BodyExpression,
    symbolMap: Map<string, TypeNode>,
    substitutions: Substitution
  ): TypeNode {
    switch (node.type) {
      case "YuString":
        return { type: "TypeConstructor", name: "YuString" };
      case "YuNumber":
        return { type: "TypeConstructor", name: "YuNumber" };
      case "YuSymbol": {
        if (symbolMap.has(node.value)) {
          return symbolMap.get(node.value);
        }
        if (this.signatureMap.has(node.value)) {
          return this.signatureMap.get(node.value);
        }
        this.errors.push(
          `Symbol '${node.value}' was not found in local env and global env`
        );
        return { type: "TypeVar", name: node.value };
      }
      case "Arithmetic": {
        const left = this.inferType(node.left.body, symbolMap, substitutions);
        const right = this.inferType(node.right.body, symbolMap, substitutions);
        if (left.type !== "TypeConstructor" || left.name !== "YuNumber") {
          console.log(node.left.body, node.right.body);
          console.log(left, right);
          this.errors.push(
            `Left-hand of arithmetic operation is not YuNumber: ${JSON.stringify(
              left
            )}`
          );
        }
        if (right.type !== "TypeConstructor" || right.name !== "YuNumber")
          this.errors.push(
            `Right-hand of arithmetic operation is not YuNumber: ${JSON.stringify(
              right
            )}`
          );
        return { type: "TypeConstructor", name: "YuNumber" };
      }

      case "CompositionExpression": {
        const leftHandType = this.inferType(
          node.left,
          symbolMap,
          substitutions
        );
        const rightHandType = this.inferType(
          node.right,
          symbolMap,
          substitutions
        );

        if (leftHandType.type !== "FunctionType")
          this.errors.push(
            `Left-hand of composition operation is not a function: ${leftHandType.type}`
          );
        if (rightHandType.type !== "FunctionType")
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
        if (
          leftSignature.type == "FunctionType" &&
          rightHandType.type == "FunctionType"
        ) {
          if (!this.typeEquals(leftSignature, rightSignature))
            this.errors.push(
              `Right function of composition operation does not match type of left function`
            );
          if (
            leftSignature.to &&
            (leftSignature.to.type === "TypeConstructor" ||
              leftSignature.to.type === "TypeVar")
          ) {
            return {
              type: "TypeConstructor",
              name: leftSignature.to.name,
            };
          }
          this.errors.push(
            `Cannot determine return type name for composition: ${JSON.stringify(
              leftSignature.to
            )}`
          );
          return { type: "TypeConstructor", name: "Unknown" };
        }
        return { type: "TypeConstructor", name: "Unknown" };
      }
      case "Application": {
        const funcType = this.inferType(
          node.function.body,
          symbolMap,
          substitutions
        );
        const argType = this.inferType(
          node.parameter,
          symbolMap,
          substitutions
        );
        if (funcType.type === "FunctionType" && funcType.from.length > 0) {
          const firstArgType = this.applySubstitution(
            funcType.from[0],
            substitutions
          );
          try {
            const newSub = this.unify(firstArgType, argType);
            newSub.forEach((value, key) => substitutions.set(key, value));
          } catch (error) {
            this.errors.push(
              `Error while unifying ApplicationExpression: ${error.message}`
            );
            return { type: "TypeVar", name: "Error" };
          }
          const remainingArgs = funcType.from
            .slice(1)
            .map((t) => this.applySubstitution(t, substitutions));
          const returnType = this.applySubstitution(funcType.to, substitutions);

          return remainingArgs.length > 0
            ? { type: "FunctionType", from: remainingArgs, to: returnType }
            : returnType;
        } else {
          const returnType: TypeNode = {
            type: "TypeVar",
            name: `ret_${Math.random()}`,
          };
          const expectedFuncType: TypeNode = {
            type: "FunctionType",
            from: [argType],
            to: returnType,
          };
          try {
            const newSub = this.unify(funcType, expectedFuncType);
            newSub.forEach((value, key) => substitutions.set(key, value));
            return returnType;
          } catch (error) {
            this.errors.push(
              `Error while unifying ApplicationExpression: ${error.message}`
            );
            return { type: "TypeVar", name: "Error" };
          }
        }
      }
      case "TupleExpression": {
        const elementTypes = node.elements.map((el) => {
          if (el && el.type === "Expression" && el.body) {
            return this.inferType(el.body, symbolMap, substitutions);
          }
          return this.inferType(el.body, symbolMap, substitutions);
        });
        return { type: "TupleType", elements: elementTypes };
      }
      case "Concat": {
        const left = this.inferType(node.left.body, symbolMap, substitutions);
        const right = this.inferType(node.right.body, symbolMap, substitutions);
        if (left.type === "ListType" && right.type === "ListType") {
          if (!this.typeEquals(left.element, right.element))
            this.errors.push(
              `Type mismatch while concatenating lists: ${JSON.stringify(
                left
              )} | ${JSON.stringify(right)}`
            );
          return { type: "ListType", element: left.element };
        }
        if (
          left.type == "TypeConstructor" &&
          right.type == "TypeConstructor" &&
          left.name == "YuString" &&
          right.name == "YuString"
        ) {
          return { type: "TypeConstructor", name: "YuString" };
        }
        this.errors.push(
          `Invalid types for concat: ${JSON.stringify(
            left
          )} ++ ${JSON.stringify(right)}`
        );
        return { type: "TypeConstructor", name: "YuString" };
      }
      default:
        break;
    }
  }
  private typeEquals(
    a: TypeNode | TypeNode[],
    b: TypeNode | TypeNode[]
  ): boolean {
    if (Array.isArray(a) && Array.isArray(b)) {
      let combinedResult = true;
      for (let i = 0; i < a.length && combinedResult; i++) {
        const el1 = this.typeEquals(a[i], b[i]);
        if (!el1) {
          combinedResult = false;
          break;
        }
      }
      return combinedResult;
    } else if (!Array.isArray(a) && !Array.isArray(b)) {
      if (!a || !b || a.type !== b.type) return false;
      switch (a.type) {
        case "TypeVar":
        case "TypeConstructor":
          if ("name" in a && "name" in b) {
            return a.name === b.name;
          }
          return false;
        case "FunctionType":
          if (b.type === "FunctionType") {
            return (
              this.typeEquals(a.from, b.from) && this.typeEquals(a.to, b.to)
            );
          }
          return false;
        case "TypeApplication":
          if (b.type === "TypeApplication") {
            return (
              this.typeEquals(a.base, b.base) &&
              a.args.length === b.args.length &&
              a.args.every((arg, i) => this.typeEquals(arg, b.args[i]))
            );
          }
          return false;
        case "ListType":
          if (b.type === "ListType")
            return this.typeEquals(a.element, b.element);
          return false;
        case "TupleType":
          if (b.type === "TupleType")
            return (
              a.elements.length === b.elements.length &&
              a.elements.every((el, i) => this.typeEquals(el, b.elements[i]))
            );
          return false;
        default:
          return false;
      }
    } else {
      return false;
    }
  }

  private unify(
    t1: TypeNode | TypeNode[],
    t2: TypeNode | TypeNode[]
  ): Substitution {
    if (Array.isArray(t1) && Array.isArray(t2)) {
      let combinedSub: Substitution = new Map();
      const minLength = Math.min(t1.length, t2.length);

      for (let i = 0; i < minLength; i++) {
        const el1 = this.applySubstitution(t1[i], combinedSub);
        const el2 = this.applySubstitution(t2[i], combinedSub);
        const newSub = this.unify(el1, el2);
        combinedSub = new Map([...combinedSub, ...newSub]);
      }
      return combinedSub;
    } else if (!Array.isArray(t1) && !Array.isArray(t2)) {
      if (this.typeEquals(t1, t2)) {
        return new Map();
      }
      if (t1.type === "TypeVar") {
        return this.bindVariable(t1.name, t2);
      }
      if (t2.type === "TypeVar") {
        return this.bindVariable(t2.name, t1);
      }

      if (t1.type === "FunctionType" && t2.type === "FunctionType") {
        const sub1 = this.unify(t1.from, t2.from);
        const sub2 = this.unify(
          this.applySubstitution(t1.to, sub1),
          this.applySubstitution(t2.to, sub1)
        );
        return new Map([...sub1, ...sub2]);
      }

      if (t1.type === "ListType" && t2.type === "ListType") {
        return this.unify(t1.element, t2.element);
      }

      if (t1.type === "TupleType" && t2.type === "TupleType") {
        if (t1.elements.length !== t2.elements.length) {
          throw new Error("Cannot unify tuples of different lengths.");
        }
        let combinedSub: Substitution = new Map();
        for (let i = 0; i < t1.elements.length; i++) {
          const el1 = this.applySubstitution(t1.elements[i], combinedSub);
          const el2 = this.applySubstitution(t2.elements[i], combinedSub);
          const newSub = this.unify(el1, el2);
          combinedSub = new Map([...combinedSub, ...newSub]);
        }
        return combinedSub;
      }
    }

    throw new Error(
      `Type mismatch: Cannot unify ${JSON.stringify(t1)} with ${JSON.stringify(
        t2
      )}.`
    );
  }

  private bindVariable(name: string, type: TypeNode): Substitution {
    if (type.type === "TypeVar" && type.name === name) {
      return new Map();
    }
    if (JSON.stringify(type).includes(`"name":"${name}"`)) {
      throw new Error(
        `Infinite type detected: ${name} occurs in ${JSON.stringify(type)}.`
      );
    }
    return new Map([[name, type]]);
  }

  private applySubstitution(type: TypeNode, sub: Substitution): TypeNode {
    switch (type.type) {
      case "TypeVar":
        return sub.has(type.name)
          ? this.applySubstitution(sub.get(type.name)!, sub)
          : type;

      case "FunctionType":
        return {
          type: "FunctionType",
          from: type.from.map((t) => this.applySubstitution(t, sub)),
          to: this.applySubstitution(type.to, sub),
        };

      case "ListType":
        return {
          type: "ListType",
          element: this.applySubstitution(type.element, sub),
        };

      case "TupleType":
        return {
          type: "TupleType",
          elements: type.elements.map((el) => this.applySubstitution(el, sub)),
        };

      case "TypeConstructor":
        return type;
      default:
        return type;
    }
  }
}
