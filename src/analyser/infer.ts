import { ASTGrouped, BodyExpression, Record } from "../parser/globals";
import { traverse } from "../ast/visitor";
import {
  DataType,
  FunctionGroup,
  FunctionTypeSignature,
  Pattern,
  TypeAlias,
  TypeNode,
  TypeVar,
} from "../parser/paradigms/functional";
import { typeMappings } from "../parser/langs/haskell/definition";
import assert from "assert";
import { isGuardedBody, isUnguardedBody } from "../utils/helpers";

type Substitution = Map<string, TypeNode>;

// big ahh class down here -_-

export class TypeChecker {
  private errors: string[] = [];
  private signatureMap = new Map<string, TypeNode>();
  private recordMap = new Map<string, DataType>();
  private typeAliasMap = new Map<string, TypeNode>();

  public check(ast: ASTGrouped): string[] {
    this.buildGlobalEnvironment(ast);
    traverse(ast, {
      function: (node: FunctionGroup) => {
        const functionName = node.name.value;
        const functionType: TypeNode = this.signatureMap.get(functionName);

        if (!functionType)
          return this.errors.push(`No signature for function: ${functionName}`);

        // checks for every "instance" of the function.
        // like pattern matching "generates" two funcs in node.contents
        for (const func of node.contents) {
          assert(functionType.type === "FunctionType");

          const substitutions: Substitution = new Map();
          const symbolMap = new Map<string, TypeNode>();
          const returnType: TypeNode = functionType.to;

          // resolve param types
          const paramTypes: TypeNode[] = functionType.from.map((t) =>
            this.mapTypeNodePrimitives(t)
          );
          func.parameters.forEach((param, i) => {
            this.resolvePatterns(param, symbolMap, paramTypes, i);
          });

          let subReturnType: TypeNode;
          let subInferredType: TypeNode;
          // infer the return expression
          if (isUnguardedBody(func)) {
            // function body doesnt have guards
            const funcInferredType = this.inferType(
              func.return.body,
              symbolMap,
              substitutions
            );
            subReturnType = this.applySubstitution(returnType, substitutions);
            subInferredType = this.applySubstitution(
              funcInferredType,
              substitutions
            );
          } else if (isGuardedBody(func)) {
            // function body has guards, checks for each if it has a valid condition and its return expr
            for (const guard of func.body) {
              const guardBody = guard.condition.body;

              const isOtherwise =
                guardBody.type === "YuSymbol" &&
                guardBody.value === "otherwise";

              const guardInferredType = isOtherwise
                ? { type: "TypeConstructor", name: "YuBoolean" }
                : this.inferType(guardBody, symbolMap, substitutions);

              if (
                guardInferredType.type !== "TypeConstructor" ||
                guardInferredType.name !== "YuBoolean"
              ) {
                this.errors.push(
                  `Expected guard condition to be YuBoolean and got ${JSON.stringify(
                    guardInferredType
                  )}`
                );
                return;
              }
              const funcInferredType = this.inferType(
                guard.return.body,
                symbolMap,
                substitutions
              );
              subReturnType = this.applySubstitution(returnType, substitutions);
              subInferredType = this.applySubstitution(
                funcInferredType,
                substitutions
              );
            }
          }
          if (!this.typeEquals(subReturnType, subInferredType)) {
            this.errors.push(
              `Type mismatch in function '${functionName}'. Expected ${JSON.stringify(
                subReturnType
              )} and got ${JSON.stringify(subInferredType)}`
            );
          }
        }
      },
    });
    return this.errors;
  }

  private buildGlobalEnvironment(ast: ASTGrouped) {
    traverse(ast, {
      TypeAlias: (node: TypeAlias) => {
        const typeAliasIdentifier = node.name.value;
        if (this.typeAliasMap.has(typeAliasIdentifier)) {
          this.errors.push(
            `Multiple declarations of type alias: ${typeAliasIdentifier}`
          );
          return;
        }
        const resolvedType = this.mapTypeNodePrimitives(node.value);
        this.typeAliasMap.set(typeAliasIdentifier, resolvedType);
      },
      Record: (node: Record) => {
        const recordIdentifier = node.name.value;
        const recordConstructor = node.constructor;

        // check if record identifier is already in the recordMap or another record uses same constructor
        const isConstructorInRecord = Array.from(this.recordMap).some(
          (record) => record[1].constructor === recordConstructor.value
        );
        if (this.recordMap.has(recordIdentifier) || isConstructorInRecord) {
          this.errors.push(`Multiple declarations of: ${recordIdentifier}`);
          return;
        }

        if (this.signatureMap.has(recordConstructor.value)) {
          this.errors.push(
            `Constructor name '${recordConstructor.value}' conflicts with an existing function.`
          );
          return;
        }
        try {
          const resolvedFieldTypes = node.contents.map((t) =>
            this.mapTypeNodePrimitives(t.value)
          );
          const record: DataType = {
            type: "DataType",
            name: recordIdentifier,
            constructor: recordConstructor.value,
            fields: resolvedFieldTypes,
          };

          this.recordMap.set(recordIdentifier, record);

          // here we need to resolve what params should accept the constructor when using it in a function
          let constructorFuncType: TypeNode;
          if (resolvedFieldTypes.length > 0) {
            constructorFuncType = {
              type: "FunctionType",
              from: resolvedFieldTypes,
              to: { type: "TypeConstructor", name: recordIdentifier },
            };
          } else {
            constructorFuncType = {
              type: "TypeConstructor",
              name: recordIdentifier,
            };
          }
          this.signatureMap.set(recordConstructor.value, constructorFuncType);
        } catch (e) {
          this.errors.push(`In record '${recordIdentifier}': ${e.message}`);
        }
      },
      TypeSignature: (node: FunctionTypeSignature) => {
        const functionName = node.name.value;
        const returnType = node.returnType;
        if (this.signatureMap.has(functionName)) {
          this.errors.push(`Multiple signatures for: ${functionName}`);
          return;
        }
        try {
          const resolvedInputs = node.inputTypes.map((t) =>
            this.mapTypeNodePrimitives(t)
          );
          const resolvedReturn = this.mapTypeNodePrimitives(returnType);
          let finalInputs = resolvedInputs;
          let finalReturn = resolvedReturn;

          const isFunctionType =
            (returnType.type === "TypeVar" ||
              returnType.type === "TypeConstructor") &&
            resolvedReturn.type === "FunctionType";

          if (isFunctionType) {
            finalInputs = [...resolvedInputs, ...resolvedReturn.from];
            finalReturn = resolvedReturn.to;
          }

          this.signatureMap.set(functionName, {
            type: "FunctionType",
            from: finalInputs,
            to: finalReturn,
          });
        } catch (e) {
          this.errors.push(`In signature for '${functionName}': ${e.message}`);
        }
      },
    });
    console.log(this.recordMap);
    console.log(this.signatureMap);
  }

  private inferType(
    node: BodyExpression,
    symbolMap: Map<string, TypeNode>,
    substitutions: Substitution
  ): TypeNode {
    switch (node.type) {
      case "YuChar":
      case "YuString":
      case "YuNumber":
      case "YuBoolean":
        return { type: "TypeConstructor", name: node.type };
      case "YuList": {
        const elementInferredTypes = node.elements.map((element) =>
          this.inferType(element.body, symbolMap, substitutions)
        );
        const firstType = elementInferredTypes[0];
        const allElementsMatch = elementInferredTypes.every((element) =>
          this.typeEquals(firstType, element)
        );
        if (allElementsMatch) {
          return {
            type: "ListType",
            element: firstType,
          };
        }
        this.errors.push(`Elements of list aren't all the same.`);
        return {
          type: "ListType",
          element: { type: "TypeVar", name: "Error" },
        };
      }
      case "YuSymbol": {
        const symbolValue = node.value;

        // first checks the symbolMap for parameters, then the signatures, then the typeAliases and finally the records
        const symbolType =
          symbolMap.get(symbolValue) ??
          this.signatureMap.get(symbolValue) ??
          this.typeAliasMap.get(symbolValue) ??
          this.recordMap.get(symbolValue);

        if (!symbolType) {
          this.errors.push(`Symbol '${node.value}' not in scope.`);
          return { type: "TypeVar", name: node.value };
        }
        return symbolType;
      }
      case "Arithmetic": {
        const leftType = this.inferType(
          node.left.body,
          symbolMap,
          substitutions
        );
        const rightType = this.inferType(
          node.right.body,
          symbolMap,
          substitutions
        );
        const numberType: TypeNode = {
          type: "TypeConstructor",
          name: "YuNumber",
        };

        try {
          const sub1 = this.unify(leftType, numberType);
          sub1.forEach((v, k) => substitutions.set(k, v));
          const sub2 = this.unify(rightType, numberType);
          sub2.forEach((v, k) => substitutions.set(k, v));
        } catch (e) {
          this.errors.push(
            `Arithmetic operation requires numbers: ${e.message}`
          );
          return { type: "TypeVar", name: "TypeError" };
        }
        return numberType;
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

        if (leftHandType.type !== "FunctionType") {
          this.errors.push(
            `Left-hand of composition operation is not a function: ${leftHandType.type}`
          );
          return { type: "TypeVar", name: "Error" };
        }
        if (rightHandType.type !== "FunctionType") {
          this.errors.push(
            `Right-hand of composition operation is not a function: ${rightHandType.type}`
          );
          return { type: "TypeVar", name: "Error" };
        }

        if (!this.typeEquals(leftHandType, rightHandType)) {
          this.errors.push(
            `Right function of composition operation does not match type of left function`
          );
          return { type: "TypeVar", name: "Error" };
        }

        const leftReturn = leftHandType.to;

        if (
          leftReturn.type === "TypeConstructor" ||
          leftReturn.type === "TypeVar"
        ) {
          return {
            type: "TypeConstructor",
            name: leftReturn.name,
          };
        }

        this.errors.push(
          `Cannot determine return type name for composition: ${JSON.stringify(
            leftReturn
          )}`
        );
        return { type: "TypeVar", name: "Error" };
      }
      case "IfThenElse": {
        const conditionType = this.inferType(
          node.condition.body,
          symbolMap,
          substitutions
        );

        const isConditionBoolean =
          conditionType.type == "TypeConstructor" &&
          conditionType.name == "YuBoolean";

        if (!isConditionBoolean) {
          this.errors.push(`Expression for condition is not a YuBoolean`);
          return { type: "TypeVar", name: "Error" };
        }

        const thenType = this.applySubstitution(
          this.inferType(node.then.body, symbolMap, substitutions),
          substitutions
        );
        const elseType = this.applySubstitution(
          this.inferType(node.else.body, symbolMap, substitutions),
          substitutions
        );

        if (!this.typeEquals(thenType, elseType)) {
          this.errors.push(
            `Expression in Then block and Else block do not match. Then: ${thenType} | Else: ${elseType}`
          );
          return { type: "TypeVar", name: "Error" };
        }

        return thenType;
      }
      case "Application": {
        const funcType = this.inferType(
          node.function.body,
          symbolMap,
          substitutions
        );
        const argType = this.inferType(
          node.parameter.type === "Expression"
            ? node.parameter.body
            : node.parameter,
          symbolMap,
          substitutions
        );
        // case for function with params
        if (funcType.type === "FunctionType" && funcType.from.length > 0) {
          const expectedArgType = this.applySubstitution(
            funcType.from[0],
            substitutions
          );
          try {
            const newSub = this.unify(expectedArgType, argType);
            newSub.forEach((value, key) => substitutions.set(key, value));
          } catch (error) {
            this.errors.push(
              `Error while unifying ApplicationExpression: ${error.message}`
            );
            return { type: "TypeVar", name: "Error" };
          }

          // handles application with partial application
          // in 'add 1 2' => first checks 'add 1' which gives a 'YuNumber -> YuNumber' => then 'YuNumber 2' finally getting YuNumber
          // in 'add 1' => checks for 'add 1' and resolves a function that expects a YuNumber and returns a YuNumber (YuNumber -> YuNumber)
          const remainingArgs = funcType.from
            .slice(1)
            .map((t) => this.applySubstitution(t, substitutions));
          const returnType = this.applySubstitution(funcType.to, substitutions);

          return remainingArgs.length > 0
            ? { type: "FunctionType", from: remainingArgs, to: returnType }
            : returnType;
        } else if (funcType.type === "DataType") {
          // case for record declaration using constructor
          const recordDefinition = this.recordMap.get(funcType.name);

          if (!recordDefinition) {
            this.errors.push(
              `Missing record definition for data type: ${funcType.name}`
            );
            return { type: "TypeVar", name: "Error" };
          }

          const fields = recordDefinition.fields;

          if (fields.length <= 0) {
            this.errors.push(
              `Data constructor '${recordDefinition.constructor}' does not expect arguments.`
            );
            return { type: "TypeVar", name: "Error" };
          }

          const expectedFieldType = this.applySubstitution(
            fields[0],
            substitutions
          );

          try {
            const newSub = this.unify(expectedFieldType, argType);
            newSub.forEach((value, key) => substitutions.set(key, value));
          } catch (error) {
            this.errors.push(
              `Type mismatch for data constructor argument '${
                recordDefinition.constructor
              }'. Expected ${JSON.stringify(
                expectedFieldType
              )} but got ${JSON.stringify(argType)}: ${error.message}`
            );
            return { type: "TypeVar", name: "Error" };
          }

          // same as before, this handles the case were the record is constructed partially
          const remainingFields = fields
            .slice(1)
            .map((t) => this.applySubstitution(t, substitutions));

          if (remainingFields.length > 0) {
            return {
              type: "FunctionType",
              from: remainingFields,
              to: { type: "TypeConstructor", name: recordDefinition.name },
            };
          }
          return {
            type: "TypeConstructor",
            name: recordDefinition.name,
          };
        } else {
          // default case, not functiontype or datatype. im not sure about this
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
      case "InfixApplication": {
        const operatorSymbol = node.operator;

        const firstApp: BodyExpression = {
          type: "Application",
          function: {
            type: "Expression",
            body: operatorSymbol,
          },
          parameter: {
            type: "Expression",
            body: node.left.body,
          },
        };
        // treats infix application as a common application
        const secondApp: BodyExpression = {
          type: "Application",
          function: {
            type: "Expression",
            body: firstApp,
          },
          parameter: {
            type: "Expression",
            body: node.right.body,
          },
        };
        return this.inferType(secondApp, symbolMap, substitutions);
      }
      case "DataExpression": {
        const dataConstructor = node.name.value;
        const dataType = Array.from(this.recordMap).find(
          (record) => record[1].constructor === dataConstructor
        )?.[1];

        if (!dataType) {
          this.errors.push(`Not in scope: data constructor ${dataConstructor}`);
          return { type: "TypeVar", name: "Error" };
        }

        return {
          type: "TypeConstructor",
          name: dataType.name,
        };
      }
      case "TupleExpression": {
        const elementTypes = node.elements.map((el) =>
          this.inferType(el.body, symbolMap, substitutions)
        );
        return { type: "TupleType", elements: elementTypes };
      }
      case "Comparison": {
        const leftType = this.inferType(
          node.left.body,
          symbolMap,
          substitutions
        );
        const rightType = this.inferType(
          node.right.body,
          symbolMap,
          substitutions
        );

        try {
          const sub = this.unify(leftType, rightType);
          sub.forEach((v, k) => substitutions.set(k, v));
        } catch (e) {
          this.errors.push(
            `Comparison requires both sides to have the same type: ${e.message}`
          );
          return { type: "TypeVar", name: "TypeError" };
        }

        return { type: "TypeConstructor", name: "YuBoolean" };
      }
      case "Concat": {
        const leftType = this.inferType(
          node.left.body,
          symbolMap,
          substitutions
        );
        const rightType = this.inferType(
          node.right.body,
          symbolMap,
          substitutions
        );
        let unifiedType: TypeNode;

        try {
          const sub1 = this.unify(leftType, rightType);
          sub1.forEach((v, k) => substitutions.set(k, v));
          unifiedType = this.applySubstitution(leftType, substitutions);
        } catch (e) {
          this.errors.push(
            `Concat type mismatch: ${e.message}. ` +
              `Left: ${JSON.stringify(leftType)}, Right: ${JSON.stringify(
                rightType
              )}`
          );
          return { type: "TypeVar", name: "Error" };
        }
        const isYuString =
          unifiedType.type === "TypeConstructor" &&
          unifiedType.name === "YuString";
        const isYuList = unifiedType.type === "ListType";

        if (isYuString || isYuList) return unifiedType;

        if (unifiedType.type !== "TypeVar") {
          this.errors.push(
            `Concat requires both sides to be strings or lists of the same type. ` +
              `Got: ${JSON.stringify(leftType)} and ${JSON.stringify(
                rightType
              )}`
          );
          return { type: "TypeVar", name: "Error" };
        }

        // If a TypeVar, try to unify it to a YuString or a YuList.
        const elemType: TypeVar = {
          type: "TypeVar",
          name: `elem_${Math.random()}`,
        };
        try {
          this.unify(unifiedType, {
            type: "TypeConstructor",
            name: "YuString",
          });
          return { type: "TypeConstructor", name: "YuString" };
        } catch {
          try {
            this.unify(unifiedType, {
              type: "ListType",
              element: elemType,
            });

            return { type: "ListType", element: elemType };
          } catch (e) {
            console.log(e);
            this.errors.push(
              `Concat requires both sides to be strings or lists of the same type. ` +
                `Got: ${JSON.stringify(leftType)} and ${JSON.stringify(
                  rightType
                )}`
            );
            return { type: "TypeVar", name: "Error" };
          }
        }
      }
      case "LambdaExpression": {
        const lambdaSymbolMap = new Map(symbolMap);
        const paramTypes: TypeNode[] = [];

        for (const param of node.parameters) {
          if (param.type === "VariablePattern") {
            const typeVar: TypeVar = {
              type: "TypeVar",
              name: `lambda_${Math.random()}`,
            };
            lambdaSymbolMap.set(param.name, typeVar);
            paramTypes.push(typeVar);
          } else {
            // TODO add missing patterns
            this.errors.push(
              `Unsupported pattern in lambda parameter: ${param.type}`
            );
            return { type: "TypeVar", name: "Error" };
          }
        }

        const bodyType = this.inferType(
          node.body.body,
          lambdaSymbolMap,
          substitutions
        );

        return {
          type: "FunctionType",
          from: paramTypes,
          to: bodyType,
        };
      }
      default:
        break;
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
      if (t1.type === "DataType" && t2.type === "DataType") {
        if (
          t1.constructor !== t2.constructor ||
          t1.fields.length !== t2.fields.length
        ) {
          throw new Error(
            `Cannot unify data types with different constructors or field counts: ${t1.constructor} vs ${t2.constructor}`
          );
        }
        let combinedSub: Substitution = new Map();
        for (let i = 0; i < t1.fields.length; i++) {
          const f1 = this.applySubstitution(t1.fields[i], combinedSub);
          const f2 = this.applySubstitution(t2.fields[i], combinedSub);
          const newSub = this.unify(f1, f2);
          combinedSub = new Map([...combinedSub, ...newSub]);
        }
        return combinedSub;
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

  private typeEquals(
    a: TypeNode | TypeNode[],
    b: TypeNode | TypeNode[]
  ): boolean {
    if (Array.isArray(a) !== Array.isArray(b)) return false;

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
    }
    if (!Array.isArray(a) && !Array.isArray(b)) {
      if (!a || !b || a.type !== b.type) return false;
      switch (a.type) {
        case "TypeVar":
        case "TypeConstructor":
          if (!("name" in b)) return false;
          return a.name === b.name;
        case "FunctionType":
          if (b.type !== "FunctionType") return false;
          return this.typeEquals(a.from, b.from) && this.typeEquals(a.to, b.to);
        case "TypeApplication":
          if (b.type !== "TypeApplication") return false;
          return (
            this.typeEquals(a.base, b.base) &&
            a.args.length === b.args.length &&
            a.args.every((arg, i) => this.typeEquals(arg, b.args[i]))
          );
        case "ListType":
          if (b.type !== "ListType") return false;
          return this.typeEquals(a.element, b.element);
        case "TupleType":
          if (b.type !== "TupleType") return false;
          return (
            a.elements.length === b.elements.length &&
            a.elements.every((el, i) => this.typeEquals(el, b.elements[i]))
          );
        case "DataType":
          if (b.type !== "DataType") return false;
          return (
            a.constructor === b.constructor &&
            a.fields.every((el, i) => this.typeEquals(el, b.fields[i]))
          );
        default:
          return false;
      }
    }
  }

  private resolveTypeAlias(
    type: TypeNode,
    visited: Set<string> = new Set()
  ): TypeNode {
    switch (type.type) {
      case "TypeConstructor":
      case "TypeVar": {
        if (visited.has(type.name)) {
          throw new Error(`Cyclic type alias detected: ${type.name}`);
        }

        if (this.typeAliasMap.has(type.name)) {
          visited.add(type.name);
          return this.resolveTypeAlias(
            this.typeAliasMap.get(type.name)!,
            visited
          );
        }
        return type;
      }

      case "FunctionType":
        return {
          type: "FunctionType",
          from: type.from.map((t) =>
            this.resolveTypeAlias(t, new Set(visited))
          ),
          to: this.resolveTypeAlias(type.to, new Set(visited)),
        };

      case "ListType":
        return {
          type: "ListType",
          element: this.resolveTypeAlias(type.element, new Set(visited)),
        };

      case "TupleType":
        return {
          type: "TupleType",
          elements: type.elements.map((el) =>
            this.resolveTypeAlias(el, new Set(visited))
          ),
        };
      case "DataType":
        return {
          ...type,
          fields: type.fields.map((f) =>
            this.resolveTypeAlias(f, new Set(visited))
          ),
        };
      default:
        return type;
    }
  }

  private bindVariable(name: string, type: TypeNode): Substitution {
    if (type.type === "TypeVar" && type.name === name) {
      // basically if they are the same TypeVar there isnt a need to substitute
      return new Map();
    }
    if (this.isTypeInfinite(name, type)) {
      throw new Error(
        `Infinite type detected: ${name} occurs in ${JSON.stringify(type)}.`
      );
    }
    return new Map([[name, type]]);
  }

  private isTypeInfinite(name: string, type: TypeNode): boolean {
    switch (type.type) {
      case "TypeVar":
        return type.name === name;
      case "FunctionType":
        return (
          type.from.some((t) => this.isTypeInfinite(name, t)) ||
          this.isTypeInfinite(name, type.to)
        );
      case "ListType":
        return this.isTypeInfinite(name, type.element);
      case "TupleType":
        return type.elements.some((t) => this.isTypeInfinite(name, t));
      case "DataType":
        return type.fields.some((t) => this.isTypeInfinite(name, t));
      case "TypeConstructor":
      case "TypeApplication":
        return false;
      default:
        return false;
    }
  }

  private resolvePatterns(
    param: Pattern,
    symbolMap: Map<string, TypeNode>,
    paramTypes: TypeNode[],
    i: number
  ) {
    switch (param.type) {
      case "VariablePattern":
        symbolMap.set(param.name, paramTypes[i]);
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
          this.errors.push(`Type signature does not match Tuple type`);
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
      case "TypeConstructor": {
        if (this.typeAliasMap.has(type.name))
          return this.typeAliasMap.get(type.name);

        if (this.recordMap.has(type.name))
          return {
            ...type,
            type: "TypeConstructor",
            name: type.name,
          };
          
        if (type.name in typeMappings)
          return {
            ...type,
            type: "TypeConstructor",
            name: typeMappings[type.name],
          };

        return type;
      }
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
      case "DataType":
        return {
          ...type,
          fields: type.fields.map((f) => this.mapTypeNodePrimitives(f)),
        };
      default:
        return type;
    }
  }

  private applySubstitution(type: TypeNode, sub: Substitution): TypeNode {
    switch (type.type) {
      case "TypeVar": {
        const typeSub = sub.get(type.name);
        if (!typeSub) return type;
        return this.applySubstitution(typeSub, sub);
      }
      case "TypeConstructor":
        return type;
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

      case "DataType":
        return {
          ...type,
          fields: type.fields.map((field) =>
            this.applySubstitution(field, sub)
          ),
        };

      case "TypeApplication":
        return {
          ...type,
          base: this.applySubstitution(type.base, sub),
          args: type.args.map((arg) => this.applySubstitution(arg, sub)),
        };
      default:
        return type;
    }
  }
}
