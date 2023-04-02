import React, { useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import tw from 'tailwind-styled-components';
import { producerAccounts } from '../apis/setup/details';

const Container = tw.div`
  flex
  flex-col
  items-center
  md:flex-row
  md:justify-center
  md:items-start
`;

const Select = tw.select`
  mb-4
  md:mr-4
`;

const Input = tw.input`
  mb-4
  md:mb-0
`;

const QRCodeText = tw.div`
  mt-2
`;

const Util = () => {
  const [selectedProducer, setSelectedProducer] = useState('');
  const [productLot, setProductLot] = useState('');

  const handleSelectProducer = (event: any) => {
    setSelectedProducer(event.target.value);
  };

  const handleProductLot = (event: any) => {
    setProductLot(event.target.value);
  };

  const qrCodeValue = `${selectedProducer}_${productLot}`;

  return (
    <>
    <br/>
    <br/>
    <Container>
      Producer:
      <br/>
      <Select onChange={handleSelectProducer} className="max-w-full">
        <option value="">Select producer</option>
        {Object.values(producerAccounts).map((producer) => (
          <option key={producer.address} value={producer.address}>
            {producer.name } ( {producer.address} )
          </option>
        ))}
      </Select>
      <Input type="text" placeholder="Enter product lot" onChange={handleProductLot} />
    </Container>

    <br/>
    <center>
      {qrCodeValue && (
        <>
          <QRCode value={qrCodeValue} size={256} fgColor="#000" logoWidth={64} />
          <QRCodeText>{qrCodeValue}</QRCodeText>
        </>
      )}
    </center>
    </>
  );
};

export default Util;