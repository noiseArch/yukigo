# ❄️ Yukigo (WIP)

> A universal, multi-language, multi-paradigm code analyzer highly inspired in [mulang](https://github.com/mumuki/mulang)

## Components

### **Abstract Semantic Tree:**

A parser that generates a generic AST. This is the intermediate representation of any language. Allows us to analyse the semantics of the code independently of the paradigm.

### **Inspections & EDL (WIP):**

A set of built-in expectations for analysing code and a language for defining custom expectations. Also allows to define custom expectations at runtime.

> TODO: Compatibility with mulang's expectations

### **Testing: (WIP)**

A tester for running tests on the AST

# Usage as NPM package

## Installation

```
npm install yukigo
```

or

```
yarn add yukigo
```

## Usage

```ts
import yukigo from "yukigo";

const code = "doble num = num * 2";
const expectations = [
  {
    inspection: "HasBinding",
    args: { name: "minimoEntre" },
    expected: false,
  },
  {
    inspection: "HasBinding",
    args: { name: "doble" },
    expected: true,
  },
];
const result = yukigo.analyse(code, expectations);

console.log(results);
// [
//   {
//     rule: {
//       inspection: "HasBinding",
//       args: { name: "minimoEntre" },
//       expected: false,
//     },
//     passed: true,
//     actual: false,
//   },
//   {
//     rule: {
//       inspection: "HasBinding",
//       args: { name: "doble" },
//       expected: true,
//     },
//     passed: true,
//     actual: true,
//   },
// ];
```

## Usage with Mulang's Inspections (in a YAML file)

```ts
import yukigo from "yukigo";

const code = `
squareList :: [Int] -> [Int]
squareList xs = map (\n -> n * n) xs

square :: Int -> Int
square n = n * n

squareList2 :: [Int] -> [Int]
squareList2 = map square
`;

// Assuming the expectations are in a yaml file. Implement a way to load the actual file.
const mulangInspections = `
expectations:
- !ruby/hash:ActiveSupport::HashWithIndifferentAccess
  binding: squareList
  inspection: HasBinding
- !ruby/hash:ActiveSupport::HashWithIndifferentAccess
  binding: squareList
  inspection: HasLambdaExpression
- !ruby/hash:ActiveSupport::HashWithIndifferentAccess
  binding: square
  inspection: HasArithmetic
- !ruby/hash:ActiveSupport::HashWithIndifferentAccess
  binding: doble
  inspection: Not:HasBinding
- !ruby/hash:ActiveSupport::HashWithIndifferentAccess
  binding: square
  inspection: Uses:n
- !ruby/hash:ActiveSupport::HashWithIndifferentAccess
  binding: squareList2
  inspection: Uses:map
`;

const expectations = translateMulangToInspectionRules(mulangInspections);

const result = yukigo.analyse(code, expectations);

console.log(results);
// [
//   {
//     rule: { inspection: "HasBinding", args: [Object], expected: true },
//     passed: true,
//     actual: true,
//   },
//   {
//     rule: {
//       inspection: "HasLambdaExpression",
//       args: [Object],
//       expected: true,
//     },
//     passed: true,
//     actual: true,
//   },
//   {
//     rule: { inspection: "HasArithmetic", args: [Object], expected: true },
//     passed: true,
//     actual: true,
//   },
//   {
//     rule: { inspection: "HasBinding", args: [Object], expected: false },
//     passed: true,
//     actual: false,
//   },
//   {
//     rule: { inspection: "Uses", args: [Object], expected: true },
//     passed: true,
//     actual: true,
//   },
//   {
//     rule: { inspection: "Uses", args: [Object], expected: true },
//     passed: true,
//     actual: true,
//   },
// ];
```

# How to use CLI (WIP)

You can parse code to Yukigo's AST with:

```
yarn parse <filepath>
```

Run analysis by using

```
yarn analyse <filepath> <expectations>
```

> Note: This feature is still in development,
> Run tests by using

```
yarn test <filepath> <tests>
```

> Note: This feature is still in development,
