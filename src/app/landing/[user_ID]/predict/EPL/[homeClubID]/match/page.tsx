"use client";
import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Message from "C:/Users/HomePC/Desktop/football/src/app/components/message";
import LandingNavbar from "C:/Users/HomePC/Desktop/football/src/app/components/landingnavbar";
import VerticalNavbar from "C:/Users/HomePC/Desktop/football/src/app/components/verticalnavbar";
import { useRouter } from "next/navigation";
import axios from "axios";
import "ldrs/ring";
import { lineSpinner } from "ldrs";
import Chatbot from "C:/Users/HomePC/Desktop/football/src/app/components/chatbot";
lineSpinner.register();

const supabase = createClient(
  "https://binohqobswgaznnhogsn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbm9ocW9ic3dnYXpubmhvZ3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2NzcwOTMsImV4cCI6MjAyNjI1MzA5M30.AYRRtfz5U__Jyalsy7AQxXrnjKr4eNooJUxnI51A6kk"
);

const EPL = ({ params }) => {
  const router = useRouter();

  const [profilePicture, setProfilePicture] = useState("");
  const [userName, setUserName] = useState("");
  const [signOutMessage, setSignOutMessage] = useState("");
  const [clubs, setClubs] = useState([]);
  const [results, setResults] = useState([]);
  const [clubAverages, setClubAverages] = useState({});
  const [result, setResult] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const horizontalNavbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserData(params.user_ID);
    fetchClubsData();
  }, [params.user_ID]);

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

      if (userData && userData.Full_Name) {
        setUserName(userData.Full_Name);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      // Check if sign-out message is already being displayed
      if (signOutMessage) {
        return;
      }
  
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
  const fetchClubsData = async () => {
    try {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .eq("Country_ID", "F36")
        .order("Club_ID");

      if (error) {
        throw error;
      }

      if (data) {
        setClubs(data);
        calculateClubAverages(data);
      }
    } catch (error) {
      console.error("Error fetching clubs data:", error.message);
    }
  };

  const calculateClubAverages = async (clubs) => {
    const averages = {};
    for (const club of clubs) {
      const goalkeeperRating = await fetchGoalkeeperRating(club.Goalkeeper);
      const defenders = club.Defenders.split(",").filter(Boolean);
      const midfielders = club.Midfielders.split(",").filter(Boolean);
      const attackers = club.Attackers.split(",").filter(Boolean);

      const defenderRatings = await fetchPlayerRatings(defenders);
      const midfielderRatings = await fetchPlayerRatings(midfielders);
      const attackerRatings = await fetchPlayerRatings(attackers);

      const totalRating =
        goalkeeperRating +
        defenderRatings.reduce((a, b) => a + b, 0) +
        midfielderRatings.reduce((a, b) => a + b, 0) +
        attackerRatings.reduce((a, b) => a + b, 0);

      const averageRating = totalRating / 11;
      averages[club.Club_Name] = averageRating.toFixed(2);
    }
    setClubAverages(averages);
  };

  const fetchGoalkeeperRating = async (goalkeeperID) => {
    try {
      const { data, error } = await supabase
        .from("goalkeeper_stats")
        .select("Rating")
        .eq("ID", goalkeeperID)
        .single();

      if (error) {
        throw error;
      }

      return data ? data.Rating : 0;
    } catch (error) {
      console.error("Error fetching goalkeeper rating:", error.message);
      return 0;
    }
  };

  const fetchPlayerRatings = async (playerIDs) => {
    try {
      const promises = playerIDs.map(async (playerID) => {
        const { data, error } = await supabase
          .from("player_stats")
          .select("Rating")
          .eq("ID", playerID)
          .single();

        if (error) {
          throw error;
        }

        return data ? data.Rating : 0;
      });

      const ratings = await Promise.all(promises);
      return ratings;
    } catch (error) {
      console.error("Error fetching players' ratings:", error.message);
      return Array(playerIDs.length).fill(0);
    }
  };

  const makePrediction = async (homeLineup, awayLineup) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/predict", {
        home_lineup: homeLineup,
        away_lineup: awayLineup,
      });

      return response.data.result;
    } catch (error) {
      console.error("Prediction failed:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (Object.keys(clubAverages).length === clubs.length) {
      const predictions = [];
      const totalPredictions = (clubs.length - 1) * clubs.length;
      let predictionsCount = 0;
      clubs.forEach((homeClub) => {
        clubs
          .filter((awayClub) => awayClub.Club_ID !== homeClub.Club_ID)
          .forEach((awayClub) => {
            const home_lineup = clubAverages[homeClub.Club_Name];
            const away_lineup = clubAverages[awayClub.Club_Name];
            makePrediction(home_lineup, away_lineup)
              .then((result) => {
                predictions.push({
                  homeClub: homeClub.Club_Name,
                  homeClubID: homeClub.Club_ID,
                  awayClub: awayClub.Club_Name,
                  awayClubID: awayClub.Club_ID,
                  result: result,
                });
                predictionsCount++;
                if (predictionsCount === totalPredictions) {
                  setResults(predictions);
                }
              })
              .catch((error) => {
                console.error("Prediction failed:", error);
                predictionsCount++;
                if (predictionsCount === totalPredictions) {
                  setResults(predictions);
                }
              });
          });
      });
    }
  }, [clubAverages, clubs]);

  const [selectedTab, setSelectedTab] = useState<"Points Table" | "Matches">(
    "Points Table"
  );

  const handleTabChange = (tab: "Points Table" | "Matches") => {
    setSelectedTab(tab);
  };

  const calculatePoints = (clubID) => {
    let Points = 0;

    // Count the number of wins for the club (both as home and away)
    const homeWins = results.filter(
      (result) => result.homeClubID === clubID && result.result === "Win"
    ).length;

    const awayLoses = results.filter(
      (result) => result.awayClubID === clubID && result.result === "Lose"
    ).length;

    // Add the number of wins and loses to the Points (each win contributes +3 points)
    Points += (homeWins + awayLoses) * 3;

    return Points;
  };

  const sortedClubs = clubs.sort(
    (a, b) => calculatePoints(b.Club_ID) - calculatePoints(a.Club_ID)
  );

  const userClubIndex = sortedClubs.findIndex(
    (club) => club.Club_ID === params.homeClubID
  );

  // Message to display
  let clubPositionMessage = "";
  if (userClubIndex !== -1) {
    if (userClubIndex === 0) {
      clubPositionMessage = "First";
    } else if (userClubIndex === 1) {
      clubPositionMessage = "Second";
    } else if (userClubIndex === 2) {
      clubPositionMessage = "Third";
    } else {
      clubPositionMessage = `${userClubIndex + 1}th`;
    }
  }

  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 60000); // 51 seconds timeout

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const horizontalNavbarHeight =
      horizontalNavbarRef.current?.clientHeight || 0;
    document.documentElement.style.setProperty(
      "--horizontal-navbar-height",
      `${horizontalNavbarHeight}px`
    );
  }, []);

  return (
    <div>
      <Chatbot />
      {signOutMessage && (
        <Message
          message={signOutMessage}
          onClose={() => setSignOutMessage("")}
        />
      )}
      <LandingNavbar user_ID={params.user_ID} handleSignOut={handleSignOut} />
      <div style={{ marginTop: "var(--horizontal-navbar-height, 0)" }}>
        <VerticalNavbar user_ID={params.user_ID} />
        <div style={{ marginLeft: 210, marginTop: 70 }}>
          {isLoading ? (
            <div
              className="items-center"
              style={{ top: "50%", marginTop: 230 }}
            >
              <center>
                <l-line-spinner
                  size="150"
                  stroke="3"
                  speed="1"
                  color="blue"
                ></l-line-spinner>
                <p>Time left: {countdown} seconds</p>
              </center>
            </div>
          ) : (
            <div>
              <div>
                <center>
                  <div
                    className="p-6 grid grid-cols-2"
                    style={{ maxWidth: "750px", maxHeight: "370px" }}
                  >
                    <div
                      className="p-2 items-center border-2 border-gray-700 text-xl cursor-pointer"
                      style={{
                        maxWidth: "350px",
                        maxHeight: "350px",
                        backgroundColor:
                          selectedTab === "Points Table" ? "#a50044" : "",
                        color: selectedTab === "Points Table" ? "#ffffff" : "",
                        fontWeight:
                          selectedTab === "Points Table" ? "600" : "normal",
                      }}
                      onClick={() => handleTabChange("Points Table")}
                    >
                      Points Table
                    </div>
                    <div
                      className="p-2 items-center border-2 border-gray-700 text-xl cursor-pointer"
                      style={{
                        maxWidth: "350px",
                        maxHeight: "350px",
                        backgroundColor:
                          selectedTab === "Matches" ? "#a50044" : "",
                        color: selectedTab === "Matches" ? "#ffffff" : "",
                        fontWeight:
                          selectedTab === "Matches" ? "600" : "normal",
                      }}
                      onClick={() => handleTabChange("Matches")}
                    >
                      Matches
                    </div>
                  </div>
                  {selectedTab === "Points Table" ? (
                    <div>
                      <h5 className="text-xl font-semibold">
                        League Standings
                      </h5>
                      <br />
                      <div
                        className="rounded-md border-collapse border-2 border-gray-600"
                        style={{ width: "fit-content" }}
                      >
                        <table>
                          <thead className="border border-gray-600">
                            <tr>
                              <th className="border border-gray-600 p-4">
                                Ranking
                              </th>
                              <th className="border border-gray-600 p-4">
                                Club Name
                              </th>
                              <th className="border border-gray-600 p-4">
                                Logo
                              </th>
                              <th className="border border-gray-600 p-4">
                                Points
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedClubs.map((club, index) => (
                              <tr key={index}>
                                <td className="border border-gray-600 p-4">
                                  {index + 1}
                                </td>
                                <td className="border border-gray-600 p-4">
                                  {club.Club_Name}
                                </td>
                                <td className="border border-gray-600 p-2">
                                  <img
                                    src={club.Logo}
                                    style={{ height: "100px" }}
                                    alt={club.Club_Name}
                                  />
                                </td>
                                <td
                                  className="border border-gray-600 p-4"
                                  style={{
                                    backgroundColor:
                                      index === 0
                                        ? "#dbb34d" // Gold
                                        : index === 1
                                        ? "#8a8986" // Silver
                                        : index === 2
                                        ? "#cd7f32" // Bronze
                                        : "",
                                    fontWeight: index <= 2 ? "bold" : "normal",
                                  }}
                                >
                                  {calculatePoints(club.Club_ID)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <br />
                      <div
                        className="border-2 border-gray-500 p-5 rounded-xl"
                        style={{ width: "fit-content" }}
                      >
                        <p className="text-xl">
                          Your Club Finished at <b>{clubPositionMessage}</b>{" "}
                          position.
                        </p>
                      </div>
                      <br />
                      <br />
                      <br />
                      <br />
                    </div>
                  ) : (
                    <div
                      className="rounded-md border-2 border-gray-600"
                      style={{ width: "fit-content" }}
                    >
                      <table className="p-4 ">
                        <thead className="border-2 border-gray-600 p-4">
                          <tr className="border-2 border-gray-600 p-4">
                            <th className="border-2 border-gray-600 p-4 text-xl">
                              Home Club
                            </th>
                            <th className="border-2 border-gray-600 p-4 text-xl">
                              Away Club
                            </th>
                            <th className="border-2 border-gray-600 p-4 text-xl">
                              Prediction Result
                            </th>
                          </tr>
                        </thead>
                        <tbody className="border-2 border-gray-600 p-2">
                          {results.map((result, index) => (
                            <tr
                              className="border-2 border-gray-600 p-2"
                              key={index}
                            >
                              <td
                                className={`${
                                  result.homeClubID === params.homeClubID
                                    ? "bg-blue-800 text-white font-bold text-center px-6"
                                    : "border-2 border-gray-600 p-2 px-6"
                                }`}
                              >
                                {result.homeClub}
                              </td>
                              <td
                                className={`${
                                  result.awayClubID === params.homeClubID
                                    ? "bg-blue-800 text-white font-bold text-center px-6"
                                    : "border-2 border-gray-600 p-2 px-6"
                                }`}
                              >
                                {result.awayClub}
                              </td>
                              <td
                                className={`border-2 border-gray-600 p-2 px-6 text-center ${
                                  result.result === "Win"
                                    ? "bg-green-200"
                                    : result.result === "Lose"
                                    ? "bg-red-200"
                                    : ""
                                }`}
                              >
                                {result.result}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </center>
              </div>
              <br />
              <br />
              <br />
              <br />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EPL;
