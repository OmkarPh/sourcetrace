pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

// SPDX-License-Identifier: MIT

contract SourceTrace {
    struct Producer {
        address id;
        string name;
        string location;
    }

    struct Warehouse {
        address id;
        string name;
        string location;
    }

    struct ProductInfo {
        uint256 productId;
        address producer;
        string name;
        string price;
    }

    struct Checkpoint {
        uint256 inTime;
        uint256 outTime;
        Warehouse warehouse;
    }

    struct ProductLot {
        uint256 productId;
        uint256 productLotId;
        address producerAddress;
        uint256 quantity;
        uint256 createdAt;
        string sourceFactoryName;
        string sourceFactoryLocation;
        Checkpoint[] checkpoints;
    }

    // 0x923abc...52 => Producer {...} | Warehouse {...}
    mapping(address => Producer) producers;
    mapping(address => Warehouse) warehouses;

    // producer 0x923abc..332 => [P1, P2]
    mapping(address => ProductInfo[]) productsInfo;

    // producer 0x923abc..332 => [P1_lot1, P1_lot2, P2_lot5]
    mapping(address => ProductLot[]) productLots;

    modifier mustBeProducer(address _entity_address) {
        require(
            producers[_entity_address].id !=
                0x0000000000000000000000000000000000000000,
            "Producer doesn't exist with this address"
        );
        _;
    }
    modifier mustBeWarehouse(address _entity_address) {
        require(
            warehouses[_entity_address].id !=
                0x0000000000000000000000000000000000000000,
            "Warehouse doesn't exist with this address"
        );
        _;
    }

    function getProducer(address _address)
        public
        view
        mustBeProducer(_address)
        returns (Producer memory)
    {
        return producers[_address];
    }

    function getWarehouse(address _address)
        public
        view
        mustBeWarehouse(_address)
        returns (Warehouse memory)
    {
        return warehouses[_address];
    }

    function getAllProductsInfo(address _producer_address)
        public
        view
        mustBeProducer(_producer_address)
        returns (ProductInfo[] memory)
    {
        return productsInfo[_producer_address];
    }

    function getProductInfo(address _producer_address, uint256 _product_id)
        public
        view
        mustBeProducer(_producer_address)
        returns (ProductInfo memory)
    {
        require(
            _product_id < productsInfo[_producer_address].length,
            "This product doesn't exist, Invent it first !"
        );
        return productsInfo[_producer_address][_product_id];
    }

    function getAllProductLots(address _producer_address)
        public
        view
        mustBeProducer(_producer_address)
        returns (ProductLot[] memory)
    {
        return productLots[_producer_address];
    }

    function getProductLot(address _producer_address, uint256 _product_lot_id)
        public
        view
        mustBeProducer(_producer_address)
        returns (ProductLot memory)
    {
        require(
            _product_lot_id < productLots[_producer_address].length,
            "This product lot doesn't exist, manufacture it first ;) !"
        );
        return productLots[_producer_address][_product_lot_id];
    }

    function createProducer(string memory _name, string memory _location)
        public
    {
        // Ensure a producer with the same address does not already exist
        require(
            producers[msg.sender].id == address(0),
            "A producer with this address already exists"
        );

        // Create the new producer
        Producer memory newProducer = Producer({
            id: msg.sender,
            name: _name,
            location: _location
        });
        producers[msg.sender] = newProducer;
    }

    function createWarehouse(string memory _name, string memory _location)
        public
    {
        // Ensure a warehouse with the same address does not already exist
        require(
            warehouses[msg.sender].id == address(0),
            "A warehouse with this address already exists"
        );

        // Create the new warehouse
        Warehouse memory newWarehouse = Warehouse({
            id: msg.sender,
            name: _name,
            location: _location
        });
        warehouses[msg.sender] = newWarehouse;
    }

    function inventProduct(string memory _name, string memory _price)
        public
        mustBeProducer(msg.sender)
        returns (uint256)
    {
        uint256 newProductId = productsInfo[msg.sender].length;
        ProductInfo memory newProductInfo = ProductInfo({
            productId: newProductId,
            producer: msg.sender,
            name: _name,
            price: _price
        });
        productsInfo[msg.sender].push(newProductInfo);
        return newProductId;
    }

    // function test(address sender, uint256 _product_id) public view returns (bool) {
    //     // 0x0000000000000000000000000000000000000000
    //     return _product_id < productsInfo[sender].length;
    //     // return productsInfo[msg.sender][0].producer != 0x0000000000000000000000000000000000000000;
    // }
    function createProductLot(
        uint256 _quantity,
        uint256 _product_id,
        string memory _source_factory_name,
        string memory _source_factory_location
    ) public mustBeProducer(msg.sender) returns (uint256) {
        require(
            _product_id < productsInfo[msg.sender].length,
            "This product doesn't exist, Invent it first !"
        );

        uint256 newProductLotId = productLots[msg.sender].length;
        productLots[msg.sender].push();

        ProductLot storage newProductLot = productLots[msg.sender][
            newProductLotId
        ];
        newProductLot.productId = _product_id;
        newProductLot.productLotId = newProductLotId;
        newProductLot.producerAddress = msg.sender;
        newProductLot.quantity = _quantity;
        newProductLot.createdAt = block.timestamp;
        newProductLot.sourceFactoryName = _source_factory_name;
        newProductLot.sourceFactoryLocation = _source_factory_location;
        // newProductLot.checkpoints = [];
        return newProductLotId;
    }

    function createCheckIn(
        address _producer_address,
        uint256 _product_lot_id,
        address _warehouseAddress
    ) public mustBeWarehouse(msg.sender) {
        // retrieve the warehouse by its address
        Warehouse memory warehouse = warehouses[_warehouseAddress];

        // retrieve the product lot
        ProductLot storage productLot = productLots[_producer_address][_product_lot_id];

        // add a checkpoint to the product lot
        uint256 targetCheckpointIndex = productLot.checkpoints.length;
        productLot.checkpoints.push();

        // update values of newly added product lot
        Checkpoint storage newCheckpoint = productLot.checkpoints[targetCheckpointIndex];
        newCheckpoint.inTime = block.timestamp;
        newCheckpoint.outTime = 0;
        newCheckpoint.warehouse = warehouse;
    }

    function createCheckOut(
        address _producer_address,
        uint256 _product_lot_id
    ) public mustBeWarehouse(msg.sender) {
        // retrieve the product lot
        ProductLot storage productLot = productLots[_producer_address][_product_lot_id];

        // retrieve the checkpoint
        uint256 _checkpointIndex = productLot.checkpoints.length-1;
        Checkpoint storage checkpoint = productLot.checkpoints[_checkpointIndex];

        // Ensure the checkpoint has not already been checked out
        require(checkpoint.outTime == 0, "This checkpoint has already been checked out");

        // set the outTime for the checkpoint
        checkpoint.outTime = block.timestamp;
    }
}
