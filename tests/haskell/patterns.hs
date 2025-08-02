-- Basic data types for demonstration
data Color = Red | Green | Blue | RGB Int Int Int
data Shape = Circle Double | Rectangle Double Double
data Person = Person { name :: String, age :: Int }
data Tree a = Leaf | Node a (Tree a) (Tree a)

-- Functions demonstrating pattern matching
-- 1. Constructor patterns & variables
isRed :: Color -> Bool
isRed Red = True
isRed (RGB r _ _) | r > 200 = True  -- Guard with pattern
isRed _ = False

turnRed :: Color -> Color
turnRed _ = RGB 255 0 0

emptyList :: Int -> [Int]
emptyList x = []

twoList :: Int -> [Int]
twoList x = 2 : []

-- 2. Literal patterns & wildcards
checkAnswer :: Int -> String
checkAnswer 42 = "Correct"
checkAnswer _ = "Wrong"

-- 3. List patterns
sumList :: [Int] -> Int
sumList [] = 0
sumList [x] = x  -- Singleton list
sumList (x:y:rest) = x + y + sumList rest

-- 4. Tuple patterns
area :: Shape -> Double
area (Circle r) = pi * r * r / 10
area (Rectangle w h) = w * h

-- 5. As-patterns (@)
duplicateFirst :: [a] -> [a]
duplicateFirst lst@(x:_) = x:lst
duplicateFirst [] = []


-- 10. Pattern guards
describeAge :: Person -> String
describeAge p
  | age p < 13 = "Child"
  | age p < 20 = "Teenager"
  | otherwise = "Adult"

-- 11. Nested patterns
depth :: Tree a -> Int
depth Leaf = 0
depth (Node _ left right) = 1 + max (depth left) (depth right)