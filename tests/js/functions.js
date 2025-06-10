// functionsScope.js - Tests different function types and scope concepts

// Function declaration
function greet(name) {
    return "Hello, " + name + "!";
}
console.log(greet("Alice"));

// Function expression
const farewell = function(name) {
    return `Goodbye, ${name}.`;
};
console.log(farewell("Bob"));

// Arrow function (single expression)
const multiply = (a, b) => a * b;
console.log("Multiply:", multiply(5, 4));

// Arrow function (block body)
const calculateArea = (length, width) => {
    const area = length * width;
    return `The area is ${area}.`;
};
console.log(calculateArea(10, 5));

// Function with default parameters
function power(base, exponent = 2) {
    return base ** exponent;
}
console.log("Power (default):", power(3));      // 3^2 = 9
console.log("Power (custom):", power(2, 3));    // 2^3 = 8

// Rest parameters
function sumAll(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}
console.log("Sum all:", sumAll(1, 2, 3, 4, 5));

// Closures
function makeAdder(x) {
    return function(y) {
        return x + y;
    };
}
const addFive = makeAdder(5);
console.log("Closure add five:", addFive(10)); // 15

// 'this' keyword in different contexts
const obj = {
    value: 42,
    getValue: function() {
        console.log("this.value in method:", this.value);
    }
};
obj.getValue();

const anotherObj = {
    value: 100,
    // Arrow functions capture 'this' from their lexical scope (not dynamic)
    getArrowValue: () => {
        // 'this' here refers to the global object (or undefined in strict mode)
        console.log("this.value in arrow function:", this.value);
    }
};
anotherObj.getArrowValue(); // Will likely log undefined or window.value in browser

// Immediately Invoked Function Expression (IIFE)
(function() {
    let message = "This runs immediately.";
    console.log(message);
})();
