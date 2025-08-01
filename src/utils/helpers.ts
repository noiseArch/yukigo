import {
  FunctionDeclaration,
  GuardedFunctionDeclaration,
  UnguardedFunctionDeclaration,
} from "../parser/paradigms/functional";

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
