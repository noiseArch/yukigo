import * as fs from "fs";
import nearley from "nearley";
import grammar from "./langs/javascript/grammar";
import util from "util";
import path from "path";
import { argv } from "process";

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
const filePath = argv[2];

//fs.writeFileSync("./output.json", JSON.stringify(parser.results, null, 2));
try {
    console.log(filePath);
    console.log(`Parsing: ${filePath}`);
    const code = fs.readFileSync(filePath, "utf-8");
    parser.feed(code);
    console.log(code)
    parser.finish();
    //console.log(util.inspect(parser.results, false, null, true));
    console.log("Parser ASTs amount: ", parser.results.length);
    
} catch (err) {
  console.error("Error reading directory or file:", err);
}

//console.log("///////////////////////////////////")
//console.log(util.inspect(res[1], false, null, true));
//console.log("///////////////////////////////////")
//console.log(util.inspect(res[2], false, null, true));
