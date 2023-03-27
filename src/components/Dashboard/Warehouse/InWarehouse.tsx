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
import { humidityToUnits, temperatureToUnits, timestampToDate, unitsToHumidity, unitsToTemperature } from "../../../utils/general";
import Loader from "../../core/Loader";
import { ProductLot, ProductLotWithCheckpoints, Scan } from "../productTypes";

interface InWarehouseProps {
  productLots: ProductLotWithCheckpoints[];
  refresh: () => void;
}

const InWarehouse = (props: InWarehouseProps) => {
  const { productLots, refresh } = props;
  const { profile, isProcessingLogin } = useMetamaskAuth();
  const [checkingOut, setCheckingOut] = useState(false);

  async function scanDriver() {
    const res = await axios.get("http://localhost:5000/driver/sensor");
    return res.data as Scan;
  }

  async function checkout(productLot: ProductLot) {
    if(!productLot || !profile)
      return;
    setCheckingOut(true);
    const scan = await scanDriver();
    const parsedTemperature = temperatureToUnits(scan.temperature);
    const parsedHumidity = humidityToUnits(scan.humidity);
    console.log("Checkout ", productLot, {
      params: [
        profile.id,
        productLot.producerAddress,
        productLot.productLotId,
        parsedTemperature,
        parsedHumidity
      ]
    });
    
    CreateCheckOut(
      profile.id,
      productLot.producerAddress,
      productLot.productLotId,
      parsedTemperature,
      parsedHumidity
    )
      .then((receipt) => {
        toast.success(`Checked out lot ${productLot.productInfo.name} !`);
        setCheckingOut(false);
        refresh();
      })
      .catch((err) => {
        toast.error(<>Please approve metamask tx</>);
        console.log(
          `Err checking out ${productLot.productInfo.name} lot #${productLot.productLotId}`,
          err
        );
        setCheckingOut(false);
      });
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
                  className="border-b hover:bg-gray-100"
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
                      onClick={() => checkout(productLot)}
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
    </div>
  );
};

export default InWarehouse;
