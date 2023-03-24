import React from 'react';

const supplyChainData = [
  {
    id: 1,
    date: '2022-01-01',
    time: '10:00',
    warehouseName: 'Warehouse A',
    temperature: '12°C',
    location: 'Location A',
  },
  {
    id: 2,
    date: '2022-01-05',
    time: '14:30',
    warehouseName: 'Warehouse B',
    temperature: '8°C',
    location: 'Location B',
  },
  {
    id: 3,
    date: '2022-01-08',
    time: '09:45',
    warehouseName: 'Warehouse C',
    temperature: '6°C',
    location: 'Location C',
  },
];

const SupplyChain = () => {
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
                        {data.warehouseName}
                      </h2>
                      <p className="text-gray-600 text-sm mb-2">
                        {data.date} at {data.time}
                      </p>
                      <p className="text-gray-600 text-sm mb-2">
                        Temperature: {data.temperature}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Location: {data.location}
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
