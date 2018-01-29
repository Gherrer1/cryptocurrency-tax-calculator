/**
 * @param str A string that takes this form: decimal_numberCOIN
 * @return {Object} { value, coin }
 */
export default function splitFeeAndCoin(str) {
  var match = /[a-zA-Z]/.exec(str);
  return {
    value: Number(str.slice(0, match.index)),
    coin: str.slice(match.index)
  };
}
