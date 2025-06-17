import mulang from "mulang";
import fs from "fs";
import { argv } from "process";

const filePath = argv[2];
const code = fs.readFileSync(filePath, "utf-8");

const mulangCode = mulang.nativeCode("Haskell", code);
const mulangTesting = {
    testAnalysisType: {
      tag: "ExternalTests",
      test: {
        tag: "CodeSample",
        language: "JavaScript",
        content: "it('should subtract numbers correctly', function() {assert.equals(esNegativo(4), false);})",
      },
    },
};
console.log(mulangCode);
const results = mulangCode.analyse(mulangTesting);

console.log(results.testResults);
