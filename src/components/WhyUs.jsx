import React from 'react';
import { useNavigate } from 'react-router-dom';

const WhyUs = () => {
const navigate = useNavigate();
const handlePostAd = () => {
  navigate('/addRoom');
};
const handleMoveToRentRoom = () => {
  navigate('/');
};
const handleMoveToNews = () => {
  navigate('/news');
};

  return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold mb-6">Why choose us?</h2>
      <p className="text-lg mb-6">  
        We know you have many choices, but Apartment.com is proud to be the top Google website for keywords: 
        <a onClick={handleMoveToRentRoom} className="text-blue-500 cursor-pointer">rent room</a>, <a onClick={handleMoveToNews} className="text-blue-500 cursor-pointer">News</a>
        Therefore, your ad on our website will reach more customers, resulting in faster transactions and lower costs.
      </p>
      <div className="flex justify-around mb-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold">116.998+</h3>
          <p className="text-lg">Members</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold">103.348+</h3>
          <p className="text-lg">Ads</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold">300.000+</h3>
          <p className="text-lg">Monthly visits</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold">2.500.000+</h3>
          <p className="text-lg">Monthly views</p>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Low cost, maximum efficiency</h3>
        <div className="text-yellow-500 text-2xl mb-2">★★★★★</div>
        <blockquote className="italic mb-2">
          "Before knowing website phongtro123, I had to spend a lot of effort and money for advertising: from distributing flyers, 
          pasting posters, and posting on other websites, but the results were not high. Since knowing website phongtro123.com, 
          I have tried to post ads and evaluate the efficiency quite high while the cost is quite low, no longer having the problem 
          of empty rooms being long."
        </blockquote>
        <p>- Mr Phuc (owner of a rental apartment in Tp.HCM)</p>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-2">Do you have a rental room / apartment for rent?</h3>
        <p className="text-lg mb-4">Don't worry about finding tenants, long empty rooms</p>
        <button onClick={handlePostAd} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Post an ad now</button>
      </div>
    </div>
  );
};

export default WhyUs;
