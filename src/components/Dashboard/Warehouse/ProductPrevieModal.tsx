import { Button, FormControl, FormGroup, TextField } from "@mui/material";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { CreateCheckIn, CreateCheckOut } from "../../../apis/apis";
import { useMetamaskAuth } from "../../../auth/authConfig";
import { humidityToUnits, temperatureToUnits, timestampToDate } from "../../../utils/general";
import Loader from "../../core/Loader";
import { ProductLot, ProductLotWithCheckpoints, Scan } from "../productTypes";

interface ProductPreviewModalrops {
  closeModal: () => void;
  productLot: ProductLotWithCheckpoints;
}
const ProductPreviewModal = (props: ProductPreviewModalrops) => {
  const { productLot, closeModal } = props;
  const { profile } = useMetamaskAuth();
  const [processing, setProcessing] = useState(false);
  const [scan, setScan] = useState<Scan | null>(null);
  console.log(productLot);

  const requiresCheckin = useMemo(() => {
    const lastCheckpoint =
      productLot.checkpoints[productLot.checkpoints.length - 1];
    return Number(lastCheckpoint.outTime) != 0;
  }, [productLot]);
  const canCheckIn = useMemo(() => {
    const lastCheckpoint =
      productLot.checkpoints[productLot.checkpoints.length - 1];
    if (Number(lastCheckpoint.outTime) == 0) return false;
    return true;
  }, [productLot]);
  const canCheckOut = useMemo(() => {
    const lastCheckpoint =
      productLot.checkpoints[productLot.checkpoints.length - 1];
    if (Number(lastCheckpoint.outTime) != 0) return false;
    return lastCheckpoint.warehouse.id == profile?.id;
  }, [productLot, profile]);

  function scanDriver() {
    axios
      .get("http://localhost:5000/driver/sensor")
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

  function CheckIn() {
    if (!profile) return;
    if (!scan) {
      toast.error("Temperature & humidity data not scanned !");
      return;
    }

    const parsedTemperature = temperatureToUnits(scan.temperature);
    const parsedHumidity = humidityToUnits(scan.humidity);
    // console.log("Checkin params", {
    //   myAddr: profile.id,
    //   producer: productLot.producerAddress,
    //   lotid: productLot.productLotId,
    //   parsedTemperature,
    //   parsedHumidity,
    // });

    setProcessing(true);

    CreateCheckIn(
      profile.id,
      productLot.producerAddress,
      productLot.productLotId,
      parsedTemperature,
      parsedHumidity
    )
      .then((receipt) => {
        toast.success(`Checked in new lot ${productLot.productInfo.name} !`);
        closeModal();
        setTimeout(() => window.location.reload(), 200);
        setProcessing(false);
      })
      .catch((err) => {
        toast.error(<>Please approve metamask tx</>);
        console.log(
          `Err checking in ${productLot.productInfo.name} lot #${productLot.productLotId}`,
          err
        );
        setProcessing(false);
      });
  }
  function CheckOut() {
    if (!profile) return;
    if (!scan) {
      toast.error("Temperature & humidity data not scanned !");
      return;
    }

    const parsedTemperature = temperatureToUnits(scan.temperature);
    const parsedHumidity = humidityToUnits(scan.humidity);
    // console.log("Checkin params", {
    //   myAddr: profile.id,
    //   producer: productLot.producerAddress,
    //   lotid: productLot.productLotId,
    //   parsedTemperature,
    //   parsedHumidity,
    // });

    setProcessing(true);

    CreateCheckOut(
      profile.id,
      productLot.producerAddress,
      productLot.productLotId,
      parsedTemperature,
      parsedHumidity
    )
      .then((receipt) => {
        toast.success(`Checked out lot ${productLot.productInfo.name} !`);
        closeModal();
        setTimeout(() => window.location.reload(), 200);
        setProcessing(false);
      })
      .catch((err) => {
        toast.error(<>Please approve metamask tx</>);
        console.log(
          `Err checking out ${productLot.productInfo.name} lot #${productLot.productLotId}`,
          err
        );
        setProcessing(false);
      });
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        {
          processing ?
          <Loader />
          :
          <FormGroup className="relative w-1/3 my-6 mx-auto max-w-3xl">
            {/*content*/}
            {processing ? (
              <Loader size={30} />
            ) : (
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none w-[400px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    {productLot.productInfo.name} Lot # {productLot.productLotId}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={closeModal}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div>
                    Produced at{" "}
                    {timestampToDate(productLot.createdAt).toLocaleDateString()}
                  </div>

                  {scan && (
                    <>
                      {/* Scan details: */}
                      {/* <br/> */}
                      <br />
                      Temperature: &nbsp;&nbsp; {scan
                        ? scan.temperature
                        : "--"}{" "}
                      °C
                      <br />
                      Humidity: &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                      {scan ? scan.humidity : "--"} %
                      <br />
                    </>
                  )}
                  <br />
                  {
                    <Button onClick={scanDriver}>
                      {scan ? "Rescan" : "Scan"}
                    </Button>
                  }
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <FormControl>
                    {requiresCheckin ? (
                      <>
                        <Button
                          type="submit"
                          variant="outlined"
                          onClick={CheckIn}
                          disabled={!canCheckIn}
                        >
                          Checkin
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="submit"
                          variant="outlined"
                          onClick={CheckOut}
                          disabled={!canCheckOut}
                        >
                          Checkout
                        </Button>
                      </>
                    )}
                    {/* <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="submit"
                  >
                    Create
                  </button> */}
                  </FormControl>
                </div>
              </div>
            )}
          </FormGroup>
        }
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default ProductPreviewModal;
