const _ = require('lodash');
import isoFormat from '../isoFormat';
import splitFeeAndCoin from '../splitFeeAndCoin';
import splitTradePairsStr from '../splitTradePairs';

function prettifyTradeJSON(transactionJSON) {
  return consolidateFillData( removeCancelledOrders(transactionJSON) );
}

function fluffActualOrderObject(_orderObj) {
  const orderObj = Object.create(null);
  orderObj.type = _orderObj.Type;
  const [lhs, rhs] = splitTradePairsStr(_orderObj.Pair);
  orderObj.lhs = lhs;
  orderObj.rhs = rhs;
  orderObj.filled = Number(_orderObj.Filled);
  orderObj.orderAmount = Number(_orderObj['Order Amount']);
  orderObj.total = Number(_orderObj.Total);
  orderObj.exchange = 'binance';
  orderObj.fillDetails = [];
  orderObj.orderPrice = Number(_orderObj['Order Price']);
  let [dateStr, timeStr] = _orderObj.Date.split(' ');
  orderObj.date = isoFormat(dateStr, timeStr);

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

function commonDepositAndWithdrawPrettifier(type, json) {
  let newJSON = _.cloneDeep(json).filter(obj => obj.Status === 'Completed').map(obj => {
    delete obj.Address;
    delete obj.TXID;
    obj.type = type;
    obj.date = isoFormat(...obj.Date.split(' '));
    delete obj.Date;
    return obj;
  });

  return newJSON;
}



const binancePrettifyAPI = {
  deposit: commonDepositAndWithdrawPrettifier.bind(null, 'Deposit'),
  withdraw: commonDepositAndWithdrawPrettifier.bind(null, 'Withdraw'),
  trades: prettifyTradeJSON
};

module.exports = binancePrettifyAPI;
