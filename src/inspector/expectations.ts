import { declaresFunction, hasAnonymousVariable, hasGuards } from "./inspections";

const inspectionMap = {
  HasBinding: declaresFunction,
  UsesGuards: hasGuards,
  HasAnonymousVariable: hasAnonymousVariable,
  UsesAnonymousVariable: hasAnonymousVariable
};

export function runExpectations(ast: object[], expectations: {binding: string; inspection: string}[]) {
  return expectations.map((exp) => {
    const parts = exp.inspection.split(":");
    let negate = false;
    let handlerName: string;
    if (parts[0] === "Not") {
      negate = true;
      handlerName = parts[1];
    } else {
      handlerName = parts[0];
    }
    const checkFn = inspectionMap[handlerName];
    if (!checkFn) return { ...exp, result: "Unknown inspection" };
    // Some checks need a binding (function name), some don't
    const result = exp.binding ? checkFn(ast, exp.binding) : checkFn(ast);
    return { ...exp, result: negate ? !result : result };
  });
}