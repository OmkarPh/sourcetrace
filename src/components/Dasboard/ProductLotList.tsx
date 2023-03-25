import React, { useEffect, useState } from 'react';
import { GetAllProductLots, GetAllProductsInfo } from '../../apis/apis';
import { useMetamaskAuth } from '../../auth/authConfig';
import { timestampToDate } from '../../utils/general';
import Loader from '../core/Loader';

interface ProducLot {
  productId: number;
  productLotId: number;
  producerAddress: string;
  quantity: number;
  createdAt: number;
  sourceFactoryName: string;
  sourceFactoryLocation: string;
}

const ProductLotList = () => {
  const { profile, isProcessingLogin } = useMetamaskAuth();
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);
  const [productLots, setProductLots] = useState<ProducLot[]>([]);

  useEffect(() => {
    if(!profile)
      return;
    console.log("My address", profile.id);
    
    GetAllProductLots(profile.id)
      .then(products => {
        console.log("All product lots", products);
        setProductLots(products as any);
        setIsFetchingProducts(false);
      })
      .catch(err => {
        console.log("Err", err);
        setIsFetchingProducts(false);
      })
  }, [profile])
  

  if(isProcessingLogin || isFetchingProducts)
    return <Loader size={50} />

  
  return (
    <div className="container mx-auto pt-4">
      {/* <h1 className="text-2xl font-bold mb-5">Product List</h1> */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full table-fixed">
          <thead className="bg-gray-200">
            <tr>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Product ID
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Quantity
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Date
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Factory location
              </th>
            </tr>
          </thead>
          <tbody>
            {productLots.map((productLot) => (
              <tr key={productLot.producerAddress+productLot.productLotId} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">
                  # {productLot.productId}
                </td>
                <td className="py-3 px-4">{productLot.quantity}</td>
                <td className="py-3 px-4">{timestampToDate(productLot.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4">{productLot.sourceFactoryLocation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductLotList;