import React, { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import tw from "tailwind-styled-components";
import { producerAccounts } from "../apis/setup/details";
import { availabelTrucks } from "../constants/avaiilableTrucks";
import { toast } from "react-toastify";
import {
  Address,
  CopyIcon,
  Row2,
} from "../components/Dashboard/profile.styled";
import axios from "axios";
import { DRIVER_SERVER } from "../constants/endpoints";
import { Button, MenuItem, Select } from "@mui/material";

const Container = tw.div`
  flex
  flex-col
  items-center
  md:flex-row
  md:justify-center
  md:items-start
`;

const CustomSelectMenu = tw.select`
  mb-4
  md:mr-4
`;

const Input = tw.input`
  mb-4
  md:mb-0
`;

const QRCodeText = tw.div`
  mt-2
`;

const Util = () => {
  const [selectedProducer, setSelectedProducer] = useState(
    "0xabd8EeD5b630578F72eEB06c637dB7179576A811"
  );
  const [productLot, setProductLot] = useState("0");

  const handleSelectProducer = (event: any) => {
    setSelectedProducer(event.target.value);
  };

  const handleProductLot = (event: any) => {
    setProductLot(event.target.value);
  };

  const CopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard !");
  };

  const changeSensorConfig = (option: string) => {
    axios
      .get(`${DRIVER_SERVER}/${option}`)
      .then((res) => {
        toast.success(`Set sensor as ${option}`);
      })
      .catch((err) => {
        toast.error("Some error connecting to driver");
        console.log(err);
      });
  };

  const qrCodeValue = `${selectedProducer}_${productLot}`;
  console.log(availabelTrucks);

  return (
    <>
      <div className="p-5 flex justify-center align-middle text-md">
        <br/>
        Driver software controller &nbsp;&nbsp;
        <Select
          defaultValue={"normal"}
          onChange={(e) => changeSensorConfig(e.target.value)}
        >
          {["normal", "coldStorage", "coldStorageCompromised"].map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className="p-5 flex justify-center align-middle text-md">
        <br/>
        Truck polling mode &nbsp;&nbsp;
        <Select
          defaultValue={"valid-polling"}
          onChange={(e) => changeSensorConfig(e.target.value)}
        >
          {["valid-polling", "invalid-polling"].map((opt) => (
            <MenuItem key={opt} value={opt}>
              { opt.split('-').join(' ') }
            </MenuItem>
          ))}
        </Select>
      </div>

      <br />
      <Container>
        Producer:
        <br />
        <CustomSelectMenu
          onChange={handleSelectProducer}
          className="max-w-full"
          defaultValue="0xabd8EeD5b630578F72eEB06c637dB7179576A811"
        >
          <option value="">Select producer</option>
          {Object.values(producerAccounts).map((producer) => (
            <option key={producer.address} value={producer.address}>
              {producer.name} ( {producer.address} )
            </option>
          ))}
        </CustomSelectMenu>
        <Input
          type="text"
          defaultValue={0}
          placeholder="Enter product lot"
          onChange={handleProductLot}
        />
      </Container>

      <br />
      <center>
        {qrCodeValue && (
          <>
            <QRCode
              value={qrCodeValue}
              size={256}
              fgColor="#000"
              logoWidth={64}
            />
            <QRCodeText>{qrCodeValue}</QRCodeText>
          </>
        )}
      </center>
      <br />

      <div className="p-2 text-2xl">Trucks:</div>
      {availabelTrucks.map((truckAddress) => (
        <Row2 key={truckAddress}>
          <Address style={{ color: "#000", fontSize: "20px", maxWidth: "80%" }}>
            {truckAddress}
          </Address>
          <CopyIcon
            src="icons/copyIcon.png"
            onClick={() => CopyToClipboard(truckAddress)}
          />
        </Row2>
      ))}

      <br />
      <br />
      <br />
    </>
  );
};

export default Util;
