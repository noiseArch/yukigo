// objectsClasses.js - Tests object literals, constructors, and ES6 classes

// Object literal
const car = {
    make: "Toyota",
    model: "Camry",
    year: 2020,
    start: function() {
        console.log(`${this.make} ${this.model} starting...`);
    },
    // Shorthand method definition
    stop() {
        console.log("Car stopped.");
    },
    // Getter
    getCarInfo() {
        return `${this.year} ${this.make} ${this.model}`;
    }
};
console.log("Car make:", car.make);
car.start();
console.log("Car info:", car.getCarInfo());

// Property assignment
car.color = "Blue";
console.log("Car color:", car.color);

// Deleting a property
delete car.year;
console.log("Car year after deletion:", car.year); // undefined

// Constructor function (pre-ES6 class syntax)
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.sayHello = function() {
        console.log(`Hi, my name is ${this.name} and I'm ${this.age} years old.`);
    };
}
const person1 = new Person("Eve", 25);
person1.sayHello();

// ES6 Class definition
class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log(`${this.name} makes a sound.`);
    }

    static intro() {
        console.log("This is the Animal class.");
    }
}

const dog = new Animal("Buddy");
dog.speak();
Animal.intro(); // Static method call

// Class inheritance
class Dog extends Animal {
    constructor(name, breed) {
        super(name); // Call parent class constructor
        this.breed = breed;
    }

    speak() {
        console.log(`${this.name} barks!`); // Override parent method
    }

    fetch() {
        console.log(`${this.name} is fetching the ball.`);
    }
}

const poodle = new Dog("Max", "Poodle");
poodle.speak();
poodle.fetch();
console.log("Poodle breed:", poodle.breed);

// Class with private fields (using # prefix - ES2020+)
class Counter {
    #count = 0; // Private field

    increment() {
        this.#count++;
    }

    getCount() {
        return this.#count;
    }
}

const myCounter = new Counter();
myCounter.increment();
myCounter.increment();
console.log("Counter value:", myCounter.getCount());
// console.log(myCounter.#count); // This would cause a syntax error
