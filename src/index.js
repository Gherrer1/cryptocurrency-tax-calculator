import txStrToObj from './txStrToObj';
import excelUploadToJSON from './excelUploadToJSON';
import getUploadedFile from './getUploadedFile';
import prettifyBinanceJSON from './prettify/binance';
import handleNextTransaction from './handleNextTransaction';

(function onlyForDevSpoofedData() {
  let withdrawsTextArea = document.querySelector('textarea[name="bnbWithdraws"]');
  withdrawsTextArea.value = 'Completed NEO2 2018-01-28 01:34:12\nAddress:	ALMNUm9PojHYyuszEjetobpuPdgmqDzjHd\n' +
    'Completed BCC0.049 2018-01-27 14:59:15\nAddress:	1BiGPLqp98ZRZYBX8ffxk5Vh2Jqpu7Gip3\n' +
    'Completed WAVES29.048 2018-01-25 02:13:05\nAddress:	3PBfbYphPpGf5mkFi4iMYhwrsry5UMnZ8me';
  let depositsTextArea = document.querySelector('textarea[name="bnbDeposits"]');
  depositsTextArea.value = 'Completed WAVES27.72575337 2018-01-25 03:09:48\nAddress:	3P3hjd8WA5CAMAcaoUy5rvDTad4jSza2fgb\n' +
    'Completed ETH0.10179364 2018-01-16 18:57:34\nAddress:	0xb9b571bae6875f2cf98b6d7816e0164c15a96e7f\n' +
    'Completed LTC6.3872484 2017-12-22 23:01:42\nAddress:	LeZy9LyjY8PJob7ijpqDWs5QKLJvcHjUjx\n' +
    'Completed LTC6.5 2017-12-22 22:44:37\nAddress:	LeZy9LyjY8PJob7ijpqDWs5QKLJvcHjUjx\n' +
    'Completed BTC0.04679878 2017-12-21 21:30:57\nAddress:	1FQKeT74XyYZP17a1XoMcoCbHaJ1bkVnx5';
})();

let globalTransactionsData;
let globalBalanceState;

const nextStateButton = document.querySelector('#next-state');
nextStateButton.addEventListener('click', (e) => handleNextTransaction(e, globalTransactionsData, globalBalanceState));

const form = document.querySelector('form');
form.addEventListener('submit', async function submitHandler(e) {
  e.preventDefault();

  let withdraws = document.querySelector('textarea[name="bnbWithdraws"]');
  let deposits = document.querySelector('textarea[name="bnbDeposits"]');

  let withdrawsArr = withdraws.value.split('\n').filter(line => line.match(/^Completed/))
                    .map(line => `Withdraw ${line}`).map(txStrToObj);
  let depositsArr = deposits.value.split('\n').filter(line => line.match(/^Completed/))
                    .map(line => `Deposit ${line}`).map(txStrToObj);
  let allDepositsAndWithdraws = depositsArr.concat(withdrawsArr).sort((trx1, trx2) => trx1.date - trx2.date);
  // console.log('all deposits/withdraws:', allDepositsAndWithdraws);

  let uploadedFile = getUploadedFile('input[type="file"]');
  if(!uploadedFile) {
    // console.log('No file uploaded.');
    globalTransactionsData = allDepositsAndWithdraws;
    globalBalanceState = {};
    revealNextStateButton();
    return;
  }
  let tradeArr = await excelUploadToJSON(uploadedFile);
  tradeArr = prettifyBinanceJSON(tradeArr);

  let allDepsWithsAndTrades = allDepositsAndWithdraws.concat(tradeArr).sort((trx1, trx2) => trx1.date - trx2.date);
  console.log(allDepsWithsAndTrades);
  globalTransactionsData = allDepsWithsAndTrades;
  globalBalanceState = {};
  revealNextStateButton();
});

function revealNextStateButton() {
  document.getElementById('next-state').style.display = 'inline';
}
