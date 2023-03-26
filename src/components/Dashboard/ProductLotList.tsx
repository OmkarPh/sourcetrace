import React, { useEffect, useState } from 'react';
import { GetAllProductLots, GetAllProductsInfo } from '../../apis/apis';
import { useMetamaskAuth } from '../../auth/authConfig';
import { timestampToDate } from '../../utils/general';
import Loader from '../core/Loader';
import { ProductInfo } from './ProductList';

interface ProducLot {
  productId: number;
  productLotId: number;
  producerAddress: string;
  quantity: number;
  createdAt: number;
  sourceFactoryName: string;
  sourceFactoryLocation: string;
  productInfo: ProductInfo;
}

const ProductLotList = () => {
  const { profile, isProcessingLogin } = useMetamaskAuth();
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);
  const [productLots, setProductLots] = useState<ProducLot[]>([]);

  useEffect(() => {
    if(!profile)
      return;
    console.log("My address", profile.id);

    const promises = [GetAllProductLots(profile.id), GetAllProductsInfo(profile.id)];
    Promise.all(promises)
    .then((result: any[]) => {
        console.log("Received", result);
        const ProductInfoMap = new Map<number, ProductInfo>(result[1].map((product: ProductInfo) => [product.productId, product]))
        const newProductLots: ProducLot[] = result[0].map((lot: ProducLot) => ({
          ...lot,
          productInfo: ProductInfoMap.get(lot.productId) as ProductInfo
        }));
        setProductLots(newProductLots);
        console.log("All product lots", newProductLots);
        setIsFetchingProducts(false);
      })
      .catch(err => {
        console.log("Err", err);
        setIsFetchingProducts(false);
      })

    
    // GetAllProductLots(profile.id)
    //   .then(products => {
    //     setProductLots(products as any);
    //   })
    //   .catch(err => {
    //   })
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
                Product
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Quantity
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Production Date
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
                  {productLot.productInfo.name}
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