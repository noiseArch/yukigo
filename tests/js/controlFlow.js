// controlFlow.js - Tests conditional statements and loops

// If-Else If-Else statement
let temperature = 25;
if (temperature > 30) {
    console.log("It's hot!");
} else if (temperature >= 20) {
    console.log("It's warm.");
} else {
    console.log("It's cold.");
}

// Ternary operator
let isRaining = true;
let weatherMessage = isRaining ? "Don't forget your umbrella!" : "Enjoy the sunshine!";
console.log(weatherMessage);

// Switch statement
let dayOfWeek = "Wednesday";
switch (dayOfWeek) {
    case "Monday":
        console.log("Start of the week.");
        break;
    case "Friday":
        console.log("Almost weekend!");
        break;
    case "Saturday":
    case "Sunday":
        console.log("It's the weekend!");
        break;
    default:
        console.log("Just another weekday.");
}

// For loop
console.log("For loop:");
for (let i = 0; i < 5; i++) {
    console.log("Count:", i);
}

// While loop
console.log("While loop:");
let count = 0;
while (count < 3) {
    console.log("While count:", count);
    count++;
}

// Do-While loop
console.log("Do-While loop:");
let j = 0;
do {
    console.log("Do-While count:", j);
    j++;
} while (j < 2);

// For...of loop (for iterable objects like arrays)
console.log("For...of loop:");
const colors = ["red", "green", "blue"];
for (const color of colors) {
    console.log("Color:", color);
}

// For...in loop (for enumerable properties of objects)
console.log("For...in loop:");
const person = { name: "Alice", age: 30 };
for (const key in person) {
    console.log(`${key}: ${person[key]}`);
}
