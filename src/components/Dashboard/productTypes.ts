export interface ProductInfo {
  productId: number;
  producer: string;
  name: string;
  price: string;
  params: string[];
  isPerishable: boolean;
  imageURL: string;
  minValues: number[];
  maxValues: number[];
}
export interface ProductLot {
  productId: number;
  productLotId: number;
  producerAddress: string;
  quantity: number;
  createdAt: number;
  rejected: boolean;
  rejectedMessage: string;
  sourceFactoryName: string;
  sourceFactoryLocation: string;
  productInfo: ProductInfo;
  rejection?: {
    rejectedByAddress: string,
    reason: string,
    rejectedByWarehouse?: Warehouse,
  } | null,
}

export interface Warehouse {
  id: string,
  location: string;
  name: string;
  phone: string;
  reg_no: string;
  isRetailer: boolean;
}
export interface Checkpoint {
  inTime: string;
  in_humidity: string;
  in_temperature: string;
  outTime: string;
  out_humidity: string;
  out_temperature: string;
  warehouse: Warehouse;
  polledHumidity: number[];
  polledTemperatures: number[];
  polledTimes: number[];
  truckAssigned: string;
  validities: boolean[];
}
export interface ProductLotWithCheckpoints extends ProductLot {
  checkpoints: Checkpoint[],
}

export interface Scan {
  temperature: number;
  humidity: number;
}