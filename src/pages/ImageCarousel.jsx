import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { formatAddress } from '../utils/addressFormatter';

const ImageCarousel = ({ images = [], address = "", videoPath = null, onDeleteImage, onDeleteVideo }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const formattedAddress = formatAddress(address);

  // Combine images and video into slides
  const slides = [
    // Add video slide if videoPath exists
    ...(videoPath ? [{
      type: 'video',
      path: videoPath
    }] : []),
    // Add image slides
    ...images.map(image => ({
      type: 'image',
      path: image
    }))
  ];

  return (
    <div className="carousel-container max-w-2xl mx-auto">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative h-96">
            {slide.type === 'video' ? (
              <video
                src={`http://localhost:8080/images/${formattedAddress}/video/${slide.path}`}
                controls
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <img
                src={`http://localhost:8080/images/${formattedAddress}/images/${slide.path.split('/').pop()}`}
                alt={`Room ${index}`}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
            {/* Delete button for both images and video */}
            {((slide.type === 'image' && onDeleteImage) || (slide.type === 'video' && onDeleteVideo)) && (
              <button
                onClick={() => {
                  if (slide.type === 'image') {
                    onDeleteImage(slide.path.split('/').pop());
                  } else {
                    onDeleteVideo();
                  }
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