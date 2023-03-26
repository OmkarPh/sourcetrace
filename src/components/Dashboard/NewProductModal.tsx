import { Button, FormControl, FormGroup, TextField } from "@mui/material";
import React, { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { InventProduct } from "../../apis/apis";
import { useMetamaskAuth } from "../../auth/authConfig";
import { DEFAULT_PRODUCT_IMAGE, params, temperatureToUnits } from "../../utils/general";
import Loader from "../core/Loader";

interface NewProductModalProps {
  show: boolean;
  closeModal: () => void;
}
const NewProductModal = (props: NewProductModalProps) => {
  const { show, closeModal } = props;
  const { profile, refreshAuthStatus } = useMetamaskAuth();

  const [creatingProduct, setCreatingProduct] = useState(false);

  function newProduct(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!profile) return;
    // if (!scan) {
    //   toast.error("Temperature & humidity data not scanned !");
    //   return;
    // }
    const formValTargets = e.target as any;

    const minTemperature = formValTargets.minTemperature.value;
    const maxTemperature = formValTargets.maxTemperature.value;
    const minHumidity = formValTargets.minHumidity.value;
    const maxHumidity = formValTargets.maxHumidity.value;

    const values = {
      name: formValTargets.name.value,
      price: formValTargets.price.value,
      DEFAULT_PRODUCT_IMAGE,
      minValues: [minTemperature, minHumidity].map(val => temperatureToUnits(val)),
      maxValues: [maxTemperature, maxHumidity].map(val => temperatureToUnits(val))
    }
    console.log("Creating with values: ", values);
    
    setCreatingProduct(true);
    InventProduct(
      profile.id,
      values.name,
      values.price,
      DEFAULT_PRODUCT_IMAGE,
      params,
      values.minValues,
      values.maxValues,
    )
      .then(receipt => {
        closeModal();
        toast.success("Created product !");
        console.log("New product created", receipt);
        refreshAuthStatus();
        setCreatingProduct(false);
      })
      .catch(err => {
        toast.error(<>Please approve metamask tx</>);
        console.log("Some err creating product", err);
        setCreatingProduct(false);
        // closeModal();
      })
  }

  if (!show) return <></>;

  return (
    <>
      <form
        // className="fixed top-0 left-0 z-[1055] h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        onSubmit={newProduct}
      >
        <FormGroup className="relative w-1/3 my-6 mx-auto max-w-3xl">
          {creatingProduct ? (
            <Loader size={30} />
          ) : (
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none min-w-fit">
              {/*header*/}
              <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-3xl font-semibold">New product</h3>
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
                <FormControl fullWidth className="m-2">
                  <TextField
                    required
                    name="name"
                    type="text"
                    variant="outlined"
                    label="Product name"
                    autoComplete="nope"
                  />
                </FormControl>
                <br/>
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
                    <TextField
                      required
                      name="minTemperature"
                      type="number"
                      inputProps={{step: "0.1", lang:"en-US"}}
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
                      inputProps={{step: "0.1", lang:"en-US"}}
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
                      inputProps={{step: "0.1", lang:"en-US"}}
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
                      inputProps={{step: "0.1", lang:"en-US"}}
                      variant="outlined"
                      label="Max Humidity"
                      autoComplete="nope"
                      style={{ marginTop: 15 }}
                    />
                  </FormControl>
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
                    <Button type="submit" variant="outlined">
                      Submit
                    </Button>
                  </FormControl>
                </div>
              </div>
            </div>
          )}
        </FormGroup>
      </form>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default NewProductModal;
