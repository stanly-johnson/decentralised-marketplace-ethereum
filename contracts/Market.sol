pragma solidity ^0.5.0;

contract Market {
    // create a object for the storing items
    struct Item {
        uint uid;
        string name;
        uint256 price;
        address seller;
    }

    struct ItemDetail {
        uint uid;
        string link;
    }

    // event to signal purchase
    event Purchase(uint256 _uid, string _link);

    // event to signal item creation
    event ItemCreated(uint256 _uid);

    // Create map to items list
    mapping(uint => Item) public items;
    // Create map to items list
    mapping(uint => ItemDetail) private itemDetails;
    //store balance payable to each seller
    mapping(address => uint) public seller_balance;

    // Store Items Count
    uint public itemCount;

    constructor () public {
    }


    //function to create new item
    function createItem (string memory _name, uint256 _price, string memory _link) public {
        // create uid for item
        itemCount++;
        // create the item
        items[itemCount] = Item(itemCount, _name, _price, msg.sender);
        itemDetails[itemCount] = ItemDetail(itemCount, _link);
        //trigger item created event
        emit ItemCreated(itemCount);
    }

    function purchaseItem (uint256 _uid) public payable {
        // check if the value sent by caller is equal to price
        require(msg.value == items[_uid].price, "Price Mismatch");
        // credit purchase price to seller balance
        seller_balance[items[_uid].seller] += msg.value;
        // trigger item purchase event
        emit Purchase(_uid, itemDetails[_uid].link);
    }

    function withdrawBalance() public {
        // require that a seller has minimum balance to withdraw
        require(seller_balance[msg.sender] > 0, "Seller Balance is zero");
        // transfer balance
        msg.sender.transfer(seller_balance[msg.sender]);
        // set the seller balance to zero
        seller_balance[msg.sender] = 0;
    }


// end of market smart contract
}

