// asyncError.js - Tests asynchronous operations and error handling

// 1. Try-Catch-Finally block
function divide(a, b) {
    try {
        if (b === 0) {
            throw new Error("Division by zero is not allowed.");
        }
        return a / b;
    } catch (error) {
        console.error("Caught an error:", error.message);
       // return NaN; // Return Not a Number on error
    }
        //} finally {
    //    console.log("Division attempt finished.");
    //}
}