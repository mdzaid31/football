"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Message from "C:/Users/HomePC/Desktop/football/src/app/components/message";
import { Radar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import LandingNavbar from "C:/Users/HomePC/Desktop/football/src/app/components/landingnavbar";
import VerticalNavbar from "C:/Users/HomePC/Desktop/football/src/app/components/verticalnavbar";
import Chatbot from "C:/Users/HomePC/Desktop/football/src/app/components/chatbot";

Chart.register(...registerables);
const supabase = createClient(
  "https://binohqobswgaznnhogsn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbm9ocW9ic3dnYXpubmhvZ3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2NzcwOTMsImV4cCI6MjAyNjI1MzA5M30.AYRRtfz5U__Jyalsy7AQxXrnjKr4eNooJUxnI51A6kk"
);

const PlayerDetails = ({ playerId }) => {
  const [playerDetails, setPlayerDetails] = useState(null);
  const [playerStatsData, setPlayerStatsData] = useState(null);
  const [countryDetails, setCountryDetails] = useState(null);
  const [clubDetails, setClubDetails] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isGoalkeeper, setIsGoalkeeper] = useState(false);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const { data: playerData, error: playerError } = await supabase
          .from("players")
          .select("*")
          .eq("ID", playerId)
          .single();

        if (playerError) {
          throw playerError;
        }

        setPlayerDetails(playerData);
        setIsGoalkeeper(
          playerData.Type === "Goalkeeper" || playerData.Type === "goalkeeper"
        );

        const { data: countryData, error: countryError } = await supabase
          .from("countries")
          .select("Country_Name, image, rounded")
          .eq("Country_ID", playerData.Country_ID)
          .single();

        if (countryError) {
          throw countryError;
        }

        setCountryDetails(countryData);

        let statsQuery = supabase.from("player_stats").select("*");
        if (
          playerData.Type === "Goalkeeper" ||
          playerData.Type === "goalkeeper"
        ) {
          statsQuery = supabase.from("goalkeeper_stats").select("*");
        }
        const { data: statsData, error: statsError } = await statsQuery
          .eq("ID", playerId)
          .single();

        if (statsError) {
          throw statsError;
        }

        setPlayerStatsData(statsData);

        if (statsError) {
          throw statsError;
        }

        setPlayerStatsData(statsData);

        const { data: clubData, error: clubError } = await supabase
          .from("clubs")
          .select("*")
          .eq("Club_ID", playerData.Club_ID)
          .single();

        if (clubError) {
          throw clubError;
        }

        setClubDetails(clubData);
        if (!isGoalkeeper) {
          if (playerStatsData) {
            const data = {
              labels: [
                "Pace",
                "Shooting",
                "Passing",
                "Dribbling",
                "Defence",
                "Physique",
              ], // Example labels
              datasets: [
                {
                  label: "Player Stats",
                  backgroundColor: "rgba(179, 0, 92, 0.5)",
                  borderColor: "rgba(179, 0 , 92, 1)",
                  pointBackgroundColor: "rgba(179, 0 , 92, 1)",
                  pointBorderColor: "#fff",
                  pointHoverBackgroundColor: "#fff",
                  pointHoverBorderColor: "rgba(54, 162, 235, 1)",
                  data: [
                    playerStatsData.Pace,
                    playerStatsData.Shooting,
                    playerStatsData.Passing,
                    playerStatsData.Dribbling,
                    playerStatsData.Defence,
                    playerStatsData.Physique,
                  ],
                },
              ],
            };
            setChartData(data);
          }
        }
        if (isGoalkeeper) {
          if (playerStatsData) {
            const data = {
              labels: [
                "Diving",
                "Handling",
                "Kicking",
                "Reflexes",
                "Speed",
                "Positioning",
              ], // Example labels
              datasets: [
                {
                  label: "Player Stats",
                  backgroundColor: "rgba(179, 0, 92, 0.5)",
                  borderColor: "rgba(179, 0 , 92, 1)",
                  pointBackgroundColor: "rgba(179, 0 , 92, 1)",
                  pointBorderColor: "#fff",
                  pointHoverBackgroundColor: "#fff",
                  pointHoverBorderColor: "rgba(54, 162, 235, 1)",
                  data: [
                    playerStatsData.Diving,
                    playerStatsData.Handling,
                    playerStatsData.Kicking,
                    playerStatsData.Reflexes,
                    playerStatsData.Speed,
                    playerStatsData.Positioning,
                  ],
                },
              ],
            };
            setChartData(data);
          }
        }
      } catch (error) {
        console.error("Error fetching player details:", error.message);
      }
    };
    if (playerId) {
      fetchPlayerDetails();
    }
  }, [
    playerId,
    setClubDetails,
    setPlayerDetails,
    setCountryDetails,
    setPlayerStatsData,
    playerStatsData,
  ]);

  if (!playerDetails || !playerStatsData || !clubDetails) {
    return <div>Loading player details...</div>;
  }
  const options = {
    scales: {
      r: {
        suggestedMax: 110,
        ticks: {
          stepSize: 10, // Set the step size to 10 for increments of 10
          display: false, // Hide the numbers on the scale
        },
        pointLabels: {
          font: {
            size: 13, // Increase the font size of point labels
            weight: "bold", // Make the point labels bold
          },
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Player Stats", // Your radar chart title
        font: {
          size: 20, // Increase the font size of the title
          weight: "bold", // Make the title bold
        },
      },
    },
  };
  return (
    <div>
      {/* Profile information */}
      <div className="p-3 flex items-center">
        <div
          className="p-3 justify-center border-2 border-gray-500 bg-gray-100"
          style={{ width: "100%", borderRadius: "20px" }}
        >
          {/* Profile details */}
          {isGoalkeeper ? (
            <div>
              {/* Render specific content for goalkeepers */}
              <div>
                <div className="">
                  <div className="font-semibold text-2xl p-3">
                    <u>Profile</u>
                  </div>
                  <center>
                    <table style={{ width: "900px" }}>
                      <tbody>
                        <tr>
                          <td className="" style={{ width: "350px" }}>
                            <center>
                              <div className="">
                                <div
                                  className="border-2 border-gray-500"
                                  style={{ borderRadius: "20px" }}
                                >
                                  <img
                                    src={playerDetails.headshot}
                                    style={{
                                      height: "320px",
                                      width: "320px",
                                    }}
                                  />
                                </div>
                                <div className="text-2xl font-semibold">
                                  {playerDetails.Name}
                                </div>
                              </div>
                            </center>
                          </td>
                          <td>
                            <table className="border-collapse">
                              <tbody>
                                <tr>
                                  <td className=" p-3 items-center justify-center inline-flex">
                                    <div className="p-3  font-semibold text-xl">
                                      Club:{"  "}
                                    </div>
                                    <center>
                                      <img
                                        src={clubDetails.Logo}
                                        alt={
                                          clubDetails.Club_Name ||
                                          "Unknown Club"
                                        }
                                        style={{
                                          height: "190px",
                                          marginLeft: "30px",
                                        }}
                                      />
                                    </center>
                                  </td>
                                  <td className=" text-xl" colSpan={2}>
                                    {clubDetails.Club_Name || "Unknown Club"}
                                  </td>
                                </tr>

                                <tr>
                                  <td className="p-3  items-center justify-center inline-flex">
                                    <div className="p-3  font-semibold text-xl">
                                      {" "}
                                      Nationality:
                                    </div>
                                    <center>
                                      <img
                                        src={countryDetails.image}
                                        alt={countryDetails.Country_Name}
                                        style={{ width: "140px" }}
                                      />
                                    </center>
                                  </td>
                                  <td className="p-3 text-xl" colSpan={2}>
                                    {countryDetails.Country_Name}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </center>
                </div>
                <br />
                <center>
                  <div
                    className="border-gray-500 border-2"
                    style={{
                      borderRadius: "20px",
                      overflow: "hidden",
                      width: "70%",
                    }}
                  >
                    <table
                      className=" border-gray-500"
                      style={{ width: "100%" }}
                    >
                      <tr className="grid grid-cols-6">
                        <th className="font-semibold border-b-2 border-r-2 border-gray-500">
                          Type
                        </th>
                        <th className="font-semibold border-b-2 border-r-2 border-gray-500">
                          Position
                        </th>
                        <th className="font-semibold border-b-2 border-r-2 border-gray-500">
                          Weight(Kg)
                        </th>
                        <th className="font-semibold border-b-2 border-r-2 border-gray-500">
                          Height(cm)
                        </th>
                        <th className="font-semibold border-b-2 border-r-2 border-gray-500">
                          Foot
                        </th>
                        <th className="font-semibold border-b-2 border-gray-500">
                          Jersey
                        </th>
                      </tr>
                      <tr className="grid grid-cols-6 items-center">
                        <td className="border-r-2 border-gray-500 p-3">
                          {playerDetails.Type}
                        </td>
                        <td className="border-r-2 border-gray-500 p-3">
                          {playerDetails.Position}
                        </td>
                        <td className="border-r-2 border-gray-500 p-3">
                          {playerDetails.weight}
                        </td>
                        <td className="border-r-2 border-gray-500 p-3">
                          {playerDetails.height}
                        </td>
                        <td className="border-r-2 border-gray-500 p-3">
                          {playerDetails.foot}
                        </td>
                        <td>
                          <img
                            src={playerDetails.jersey_pic}
                            alt={playerDetails.Jersey}
                            style={{ maxHeight: "70px" }}
                          />
                        </td>
                      </tr>
                    </table>
                  </div>

                  <br />
                  <div
                    className="grid grid-cols-2 p-6"
                    style={{ maxWidth: "77%" }}
                  >
                    <div
                      className="p-5 border-2 border-gray-500 items-center"
                      style={{ borderRadius: "20px" }}
                    >
                      <img
                        src={playerStatsData.Card}
                        style={{ height: "350px" }}
                      />
                    </div>
                    <div
                      className="p-5 border-2 border-gray-500"
                      style={{ borderRadius: "20px", marginLeft: "20px" }}
                    >
                      {chartData && (
                        <Radar data={chartData} options={options} />
                      )}
                    </div>
                  </div>
                </center>
              </div>
            </div>
          ) : (
            <div>
              <div className="">
                <div className="font-semibold text-2xl p-3">
                  <u>Profile</u>
                </div>
                <center>
                  <table style={{ width: "900px" }}>
                    <tbody>
                      <tr>
                        <td className="" style={{ width: "350px" }}>
                          <center>
                            <div className="">
                              <div
                                className="border-2 border-gray-500"
                                style={{ borderRadius: "20px" }}
                              >
                                <img
                                  src={playerDetails.headshot}
                                  style={{
                                    height: "250px",
                                    width: "250px",
                                  }}
                                />
                              </div>
                              <div className="text-2xl font-semibold">
                                {playerDetails.Name}
                              </div>
                            </div>
                          </center>
                        </td>
                        <td>
                          <table className="border-collapse">
                            <tbody>
                              <tr>
                                <td className=" p-3 items-center justify-center inline-flex">
                                  <div className="p-3  font-semibold text-xl">
                                    Club:{"  "}
                                  </div>
                                  <center>
                                    <img
                                      src={clubDetails.Logo}
                                      alt={
                                        clubDetails.Club_Name || "Unknown Club"
                                      }
                                      style={{
                                        height: "190px",
                                        marginLeft: "30px",
                                      }}
                                    />
                                  </center>
                                </td>
                                <td className=" text-xl" colSpan={2}>
                                  {clubDetails.Club_Name || "Unknown Club"}
                                </td>
                              </tr>

                              <tr>
                                <td className="p-3  items-center justify-center inline-flex">
                                  <div className="p-3  font-semibold text-xl">
                                    {" "}
                                    Nationality:
                                  </div>
                                  <center>
                                    <img
                                      src={countryDetails.image}
                                      alt={countryDetails.Country_Name}
                                      style={{ width: "140px" }}
                                    />
                                  </center>
                                </td>
                                <td className="p-3 text-xl" colSpan={2}>
                                  {countryDetails.Country_Name}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </center>
              </div>
              <br />
              <center>
                <div
                  className="border-2 border-gray-500"
                  style={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    width: "70%",
                  }}
                >
                  <table className="" style={{ width: "100%" }}>
                    <tr className="grid grid-cols-6">
                      <th className="font-semibold border-b-2 border-r-2 border-gray-500">
                        Type
                      </th>
                      <th className="font-semibold border-b-2 border-r-2 border-gray-500">
                        Position
                      </th>
                      <th className="font-semibold border-b-2 border-r-2 border-gray-500">
                        Weight(Kg)
                      </th>
                      <th className="font-semibold border-b-2 border-r-2 border-gray-500">
                        Height(cm)
                      </th>
                      <th className="font-semibold border-b-2 border-r-2 border-gray-500">
                        Foot
                      </th>
                      <th className="font-semibold border-b-2 border-gray-500">
                        Jersey
                      </th>
                    </tr>
                    <tr className="grid grid-cols-6 items-center">
                      <td className="border-r-2 border-gray-500 p-3">
                        {playerDetails.Type}
                      </td>
                      <td className="border-r-2 border-gray-500 p-3">
                        {playerDetails.Position}
                      </td>
                      <td className="border-r-2 border-gray-500 p-3">
                        {playerDetails.weight}
                      </td>
                      <td className="border-r-2 border-gray-500 p-3">
                        {playerDetails.height}
                      </td>
                      <td className="border-r-2 border-gray-500 p-3">
                        {playerDetails.foot}
                      </td>
                      <td>
                        <img
                          src={playerDetails.jersey_pic}
                          alt={playerDetails.Jersey}
                          style={{ maxHeight: "70px" }}
                        />
                      </td>
                    </tr>
                  </table>
                </div>

                <br />
                <div
                  className="grid grid-cols-2 p-6"
                  style={{ maxWidth: "77%" }}
                >
                  <div
                    className="p-5 border-2 border-gray-500 items-center"
                    style={{ borderRadius: "20px" }}
                  >
                    <img
                      src={playerStatsData.Card}
                      style={{ height: "330px" }}
                    />
                  </div>
                  <div
                    className="p-5 border-2 border-gray-500"
                    style={{ borderRadius: "20px", marginLeft: "20px" }}
                  >
                    {chartData && <Radar data={chartData} options={options} />}
                  </div>
                </div>
              </center>
            </div>
          )}
        </div>
      </div>
    </div>
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
          <PlayerDetails playerId={params.ID} />
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
