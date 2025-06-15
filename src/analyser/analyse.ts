import fs from "fs";
import { parse } from "../parser/parser";
import { argv } from "process";
import { runExpectations } from "../inspector/expectations";

const filePath = argv[2];
const code = fs.readFileSync(filePath, "utf-8");
const ast = parse(code);
/* const results = runExpectations(ast, [
  { inspection: "Not:HasBinding", binding: "minimoEntre" },
  { inspection: "HasBinding", binding: "squareList" },
  { inspection: "UsesGuards", binding: "grade" },
  { inspection: "Not:UsesGuards", binding: "squareList" },
  { inspection: "UsesAnonymousVariable", binding: "isSecret" },
  { inspection: "Not:UsesAnonymousVariable", binding: "squareList" },
]); */
/* const results = runExpectations(ast, [
  { inspection: "Not:HasComposition", binding: "doble" },
  { inspection: "HasComposition", binding: "cuadruple" },
]); */
const results = runExpectations(ast, [
  { inspection: "HasLambda", binding: "squareList" },
  { inspection: "UsesLambda", binding: "squareList" },
  { inspection: "Not:UsesLambda", binding: "squareList2" },
]);
console.log(results);
