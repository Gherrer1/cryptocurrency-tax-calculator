/**
 * @param str A string that takes this form: COINdecimal_number
 * @return {Object} { currency, amount }
 */
export default function splitCoinAndAmount(str) {
  var match = /\d/.exec(str);
  return {
    currency: str.slice(0, match.index),
    amount: Number(str.slice(match.index))
  };
}
