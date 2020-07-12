/*
Unit tests for Decentralised MarketPlace contract
*/
var Market = artifacts.require('./Market.sol');

contract('Market', function (accounts) {
  //specify the smart contract test values here
  const $test_item_uid = 1;
  const $test_item_name = 'Mastering Blockchain Pdf';
  const $test_item_seller = accounts[0];
  const $test_item_price = 10000000000;
  const $buyer_address = accounts[2];

  const $test_create_item_uid = 2;
  const $test_create_item_name = 'Mastering AI Pdf';
  const $test_create_item_seller = accounts[0];
  const $test_create_item_price = 100000000000;
  const $test_create_item_link = 'QmdY29M2jcGRUYYnvUnAj8qwWMHyhsku2unC2mweqMkGDb';

  //test for contract initialisation
  it('Test for Initial Asset', function () {
    return Market.deployed()
      .then(function (instance) {
        MarketInstance = instance;
        return MarketInstance.items(1);
      })
      .then(function (_response) {
        assert.equal(_response.uid.toNumber(), $test_item_uid, 'UID has been assigned correctly');
        assert.equal(_response.name, $test_item_name, 'name has been assigned correctly');
        assert.equal(_response.price.toNumber(), $test_item_price, 'price has been assigned correctly');
        assert.equal(_response.seller, $test_item_seller, 'seller has been assigned correctly');
      });
  });

  //test for createItem function
  it('Test for createItem function', function () {
    return Market.deployed()
      .then(function (instance) {
        MarketInstance = instance;
        return MarketInstance.createItem.call($test_create_item_name, $test_create_item_price, $test_create_item_link, {
          from: $test_create_item_seller,
        });
      })
      .then(function (_res) {
        assert.equal(_res, true, 'Item create call returns success!');
        return MarketInstance.createItem($test_create_item_name, $test_create_item_price, $test_create_item_link, { from: $test_create_item_seller });
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'ItemCreated', 'should be the "ItemCreated" event');
        assert.equal(receipt.logs[0].args._uid, $test_create_item_uid, 'created the uid correctly');
        // verify the details of created item
        return MarketInstance.items($test_create_item_uid);
      })
      .then(function (_response) {
        assert.equal(_response.uid.toNumber(), $test_create_item_uid, 'UID has been assigned correctly');
        assert.equal(_response.name, $test_create_item_name, 'name has been assigned correctly');
        assert.equal(_response.price.toNumber(), $test_create_item_price, 'price has been assigned correctly');
        assert.equal(_response.seller, $test_create_item_seller, 'seller has been assigned correctly');
      });
  });

  //test for purchaseItem function
  it('Test for purchaseItem function', function () {
    return Market.deployed()
      .then(function (instance) {
        MarketInstance = instance;
        // test for purchase with no price
        return MarketInstance.purchaseItem.call($test_create_item_uid, { from: $buyer_address });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(error.message.indexOf('revert') >= 0, 'error message must have revert');
        // test for purchase with higher price
        return MarketInstance.purchaseItem.call($test_create_item_uid, { from: $buyer_address, value: $test_create_item_price + 100 });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(error.message.indexOf('revert') >= 0, 'error message must have revert');
        // test for purchase with lower price
        return MarketInstance.purchaseItem.call($test_create_item_uid, { from: $buyer_address, value: $test_create_item_price - 100 });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(error.message.indexOf('revert') >= 0, 'error message must have revert');
        // test for purchase with correct price
        return MarketInstance.purchaseItem.call($test_create_item_uid, { from: $buyer_address, value: $test_create_item_price });
      })
      .then(function (_res) {
        assert.equal(_res, true, 'Item purchase call returns success!');
        // test purchase item receipt with correct price
        return MarketInstance.purchaseItem($test_create_item_uid, { from: $buyer_address, value: $test_create_item_price });
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Purchase', 'should be the "Purchase" event');
        assert.equal(receipt.logs[0].args._uid, $test_create_item_uid, 'returned the uid correctly');
        assert.equal(receipt.logs[0].args._link, $test_create_item_link, 'returned the link correctly');
        // test that the seller balance has been incremented
        return MarketInstance.seller_balance($test_create_item_seller);
      })
      .then(function (_res) {
        assert.equal(_res, $test_create_item_price, 'Seller balance has been incremented correctly!');
      });
  });

  //test for withdrawBalance function
  it('Test for withdrawBalance function', function () {
    return Market.deployed()
      .then(function (instance) {
        MarketInstance = instance;
        // test for withdrawal with no balance
        return MarketInstance.withdrawBalance.call({ from: accounts[3] });
      })
      .then(assert.fail)
      .catch(function (error) {
        //console.log(error);
        assert(error.message.indexOf('revert') >= 0, 'error message must have revert');
        // test for withdrawal with balance
        return MarketInstance.withdrawBalance.call({ from: $test_create_item_seller });
      })
      .then(function (_res) {
        assert.equal(_res, true, 'withdraw balance call returns success!');
        // test purchase item receipt with correct price
        return MarketInstance.withdrawBalance({ from: $test_create_item_seller });
      })
      .then(function (receipt) {
        // test if the seller balance has been cleared after withdraw
        return MarketInstance.seller_balance($test_create_item_seller);
      })
      .then(function (_res) {
        assert.equal(_res, 0, 'Seller balance has been cleared correctly!');
      });
  });
});
