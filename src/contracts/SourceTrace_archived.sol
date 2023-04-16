pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/utils/Strings.sol";

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
        address[] trucks;
        string[] truckDetails;
    }

    struct Warehouse {
        address id;
        string name;
        string phone;
        string reg_no;
        string location;
        address[] trucks;
        string[] truckDetails;
    }

    struct ProductInfo {
        uint256 productId;
        address producer;
        string name;
        string price;
        string imageURL;
        string[] params;
        int256[] minValues;
        int256[] maxValues;
    }

    struct Checkpoint {
        uint256 inTime;
        uint256 outTime;
        Warehouse warehouse;
        int256 in_temperature;
        int256 in_humidity;
        int256 out_temperature;
        int256 out_humidity;
        address truckAssigned;
        int256[] polledTemperatures;
        int256[] polledHumidity;
        uint256[] polledTimes;
    }

    struct ProductLot {
        uint256 productId;
        uint256 productLotId;
        address producerAddress;
        uint256 quantity;
        uint256 createdAt;
        bool rejected;
        string sourceFactoryName;
        string sourceFactoryLocation;
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
    mapping(address => string[]) warehouseProductLots;

    function _mustBeProducer(address _entity_address) private view {
        require(
            producers[_entity_address].id !=
                0x0000000000000000000000000000000000000000,
            "Producer not exist"
        );
    }

    modifier mustBeProducer(address _entity_address) {
        _mustBeProducer(_entity_address);
        _;
    }

    function _mustBeWarehouse(address _entity_address) private view {
        require(
            warehouses[_entity_address].id !=
                0x0000000000000000000000000000000000000000,
            "Warehouse not exist"
        );
    }

    modifier mustBeWarehouse(address _entity_address) {
        _mustBeWarehouse(_entity_address);
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
            "Product not exist"
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
            "Product lot not exist"
        );
        return productLots[_producer_address][_product_lot_id];
    }

    function getWarehouseProductLots(address _warehouse_address)
        public
        view
        returns (string[] memory)
    {
        return warehouseProductLots[_warehouse_address];
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

    function createProducer(
        string memory _name,
        string memory _phone,
        string memory _reg_no,
        string memory _location,
        address[] memory _trucks,
        string[] memory _truckDetails
    ) public {
        // Ensure a producer with the same address does not already exist
        require(
            producers[msg.sender].id == address(0),
            "Producer already registered"
        );

        // Create the new producer
        Producer memory newProducer = Producer({
            id: msg.sender,
            name: _name,
            phone: _phone,
            reg_no: _reg_no,
            location: _location,
            trucks: _trucks,
            truckDetails: _truckDetails
        });
        producers[msg.sender] = newProducer;
    }

    function createWarehouse(
        string memory _name,
        string memory _phone,
        string memory _reg_no,
        string memory _location,
        address[] memory _trucks,
        string[] memory _truckDetails
    ) public {
        // Ensure a warehouse with the same address does not already exist
        require(
            warehouses[msg.sender].id == address(0),
            "Warehouse already registered"
        );

        // Create the new warehouse
        Warehouse memory newWarehouse = Warehouse({
            id: msg.sender,
            name: _name,
            phone: _phone,
            reg_no: _reg_no,
            location: _location,
            trucks: _trucks,
            truckDetails: _truckDetails
        });
        warehouses[msg.sender] = newWarehouse;
    }

    function addTruck(address _truck, string memory _truckDetails, uint256 role) public {
        require(role == 0 || role == 1, "Invalid role !");
        if(role == 0){
            producers[msg.sender].trucks.push(_truck);
            producers[msg.sender].truckDetails.push(_truckDetails);
        } else {
            warehouses[msg.sender].trucks.push(_truck);
            warehouses[msg.sender].truckDetails.push(_truckDetails);
        }
    }

    function inventProduct(
        string memory _name,
        string memory _price,
        string memory _imageURL,
        string[] memory _params,
        int256[] memory _minValues,
        int256[] memory _maxValues
    ) public mustBeProducer(msg.sender) returns (uint256) {
        uint256 newProductId = productsInfo[msg.sender].length;
        ProductInfo memory newProductInfo = ProductInfo({
            productId: newProductId,
            producer: msg.sender,
            name: _name,
            price: _price,
            imageURL: _imageURL,
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
        int256 _temperature,
        int256 _humidity
    )
        public
        mustBeProducer(msg.sender)
        returns (string memory)
        // returns (uint256)
    {
        require(
            _product_id < productsInfo[msg.sender].length,
            "This product not exist"
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
            sourceFactoryLocation: _source_factory_location,
            rejected: false
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
            out_humidity: 0,
            truckAssigned: 0x0000000000000000000000000000000000000000,
            polledTemperatures: new int256[](0),
            polledHumidity: new int256[](0),
            polledTimes: new uint256[](0)
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
    }

    function reject(address _producer_address, uint256 _product_lot_id)
        public
        mustBeWarehouse(msg.sender)
    {
        productLots[_producer_address][_product_lot_id].rejected = true;
    }

    function createCheckIn(
        address _producer_address,
        uint256 _product_lot_id,
        int256 _temperature,
        int256 _humidity
    ) public mustBeWarehouse(msg.sender) {
        // retrieve the warehouse by its address
        // Warehouse memory warehouse = warehouses[msg.sender];

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
        newCheckpoint.warehouse = warehouses[msg.sender];
        newCheckpoint.in_temperature = _temperature;
        newCheckpoint.in_humidity = _humidity;
        newCheckpoint.out_temperature = 0;
        newCheckpoint.out_humidity = 0;

        warehouseProductLots[msg.sender].push(
            string.concat(
                addressToString(_producer_address),
                "_",
                Strings.toString(_product_lot_id)
            )
        );
    }

    function createCheckOut(
        address _producer_address,
        uint256 _product_lot_id,
        address _truckAssigned,
        uint256 _truckAssignedIdx,
        int256 _temperature,
        int256 _humidity
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
                "only producer can checkout factory"
            );
            require(
                producers[msg.sender].trucks[_truckAssignedIdx] ==
                    _truckAssigned,
                "Use own trucks for checkout"
            );
        } else {
            require(
                warehouses[msg.sender].id !=
                    0x0000000000000000000000000000000000000000,
                "Warehouse not exist"
            );
            require(
                checkpoint.warehouse.id == msg.sender,
                "Can't checkout else's checkpoint"
            );
            require(
                warehouses[msg.sender].trucks[_truckAssignedIdx] ==
                    _truckAssigned,
                "Use own trucks for checkout"
            );
        }

        require(checkpoint.outTime == 0, "Already checked out");

        // set the out params for the checkpoint
        checkpoint.outTime = block.timestamp;
        checkpoint.out_temperature = _temperature;
        checkpoint.out_humidity = _humidity;
        checkpoint.truckAssigned = _truckAssigned;
    }

    // productLotId -> 0x22342..23_2 (Producer_productlotIndex)
    function poll(
        string memory _productLotId,
        int256 temperature,
        int256 humidity
    ) public {
        Checkpoint[] storage targetCheckpoints = checkpoints[_productLotId];
        uint256 idx = targetCheckpoints.length - 1;
        require(
            targetCheckpoints[idx].truckAssigned == msg.sender,
            "Only assigned truck can poll !"
        );
        targetCheckpoints[idx].polledTemperatures.push(temperature);
        targetCheckpoints[idx].polledHumidity.push(humidity);
        targetCheckpoints[idx].polledTimes.push(block.timestamp);
    }
}
