pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/Strings.sol";

// SPDX-License-Identifier: MIT

function toString(bytes memory data) pure returns (string memory) {
    bytes memory alphabet = "0123456789abcdef";

    bytes memory str = new bytes(2 + data.length * 2);
    str[0] = "0";
    str[1] = "x";
    for (uint256 i = 0; i < data.length; i++) {
        str[2 + i * 2] = alphabet[uint256(uint8(data[i] >> 4))];
        str[3 + i * 2] = alphabet[uint256(uint8(data[i] & 0x0f))];
    }
    return string(str);
}

// cast address to string
function addressToString(address account) pure returns (string memory) {
    return toString(abi.encodePacked(account));
}

contract SourceTrace {
    struct Producer {
        address id;
        string name;
        string phone;
        string reg_no;
        string location;
    }

    struct Warehouse {
        address id;
        string name;
        string phone;
        string reg_no;
        string location;
    }

    struct ProductInfo {
        uint256 productId;
        address producer;
        string name;
        string price;
        string[] params;
        int[] minValues;
        int[] maxValues;
    }

    struct Checkpoint {
        uint256 inTime;
        uint256 outTime;
        Warehouse warehouse;
        int in_temperature;
        int in_humidity;
        int out_temperature;
        int out_humidity;
    }

    struct ProductLot {
        uint256 productId;
        uint256 productLotId;
        address producerAddress;
        uint256 quantity;
        uint256 createdAt;
        string sourceFactoryName;
        string sourceFactoryLocation;
        // Checkpoint[] checkpoints;
    }

    // Producer_productlotIndex => Checkpoint[]
    // eg. 0xab32..2c_0 => [Checkpoint{..}, Checkpoint{..}, ..., Checkpoint{..}]
    // eg. 0xab32..2c_2 => [Checkpoint{..}, Checkpoint{..}, ..., Checkpoint{..}]
    mapping(string => Checkpoint[]) checkpoints;

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

    function getProductLotCheckpoints(
        address _producer_address,
        uint256 _product_lot_id
    ) public view returns (Checkpoint[] memory) {
        return
            checkpoints[
                string.concat(
                    addressToString(_producer_address),
                    "_",
                    Strings.toString(_product_lot_id)
                )
            ];
    }

    function getProductLotCheckpoint(
        address _producer_address,
        uint256 _product_lot_id,
        uint256 _idx
    ) public view returns (Checkpoint memory) {
        return
            checkpoints[
                string.concat(
                    addressToString(_producer_address),
                    "_",
                    Strings.toString(_product_lot_id)
                )
            ][_idx];
    }

    function createProducer(string memory _name, string memory _phone, string memory _reg_no, string memory _location)
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
            phone: _phone,
            reg_no: _reg_no,
            location: _location
        });
        producers[msg.sender] = newProducer;
    }

    function createWarehouse(string memory _name, string memory _phone, string memory _reg_no, string memory _location)
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
            phone: _phone,
            reg_no: _reg_no,
            location: _location
        });
        warehouses[msg.sender] = newWarehouse;
    }

    function inventProduct(
        string memory _name,
        string memory _price,
        string[] memory _params,
        int[] memory _minValues,
        int[] memory _maxValues
    ) public mustBeProducer(msg.sender) returns (uint256) {
        uint256 newProductId = productsInfo[msg.sender].length;
        ProductInfo memory newProductInfo = ProductInfo({
            productId: newProductId,
            producer: msg.sender,
            name: _name,
            price: _price,
            params: _params,
            minValues: _minValues,
            maxValues: _maxValues
        });
        productsInfo[msg.sender].push(newProductInfo);
        return newProductId;
    }

    function createProductLot(
        uint256 _quantity,
        uint256 _product_id,
        string memory _source_factory_name,
        string memory _source_factory_location,
        int _temperature,
        int _humidity
    )
        public
        mustBeProducer(msg.sender)
        returns (string memory)
    // returns (uint256)
    {
        require(
            _product_id < productsInfo[msg.sender].length,
            "This product doesn't exist, Invent it first !"
        );
        uint256 newProductLotId = productLots[msg.sender].length;
        uint256 createdAt = block.timestamp;

        ProductLot memory newProductLot = ProductLot({
            productId: _product_id,
            productLotId: newProductLotId,
            producerAddress: msg.sender,
            quantity: _quantity,
            createdAt: createdAt,
            sourceFactoryName: _source_factory_name,
            sourceFactoryLocation: _source_factory_location
        });
        productLots[msg.sender].push(newProductLot);

        // add the check-in checkpoint
        Checkpoint memory checkIn = Checkpoint({
            inTime: block.timestamp,
            outTime: 0,
            warehouse: warehouses[msg.sender], // Empty obj, coz producer isn't always a warehouse
            in_temperature: _temperature,
            in_humidity: _humidity,
            out_temperature: 0,
            out_humidity: 0
        });

        checkpoints[
            string.concat(
                addressToString(msg.sender),
                "_",
                Strings.toString(newProductLotId)
            )
        ].push(checkIn);

        return
            string.concat(
                addressToString(msg.sender),
                "_",
                Strings.toString(newProductLotId)
            );
        // return newProductLotId;
    }

    function createCheckIn(
        address _producer_address,
        uint256 _product_lot_id,
        int _temperature,
        int _humidity
    ) public mustBeWarehouse(msg.sender) {
        // retrieve the warehouse by its address
        Warehouse memory warehouse = warehouses[msg.sender];

        // retrieve the product lot
        // ProductLot storage productLot = productLots[_producer_address][_product_lot_id];

        // add a checkpoint to the product lot
        Checkpoint[] storage targetCheckpoints = checkpoints[
            string.concat(
                addressToString(_producer_address),
                "_",
                Strings.toString(_product_lot_id)
            )
        ];
        uint256 targetCheckpointIndex = targetCheckpoints.length;
        targetCheckpoints.push();

        // update values of newly added product lot
        Checkpoint storage newCheckpoint = targetCheckpoints[
            targetCheckpointIndex
        ];
        newCheckpoint.inTime = block.timestamp;
        newCheckpoint.outTime = 0;
        newCheckpoint.warehouse = warehouse;
        newCheckpoint.in_temperature = _temperature;
        newCheckpoint.in_humidity = _humidity;
        newCheckpoint.out_temperature = 0;
        newCheckpoint.out_humidity = 0;
    }

    function createCheckOut(
        address _producer_address,
        uint256 _product_lot_id,
        int _temperature,
        int _humidity
    ) public {
        // retrieve the product lot
        // ProductLot storage productLot = productLots[_producer_address][_product_lot_id];

        // retrieve the checkpoint
        Checkpoint[] storage targetCheckpoints = checkpoints[
            string.concat(
                addressToString(_producer_address),
                "_",
                Strings.toString(_product_lot_id)
            )
        ];
        uint256 _checkpointIndex = targetCheckpoints.length - 1;
        Checkpoint storage checkpoint = targetCheckpoints[_checkpointIndex];

        if (_checkpointIndex == 0) {
            // 0th Checkout from producer only
            require(
                _producer_address == msg.sender,
                "Only original producer can checkout from factory !"
            );
        } else {
            require(
                warehouses[msg.sender].id !=
                    0x0000000000000000000000000000000000000000,
                "Warehouse doesn't exist with this address"
            );
            require(
                checkpoint.warehouse.id == msg.sender,
                "Can't checkout from someone else's checkpoint !!"
            );
        }

        require(
            checkpoint.outTime == 0,
            "This checkpoint has already been checked out"
        );

        // set the out params for the checkpoint
        checkpoint.outTime = block.timestamp;
        checkpoint.out_temperature = _temperature;
        checkpoint.out_humidity = _humidity;
    }
}
