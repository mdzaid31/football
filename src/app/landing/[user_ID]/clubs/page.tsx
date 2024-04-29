"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";

import Message from "../../../components/message"; 
import LandingNavbar from "../../../components/landingnavbar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VerticalNavbar from "../../../components/verticalnavbar";
import Chatbot from "../../../components/chatbot";

import { supabase } from "../../../../lib/supabase";



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
      style={{ left: "0ex", zIndex: 1, color: "#333", fontSize: "36px" }}
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
      style={{ right: "40px", zIndex: 1, color: "#333", fontSize: "36px" }}
    >
      {">"}
    </div>
  );
};

const Clubs = ({ user_ID }) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>(""); // State for selected country
  const [uniqueCountries, setUniqueCountries] = useState<string[]>([]); // State for unique countries
  const router = useRouter();
  useEffect(() => {
    const fetchClubsAndCountries = async () => {
      try {
        const { data: clubsData, error: clubsError } = await supabase
          .from("clubs")
          .select("*");
        if (clubsError) {
          throw clubsError;
        }

        const uniqueCountryIDs = [
          ...new Set(clubsData.map((club) => club.Country_ID)),
        ];
        const { data: countriesData, error: countriesError } = await supabase
          .from("countries")
          .select("Country_ID, Country_Name")
          .in("Country_ID", uniqueCountryIDs);

        if (countriesError) {
          throw countriesError;
        }

        const clubsWithCountries = clubsData.map((club) => ({
          ...club,
          Country_Name:
            countriesData.find(
              (country) => country.Country_ID === club.Country_ID
            )?.Country_Name || "Unknown",
        }));

        setClubs(clubsWithCountries);
        setFilteredClubs(clubsWithCountries); // Set initial filteredClubs state with all clubs

        // Extract unique countries
        const uniqueCountries = Array.from(
          new Set(clubsData.map((club) => club.Country_ID))
        )
          .map((id) => ({
            id,
            name:
              countriesData.find((country) => country.Country_ID === id)
                ?.Country_Name || "Unknown",
          }))
          .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by country name
          .map((country) => country.id);

        setUniqueCountries(uniqueCountries);
      } catch (error) {
        console.error("Error fetching clubs and countries:", error.message);
      }
    };

    fetchClubsAndCountries();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterClubs(query, selectedCountry); // Filter clubs based on search query and selected country
  };

  const filterClubs = (query: string, country: string) => {
    let filtered = clubs;

    if (query) {
      filtered = filtered.filter((club) =>
        club.Club_Name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (country) {
      filtered = filtered.filter((club) => club.Country_ID === country);
    }

    setFilteredClubs(filtered);
  };

  const handleSelectCountry = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = event.target.value;
    setSelectedCountry(selectedCountry);
    filterClubs(searchQuery, selectedCountry); // Filter clubs based on selected country
  };
  const handleCardClick = (user_ID: string, clubID: string) => {
    router.push(`/landing/${user_ID}/clubs/${clubID}`);
  };

  const numSlides = Math.ceil(filteredClubs.length / 8);
  const sliderHeight = Math.min(500, 240 * numSlides); // Minimum height of 500px

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

  return (
    <>
      <div className="flex justify-left items-center mb-4">
        <img src="" width={80} />
        <input
          type="text"
          placeholder="Search club..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <img src="" width={30} />
        <select
          value={selectedCountry}
          onChange={handleSelectCountry}
          className="px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          style={{ height: "42px", width: "220px" }}
        >
          <option value="">All Countries</option>
          {/* Render unique country options */}
          {uniqueCountries.map((countryId) => {
            const country = clubs.find((club) => club.Country_ID === countryId);
            return (
              <option key={countryId} value={countryId}>
                {country ? country.Country_Name : "Unknown"}
              </option>
            );
          })}
        </select>
      </div>
      <center>
        <div
          className="p-1 border-2 border-gray-600"
          style={{
            width: "1000px",
            borderCollapse: "collapse",
            borderRadius: "20px",
            height: `${sliderHeight}px`, // Dynamic height based on number of slides
            overflow: "hidden",
          }}
        >
          <div className="mx-auto" style={{ maxWidth: "1000px" }}>
            <Slider {...settings} className="p-3">
              {Array.from({ length: numSlides }, (_, slideIndex) => (
                <div key={slideIndex}>
                  <div className="flex flex-col justify-center">
                    <div className="flex flex-row justify-center">
                      {filteredClubs
                        .slice(slideIndex * 8, slideIndex * 8 + 4)
                        .map((club) => (
                          <div
                            key={club.Club_ID}
                            className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105"
                            style={{
                              width: "210px",
                              height: "210px",
                              margin: "0 10px",
                            }}
                            onClick={() =>
                              handleCardClick(user_ID, club.Club_ID)
                            }
                          >
                            <div className="flex flex-col items-center">
                              <img
                                src={club.Logo}
                                alt={club.Club_Name}
                                style={{ width: "120px", height: "120px" }}
                              />
                              <span className="mb-2 text-xl font-bold tracking-tight text-gray-900 p-1">
                                {club.Club_Name}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="flex flex-row justify-center mt-3">
                      {filteredClubs
                        .slice(slideIndex * 8 + 4, slideIndex * 8 + 8)
                        .map((club) => (
                          <div
                            key={club.Club_ID}
                            className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105"
                            style={{
                              width: "210px",
                              height: "210px",
                              margin: "0 10px",
                            }}
                            onClick={() =>
                              handleCardClick(user_ID, club.Club_ID)
                            }
                          >
                            <div className="flex flex-col items-center">
                              <img
                                src={club.Logo}
                                alt={club.Club_Name}
                                style={{ width: "120px", height: "120px" }}
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
      </center>
    </>
  );
};

const Dashboard = ({ params }) => {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState("");
  const [userName, setUserName] = useState(""); // State to store user's name
  const horizontalNavbarRef = useRef<HTMLDivElement>(null);
  const [signOutMessage, setSignOutMessage] = useState("");

  useEffect(() => {
    fetchUserData(params.user_ID); // Fetch user data when user_ID changes
  }, [params.user_ID]);

  useEffect(() => {
    const horizontalNavbarHeight =
      horizontalNavbarRef.current?.clientHeight || 0;
    document.documentElement.style.setProperty(
      "--horizontal-navbar-height",
      `${horizontalNavbarHeight}px`
    );
  }, []);

  const fetchUserData = async (userID) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("user_ID", userID)
        .single();

      if (userError) {
        throw userError;
      }

      if (userData && userData.Pfp) {
        setProfilePicture(userData.Pfp);
      }

      // Set user's name if available
      if (userData && userData.Full_Name) {
        setUserName(userData.Full_Name);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setSignOutMessage("Successfully signed out"); // Update state to display the message
      setTimeout(() => {
        setSignOutMessage(""); // Clear the message after 3 seconds
        router.push("/"); // Redirect to the login page after signing out
      }, 3000);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };


  return (
    <div>
       <Chatbot />
      {signOutMessage && (
        <Message
          message={signOutMessage}
          onClose={() => setSignOutMessage("")}
        />
      )}
      <LandingNavbar
        profilePicture={profilePicture}
        ref={horizontalNavbarRef}
        handleSignOut={handleSignOut}
        user_ID={params.user_ID}
      />
      <div style={{ marginTop: "var(--horizontal-navbar-height, 0)" }}>
        <VerticalNavbar user_ID={params.user_ID} />
        <div style={{ marginLeft: 210, marginTop: 70 }}>
          <Clubs user_ID={params.user_ID} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
