import txStrToObj from './txStrToObj';
import excelUploadToJSON from './excelUploadToJSON';
import getUploadedFile from './getUploadedFile';
import handleNextTransaction from './handleNextTransaction';
const prettify = require('./prettify');


let globalTransactionsData;
let globalBalanceState;

const nextStateButton = document.querySelector('#next-state');
nextStateButton.addEventListener('click', (e) => handleNextTransaction(e, globalTransactionsData, globalBalanceState));

document.querySelector('form').addEventListener('submit', async function submitHandler(e) {
  e.preventDefault();

  // will be populated with files the user submits
  let withdrawsArray = [];
  let depositsArray = [];
  let tradesArray = [];

  // TODO: maybe check that file is .xlsx or .csv
  let withdrawsFile = getUploadedFile('#bnbWithdrawsCSV');
  let depositsFile = getUploadedFile('#bnbDepositsCSV');
  let tradesFile = getUploadedFile('#bnbTradeHistory');

  if(withdrawsFile) {
    withdrawsArray = prettify.binance.withdraw( await excelUploadToJSON(withdrawsFile) );
  }
  if(depositsFile) {
    depositsArray = prettify.binance.deposit( await excelUploadToJSON(depositsFile) );
  }
  if(tradesFile) {
    tradesArray = prettify.binance.trades( await excelUploadToJSON(tradesFile) );
  }

  console.log('withdrawsarray:', withdrawsArray);
  console.log('depositsArray:', depositsArray);
  console.log('tradesarray:', tradesArray);

  // let uploadedFile = getUploadedFile('input[type="file"]');
  // if(!uploadedFile) {
  //   // console.log('No file uploaded.');
  //   globalTransactionsData = allDepositsAndWithdraws;
  //   globalBalanceState = {};
  //   revealNextStateButton();
  //   return;
  // }

  //
  // let allDepsWithsAndTrades = allDepositsAndWithdraws.concat(tradeArr).sort((trx1, trx2) => trx1.date - trx2.date);
  // console.log(allDepsWithsAndTrades);
  // globalTransactionsData = allDepsWithsAndTrades;
  // globalBalanceState = {};
  // revealNextStateButton();
});

function revealNextStateButton() {
  document.getElementById('next-state').style.display = 'inline';
}
