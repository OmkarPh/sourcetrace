import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
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
import ValidityLabel from "../../core/ValidityLabel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LotQR from "../LotQR";
import { Phone } from "@mui/icons-material";

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
  const [selectedTruckAddress, setSelectedTruck] = useState(
    profile?.parsedTruckDetails?.length
      ? profile?.parsedTruckDetails[0].address
      : null
  );

  console.log("Checkout product lot", productLot);

  const {
    productInfo,
    createdAt,
    producerAddress,
    productId,
    productLotId,
    quantity,
  } = productLot;

  const isAtRetailer =
    productLot.checkpoints[productLot.checkpoints.length - 1].warehouse
      .isRetailer;
  const lastCheckpointEntity =
    productLot.checkpoints[productLot.checkpoints.length - 1];
  const isInWarehouse =
    lastCheckpointEntity.warehouse.id !==
      "0x0000000000000000000000000000000000000000" &&
    lastCheckpointEntity.outTime == "0";
  const noActions = isAtRetailer || isInWarehouse;
  console.log({ isAtRetailer, lastCheckpointEntity, isInWarehouse, noActions });

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

  function unableToCommunicateServer() {
    toast.error("Unable to establish connection to truck !");
  }
  async function checkoutFromFactory(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!productLot || !profile) return;

    if (!scan) {
      toast.error("Temperature & humidity data not scanned !");
      return;
    }

    const { productInfo } = productLot;

    const parsedTemperature = temperatureToUnits(scan.temperature);
    const parsedHumidity = humidityToUnits(scan.humidity);

    try {
      const apiTestResponse = await axios.get(`${DRIVER_SERVER}/api/test`);
      if (!apiTestResponse?.data?.message) {
        unableToCommunicateServer();
        return;
      }
    } catch (err) {
      unableToCommunicateServer();
      return;
    }

    const params = {
      productLotId: productLotDetailsToIdentifier(
        productLot.producerAddress,
        productLot.productLotId
      ),
      truckAddress: selectedTruckAddress,
      minTemperature: unitsToTemperature(productInfo.minValues[0]),
      maxTemperature: unitsToTemperature(productInfo.maxValues[0]),
      minHumidity: unitsToHumidity(productInfo.minValues[1]),
      maxHumidity: unitsToHumidity(productInfo.maxValues[1]),
      timeLimit: productTimeToDriverTimeLimit(
        Number(productInfo.maxValues[2] || -1)
      ),
    };
    console.log("Truck polling with params", productInfo, params);

    setCheckingOut(true);
    CreateCheckOut(
      profile.id,
      productLot.producerAddress,
      productLot.productLotId,
      selectedTruckAddress,
      profile.parsedTruckDetails.findIndex(
        (truck) => truck.address == selectedTruckAddress
      ),
      parsedTemperature,
      parsedHumidity
    )
      .then(async (receipt) => {
        toast.success(`Checked out lot ${productInfo.name} !`);
        const startPollingResponse = await axios.post(
          `${DRIVER_SERVER}/start-polling`,
          params
        );
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

  const isTemperatureValid = scan
    ? unitsToTemperature(productInfo.minValues[0]) <= scan.temperature &&
      unitsToTemperature(productInfo.maxValues[0]) >= scan.temperature
    : false;
  const isHumidityValid =
    productInfo && scan
      ? unitsToHumidity(productInfo.minValues[1]) <= scan.humidity &&
        unitsToHumidity(productInfo.maxValues[1]) >= scan.humidity
      : false;

  return (
    <CustomModal isOpen onClose={closeModal}>
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
              <LotQR
                text={`${productLot.producerAddress}_${productLot.productLotId}`}
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

              <h3 className="text-lg font-medium mb-2">
                Quantity - {quantity}
                <span className="p-2 ml-4">
                  ( Produced on{" "}
                  {timestampToDate(createdAt).toLocaleDateString()})
                </span>
              </h3>
              <h3 className="text-lg font-medium mb-1">Parameters</h3>
              <div>
                <div className="flex flex-row">
                  <div className="w-1/2">
                    Temperature: {unitsToTemperature(productInfo.minValues[0])}
                    °C to {unitsToTemperature(productInfo.maxValues[0])}°C
                  </div>
                  <div className="w-1/2">
                    Humidity: {unitsToHumidity(productInfo.minValues[1])}% to{" "}
                    {unitsToHumidity(productInfo.maxValues[1])}%
                  </div>
                </div>
              </div>
              {productLot.rejected && (
                <>
                  <ValidityLabel
                    valid={false}
                    inValidText={`Rejected: ${productLot.rejection?.reason}`}
                  />
                  <br />
                </>
              )}
              {/* <div>
                      Transit time limit: {productInfo.maxValues[2] / 60} hours
                    </div> */}

              <ul className="list-item mt-4">
                {productLot.checkpoints.map((checkpoint, idx) => {
                  const postTitle = idx == 0 ? " - Factory" : "";
                  const title =
                    (idx === 0
                      ? productLot.sourceFactoryName
                      : checkpoint.warehouse.name) + postTitle;
                  const isCheckedOut = Number(checkpoint.outTime) != 0;
                  const transitCompliance = !checkpoint.validities.length
                    ? 100
                    : (
                        (checkpoint.validities.reduce(
                          (a, v) => (v === true ? a + 1 : a),
                          0
                        ) *
                          100) /
                        checkpoint.validities.length
                      ).toFixed();
                  const isTransitComplianceValid =
                    Number(transitCompliance) >= 75;
                  const isRetailer = checkpoint.warehouse.isRetailer;

                  return (
                    <li key={checkpoint.inTime + idx}>
                      {/* #{idx}  */}
                      <div className="w-[500px] ">
                        <Accordion defaultExpanded={!isTransitComplianceValid}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            // sx={{
                            //   height: "45px"
                            // }}
                          >
                            <Typography>
                              {isTransitComplianceValid ? (
                                "✅"
                              ) : (
                                <ValidityLabel
                                  valid={isTransitComplianceValid}
                                  inValidText={`!!`}
                                />
                              )}
                              &nbsp;&nbsp;
                              {/* {isTransitComplianceValid ? "✅ " : "!!"} &nbsp; */}
                              {title} &nbsp;
                              {!isCheckedOut && (
                                <>({isRetailer ? "At retailer" : "Stored"})</>
                              )}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails style={{ padding: 5 }}>
                            {isCheckedOut && (
                              <ValidityLabel
                                valid={isTransitComplianceValid}
                                validText={`Transit compliance: ${transitCompliance} %`}
                                inValidText={`Transit compliance: ${transitCompliance} %`}
                              />
                            )}
                            {/* {isCheckedOut && (
                                    <div className={`pl-2 ${isTransitComplianceValid ? 'text-green-800' : 'text-danger-600'}`}>
                                      
                                    </div>
                                  )} */}
                            <div className="flex flex-row">
                              <div className="w-1/2 p-2">
                                Temperature
                                <div className="p-0 pt-1">
                                  <span className="ml-1">
                                    {/* In */}
                                    ⬇️{" "}
                                    {/* {unitsToTemperature(
                                            Number(productInfo.minValues[0]) <=
                                              Number(
                                                checkpoint.in_temperature
                                              ) &&
                                              Number(
                                                productInfo.maxValues[0]
                                              ) >=
                                                Number(
                                                  checkpoint.in_temperature
                                                )
                                              ? checkpoint.in_temperature
                                              : productInfo.maxValues[0]
                                          )}{" "} */}
                                    {unitsToTemperature(
                                      checkpoint.in_temperature
                                    )}{" "}
                                    °C
                                  </span>
                                  <span className="ml-4">
                                    {/* Out */}
                                    ⬆️{" "}
                                    {/* {unitsToTemperature(
                                            Number(productInfo.minValues[0]) <=
                                              Number(
                                                checkpoint.out_temperature
                                              ) &&
                                              Number(
                                                productInfo.maxValues[0]
                                              ) >=
                                                Number(
                                                  checkpoint.out_temperature
                                                )
                                              ? checkpoint.out_temperature
                                              : productInfo.maxValues[0]
                                          )}{" "} */}
                                    {unitsToTemperature(
                                      checkpoint.out_temperature
                                    )}{" "}
                                    °C
                                  </span>
                                </div>
                              </div>
                              <div className="w-1/2 p-2">
                                Humidity
                                <div className="p-0 pt-1">
                                  <span className="ml-1">
                                    {/* In */}
                                    ⬇️{" "}
                                    {/* {unitsToHumidity(
                                            Number(productInfo.minValues[1]) <=
                                              Number(checkpoint.in_humidity) &&
                                              Number(
                                                productInfo.maxValues[1]
                                              ) >=
                                                Number(checkpoint.in_humidity)
                                              ? checkpoint.in_humidity
                                              : productInfo.minValues[1]
                                          )}{" "} */}
                                    {unitsToHumidity(checkpoint.in_humidity)} %
                                  </span>
                                  <span className="ml-4">
                                    {/* Out */}
                                    ⬆️{" "}
                                    {/* {unitsToHumidity(
                                            Number(productInfo.minValues[1]) <=
                                              Number(checkpoint.out_humidity) &&
                                              Number(
                                                productInfo.maxValues[1]
                                              ) >=
                                                Number(checkpoint.out_humidity)
                                              ? checkpoint.out_humidity
                                              : productInfo.minValues[1]
                                          )}{" "} */}
                                    {unitsToHumidity(checkpoint.out_humidity)} %
                                  </span>
                                </div>
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {productLot.rejection?.rejectedByWarehouse && (
                <>
                  <br />
                  <br />
                  <h3 className="text-lg">Rejected by</h3>
                  <h5>
                    {productLot.rejection.rejectedByWarehouse.name}
                    &nbsp;&nbsp;&nbsp;
                    <Phone /> {productLot.rejection.rejectedByWarehouse.phone}
                  </h5>
                </>
              )}
              {!productLot.rejected && !noActions && (
                <>
                  <br />
                  <FormControl fullWidth>
                    {selectedTruckAddress ? (
                      <>
                        <InputLabel>Dispatch Truck</InputLabel>
                        <Select
                          value={selectedTruckAddress}
                          label="Dispatch Truck"
                          onChange={(e) => setSelectedTruck(e.target.value)}
                        >
                          {profile?.parsedTruckDetails.map((truck) => {
                            return (
                              <MenuItem
                                value={truck.address}
                                key={truck.address}
                              >
                                {truck.license}
                              </MenuItem>
                            );
                          }) || ""}
                        </Select>
                      </>
                    ) : (
                      <div>No truck data available !</div>
                    )}
                  </FormControl>
                  <br />

                  {/* <h3 className="text-lg font-medium mb-2">Parameters</h3> */}
                  {scan && (
                    <>
                      {/* Scan details: */}
                      {/* <br/> ‼️*/}
                      <br />
                      Temperature: &nbsp;&nbsp; {scan
                        ? scan.temperature
                        : "--"}{" "}
                      °C
                      <span className="ml-4">
                        <ValidityLabel valid={isTemperatureValid} />
                      </span>
                      <br />
                      Humidity: &nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                      {scan ? scan.humidity : "--"} %
                      <span className="ml-4">
                        <ValidityLabel valid={isHumidityValid} />
                      </span>
                      <br />
                    </>
                  )}
                  <br />
                  {
                    <Button onClick={scanDriver}>
                      {scan ? "Rescan" : "Scan"}
                    </Button>
                  }
                </>
              )}
            </div>
          </div>

          {!noActions && (
            <CustomModalFooter>
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={closeModal}
              >
                Close
              </button>
              <Button
                variant="contained"
                type="submit"
                disabled={
                  !isHumidityValid || !isTemperatureValid || productLot.rejected
                }
              >
                Checkout
              </Button>
            </CustomModalFooter>
          )}
        </form>
      )}
    </CustomModal>
  );
};

export default ProductLotModal;
