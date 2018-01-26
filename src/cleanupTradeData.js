const _ = require('lodash');

const publicAPI = {
  removeCancelledOrders
};

module.exports = publicAPI;

function removeCancelledOrders(orders) {
  if(!(orders && typeof orders === 'object' && orders.constructor === Array))
    throw new Error('first argument should be an array of objects');
  const ordersCopy = _.cloneDeep(orders);
  return ordersCopy.filter( data => data.status ? data.status !== 'Canceled' : true );
}
