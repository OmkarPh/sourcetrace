import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import React, { FormEvent, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { CreateCheckOut } from "../../../apis/apis";
import { useMetamaskAuth } from "../../../auth/authConfig";
import { DRIVER_SERVER } from "../../../constants/endpoints";
import {
  humidityToUnits,
  productLotDetailsToIdentifier,
  productTimeToDriverTimeLimit,
  temperatureToUnits,
  timestampToDate,
  unitsToHumidity,
  unitsToTemperature,
} from "../../../utils/general";
import Loader from "../../core/Loader";
import { ProductLot, ProductLotWithCheckpoints, Scan } from "../productTypes";
import CustomModal, {
  CustomModalFooter,
  CustomModalHeader,
} from "./CustomModal";

interface ProductLotModalProps {
  productLot: ProductLotWithCheckpoints;
  closeModal: () => void;
  refresh: () => void;
}
const ProductLotModal = (props: ProductLotModalProps) => {
  const { productLot, refresh, closeModal } = props;
  const { profile } = useMetamaskAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const [scan, setScan] = useState<Scan | null>(null);
  const [selectedTruckAddress, setSelectedTruck] = useState(profile?.parsedTruckDetails[0].address);

  console.log("Checkout product lot", productLot);

  const {
    productInfo,
    createdAt,
    producerAddress,
    productId,
    productLotId,
    quantity,
  } = productLot;

  const canCheckOut = useMemo(() => {
    const lastCheckpoint =
      productLot.checkpoints[productLot.checkpoints.length - 1];
    if (Number(lastCheckpoint.outTime) != 0) return false;
    return lastCheckpoint.warehouse.id == profile?.id;
  }, [productLot, profile]);

  function scanDriver() {
    axios
      .get(`${DRIVER_SERVER}/driver/sensor`)
      .then((res: any) => {
        const data = res.data;
        setScan({
          temperature: data.temperature,
          humidity: data.humidity,
        });
      })
      .catch((err) => {
        setScan({
          temperature: 26,
          humidity: 55,
        });
      });
  }

  function unableToCommunicateServer(){
    toast.error("Unable to establish connection to truck !");
  }
  async function checkoutFromFactory(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!productLot || !profile) return;

    if(!scan){
      toast.error("Temperature & humidity data not scanned !");
      return;
    }

    const { productInfo } = productLot;

    const parsedTemperature = temperatureToUnits(scan.temperature);
    const parsedHumidity = humidityToUnits(scan.humidity);

    try {
      const apiTestResponse = await axios.get(`${DRIVER_SERVER}/api/test`);
      if(!apiTestResponse?.data?.message){
        unableToCommunicateServer();
        return;
      }
    } catch(err) {
      unableToCommunicateServer();
      return;
    }
    
    const params = {
      productLotId: productLotDetailsToIdentifier(productLot.producerAddress, productLot.productLotId),
      truckAddress: selectedTruckAddress,
      minTemperature: unitsToTemperature(productInfo.minValues[0]),
      maxTemperature: unitsToTemperature(productInfo.maxValues[0]),
      minHumidity: unitsToHumidity(productInfo.minValues[1]),
      maxHumidity: unitsToHumidity(productInfo.maxValues[1]),
      timeLimit: productTimeToDriverTimeLimit(Number(productInfo.maxValues[2] || -1)),
    }
    console.log("Truck polling with params", productInfo, params);

    setCheckingOut(true);
    CreateCheckOut(
      profile.id,
      productLot.producerAddress,
      productLot.productLotId,
      selectedTruckAddress,
      profile.parsedTruckDetails.findIndex(truck => truck.address == selectedTruckAddress),
      parsedTemperature,
      parsedHumidity
    )
      .then(async (receipt) => {
        toast.success(`Checked out lot ${productInfo.name} !`);
        const startPollingResponse = await axios.post(`${DRIVER_SERVER}/start-polling`, params);
        console.log("Polling Response", startPollingResponse.data);
        setCheckingOut(false);
        closeModal();
        refresh();
      })
      .catch((err) => {
        toast.error(<>Please approve metamask tx</>);
        console.log(
          `Err checking out ${productInfo.name} lot #${productLot.productLotId}`,
          err
        );
        setCheckingOut(false);
      });

    return false;
  }

  return (
    <CustomModal
      isOpen
      onClose={closeModal}
    >
      {checkingOut ? (
        <Loader size={50} />
      ) : (
        <form onSubmit={checkoutFromFactory}>
          <CustomModalHeader>
            #{productLot.productLotId} - {productInfo.name}
          </CustomModalHeader>

          <div className="flex justify-center p-4">
            <div className="w-fit border-r border-gray-300 rounded-l-lg p-4">
              <Image
                height={300}
                width={300}
                src={productInfo.imageURL}
                alt={productInfo.name}
              />
            </div>
            <div
              className="w-max rounded-r-lg p-4 ml-3"
              style={{ minWidth: "400px" }}
            >
              <h3 className="text-lg font-medium mb-2">
                Quantity - {quantity}
              </h3>
              <h4 className="font-normal mb-2">
                Produced on {timestampToDate(createdAt).toLocaleDateString()}
              </h4>
              <br/>
              {/* Dispatch truck:
              <br/> */}
              <FormControl fullWidth>
                <InputLabel>Dispatch Truck</InputLabel>
              <Select value={selectedTruckAddress} label="Dispatch Truck" onChange={e => setSelectedTruck(e.target.value)}>
                {
                  profile?.parsedTruckDetails.map(truck => {
                    return (
                      <MenuItem value={truck.address} key={truck.address}>
                          { truck.license }
                      </MenuItem>
                    )
                  }) || ""
                }
              </Select>
              </FormControl>
              <br/>

              {/* <h3 className="text-lg font-medium mb-2">Parameters</h3> */}
              {scan && (
                <>
                  {/* Scan details: */}
                  {/* <br/> */}
                  <br />
                  Temperature: &nbsp;&nbsp; {scan ? scan.temperature : "--"} °C
                  <br />
                  Humidity: &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                  {scan ? scan.humidity : "--"} %
                  <br />
                </>
              )}
              <br />
              {<Button onClick={scanDriver}>{scan ? "Rescan" : "Scan"}</Button>}
            </div>
          </div>

          <CustomModalFooter>
            <button
              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={closeModal}
            >
              Close
            </button>
            <Button variant="contained" type="submit">
              Checkout
            </Button>
          </CustomModalFooter>
        </form>
      )}
    </CustomModal>
  );
};

export default ProductLotModal;
