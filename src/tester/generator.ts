import { traverse } from "../ast/visitor";

export function generateJS(ast: any): string {
  const output: string[] = [];

  function emit(line: string) {
    output.push(line);
  }

  const visitor = {
    function(node: any) {
      const params = (node.parameters || []).map((p) => p.name).join(", ");
      const body = generateExpression(node.body);
      emit(`const ${node.name.value} = (${params}) => ${body};\n`);
    },
    Record(node: any) {
      const params = (node.parameters || []).map((p) => p.name).join(", ");
      const recordFields = node.contents.map((field) => field.name.value);
      emit(
        `class ${node.name.value} {
  constructor(${recordFields.join(", ")}) {
    ${recordFields
      .map((fieldName) => `this.${fieldName} = ${fieldName};`)
      .join(" ")}
  }
};`
      );
    },
    // Add more node handlers as needed...
  };

  function generateExpression(expr: any): string {
    if (!expr) return "undefined";
    switch (expr.type) {
      case "number":
      case "string":
        return expr.value;
      case "Boolean":
        return expr.value == "True" ? "true" : "false";
      case "symbol":
        return expr.value;
      case "DataExpression":
        // Handle function application
        return `new ${expr.name.value}(${expr.contents
          .map((field) => field.contents.value)
          .join(", ")})`;

      case "application":
        // Handle function application
        if (expr.body) {
          // Multiple arguments
          if (!expr.left)
            return `${expr.body.map(generateExpression).join(", ")}`;
          return `${generateExpression(expr.left)}(${expr.body
            .map(generateExpression)
            .join(", ")})`;
        } else {
          // Single argument
          return `${generateExpression(expr.left)}(${generateExpression(
            expr.right
          )})`;
        }
      case "expression":
        return `${generateExpression(expr.left)} ${
          expr.operator
        } ${generateExpression(expr.right)}`;
      case "if":
        return `(${generateExpression(expr.cond)} ? ${generateExpression(
          expr.then
        )} : ${generateExpression(expr.else)})`;
      case "list":
        return `[${(expr.elements || []).map(generateExpression).join(", ")}]`;
      // Add more cases as needed...
      default:
        return "undefined";
    }
  }

  traverse(ast, visitor);

  return output.join("\n");
}
