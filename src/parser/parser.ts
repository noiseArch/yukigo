import * as fs from "fs";
import nearley from "nearley";
import grammar from "./langs/haskell/grammar";
import { argv } from "process";
import { FunctionDeclaration, FunctionGroup } from "./paradigms/functional";
import { astToTypescript } from "../ast/translator";
import { AST, ASTGrouped } from "./globals";

export function groupFunctionDeclarations(ast: AST): ASTGrouped {
  const groups: Record<string, FunctionDeclaration[]> = {};
  const others: ASTGrouped = []; // Cumple ASTGrouped porque no tiene objetos FunctionDeclaration 

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
    ([, contents]) => ({
      type: "function",
      name: contents[0].name,
      contents: contents.map((func: FunctionDeclaration) => ({
        parameters: func.parameters,
        body: func.body,
        return: func.return,
        attributes: func.attributes,
      })),
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
  const tsCode = astToTypescript(ast[0]);
  fs.writeFileSync("generated.ts", tsCode);
  fs.writeFileSync("./output.json", JSON.stringify(ast, null, 2));
} catch (err) {
  console.error("Error:", err);
}

//console.log("///////////////////////////////////")
//console.log(util.inspect(res[1], false, null, true));
//console.log("///////////////////////////////////")
//console.log(util.inspect(res[2], false, null, true));
