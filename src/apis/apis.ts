import { CallerFactory, SenderFactory } from "./factory";
import SourceTraceContract from "./SourceTraceContract";

export const GetProducer = CallerFactory(SourceTraceContract, 'getProducer', false);
export const GetWarehouse = CallerFactory(SourceTraceContract, 'getWarehouse', false);

export const CreateProducerFn = SenderFactory(SourceTraceContract, 'createProducer', true);
export const CreateWarehouseFn = SenderFactory(SourceTraceContract, 'createWarehouse', true);