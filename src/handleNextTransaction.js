
export default function handleNextTransaction(event, transactions, balance) {
  if(!transactions || !balance) return;

  if(transactions.length === 0) return console.log('No transactions left');

  while(transactions.length > 0) {
    let nextEarliestTransaction = transactions.shift();
    if(nextEarliestTransaction.type === 'Withdraw')
      handleWithdraw(nextEarliestTransaction, balance);
    else if(nextEarliestTransaction.type === 'Deposit')
      handleDeposit(nextEarliestTransaction, balance);
    else if(nextEarliestTransaction.type === 'SELL' || nextEarliestTransaction.type === 'BUY') {
      let selling =  (nextEarliestTransaction.type === 'SELL');
      let depositInfo = {
        currency: nextEarliestTransaction[selling ? 'rhs' : 'lhs'],
        amount: nextEarliestTransaction[selling ? 'total' : 'filled']
      };
      let withdrawInfo = {
        currency: nextEarliestTransaction[selling ? 'lhs' : 'rhs'],
        amount: nextEarliestTransaction[selling ? 'filled' : 'total']
      };
      handleDeposit(depositInfo, balance);
      handleWithdraw(withdrawInfo, balance);
      // fees
      nextEarliestTransaction.fillDetails.forEach(fillDetail => {
        console.log('a fill detail');
        let withdrawInfo = {
          currency: fillDetail.fee.coin,
          amount: fillDetail.fee.value
        };
        handleWithdraw(withdrawInfo, balance);
      });
    }

    console.log(nextEarliestTransaction);
    console.log(balance);
  }
}

function handleDeposit({ currency, amount }, balance) {
  if(!balance[currency]) {
    balance[currency] = 0;
  }

  balance[currency] += amount;
}

function handleWithdraw({ currency, amount }, balance) {
  if(!balance[currency]) {
    balance[currency] = 0;
  }

  balance[currency] -= amount;
}
