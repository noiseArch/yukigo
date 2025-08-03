import grammar from "./parser/grammar";
import nearley from "nearley";
import { groupFunctionDeclarations } from "./utils/helpers";
import { TypeChecker } from "./typechecker";
import { ASTGrouped, YukigoParser } from "yukigo-core";

// This is the final parser that Yukigo accepts. 
// every parser NEEDS to expose a 'parse' method/function
export class YukigoHaskellParser implements YukigoParser {
  public parse(code: string): ASTGrouped {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    console.log(JSON.stringify(code, null, 0));
    parser.feed(code);
    parser.finish();
    console.log("Amount of possibles ASTs:", parser.results.length);
    if (parser.results.length > 1)
      throw Error("Too much ambiguity. Output not generated.");
    if (parser.results.length == 0)
      throw Error("Parser did not generate an AST.");
    const groupedAst = groupFunctionDeclarations(parser.results[0]);
    const typeChecker = new TypeChecker();
    const errors = typeChecker.check(groupedAst);
    if (errors.length > 0) {
      errors.forEach((e) => console.log(e));
      throw Error(`${errors.length} type errors found. Output not generated.`)
    }
    return groupedAst;
  }
}
