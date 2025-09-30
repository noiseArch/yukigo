import {
  Assignment,
  AssignOperation,
  Exist,
  Fact,
  Findall,
  Forall,
  Not,
  Rule,
  traverse,
  UnifyOperation,
} from "yukigo-core";
import { InspectionMap } from "../ast/inspector.js";
import { isYukigoPrimitive } from "yukigo-core";

export const logicInspections: InspectionMap = {
  DeclaresFact: (ast, args, binding) => {
    let declares = false;
    traverse(ast, {
      Fact: (node: Fact) => {
        if (binding === node.identifier.value) {
          declares = true;
          return true;
        }
      },
    });
    return { result: declares };
  },
  DeclaresRule: (ast, args, binding) => {
    let declares = false;
    traverse(ast, {
      Rule: (node: Rule) => {
        if (binding === node.identifier.value) {
          declares = true;
          return true;
        }
      },
    });
    return { result: declares };
  },
  DeclaresPredicate: (ast, args, binding) => {
    const resultFact = logicInspections.DeclaresFact(ast, args, binding);
    const resultRule = logicInspections.DeclaresRule(ast, args, binding);
    return { result: resultFact.result || resultRule.result };
  },
  UsesFindall: (ast, args, binding) => {
    let declares = false;
    traverse(ast, {
      Findall: (node: Findall) => {
        declares = true;
        return true;
      },
    });
    return { result: declares };
  },
  UsesForall: (ast, args) => {
    let declares = false;
    traverse(ast, {
      Forall: (node: Forall) => {
        declares = true;
        return true;
      },
    });
    return { result: declares };
  },
  UsesNot: (ast, args) => {
    let declares = false;
    traverse(ast, {
      Not: (node: Not) => {
        declares = true;
        return true;
      },
    });
    return { result: declares };
  },
  UsesUnificationOperator: (ast, args, binding) => {
    let uses = false;
    if (binding) {
      traverse(ast, {
        Fact: (node: Fact) => {
          if (node.identifier.value === binding) {
            traverse(ast, {
              UnifyOperation: (node: UnifyOperation) => {
                uses = true;
                return true;
              },
            });
          }
          if (uses) return true;
        },
        Rule: (node: Rule) => {
          if (node.identifier.value === binding) {
            traverse(ast, {
              UnifyOperation: (node: UnifyOperation) => {
                uses = true;
                return true;
              },
            });
          }
          if (uses) return true;
        },
      });
    } else {
      traverse(ast, {
        UnifyOperation: (node: UnifyOperation) => {
          uses = true;
          return true;
        },
      });
    }
    return { result: uses };
  },
  UsesCut: (ast, args, binding) => {
    let uses = false;
    if (binding) {
      traverse(ast, {
        Fact: (node: Fact) => {
          if (node.identifier.value === binding) {
            traverse(ast, {
              Exist: (cut: Exist) => {
                if (cut.identifier.value === "!") {
                  uses = true;
                  return true;
                }
              },
            });
          }
          if (uses) return true;
        },
        Rule: (node: Rule) => {
          if (node.identifier.value === binding) {
            traverse(ast, {
              Exist: (cut: Exist) => {
                if (cut.identifier.value === "!") {
                  uses = true;
                  return true;
                }
              },
            });
          }
          if (uses) return true;
        },
      });
    } else {
      traverse(ast, {
        Exist: (cut: Exist) => {
          if (cut.identifier.value === "!") {
            uses = true;
            return true;
          }
        },
      });
    }
    return { result: uses };
  },
  UsesFail: (ast, args, binding) => {
    let uses = false;
    if (binding) {
      traverse(ast, {
        Fact: (node: Fact) => {
          if (node.identifier.value === binding) {
            traverse(ast, {
              Exist: (cut: Exist) => {
                if (cut.identifier.value === "fail") {
                  uses = true;
                  return true;
                }
              },
            });
          }
          if (uses) return true;
        },
        Rule: (node: Rule) => {
          if (node.identifier.value === binding) {
            traverse(ast, {
              Exist: (cut: Exist) => {
                if (cut.identifier.value === "fail") {
                  uses = true;
                  return true;
                }
              },
            });
          }
          if (uses) return true;
        },
      });
    } else {
      traverse(ast, {
        Exist: (cut: Exist) => {
          if (cut.identifier.value === "fail") {
            uses = true;
            return true;
          }
        },
      });
    }
    return { result: uses };
  },
  HasRedundantReduction: (ast, args, binding) => {
    let hasRedundantReduction = false;
    traverse(ast, {
      Rule: (node: Rule) => {
        // Only inspect the specified rule if a binding is provided
        if (binding && node.identifier.value !== binding) {
          return;
        }

        // Check each unification in the rule's body
        for (const bodyElement of node.expressions) {
          if (bodyElement.body.type === "AssignOperation") {
            const unification = bodyElement.body;
            const left = unification.left.body;
            const right = unification.right.body;

            // Check if reduction is redundant
            const isRedundant =
              // Redundant reduction of parameters (X is Y)
              (left.type === "YuSymbol" && right.type === "YuSymbol") ||
              // Redundant reduction of literals (X is 5)
              (left.type === "YuSymbol" && isYukigoPrimitive(right.type)) ||
              // Redundant reduction of functors (Z is aFunctor(5))
              (left.type === "YuSymbol" && right.type === "Exist");

            if (isRedundant) {
              hasRedundantReduction = true;
              return true; // Stop traversing once a redundant reduction is found
            }
          }
        }
      },
    });
    return { result: hasRedundantReduction };
  },
};
