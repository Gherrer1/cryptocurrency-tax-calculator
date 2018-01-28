import txStrToObj from './txStrToObj';
import excelUploadToJSON from './excelUploadToJSON';
import getUploadedFile from './getUploadedFile';

console.log('hey');

const form = document.querySelector('form');
form.addEventListener('submit', function(e) {
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
  console.log('all deposits/withdraws:', allTrxs);

  let uploadedFile = getUploadedFile('input[type="file"]');
  if(!uploadedFile) {
    console.log('No file uploaded.');
    return;
  }
  excelUploadToJSON(uploadedFile)
  .then(json => console.log('jrx json:', json));
});
