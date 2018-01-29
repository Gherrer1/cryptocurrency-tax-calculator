/**
 * @param str A string of the form COIN1coin2
 * @return {Array} An array of the form [coin1, coin2]
 */
export default function splitTradePairsStr(str) {
  // wont use this, but in the future we might need to use this so this will
  // serve as a useful reminder that almost all trade pairs are 3 chars long
  let potentialTradePairEnds = {
    BNB: true,
    BTC: true,
    ETH: true
  };

  return [str.substring(0, str.length - 3), str.substring(str.length - 3)];
}
