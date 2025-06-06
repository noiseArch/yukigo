import * as fs from "fs";
import nearley from "nearley";
import grammar from "./langs/javascript/grammar";
import util from "util";

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
const code = fs.readFileSync("./test/test0.js", "utf-8");
console.log("Code:", code);
parser.feed(code);
parser.finish();
const res = [...parser.results].flat(2).filter(node => node !== null);

console.log("Parser ASTs amount: ", res.length);
/* console.log(util.inspect(res[0], false, null, true));
console.log("///////////////////////////////////")
console.log(util.inspect(res[res.length - 1], false, null, true)); */
