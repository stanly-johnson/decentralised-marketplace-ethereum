pragma solidity ^0.5.0;

contract Market {
    // create a object for the storing items
    struct Item {
        uint uid;
        string name;
        uint256 price;
    }

    // create a var to store the store owner address
    address constant public store_owner = address(0x5660df1681a32E70704439E9243b1B91c369580e);

    // Create map to items list
    mapping(uint => Item) public items;

    // Store Items Count
    uint public itemCount;

    constructor () public {
        // create a test candidate
        createItem("BookX", 10000000000000000);
    }

    //funtion to register new candidate
    function createItem (string memory _name, uint256 _price) public {
        // ensure the store owner is the msg.sender
        require(msg.sender == store_owner);
        // create uid for item
        itemCount++;
        // create the item
        items[itemCount] = Item(itemCount, _name, _price);
    }


// end of market smart contract
}

