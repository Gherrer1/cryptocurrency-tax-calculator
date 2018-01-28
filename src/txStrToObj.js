import splitCoinAndAmount from './splitCoinAndAmount';
/**
 * @param line A line in the form of '[Deposit/Withdraw] [status] [coinAndAmount] [date]'
 * @return {Object} An object representing the string passed in in the form of { date, type, currency, amount }
 */
export default function txStrToObj(line) {
  let [type, _, coinAndAmount, date] = line.split(' ');
  let { currency, amount } = splitCoinAndAmount(coinAndAmount);
  let obj = {
    date, type, currency, amount
  };
  return obj
}
