data Datita = UnDatita
  { atributito :: String,
    atributote :: Int
  }

type Number = Int

datita :: Datita
datita = UnDatita {atributito = "Hola", atributote = 42}

datita2 :: Datita
datita2 = UnDatita "Hola" 42

numInt :: Int
numInt = 42

-- Floating-point numbers
numFloat :: Double
numFloat = 3.14159

-- Characters
charA :: Char
charA = 'A'

-- Strings (list of characters)
stringHello :: String
stringHello = "Hello, Haskell!"

-- Booleans
boolTrue :: Bool
boolTrue = True

-- 4. Simple function definition
-- Function to add two integers
addTwoNumbers :: Int -> Int -> Int
addTwoNumbers x y = x + y

greet :: String -> String
greet "Alice" = "Hello, Alice!"
greet "Bob" = "Hi there, Bob!"
greet name = "Greetings, " ++ name ++ "!"