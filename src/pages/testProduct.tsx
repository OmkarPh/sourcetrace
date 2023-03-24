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
    'flex flex-col md:flex-row justify-center items-center mb-10';
  const lineStyle = 'bg-gray-300 h-1 w-full my-5';
  const circleStyle =
    'border-2 border-gray-300 rounded-full h-8 w-8 flex items-center justify-center';
  const activeCircleStyle =
    'border-2 border-green-500 rounded-full h-8 w-8 flex items-center justify-center';

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
          <h1 className="text-2xl font-bold mb-5">Supply Chain</h1>
          <div className="flex flex-col">
            {supplyChainData.map((data, index) => (
              <div key={data.id} className={checkpointStyle}>
                <div className={index === 0 ? circleStyle : activeCircleStyle}>
                  {index === supplyChainData.length - 1 && (
                    <div className="bg-green-500 rounded-full h-4 w-4 animate-ping"></div>
                  )}
                </div>
                {index !== supplyChainData.length - 1 && (
                  <div className={lineStyle}></div>
                )}
                <div className="md:ml-4 mt-4 md:mt-0">
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
            ))}
          </div>
        </div>
      </div>
      <br />
      
    </div>
  );
};

export default SupplyChain;
