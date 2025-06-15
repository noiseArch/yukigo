squareList :: [Int] -> [Int]
squareList xs = map (\n -> n * n) xs

square :: Int -> Int
square n = n * n

squareList2 :: [Int] -> [Int]
squareList2 = map square
