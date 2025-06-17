import { traverse } from "./visitor";

// astAnalyzer.ts
export type ASTNode = {
  type: string;
  name?: { type: string; value?: string }; // Example, extend as needed
  contents?: ASTNode[];
  parameters?: ASTNode[];
  body?: ASTNode;
  attributes?: string[];
  left?: ASTNode;
  right?: ASTNode;
  operator?: string;
  value?: { type: string; value: string; text: string };
  elements?: ASTNode[];
  cond?: ASTNode;
  then?: ASTNode;
  else?: ASTNode;
  guard?: ASTNode;
  // ... other properties of your AST nodes
};

export type InspectionRule = {
  inspection: string;
  args?: Record<string, any>;
  expected: boolean;
};

export type AnalysisResult = {
  rule: InspectionRule;
  passed: boolean;
  actual?: any; // To store the actual value found during inspection
  error?: string;
};

type InspectionHandlerMap = {
  [key: string]: (
    ast: ASTNode[],
    args: Record<string, any>,
    findings: Map<string, any>
  ) => { result: boolean };
};

class ASTAnalyzer {
  private ast: ASTNode[];
  private findings: Map<string, any> = new Map(); // Store collected data for inspections

  constructor(ast: ASTNode[]) {
    this.ast = ast;
  }

  private inspectionHandlers: InspectionHandlerMap = {
    HasBinding: (ast, args, findings) => {
      const bindingName = args.name;
      let found = false;
      traverse(ast, {
        function: (node: ASTNode) => {
          if (node.name && node.name.value === bindingName) {
            found = true;
          }
        },
        TypeAlias: (node: ASTNode) => {
          if (node.name && node.name.value === bindingName) {
            found = true;
          }
        },
        Record: (node: ASTNode) => {
          if (node.name && node.name.value === bindingName) {
            found = true;
          }
        },
        TypeSignature: (node: ASTNode) => {
          if (node.name && node.name.value === bindingName) {
            found = true;
          }
        },
      });
      return {
        result: found
      };
    },

    UsesGuards: (ast, args, findings) => {
      const functionName = args.name;
      let usesGuards = false;
      traverse(ast, {
        function: (node: ASTNode) => {
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
        result: usesGuards
      };
    },

    UsesAnonymousVariable: (ast, args, findings) => {
      const functionName = args.name;
      let usesAnonymous = false;
      traverse(ast, {
        function: (node: ASTNode) => {
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
        result: usesAnonymous
      };
    },

    HasPatternMathing: (ast, args, findings) => {
      const functionName = args.name;
      let hasPatternMathing = false;
      traverse(ast, {
        function: (node: ASTNode) => {
          if (node.name.value === functionName && node.contents.length > 1) {
            hasPatternMathing = true;
          }
        },
      });
      return {
        result: hasPatternMathing
      };
    },

    Uses: (ast, args, findings) => {
      const functionName = args.name;
      const usageName = args.usage;
      let uses = false;
      traverse(ast, {
        function: (node: ASTNode) => {
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
        result: uses
      };
    },

    HasLambdaExpression: (ast, args, findings) => {
      const functionName = args.name;
      let hasLambdaExpression = false;
      traverse(ast, {
        function: (node: ASTNode) => {
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
        result: hasLambdaExpression
      };
    },

    HasArithmetic: (ast, args, findings) => {
      const functionName = args.name;
      let hasArithmetic = false;
      traverse(ast, {
        function: (node: ASTNode) => {
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
        result: hasArithmetic
      };
    },

    HasComposition: (ast, args, findings) => {
      const functionName = args.name;
      let hasComposition = false;
      traverse(ast, {
        function: (node: ASTNode) => {
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
        result: hasComposition
      };
    },
  };

  /**
   * Registers a new custom inspection handler.
   * @param name The name of the inspection (e.g., "CustomCheck").
   * @param handler The function that implements the inspection logic.
   */
  public registerInspection(
    name: string,
    handler: (
      ast: ASTNode[],
      args: Record<string, any>,
      findings: Map<string, any>
    ) => { result: boolean; details?: string }
  ) {
    this.inspectionHandlers[name] = handler;
  }

  /**
   * Runs a single inspection rule against the AST.
   * @param rule The inspection rule to run.
   * @returns The analysis result for the rule.
   */
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
