class UnDatita {
  constructor(atributito, atributote) {
    this.atributito = atributito; this.atributote = atributote;
  }
};
const datita = () => new UnDatita("Hola", 42);

const datita2 = () => UnDatita("Hola", 42);

const numInt = () => 42;

const numFloat = () => 3.14159;

const charA = () => 'A';

const stringHello = () => "Hello, Haskell!";

const boolTrue = () => true;

const addTwoNumbers = (x, y) => x + y;

const greet = ("Alice") => "Hello, Alice!";

const greet = ("Bob") => "Hi there, Bob!";

const greet = (name) => "Greetings, " ++ undefined;
