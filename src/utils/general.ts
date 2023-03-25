import Web3 from "web3";

export const hasWindow = () => typeof window !== 'undefined';

export const weiToEth = (wei: any) => Number(Web3.utils.fromWei(wei)).toPrecision(4);

export const timestampToDate = (timestamp: number) => new Date(timestamp*1000);
export const dateToTimestamp = (date: Date) => Number((Number(date)/1000).toFixed())
export const currDateToTimestamp = () => dateToTimestamp(new Date());