import txStrToObj from './txStrToObj';
import excelUploadToJSON from './excelUploadToJSON';
import getUploadedFile from './getUploadedFile';
import prettifyBinanceJSON from './prettify/binance';
import handleNextTransaction from './handleNextTransaction';


let globalTransactionsData;
let globalBalanceState;

const nextStateButton = document.querySelector('#next-state');
nextStateButton.addEventListener('click', (e) => handleNextTransaction(e, globalTransactionsData, globalBalanceState));

const form = document.querySelector('form');
form.addEventListener('submit', async function submitHandler(e) {
  e.preventDefault();

  let withdraws = document.querySelector('textarea[name="bnbWithdraws"]');
  let deposits = document.querySelector('textarea[name="bnbDeposits"]');

  let withdrawsArr = withdraws.value.split('\n')
    .filter(line => line.match(/^Completed/))
    .map(line => `Withdraw ${line}`)
    .map(txStrToObj);
  let depositsArr = deposits.value.split('\n')
    .filter(line => line.match(/^Completed/))
    .map(line => `Deposit ${line}`)
    .map(txStrToObj);
  let allTrxs = depositsArr.concat(withdrawsArr).sort((trx1, trx2) => trx1.date - trx2.date);
  // console.log('all deposits/withdraws:', allTrxs);

  let uploadedFile = getUploadedFile('input[type="file"]');
  if(!uploadedFile) {
    console.log('No file uploaded.');
    globalTransactionsData = allTrxs;
    globalBalanceState = {};
    revealNextStateButton();
    return;
  }
  let transactionJSON = await excelUploadToJSON(uploadedFile);
  transactionJSON = prettifyBinanceJSON(transactionJSON);

  let allDepsWithsAndTrxs = allTrxs.concat(transactionJSON).sort((trx1, trx2) => trx1.date - trx2.date);
  globalTransactionsData = allDepsWithsAndTrxs;
  globalBalanceState = {};
  // add button, each time we click we pop a transaction off stack and edit balance
  revealNextStateButton();
});

function revealNextStateButton() {
  document.getElementById('next-state').style.display = 'inline';
}
