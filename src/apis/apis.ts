import axios from "axios";
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

export const GetProducer = CallerFactory(
  SourceTraceContract,
  "getProducer",
  false
);
export const GetWarehouse = CallerFactory(
  SourceTraceContract,
  "getWarehouse",
  false
);
export const GetAllProductsInfo = CallerFactory(
  SourceTraceContract,
  "getAllProductsInfo",
  false
);
export const GetProductInfo = CallerFactory(
  SourceTraceContract,
  "getProductInfo",
  false
);
export const GetAllProductLots = CallerFactory(
  SourceTraceContract,
  "getAllProductLots",
  false
);
export const GetProductLot = CallerFactory(
  SourceTraceContract,
  "getProductLot",
  false
);
export const GetProductLotCheckpoints = CallerFactory(
  SourceTraceContract,
  "getProductLotCheckpoints",
  false
);
export const GetProductLotCheckpoint = CallerFactory(
  SourceTraceContract,
  "getProductLotCheckpoint",
  false
);
// export const  = CallerFactory(SourceTraceContract, '', false);

export const CreateProducerFn = SenderFactory(
  SourceTraceContract,
  "createProducer",
  true
);
export const CreateWarehouseFn = SenderFactory(
  SourceTraceContract,
  "createWarehouse",
  true
);

export const InventProduct = SenderFactory(
  SourceTraceContract,
  "inventProduct",
  true
);
export const CreateProductLot = SenderFactory(
  SourceTraceContract,
  "createProductLot",
  true
);
export const CreateCheckIn = SenderFactory(
  SourceTraceContract,
  "createCheckIn",
  true
);
export const CreateCheckOut = SenderFactory(
  SourceTraceContract,
  "createCheckOut",
  true
);
export const Reject = SenderFactory(SourceTraceContract, "reject", true);
export const AddTruck = SenderFactory(SourceTraceContract, "addTruck", false);
// export const  = SenderFactory(SourceTraceContract, '', false);

export const GetWarehouseProductLots = CallerFactory(
  SourceTraceContract,
  "getWarehouseProductLots",
  false
);

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

export async function uploadImg(file: File) {
  console.log("File", file);
  // const fileExtension = file.name.split('.').pop() || "jpg";
  // const randFileName = uuidv4() + '.' + fileExtension;

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", "nftmarketplace");
  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dp0ayty6p/image/upload",
    body
  );
  return res.data.secure_url;
}
