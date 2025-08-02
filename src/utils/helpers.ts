import {
  FunctionDeclaration,
  GuardedFunctionDeclaration,
  UnguardedFunctionDeclaration,
} from "../../yukigo-core/paradigms/functional";

import { parseDocument } from "yaml";
import { InspectionRule } from "../ast/inspector";

/**
 * Translates Mulang inspections (YAML format) to an array of `InspectionRule` objects.
 * @param mulangYamlString The Mulang inspection syntax as a YAML string.
 * @returns An array of InspectionRule objects.
 */
export function translateMulangToInspectionRules(
  mulangYamlString: string
): InspectionRule[] {
  const parsedYaml = parseDocument(mulangYamlString).toJS();

  if (
    !parsedYaml ||
    !parsedYaml.expectations ||
    !Array.isArray(parsedYaml.expectations)
  ) {
    console.warn(
      "Invalid Mulang YAML structure. Expected 'expectations' array."
    );
    return [];
  }

  const inspectionRules: InspectionRule[] = [];

  for (const mulangInspection of parsedYaml.expectations) {
    if (
      !mulangInspection ||
      typeof mulangInspection.inspection !== "string" ||
      typeof mulangInspection.binding !== "string"
    ) {
      console.warn(
        "Skipping malformed Mulang inspection entry:",
        mulangInspection
      );
      continue;
    }

    let inspectionName = mulangInspection.inspection;
    let expected = true;
    const args: Record<string, unknown> = { name: mulangInspection.binding };

    if (inspectionName.startsWith("Not:")) {
      expected = false;
      inspectionName = inspectionName.substring(4);
    }

    if (inspectionName.startsWith("Uses:")) {
      const usageArg = inspectionName.substring("Uses:".length);
      inspectionName = "Uses";
      args.usage = usageArg;
    }

    inspectionRules.push({
      inspection: inspectionName,
      args: args,
      expected: expected,
    });
  }

  return inspectionRules;
}

export function isGuardedBody(
  declaration: Omit<FunctionDeclaration, "name" | "type">
): declaration is GuardedFunctionDeclaration {
  return declaration.attributes.includes("GuardedBody");
}

export function isUnguardedBody(
  declaration: Omit<FunctionDeclaration, "name" | "type">
): declaration is UnguardedFunctionDeclaration {
  return declaration.attributes.includes("UnguardedBody");
}
