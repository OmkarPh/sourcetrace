import { CallerFactory, SenderFactory } from "./factory";
import SourceTraceContract from "./SourceTraceContract";

export const GetProducer = CallerFactory(SourceTraceContract, 'getProducer', false);
export const GetWarehouse = CallerFactory(SourceTraceContract, 'getWarehouse', false);
export const GetAllProductsInfo = CallerFactory(SourceTraceContract, 'getAllProductsInfo', false);
export const GetProductInfo = CallerFactory(SourceTraceContract, 'getProductInfo', false);
export const GetAllProductLots = CallerFactory(SourceTraceContract, 'getAllProductLots', false);
export const GetProductLot = CallerFactory(SourceTraceContract, 'getProductLot', false);
export const GetProductLotCheckpoints = CallerFactory(SourceTraceContract, 'getProductLotCheckpoints', false);
export const GetProductLotCheckpoint = CallerFactory(SourceTraceContract, 'getProductLotCheckpoint', false);
// export const  = CallerFactory(SourceTraceContract, '', false);


export const CreateProducerFn = SenderFactory(SourceTraceContract, 'createProducer', true);
export const CreateWarehouseFn = SenderFactory(SourceTraceContract, 'createWarehouse', true);

export const InventProduct = SenderFactory(SourceTraceContract, 'inventProduct', true);
export const CreateProductLot = SenderFactory(SourceTraceContract, 'createProductLot', true);
export const CreateCheckIn = SenderFactory(SourceTraceContract, 'createCheckIn', true);
export const CreateCheckOut = SenderFactory(SourceTraceContract, 'createCheckOut', true);
// export const  = SenderFactory(SourceTraceContract, '', false);


