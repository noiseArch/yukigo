import fs from "fs";
import { parse } from "../parser/parser";
import { argv } from "process";
//import { runExpectations } from "../inspector/expectations";
import { traverse } from "../ast/visitor";
import ASTAnalyzer, { ASTNode, InspectionRule } from "../ast/inspector";

const filePath = argv[2];
const code = fs.readFileSync(filePath, "utf-8");
const ast = parse(code);

const rules: InspectionRule[] = [
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
    result: hasArithmetic
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
