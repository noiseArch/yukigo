-- Polymorphic identity function
identity :: a -> a
identity x = x

-- Using id with a specific type
useId :: Int -> Int
useId n = identity n

-- Higher-order function application (apply)
apply :: (a -> b) -> a -> b
apply f x = f x

-- Function to use with 'apply'
addOne :: Int -> Int
addOne x = x + 1

-- Using the higher-order function
useApply :: Int -> Int
useApply y = apply addOne y

-- Polymorphic function with tuples
swap :: (a, b) -> (b, a)
swap (x, y) = (y, x)

-- Using swap with concrete types
useSwap :: (Int, String) -> (String, Int)
useSwap p = swap p