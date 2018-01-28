const assert = require('chai').assert;
const _ = require('lodash');
const cleanupTradeData = require('../src/cleanupTradeData');

describe('cleanupTradeData', function() {
  let originalArr;
  beforeEach(function() {
    originalArr = [
      {
          "Date": "2017-12-22 03:05:55",
          "Pair": "XRPBTC",
          "Type": "BUY",
          "Order Price": "0.000085",
          "Order Amount": "550.0",
          "Avg Trading Price": "0.00008498",
          "Filled": "550.0",
          "Total": "0.046739",
          "status": "Filled"
      },
      {
          "Pair": "Date",
          "Type": "Trading Price",
          "Order Price": "Filled",
          "Order Amount": "Total",
          "Avg Trading Price": "Fee"
      },
      {
          "Pair": "2017-12-22 03:05:55",
          "Type": "0.00008498",
          "Order Price": "550",
          "Order Amount": "0.04673900",
          "Avg Trading Price": "0.55000000XRP"
      },
      {
          "Date": "2017-12-22 03:01:19",
          "Pair": "XRPBTC",
          "Type": "BUY",
          "Order Price": "0.00008899",
          "Order Amount": "525.0",
          "Avg Trading Price": "0.0",
          "Filled": "0.0",
          "Total": "0.0",
          "status": "Canceled"
      }];
  });
  describe('removeCancelledOrders', function() {
    it('should throw error if first argument isnt array', function() {
      assert.throws(cleanupTradeData.removeCancelledOrders, /first argument should be an array of objects/);
    });
    it('should not throw error if first argument is array', function() {
      assert.doesNotThrow(cleanupTradeData.removeCancelledOrders.bind(null, []));
    });
    it('should not alter the original array', function() {
      const ogClone = _.cloneDeep(originalArr);
      cleanupTradeData.removeCancelledOrders(originalArr);
      assert.deepEqual(originalArr, ogClone);
    });
    it('should return a copy of array, whether it altered it or not', function() {
      let cleanedUpData = cleanupTradeData.removeCancelledOrders(originalArr);
      assert.isArray(cleanedUpData);
      assert.notStrictEqual(cleanedUpData, originalArr);
    });
    it('should remove objects whose status === "Canceled" from trade data array', function() {
      let ordersCopy = _.cloneDeep(originalArr);
      ordersCopy.pop();
      // because in our test array, last element's status === "Canceled"
      let cleanedUpData = cleanupTradeData.removeCancelledOrders(originalArr);
      assert.deepEqual(cleanedUpData, ordersCopy);
    });
    it('should leave array untouched if it doesnt contain any objects whose status === "cancelled"', function() {
      originalArr.pop();  // because in our test array, last element's status === "Canceled"
      let cleanedUpData = cleanupTradeData.removeCancelledOrders(originalArr);
      assert.deepEqual(cleanedUpData, originalArr);
    });
  });
  describe('consolidateFilledOrders', function() {

  });
});
