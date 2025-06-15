# ❄️ Yukigo (WIP)

> A universal, multi-language, multi-paradigm code analyzer highly inspired in [mulang](https://github.com/mumuki/mulang)

## Components

- **Abstract Semantic Tree (AST):** A parser that generates a generic AST from the supported languages
- **Inspections & EDL (WIP):** A set of built-in expectations for analysing code and a language for defining custom expectations
- **Testing: (WIP)** A tester for running tests on the AST

Yukigo is fully compatible with mulang's expectations

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
const expectations = [{ binding: "doble", inspection: "HasBinding" }];
const result = yukigo.analyse(code, expectations);

console.log(results);
// [
//   { inspection: 'HasBinding', binding: 'doble', result: true },
// ]
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
