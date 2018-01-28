import splitCoinAndAmount from './splitCoinAndAmount';
import isoFormat from './isoFormat';
/**
 * @param line A line in the form of '[Deposit/Withdraw] [status] [coinAndAmount] [date]'
 * @return {Object} An object representing the string passed in in the form of { date, type, currency, amount }
 */
export default function txStrToObj(line) {
  let [type, _, coinAndAmount, dateStr, timeStr] = line.split(' ');
  let date = isoFormat(dateStr, timeStr);
  let { currency, amount } = splitCoinAndAmount(coinAndAmount);
  let obj = {
    date, type, currency, amount
  };
  return obj
}
