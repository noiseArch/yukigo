-- 3. Basic data types and values
-- Integers
type Number = Int

data Datita = UnDatita {
  atributito :: String,
  atributote :: Number
}

datita :: Datita
datita = UnDatita {atributito = "Hola", atributote = 42}

datita' :: Datita
datita' = UnDatita "Hola" 42

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

-- 5. Function with pattern matching
-- Function to get the greeting based on a name
greet :: String -> String
greet "Alice" = "Hello, Alice!"
greet "Bob" = "Hi there, Bob!"
greet name = "Greetings, " ++ name ++ "!"

-- Example using anonymous variable (_)
-- Function that checks if a string is "secret", ignoring the second argument
isSecret :: String -> a -> Bool
isSecret "secret" _ = True
isSecret _ _ = False

-- 6. List definition and operations
myNumbers :: [Int]
myNumbers = [1, 2, 3, 4, 5]

-- Calculate the sum of elements in a list
sumList :: [Int] -> Int
sumList xs = sum xs

-- Get the length of a list
listLength :: [a] -> Int
listLength xs = length xs

-- Map a function over a list (e.g., squaring each element)
squareList :: [Int] -> [Int]
squareList xs = map (\n -> n * n) xs

-- 7. If-Else expression (Haskell's if is an expression, not a statement)
isEven :: Int -> String
isEven n =
  if n `mod` 2 == 0
    then "Even"
    else "Odd"

-- 8. `let` expression (for local bindings)
-- calculateArea :: Double -> Double
-- calculateArea radius =
--   let piVal = 3.14159; area = piVal * radius * radius; in area

---- 9. `where` clause (another way for local bindings, often used with functions)
-- circumference :: Double -> Double
-- circumference radius = 2 * piVal * radius
--   where piVal = 3.14159;

-- 10. Function using guards
grade :: Int -> String
grade score
  | score >= 90 = "Excellent"
  | score >= 75 = "Good"
  | score >= 60 = "Pass"
  | otherwise = "Fail"

{-
This is a
multi-line comment block
in Haskell.
-}