const accountHolder = "Alice";
let accountBalance = 1500.75;
let depositAmount = 250;
let withdrawalAmount = 100;

// Deposit money
accountBalance = accountBalance + depositAmount;

// Withdraw money
accountBalance = accountBalance - withdrawalAmount;

// Check if balance is sufficient for a large withdrawal
let canWithdraw = accountBalance >= 1000;