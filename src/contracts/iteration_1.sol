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
      string productId;
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
        address producerAddress;

        uint256 quantity;
        uint256 createdAt;
        Checkpoint[] checkpoints;
    }

    // 0x923abc...52 => Producer {...} | Warehouse {...}
    mapping(address => Producer) producers;
    mapping(address => Warehouse) warehouses;

    // producer 0x923abc..332 => [P1, P2]
    mapping(address => ProductInfo[]) productInfos;

    // producer 0x923abc..332 => [P1_lot1, P1_lot2, P2_lot5]
    mapping(address => ProductLot[]) productLots;


    function addWarehouse(address _warehouseId, string memory _name) public {
        warehouses[_warehouseId] = Warehouse(_warehouseId, _name);
    }

    function addProducer(address _producerId, string memory _name) public {
        producers[_producerId] = Producer(_producerId, _name);
    }

    function addProduct(uint256 _productId, uint256 _quantity) public {
        Producer storage producer = producers[msg.sender];
        string memory productId = addressToString(msg.sender) + "_" + _productId.toFixed();
        ProductInfo memory productInfo = ProductInfo(productId, msg.sender);
        productInfos[msg.sender].push(productInfo);
        ProductLot memory productLot = ProductLot(productId, msg.sender, _quantity, block.timestamp, []);
        productLots[msg.sender].push(productLot);
    }

    function checkInProduct(string memory _productId) public {
        ProductInfo storage productInfo = productInfos[_productId];
        Warehouse storage warehouse = warehouses[msg.sender];
        uint256 productIndex = productLots[productInfo.producer.id].length - 1;
        ProductLot storage product = productLots[productInfo.producer.id][productIndex];
        Checkpoint memory checkpoint = Checkpoint(block.timestamp, 0, warehouse);
        product.checkpoints.push(checkpoint);
    }

    function checkOutProduct(string memory _productId) public {
        ProductInfo storage productInfo = productInfos[_productId];
        uint256 productIndex = productLots[productInfo.producer.id].length - 1;
        ProductLot storage product = productLots[productInfo.producer.id][productIndex];
        uint256 checkpointIndex = product.checkpoints.length - 1;
        Checkpoint storage currentCheckpoint = product.checkpoints[checkpointIndex];
        currentCheckpoint.outTime = block.timestamp;
    }

    function addressToString(address _address) private pure returns (string memory) {
        return bytes20(_address).toHex();
    }
}
