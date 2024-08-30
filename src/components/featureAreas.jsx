import React from "react";
import HCM from "../assets/HCM.jpg";
import HaNoi from "../assets/HaNoi.jpg";
import DaNang from "../assets/DaNang.jpg";

const featuredAreas = [
  {
    name: "Hồ Chí Minh",
    imageUrl: HCM,
    address: "HCM",
  },
  {
    name: "Hà Nội",
    imageUrl: HaNoi,
    address: "Ha Noi",
  },
  {
    name: "Đà Nẵng",
    imageUrl: DaNang,
    address: "Da Nang",
  },
];

const FeaturedAreas = ({onAreaClick}) => {
  return (
    <div className="featured-areas">
      <h2 className="text-2xl font-bold mb-4">Featured Areas</h2>
      <div className="flex space-x-4">
        {featuredAreas.map((area, index) => (
          <div key={index} className="featured-area-card w-1/3 cursor-pointer" onClick={() => onAreaClick(area.address)}>
            <img src={area.imageUrl} alt={area.name} className="w-full h-48 object-cover rounded-md" />
            <p className="text-center text-blue-600 mt-2">{area.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedAreas;