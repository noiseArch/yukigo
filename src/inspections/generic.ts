import {
  AST,
  Attribute,
  EntryPoint,
  Fact,
  Function,
  Method,
  Procedure,
  Record as RecordNode,
  Rule,
  traverse,
  TypeAlias,
  TypeSignature,
  Variable,
} from "yukigo-core";
import { InspectionMap } from "../ast/inspector.js";

const declaresComputationWithArity = (
  ast: AST,
  binding: string,
  arity: number
) => {
  let declares = false;
  traverse(ast, {
    Method: (node: Method) => {
      if (
        node.identifier.value === binding &&
        node.equations.every((eq) => eq.patterns.length === arity)
      ) {
        declares = true;
        return true;
      }
    },
    Function: (node: Function) => {
      if (
        node.identifier.value === binding &&
        node.equations.every((eq) => eq.patterns.length === arity)
      ) {
        declares = true;
        return true;
      }
    },
    Rule: (node: Rule) => {
      if (node.identifier.value === binding && node.patterns.length === arity) {
        declares = true;
        return true;
      }
    },
    Fact: (node: Fact) => {
      if (node.identifier.value === binding && node.patterns.length === arity) {
        declares = true;
        return true;
      }
    },
    Procedure: (node: Procedure) => {
      if (
        node.identifier.value === binding &&
        node.expressions.every((expr) => expr.patterns.length === arity)
      ) {
        declares = true;
        return true;
      }
    },
  });
  return declares;
};

export const genericInspections: InspectionMap = {
  Assigns: (ast, args) => {
    const bindingName = args[0];
    let found = false;
    traverse(ast, {
      Variable: (node: Variable) => {
        if (node.identifier.value === bindingName) {
          found = true;
          return true;
        }
      },
      Attribute: (node: Attribute) => {
        if (node.identifier.value === bindingName) {
          found = true;
          return true;
        }
      },
    });
    return {
      result: found,
    };
  },
  Calls: (ast, args) => {
    const callName = args[0];
    let uses = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (node.identifier.value === callName) {
          uses = true;
          return true;
        }
      },
      Method: (node: Method) => {
        if (node.identifier.value === callName) {
          uses = true;
          return true;
        }
      },
      Procedure: (node: Procedure) => {
        if (node.identifier.value === callName) {
          uses = true;
          return true;
        }
      },
    });
    return {
      result: uses,
    };
  },
  Declares: (ast, args) => {
    const elementName = args[0];
    let declares = false;
    traverse(ast, {
      "*": (node: any) => {
        if (node.identifier.value === elementName) {
          declares = true;
          return true;
        }
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresComputation: (ast, args) => {
    const elementName = args[0];
    let declares = false;
    traverse(ast, {
      "Method, Rule, Fact, Function, Procedure": (
        node: Method | Rule | Fact | Function | Procedure
      ) => {
        if (node.identifier.value === elementName) {
          declares = true;
          return true;
        }
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresComputationWithArity0: (ast, args, binding) => {
    return {
      result: declaresComputationWithArity(ast, binding, 0),
    };
  },
  DeclaresComputationWithArity1: (ast, args, binding) => {
    return {
      result: declaresComputationWithArity(ast, binding, 1),
    };
  },
  DeclaresComputationWithArity2: (ast, args, binding) => {
    return {
      result: declaresComputationWithArity(ast, binding, 2),
    };
  },
  DeclaresComputationWithArity3: (ast, args, binding) => {
    return {
      result: declaresComputationWithArity(ast, binding, 3),
    };
  },
  DeclaresComputationWithArity4: (ast, args, binding) => {
    return {
      result: declaresComputationWithArity(ast, binding, 4),
    };
  },
  DeclaresComputationWithArity5: (ast, args, binding) => {
    return {
      result: declaresComputationWithArity(ast, binding, 5),
    };
  },
  DeclaresComputationWithArity: (ast, args, binding) => {
    const arity = Number(args[0]);
    return {
      result: declaresComputationWithArity(ast, binding, arity),
    };
  },
  DeclaresEntryPoint: (ast, args) => {
    let declares = false;
    traverse(ast, {
      Entrypoint: (node: EntryPoint) => {
        declares = true;
        return true;
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresFunction: (ast, args) => {
    const functionName = args[0];
    let declares = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (node.identifier.value === functionName) {
          declares = true;
          return true;
        }
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresRecursively: (ast, args) => {
    const computationName = args[0];
    let declares = false;
    traverse(ast, {
      "Method, Function, Rule, Fact, Procedure": (
        node: Method | Function | Rule | Fact
      ) => {
        if (node.identifier.value === computationName) {
          traverse(node, {
            "*": (node2) => {
              if (
                "identifier" in node2 &&
                node2.identifier.value === computationName
              ) {
                declares = true;
                return true;
              }
            },
          });
          if (declares) return true;
        }
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresTypeAlias: (ast, args) => {
    const typeAliasName = args[0];
    let declares = false;
    traverse(ast, {
      TypeAlias: (node: TypeAlias) => {
        if (node.identifier.value === typeAliasName) {
          declares = true;
          return true;
        }
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresTypeSignature: (ast, args) => {
    const typeSignName = args[0];
    let declares = false;
    traverse(ast, {
      TypeSignature: (node: TypeSignature) => {
        if (node.identifier.value === typeSignName) {
          declares = true;
          return true;
        }
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresVariable: (ast, args) => {
    const variableName = args[0];
    let declares = false;
    traverse(ast, {
      Variable: (node: Variable) => {
        if (node.identifier.value === variableName) {
          declares = true;
          return true;
        }
      },
    });
    return {
      result: declares,
    };
  },
  Delegates: (ast, args) => {
    const declares = genericInspections.Declares(ast, args);
    const calls = genericInspections.Calls(ast, args);
    return { result: declares.result && calls.result };
  },
  Raises: (ast, args) => {
    throw Error("Inspection not implemented");
  },
  Rescues: (ast, args) => {
    throw Error("Inspection not implemented");
  },
  SubordinatesDeclarationsTo: (ast, args) => {
    throw Error("Inspection not implemented");
  },
  SubordinatesDeclarationsToEntryPoint: (ast, args) => {
    throw Error("Inspection not implemented");
  },
  TypesAs: (ast, args) => {
    throw Error("Inspection not implemented");
  },
  TypesParameterAs: (ast, args) => {
    throw Error("Inspection not implemented");
  },
  TypesReturnAs: (ast, args) => {
    throw Error("Inspection not implemented");
  },
  Uses: (ast, args, binding) => {
    const usageName = args[0];
    let uses = false;

    const usesFunc = (node) => {
      if (node.identifier.value === binding) {
        traverse(node, {
          YuSymbol: (symbolNode) => {
            if ("value" in symbolNode && symbolNode.value === usageName) {
              uses = true;
              return true;
            }
          },
        });
        if (uses) return true;
      }
    };
    if (binding) {
      traverse(ast, {
        Function: (node: Function) => usesFunc(node),
        Method: (node: Method) => usesFunc(node),
        Rule: (node: Rule) => usesFunc(node),
        Procedure: (node: Procedure) => usesFunc(node),
      });
    } else {
      traverse(ast, {
        YuSymbol: (symbolNode) => {
          if ("value" in symbolNode && symbolNode.value === usageName) {
            uses = true;
            return true;
          }
        },
      });
    }
    return {
      result: uses,
    };
  },
  UsesArithmetic: (ast, args) => {
    const functionName = args[0];
    let hasArithmetic = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (node.identifier.value === functionName) {
          traverse(node, {
            Arithmetic() {
              hasArithmetic = true;
              return true;
            },
          });
          if (hasArithmetic) return true;
        }
      },
    });
    return {
      result: hasArithmetic,
    };
  },
  UsesConditional: (ast, args) => {
    const functionName = args[0];
    let hasConditional = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (node.identifier.value === functionName) {
          traverse(node, {
            If() {
              hasConditional = true;
              return true;
            },
          });
          if (hasConditional) return true;
        }
      },
    });
    return {
      result: hasConditional,
    };
  },
  UsesExceptionHandling: (ast, args) => {
    throw Error("Inspection not implemented");
  },
  UsesExceptions: (ast, args) => {
    throw Error("Inspection not implemented");
  },
  UsesIf: (ast, args) => {
    const functionName = args[0];
    let hasIf = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (node.identifier.value === functionName) {
          traverse(node, {
            If() {
              hasIf = true;
              return true;
            },
          });
          if (hasIf) return true;
        }
      },
    });
    return {
      result: hasIf,
    };
  },
  UsesLogic: (ast, args) => {
    const functionName = args[0];
    let usesLogic = false;
    traverse(ast, {
      "Method, Function, Procedure": (node: Method | Function | Procedure) => {
        if (node.identifier.value === functionName) {
          traverse(node, {
            LogicalOperation() {
              usesLogic = true;
              return true;
            },
          });
          if (usesLogic) return true;
        }
      },
    });
    return {
      result: usesLogic,
    };
  },
  UsesMath: (ast, args) => {
    const functionName = args[0];
    let hasMath = false;
    traverse(ast, {
      "Method, Function, Procedure": (node: Method | Function | Procedure) => {
        if (node.identifier.value === functionName) {
          traverse(node, {
            Arithmetic() {
              hasMath = true;
              return true;
            },
          });
          if (hasMath) return true;
        }
      },
    });
    return {
      result: hasMath,
    };
  },
  UsesPrint: (ast, args) => {
    const functionName = args[0];
    let usesPrint = false;
    traverse(ast, {
      "Method, Function, Procedure": (node: Method | Function | Procedure) => {
        if (node.identifier.value === functionName) {
          traverse(node, {
            Print() {
              usesPrint = true;
              return true;
            },
          });
          if (usesPrint) return true;
        }
      },
    });
    return {
      result: usesPrint,
    };
  },
  UsesType: (ast, args) => {
    const typeName = args[0];
    let usesType = false;
    traverse(ast, {
      TypeSignature: (node: TypeSignature) => {
        traverse(node, {
          "*"() {
            if (node.identifier.value === typeName) {
              usesType = true;
              return true;
            }
          },
        });
        if (usesType) return true;
      },
    });
    return {
      result: usesType,
    };
  },
  HasBinding: (ast, args) => {
    const bindingName = args[0];
    let found = false;
    traverse(ast, {
      "Function, TypeAlias, TypeSignature": (
        node: Function | TypeAlias | TypeSignature
      ) => {
        if (node.identifier.value === bindingName) {
          found = true;
          return true;
        }
      },
      Record: (node: RecordNode) => {
        if (node.name.value === bindingName) {
          found = true;
          return true;
        }
      },
    });
    return {
      result: found,
    };
  },
};
