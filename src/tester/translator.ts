import { traverse } from "../ast/visitor";
import fs from "fs";
import { argv } from "process";
import { parse } from "../parser/parser";
import { generateJS } from "./generator";

const filePath = argv[2];
const code = fs.readFileSync(filePath, "utf-8");
const ast = parse(code);

const jsCode = generateJS(ast);
fs.writeFileSync("output.js", jsCode);