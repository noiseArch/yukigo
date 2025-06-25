import { traverse } from "./visitor";

function mapType(typeNode: any): string {
  if (!typeNode) return "any";
  if (typeNode.type === "symbol") {
    switch (typeNode.name || typeNode.value) {
      case "Int":
      case "Double":
      case "Float":
        return "number";
      case "String":
        return "string";
      case "Bool":
        return "boolean";
      case "Char":
        return "string";
      default:
        return typeNode.name || typeNode.value;
    }
  }
  return "any";
}

function patternToCondition(pattern: any, argName: string): string | null {
  switch (pattern.type) {
    case "LiteralPattern":
      return `${argName} === ${pattern.name}`;
    case "VariablePattern":
      return null;
    case "WildcardPattern":
      return null;
    default:
      return null;
  }
}

function expressionToTs(expr: any): string {
  if (!expr) return "undefined";
  switch (expr.type) {
    case "number":
      return expr.value;
    case "string":
      return expr.value;
    case "Boolean":
      return expr.value.value === "True" ? "true" : "false";
    case "symbol":
      return expr.value;
    case "Arithmetic":
      return `${expressionToTs(expr.left)} ${expr.operator} ${expressionToTs(
        expr.right
      )}`;
    case "concatenation":
      return `${expressionToTs(expr.left)} + ${expressionToTs(expr.right)}`;
    case "list":
      return `[${(expr.elements || []).map(expressionToTs).join(", ")}]`;
    case "DataExpression":
      return `new ${expr.name.value}({ ${expr.contents
        .map((f: any) => `${f.name.value}: ${expressionToTs(f.contents)}`)
        .join(", ")} })`;
    case "FieldExpression":
      return expressionToTs(expr.contents);
    case "application":
      if (expr.body) {
        const [fn, ...args] = expr.body;
        return `${expressionToTs(fn)}(${args.map(expressionToTs).join(", ")})`;
      } else if (expr.left && expr.right) {
        return `${expressionToTs(expr.left)}(${expressionToTs(expr.right)})`;
      }
      break;
    case "if":
      return `(${expressionToTs(expr.cond)} ? ${expressionToTs(
        expr.then
      )} : ${expressionToTs(expr.else)})`;
    case "comparison":
      return `${expressionToTs(expr.left)} ${
        expr.operator || "==="
      } ${expressionToTs(expr.right)}`;
    case "infix_application":
      return `${expressionToTs(expr.left)} ${expr.operator} ${expressionToTs(
        expr.right
      )}`;
    default:
      return "undefined";
  }
}

export function astToTypescript(ast: ASTNode): string {
  let typeAliases: string[] = [];
  let records: string[] = [];
  let functions: { [name: string]: any[] } = {};
  let signatures: { [name: string]: { params: string[]; ret: string } } = {};

  traverse(ast, {
    TypeAlias(node) {
      const name = node.name.value;
      const typeParams = node.typeParameters?.map(mapType).join(", ") || "";
      typeAliases.push(`type ${name} = ${typeParams};`);
    },
    Record(node) {
      const name = node.name.value;
      const fields = node.contents
        .map((f: any) => `${f.name.value}: ${mapType(f.contents[0])};`)
        .join("\n  ");
      const ctorParams = node.contents
        .map((f: any) => `${f.name.value}: ${mapType(f.contents[0])}`)
        .join(", ");
      const assignments = node.contents
        .map((f: any) => `this.${f.name.value} = params.${f.name.value};`)
        .join("\n    ");
      records.push(
        `class ${name} {\n  ${fields}\n  constructor(params: {${ctorParams}}) {\n    ${assignments}\n  }\n}`
      );
    },
    TypeSignature(node) {
      const name = node.name.value;
      const params = (node.inputTypes || []).map(mapType);
      const ret = mapType(node.returnType);
      signatures[name] = { params, ret };
    },
    function(node) {
      const name = node.name.value;
      if (!functions[name]) functions[name] = [];
      functions[name].push(...node.contents);
    },
  });
  const functionStrings: string[] = [];
  for (const [name, clauses] of Object.entries(functions)) {
    const sig = signatures[name] || { params: [], ret: "any" };
    const paramNames = sig.params.map((_, i) => `arg${i}`);

    if (clauses.length === 1 && !Array.isArray(clauses[0].body)) {
      // Simple function
      const node = clauses[0];
      const params = (node.parameters || [])
        .map((p: any, i: number) => p.name || `arg${i}`)
        .join(", ");
      functionStrings.push(
        `export function ${name}(${params}): ${
          sig.ret
        } { return ${expressionToTs(node.body)}; }`
      );
    } else {
      // Pattern matching and/or guards
      let body = "";
      for (const clause of clauses) {
        // Guarded body (array of guards)
        if (Array.isArray(clause.body)) {
          for (const guardClause of clause.body) {
            let guardCond = "";
            if (guardClause.guard.value === "otherwise") {
              guardCond = null;
            } else if (guardClause.guard.type === "symbol") {
              guardCond = guardClause.guard.value;
            } else {
              guardCond = expressionToTs(guardClause.guard);
            }
            body += guardCond
              ? `if (${guardCond}) return ${expressionToTs(
                  guardClause.body
                )};\n`
              : `return ${expressionToTs(clause.body)};\n`;
          }
        } else {
          // Pattern matching
          const cond = (clause.parameters || [])
            .map((p: any, i: number) => patternToCondition(p, paramNames[i]))
            .filter(Boolean)
            .join(" && ");
          body += cond
            ? `if (${cond}) return ${expressionToTs(clause.body)};\n`
            : `return ${expressionToTs(clause.body)};\n`;
        }
      }
      functionStrings.push(
        `export function ${name}(${paramNames.join(", ")}): ${
          sig.ret
        } {\n${body}\n}`
      );
    }
  }

  return [...typeAliases, ...records, ...functionStrings].join("\n\n");
}
