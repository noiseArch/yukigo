import { traverse } from "../ast/visitor";

function declaresFunction(ast: object[], functionName: string): boolean {
  let found = false;
  traverse(ast, {
    function(node) {
      if (node.name?.value === functionName) found = true;
    },
  });
  return found;
}

function hasGuards(ast: object[], functionName: string): boolean {
  let found = false;
  traverse(ast, {
    function(node) {
      if (
        node.name?.value === functionName &&
        node.attributes.includes("GuardedBody")
      ) {
        found = true;
      }
    },
  });
  return found;
}

function hasAnonymousVariable(ast: object[], functionName: string): boolean {
  let found = false;
  traverse(ast, {
    function(node) {
      if (
        node.type === "function" &&
        node.name?.value === functionName &&
        node.parameters.some((param) => param.type === "AnonymousPattern")
      ) {
        found = true;
      }
    },
  });
  return found;
}

export { declaresFunction, hasGuards, hasAnonymousVariable };
