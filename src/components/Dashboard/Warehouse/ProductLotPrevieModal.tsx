import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { CreateCheckIn, CreateCheckOut, Reject } from "../../../apis/apis";
import { Roles, useMetamaskAuth } from "../../../auth/authConfig";
import { DRIVER_SERVER } from "../../../constants/endpoints";
import {
  buildRejectionString,
  humidityToUnits,
  isCheckinPossible,
  parseRejectionMessage,
  productLotDetailsToIdentifier,
  productTimeToDriverTimeLimit,
  temperatureToUnits,
  timestampToDate,
  unitsToHumidity,
  unitsToTemperature,
} from "../../../utils/general";
import Loader from "../../core/Loader";
import { ProductLotWithCheckpoints, Scan } from "../productTypes";
import Image from "next/image";
import CustomModal, {
  CustomModalFooter,
  CustomModalHeader,
} from "../Producer/CustomModal";
import ValidityLabel from "../../core/ValidityLabel";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// import Dialog, { DialogProps } from '@mui/material/Dialog';
// const [open, setOpen] = React.useState(false);
// const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

// const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
//   setOpen(true);
//   setScroll(scrollType);
// };

// const descriptionElementRef = React.useRef<HTMLElement>(null);
// React.useEffect(() => {
//   if (open) {
//     const { current: descriptionElement } = descriptionElementRef;
//     if (descriptionElement !== null) {
//       descriptionElement.focus();
//     }
//   }
// }, [open]);

interface ProductPreviewModalrops {
  closeModal: () => void;
  noActions?: boolean;
  productLot: ProductLotWithCheckpoints;
}
const ProductPreviewModal = (props: ProductPreviewModalrops) => {
  const { productLot, closeModal, noActions } = props;
  const { profile } = useMetamaskAuth();
  const [processing, setProcessing] = useState(false);
  const [scan, setScan] = useState<Scan | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedTruckAddress, setSelectedTruck] = useState(
    profile?.parsedTruckDetails?.length
      ? profile?.parsedTruckDetails[0].address
      : null
  );
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const { productInfo, createdAt, quantity } = productLot;
  const isRetailer = profile?.role === Roles.RETAILER;

  useEffect(() => {
    console.log("Lot", productLot);
    console.log("Details", {
      isLotRejectable,
      isLotTransitCompliant,
      requiresCheckin,
    });
  }, [productLot]);

  const isLotTransitCompliant = useMemo(() => {
    for (const checkpoint of productLot.checkpoints) {
      const transitCompliance = !checkpoint.validities.length
        ? 100
        : (checkpoint.validities.reduce((a, v) => (v === true ? a + 1 : a), 0) *
            100) /
          checkpoint.validities.length;
      if (transitCompliance < 75) return false;
    }
    return true;
  }, [productLot]);

  console.log("Transit compliant ?", isLotTransitCompliant);
  const isLotRejectable = useMemo(() => {
    if (productLot.rejected) return false;
    const lastCheckpoint =
      productLot.checkpoints[productLot.checkpoints.length - 1];
    if (Number(lastCheckpoint.outTime) == 0) return false;
    return true;
  }, [productLot]);
  const requiresCheckin = useMemo(
    () => isCheckinPossible(productLot),
    [productLot]
  );
  const canCheckIn = useMemo(() => {
    if (!isLotTransitCompliant) return false;
    const lastCheckpoint =
      productLot.checkpoints[productLot.checkpoints.length - 1];
    if (Number(lastCheckpoint.outTime) == 0) return false;
    return true;
  }, [productLot]);
  const canCheckOut = useMemo(() => {
    if (isRetailer) return false;
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
  async function CheckOut() {
    if (!profile) return;

    if (!selectedTruckAddress) {
      toast.error("Register a truck for export !!");
      return;
    }

    if (!scan) {
      toast.error("Temperature & humidity data not scanned !");
      return;
    }

    const parsedTemperature = temperatureToUnits(scan.temperature);
    const parsedHumidity = humidityToUnits(scan.humidity);
    setProcessing(true);

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
        setProcessing(false);
        closeModal();
        setTimeout(() => window.location.reload(), 200);
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
  async function reject() {
    if (!profile) return;
    if (!rejectionReason.length)
      return toast.error("Please enter reason for rejection");
    const rejectedMessage = buildRejectionString(profile.id, rejectionReason);
    console.log("Rejection msg", rejectedMessage);
    console.log("Parsed:", parseRejectionMessage(rejectedMessage));

    setIsRejectDialogOpen(false);
    setProcessing(true);
    Reject(
      profile.id,
      productLot.producerAddress,
      productLot.productLotId,
      1,
      rejectedMessage
    )
      .then(() => {
        toast.success("Rejected successfuly !");
        setProcessing(false);
        setTimeout(() => {
          closeModal();
        }, 200);
      })
      .catch((err) => {
        setProcessing(false);
        toast.error("Please approve metamask tx !");
      });
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
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none productLotPreview">
        {processing ? (
          <Loader />
        ) : (
          <FormGroup className="relative w-1/3 my-6 mx-auto max-w-3xl">
            {/*content*/}
            {processing ? (
              <Loader size={30} />
            ) : (
              <CustomModal isOpen onClose={closeModal}>
                <CustomModalHeader>
                  <h3 className="text-3xl font-semibold">
                    {productLot.productInfo.name} Lot #{" "}
                    {productLot.productLotId}
                    <span className="m-4 mb-2">
                      {productLot.rejected && (
                        <ValidityLabel valid={false} inValidText={`Rejected`} />
                      )}
                    </span>
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={closeModal}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </CustomModalHeader>
                {/*body*/}
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
                    style={{
                      minWidth: "400px",
                      maxHeight: "70vh",
                      overflow: "scroll",
                    }}
                  >
                    <h3 className="text-lg font-medium mb-2">
                      Quantity - {quantity}
                      <span className="p-2 ml-4">
                        ( Produced on{" "}
                        {timestampToDate(createdAt).toLocaleDateString()})
                      </span>
                    </h3>
                    <h3 className="text-lg font-medium mb-1">
                      Parameters
                      { productLot.productInfo.isPerishable && " (Perishable Product)"}
                    </h3>
                    <div>
                      <div className="flex flex-row">
                        <div className="w-1/2">
                          Temperature:{" "}
                          {unitsToTemperature(productInfo.minValues[0])}°C to{" "}
                          {unitsToTemperature(productInfo.maxValues[0])}°C
                        </div>
                        <div className="w-1/2">
                          Humidity: {unitsToHumidity(productInfo.minValues[1])}%
                          to {unitsToHumidity(productInfo.maxValues[1])}%
                        </div>
                      </div>
                    </div>
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
                              <Accordion
                                defaultExpanded={!isTransitComplianceValid}
                              >
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
                                      <>
                                        ({isRetailer ? "At retailer" : "Stored"}
                                        )
                                      </>
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
                                          {unitsToHumidity(
                                            checkpoint.in_humidity
                                          )}{" "}
                                          %
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
                                          {unitsToHumidity(
                                            checkpoint.out_humidity
                                          )}{" "}
                                          %
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
                    {!isRetailer && canCheckOut && (
                      <>
                        <br />
                        <FormControl fullWidth>
                          {selectedTruckAddress ? (
                            <>
                              <InputLabel>Dispatch Truck</InputLabel>
                              <Select
                                value={selectedTruckAddress}
                                label="Dispatch Truck"
                                className="mb-2"
                                onChange={(e) =>
                                  setSelectedTruck(e.target.value)
                                }
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
                      </>
                    )}
                    {(canCheckIn || canCheckOut) && (
                      <div>
                        {scan && (
                          <>
                            {/* Scan details: */}
                            {/* <br/> ‼️*/}
                            <br />
                            Temperature: &nbsp;&nbsp;{" "}
                            {scan ? scan.temperature : "--"} °C
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
                        <Button onClick={scanDriver}>
                          {scan ? "Rescan" : "Scan"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {/*footer*/}{" "}
                <CustomModalFooter>
                  {isLotRejectable && (
                    <Button
                      className="m-2"
                      color="error"
                      variant="outlined"
                      disabled={!isLotRejectable}
                      onClick={() => setIsRejectDialogOpen(true)}
                    >
                      Reject
                    </Button>
                  )}
                  &nbsp;&nbsp;
                  {!noActions && (
                    <FormControl>
                      {requiresCheckin ? (
                        <>
                          <Button
                            type="submit"
                            variant="outlined"
                            onClick={CheckIn}
                            disabled={
                              !canCheckIn ||
                              !isTemperatureValid ||
                              !isHumidityValid ||
                              !isLotTransitCompliant
                            }
                          >
                            Checkin
                          </Button>
                        </>
                      ) : (
                        <>
                          {!isRetailer && (
                            <Button
                              type="submit"
                              variant="outlined"
                              onClick={CheckOut}
                              disabled={
                                !canCheckOut ||
                                !isTemperatureValid ||
                                !isHumidityValid
                              }
                            >
                              Checkout
                            </Button>
                          )}
                        </>
                      )}
                    </FormControl>
                  )}
                  <Dialog
                    open={isRejectDialogOpen}
                    fullWidth
                    onClose={() => setIsRejectDialogOpen(false)}
                  >
                    <DialogTitle>Reject</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Please explain reason for rejection
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        label="Rejection reason"
                        type="text"
                        fullWidth
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        name="rejection_reason"
                        variant="standard"
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setIsRejectDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        className="text-red-500 background-transparent font-bold"
                        onClick={reject}
                      >
                        Reject
                      </Button>
                    </DialogActions>
                  </Dialog>
                </CustomModalFooter>
              </CustomModal>
            )}
          </FormGroup>
        )}
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default ProductPreviewModal;
