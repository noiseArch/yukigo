type Number = Int
type NumberOp = Int -> Int

doble :: [Int] -> Int
doble num = num * 2

cuadruple :: Int -> Int
cuadruple = doble . doble