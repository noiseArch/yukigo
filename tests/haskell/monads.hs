square :: Maybe Int -> Int
square (Just n) = n * n
square Nothing  = 0