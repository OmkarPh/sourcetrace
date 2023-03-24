import React from 'react';

const products = [
  {
    id: 1,
    name: 'Product 1',
    category: 'Category 1',
    price: 100,
    quantity: 10,
  },
  {
    id: 2,
    name: 'Product 2',
    category: 'Category 2',
    price: 200,
    quantity: 5,
  },
  {
    id: 3,
    name: 'Product 3',
    category: 'Category 1',
    price: 150,
    quantity: 8,
  },
  {
    id: 4,
    name: 'Product 4',
    category: 'Category 3',
    price: 50,
    quantity: 15,
  },
  {
    id: 5,
    name: 'Product 5',
    category: 'Category 2',
    price: 300,
    quantity: 3,
  },
];

const ProductList = () => {
  return (
    <div className="container mx-auto pt-4">
      {/* <h1 className="text-2xl font-bold mb-5">Product List</h1> */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full table-fixed">
          <thead className="bg-gray-200">
            <tr>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Product Name
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Category
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Price
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">{product.category}</td>
                <td className="py-3 px-4">${product.price}</td>
                <td className="py-3 px-4">{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;