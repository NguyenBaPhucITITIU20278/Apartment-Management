import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const ImageCarousel = ({ images = [], address = "", onDeleteImage }) => {
  console.log("Received images array:", images);
  console.log("onDeleteImage prop:", !!onDeleteImage);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const formattedAddress = address.replace(/,/g, '').replace(/\s+/g, "_");
  console.log("Formatted Address:", formattedAddress);

  return (
    <div className="carousel-container max-w-2xl mx-auto">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="relative h-96">
            <img
              src={`http://localhost:8080/images/${formattedAddress}/images/${image.split('/').pop()}`}
              alt={`Room ${index}`}
              className="w-full h-full object-cover rounded-lg"
            />
            {onDeleteImage && (
              <button
                onClick={() => {
                  console.log("Delete button clicked for image:", image);
                  onDeleteImage(image.split('/').pop());
                }}
                className="absolute top-2 right-2 bg-red-600 text-white py-2 px-4 rounded shadow transition duration-200 hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageCarousel;