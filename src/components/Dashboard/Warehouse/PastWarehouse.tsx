import {
  Button,
  FormControl,
  FormGroup,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CreateProductLot, GetAllProductsInfo } from "../../../apis/apis";
import { useMetamaskAuth } from "../../../auth/authConfig";
import { humidityToUnits, temperatureToUnits, timestampToDate, unitsToHumidity, unitsToTemperature } from "../../../utils/general";
import Loader from "../../core/Loader";
import { ProductLotWithCheckpoints } from "../productTypes";

interface PastWarehouseProps {
  productLots: ProductLotWithCheckpoints[];
}

const PastWarehouse = (props: PastWarehouseProps) => {
  const { productLots } = props;
  const { profile, isProcessingLogin } = useMetamaskAuth();


  if (isProcessingLogin) return <Loader size={50} />;

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
                Checked out 
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
                  <td className="py-3 px-4">
                    {timestampToDate(productLot.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {productLot.sourceFactoryLocation}
                  </td>
                  <td className="py-3 px-4">
                    {
                      timestampToDate(productLot.checkpoints.find(checkpoint => checkpoint.warehouse.id == profile?.id)?.outTime || "").toLocaleDateString()
                    }
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

export default PastWarehouse;
