import { AST, Enumeration, ForLoop, Procedure, traverse } from "yukigo-core";
import { InspectionMap } from "../ast/inspector.js";

export const imperativeInspections: InspectionMap = {
  DeclaresEnumeration: (ast, args) => {
    const enumName = args.name;
    let declares = false;
    traverse(ast, {
      Enumeration: (node: Enumeration) => {
        if (node.identifier.value === enumName) declares = true;
      },
    });
    return { result: declares };
  },
  DeclaresProcedure: (ast, args) => {
    const procedureName = args.name;
    let declares = false;
    traverse(ast, {
      Procedure: (node: Procedure) => {
        if (node.identifier.value === procedureName) declares = true;
      },
    });
    return { result: declares };
  },
  UsesForEach: (ast, args) => {
    throw Error("Inspection not implemented");
  },
  UsesForLoop: (ast, args) => {
    let uses = false;
    traverse(ast, {
      ForLoop: () => {
        uses = true;
      },
    });
    return { result: uses };
  },
  UsesLoop: (ast, args) => {
    let uses = false;
    traverse(ast, {
      "ForEach, While, Repeat, ForLoop": () => {
        uses = true;
      },
    });
    return { result: uses };
  },
  UsesRepeat: (ast, args) => {
    let uses = false;
    traverse(ast, {
      Repeat: () => {
        uses = true;
      },
    });
    return { result: uses };
  },
  UsesSwitch: (ast, args) => {
    let uses = false;
    traverse(ast, {
      Switch: () => {
        uses = true;
      },
    });
    return { result: uses };
  },
  UsesWhile: (ast, args) => {
    let uses = false;
    traverse(ast, {
      While: () => {
        uses = true;
      },
    });
    return { result: uses };
  },
};
