class Animal {
  speak() {
    return this;
  }
  static eat() {
    return this;
  }
}

const obj = new Animal();
obj.speak(); // the Animal object
const speak = obj.speak;
speak(); // undefined
const x = 17;
const y = x + 4;
Animal.eat(); // class Animal
const eat = Animal.eat;
eat(); // undefined