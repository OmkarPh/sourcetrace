import {
  ProductLotWithCheckpoints,
  Warehouse,
} from "./../components/Dashboard/productTypes";
import {
  ProductLot,
  ProductInfo,
  Checkpoint,
} from "../components/Dashboard/productTypes";
import {
  parseRejectionMessage,
  productIdentifierToDetails,
} from "../utils/general";
import {
  AddTruck,
  CreateCheckIn,
  CreateCheckOut,
  CreateProducerFn,
  CreateProductLot,
  CreateWarehouseFn,
  GetAllProductLots,
  GetAllProductsInfo,
  GetProducer,
  GetProductInfo,
  GetProductLot,
  GetProductLotCheckpoints,
  GetProductLotWithCheckpoints,
  GetWarehouse,
  GetWarehouseProductLots,
  InventProduct,
  Reject,
} from "./apis";

/**
 * Returns information about a producer associated with the given address.
 *
 * @param {string} producerAddress - The address of the producer.
 * @returns {Object} An object containing the producer's name, phone number, and registration number.
 */
export function getProducer(producerAddress: string) {
  return GetProducer(producerAddress);
}

/**
 * Returns information about a warehouse associated with the given address.
 *
 * @param {string} warehouseAddress - The address of the warehouse.
 * @returns {Object} An object containing the warehouse's name, phone number, and registration number.
 */
export function getWarehouse(warehouseAddress: string) {
  return GetWarehouse(warehouseAddress);
}

/**
 * Returns information about all products associated with the given producer.
 *
 * @param {string} producerAddress - The address of the producer.
 * @returns {Array} An array of objects, each containing information about a product produced by the given producer.
 */
export function getAllProductsInfo(produceraddress: string) {
  return GetAllProductsInfo(produceraddress);
}

/**
 * Returns information about a specific product associated with the given producer.
 *
 * @param {string} producerAddress - The address of the producer.
 * @returns {Object} An object containing information about the product, including its name, ID, temperature, and humidity requirements.
 */
export function getProductInfo(produceraddress: string) {
  return GetProductInfo(produceraddress);
}

/**
 * Returns information about all product lots associated with the given producer.
 *
 * @param {string} producerAddress - The address of the producer.
 * @returns {Array} An array of objects, each containing information about a product lot produced by the given producer.
 */
export function getAllProductLots(produceraddress: string) {
  return GetAllProductLots(produceraddress);
}

/**
 * Returns information about a specific product lot associated with the given producer.
 *
 * @param {string} producerAddress - The address of the producer.
 * @param {number} productLotID - The ID of the product lot.
 * @returns {Object} An object containing information about the product lot, including its ID, product name, and quantity.
 */
export function getProductLot(
  producerAddress: string,
  productLotID: number | string
) {
  return GetProductLot(producerAddress, productLotID);
}

/**
 * Returns information about all checkpoints associated with a specific product lot.
 *
 * @param {string} producerAddress - The address of the producer.
 * @param {number} productLotID - The ID of the product lot.
 * @returns {Array} An array of objects, each containing information about a checkpoint associated with the given product lot.
 */
export function getProductLotCheckpoints(
  producerAddress: string,
  productLotID: number | string
) {
  return GetProductLotCheckpoints(producerAddress, productLotID);
}

/**
 * Creates a new producer with the given name, phone number, registration number, and location.
 *
 * @param {string} producerName - The name of the producer.
 * @param {number} producerPhone - The phone number of the producer.
 * @param {number} producerRegno - The registration number of the producer.
 * @param {string} producerLocation - The location of the producer.
 * @returns {any} The result of the CreateProducerFn function.
 */
export function createProducer(
  producerName: string,
  producerPhone: number,
  producerRegno: number,
  producerLocation: string
) {
  return CreateProducerFn(
    producerName,
    producerPhone,
    producerRegno,
    producerLocation
  );
}

/**
 * Creates a new warehouse with the given name, phone number, registration number, and location.
 *
 * @param {string} warehouseName - The name of the warehouse.
 * @param {number} warehousePhone - The phone number of the warehouse.
 * @param {number} warehouseRegno - The registration number of the warehouse.
 * @param {string} warehouseLocation - The location of the warehouse.
 * @returns {any} The result of the CreateWarehouseFn function.
 */
export function createWarehouse(
  warehouseName: string,
  warehousePhone: number,
  warehouseRegno: number,
  warehouseLocation: string
) {
  return CreateWarehouseFn(
    warehouseName,
    warehousePhone,
    warehouseRegno,
    warehouseLocation
  );
}

/**
Creates a new product with the given name, price, image URL, perishable flag, parameters, minimum values, and maximum values.
 *
 * @param {any} name - The name of the product.
 * @param {number} price - The price of the product.
 * @param {string} imgURL - The URL of the product image.
 * @param {any} isPerishable - The perishable flag of the product.
 * @param {string[]} params - The parameters of the product.
 * @param {number[]} minValues - The minimum values of the product parameters.
 * @param {number[]} maxValues - The maximum values of the product parameters.
 * @returns {any} The result of the InventProduct function.
*/
export function Invent(
  name: any,
  price: number,
  imgURL: string,
  isPerishable: any,
  params: string[],
  minValues: number[],
  maxValues: number[]
) {
  return InventProduct(
    name,
    price,
    imgURL,
    isPerishable,
    params,
    minValues,
    maxValues
  );
}

/**
Creates a new product lot with the given product name, quantity, product ID, location, temperature, and humidity.
 *
 * @param {string} productName - The name of the product.
 * @param {number} quantity - The quantity of the product.
 * @param {number} productId - The ID of the product.
 * @param {string} productloc - The location of the product lot.
 * @param {number} productTemp - The temperature of the product lot.
 * @param {number} productHum - The humidity of the product lot.
 * @returns {any} The result of the CreateProductLot function.
*/
export function createProductLot(
  productName: string,
  quantity: number,
  productId: number,
  productloc: string,
  productTemp: number,
  productHum: number
) {
  return CreateProductLot(
    productName,
    quantity,
    productId,
    productTemp,
    productHum
  );
}

/**
Creates a new check-in record with the given producer address, product lot ID, temperature, and humidity.
 *
 * @param {string} myAddress - The address of the producer.
 * @param {number} productLotID - The ID of the product lot.
 * @param {number} productTemp - The temperature of the product lot at check-in.
 * @param {number} productHum - The humidity of the product lot at check-in.
 * @returns {any} The result of the CreateCheckIn function.
*/
export function checkIn(
  myAdrress: string,
  productLotID: number | string,
  productTemp: number,
  productHum: number
) {
  return CreateCheckIn(myAdrress, productLotID, productTemp, productHum);
}

/**
Creates a new check-out record with the given producer address, product lot ID, temperature, and humidity.
 *
 * @param {string} myAddress - The address of the producer.
 * @param {number} productLotID - The ID of the product lot.
 * @param {number} productTemp - The temperature of the product lot at check-out.
 * @param {number} productHum - The humidity of the product lot at check-out.
 * @returns {any} The result of the CreateCheckOut function.
*/
export function checkOut(
  myAdrress: string,
  productLotID: number | string,
  productTemp: number,
  productHum: number
) {
  return CreateCheckOut(myAdrress, productLotID, productTemp, productHum);
}

/** Rejects a product lot.
 *
 * @param {string} myAddress - The address of the caller.
 * @param {string} producerAddress - The address of the producer.
 * @param {number} productLotID - The ID of the product lot.
 * @param {number} reason - The reason for rejection.
 * @param {string} rejectedMessage - The message for the rejected product.
 * @returns {any} - The result of the rejection operation.
 */
export function rejectLot(
  myAddress: string,
  producerAddress: string,
  productLotID: number,
  reason: number,
  rejectedMessage: string
) {
  return Reject(
    myAddress,
    producerAddress,
    productLotID,
    reason,
    rejectedMessage
  );
}

/**
 * Adds a truck.
 *
 * @param {string} myAddress - The address of the caller.
 * @param {string} truckAddress - The address of the truck.
 * @param {string} truckLicense - The license of the truck.
 * @param {number} truckRole - The role of the truck.
 * @returns {any} - The result of the truck addition operation.
 */
export function addTruck(
  myAddress: string,
  truckAddress: number,
  truckLicense: string,
  truckRole: number
) {
  return AddTruck(myAddress, truckAddress, truckLicense, truckRole);
}

/**
 * Retrieves all the product lots stored in a warehouse.
 *
 * @param {string} warehouseAddress - The address of the warehouse to retrieve product lots from.
 * @returns {Array} - An array of product lots stored in the specified warehouse.
 */
export function getWarehouseProductLots(warehouseAddress: string) {
  return GetWarehouseProductLots(warehouseAddress);
}

/**
 * Retrieves an array of ProductLotWithCheckpoints objects for a given warehouse.
 *
 * @async
 * @function GetWarehouseProductLotsWithCheckpoints
 * @param {string} warehouse - The warehouse identifier.
 * @returns {Promise<ProductLotWithCheckpoints[]>} - An array of ProductLotWithCheckpoints objects.
 */
export const getWarehouseProductLotsWithCheckpoints = async (
  warehouse: string
) => {
  const lots = (await GetWarehouseProductLots(warehouse)) as string[];
  const productLots: ProductLotWithCheckpoints[] = [];
  for (const lot of lots) {
    const { producer, id } = productIdentifierToDetails(lot);
    productLots.push(await GetProductLotWithCheckpoints(producer, id));
    console.log("Warehouse lot", await GetProductLotCheckpoints(producer, id));
  }
  return productLots;
};

/**
 * Retrieves a ProductLotWithCheckpoints object for a given producer and lot ID.
 *
 * @async
 * @function GetProductLotWithCheckpoints
 * @param {string} producer - The producer identifier.
 * @param {number} id - The lot ID.
 * @returns {Promise<ProductLotWithCheckpoints>} - A ProductLotWithCheckpoints object.
 */
export const getProductLotWithCheckpoints = async (
  producer: string,
  id: number
) => {
  const lot = (await GetProductLot(producer, id)) as ProductLot;
  const productInfo = (await GetProductInfo(
    producer,
    lot.productId
  )) as ProductInfo;
  const checkpoints = (await GetProductLotCheckpoints(
    producer,
    lot.productLotId
  )) as Checkpoint[];

  const rejection = lot.rejected
    ? parseRejectionMessage(lot.rejectedMessage)
    : null;

  return {
    ...lot,
    rejection: rejection
      ? {
          ...rejection,
          rejectedByWarehouse: (await GetWarehouse(
            rejection.rejectedByAddress
          )) as Warehouse,
        }
      : null,
    productInfo,
    checkpoints,
  };
};
