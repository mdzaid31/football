"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import Message from "../../../components/message";
import LandingNavbar from "../../../components/landingnavbar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Radar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import VerticalNavbar from "../../../components/verticalnavbar";
import Chatbot from "../../../components/chatbot";

Chart.register(...registerables);
import { supabase } from "../../../../lib/supabase";

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
  stats: number[]; // Array of stats [Rating, Pace, Shooting, Passing, Dribbling, Defence, Physique]
}

interface PlayersProps {
  user_ID: string;
  Club_ID: string;
}

const Outfield: React.FC<PlayersProps> = ({ user_ID }) => {
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

  const [selectedPlayerStats, setSelectedPlayerStats] = useState<number[]>([]); // Changed to number[]
  const [selectedPlayerCard, setSelectedPlayerCard] = useState<string>(""); // Add semicolon and specify the initial state
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const radarChartRef = useRef<HTMLCanvasElement | null>(null);
  const radarChartInstance = useRef<Chart<"radar"> | null>(null);

  const handlePlayerCardClick = (player: Player) => {
    if (selectedPlayers.length < 4 && !selectedPlayers.includes(player)) {
      // Add the player to selectedPlayers array if it's not already selected and limit is not reached
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  // Handle click to remove a selected player
  const handleRemovePlayer = (player: Player) => {
    const updatedPlayers = selectedPlayers.filter((p) => p !== player);
    setSelectedPlayers(updatedPlayers);
  };

  // JSX code for rendering selected player cards
  const renderSelectedPlayers = () => {
    const cardStyle = {
      width: "260px",
      height: "260px",
      borderRadius: "20px",
      marginRight: "10px", // Adjust margin between cards as needed
    };

    const containerStyle = {
      display: "flex",
      flexWrap: "wrap",
      marginTop: "10px", // Add margin to the top of the container
    };

    const fetchPlayerStats = async () => {
      try {
        const playerStatsPromises = selectedPlayers.map(async (player) => {
          const { data, error } = await supabase
            .from("player_stats")
            .select("Pace, Shooting, Passing, Dribbling, Defence, Physique")
            .eq("ID", player.ID)
            .single();

          if (error) throw error;

          return { player, stats: data };
        });

        const playerStatsData = await Promise.all(playerStatsPromises);
        setSelectedPlayerStats(playerStatsData);
      } catch (error) {
        console.error("Error fetching player stats:", error.message);
      }
    };

    useEffect(() => {
      fetchPlayerStats();
    }, [selectedPlayers]); // Fetch stats when selectedPlayers change

    // Inside your Outfield component
    const createCombinedRadarChart = () => {
      if (!radarChartRef.current || selectedPlayerStats.length === 0) {
        return;
      }

      if (radarChartInstance.current) {
        radarChartInstance.current.destroy();
      }

      const labels = [
        "Pace",
        "Shooting",
        "Passing",
        "Dribbling",
        "Defence",
        "Physique",
      ];
      const colors = [
        "rgba(241, 196, 15, 0.3)", // Yellow
        "rgba(46, 204, 113, 0.4)", // Green
        "rgba(231, 76, 60, 0.5)", // Red
        "rgba(52, 152, 219, 0.6)", // Light Blue
      ];
      const datasets = selectedPlayerStats.map(({ player, stats }, index) => ({
        label: player.Name,
        data: Object.values(stats),
        backgroundColor: colors[index % colors.length], // Cycle through colors if more than 4 players
        borderColor: colors[index % colors.length], // Use same color for border
        borderWidth: 2,
      }));

      radarChartInstance.current = new Chart(radarChartRef.current, {
        type: "radar",
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: {
          scales: {
            r: {
              suggestedMax: 120,
              ticks: {
                stepSize: 10,
                display: false,
              },
              pointLabels: {
                font: {
                  size: 13,
                  weight: "bold",
                },
              },
            },
          },
        },
      });
    };

    // Update the useEffect to call createCombinedRadarChart
    useEffect(() => {
      createCombinedRadarChart();
    }, [selectedPlayers, selectedPlayerStats]); // Update chart when selected players or their stats change

    return (
      <div
        className="selected-players-container items-center"
        style={containerStyle}
      >
        {selectedPlayers.map((player) => (
          <div
            key={player.ID}
            className="border-2 border-gray-500 p-4"
            style={cardStyle}
          >
            <div
              className="selected-player-card"
              onClick={() => handleRemovePlayer(player)}
            >
              <img
                src={player.headshot}
                style={{ height: "220px", width: "220px" }}
                alt={player.Name}
              />
              <div className="font-semibold">{player.Name}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  useEffect(() => {
    const fetchPlayersAndCountries = async () => {
      try {
        // Fetch players data
        const { data: playersData, error: playersError } = await supabase
          .from("players")
          .select("headshot, Name, Type, Country_ID, ID, Club_ID")
          .in("Type", ["defender", "midfielder", "forward"])
          .order("ID", { ascending: true });
        if (playersError) throw playersError;

        // Fetch player stats data
        const { data: playerStatsData, error: statsError } = await supabase
          .from("player_stats")
          .select("Pace, Shooting, Passing, Dribbling, Defence, Physique, ID");
        if (statsError) throw statsError;

        // Fetch countries data
        const uniqueCountryIDs = [
          ...new Set(playersData.map((player) => player.Country_ID)),
        ];
        const { data: countriesData, error: countriesError } = await supabase
          .from("countries")
          .select("Country_ID, Country_Name")
          .in("Country_ID", uniqueCountryIDs);
        if (countriesError) throw countriesError;

        // Fetch clubs data
        const uniqueClubIDs = [
          ...new Set(playersData.map((player) => player.Club_ID)),
        ];
        const { data: clubsData, error: clubsError } = await supabase
          .from("clubs")
          .select("Club_ID, Club_Name")
          .in("Club_ID", uniqueClubIDs);
        if (clubsError) throw clubsError;

        // Update state with fetched data
        setUniqueCountries(countriesData);
        setUniqueClubs(clubsData);

        // Create a map of player stats using player_id as key
        const playerStatsMap = new Map();
        playerStatsData.forEach((stats) => {
          playerStatsMap.set(stats.ID, stats);
        });

        // Combine player data with stats, clubs, and countries
        const playersWithFullData = playersData.map((player) => {
          const stats = playerStatsMap.get(player.ID) || {
            Pace: 0,
            Shooting: 0,
            Passing: 0,
            Dribbling: 0,
            Defence: 0,
            Physique: 0,
          };
          const statsArray = [
            stats.Pace,
            stats.Shooting,
            stats.Passing,
            stats.Dribbling,
            stats.Defence,
            stats.Physique,
          ];
          const country = countriesData.find(
            (country) => country.Country_ID === player.Country_ID
          ) || { Country_Name: "Unknown" };
          const club = clubsData.find(
            (club) => club.Club_ID === player.Club_ID
          ) || { Club_Name: "Unknown" };
          return {
            ...player,
            stats: statsArray,
            Country_Name: country.Country_Name,
            Club_Name: club.Club_Name,
          };
        });

        setPlayers(playersWithFullData);
        setFilteredPlayers(playersWithFullData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
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

  const numSlides = Math.ceil(filteredPlayers.length / 8); // Changed to 12 cards per slide
  const sliderHeight =
    numSlides >= 2 ? 515 : filteredPlayers.length <= 4 ? 260 : 525;

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
            className=" p-3 justify-center border-2 border-gray-300 bg-gray-100"
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
                  <option key={country.Country_ID} value={country.Country_ID}>
                    {country.Country_Name}
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
                  <option key={club.Club_ID} value={club.Club_ID}>
                    {club.Club_Name}
                  </option>
                ))}
              </select>
            </div>
            {/* Player cards */}
            <center>
              {/* Slider */}
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
                <div
                  className="mx-auto"
                  style={{ maxWidth: "1000px", maxHeight: "510px" }}
                >
                  {numSlides > 1 ? (
                    <Slider {...settings} className="p-3">
                      {Array.from({ length: numSlides }, (_, slideIndex) => (
                        <div key={slideIndex}>
                          <div className="flex flex-col justify-center">
                            {/* Calculate card indices based on slideIndex */}
                            {[0, 1].map(
                              (
                                row // Only render two rows
                              ) => (
                                <div
                                  key={row}
                                  className="flex flex-row justify-center mt-3"
                                >
                                  {/* Calculate card indices for each row */}
                                  {filteredPlayers
                                    .slice(
                                      slideIndex * 8 + row * 4,
                                      slideIndex * 8 + row * 4 + 4
                                    ) // Display 4 cards in each row
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
                                          handlePlayerCardClick(player)
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
                              )
                            )}
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
                                className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105"
                                style={{
                                  width: "210px",
                                  height: "210px",
                                  margin: "0 10px",
                                }}
                                onClick={() => handlePlayerCardClick(player)}
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
                                onClick={() => handlePlayerCardClick(player)}
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
                                  className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105"
                                  style={{
                                    width: "210px",
                                    height: "210px",
                                    margin: "0 10px",
                                  }}
                                  onClick={() => handlePlayerCardClick(player)}
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
                          )}
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
      <center>
        <div>
          {" "}
          {/* radar chart container */}
          <div className="p-3 flex items-center" style={{ width: "65%" }}>
            {" "}
            {/* Radar chart container */}
            {selectedPlayers.length > 0 && (
              <div
                className="p-3 justify-center border-2 border-gray-300 bg-gray-100 items-center"
                style={{ width: "100%", borderRadius: "20px", height: "410px" }}
              >
                {/* Radar chart container */}

                <div
                  className="p-3 flex items-center justify-center"
                  style={{ width: "100%", height: "390px" }}
                >
                  <canvas ref={radarChartRef}></canvas>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          {" "}
          {/* selected player container container */}
          <div className="p-3 flex items-center" style={{ width: "98%" }}>
            <div
              className=" p-3 justify-center border-2 border-gray-300 bg-gray-100 items-center"
              style={{ width: "100%", borderRadius: "20px" }}
            >
              {" "}
              {renderSelectedPlayers()}
            </div>
          </div>
        </div>
      </center>
      <br />
    </>
  );
};

const Goalkeeper: React.FC<PlayersProps> = ({ user_ID }) => {
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

  const [selectedPlayerStats, setSelectedPlayerStats] = useState<number[]>([]); // Changed to number[]
  const [selectedPlayerCard, setSelectedPlayerCard] = useState<string>(""); // Add semicolon and specify the initial state
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const radarChartRef = useRef<HTMLCanvasElement | null>(null);
  const radarChartInstance = useRef<Chart<"radar"> | null>(null);

  const handlePlayerCardClick = (player: Player) => {
    if (selectedPlayers.length < 4 && !selectedPlayers.includes(player)) {
      // Add the player to selectedPlayers array if it's not already selected and limit is not reached
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  // Handle click to remove a selected player
  const handleRemovePlayer = (player: Player) => {
    const updatedPlayers = selectedPlayers.filter((p) => p !== player);
    setSelectedPlayers(updatedPlayers);
  };

  // JSX code for rendering selected player cards
  const renderSelectedPlayers = () => {
    const cardStyle = {
      width: "260px",
      height: "260px",
      borderRadius: "20px",
      marginRight: "10px", // Adjust margin between cards as needed
    };

    const containerStyle = {
      display: "flex",
      flexWrap: "wrap",
      marginTop: "10px", // Add margin to the top of the container
    };

    const fetchPlayerStats = async () => {
      try {
        const playerStatsPromises = selectedPlayers.map(async (player) => {
          const { data, error } = await supabase
            .from("goalkeeper_stats")
            .select("Diving, Handling, Positioning, Speed, Reflexes, Kicking")
            .eq("ID", player.ID)
            .single();

          if (error) throw error;

          return { player, stats: data };
        });

        const playerStatsData = await Promise.all(playerStatsPromises);
        setSelectedPlayerStats(playerStatsData);
      } catch (error) {
        console.error("Error fetching player stats:", error.message);
      }
    };

    useEffect(() => {
      fetchPlayerStats();
    }, [selectedPlayers]); // Fetch stats when selectedPlayers change

    // Inside your Outfield component
    const createCombinedRadarChart = () => {
      if (!radarChartRef.current || selectedPlayerStats.length === 0) {
        return;
      }

      if (radarChartInstance.current) {
        radarChartInstance.current.destroy();
      }

      const labels = [
        "Diving",
        "Handling",
        "Positioning",
        "Speed",
        "Reflexes",
        "Kicking",
      ];
      const colors = [
        "rgba(241, 196, 15, 0.3)", // Yellow
        "rgba(46, 204, 113, 0.4)", // Green
        "rgba(231, 76, 60, 0.5)", // Red
        "rgba(52, 152, 219, 0.6)", // Light Blue
      ];
      const datasets = selectedPlayerStats.map(({ player, stats }, index) => ({
        label: player.Name,
        data: Object.values(stats),
        backgroundColor: colors[index % colors.length], // Cycle through colors if more than 4 players
        borderColor: colors[index % colors.length], // Use same color for border
        borderWidth: 2,
      }));

      radarChartInstance.current = new Chart(radarChartRef.current, {
        type: "radar",
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: {
          scales: {
            r: {
              suggestedMax: 120,
              ticks: {
                stepSize: 10,
                display: false,
              },
              pointLabels: {
                font: {
                  size: 13,
                  weight: "bold",
                },
              },
            },
          },
        },
      });
    };

    // Update the useEffect to call createCombinedRadarChart
    useEffect(() => {
      createCombinedRadarChart();
    }, [selectedPlayers, selectedPlayerStats]); // Update chart when selected players or their stats change

    return (
      <div
        className="selected-players-container items-center"
        style={containerStyle}
      >
        {selectedPlayers.map((player) => (
          <div
            key={player.ID}
            className="border-2 border-gray-500 p-4"
            style={cardStyle}
          >
            <div
              className="selected-player-card"
              onClick={() => handleRemovePlayer(player)}
            >
              <img
                src={player.headshot}
                style={{ height: "220px", width: "220px" }}
                alt={player.Name}
              />
              <div className="font-semibold">{player.Name}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  useEffect(() => {
    const fetchPlayersAndCountries = async () => {
      try {
        // Fetch players data
        const { data: playersData, error: playersError } = await supabase
          .from("players")
          .select("headshot, Name, Type, Country_ID, ID, Club_ID")
          .in("Type", ["goalkeeper"])
          .order("ID", { ascending: true });
        if (playersError) throw playersError;

        // Fetch player stats data
        const { data: playerStatsData, error: statsError } = await supabase
          .from("goalkeeper_stats")
          .select(
            "Diving, Handling, Kicking, Positioning, Speed, Reflexes, ID"
          );
        if (statsError) throw statsError;

        // Fetch countries data
        const uniqueCountryIDs = [
          ...new Set(playersData.map((player) => player.Country_ID)),
        ];
        const { data: countriesData, error: countriesError } = await supabase
          .from("countries")
          .select("Country_ID, Country_Name")
          .in("Country_ID", uniqueCountryIDs);
        if (countriesError) throw countriesError;

        // Fetch clubs data
        const uniqueClubIDs = [
          ...new Set(playersData.map((player) => player.Club_ID)),
        ];
        const { data: clubsData, error: clubsError } = await supabase
          .from("clubs")
          .select("Club_ID, Club_Name")
          .in("Club_ID", uniqueClubIDs);
        if (clubsError) throw clubsError;

        // Update state with fetched data
        setUniqueCountries(countriesData);
        setUniqueClubs(clubsData);

        // Create a map of player stats using player_id as key
        const playerStatsMap = new Map();
        playerStatsData.forEach((stats) => {
          playerStatsMap.set(stats.ID, stats);
        });

        // Combine player data with stats, clubs, and countries
        const playersWithFullData = playersData.map((player) => {
          const stats = playerStatsMap.get(player.ID) || {
            Diving: 0,
            Handling: 0,
            Kicking: 0,
            Positioning: 0,
            Relfexes: 0,
            Speed: 0,
          };
          const statsArray = [
            stats.Diving,
            stats.Handling,
            stats.Kicking,
            stats.Positioning,
            stats.Reflexes,
            stats.Speed,
          ];
          const country = countriesData.find(
            (country) => country.Country_ID === player.Country_ID
          ) || { Country_Name: "Unknown" };
          const club = clubsData.find(
            (club) => club.Club_ID === player.Club_ID
          ) || { Club_Name: "Unknown" };
          return {
            ...player,
            stats: statsArray,
            Country_Name: country.Country_Name,
            Club_Name: club.Club_Name,
          };
        });

        setPlayers(playersWithFullData);
        setFilteredPlayers(playersWithFullData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
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

  const handleSelectClub = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClub = event.target.value;
    setSelectedClub(selectedClub);
    filterPlayers(searchQuery, selectedCountry, selectedType, selectedClub);
  };

  const numSlides = Math.ceil(filteredPlayers.length / 8); // Changed to 12 cards per slide
  const sliderHeight =
    numSlides >= 2 ? 515 : filteredPlayers.length <= 4 ? 260 : 525;

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
            className=" p-3 justify-center border-2 border-gray-300 bg-gray-100"
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
                value={selectedCountry}
                onChange={handleSelectCountry}
                className="px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                style={{ height: "42px", width: "220px", marginLeft: "10px" }}
              >
                <option value="">All Countries</option>
                {uniqueCountries.map((country) => (
                  <option key={country.Country_ID} value={country.Country_ID}>
                    {country.Country_Name}
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
                  <option key={club.Club_ID} value={club.Club_ID}>
                    {club.Club_Name}
                  </option>
                ))}
              </select>
            </div>
            {/* Player cards */}
            <center>
              {/* Slider */}
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
                <div
                  className="mx-auto"
                  style={{ maxWidth: "1000px", maxHeight: "510px" }}
                >
                  {numSlides > 1 ? (
                    <Slider {...settings} className="p-3">
                      {Array.from({ length: numSlides }, (_, slideIndex) => (
                        <div key={slideIndex}>
                          <div className="flex flex-col justify-center">
                            {/* Calculate card indices based on slideIndex */}
                            {[0, 1].map(
                              (
                                row // Only render two rows
                              ) => (
                                <div
                                  key={row}
                                  className="flex flex-row justify-center mt-3"
                                >
                                  {/* Calculate card indices for each row */}
                                  {filteredPlayers
                                    .slice(
                                      slideIndex * 8 + row * 4,
                                      slideIndex * 8 + row * 4 + 4
                                    ) // Display 4 cards in each row
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
                                          handlePlayerCardClick(player)
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
                              )
                            )}
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
                                className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105"
                                style={{
                                  width: "210px",
                                  height: "210px",
                                  margin: "0 10px",
                                }}
                                onClick={() => handlePlayerCardClick(player)}
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
                                onClick={() => handlePlayerCardClick(player)}
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
                                  className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105"
                                  style={{
                                    width: "210px",
                                    height: "210px",
                                    margin: "0 10px",
                                  }}
                                  onClick={() => handlePlayerCardClick(player)}
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
                          )}
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
      <center>
        <div>
          {" "}
          {/* radar chart container */}
          <div className="p-3 flex items-center" style={{ width: "65%" }}>
            {" "}
            {/* Radar chart container */}
            {selectedPlayers.length > 0 && (
              <div
                className="p-3 justify-center border-2 border-gray-300 bg-gray-100 items-center"
                style={{ width: "100%", borderRadius: "20px", height: "410px" }}
              >
                {/* Radar chart container */}

                <div
                  className="p-3 flex items-center justify-center"
                  style={{ width: "100%", height: "390px" }}
                >
                  <canvas ref={radarChartRef}></canvas>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          {" "}
          {/* selected player container container */}
          <div className="p-3 flex items-center" style={{ width: "98%" }}>
            <div
              className=" p-3 justify-center border-2 border-gray-300 bg-gray-100 items-center"
              style={{ width: "100%", borderRadius: "20px" }}
            >
              {" "}
              {renderSelectedPlayers()}
            </div>
          </div>
        </div>
      </center>
      <br />
    </>
  );
};

const Dashboard = ({ params }) => {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState("");
  const [userName, setUserName] = useState(""); // State to store user's name
  const horizontalNavbarRef = useRef<HTMLDivElement>(null);
  const [signOutMessage, setSignOutMessage] = useState("");

  const [selectedTab, setSelectedTab] = useState<"outfield" | "goalkeeper">(
    "outfield"
  );

  const handleTabChange = (tab: "outfield" | "goalkeeper") => {
    setSelectedTab(tab);
  };

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
          <center>
            <div
              className="p-6 grid grid-cols-2"
              style={{ maxWidth: "750px", maxHeight: "370px" }}
            >
              <div
                className="p-2 items-center border-2 border-gray-700 text-xl"
                style={{
                  maxWidth: "350px",
                  maxHeight: "350px",
                  backgroundColor: selectedTab === "outfield" ? "#a50044" : "", // Change background color based on selectedTab
                  color: selectedTab === "outfield" ? "#ffffff" : "", // Change font color based on selectedTab
                  fontWeight: selectedTab === "outfield" ? "600" : "normal", // Change font weight based on selectedTab
                }}
                onClick={() => handleTabChange("outfield")}
              >
                Outfield Players
              </div>
              <div
                className="p-2 items-center border-2 border-gray-700 text-xl"
                style={{
                  maxWidth: "350px",
                  maxHeight: "350px",
                  backgroundColor:
                    selectedTab === "goalkeeper" ? "#a50044" : "", // Change background color based on selectedTab
                  color: selectedTab === "goalkeeper" ? "#ffffff" : "", // Change font color based on selectedTab
                  fontWeight: selectedTab === "goalkeeper" ? "600" : "normal", // Change font weight based on selectedTab
                }}
                onClick={() => handleTabChange("goalkeeper")}
              >
                Goalkeepers
              </div>
            </div>
          </center>

          {selectedTab === "outfield" && (
            <div className="outfield-players-template">
              <Outfield user_ID={params.user_ID} />
            </div>
          )}

          {selectedTab === "goalkeeper" && (
            <div className="goalkeeper-template">
              <Goalkeeper user_ID={params.user_ID} />
            </div>
          )}
          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
