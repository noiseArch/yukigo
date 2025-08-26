import { Project, SourceFile } from "ts-morph";
import {
  AST,
  ArithmeticOperation,
  Function,
  TypeSignature,
  LiteralPattern,
  SymbolPrimitive,
  NumberPrimitive,
  Application,
  Type,
  VariablePattern,
  StringPrimitive,
  BooleanPrimitive,
  CharPrimitive,
  //ConcatOperation,
  Primitive,
  ListPrimitive,
  traverse,
  TypeAlias,
  Record as RecordNode,
  DataExpression,
  Lambda,
  If,
  ComparisonOperation,
  InfixApplicationExpression,
  CompositionExpression,
  Equation,
} from "yukigo-core";

export class Translator {
  private ast: AST;
  private project: Project;
  private sourceFile: SourceFile;
  private recordSignature: Map<string, RecordNode> = new Map();
  private typeSignatures: Map<string, TypeSignature> = new Map();

  constructor(ast: AST) {
    this.ast = ast;
    this.project = new Project({ useInMemoryFileSystem: true });
    this.sourceFile = this.project.createSourceFile("output.ts", "", {
      overwrite: true,
    });
  }

  public translate(): string {
    traverse(this.ast, {
      TypeAlias: (node: TypeAlias) => {
        this.sourceFile.addTypeAlias({
          name: node.identifier.value,
          type: this.translateTypeNode(node.value),
        });
      },
      Record: (node: RecordNode) => {
        node.contents.forEach((constructor) => {
          this.recordSignature.set(constructor.name, {
            type: "Record",
            name: node.name,
            contents: [constructor],
          });
          this.sourceFile.addInterface({
            name: node.name.value,
            properties: constructor.fields.map((field) => ({
              name: field.name.value,
              type: this.translateTypeNode(field.value),
            })),
          });
          this.sourceFile.addClass({
            name: constructor.name,
            implements: [node.name.value],
            properties: constructor.fields.map((field) => ({
              name: field.name.value,
              type: this.translateTypeNode(field.value),
            })),
            ctors: [
              {
                parameters: constructor.fields.map((field) => ({
                  name: field.name.value,
                  type: this.translateTypeNode(field.value),
                })),
                statements: constructor.fields.map(
                  (field) => `this.${field.name.value} = ${field.name.value}`
                ),
              },
            ],
          });
        });
      },
      TypeSignature: (node: TypeSignature) => {
        this.typeSignatures.set(node.identifier.value, node);
      },
      function: (node: Function) => {
        const functionName = node.identifier.value;
        const signature = this.typeSignatures.get(functionName);
        if (!signature) {
          throw new Error(
            `Missing type signature for function: ${functionName}`
          );
        }

        const genericClause =
          node.equations.find((c) =>
            c.patterns.every((p) => p.type === "VariablePattern")
          ) || node.equations[node.equations.length - 1];
        const paramNames = genericClause.patterns.map((p, i) =>
          p.type === "WildcardPattern" ? `p${i}` : this.translateNode(p)
        );
        const func = this.sourceFile.addFunction({
          name: functionName,
        });
        if (signature.body.type === "ParameterizedType") {
          signature.body.inputs.forEach((type, i) => {
            func.addParameter({
              name: paramNames[i],
              type: this.translateTypeNode(type),
            });
          });
          func.setReturnType(this.translateTypeNode(signature.body.return));
        } else if (signature.body.type === "SimpleType" || signature.body.type === "TupleType") {
          func.setReturnType(this.translateTypeNode(signature.body));
        }

        node.equations.forEach((clause) => {
          // The general case (VariablePattern) acts as the final 'else'
          if (
            clause.patterns.every(
              (p) =>
                p.type === "VariablePattern" || p.type === "WildcardPattern"
            )
          ) {
            if (!Array.isArray(clause.body)) {
              if (clause.body.expression.body.type === "If") {
                const body = this.translateNode(clause.body);
                func.addStatements(`${body};`);
              } else {
                const body = this.translateNode(clause.body);
                func.addStatements(`return ${body};`);
              }
            }
          } else {
            // Specific literal patterns become 'if' statements
            const condition = this.buildCondition(clause, paramNames);
            const body = this.translateNode(clause.body);
            func.addStatements(`if (${condition}) {\n    return ${body};\n}`);
          }
        });
      },
    });
    this.sourceFile.formatText();
    return this.sourceFile.getFullText();
  }

  private translateNode(node: any): string {
    if (!node || !node.type) return "";

    switch (node.type) {
      case "Expression":
        return this.translateNode(node.body);
      case "Arithmetic":
        return this.translateArithmetic(node as ArithmeticOperation);
      case "InfixApplication":
        return this.translateInfixApplication(
          node as InfixApplicationExpression
        );
      case "Application":
        return this.translateApplication(node as Application);
      case "CompositionExpression":
        return this.translateCompositionExpression(
          node as CompositionExpression
        );
      case "DataExpression":
        return this.translateDataExpression(node as DataExpression);
      case "LambdaExpression":
        return this.translateLambdaExpression(node as Lambda);
      case "IfThenElse":
        return this.translateIfThenElse(node as If);
      //case "Concat":
      //  return this.translateConcat(node as ConcatOperation);
      case "Comparison":
        return this.translateComparison(node as ComparisonOperation);
      case "YuSymbol":
      case "YuNumber":
      case "YuString":
      case "YuChar":
      case "YuBoolean":
      case "YuList":
        return this.translateYuPrimitive(node as Primitive);
      case "LiteralPattern":
        return this.translateNode((node as LiteralPattern).name);
      case "VariablePattern":
        return this.translateNode((node as VariablePattern).name);
      default:
        console.warn(`Unknown node type: ${node.type}`);
        return "";
    }
  }

  private buildCondition(clause: Equation, paramNames: string[]): string {
    const conditions: string[] = [];
    clause.patterns.forEach((param, i) => {
      if (param.type === "LiteralPattern") {
        const literalValue = this.translateNode(param.name);
        conditions.push(`${paramNames[i]} === ${literalValue}`);
      }
    });
    return conditions.join(" && ");
  }

  private translateTypeNode(typeNode: Type): string {
    switch (typeNode.type) {
      case "SimpleType":
        switch (typeNode.value) {
          case "Double":
          case "Float":
          case "Int":
            return "number";
          case "Char":
          case "String":
            return "string";
          case "Bool":
          case "Boolean":
            return "boolean";
          default:
            return typeNode.value;
        }
      case "ParameterizedType":
        return `(${typeNode.inputs
          .map((type, i) => `p${i}: ${this.translateTypeNode(type)}`)
          .join(", ")}) => ${this.translateTypeNode(typeNode.return)}`;

      default:
        return "any";
    }
  }

  private translateDataExpression(node: DataExpression) {
    return `new ${node.name.value}(${node.contents
      .map((field) => this.translateNode(field.expression))
      .join(", ")})`;
  }

  private translateLambdaExpression(node: Lambda) {
    return `((${node.parameters
      .map((p) => this.translateNode(p))
      .join(", ")}) => ${this.translateNode(node.body)})`;
  }

  private translateIfThenElse(node: If) {
    let IfStatement = `if (${this.translateNode(
      node.condition.body
    )}) {\n    return ${this.translateNode(node.then.body)};\n}`;
    if (node.else)
      IfStatement += `else {\n return ${this.translateNode(
        node.else.body
      )};\n}`;
    return IfStatement;
  }

  private translateArithmetic(node: ArithmeticOperation): string {
    const left = this.translateNode(node.left);
    const right = this.translateNode(node.right);
    return `${left} ${node.operator} ${right}`;
  }
  private translateComparison(node: ComparisonOperation): string {
    const left = this.translateNode(node.left);
    const right = this.translateNode(node.right);
    return `${left} ${node.operator} ${right}`;
  }
  //private translateConcat(node: ConcatOperation): string {
  //  const left = this.translateNode(node.left);
  //  const right = this.translateNode(node.right);
  //  return `${left} + ${right}`;
  //}

  private translateCompositionExpression(node: CompositionExpression): string {
    const left = this.translateNode(node.left);
    const right = this.translateNode(node.right);
    return `${left}(${right})`;
  }

  private translateApplication(node: Application): string {
    const args: string[] = [];
    let current: any = node;

    // handle nested/curried application
    while (current && current.type === "Application") {
      args.unshift(this.translateNode(current.parameter));
      current = current.function.body;
    }

    const functionName = this.translateNode(current);

    const isConstructor = this.recordSignature.has(functionName);

    const call = `${functionName}(${args.join(", ")})`;
    return isConstructor ? `new ${call}` : call;
  }
  private translateInfixApplication(node: InfixApplicationExpression): string {
    const left = node.left;
    const right = node.right;
    const op = node.operator;

    return `${this.translateNode(op)}(${this.translateNode(
      left
    )}, ${this.translateNode(right)})`;
  }

  private translateYuPrimitive(node: Primitive): string {
    if (node.type == "YuList")
      return `[${node.elements
        .map((el) => this.translateNode(el))
        .join(", ")}]`;
    if (node.type === "YuBoolean")
      return node.value === "True" ? "true" : "false";
    return node.value.toString();
  }
}
