export default function createTableRow(coin, amount) {
  const tableRowEl = document.createElement('tr');
  const coinCell = document.createElement('td');
  const amountCell = document.createElement('td');
  coinCell.appendChild( document.createTextNode(coin) );
  amountCell.appendChild( document.createTextNode(amount) );
  tableRowEl.appendChild( coinCell );
  tableRowEl.appendChild( amountCell );
  return tableRowEl;
}
