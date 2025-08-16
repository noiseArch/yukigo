import { For, Function, traverse, Yield } from "yukigo-core";
import { InspectionMap } from "../ast/inspector.js";

export const functionalInspections: InspectionMap = {
  UsesAnonymousVariable: (ast, args) => {
    const functionName = args.name;
    let usesAnonymous = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (node.identifier.value === functionName) {
          traverse(node, {
            WildcardPattern() {
              usesAnonymous = true;
            },
          });
        }
      },
    });
    return {
      result: usesAnonymous,
    };
  },
  UsesComposition: (ast, args) => {
    const functionName = args.name;
    let hasComposition = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (node.identifier.value === functionName) {
          traverse(node, {
            CompositionExpression() {
              hasComposition = true;
            },
          });
        }
      },
    });
    return {
      result: hasComposition,
    };
  },
  UsesForComprehension: (ast, args) => {
    let uses = true;
    traverse(ast, {
      For: (node: For) => {
        uses = true;
      },
    });
    return {
      result: uses,
    };
  },
  UsesGuards: (ast, args) => {
    const functionName = args.name;
    let usesGuards = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (node.identifier.value === functionName) {
          for (const content of node.equations) {
            if (Array.isArray(content.body)) {
              usesGuards = true;
              break;
            }
          }
        }
      },
    });
    return {
      result: usesGuards,
    };
  },

  UsesLambda: (ast, args) => {
    const functionName = args.name;
    let hasLambdaExpression = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (node.identifier.value === functionName) {
          traverse(node, {
            Lambda() {
              hasLambdaExpression = true;
            },
          });
        }
      },
    });
    return {
      result: hasLambdaExpression,
    };
  },
  UsesYield: (ast, args) => {
    let uses = true;
    traverse(ast, {
      Yield: (node: Yield) => {
        uses = true;
      },
    });
    return {
      result: uses,
    };
  },
  HasPatternMathing: (ast, args) => {
    const functionName = args.name;
    let hasPatternMathing = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (
          node.identifier.value === functionName &&
          node.equations.length > 1
        ) {
          hasPatternMathing = true;
        }
      },
    });
    return {
      result: hasPatternMathing,
    };
  },
};
