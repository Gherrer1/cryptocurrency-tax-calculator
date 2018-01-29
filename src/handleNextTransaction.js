export default function handleNextTransaction(event, transactions, balance) {
  if(!transactions || !balance) return;

  if(transactions.length === 0) return console.log('No transactions left');

  let nextEarliestTransaction = transactions.shift();
  if(nextEarliestTransaction.type === 'Withdraw')
    handleWithdraw(nextEarliestTransaction, balance);
  else if(nextEarliestTransaction.type === 'Deposit')
    handleDeposit(nextEarliestTransaction, balance);

  console.log(nextEarliestTransaction);
  console.log(balance);
}

function handleDeposit(transaction, balance) {
  let {currency} = transaction;
  if(!balance[currency]) {
    balance[currency] = 0;
  }

  balance[currency] += transaction.amount;
}

function handleWithdraw(transaction, balance) {
  let {currency} = transaction;
  if(!balance[currency]) {
    balance[currency] = 0;
  }

  balance[currency] -= transaction.amount;
}
