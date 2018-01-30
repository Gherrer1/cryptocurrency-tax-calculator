import createTableRow from './createTableRow';

export default function fillTable(balance, selector) {
  const tableBody = document.querySelector(selector)
  Object.keys(balance)
    .map(coin => ({ coin, amount: balance[coin].toFixed(8) }))
    .sort((bal1, bal2) => -1 * (bal1.amount - bal2.amount))
    .forEach(({ coin, amount }) => {
    tableBody.appendChild( createTableRow(coin, amount) );
  });
}
