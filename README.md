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
yarn analyse <filepath> <tests>
```

> Note: This feature is still in development,
