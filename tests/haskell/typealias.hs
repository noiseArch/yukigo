type Age = Int

type Name = String

type Person = (Name, Age)

type IntTransformer = Int -> Int

type BinaryOp = Int -> Int -> Int

-- Identity function with type alias
idInt :: IntTransformer
idInt x = x

-- Function using type aliases
createPerson :: Name -> Age -> Person
createPerson name age = (name, age)

-- Higher-order function using aliases
applyTwice :: IntTransformer -> Int -> Int
applyTwice f x = f (f x)

-- Function composition with aliases
composeTransformers :: IntTransformer -> IntTransformer -> IntTransformer
composeTransformers f g = f . g

-- Binary operation using alias
add :: BinaryOp
add x y = x + y

-- Using higher-order functions with aliases
example1 :: Int
example1 = applyTwice idInt 5

example2 :: IntTransformer
example2 x = composeTransformers idInt (add 1) x

-- Complex example with all features
processPerson :: Person -> Person
processPerson (name, age) = (name, applyTwice (add 1) age)