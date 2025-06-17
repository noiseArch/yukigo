// TESTING PURPOSE ONLY
import * as fs from "fs";
import { argv } from "process";
import { PrologLexer } from "./langs/prolog/lexer";

const filepath = argv[2];
if(!filepath) throw Error("Please provide a filepath to test the lexer. Usage: yarn lex <filepath>")
const code = fs.readFileSync(filepath, "utf-8");

const lexer = PrologLexer;
lexer.reset(code)
let token = lexer.next();
while (token) {
  console.log(token);
  token = lexer.next();
}
