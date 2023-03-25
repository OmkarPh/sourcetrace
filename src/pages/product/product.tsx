import React from 'react';


const timestampToDate = (timestamp: number) => new Date(timestamp*1000);
const dateToTimestamp = (date: Date) => Number((Number(date)/1000).toFixed())
const currDateToTimestamp = () => dateToTimestamp(new Date());

const supplyChainData = [
  {
    id: 1,
    inTime: timestampToDate(1679737903),
    outTime: timestampToDate(1679737903),
    warehouse: "0x99999999999999999",
    warehouseDetails: {
      name: "ABC",
      location: "TTC Midc Rd, T.T.C. Industrial Area, Sector 2, Pawne, Navi Mumbai, Maharashtra 400705",
      id: "0x9999999999999",
      // phone: "+917045270840",
      reg_no: "ND23CDLF45",
    },
    in_temperature: 12,
    out_temperature: 13,
    in_humidity: 55,
    out_humidity: 57,
  },
  {
    id: 2,
    inTime: timestampToDate(1679737903),
    outTime: timestampToDate(1679737903),
    warehouse: "0x99999999999999999",
    warehouseDetails: {
      name: "DEF",
      location: "TTC Midc Rd, T.T.C. Industrial Area, Sector 2, Pawne, Navi Mumbai, Maharashtra 400705",
      id: "0x9999999999999",
      // phone: "+917045270840",
      reg_no: "ND23CDLF45",
    },
    in_temperature: 12,
    out_temperature: 13,
    in_humidity: 55,
    out_humidity: 57,
  },
  {
    id: 3,
    inTime: timestampToDate(1679737903),
    outTime: timestampToDate(1679737903),
    warehouse: "0x99999999999999999",
    warehouseDetails: {
      name: "XYZ",
      location: "TTC Midc Rd, T.T.C. Industrial Area, Sector 2, Pawne, Navi Mumbai, Maharashtra 400705",
      id: "0x9999999999999",
      // phone: "+917045270840",
      reg_no: "ND23CDLF45",
    },
    in_temperature: 12,
    out_temperature: 13,
    in_humidity: 55,
    out_humidity: 57,
  },
];

const SupplyChain = () => {
  console.log(currDateToTimestamp());

  const checkpointStyle =
    'flex flex-row items-center space-x-2 mb-10';
  const lineStyle =
    'h-full w-1 bg-gray-300 my-0 mx-auto';
  const activeCircleStyle =
    'border-2 border-green-300 bg-white rounded-full h-8 w-8 flex items-center justify-center relative';

  return (
    <div className="container mx-auto my-10">
      <div className="flex flex-row flex-wrap justify-center items-start">
        <div className="w-1/2 pr-5">
          <img
            src="https://via.placeholder.com/600x400"
            alt="Product"
            className="w-full"
          />
        </div>
        <div className="w-1/2">
          {/* <h1 className="text-2xl font-bold mb-5">Supply Chain</h1> */}
          <div className="flex flex-col">
            <div className="relative flex flex-col">
              {supplyChainData.map((data, index) => (
                <React.Fragment key={data.id}>
                  <div className={checkpointStyle}>
                    <div
                      className={index === supplyChainData.length - 1 ? `${activeCircleStyle} animate-pulse` : 'border-2 border-gray-300 rounded-full h-8 w-8 flex items-center justify-center'}
                    >
                      {
                        index === supplyChainData.length - 1 ?
                          <div className="bg-green-500 rounded-full h-4 w-4"></div>
                        :
                          <div className="bg-blue-500 rounded-full h-4 w-4"></div>
                      }
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold mb-2">
                        {data.warehouseDetails.name}
                      </h2>
                      <p className="text-gray-600 text-sm mb-2">
                        {data.inTime.toLocaleDateString()} -- { data.outTime.toLocaleDateString() }
                      </p>
                      <p className="text-gray-600 text-sm mb-2">
                        Temperature: {data.in_temperature} -- { data.out_temperature}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Location: {data.warehouseDetails.location}
                      </p>
                    </div>
                  </div>
                  {index !== supplyChainData.length - 1 && (
                    <div className={lineStyle}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChain;
