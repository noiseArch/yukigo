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

function hasPatternMathing(ast: object[], functionName: string): boolean {
  let found = false;
  traverse(ast, {
    function(node) {
      if (node.name.value === functionName && node.contents.length > 1) {
        found = true;
      }
    },
  });
  return found;
}

function hasGuards(ast: object[], functionName: string): boolean {
  let found = false;
  traverse(ast, {
    function(node) {
      if (
        node.name.value === functionName &&
        node.contents.some((func) => func.attributes.includes("GuardedBody"))
      ) {
        found = true;
      }
    },
  });
  return found;
}
function hasComposition(ast: object[], functionName: string): boolean {
  let found = false;
  traverse(ast, {
    function(node) {
      if (
        node.name.value === functionName &&
        node.contents.some((func) => func.body.type === "CompositionExpression")
      ) {
        found = true;
      }
    },
  });
  return found;
}
function hasLambdaExpression(ast: object[], functionName: string): boolean {
  let found = false;
  traverse(ast, {
    function(node) {
      let hasLambda = false;
      traverse(node, {
        LambdaExpression() {
          hasLambda = true
        },
      });
      if (node.name.value === functionName && hasLambda) {
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
        node.contents.some((func) =>
          func.parameters.some((param) => param.type === "AnonymousPattern")
        )
      ) {
        found = true;
      }
    },
  });
  return found;
}

export {
  declaresFunction,
  hasGuards,
  hasAnonymousVariable,
  hasPatternMathing,
  hasComposition,
  hasLambdaExpression,
};
