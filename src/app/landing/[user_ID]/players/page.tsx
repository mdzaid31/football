"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import Message from "../../../components/message";
import LandingNavbar from "../../../components/landingnavbar";
import VerticalNavbar from "../../../components/verticalnavbar";
import Chatbot from "../../../components/chatbot";
import { supabase } from "../../../../lib/supabase";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
  Club_ID: string;
  Club_Name: string;
}

interface PlayersProps {
  user_ID: string;
  Club_ID: string;
}

const Players: React.FC<PlayersProps> = ({ user_ID }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [uniqueCountries, setUniqueCountries] = useState<string[]>([]);
  const [uniqueClubs, setUniqueClubs] = useState<string[]>([]);
  const [showNoPlayersMessage, setShowNoPlayersMessage] =
    useState<boolean>(false);
  const [selectedClub, setSelectedClub] = useState<string>("");

  const router = useRouter();
  const setClub_ID = (clubID: string) => {
    setSelectedClub(clubID);
    filterPlayers(searchQuery, selectedCountry, selectedType, clubID);
  };

  useEffect(() => {
    const fetchPlayersAndCountries = async () => {
      try {
        // Fetch players data
        const { data: playersData, error: playersError } = await supabase
          .from("players")
          .select("headshot, Name, Type, Country_ID, ID, Club_ID")
          .neq("ID", "0")
          .order("ID", { ascending: true });
        if (playersError) throw playersError;

        // Get unique country IDs and fetch countries data
        const uniqueCountryIDs = [
          ...new Set(playersData.map((player) => player.Country_ID)),
        ];
        const { data: countriesData, error: countriesError } = await supabase
          .from("countries")
          .select("Country_ID, Country_Name")
          .in("Country_ID", uniqueCountryIDs);
        if (countriesError) throw countriesError;

        // Get unique club IDs and fetch clubs data
        const uniqueClubIDs = [
          ...new Set(playersData.map((player) => player.Club_ID)),
        ];
        const { data: clubsData, error: clubsError } = await supabase
          .from("clubs")
          .select("Club_ID, Club_Name")
          .in("Club_ID", uniqueClubIDs);
        if (clubsError) throw clubsError;

        // Combine player data with country and club names
        const playersWithCountriesAndClubs = playersData.map((player) => ({
          ...player,
          Country_Name:
            countriesData.find(
              (country) => country.Country_ID === player.Country_ID
            )?.Country_Name || "Unknown",
          Club_Name:
            clubsData.find((club) => club.Club_ID === player.Club_ID)
              ?.Club_Name || "Unknown",
        }));

        setPlayers(playersWithCountriesAndClubs);
        setFilteredPlayers(playersWithCountriesAndClubs);

        // Extract unique countries and clubs for select options
        const uniqueCountries = Array.from(
          new Set(
            playersWithCountriesAndClubs.map((player) => player.Country_ID)
          )
        )
          .map((countryId) => ({
            id: countryId,
            name:
              countriesData.find((country) => country.Country_ID === countryId)
                ?.Country_Name || "Unknown",
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setUniqueCountries(uniqueCountries);

        const uniqueClubs = Array.from(
          new Set(playersWithCountriesAndClubs.map((player) => player.Club_ID))
        )
          .map((clubId) => ({
            id: clubId,
            name:
              clubsData.find((club) => club.Club_ID === clubId)?.Club_Name ||
              "Unknown",
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setUniqueClubs(uniqueClubs);
      } catch (error) {
        console.error(
          "Error fetching players, countries, and clubs:",
          error.message
        );
      }
    };

    fetchPlayersAndCountries();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPlayers(query, selectedCountry, selectedType, selectedClub);
  };

  const filterPlayers = (
    query: string,
    country: string,
    type: string,
    club: string
  ) => {
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

    if (club) {
      filtered = filtered.filter((player) => player.Club_ID === club);
    }

    setFilteredPlayers(filtered);
    setShowNoPlayersMessage(filtered.length === 0);
  };

  const handleSelectCountry = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = event.target.value;
    setSelectedCountry(selectedCountry);
    setSelectedType(selectedType);
    filterPlayers(searchQuery, selectedCountry, selectedType, selectedClub);
  };

  const handleSelectType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    setSelectedType(selectedType);
    filterPlayers(searchQuery, selectedCountry, selectedType, selectedClub);
  };

  const handleSelectClub = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClub = event.target.value;
    setSelectedClub(selectedClub);
    filterPlayers(searchQuery, selectedCountry, selectedType, selectedClub);
  };

  const handleCardClick = (user_ID: string, playerID: string) => {
    router.push(`/landing/${user_ID}/players/${playerID}`);
  };

  const numSlides = Math.ceil(filteredPlayers.length / 12); // Changed to 12 cards per slide
  const sliderHeight =
    numSlides >= 3 ? 715 : filteredPlayers.length <= 4 ? 260 : 525;

  const settings = {
    dots: false,
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
            className="p-3 justify-center border-2 border-gray-300 bg-gray-100"
            style={{ width: "100%", borderRadius: "20px" }}
          >
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
                {uniqueCountries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedClub}
                onChange={handleSelectClub}
                className="px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                style={{ height: "42px", width: "220px", marginLeft: "10px" }}
              >
                <option value="">All Clubs</option>
                {uniqueClubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
            </div>
            <center>
              <div
                className="p-1 border-2 border-gray-600"
                style={{
                  maxWidth: "1000px",
                  width: "100%",
                  borderRadius: "20px",
                  height: `${sliderHeight}px`,
                  overflow: "hidden",
                }}
              >
                {numSlides > 1 ? (
                  <Slider {...settings} className="p-3">
                    {Array.from({ length: numSlides }, (_, slideIndex) => (
                      <div key={slideIndex}>
                        <div className="flex flex-col justify-center">
                          {[0, 1, 2].map((row) => (
                            <div
                              key={row}
                              className="flex flex-row justify-center mt-3"
                            >
                              {filteredPlayers
                                .slice(
                                  slideIndex * 12 + row * 4,
                                  slideIndex * 12 + row * 4 + 4
                                )
                                .map((player) => (
                                  <div
                                    key={player.ID}
                                    className="block max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105"
                                    style={{
                                      width: "calc(100% / 4 - 20px)",
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
                          ))}
                        </div>
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="p-3">
                    {showNoPlayersMessage ? (
                      <h1 className="font-semibold text-2xl">
                        No Players Found
                      </h1>
                    ) : (
                      <>
                        <div className="flex flex-row justify-center">
                          {filteredPlayers.slice(0, 4).map((player) => (
                            <div
                              key={player.ID}
                              className="block max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105"
                              style={{
                                width: "calc(100% / 4 - 20px)",
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
                              className="block max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105"
                              style={{
                                width: "calc(100% / 4 - 20px)",
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
                        {filteredPlayers.length > 8 && (
                          <div className="flex flex-row justify-center mt-3">
                            {filteredPlayers.slice(8, 12).map((player) => (
                              <div
                                key={player.ID}
                                className="block max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105"
                                style={{
                                  width: "calc(100% / 4 - 20px)",
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
                        )}
                      </>
                    )}
                  </div>
                )}
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
  console.log("Profile Picture State:", profilePicture);
  console.log("User Name:", userName);

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
          <br />
          <Players user_ID={params.user_ID} />
          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
