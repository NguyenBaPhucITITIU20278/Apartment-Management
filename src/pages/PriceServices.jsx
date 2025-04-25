import React from "react";

const PriceServices = () => {
  return (
    <div className="container mx-auto p-4 lg:p-8 bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Price of Services</h1>
        <p className="text-gray-600 mt-2">Applicable from 31/05/2024</p>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-4 px-6 bg-gray-100 text-left text-gray-700 border-b"></th>
              <th className="py-4 px-6 bg-blue-900 text-center text-white border-b">
                <div className="font-bold text-lg">Standard</div>
              </th>
              <th className="py-4 px-6 bg-orange-500 text-center text-white border-b">
                <div className="font-bold text-lg">VIP 1</div>
                <div className="flex justify-center mt-1">
                  {[1, 2, 3].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-300 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </th>
              <th className="py-4 px-6 bg-red-600 text-center text-white border-b">
                <div className="font-bold text-lg">VIP 2</div>
                <div className="flex justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-300 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-4 px-6 border-b font-medium">
                <div>Daily price</div>
                <div className="text-xs text-gray-500">(Min. 3 days)</div>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <div className="font-bold">10,000₫</div>
                <div className="text-xs text-gray-500">(Min. 5 days)</div>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <div className="font-bold">30,000₫</div>
                <div className="text-xs text-gray-500">(Min. 3 days)</div>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <div className="font-bold">50,000₫</div>
                <div className="text-xs text-gray-500">(Min. 3 days)</div>
              </td>
            </tr>
            <tr>
              <td className="py-4 px-6 border-b font-medium">
                <div>Weekly price</div>
                <div className="text-xs text-gray-500">(7 days)</div>
              </td>
              <td className="py-4 px-6 text-center border-b font-bold">63,000₫</td>
              <td className="py-4 px-6 text-center border-b font-bold">190,000₫</td>
              <td className="py-4 px-6 text-center border-b font-bold">315,000₫</td>
            </tr>
            <tr>
              <td className="py-4 px-6 border-b font-medium">
                <div>Monthly price</div>
                <div className="text-xs text-gray-500">(30 days)</div>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <div className="text-sm text-gray-500 line-through">300,000₫</div>
                <div className="text-xs text-green-600">Discount 20%</div>
                <div className="font-bold">240,000₫</div>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <div className="text-sm text-gray-500 line-through">900,000₫</div>
                <div className="text-xs text-green-600">Discount 11%</div>
                <div className="font-bold">800,000₫</div>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <div className="text-sm text-gray-500 line-through">1,500,000₫</div>
                <div className="text-xs text-green-600">Discount 20%</div>
                <div className="font-bold">1,200,000₫</div>
              </td>
            </tr>
            <tr>
              <td className="py-4 px-6 border-b font-medium">Images</td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </td>
            </tr>
            <tr>
              <td className="py-4 px-6 border-b font-medium">Video</td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </td>
            </tr>
            <tr>
              <td className="py-4 px-6 border-b font-medium">3D Model</td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </td>
            </tr>
            <tr>
              <td className="py-4 px-6 border-b font-medium">360° View</td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </td>
            </tr>
            <tr>
              <td className="py-4 px-6 border-b font-medium">Post size</td>
              <td className="py-4 px-6 text-center border-b">Small</td>
              <td className="py-4 px-6 text-center border-b">Medium</td>
              <td className="py-4 px-6 text-center border-b">Large</td>
            </tr>
            <tr>
              <td className="py-4 px-6 border-b font-medium">Auto approve</td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </td>
            </tr>
            <tr>
              <td className="py-4 px-6 border-b font-medium">Featured listing</td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </td>
              <td className="py-4 px-6 text-center border-b">
                <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Service Details</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span><strong>Standard:</strong> Basic listing with images and video.</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span><strong>VIP 1:</strong> Enhanced visibility with images, video, and 3D model support.</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span><strong>VIP 2:</strong> Premium visibility with images, video, 3D model, and 360° view.</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Monthly packages offer the best value with discounts up to 20% compared to daily rates.</span>
          </li>
        </ul>
      </div>

      <div className="flex justify-center mt-8">
        <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:from-red-600 hover:to-orange-600 transition ease-in-out duration-150 shadow-lg">
          Subscribe Now
        </button>
      </div>
    </div>
  );
};

export default PriceServices; 