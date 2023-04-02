import { ProductLotWithCheckpoints } from './../components/Dashboard/productTypes';
import Web3 from "web3";
import { ParsedTruckDetails } from '../auth/authConfig';

export const params = ["temperature", "humidity", "timeLimit"];
export const DEFAULT_PRODUCT_IMAGE = "https://res.cloudinary.com/dp0ayty6p/image/upload/v1679818316/product_a0x0jp.png";

export const hasWindow = () => typeof window !== 'undefined';

export const weiToEth = (wei: any) => Number(Web3.utils.fromWei(wei)).toPrecision(4);

export const timestampToDate = (timestamp: number | string) => new Date(Number(timestamp)*1000);
export const dateToTimestamp = (date: Date) => Number((Number(date)/1000).toFixed())
export const currDateToTimestamp = () => dateToTimestamp(new Date());

export const unitsToTemperature = (units: number | string) => Number(units)/100;
export const unitsToHumidity = (units: number | string) => Math.max(0, Number(units)/100); // Cap

export const temperatureToUnits = (temperature: number | string) => Number(Number(Number(temperature) * 100).toFixed());
export const humidityToUnits = (humidity: number | string) => Number(Number(Number(humidity) * 100).toFixed());

export const parseTruckData = (truckDetails: string[], truckAddresses: string[]): ParsedTruckDetails[] => {
  return truckDetails.map((_, idx) => ({
    address: truckAddresses[idx],
    license: truckDetails[idx],
  }))
}
export const productIdentifierToDetails = (text: string) => {
  const split = text.split('_');
  return {
    producer: split[0],
    id: Number(split[1]),
  }
}

export const isCheckinPossible = (productLot: ProductLotWithCheckpoints) => {
  const lastCheckpoint = productLot.checkpoints[productLot.checkpoints.length - 1];
  return Number(lastCheckpoint.outTime) != 0;
}
export const canCheckinLot = (warehouseAddress: string, productLot: ProductLotWithCheckpoints) => {
  if(!isCheckinPossible(productLot))
    return false;
  return productLot.producerAddress != warehouseAddress; 
}

export const isCheckOutPossible = (productLot: ProductLotWithCheckpoints) => {
  const lastCheckpoint = productLot.checkpoints[productLot.checkpoints.length - 1];
  return Number(lastCheckpoint.outTime) == 0;
}
export const canCheckoutLot = (warehouseAddress: string, productLot: ProductLotWithCheckpoints) => {
  if(!isCheckOutPossible(productLot))
    return false;
  const lastCheckpoint = productLot.checkpoints[productLot.checkpoints.length - 1];
  return lastCheckpoint.warehouse.id == warehouseAddress; 
}