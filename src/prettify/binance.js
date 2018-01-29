const _ = require('lodash');
import isoFormat from '../isoFormat';
import splitFeeAndCoin from '../splitFeeAndCoin';
import splitTradePairsStr from '../splitTradePairs';

export default function prettifyBinanceJSON(transactionJSON) {
  return consolidateFillData( removeCancelledOrders(transactionJSON) );
}

function fluffActualOrderObject(_orderObj) {
  let orderObj = _.cloneDeep(_orderObj);
  const [lhs, rhs] = splitTradePairsStr(orderObj.Pair);
  delete orderObj.Pair;
  orderObj.lhs = lhs;
  orderObj.rhs = rhs;
  ['Avg Trading Price', 'Filled', 'Order Amount', 'Order Price', 'Total']
    .forEach(fieldWithNumericValue => orderObj[fieldWithNumericValue] = Number(orderObj[fieldWithNumericValue]));
  orderObj.exchange = 'binance';
  orderObj.type = orderObj.Type;
  delete orderObj.Type;
  orderObj.fillDetails = [];
  let [dateStr, timeStr] = orderObj.Date.split(' ');
  orderObj.date = isoFormat(dateStr, timeStr);
  delete orderObj.Date;
  return orderObj;
}

/**
 * _fillDetailsObj will take the following weird shape:
 * { date: orderObj.Pair, tradingPrice: orderObj.Type, filled: orderObj['Order Price'],
 *   total: orderObj['Order Amount'], fee: orderObj['Avg Trading Price'] }
 */
function fluffOrderFillDetailsObject(_fillDetailsObj) {
  let date = _fillDetailsObj.Pair,
      tradingPrice = _fillDetailsObj.Type,
      filled = _fillDetailsObj['Order Price'],
      total = _fillDetailsObj['Order Amount'],
      fee = _fillDetailsObj['Avg Trading Price'];
  let [dateStr, timeStr] = date.split(' ');
  date = isoFormat(dateStr, timeStr);
  let { value, coin } = splitFeeAndCoin(fee);
  fee = { value, coin };
  filled = Number(filled);
  total = Number(total);
  tradingPrice = Number(tradingPrice);

  let fillDetailsObj = { date, fee, filled, total, tradingPrice };
  return fillDetailsObj
}

function consolidateFillData(orders) {
  const consolidatedData = [];
  orders.forEach(orderObj => {
    if(orderObj.status && orderObj.status === 'Filled') {
      let preppedOrderObj = fluffActualOrderObject(orderObj);
      return consolidatedData.push(preppedOrderObj);
    }
    // binance spreadsheet subheaders, not needed
    if(orderObj.Pair === 'Date') return;
    // Data on how the order was filled - add to last order because it corresponds to the order row above it
    if(!orderObj.status) {
      let lastOrder = consolidatedData[consolidatedData.length - 1];
      let preppedFillDetailsObj = fluffOrderFillDetailsObject(orderObj);
      lastOrder.fillDetails.push(preppedFillDetailsObj);
    }
  });

  return consolidatedData;
}

function removeCancelledOrders(orders) {
  if(!(orders && typeof orders === 'object' && orders.constructor === Array))
    throw new Error('first argument should be an array of objects');
  const ordersCopy = _.cloneDeep(orders);
  return ordersCopy.filter( data => data.status ? data.status !== 'Canceled' : true );
}
