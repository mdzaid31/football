"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Message from "C:/Users/HomePC/Desktop/football/src/app/components/message";
import LandingNavbar from "C:/Users/HomePC/Desktop/football/src/app/components/landingnavbar";
import VerticalNavbar from "C:/Users/HomePC/Desktop/football/src/app/components/verticalnavbar";
import Chatbot from "C:/Users/HomePC/Desktop/football/src/app/components/chatbot";
const supabase = createClient(
  "https://binohqobswgaznnhogsn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbm9ocW9ic3dnYXpubmhvZ3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2NzcwOTMsImV4cCI6MjAyNjI1MzA5M30.AYRRtfz5U__Jyalsy7AQxXrnjKr4eNooJUxnI51A6kk"
);
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Player {
  Name: string;
  headshot: string;
  Country_ID: string;
  type: string;
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
interface Player {
  ID: string;
  headshot: string;
  Name: string;
  Type: string;
  Country_ID: string;
  Country_Name: string;
}

interface PlayersProps {
  user_ID: string;
  Club_ID: string;
}

const Players: React.FC<PlayersProps> = ({ user_ID, Club_ID }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [uniqueCountries, setUniqueCountries] = useState<string[]>([]);
  const [showNoPlayersMessage, setShowNoPlayersMessage] =
    useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPlayersAndCountries = async () => {
      try {
        const { data: playersData, error: playersError } = await supabase
          .from("players")
          .select("headshot, Name, Type, Country_ID, ID")
          .eq("Club_ID", Club_ID);
        if (playersError) throw playersError;

        const uniqueCountryIDs = [
          ...new Set(playersData.map((player) => player.Country_ID)),
        ];
        const { data: countriesData, error: countriesError } = await supabase
          .from("countries")
          .select("Country_ID, Country_Name")
          .in("Country_ID", uniqueCountryIDs);
        if (countriesError) throw countriesError;

        const playersWithCountries = playersData.map((player) => ({
          ...player,
          Country_Name:
            countriesData.find(
              (country) => country.Country_ID === player.Country_ID
            )?.Country_Name || "Unknown",
        }));

        setPlayers(playersWithCountries);
        setFilteredPlayers(playersWithCountries);

        const uniqueCountries = Array.from(
          new Set(playersData.map((player) => player.Country_ID))
        )
          .map((id) => ({
            id,
            name:
              countriesData.find((country) => country.Country_ID === id)
                ?.Country_Name || "Unknown",
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((country) => country.id);

        setUniqueCountries(uniqueCountries);
      } catch (error) {
        console.error("Error fetching players and countries:", error.message);
      }
    };

    fetchPlayersAndCountries();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPlayers(query, selectedCountry, selectedType);
  };

  const filterPlayers = (query, country, type: string) => {
    let filtered = players;

    if (query) {
      filtered = filtered.filter((player) =>
        player.Name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (country) {
      filtered = filtered.filter((player) => player.Country_ID === country);
    }

    if (type) {
      filtered = filtered.filter((player) => player.Type === type);
    }

    setFilteredPlayers(filtered);
    setShowNoPlayersMessage(filtered.length === 0);
  };

  const handleSelectCountry = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = event.target.value;
    setSelectedCountry(selectedCountry);
    setSelectedType(selectedType);
    filterPlayers(searchQuery, selectedCountry, selectedType);
  };

  const handleSelectType = (event) => {
    const selectedType = event.target.value;
    setSelectedType(selectedType);
    filterPlayers(searchQuery, selectedCountry, selectedType);
  };

  const handleCardClick = (user_ID: string, playerID: string) => {
    router.push(`/landing/${user_ID}/players/${playerID}`);
  };

  const numSlides = Math.ceil(filteredPlayers.length / 8);
  const sliderHeight = filteredPlayers.length <= 4 ? 280 : 510; // Adjusted slider height based on card count

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
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <div>
        <div className="p-3 flex items-center" style={{ width: "100%" }}>
          <div
            className=" p-3 justify-center border-2 border-gray-300 bg-gray-100"
            style={{ width: "100%", borderRadius: "20px" }}
          >
            <div
              className="font-semibold text-2xl"
              style={{ borderBottom: "3px solid black", width: "85px" }}
            >
              Players
            </div>
            <div className="flex justify-left items-center mb-4 p-3">
              <input
                type="text"
                placeholder="Search player..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              />
              <select
                value={selectedType}
                onChange={handleSelectType}
                className="px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                style={{ height: "42px", width: "220px", marginLeft: "10px" }}
              >
                <option value="">All Positions</option>
                <option key="goalkeeper" value="goalkeeper">
                  goalkeeper
                </option>
                <option key="defender" value="defender">
                  defender
                </option>
                <option key="midfielder" value="midfielder">
                  midfielder
                </option>
                <option key="forward" value="forward">
                  forward
                </option>
              </select>
              <select
                value={selectedCountry}
                onChange={handleSelectCountry}
                className="px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                style={{ height: "42px", width: "220px", marginLeft: "10px" }}
              >
                <option value="">All Countries</option>
                {uniqueCountries.map((countryId) => {
                  const country = players.find(
                    (player) => player.Country_ID === countryId
                  );
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
                  height: `${sliderHeight}px`,
                  overflow: "hidden",
                }}
              >
                <div
                  className="mx-auto"
                  style={{ maxWidth: "1000px", maxHeight: "510px" }}
                >
                  {numSlides > 1 ? (
                    <Slider {...settings} className="p-3">
                      {Array.from({ length: numSlides }, (_, slideIndex) => (
                        <div key={slideIndex}>
                          <div className="flex flex-col justify-center">
                            <div className="flex flex-row justify-center">
                              {filteredPlayers
                                .slice(slideIndex * 8, slideIndex * 8 + 4)
                                .map((player) => (
                                  <div
                                    key={player.ID}
                                    className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105"
                                    style={{
                                      width: "210px",
                                      height: "210px",
                                      margin: "0 10px",
                                    }}
                                    onClick={() =>
                                      handleCardClick(user_ID, player.ID)
                                    }
                                  >
                                    <div className="flex flex-col items-center">
                                      <img
                                        src={player.headshot}
                                        alt={player.Name}
                                        style={{
                                          width: "150px",
                                          height: "150px",
                                        }}
                                      />
                                      <span className="mb-2 text-l font-bold tracking-tight text-gray-900 p-1">
                                        {player.Name}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                            <div className="flex flex-row justify-center mt-3">
                              {filteredPlayers
                                .slice(slideIndex * 8 + 4, slideIndex * 8 + 8)
                                .map((player) => (
                                  <div
                                    key={player.ID}
                                    className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105"
                                    style={{
                                      width: "210px",
                                      height: "210px",
                                      margin: "0 10px",
                                    }}
                                    onClick={() =>
                                      handleCardClick(user_ID, player.ID)
                                    }
                                  >
                                    <div className="flex flex-col items-center">
                                      <img
                                        src={player.headshot}
                                        alt={player.Name}
                                        style={{
                                          width: "150px",
                                          height: "150px",
                                        }}
                                      />
                                      <span className="mb-2 text-l font-bold tracking-tight text-gray-900 p-1">
                                        {player.Name}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <div className="p-3">
                      {showNoPlayersMessage ? (
                        <h1>No Players Found</h1>
                      ) : (
                        <>
                          <div className="flex flex-row justify-center">
                            {filteredPlayers.slice(0, 4).map((player) => (
                              <div
                                key={player.ID}
                                className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105"
                                style={{
                                  width: "210px",
                                  height: "210px",
                                  margin: "0 10px",
                                }}
                                onClick={() =>
                                  handleCardClick(user_ID, player.ID)
                                }
                              >
                                <div className="flex flex-col items-center">
                                  <img
                                    src={player.headshot}
                                    alt={player.Name}
                                    style={{ width: "150px", height: "150px" }}
                                  />
                                  <span className="mb-2 text-l font-bold tracking-tight text-gray-900 p-1">
                                    {player.Name}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-row justify-center mt-3">
                            {filteredPlayers.slice(4, 8).map((player) => (
                              <div
                                key={player.ID}
                                className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105"
                                style={{
                                  width: "210px",
                                  height: "210px",
                                  margin: "0 10px",
                                }}
                                onClick={() =>
                                  handleCardClick(user_ID, player.ID)
                                }
                              >
                                <div className="flex flex-col items-center">
                                  <img
                                    src={player.headshot}
                                    alt={player.Name}
                                    style={{ width: "150px", height: "150px" }}
                                  />
                                  <span className="mb-2 text-l font-bold tracking-tight text-gray-900 p-1">
                                    {player.Name}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </center>
          </div>
        </div>
      </div>
    </>
  );
};

const Dashboard = ({ params }) => {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState("");
  const [userName, setUserName] = useState(""); // State to store user's name
  const horizontalNavbarRef = useRef<HTMLDivElement>(null);
  const [signOutMessage, setSignOutMessage] = useState("");

  const Club_ID = params.Club_ID;
  function ClubPage({ Club_ID }) {
    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      async function fetchData() {
        try {
          // Fetch club details
          const { data: clubData, error: clubError } = await supabase
            .from("clubs")
            .select(
              "Club_ID, Club_Name, Estabilished, Logo, Stadium, Country_ID"
            )
            .eq("Club_ID", Club_ID)
            .single();

          if (clubError) throw clubError;

          // Fetch country details
          const { data: countryData, error: countryError } = await supabase
            .from("countries")
            .select("Country_Name, rounded, image")
            .eq("Country_ID", clubData.Country_ID)
            .single();

          if (countryError) throw countryError;

          setDetails({ clubDetails: clubData, countryDetails: countryData });
        } catch (error) {
          setError(error.message);
        }
      }

      fetchData();
    }, [Club_ID]);

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!details) {
      return <div>Loading...</div>;
    }

    const { clubDetails, countryDetails } = details;

    return (
      <div>
        <div className="p-3 flex items-center" style={{ width: "100%" }}>
          <div
            className="grid grid-cols-2 p-3 justify-center border-2 border-gray-300 bg-gray-100"
            style={{ width: "100%", borderRadius: "20px" }}
          >
            <div className=" p-3">
              <div
                className="font-semibold text-2xl"
                style={{ borderBottom: "3px solid black", width: "60px" }}
              >
                Club
              </div>
              <center>
                <img
                  src={clubDetails.Logo}
                  alt={countryDetails.Country_Name}
                  style={{ height: "250px" }}
                />
              </center>
              <span className="font-semibold text-3xl">
                <center>
                  <h1>{clubDetails.Club_Name}</h1>
                </center>
              </span>
            </div>

            <div className="grid grid-rows-3  p-2">
              <div className="p-2  flex items-center">
                <p>
                  {" "}
                  <span className="text-2xl">Estabilished:</span>{" "}
                  <span className="text-xl">{clubDetails.Estabilished}</span>
                </p>
              </div>
              <div className="p-2 flex items-center">
                <p>
                  <span className="text-2xl">Stadium:</span>{" "}
                  <span className="text-xl">{clubDetails.Stadium}</span>
                </p>
              </div>
              <div className="p-2 grid grid-cols-2 items-center">
                <div>
                  <span className="text-2xl">Country:</span>{" "}
                  <span className="text-xl">{countryDetails.Country_Name}</span>
                </div>
                <div>
                  <img
                    src={countryDetails.image}
                    alt={countryDetails.Country_Name}
                    style={{ height: "80px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Render other details as needed */}
        <br />
      </div>
    );
  }

  function CoachPage({ Club_ID }) {
    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      async function fetchData() {
        try {
          // Fetch club details
          const { data: coachData, error: coachError } = await supabase
            .from("coaches")
            .select("Coach_Name, headshot, Country_ID")
            .eq("Club_ID", Club_ID)
            .single();

          if (coachError) throw coachError;

          // Fetch country details
          const { data: countryData, error: countryError } = await supabase
            .from("countries")
            .select("Country_Name, image")
            .eq("Country_ID", coachData.Country_ID)
            .single();

          if (countryError) throw countryError;

          setDetails({ coachDetails: coachData, countryDetails: countryData });
        } catch (error) {
          setError(error.message);
        }
      }

      fetchData();
    }, [Club_ID]);

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!details) {
      return <div>Loading...</div>;
    }

    const { coachDetails, countryDetails } = details;

    return (
      <div>
        <div className="p-3 flex items-center" style={{ width: "100%" }}>
          <div
            className="grid grid-cols-2 p-3 justify-center border-2 border-gray-300 bg-gray-100"
            style={{ width: "100%", borderRadius: "20px" }}
          >
            <div className=" p-3">
              <div
                className="font-semibold text-2xl"
                style={{ borderBottom: "3px solid black", width: "80px" }}
              >
                Coach
              </div>
              <center>
                <img
                  src={coachDetails.headshot}
                  alt={coachDetails.Coach_Name}
                  style={{ height: "250px" }}
                />
              </center>
              <span className="font-semibold text-2xl">
                <center>
                  <h1>{coachDetails.Coach_Name}</h1>
                </center>
              </span>
            </div>

            <div className="grid grid-rows-2  p-2">
              <div className="flex items-center">
                <span className="text-2xl p-2">Nationality: </span>
                {"  "}
                <span className="text-xl">{countryDetails.Country_Name}</span>
              </div>
              <div className="p-2 items-center">
                <div>
                  <img
                    src={countryDetails.image}
                    alt={countryDetails.Country_Name}
                    style={{ height: "110px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Render other details as needed */}
        <br />
      </div>
    );
  }

  useEffect(() => {
    fetchUserData(params.user_ID); // Fetch user data when user_ID changes
  }, [params.user_ID]); // Trigger the effect when user_ID changes

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
          <ClubPage Club_ID={params.Club_ID} />
          <CoachPage Club_ID={params.Club_ID} />
          <br />
          <Players user_ID={params.user_ID} Club_ID={params.Club_ID} />
          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
