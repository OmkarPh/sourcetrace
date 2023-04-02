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
import React from "react";
import { timestampToDate } from "../../../utils/general";
import { ProductInfo, ProductLot } from "../productTypes";
import CustomModal, { CustomModalFooter, CustomModalHeader } from "./CustomModal";

interface ProductLotModalProps {
  productLot: ProductLot;
  closeModal: () => void;
}
const ProductLotModal = (props: ProductLotModalProps) => {
  const { productLot, closeModal } = props;
  console.log("Checkout product lot", productLot);

  const {
    productInfo,
    createdAt,
    producerAddress,
    productId,
    productLotId,
    quantity
  } = productLot;

  return (
    <CustomModal isOpen onClose={closeModal}>
      <CustomModalHeader>
        #{ productLot.productLotId } - { productInfo.name }
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
        <div className="w-max h-64 rounded-r-lg p-4 ml-3" style={{ minWidth: "400px" }}>
          <h3 className="text-lg font-medium mb-2">
            Quantity - { quantity }
          </h3>
          <h4 className="font-normal mb-2">
            Produced on { timestampToDate(createdAt).toLocaleDateString() }
          </h4>
          {/* <h3 className="text-lg font-medium mb-2">Parameters</h3> */}
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

export default ProductLotModal;