import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { InventProduct, uploadImg } from "../../../apis/apis";
import { useMetamaskAuth } from "../../../auth/authConfig";
import {
  DEFAULT_PRODUCT_IMAGE,
  humidityToUnits,
  params,
  temperatureToUnits,
} from "../../../utils/general";
import Loader from "../../core/Loader";
import CustomModal, {
  CustomModalFooter,
  CustomModalHeader,
} from "./CustomModal";

interface NewProductModalProps {
  show: boolean;
  closeModal: () => void;
}
const NewProductModal = (props: NewProductModalProps) => {
  const { show, closeModal } = props;
  const { profile, refreshAuthStatus } = useMetamaskAuth();

  const [creatingProduct, setCreatingProduct] = useState(false);
  const [uploadedImageURL, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  async function newProduct(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!profile) return;
    // if (!scan) {
    //   toast.error("Temperature & humidity data not scanned !");
    //   return;
    // }
    const formValTargets = e.target as any;

    const isPerishable = formValTargets.isPerishable.checked;
    const maxTransitTime = formValTargets.maxTransitTime.value;
    const minTemperature = formValTargets.minTemperature.value;
    const maxTemperature = formValTargets.maxTemperature.value;
    const minHumidity = formValTargets.minHumidity.value;
    const maxHumidity = formValTargets.maxHumidity.value;
    
    let imgURL = DEFAULT_PRODUCT_IMAGE;
    try{
      imgURL = uploadedFile ? await uploadImg(uploadedFile) : DEFAULT_PRODUCT_IMAGE;
    } catch(err) {
      return toast.error("Some error uploading image to CDN !");
    }

    const values = {
      name: formValTargets.name.value,
      price: formValTargets.price.value,
      imgURL,
      isPerishable,
      params,
      minValues: [
        temperatureToUnits(minTemperature),
        humidityToUnits(minHumidity),
        -1,
      ],
      maxValues: [
        temperatureToUnits(maxTemperature),
        humidityToUnits(maxHumidity),
        maxTransitTime * 6,
      ],
    };
    console.log("Creating new product values: ", values);
    setCreatingProduct(true);

    InventProduct(
      profile.id,
      values.name,
      values.price,
      imgURL,
      isPerishable,
      params,
      values.minValues,
      values.maxValues
    )
      .then((receipt) => {
        closeModal();
        toast.success("Created product !");
        console.log("New product created", receipt);
        refreshAuthStatus();
        setCreatingProduct(false);
      })
      .catch((err) => {
        toast.error(<>Please approve metamask tx</>);
        console.log("Some err creating product", err);
        setCreatingProduct(false);
        // closeModal();
      });
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    if (
      !event.target ||
      !event.target.files ||
      !(event.target instanceof HTMLInputElement)
    )
      return;
    setUploadedImage(URL.createObjectURL(event.target.files[0]));
    setUploadedFile(event.target.files[0]);
  }

  if (!show) return <></>;

  return (
    <CustomModal isOpen onClose={closeModal}>
      {creatingProduct ? (
        <>
          <Loader size={30} />
        </>
      ) : (
        <form onSubmit={newProduct}>
          <FormGroup className="bg-white outline-none focus:outline-none min-w-fit">
            <CustomModalHeader>
              <h3 className="text-3xl font-semibold">New product</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={closeModal}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </CustomModalHeader>

            <div className="relative p-6 flex flex-row">
              <Box className="flex w-1/2">
                {uploadedImageURL ? (
                  <div className="imgpreview">
                    <img
                      style={{ maxWidth: 200, maxHeight: 450 }}
                      src={uploadedImageURL!}
                      alt="NFT preview"
                    />
                    <br />
                    <Button variant="contained" component="label">
                      Change image
                      <input
                        onChange={handleImageChange}
                        type="file"
                        accept="image/*,video/*"
                        hidden
                      />
                    </Button>
                  </div>
                ) : (
                  <div className="dropinput my-2 relative">
                    <div className="form-group filesinput color h-100">
                      <div className="center text-center w-full p-4">
                        Upload Product image
                        <br />
                        <br />
                      </div>
                      <input
                        type="file"
                        multiple={false}
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-control h-100"
                      />
                    </div>
                  </div>
                )}
                <br />
              </Box>
              <div>
                <FormControl fullWidth className="m-2 flex w-1/2">
                  <TextField
                    required
                    name="name"
                    type="text"
                    variant="outlined"
                    label="Product name"
                    autoComplete="nope"
                  />
                </FormControl>
                <br />
                <FormControl>
                  <TextField
                    required
                    name="price"
                    type="number"
                    variant="outlined"
                    label="Price"
                    autoComplete="nope"
                    style={{ marginTop: 15 }}
                  />
                </FormControl>
                <br />
                <br />
                Tolerances
                <br />
                <div className="flex flex-row w-100 gap-2">
                  <FormControl className="w-1/2">
                    {/* Note - 10 hours = 1 minute for demonstration */}
                    <TextField
                      required
                      name="maxTransitTime"
                      type="number"
                      inputProps={{ step: "0.1", lang: "en-US" }}
                      variant="outlined"
                      label="Max Transit time"
                      autoComplete="nope"
                      style={{ marginTop: 15 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">hours</InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                  <FormControlLabel
                    className="pl-4"
                    control={<Checkbox />}
                    label="Perishable product ?"
                    name="isPerishable"
                  />
                </div>
                <br />
                <div className="flex flex-row w-100 gap-2">
                  <FormControl className="w-1/2">
                    <TextField
                      required
                      name="minTemperature"
                      type="number"
                      inputProps={{ step: "0.1", lang: "en-US" }}
                      variant="outlined"
                      label="Min Temperature"
                      autoComplete="nope"
                      style={{ marginTop: 15 }}
                    />
                  </FormControl>
                  <FormControl className="w-1/2">
                    <TextField
                      required
                      name="maxTemperature"
                      type="number"
                      inputProps={{ step: "0.1", lang: "en-US" }}
                      variant="outlined"
                      label="Max Temperature"
                      autoComplete="nope"
                      style={{ marginTop: 15 }}
                    />
                  </FormControl>
                </div>
                <br />
                <div className="flex flex-row w-100 gap-2">
                  <FormControl className="w-1/2">
                    <TextField
                      required
                      name="minHumidity"
                      type="number"
                      inputProps={{ step: "0.1", lang: "en-US" }}
                      variant="outlined"
                      label="Min Humidity"
                      autoComplete="nope"
                      style={{ marginTop: 15 }}
                    />
                  </FormControl>
                  <FormControl className="w-1/2">
                    <TextField
                      required
                      name="maxHumidity"
                      type="number"
                      inputProps={{ step: "0.1", lang: "en-US" }}
                      variant="outlined"
                      label="Max Humidity"
                      autoComplete="nope"
                      style={{ marginTop: 15 }}
                    />
                  </FormControl>
                </div>
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
              <FormControl>
                <Button type="submit" variant="outlined">
                  Submit
                </Button>
              </FormControl>
            </CustomModalFooter>
          </FormGroup>
        </form>
      )}
    </CustomModal>
  );
};

export default NewProductModal;
