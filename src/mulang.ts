import fs from "fs";
import mulang from "mulang";
import { argv } from "process";

const filePath = argv[2];
const code = fs.readFileSync(filePath, "utf-8");

const mulangCode = mulang.nativeCode("Haskell", code);

fs.writeFileSync("./mulang.json", JSON.stringify(mulangCode.ast, null, 2));