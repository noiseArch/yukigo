import { AST } from "yukigo-core";
import { genericInspections } from "../inspections/generic.js";
import { functionalInspections } from "../inspections/functional.js";
import { logicInspections } from "../inspections/logic.js";
import { objectInspections } from "../inspections/object.js";
import { imperativeInspections } from "../inspections/imperative.js";

export type InspectionRule = {
  inspection: string;
  args?: Record<string, any>;
  expected: boolean;
};

export type AnalysisResult = {
  rule: InspectionRule;
  passed: boolean;
  actual?: any;
  error?: string;
};

export type InspectionMap = {
  [key: string]: (ast: AST, args: Record<string, any>) => { result: boolean };
};

export class ASTAnalyzer {
  private ast: AST;

  constructor(ast: AST) {
    this.ast = ast;
  }

  private inspectionHandlers: InspectionMap = {
    ...genericInspections,
    ...functionalInspections,
    ...logicInspections,
    ...objectInspections,
    ...imperativeInspections,
  };

  /**
   * Registers a new custom inspection handler.
   * @param name The name of the inspection (e.g., "HasArithmetic").
   * @param handler The function that implements the inspection logic.
   *
   * @example
   * // Implementation of HasArithmetic inspection
   * const analyzer = new ASTAnalyzer(ast);
   * analyzer.registerInspection("HasArithmetic", (ast, args) => {
   *   let hasArithmetic = false;
   *   traverse(ast, {
   *     Function: (node: FunctionGroup) => {
   *       if (node.name.value === args.name) {
   *         traverse(node, {
   *           Arithmetic() {
   *             hasArithmetic = true;
   *           },
   *         });
   *       }
   *     },
   *   });
   *   return {
   *     result: hasArithmetic
   *   };
   * });
   */
  public registerInspection(
    name: string,
    handler: (
      ast: AST,
      args: Record<string, any>
    ) => { result: boolean; details?: string }
  ) {
    this.inspectionHandlers[name] = handler;
  }

  private runInspection(rule: InspectionRule): AnalysisResult {
    const handler = this.inspectionHandlers[rule.inspection];
    if (!handler) {
      return {
        rule,
        passed: false,
        error: "Unknown inspection",
      };
    }

    try {
      const { result } = handler(this.ast, rule.args || {});
      const passed = result === rule.expected;
      return {
        rule,
        passed,
        actual: result,
      };
    } catch (error) {
      return {
        rule,
        passed: false,
      };
    }
  }

  /**
   * Runs a list of inspection rules against the AST.
   * @param rules The array of inspection rules to run.
   * @returns An array of analysis results.
   * @example
   * const rules: InspectionRule[] = [
   *  {
   *    inspection: "HasBinding",
   *    args: { name: "minimoEntre" },
   *    expected: false,
   *  },
   *  {
   *    inspection: "HasBinding",
   *    args: { name: "squareList" },
   *    expected: true,
   *  }
   * ]
   * const analyzer = new ASTAnalyzer(ast);
   * const analysisResults = analyzer.analyze(expectations);
   */
  public analyze(rules: InspectionRule[]): AnalysisResult[] {
    const results: AnalysisResult[] = [];
    for (const rule of rules) {
      results.push(this.runInspection(rule));
    }
    return results;
  }
}
