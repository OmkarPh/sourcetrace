import {
  Button,
  FormControl,
  FormGroup,
  Input,
  InputLabel,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { FormEvent, MouseEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CreateProductLot, GetAllProductsInfo } from "../../../apis/apis";
import { useMetamaskAuth } from "../../../auth/authConfig";
import { DRIVER_SERVER } from "../../../constants/endpoints";
import {
  humidityToUnits,
  temperatureToUnits,
  unitsToHumidity,
  unitsToTemperature,
} from "../../../utils/general";
import Loader from "../../core/Loader";
import { ProductInfo, Scan } from "../productTypes";
import ProductInfoModal from "./ProductInfoModal";
import ValidityLabel from "../../core/ValidityLabel";

const ProductList = () => {
  const { profile, isProcessingLogin } = useMetamaskAuth();
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [refreshIndicator, setRefresh] = useState(Math.random());
  const refresh = () => setRefresh(Math.random());
  const [productForNewLot, setProductForNewLot] = useState<ProductInfo | null>(
    null
  );
  const [creatingLot, setCreatingLot] = useState(false);
  const [scan, setScan] = useState<Scan | null>(null);
  const [previewProductInfo, setPreviewProductInfo] =
    useState<ProductInfo | null>(null);

  function closeNewLotModal() {
    setProductForNewLot(null);
    setScan(null);
  }
  function openNewLotModal(event: MouseEvent, product: ProductInfo) {
    event.stopPropagation();
    event.preventDefault();
    setProductForNewLot(product);
  }

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

  useEffect(() => {
    if (!profile) return;
    console.log("My address", profile.id);

    GetAllProductsInfo(profile.id)
      .then((products) => {
        console.log("All products", products);
        setProducts(products as any);
        setIsFetchingProducts(false);
      })
      .catch((err) => {
        console.log("Err", err);
        setIsFetchingProducts(false);
      });
  }, [profile, refreshIndicator]);

  function newProductLot(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!profile || !productForNewLot) return;
    if (!scan) {
      toast.error("Temperature & humidity data not scanned !");
      return;
    }

    console.log("Create new lot with params: ", e);
    const formValTargets = e.target as any;
    const quantity = formValTargets.quantity.value;
    const product = productForNewLot;

    console.log("New lot params", {
      quantity,
      tmp: temperatureToUnits(scan.temperature),
      hm: humidityToUnits(scan.humidity),
    });

    setCreatingLot(true);
    CreateProductLot(
      profile.id,
      quantity,
      product.productId,
      profile.name,
      profile.location,
      temperatureToUnits(scan.temperature),
      humidityToUnits(scan.humidity)
    )
      .then((receipt) => {
        toast.success(`Created new lot of ${product.name} !`);
        setProductForNewLot(null);
        refresh();
        setCreatingLot(false);
      })
      .catch((err) => {
        toast.error(<>Please approve metamask tx</>);
        console.log(`Err creating new ${product.name} lot`, err);
        setCreatingLot(false);
      });
  }

  const isTemperatureValid =
    productForNewLot && scan
      ? unitsToTemperature(productForNewLot.minValues[0]) <= scan.temperature &&
        unitsToTemperature(productForNewLot.maxValues[0]) >= scan.temperature
      : false;
  const isHumidityValid =
    productForNewLot && scan
      ? unitsToHumidity(productForNewLot.minValues[1]) <= scan.humidity &&
        unitsToHumidity(productForNewLot.maxValues[1]) >= scan.humidity
      : false;

  if (isProcessingLogin || isFetchingProducts) return <Loader size={50} />;

  return (
    <div className="container mx-auto">
      {/* <h1 className="text-2xl font-bold mb-5">Product List</h1> */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full table-fixed">
          <thead className="bg-gray-200">
            <tr>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Product Name
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">Price</th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Temperature
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Humidity
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.producer + product.productId}
                className="border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => setPreviewProductInfo(product)}
              >
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">
                  {product.price.trim().length ? product.price : "-"}
                </td>
                <td className="py-3 px-4">
                  {unitsToTemperature(product.minValues[0])} °C &nbsp; to &nbsp;{" "}
                  {unitsToTemperature(product.maxValues[0])} °C
                </td>
                <td className="py-3 px-4">
                  {unitsToHumidity(product.minValues[1])} % &nbsp; to &nbsp;{" "}
                  {unitsToHumidity(product.maxValues[1])} %
                </td>
                <td className="py-3 px-4">
                  <Button
                    variant="outlined"
                    onClick={(e) => openNewLotModal(e, product)}
                  >
                    Create lot
                  </Button>
                  <br />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productForNewLot && (
        <>
          <form
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            onSubmit={newProductLot}
          >
            <FormGroup className="relative w-1/3 my-6 mx-auto max-w-3xl">
              {/*content*/}
              {creatingLot ? (
                <Loader size={30} />
              ) : (
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none w-[400px]">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      New {productForNewLot.name} lot
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={closeNewLotModal}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <FormControl fullWidth>
                      {/* <InputLabel>Quantity</InputLabel> */}
                      <TextField
                        required
                        name="quantity"
                        type="number"
                        variant="outlined"
                        label="Quantity"
                        autoComplete="nope"
                      />
                    </FormControl>
                    <br />
                    <br />
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
                      onClick={closeNewLotModal}
                    >
                      Close
                    </button>
                    <FormControl>
                      <Button
                        type="submit"
                        variant="outlined"
                        disabled={!isTemperatureValid || !isHumidityValid}
                      >
                        Submit
                      </Button>
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
          </form>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}

      {previewProductInfo && (
        <ProductInfoModal
          productInfo={previewProductInfo}
          closeModal={() => setPreviewProductInfo(null)}
        />
      )}
    </div>
  );
};

export default ProductList;
