// es6Features.js - Tests modern JavaScript features (ES6 and beyond)

// 1. let and const (block scoping)
if (true) {
    var oldVar = "I'm function scoped";
    let newLet = "I'm block scoped";
    const newConst = "I'm also block scoped and cannot be reassigned";
    console.log(oldVar);
    console.log(newLet);
    console.log(newConst);
}
console.log(oldVar); // Accessible
// console.log(newLet); // ReferenceError: newLet is not defined
// console.log(newConst); // ReferenceError: newConst is not defined

// 2. Arrow Functions (covered in functionsScope.js, but included for completeness)
const square = num => num * num;
console.log("Square of 7:", square(7));

// 3. Template Literals
const item = "laptop";
const price = 1200;
const description = `The ${item} costs $${price}.
It's a great deal!`;
console.log(description);

// 4. Destructuring Assignment (Arrays)
const coordinates = [10, 20, 30];
const [x, y, z] = coordinates;
console.log(`X: ${x}, Y: ${y}, Z: ${z}`);

// 5. Destructuring Assignment (Objects)
const book = { title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925 };
const { title, author } = book;
console.log(`Book: "${title}" by ${author}`);

// Renaming during destructuring
const { year: publicationYear } = book;
console.log(`Publication Year: ${publicationYear}`);

// 6. Spread Operator (...) for arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5];
const combinedArray = [...arr1, ...arr2, 6, 7];
console.log("Combined array:", combinedArray);

// 7. Spread Operator (...) for objects
const user = { name: "Mike", email: "mike@example.com" };
const updatedUser = { ...user, age: 40, email: "mike.new@example.com" };
console.log("Updated user:", updatedUser);

// 8. Rest Parameters (covered in functionsScope.js, but included for completeness)
function sumNumbers(first, ...rest) {
    console.log("First number:", first);
    console.log("Remaining numbers:", rest);
}
sumNumbers(1, 2, 3, 4, 5);

// 9. Default Parameters (covered in functionsScope.js, but included for completeness)
function greetPerson(name = "Guest") {
    console.log(`Hello, ${name}!`);
}
greetPerson();
greetPerson("Sophia");

// 10. Modules (import/export) - This requires a module system,
//    but the syntax itself can be parsed.
// export const PI = 3.14;
// export function circumference(radius) {
//     return 2 * PI * radius;
// }
// import { PI, circumference } from './math.js';
// console.log(PI);
// console.log(circumference(10));

// 11. Optional Chaining (?.) - ES2020
const userProfile = {
    name: "Jane",
    address: {
        street: "123 Main St",
        city: "Anytown"
    },
    contact: null
};

console.log("User street (optional chaining):", userProfile.address?.street);
console.log("User zip code (optional chaining):", userProfile.address?.zipCode); // undefined
console.log("User phone (optional chaining):", userProfile.contact?.phone); // undefined

// 12. Nullish Coalescing Operator (??) - ES2020
const userName = null;
const defaultName = "Anonymous";
const displayUserName = userName ?? defaultName;
console.log("Display user name:", displayUserName);

const zeroValue = 0;
const defaultZero = 100;
const displayZero = zeroValue ?? defaultZero;
console.log("Display zero value (nullish coalescing):", displayZero); // 0 (not 100 because 0 is not null/undefined)
