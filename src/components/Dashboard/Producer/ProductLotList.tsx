import { Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  CreateCheckOut,
  GetAllProductLots,
  GetAllProductsInfo,
  GetProductLotCheckpoints,
  GetWarehouse,
} from "../../../apis/apis";
import { useMetamaskAuth } from "../../../auth/authConfig";
import {
  humidityToUnits,
  parseRejectionMessage,
  temperatureToUnits,
  timestampToDate,
} from "../../../utils/general";
import Loader from "../../core/Loader";
import {
  ProductLot,
  ProductInfo,
  Checkpoint,
  ProductLotWithCheckpoints,
  Scan,
  Warehouse,
} from "../productTypes";
import ProductLotModal from "./ProductLotModal";
import ValidityLabel from "../../core/ValidityLabel";

const ProductLotList = () => {
  const { profile, isProcessingLogin } = useMetamaskAuth();
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);
  const [productLots, setProductLots] = useState<ProductLotWithCheckpoints[]>(
    []
  );
  const [checkingOut, setCheckingOut] = useState(false);
  const [toCheckoutLot, setToCheckoutLot] =
    useState<ProductLotWithCheckpoints | null>(null);

  const [refreshIndicator, setRefresh] = useState(Math.random());
  const refresh = () => setRefresh(Math.random());

  useEffect(() => {
    if (!profile) return;
    console.log("My address", profile.id);

    const promises = [
      GetAllProductLots(profile.id),
      GetAllProductsInfo(profile.id),
    ];
    Promise.all(promises)
      .then(async (result: any[]) => {
        console.log("Received", result);
        const ProductInfoMap = new Map<number, ProductInfo>(
          result[1].map((product: ProductInfo) => [product.productId, product])
        );
        const newProductLots: ProductLotWithCheckpoints[] = [];
        for (const lot of result[0] as ProductLot[]) {
          const checkpoints = (await GetProductLotCheckpoints(
            profile.id,
            lot.productLotId
          )) as Checkpoint[];

          // @TODO- fetch warehouse which rejected this here ...
          const rejection = lot.rejected ? parseRejectionMessage(lot.rejectedMessage) : null;
          
          const rejectedByWarehouse = 
          newProductLots.push({
            ...lot,
            rejection: lot.rejected && rejection ? {
              ...rejection,
              rejectedByWarehouse: (await GetWarehouse(rejection.rejectedByAddress)) as Warehouse,
            } : null,
            productInfo: ProductInfoMap.get(lot.productId) as ProductInfo,
            checkpoints,
          });
        }

        setProductLots(newProductLots);
        console.log("All product lots", newProductLots);
        setIsFetchingProducts(false);
      })
      .catch((err) => {
        console.log("Err", err);
        setIsFetchingProducts(false);
      });
  }, [profile, refreshIndicator]);

  if (isProcessingLogin || isFetchingProducts || checkingOut)
    return <Loader size={50} />;

  return (
    <div className="container mx-auto pt-4">
      {/* <h1 className="text-2xl font-bold mb-5">Product List</h1> */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full table-fixed">
          <thead className="bg-gray-200">
            <tr>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Product
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Quantity
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Production Date
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Factory location
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="overflow-scroll" style={{ maxHeight: "40vh" }}>
            {productLots.map((productLot) => {
              const isAtRetailer = productLot.checkpoints[productLot.checkpoints.length-1].warehouse.isRetailer;
              const isInFactory =
                productLot.checkpoints.length == 1 &&
                Number(productLot.checkpoints[0].outTime) == 0;
              return (
                <tr
                  key={productLot.producerAddress + productLot.productLotId}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => setToCheckoutLot(productLot)}
                >
                  <td className="py-3 px-4">{productLot.productInfo.name}</td>
                  <td className="py-3 px-4">{productLot.quantity}</td>
                  <td className="py-3 px-4">
                    {timestampToDate(productLot.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {productLot.sourceFactoryLocation}
                  </td>
                  <td className="py-3 px-4">
                    {productLot.rejected ? (
                      <ValidityLabel valid={false} inValidText="Rejected" />
                    ) : isAtRetailer ? (
                      <>On Shelf</>
                      ) : isInFactory ? (
                      <Button
                        type="submit"
                        variant="outlined"
                        onClick={() => setToCheckoutLot(productLot)}
                        // onClick={() => checkoutFromFactory(productLot)}
                      >
                        Checkout from factory
                      </Button>
                    ) : (
                      <>In transit</>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {toCheckoutLot && (
        <ProductLotModal
          productLot={toCheckoutLot}
          refresh={refresh}
          closeModal={() => setToCheckoutLot(null)}
        />
      )}
    </div>
  );
};

export default ProductLotList;
