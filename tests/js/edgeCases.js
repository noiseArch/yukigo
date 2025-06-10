// edgeCases.js - Tests various edge cases, comment types, and less common syntax

// 1. Different comment types
/* This is a
   multi-line comment. */
// This is a single-line comment.
/**
 * This is a JSDoc style comment for documentation.
 * @param {string} name - The name to log.
 */
function logName(name) {
    console.log(name); // Inline comment
}
logName("Test");

// 2. Semicolon insertion (parser should handle absence/presence)
let x = 10
let y = 20
console.log(x + y)

// 3. Empty statements
;;; // Multiple empty statements
if (true) { /* empty block */ }
for (let i = 0; i < 3; i++) ; // Empty loop body

// 4. Commas in variable declarations
let a = 1, b = 2, c = 3;
console.log(a, b, c);

// 5. Trailing commas in arrays and objects
const arr = [
    1,
    2,
    3, // Trailing comma
];

const obj = {
    prop1: "value1",
    prop2: "value2", // Trailing comma
};
console.log(arr);
console.log(obj);

// 6. Unicode identifiers (valid in modern JS)
let π = 3.14159;
console.log("Pi:", π);

let café = "coffee shop";
console.log(café);

// 7. Regular expressions
const regex1 = /abc/gi;
const regex2 = new RegExp("xyz", "m");
console.log(regex1.test("ABC"));
console.log(regex2 instanceof RegExp);

// 8. Number literals (different bases)
const dec = 10;
const hex = 0xFF; // Hexadecimal
const oct = 0o10; // Octal
const bin = 0b1010; // Binary
console.log("Dec:", dec, "Hex:", hex, "Oct:", oct, "Bin:", bin);

// 9. Strict mode (affects parsing rules in some cases)
"use strict";
function strictFunction() {
    // let x; // This would be valid
    // y = 10; // This would cause a ReferenceError in strict mode if 'y' is not declared
    // console.log(y);
}
strictFunction();

// 10. Labeled statements
outerLoop: for (let i = 0; i < 5; i++) {
    innerLoop: for (let j = 0; j < 5; j++) {
        if (i * j > 6) {
            console.log(`Breaking from innerLoop at i=${i}, j=${j}`);
            break innerLoop;
        }
        if (i === 3 && j === 3) {
            console.log(`Continuing outerLoop at i=${i}, j=${j}`);
            continue outerLoop;
        }
        console.log(`i: ${i}, j: ${j}`);
    }
}

// 11. `debugger` statement
// debugger; // Parser should recognize this keyword

// 12. `void` operator
console.log(void 0); // undefined
console.log(void "hello"); // undefined

// 13. `with` statement (discouraged, but valid in non-strict mode)
// "use strict"; // If uncommented, this would cause a syntax error
// const data = { value: 10 };
// with (data) {
//     console.log(value); // Accesses data.value
// }
