import fs from "fs";
import { parse } from "../parser/parser";
import { argv } from "process";
import ASTAnalyzer from "../ast/inspector";
import { translateMulangToInspectionRules } from "../utils/mulangToYukigo";

const filePath = argv[2];
if (!filePath)
  throw Error(
    "You need to provide the path to the file you want to analyse. Usage: yukigo analyse <filepath>"
  );

const code = fs.readFileSync(filePath, "utf-8");
const ast = parse(code);

/*const rules: InspectionRule[] = [
  {
    inspection: "HasBinding",
    args: { name: "minimoEntre" },
    expected: false,
  },
  {
    inspection: "HasBinding",
    args: { name: "squareList" },
    expected: true,
  },
  {
    inspection: "UsesGuards",
    args: { name: "grade" },
    expected: true,
  },
  {
    inspection: "UsesGuards",
    args: { name: "squareList" },
    expected: false,
  },
  {
    inspection: "UsesAnonymousVariable",
    args: { name: "isSecret" },
    expected: true,
  },
  {
    inspection: "UsesAnonymousVariable",
    args: { name: "squareList" },
    expected: false,
  },
  {
    inspection: "HasArithmetic",
    args: { name: "addTwoNumbers" },
    expected: true,
  },
];

const analyzer = new ASTAnalyzer(ast);

// Registering a custom inspection at runtime
analyzer.registerInspection("HasArithmetic", (ast, args) => {
  let hasArithmetic = false;
  traverse(ast, {
    function: (node: ASTNode) => {
      if (node.name.value === args.name) {
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
    details: hasArithmetic
      ? "Uses arithmetic operators"
      : "No arithmetic operators found.",
  };
});

const analysisResults = analyzer.analyze(rules);
analysisResults.forEach((result) => {
  console.log(
    `Rule: ${result.rule.inspection} (Target: ${
      result.rule.args ? result.rule.args.name : "N/A"
    })`
  );
  console.log(`  Expected: ${result.rule.expected}, Actual: ${result.actual}`);
  console.log(`  Passed: ${result.passed ? "✅" : "❌"}`);
  console.log("---");
});
 */

const mulangYaml1 = `
expectations:
- !ruby/hash:ActiveSupport::HashWithIndifferentAccess
  binding: squareList
  inspection: HasBinding
- !ruby/hash:ActiveSupport::HashWithIndifferentAccess
  binding: squareList
  inspection: HasLambdaExpression
- !ruby/hash:ActiveSupport::HashWithIndifferentAccess
  binding: square
  inspection: HasArithmetic
- !ruby/hash:ActiveSupport::HashWithIndifferentAccess
  binding: doble
  inspection: Not:HasBinding
- !ruby/hash:ActiveSupport::HashWithIndifferentAccess
  binding: square
  inspection: Uses:n
- !ruby/hash:ActiveSupport::HashWithIndifferentAccess
  binding: squareList2
  inspection: Uses:map
`;

const expectations = translateMulangToInspectionRules(mulangYaml1);
const analyzer = new ASTAnalyzer(ast);
const analysisResults = analyzer.analyze(expectations);

analysisResults.forEach((result) => {
  console.log(
    `Rule: ${result.rule.inspection} (Target: ${
      result.rule.args ? result.rule.args.name : "N/A"
    })`
  );
  console.log(`  Expected: ${result.rule.expected}, Actual: ${result.actual}`);
  console.log(`  Passed: ${result.passed ? "✅" : "❌"}`);
  console.log("---");
});
