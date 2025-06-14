import * as fs from "fs";
import nearley from "nearley";
import grammar from "./langs/haskell/grammar";
import { argv } from "process";
import { FunctionDeclaration, FunctionGroup } from "./paradigms/functional";

export function groupFunctionDeclarations(ast: any[]): any[] {
  const groups: Record<string, FunctionDeclaration[]> = {};
  const others: any[] = [];

  for (const node of ast) {
    if (node.type == "function") {
      const name = node.name.value;
      if (!groups[name]) groups[name] = [];
      groups[name].push(node);
    } else {
      others.push(node);
    }
  }
  const functionGroups: FunctionGroup[] = Object.entries(groups).map(
    ([name, variants]) => ({
      type: "function_group",
      name: variants[0].name,
      variants,
    })
  );

  return [...others, ...functionGroups];
}

export function parse(code: string) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(code);
  parser.finish();
  console.log("Amount of possibles ASTs:", parser.results.length);
  if (parser.results.length > 1)
    throw Error("Too much ambiguity. Output not generated.");
  if (parser.results.length == 0)
    throw Error("Parser did not generate an AST.");
  const groupedAst = groupFunctionDeclarations(parser.results[0]);
  return groupedAst;
}

try {
  const filePath = argv[2];
  console.log(filePath);
  console.log(`Parsing: ${filePath}`);
  const code = fs.readFileSync(filePath, "utf-8");
  const ast = parse(code);
  fs.writeFileSync("./output.json", JSON.stringify(ast, null, 2));
} catch (err) {
  console.error("Error:", err);
}

//console.log("///////////////////////////////////")
//console.log(util.inspect(res[1], false, null, true));
//console.log("///////////////////////////////////")
//console.log(util.inspect(res[2], false, null, true));
