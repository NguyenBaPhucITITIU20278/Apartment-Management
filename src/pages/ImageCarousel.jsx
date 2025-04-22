import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { formatAddress } from '../utils/addressFormatter';

const ImageCarousel = ({ images = [], address = "", videoPath = null, onDeleteImage, onDeleteVideo }) => {
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState({});

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.querySelector('.carousel-container');
      if (container) {
        setContainerDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true
        }
      }
    ]
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

  const handleImageLoad = (index, event) => {
    const img = event.target;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    
    setImageLoaded(prev => ({
      ...prev,
      [index]: { loaded: true, aspectRatio }
    }));
  };

  return (
    <div className="carousel-container max-w-4xl mx-auto relative overflow-hidden bg-white">
      <div className="aspect-w-16 aspect-h-9">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="relative">
              <div className="w-full pb-[56.25%] relative"> {/* 16:9 aspect ratio container */}
                {slide.type === 'video' ? (
                  <video
                    src={`http://localhost:8080/images/${formattedAddress}/video/${slide.path}`}
                    controls
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-white">
                    <img
                      src={`http://localhost:8080/images/${formattedAddress}/images/${slide.path.split('/').pop()}`}
                      alt={`Room ${index}`}
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                      onLoad={(e) => handleImageLoad(index, e)}
                      style={{
                        opacity: imageLoaded[index]?.loaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    />
                  </div>
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
                    className="absolute top-2 right-2 bg-red-600 text-white py-2 px-4 rounded shadow transition duration-200 hover:bg-red-700 z-10"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ImageCarousel;