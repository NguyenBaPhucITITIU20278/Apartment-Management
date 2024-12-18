import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const ImageCarousel = ({ images = [], address = "" }) => {
  console.log("Received images array:", images);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const formattedAddress = address ? address.replace(/\s+/g, "_") : "default_address";
  console.log("Formatted Address:", formattedAddress);

  return (
    <div className="carousel-container" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} style={{ height: '400px' }}>
            <img
              src={`http://localhost:8080/images/${formattedAddress}/${image}`}
              alt={`Room ${index}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageCarousel;