import { Fact, Findall, Forall, Not, Rule, traverse } from "yukigo-core";
import { InspectionMap } from "../ast/inspector.js";

export const logicInspections: InspectionMap = {
  DeclaresFact: (ast, args) => {
    let declares = false;
    traverse(ast, {
      Fact: (node: Fact) => {
        declares = true;
      },
    });
    return { result: declares };
  },
  DeclaresPredicate: (ast, args) => {
    let declares = false;
    traverse(ast, {
      "Fact, Rule": (node: Fact | Rule) => {
        declares = true;
      },
    });
    return { result: declares };
  },
  DeclaresRule: (ast, args) => {
    let declares = false;
    traverse(ast, {
      Rule: (node: Rule) => {
        declares = true;
      },
    });
    return { result: declares };
  },
  UsesFindall: (ast, args) => {
    let declares = false;
    traverse(ast, {
      Findall: (node: Findall) => {
        declares = true;
      },
    });
    return { result: declares };
  },
  UsesForall: (ast, args) => {
    let declares = false;
    traverse(ast, {
      Forall: (node: Forall) => {
        declares = true;
      },
    });
    return { result: declares };
  },
  UsesNot: (ast, args) => {
    let declares = false;
    traverse(ast, {
      Not: (node: Not) => {
        declares = true;
      },
    });
    return { result: declares };
  },
};
