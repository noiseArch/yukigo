--squareList :: [Int] -> [Int]
--squareList xs = map (\n -> n * n) xs

type Number = Int
type NumberOp = Int -> Int

square :: Int -> Int
square n = n * n

doble :: Int -> String -> Int
doble y str = y * 2

dobleTupla :: (Int, Int) -> (Int, Int)
dobleTupla (x1,x2) = (x1*2, x2*2)

concatenation :: [String] -> [String] -> [String]
concatenation str1 str2 = str1 ++ str2

concatTupla :: (String, String) -> String
concatTupla (x1, x2) = x1 ++ x2

--getEvens :: [Int] -> [Int]
--getEvens = filter even
--
--squareList2 :: [Int] -> [Int]
--squareList2 = map square
