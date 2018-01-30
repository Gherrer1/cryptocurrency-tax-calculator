import txStrToObj from './txStrToObj';
import excelUploadToJSON from './excelUploadToJSON';
import getUploadedFile from './getUploadedFile';
import handleNextTransaction from './handleNextTransaction';
import handleAllTransactions from './handleAllTransactions';
import fillTable from './fillTable';
const prettify = require('./prettify');


let globalTransactionsData;
let globalBalanceState;

const nextStateButton = document.querySelector('#next-state');
// nextStateButton.addEventListener('click', (e) => handleNextTransaction(e, globalTransactionsData, globalBalanceState));
nextStateButton.addEventListener('click', (e) => {
  globalBalanceState = handleAllTransactions(e, globalTransactionsData, globalBalanceState);
  fillTable(globalBalanceState, '#table-body');
});

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

  // sort by date
  const allHistoryArray = depositsArray.concat(withdrawsArray).concat(tradesArray).sort((trx1, trx2) => trx1.date - trx2.date);

  globalTransactionsData = allHistoryArray;
  globalBalanceState = {};
  document.getElementById('next-state').style.display = 'inline';
  document.querySelector('table').style.display = 'table';
});
