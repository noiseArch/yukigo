import { haskellTypeChecker, TypeError } from "../parser/langs/haskell/type";
import {
  FunctionGroup,
  FunctionTypeSignature,
  TypeAlias,
} from "../parser/paradigms/functional";
import { traverse } from "./visitor";

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

type InspectionHandlerMap = {
  [key: string]: (
    ast: any,
    args: Record<string, any>,
    findings: Map<string, any>
  ) => { result: boolean };
};

// type SupportedLanguage = "haskell";

class ASTAnalyzer {
  private ast: any;
  private findings: Map<string, any> = new Map();
  private typeCheckers: Map<string, (ast: any) => TypeError[]> = new Map();

  constructor(ast: any) {
    this.ast = ast;
  }

  private languageTypeCheckers: Record<string, (ast: any) => TypeError[]> = {
    haskell: haskellTypeChecker,
  };

  registerTypeChecker(language: string, checker: (ast: any) => TypeError[]) {
    this.typeCheckers.set(language, checker);
  }
  private inspectionHandlers: InspectionHandlerMap = {
    HasBinding: (ast, args, findings) => {
      const bindingName = args.name;
      let found = false;
      traverse(ast, {
        function: (node: FunctionGroup) => {
          if (node.name && node.name.value === bindingName) {
            found = true;
          }
        },
        TypeAlias: (node: TypeAlias) => {
          if (node.name && node.name.value === bindingName) {
            found = true;
          }
        },
        Record: (node: any) => {
          if (node.name && node.name.value === bindingName) {
            found = true;
          }
        },
        TypeSignature: (node: FunctionTypeSignature) => {
          if (node.name && node.name.value === bindingName) {
            found = true;
          }
        },
      });
      return {
        result: found,
      };
    },
    TypeCheck: (ast, args, findings) => {
      const language = args.language || "haskell";
      const checker = this.languageTypeCheckers[language];
      
      if (!checker) {
        return {
          result: false,
          details: `No type checker for language: ${language}`
        };
      }
      
      const errors = checker(ast);
      console.log(errors)
      return {
        result: errors.length === 0,
        details: errors
      };
    },
    UsesGuards: (ast, args, findings) => {
      const functionName = args.name;
      let usesGuards = false;
      traverse(ast, {
        function: (node: FunctionGroup) => {
          if (node.name && node.name.value === functionName) {
            if (Array.isArray(node.contents)) {
              for (const content of node.contents) {
                if (
                  content.attributes &&
                  content.attributes.includes("GuardedBody")
                ) {
                  usesGuards = true;
                  break;
                }
              }
            }
          }
        },
      });
      return {
        result: usesGuards,
      };
    },

    UsesAnonymousVariable: (ast, args, findings) => {
      const functionName = args.name;
      let usesAnonymous = false;
      traverse(ast, {
        function: (node: FunctionGroup) => {
          if (node.name && node.name.value === functionName) {
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

    HasPatternMathing: (ast, args, findings) => {
      const functionName = args.name;
      let hasPatternMathing = false;
      traverse(ast, {
        function: (node: FunctionGroup) => {
          if (node.name.value === functionName && node.contents.length > 1) {
            hasPatternMathing = true;
          }
        },
      });
      return {
        result: hasPatternMathing,
      };
    },

    Uses: (ast, args, findings) => {
      const functionName = args.name;
      const usageName = args.usage;
      let uses = false;
      traverse(ast, {
        function: (node: FunctionGroup) => {
          if (node.name.value === functionName) {
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

    HasLambdaExpression: (ast, args, findings) => {
      const functionName = args.name;
      let hasLambdaExpression = false;
      traverse(ast, {
        function: (node: FunctionGroup) => {
          if (node.name.value === functionName) {
            traverse(node, {
              LambdaExpression() {
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

    HasArithmetic: (ast, args, findings) => {
      const functionName = args.name;
      let hasArithmetic = false;
      traverse(ast, {
        function: (node: FunctionGroup) => {
          if (node.name.value === functionName) {
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

    HasComposition: (ast, args, findings) => {
      const functionName = args.name;
      let hasComposition = false;
      traverse(ast, {
        function: (node: FunctionGroup) => {
          if (node.name && node.name.value === functionName) {
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
  };

  /**
   * Registers a new custom inspection handler.
   * @param name The name of the inspection (e.g., "CustomCheck").
   * @param handler The function that implements the inspection logic.
   *
   * @example
   * // Create HasArithmetic inspection
   * const analyzer = new ASTAnalyzer(ast);
   * analyzer.registerInspection("HasArithmetic", (ast, args) => {
   *   let hasArithmetic = false;
   *   traverse(ast, {
   *     function: (node: FunctionGroup) => {
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
      ast: any,
      args: Record<string, any>,
      findings: Map<string, any>
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
      const { result } = handler(this.ast, rule.args || {}, this.findings);
      const passed = result === rule.expected;
      return {
        rule,
        passed,
        actual: result,
      };
    } catch (error: any) {
      console.log(error);

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

export default ASTAnalyzer;
