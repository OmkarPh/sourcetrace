import {
  Button,
  FormControl,
  FormGroup,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CreateCheckOut, CreateProductLot, GetAllProductsInfo } from "../../../apis/apis";
import { useMetamaskAuth } from "../../../auth/authConfig";
import { DRIVER_SERVER } from "../../../constants/endpoints";
import { humidityToUnits, temperatureToUnits, timestampToDate, unitsToHumidity, unitsToTemperature } from "../../../utils/general";
import Loader from "../../core/Loader";
import { ProductLotWithCheckpoints, Scan } from "../productTypes";
import ProductPreviewModal from "./ProductLotPrevieModal";

interface InWarehouseProps {
  productLots: ProductLotWithCheckpoints[];
  refresh: () => void;
}

const InWarehouse = (props: InWarehouseProps) => {
  const { productLots, refresh } = props;
  const { profile, isProcessingLogin } = useMetamaskAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const [previewProductLot, setPreviewProductLot] = useState<ProductLotWithCheckpoints | null>(null);

  async function scanDriver() {
    const res = await axios.get(`${DRIVER_SERVER}/driver/sensor`);
    return res.data as Scan;
  }

  if (isProcessingLogin || checkingOut) return <Loader size={50} />;

  return (
    <div className="container mx-auto pt-4">
      {/* <h1 className="text-2xl font-bold mb-5">Product List</h1> */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full table-fixed">
          <thead className="bg-gray-200">
            <tr>
              <th className="w-1/6 py-3 px-4 text-left font-semibold">
                Product
              </th>
              <th className="w-1/6 py-3 px-4 text-left font-semibold">
                Quantity
              </th>
              <th className="w-1/6 py-3 px-4 text-left font-semibold">
                Checked in
              </th>
              <th className="w-1/6 py-3 px-4 text-left font-semibold">
                Checkin params
              </th>
              <th className="w-1/6 py-3 px-4 text-left font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {productLots.map((productLot) => {
              const isInFactory =
                productLot.checkpoints.length == 1 &&
                Number(productLot.checkpoints[0].outTime) == 0;
              return (
                <tr
                  key={productLot.producerAddress + productLot.productLotId}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => setPreviewProductLot(productLot)}
                >
                  <td className="py-3 px-4">{productLot.productInfo.name}</td>
                  <td className="py-3 px-4">{productLot.quantity}</td>
                  {/* <td className="py-3 px-4">
                    {timestampToDate(productLot.createdAt).toLocaleDateString()}
                  </td> */}
                  <td className="py-3 px-4">
                    {
                      timestampToDate(productLot.checkpoints.find(checkpoint => checkpoint.warehouse.id == profile?.id)?.inTime || "").toLocaleDateString()
                    }
                  </td>
                  <td className="py-3 px-4">
                    Temp: { unitsToTemperature(productLot.checkpoints[productLot.checkpoints.length-1].in_temperature) } °C
                    <br/>
                    Humidity: { unitsToHumidity(productLot.checkpoints[productLot.checkpoints.length-1].in_humidity) } %
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      type="submit"
                      variant="outlined"
                    >
                      Checkout
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {previewProductLot && (
        <>
          <ProductPreviewModal
            closeModal={() => setPreviewProductLot(null)}
            productLot={previewProductLot}
          />
        </>
      )}
    </div>
  );
};

export default InWarehouse;
