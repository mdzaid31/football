import React, { useState, useEffect } from "react";

const Slideshow: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === 4 ? 0 : prevIndex + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const goToPreviousSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 4 : prevIndex - 1));
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 4 ? 0 : prevIndex + 1));
  };

  return (
    <div
      className="relative w-full align-center"
      data-carousel="slide"
      style={{ backgroundColor: "#D1D5DB" }}
    >
      <center>
        <div
          id="default-carousel"
          className="relative w-full align-center"
          data-carousel="slide"
          style={{ width: "600px" }}
        >
          <div
            className="relative h-10 sm:h-96 overflow-hidden rounded-lg flex justify-center items-center"
            style={{ height: "500px" }}
          >
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className={`duration-700 ease-in-out ${
                  currentIndex === index - 1 ? "" : "hidden"
                }`}
                data-carousel-item
              >
                <img
                  src={`/${index}.png`}
                  alt={`Slide ${index}`}
                  className="block w-full h-full object-cover"
                />
              </div>
            ))}
            <button
              type="button"
              className="absolute top-1/2 left-0 transform -translate-y-1/2 w-12 h-12 bg-gray-800/50 text-white transition duration-300 ease-in-out hover:bg-gray-800 hover:bg-opacity-70 focus:outline-none"
              onClick={goToPreviousSlide}
            >
              {"<"}
            </button>
            <button
              type="button"
              className="absolute top-1/2 right-0 transform -translate-y-1/2 w-12 h-12 bg-gray-800/50 text-white transition duration-300 ease-in-out hover:bg-gray-800 hover:bg-opacity-70 focus:outline-none"
              onClick={goToNextSlide}
            >
              {">"}
            </button>
          </div>
          {/* Slider indicators */}
          <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
            {[1, 2, 3, 4, 5].map((index) => (
              <button
                key={index}
                type="button"
                className={`w-3 h-3 rounded-full ${
                  currentIndex === index - 1 ? "bg-blue-500" : "bg-gray-300"
                }`}
                aria-current={currentIndex === index - 1 ? "true" : "false"}
                aria-label={`Slide ${index}`}
                data-carousel-slide-to={index - 1}
              ></button>
            ))}
          </div>
        </div>
      </center>
    </div>
  );
};

export default Slideshow;
