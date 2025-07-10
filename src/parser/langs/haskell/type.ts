import { traverse } from "../../../ast/visitor";
import { Environment, Type } from "../../globals";
import { haskellStdLib } from "./definition";

export type TypeError = {
  message: string;
  node: any;
};

function typeToString(type: Type, context: InferenceContext): string {
  const resolved = context.resolve(type);
  
  switch (resolved.kind) {
    case "primitive": 
      return resolved.name;
    case "list": 
      return `[${typeToString(resolved.elementType, context)}]`;
    case "tuple": 
      return `(${resolved.elements.map(t => typeToString(t, context)).join(", ")})`;
    case "function":
      // Handle single parameter specially
      if (resolved.parameters.length === 1) {
        const paramType = typeToString(resolved.parameters[0], context);
        const returnType = typeToString(resolved.return, context);
        return `${paramType} -> ${returnType}`;
      }
      // Handle multi-parameter functions
      return `(${resolved.parameters.map(t => typeToString(t, context)).join(", ")}) -> ${typeToString(resolved.return, context)}`;
    case "variable": 
      return `t${resolved.id}`;
    default:
      // Safety net for unexpected types
      return `UnknownType(${(resolved as any).kind})`;
  }
}

class InferenceContext {
  private nextId = 0;
  private substitutions = new Map<number, Type>();
  private typeConstraints: [Type, Type][] = [];

  freshVariable(): Type {
    return { kind: "variable", id: this.nextId++ };
  }

  unify(t1: Type, t2: Type): boolean {
    const resolvedT1 = this.resolve(t1);
    const resolvedT2 = this.resolve(t2);

    // Handle primitive types
    if (resolvedT1.kind === "primitive" && resolvedT2.kind === "primitive") {
      return resolvedT1.name === resolvedT2.name;
    }

    // Handle variables - no ID comparison needed!
    if (resolvedT1.kind === "variable") {
      this.substitutions.set(resolvedT1.id, resolvedT2);
      return true;
    }

    if (resolvedT2.kind === "variable") {
      this.substitutions.set(resolvedT2.id, resolvedT1);
      return true;
    }

    // Handle lists
    if (resolvedT1.kind === "list" && resolvedT2.kind === "list") {
      return this.unify(resolvedT1.elementType, resolvedT2.elementType);
    }

    // Handle tuples
    if (resolvedT1.kind === "tuple" && resolvedT2.kind === "tuple") {
      return (
        resolvedT1.elements.length === resolvedT2.elements.length &&
        resolvedT1.elements.every((el, i) =>
          this.unify(el, resolvedT2.elements[i])
        )
      );
    }

    // Handle functions (including currying)
    if (resolvedT1.kind === "function" && resolvedT2.kind === "function") {
      // Check parameter count
      if (resolvedT1.parameters.length !== resolvedT2.parameters.length) {
        return false;
      }

      // Check parameter types
      for (let i = 0; i < resolvedT1.parameters.length; i++) {
        if (!this.unify(resolvedT1.parameters[i], resolvedT2.parameters[i])) {
          return false;
        }
      }

      // Check return type
      return this.unify(resolvedT1.return, resolvedT2.return);
    }

    // All other cases are type mismatches
    return false;
  }

  resolve(type: Type): Type {
    if (type.kind === "variable" && this.substitutions.has(type.id)) {
      return this.resolve(this.substitutions.get(type.id)!);
    }
    return type;
  }

  addConstraint(t1: Type, t2: Type) {
    this.typeConstraints.push([t1, t2]);
  }

  solveConstraints(): TypeError[] {
    const errors: TypeError[] = [];

    for (const [t1, t2] of this.typeConstraints) {
      try {
        if (!this.unify(t1, t2)) {
          errors.push({
            message: `Type mismatch: ${typeToString(t1, this)} ≠ ${typeToString(
              t2,
              this
            )}`,
            node: null,
          });
        }
      } catch (e) {
        errors.push({
          message: `Unification error: ${e.message}`,
          node: null,
        });
      }
    }

    return errors;
  }
}

// Build type environment from AST
function buildEnvironment(ast: any): Map<string, Type> {
  const env = new Map<string, Type>();

  traverse(ast, {
    TypeSignature(node: any) {
      const name = node.name.value;
      const inputTypes = node.inputTypes.map(convertTypeNode);
      const returnType = convertTypeNode(node.returnType);

      // Create function type with proper currying
      let currentType = returnType;
      for (let i = inputTypes.length - 1; i >= 0; i--) {
        currentType = {
          kind: "function",
          parameters: [inputTypes[i]],
          return: currentType,
        };
      }

      env.set(name, currentType);
    },
  });

  return env;
}

// Convert AST type node to internal type representation
function convertTypeNode(node: any): Type {
  if (node.isArray) {
    return {
      kind: "list",
      elementType: convertTypeNode({ ...node, isArray: false }),
    };
  }

  if (node.type === "YuSymbol") {
    return { kind: "primitive", name: node.value };
  }

  throw new Error(`Unsupported type node: ${JSON.stringify(node)}`);
}

export function haskellTypeChecker(ast: any): TypeError[] {
  const errors: TypeError[] = [];
  const context = new InferenceContext();

  // Build environment with stdlib + user definitions
  const env = new Map([...haskellStdLib, ...buildEnvironment(ast)]);

  // Collect constraints
  traverse(ast, {
    function(node: any) {
      const fnName = node.name.value;
      const declType = env.get(fnName);

      if (!declType) return;

      node.contents.forEach((clause: any) => {
        if (clause.body) {
          const bodyType = inferType(clause.body, env, context);
          context.addConstraint(declType, bodyType);
        }
      });
    },

    Application(node: any) {
      try {
        inferType(node, env, context);
      } catch (error) {
        errors.push({
          message: error.message,
          node,
        });
      }
    },
  });

  // Solve all constraints
  return [...errors, ...context.solveConstraints()];
}

function inferType(
  node: any,
  env: Map<string, Type>,
  context: InferenceContext
): Type {
  switch (node.type) {
    case "Application": {
      let currentType = inferType(node.function, env, context);

      for (const arg of node.parameters) {
        const argType = inferType(arg, env, context);
        const resolvedType = context.resolve(currentType);

        if (resolvedType.kind !== "function") {
          throw new Error(
            `Cannot apply non-function type: ${typeToString(
              currentType,
              context
            )}`
          );
        }

        // Use unification instead of direct comparison
        if (!context.unify(resolvedType.parameters[0], argType)) {
          throw new Error(
            `Argument type mismatch: expected ${typeToString(
              resolvedType.parameters[0],
              context
            )}, ` + `got ${typeToString(argType, context)}`
          );
        }

        // Handle currying
        if (resolvedType.parameters.length > 1) {
          currentType = {
            kind: "function",
            parameters: resolvedType.parameters.slice(1),
            return: resolvedType.return,
          };
        } else {
          currentType = resolvedType.return;
        }
      }

      return currentType;
    }
    case "YuSymbol": {
      const type = env.get(node.value);
      return type || context.freshVariable();
    }
    case "LambdaExpression": {
      const paramType = context.freshVariable();
      const newEnv = new Map(env);

      node.parameters.forEach((param: any) => {
        if (param.type === "VariablePattern") {
          newEnv.set(param.name, paramType);
        }
      });

      const bodyType = inferType(node.body, newEnv, context);
      return {
        kind: "function",
        parameters: [paramType],
        return: bodyType,
      };
    }
    case "Arithmetic": {
      const leftType = inferType(node.left, env, context);
      const rightType = inferType(node.right, env, context);

      context.addConstraint(leftType, rightType);
      context.addConstraint(leftType, { kind: "primitive", name: "Int" });

      return leftType;
    }
    default:
      return context.freshVariable();
  }
}
