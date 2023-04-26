import {
  ProductLotWithCheckpoints,
  Warehouse,
} from "./../components/Dashboard/productTypes";
import {
  ProductLot,
  ProductInfo,
  Checkpoint,
} from "../components/Dashboard/productTypes";
import { CallerFactory, SenderFactory } from "./factory";
import SourceTraceContract from "./SourceTraceContract";
import {
  parseRejectionMessage,
  productIdentifierToDetails,
} from "../utils/general";
import exp from "constants";



export const GetProducer = CallerFactory(
  SourceTraceContract,
  "getProducer",
  false
);

export function getProducer(producerAddress:string, producerName: string, producerPhone:number, producerRegno:number){
  return GetProducer(producerAddress, producerName, producerPhone, producerRegno);
}

export const GetWarehouse = CallerFactory(
  SourceTraceContract,
  "getWarehouse",
  false
);

export function getWarehouse(warehouseAddress: string, warehouseName: string, warehousePhone:number, warehouseRegno:number){
  return GetWarehouse(warehouseAddress, warehouseName, warehousePhone, warehouseRegno);
}

export const GetAllProductsInfo = CallerFactory(
  SourceTraceContract,
  "getAllProductsInfo",
  false
);

export function getAllProductsInfo(produceraddress: string, products: string[]){
  return GetAllProductsInfo(produceraddress, products);
}

export const GetProductInfo = CallerFactory(
  SourceTraceContract,
  "getProductInfo",
  false
);

export function getProductsInfo(produceraddress: string, productName: string, productId:number, productloc: string, productTemp:number, productHum:number){
  return GetProductInfo(produceraddress, productName, productId, productTemp, productHum);
}

export const GetAllProductLots = CallerFactory(
  SourceTraceContract,
  "getAllProductLots",
  false
);

export function getAllProductsLotInfo(productName: string, quantity: number, productId:number, productloc: string, productTemp:number, productHum:number){
  return GetAllProductLots(productName, quantity, productId, productTemp, productHum);
}

export const GetProductLot = CallerFactory(
  SourceTraceContract,
  "getProductLot",
  false
);

export function getProductsLotInfo(productName: string, quantity: number, productId:number, productloc: string, productTemp:number, productHum:number){
  return GetProductLot(productName, quantity, productId, productTemp, productHum);
}

export const GetProductLotCheckpoints = CallerFactory(
  SourceTraceContract,
  "getProductLotCheckpoints",
  false
);

export function getProductLotCheckpoints(productLotID: number, productCheckpoints: string[]){
  return GetProductLotCheckpoints(productLotID, productCheckpoints)
}

export const GetProductLotCheckpoint = CallerFactory(
  SourceTraceContract,
  "getProductLotCheckpoint",
  false
);

export function getProductLotCheckpoint(productLotID: number, productCheckpoint: string){
  return GetProductLotCheckpoint(productLotID, productCheckpoint)
}

export const CreateProducerFn = SenderFactory(
  SourceTraceContract,
  "createProducer",
  true
);

export function CrateProducer(producerName: string, producerPhone:number, producerRegno:number, producerLocation:string){
  return CreateProducerFn(producerName, producerPhone, producerRegno, producerLocation);
}

export const CreateWarehouseFn = SenderFactory(
  SourceTraceContract,
  "createWarehouse",
  true
);

export function CreateWarehouse(warehouseName: string, warehousePhone:number, warehouseRegno:number, warehouseLocation:string){
  return CreateWarehouseFn(warehouseName, warehousePhone, warehouseRegno, warehouseLocation);
}

export const InventProduct = SenderFactory(
  SourceTraceContract,
  "inventProduct",
  true
);

export function Invent(name:any, price: number, imgURL: string, isPerishable:any, params: string[], minValues: number[], maxValues: number[]){
  return InventProduct(name, price, imgURL, isPerishable, params, minValues, maxValues)
}

export const CreateProductLot = SenderFactory(
  SourceTraceContract,
  "createProductLot",
  true
);

export function Productlot( productName: string, quantity: number, productId:number, productloc: string, productTemp:number, productHum:number){
  return CreateProductLot(productName, quantity, productId, productTemp, productHum);
}

export const CreateCheckIn = SenderFactory(
  SourceTraceContract,
  "createCheckIn",
  true
);

export function CheckIn(myAdrress: string, productLotID: number, productTemp: number, productHum: number){
  return CreateCheckIn(myAdrress, productLotID, productTemp, productHum);
}

export const CreateCheckOut = SenderFactory(
  SourceTraceContract,
  "createCheckOut",
  true
);

export function CheckOut(myAdrress: string, productLotID: number, productTemp: number, productHum: number){
  return CreateCheckOut(myAdrress, productLotID, productTemp, productHum);
}
export const Reject = SenderFactory(SourceTraceContract, "reject", true);
export const AddTruck = SenderFactory(SourceTraceContract, "addTruck", false);
// export const  = SenderFactory(SourceTraceContract, '', false);



// Public API functions
export const GetWarehouseProductLots = CallerFactory(
  SourceTraceContract,
  "getWarehouseProductLots",
  false
);

export function getWarehouseProductLots(myAdrress: string, productLotID: number, productTemp: number, productHum: number){
  return GetWarehouseProductLots(myAdrress, productLotID, productTemp, productHum);
}

export const GetWarehouseProductLotsWithCheckpoints = async (
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
export const GetProductLotWithCheckpoints = async (
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
