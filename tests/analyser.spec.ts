import { Analyzer, InspectionRule } from "../src/index.js";
import { assert } from "chai";

describe("Analyzer Spec", () => {
  let analyzer: Analyzer;
  beforeEach(() => {
    analyzer = new Analyzer();
  });
  it("works with Yukigo input", () => {
    const inspection: InspectionRule = {
      inspection: "Declares",
      binding: "y",
      args: [],
      expected: false,
    };
    const result = analyzer.analyze([], [inspection]);
    assert.deepEqual(result, [
      { rule: inspection, passed: true, actual: false },
    ]);
  });
});


