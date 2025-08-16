import {
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

export const genericInspections: InspectionMap = {
  Assigns: (ast, args) => {
    const bindingName = args.name;
    let found = false;
    traverse(ast, {
      "Variable, Attribute": (node: Variable | Attribute) => {
        if (node.identifier.value === bindingName) {
          found = true;
        }
      },
    });
    return {
      result: found,
    };
  },
  Calls: (ast, args) => {
    const callName = args.call;
    let uses = false;
    traverse(ast, {
      "Function, Method, Procedure": (node: Function | Method | Procedure) => {
        if (node.identifier.value === callName) {
          uses = true;
        }
      },
    });
    return {
      result: uses,
    };
  },
  Declares: (ast, args) => {
    const elementName = args.usage;
    let declares = false;
    traverse(ast, {
      "*": (node: any) => {
        if (node.identifier.value === elementName) {
          declares = true;
        }
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresComputation: (ast, args) => {
    const elementName = args.usage;
    let declares = false;
    traverse(ast, {
      "Method, Rule, Fact, Function, Procedure": (
        node: Method | Rule | Fact | Function | Procedure
      ) => {
        if (node.identifier.value === elementName) {
          declares = true;
        }
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresComputationWithArity0: (ast, args) => {
    const elementName = args.usage;
    let declares = false;
    traverse(ast, {
      "Method, Function": (node: Method | Function) => {
        if (
          node.identifier.value === elementName &&
          node.equations.every((eq) => eq.patterns.length === 0)
        ) {
          declares = true;
        }
      },
      "Rule, Fact": (node: Rule | Fact) => {
        if (
          node.identifier.value === elementName &&
          node.patterns.length === 0
        ) {
          declares = true;
        }
      },
      Procedure: (node: Procedure) => {
        if (
          node.identifier.value === elementName &&
          node.expressions.every((expr) => expr.patterns.length === 0)
        ) {
          declares = true;
        }
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresComputationWithArity1: (ast, args) => {
    const elementName = args.usage;
    let declares = false;
    traverse(ast, {
      "Method, Function": (node: Method | Function) => {
        if (
          node.identifier.value === elementName &&
          node.equations.every((eq) => eq.patterns.length === 1)
        ) {
          declares = true;
        }
      },
      "Rule, Fact": (node: Rule | Fact) => {
        if (
          node.identifier.value === elementName &&
          node.patterns.length === 1
        ) {
          declares = true;
        }
      },
      Procedure: (node: Procedure) => {
        if (
          node.identifier.value === elementName &&
          node.expressions.every((expr) => expr.patterns.length === 1)
        ) {
          declares = true;
        }
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresComputationWithArity2: (ast, args) => {
    const elementName = args.usage;
    let declares = false;
    traverse(ast, {
      "Method, Function": (node: Method | Function) => {
        if (
          node.identifier.value === elementName &&
          node.equations.every((eq) => eq.patterns.length === 2)
        ) {
          declares = true;
        }
      },
      "Rule, Fact": (node: Rule | Fact) => {
        if (
          node.identifier.value === elementName &&
          node.patterns.length === 2
        ) {
          declares = true;
        }
      },
      Procedure: (node: Procedure) => {
        if (
          node.identifier.value === elementName &&
          node.expressions.every((expr) => expr.patterns.length === 2)
        ) {
          declares = true;
        }
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresComputationWithArity3: (ast, args) => {
    const elementName = args.usage;
    let declares = false;
    traverse(ast, {
      "Method, Function": (node: Method | Function) => {
        if (
          node.identifier.value === elementName &&
          node.equations.every((eq) => eq.patterns.length === 3)
        ) {
          declares = true;
        }
      },
      "Rule, Fact": (node: Rule | Fact) => {
        if (
          node.identifier.value === elementName &&
          node.patterns.length === 3
        ) {
          declares = true;
        }
      },
      Procedure: (node: Procedure) => {
        if (
          node.identifier.value === elementName &&
          node.expressions.every((expr) => expr.patterns.length === 3)
        ) {
          declares = true;
        }
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresComputationWithArity4: (ast, args) => {
    const elementName = args.usage;
    let declares = false;
    traverse(ast, {
      "Method, Function": (node: Method | Function) => {
        if (
          node.identifier.value === elementName &&
          node.equations.every((eq) => eq.patterns.length === 4)
        ) {
          declares = true;
        }
      },
      "Rule, Fact": (node: Rule | Fact) => {
        if (
          node.identifier.value === elementName &&
          node.patterns.length === 4
        ) {
          declares = true;
        }
      },
      Procedure: (node: Procedure) => {
        if (
          node.identifier.value === elementName &&
          node.expressions.every((expr) => expr.patterns.length === 4)
        ) {
          declares = true;
        }
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresComputationWithArity5: (ast, args) => {
    const elementName = args.usage;
    let declares = false;
    traverse(ast, {
      "Method, Function": (node: Method | Function) => {
        if (
          node.identifier.value === elementName &&
          node.equations.every((eq) => eq.patterns.length === 5)
        ) {
          declares = true;
        }
      },
      "Rule, Fact": (node: Rule | Fact) => {
        if (
          node.identifier.value === elementName &&
          node.patterns.length === 5
        ) {
          declares = true;
        }
      },
      Procedure: (node: Procedure) => {
        if (
          node.identifier.value === elementName &&
          node.expressions.every((expr) => expr.patterns.length === 5)
        ) {
          declares = true;
        }
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresEntryPoint: (ast, args) => {
    let declares = false;
    traverse(ast, {
      Entrypoint: (node: EntryPoint) => {
        declares = true;
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresFunction: (ast, args) => {
    const functionName = args.name;
    let declares = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (node.identifier.value === functionName) declares = true;
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresRecursively: (ast, args) => {
    const computationName = args.name;
    let declares = false;
    traverse(ast, {
      "Method, Function, Rule, Fact, Procedure": (
        node: Method | Function | Rule | Fact
      ) => {
        if (node.identifier.value === computationName) {
          traverse(node, {
            "*": (node2) => {
              if (node2.identifier.value === computationName) declares = true;
            },
          });
        }
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresTypeAlias: (ast, args) => {
    const typeAliasName = args.name;
    let declares = false;
    traverse(ast, {
      TypeAlias: (node: TypeAlias) => {
        if (node.identifier.value === typeAliasName) {
          declares = true;
        }
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresTypeSignature: (ast, args) => {
    const typeSignName = args.name;
    let declares = false;
    traverse(ast, {
      TypeSignature: (node: TypeSignature) => {
        if (node.identifier.value === typeSignName) {
          declares = true;
        }
      },
    });
    return {
      result: declares,
    };
  },
  DeclaresVariable: (ast, args) => {
    const variableName = args.name;
    let declares = false;
    traverse(ast, {
      Variable: (node: Variable) => {
        if (node.identifier.value === variableName) {
          declares = true;
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
    return {result: declares.result && calls.result};
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
  Uses: (ast, args) => {
    const functionName = args.name;
    const usageName = args.usage;
    let uses = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (node.identifier.value === functionName) {
          traverse(node, {
            "*"(symbolNode) {
              if (symbolNode.value && symbolNode.value === usageName)
                uses = true;
            },
          });
        }
      },
    });
    return {
      result: uses,
    };
  },
  UsesArithmetic: (ast, args) => {
    const functionName = args.name;
    let hasArithmetic = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (node.identifier.value === functionName) {
          traverse(node, {
            Arithmetic() {
              hasArithmetic = true;
            },
          });
        }
      },
    });
    return {
      result: hasArithmetic,
    };
  },
  UsesConditional: (ast, args) => {
    const functionName = args.name;
    let hasConditional = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (node.identifier.value === functionName) {
          traverse(node, {
            If() {
              hasConditional = true;
            },
          });
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
    const functionName = args.name;
    let hasIf = false;
    traverse(ast, {
      Function: (node: Function) => {
        if (node.identifier.value === functionName) {
          traverse(node, {
            If() {
              hasIf = true;
            },
          });
        }
      },
    });
    return {
      result: hasIf,
    };
  },
  UsesLogic: (ast, args) => {
    const functionName = args.name;
    let usesLogic = false;
    traverse(ast, {
      "Method, Function, Procedure": (node: Method | Function | Procedure) => {
        if (node.identifier.value === functionName) {
          traverse(node, {
            LogicalOperation() {
              usesLogic = true;
            },
          });
        }
      },
    });
    return {
      result: usesLogic,
    };
  },
  UsesMath: (ast, args) => {
    const functionName = args.name;
    let hasMath = false;
    traverse(ast, {
      "Method, Function, Procedure": (node: Method | Function | Procedure) => {
        if (node.identifier.value === functionName) {
          traverse(node, {
            Arithmetic() {
              hasMath = true;
            },
          });
        }
      },
    });
    return {
      result: hasMath,
    };
  },
  UsesPrint: (ast, args) => {
    const functionName = args.name;
    let usesPrint = false;
    traverse(ast, {
      "Method, Function, Procedure": (node: Method | Function | Procedure) => {
        if (node.identifier.value === functionName) {
          traverse(node, {
            Print() {
              usesPrint = true;
            },
          });
        }
      },
    });
    return {
      result: usesPrint,
    };
  },
  UsesType: (ast, args) => {
    const typeName = args.name;
    let usesType = false;
    traverse(ast, {
      TypeSignature: (node: TypeSignature) => {
        traverse(node, {
          "*"() {
            if (node.identifier.value === typeName) {
              usesType = true;
            }
          },
        });
      },
    });
    return {
      result: usesType,
    };
  },
  HasBinding: (ast, args) => {
    const bindingName = args.name;
    let found = false;
    traverse(ast, {
      "Function, TypeAlias, TypeSignature": (
        node: Function | TypeAlias | TypeSignature
      ) => {
        if (node.identifier.value === bindingName) {
          found = true;
        }
      },
      Record: (node: RecordNode) => {
        if (node.name.value === bindingName) {
          found = true;
        }
      },
    });
    return {
      result: found,
    };
  },
};
