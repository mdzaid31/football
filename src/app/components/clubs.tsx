import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const supabase = createClient(
  "https://binohqobswgaznnhogsn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbm9ocW9ic3dnYXpubmhvZ3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2NzcwOTMsImV4cCI6MjAyNjI1MzA5M30.AYRRtfz5U__Jyalsy7AQxXrnjKr4eNooJUxnI51A6kk"
);

interface Club {
  Club_ID: string;
  Logo: string;
  Club_Name: string;
}

const CustomPrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="slick-arrow slick-prev"
      onClick={onClick}
      style={{ left: "50px", zIndex: 1, color: "#333", fontSize: "36px" }}
    >
      {"<"}
    </div>
  );
};

const CustomNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="slick-arrow slick-next"
      onClick={onClick}
      style={{ right: "99px", zIndex: 1, color: "#333", fontSize: "36px" }}
    >
      {">"}
    </div>
  );
};

const Clubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const { data, error } = await supabase.from("clubs").select("*");

        if (error) {
          throw error;
        }

        setClubs(data);
      } catch (error) {
        console.error("Error fetching clubs:", error.message);
      }
    };

    fetchClubs();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const numSlides = Math.ceil(clubs.length / 8);

  return (
    <div className="p-3">
      <span
        className="font-bold text-2xl"
        style={{ borderBottom: "3px solid black", marginLeft: "40px" }}
      >
        Clubs
      </span>
      <div className="mx-auto" style={{ maxWidth: "1300px" }}>
        <Slider {...settings} className="p-3">
          {Array.from({ length: numSlides }, (_, slideIndex) => (
            <div key={slideIndex}>
              <div className="flex flex-col justify-center">
                <div className="flex flex-row justify-center">
                  {clubs
                    .slice(slideIndex * 8, slideIndex * 8 + 4)
                    .map((club) => (
                      <div
                        key={club.Club_ID}
                        className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105"
                        style={{
                          width: "250px",
                          height: "250px",
                          margin: "0 10px",
                        }}
                      >
                        <div className="flex flex-col items-center">
                          <img
                            src={club.Logo}
                            alt={club.Club_Name}
                            style={{ width: "150px", height: "150px" }}
                          />
                          <span className="mb-2 text-xl font-bold tracking-tight text-gray-900 p-1">
                            {club.Club_Name}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="flex flex-row justify-center mt-3">
                  {clubs
                    .slice(slideIndex * 8 + 4, slideIndex * 8 + 8)
                    .map((club) => (
                      <div
                        key={club.Club_ID}
                        className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105"
                        style={{
                          width: "250px",
                          height: "250px",
                          margin: "0 10px",
                        }}
                      >
                        <div className="flex flex-col items-center">
                          <img
                            src={club.Logo}
                            alt={club.Club_Name}
                            style={{ width: "150px", height: "150px" }}
                          />
                          <span className="mb-2 text-xl font-bold tracking-tight text-gray-900 p-1">
                            {club.Club_Name}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Clubs;
