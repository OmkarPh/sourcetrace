import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  Modal,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import { unitsToHumidity, unitsToTemperature } from "../../../utils/general";
import { ProductInfo } from "../productTypes";
import CustomModal, { CustomModalFooter, CustomModalHeader } from "./CustomModal";
// import Dialog from '@mui/material/Dialog';
import SimpleDialogDemo from "./Qr";

interface ProductInfoModalProps {
  productInfo: ProductInfo;
  closeModal: () => void;
}
const ProductInfoModal = (props: ProductInfoModalProps) => {
  const { productInfo, closeModal } = props;
  console.log("Preview product", productInfo);

  const [show, setShow] = useState(false);

  const {
    imageURL,
    maxValues,
    minValues,
    name,
    params,
    price,
    producer,
    productId,
  } = productInfo;

  return (
    <CustomModal isOpen onClose={closeModal}>
      <CustomModalHeader>
        #{productInfo.productId} { productInfo.name }
      </CustomModalHeader>

      <div className="flex justify-center p-4">
        <div className="w-fit border-r border-gray-300 rounded-l-lg p-4">
          <Image
            height={300}
            width={300}
            src={imageURL}
            alt={name}
          />
          <br/>
          <div className=" flex justify-center">
              {/* <h3 className="text-lg font-medium mb-2">QR code</h3> */}
              <div>
              <SimpleDialogDemo/>

              </div>

              {/* <button onClick={()=>setShow(!show)} className=" bg-blue-100 pt-1 pb-1 pl-4 pr-4 rounded-md hover:bg-blue-400"></button>
              {
                show && <p className=" w-10">showwwwmbbbvmbmnvnvvhjyfufy<br/>dkfsghjgjbjkgktserastyuiopiuytfdghjkhnvbn,bvn</p>
              } */}
              {/* </SimpleDialogDemo> */}
              </div>

        </div>
        <div className="w-max  rounded-r-lg p-4 ml-3 min-w-max" style={{ minWidth: "350px" }}>
          <h2 className="text-xl font-bold mb-2">{name}</h2>
              <ul className="list-disc list-inside mb-4">
                <li>Price: {price}</li>
                {/* <li>Producer: {producer}</li>
                <li>Product ID: {productId}</li> */}
              </ul>
              <h3 className="text-lg font-medium mb-2">Parameters</h3>
              <div>
                Temperature: { unitsToTemperature(minValues[0])}°C to { unitsToTemperature(maxValues[0]) }°C
              </div>
              <div>
                Humidity: { unitsToHumidity(minValues[1])}% to { unitsToHumidity(maxValues[1]) }%
              </div>
              <div>
                Transit time limit: { maxValues[2] / 60 } hours
              </div>
              <br/>
              
              

            
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
      </CustomModalFooter>
    </CustomModal>
  );
};

export default ProductInfoModal;
