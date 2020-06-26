pragma solidity ^0.5.0;

contract Market {
    // create a object for the storing items
    struct Item {
        uint uid;
        string name;
        string link;
        uint256 price;
    }

    // create a var to store the store owner address
    address payable public store_owner = address(0x5660df1681a32E70704439E9243b1B91c369580e);

    // event to signal purchase
    event Purchase(uint256 _uid);

    // event to signal item creation
    event ItemCreated(uint256 _uid);

    // Create map to items list
    mapping(uint => Item) public items;

    // Store Items Count
    uint public itemCount;

    constructor () public {
        // create a test candidate
        createItem("BookX", 10000000000000000, "stahshsidid");
    }

    modifier onlyOwner() {
        // ensure the store owner is the msg.sender
        require(msg.sender == store_owner, "Only owner can create asset");
        _;
    }

    //funtion to register new candidate
    function createItem (string memory _name, uint256 _price, string memory _link) public onlyOwner {
        // create uid for item
        itemCount++;
        // create the item
        items[itemCount] = Item(itemCount, _name, _link, _price);
        //trigger item created event
        emit ItemCreated(itemCount);
    }

    function purchaseItem (uint256 _uid) public payable returns (string memory link){
        // check if the value sent by caller is equal to price
        require(msg.value == items[_uid].price, "Price Mismatch");
        // trigger item purchase event
        emit Purchase(_uid);
        // return the link to download the item
        return (items[_uid].link);
    }

    function withdrawBalance() public onlyOwner {
        // transfer balance
        store_owner.transfer(address(this).balance);
    }


// end of market smart contract
}
