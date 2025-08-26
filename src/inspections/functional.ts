import { Fact, For, Function, Rule, traverse, Yield } from "yukigo-core";
import { InspectionMap } from "../ast/inspector.js";

export const functionalInspections: InspectionMap = {
  UsesAnonymousVariable: (ast, args, binding) => {
    let usesAnonymous = false;

    const usesAnonymousVariable = (node: Function | Fact | Rule) => {
      if (node.identifier.value === binding) {
        traverse(node, {
          WildcardPattern() {
            usesAnonymous = true;
            return true;
          },
        });
        if (usesAnonymous) return true;
      }
    };
    if (binding) {
      traverse(ast, {
        Function: (node: Function) => usesAnonymousVariable(node),
        Fact: (node: Fact) => usesAnonymousVariable(node),
        Rule: (node: Rule) => usesAnonymousVariable(node),
      });
    } else {
      traverse(ast, {
        WildcardPattern() {
          usesAnonymous = true;
          return true;
        },
      });
    }
    return {
      result: usesAnonymous,
    };
  },
  UsesComposition: (ast, args, binding) => {
    let hasComposition = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (node.identifier.value === binding) {
          traverse(node, {
            CompositionExpression() {
              hasComposition = true;
              return true;
            },
          });
          if (hasComposition) return true;
        }
      },
    });
    return {
      result: hasComposition,
    };
  },
  UsesForComprehension: (ast, args, binding) => {
    let uses = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (binding && node.identifier.value !== binding) {
          return;
        }
        traverse(node, {
          For: () => {
            uses = true;
            return true;
          },
        });
      },
    });
    return {
      result: uses,
    };
  },
  UsesGuards: (ast, args, binding) => {
    let usesGuards = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (node.identifier.value === binding) {
          for (const content of node.equations) {
            if (Array.isArray(content.body)) {
              usesGuards = true;
              return true;
            }
          }
        }
      },
    });
    return {
      result: usesGuards,
    };
  },

  UsesLambda: (ast, args, binding) => {
    let hasLambdaExpression = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (node.identifier.value === binding) {
          traverse(node, {
            Lambda() {
              hasLambdaExpression = true;
              return true;
            },
          });
          if (hasLambdaExpression) return true;
        }
      },
    });
    return {
      result: hasLambdaExpression,
    };
  },
  UsesYield: (ast, args, binding) => {
    let uses = true;
    traverse(ast, {
      Yield: (node: Yield) => {
        uses = true;
        return true;
      },
    });
    return {
      result: uses,
    };
  },
  UsesPatternMatching: (ast, args, binding) => {
    let hasPatternMathing = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (binding && node.identifier.value !== binding) return;

        hasPatternMathing = node.equations.some((eq) =>
          eq.patterns.some((pattern) => pattern.type !== "VariablePattern")
        );
        if (hasPatternMathing) return true;
      },
    });
    return {
      result: hasPatternMathing,
    };
  },
};
