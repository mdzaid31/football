"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import Message from "../../../../../../../components/message";
import LandingNavbar from "../../../../../../../components/landingnavbar";
import VerticalNavbar from "../../../../../../../components/verticalnavbar";
import axios from "axios";
import Chatbot from "../../../../../../../components/chatbot";
import { supabase } from "../../../../../../../../lib/supabase";


const Dashboard = ({ params }) => {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState("");
  const horizontalNavbarRef = useRef<HTMLDivElement>(null);
  const [signOutMessage, setSignOutMessage] = useState("");
  const [goalkeeper, setGoalkeeper] = useState("");
  const [defenders, setDefenders] = useState("");
  const [midfielders, setMidfielders] = useState("");
  const [attackers, setAttackers] = useState("");

  const [oppgoalkeeper, setOppGoalkeeper] = useState("");
  const [oppdefenders, setOppDefenders] = useState("");
  const [oppmidfielders, setOppMidfielders] = useState("");
  const [oppattackers, setOppAttackers] = useState("");

  const [formation, setFormation] = useState("");
  const [goalkeeperStats, setGoalkeeperStats] = useState({});
  const [defenderStats, setDefenderStats] = useState({});
  const [midfielderStats, setMidfielderStats] = useState({});
  const [attackerStats, setAttackerStats] = useState({});

  const [oppgoalkeeperStats, setOppGoalkeeperStats] = useState({});
  const [oppdefenderStats, setOppDefenderStats] = useState({});
  const [oppmidfielderStats, setOppMidfielderStats] = useState({});
  const [oppattackerStats, setOppAttackerStats] = useState({});

  const [homeLineup, setHomeLineup] = useState("");
  const [awayLineup, setAwayLineup] = useState("");

  const [showContainers, setShowContainers] = useState(true);
  const [showButtons, setShowButtons] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [homeClubID, setHomeClubID] = useState(null);
  const [awayClubID, setAwayClubID] = useState(null);

  const [saveChangesVisible, setSaveChangesVisible] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState("");

  useEffect(() => {
    const horizontalNavbarHeight =
      horizontalNavbarRef.current?.clientHeight || 0;
    document.documentElement.style.setProperty(
      "--horizontal-navbar-height",
      `${horizontalNavbarHeight}px`
    );
  }, []);

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

  const fetchUserData = async (clubID) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from("clubs")
        .select("*")
        .eq("Club_ID", clubID)
        .single();

      if (userError) {
        throw userError;
      }

      if (userData) {
        setGoalkeeper(userData.Goalkeeper);
        setDefenders(userData.Defenders);
        setMidfielders(userData.Midfielders);
        setAttackers(userData.Attackers);

        // Fetch goalkeeper stats
        const { data: goalkeeperStatsData, error: goalkeeperStatsError } =
          await supabase
            .from("goalkeeper_stats")
            .select("Card, Rating")
            .eq("ID", userData.Goalkeeper);

        if (goalkeeperStatsError) {
          throw goalkeeperStatsError;
        }

        if (goalkeeperStatsData && goalkeeperStatsData.length > 0) {
          const { Card, Rating } = goalkeeperStatsData[0];
          setGoalkeeperStats({ Card, Rating });
        }

        /* defenders*/

        const defenderIDs = userData.Defenders.split(",").map((id) =>
          id.trim()
        );

        const combinedDefenderStats = {};
        let totalDefenderRating = 0;

        for (const defenderID of defenderIDs) {
          const { data: defenderStatsData, error: defenderStatsError } =
            await supabase
              .from("player_stats")
              .select("Card, Rating, Name")
              .eq("ID", defenderID);

          if (defenderStatsError) {
            throw defenderStatsError;
          }

          const { Card, Rating } = defenderStatsData[0];
          combinedDefenderStats[defenderID] = { Card, Rating };
          totalDefenderRating += Rating;
        }

        setDefenderStats(combinedDefenderStats);

        /* midfielders*/
        const midfielderIDs = userData.Midfielders.split(",").map((id) =>
          id.trim()
        );

        const combinedMidfielderStats = {};
        let totalMidfielderRating = 0;

        for (const midfielderID of midfielderIDs) {
          const { data: midfielderStatsData, error: midfielderStatsError } =
            await supabase
              .from("player_stats")
              .select("Card, Rating, Name")
              .eq("ID", midfielderID);

          if (midfielderStatsError) {
            throw midfielderStatsError;
          }

          const { Card, Rating } = midfielderStatsData[0];
          combinedMidfielderStats[midfielderID] = { Card, Rating };
          totalMidfielderRating += Rating;
        }

        setMidfielderStats(combinedMidfielderStats);

        /* attackers*/
        const attackerIDs = userData.Attackers.split(",").map((id) =>
          id.trim()
        );

        const combinedattackerStats = {};
        let totalAttackerRating = 0;

        for (const attackerID of attackerIDs) {
          const { data: attackerStatsData, error: attackerStatsError } =
            await supabase
              .from("player_stats")
              .select("Card, Rating, Name")
              .eq("ID", attackerID);

          if (attackerStatsError) {
            throw attackerStatsError;
          }

          const { Card, Rating } = attackerStatsData[0];
          combinedattackerStats[attackerID] = { Card, Rating };
          totalAttackerRating += Rating;
        }

        setAttackerStats(combinedattackerStats);

        // Calculate home lineup rating
        const totalPlayerCount =
          defenderIDs.length + midfielderIDs.length + attackerIDs.length + 1; // +1 for goalkeeper
        const homeLineup =
          (totalDefenderRating +
            totalMidfielderRating +
            totalAttackerRating +
            goalkeeperStatsData[0].Rating) /
          totalPlayerCount;
        setHomeLineup(homeLineup);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const renderDefenderCards = () => {
    return defenders.split(",").map((defenderID, index) => {
      const defender = defenderStats[defenderID.trim()];
      return (
        <div
          key={index}
          className={`border-2 p-2`}
          style={{ borderRadius: "12px" }}
        >
          {defender?.Card && (
            <img
              src={defender.Card}
              alt={`defender ${index + 1}`}
              style={{
                height: "170px",
                transition: "transform 0.3s ease-in-out",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.2)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          )}
        </div>
      );
    });
  };

  const renderMidfielderCards = () => {
    return midfielders.split(",").map((midfielderID, index) => {
      const midfielder = midfielderStats[midfielderID.trim()];
      return (
        <div
          key={index}
          className={`border-2 p-2`}
          style={{ borderRadius: "12px" }}
        >
          {midfielder?.Card && (
            <img
              src={midfielder.Card}
              alt={`midfielder ${index + 1}`}
              style={{
                height: "170px",
                transition: "transform 0.3s ease-in-out",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.2)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          )}
        </div>
      );
    });
  };

  const renderAttackerCards = () => {
    return attackers.split(",").map((attackerID, index) => {
      const attacker = attackerStats[attackerID.trim()];
      return (
        <div
          key={index}
          className={`border-2 p-2`}
          style={{ borderRadius: "12px" }}
        >
          {attacker?.Card && (
            <img
              src={attacker.Card}
              alt={`attacker ${index + 1}`}
              style={{
                height: "170px",
                transition: "transform 0.3s ease-in-out",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.2)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          )}
        </div>
      );
    });
  };

  const renderGoalkeeperCard = () => {
    return (
      <div className={`border-2 p-2`} style={{ borderRadius: "12px" }}>
        <img
          src={`${goalkeeperStats.Card}`}
          alt=""
          style={{
            height: "170px",
            transition: "transform 0.3s ease-in-out",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>
    );
  };

  const fetchOppData = async (clubID) => {
    try {
      // Fetch opponent data
      const { data: userData, error: userError } = await supabase
        .from("clubs")
        .select("*")
        .eq("Club_ID", clubID)
        .single();

      if (userError) {
        throw userError;
      }

      if (userData) {
        // Set opponent player positions data
        setOppGoalkeeper(userData.Goalkeeper);
        setOppDefenders(userData.Defenders);
        setOppMidfielders(userData.Midfielders);
        setOppAttackers(userData.Attackers);

        // Fetch opponent goalkeeper stats
        const { data: goalkeeperStatsData, error: goalkeeperStatsError } =
          await supabase
            .from("goalkeeper_stats")
            .select("Card, Rating")
            .eq("ID", userData.Goalkeeper);

        if (goalkeeperStatsError) {
          throw goalkeeperStatsError;
        }

        if (goalkeeperStatsData && goalkeeperStatsData.length > 0) {
          const { Card, Rating } = goalkeeperStatsData[0];
          setOppGoalkeeperStats({ Card, Rating });
        }

        /* Calculate ratings for opponent defenders */
        const oppDefenderIDs = userData.Defenders.split(",").map((id) =>
          id.trim()
        );
        let totalOppDefenderRating = 0;

        for (const defenderID of oppDefenderIDs) {
          const { data: defenderStatsData, error: defenderStatsError } =
            await supabase
              .from("player_stats")
              .select("Card, Rating, Name")
              .eq("ID", defenderID);

          if (defenderStatsError) {
            throw defenderStatsError;
          }

          const { Card, Rating } = defenderStatsData[0];
          setOppDefenderStats((prevStats) => ({
            ...prevStats,
            [defenderID]: { Card, Rating },
          }));
          totalOppDefenderRating += Rating;
        }

        /* Calculate ratings for opponent midfielders */
        const oppMidfielderIDs = userData.Midfielders.split(",").map((id) =>
          id.trim()
        );
        let totalOppMidfielderRating = 0;

        for (const midfielderID of oppMidfielderIDs) {
          const { data: midfielderStatsData, error: midfielderStatsError } =
            await supabase
              .from("player_stats")
              .select("Card, Rating, Name")
              .eq("ID", midfielderID);

          if (midfielderStatsError) {
            throw midfielderStatsError;
          }

          const { Card, Rating } = midfielderStatsData[0];
          setOppMidfielderStats((prevStats) => ({
            ...prevStats,
            [midfielderID]: { Card, Rating },
          }));
          totalOppMidfielderRating += Rating;
        }

        /* Calculate ratings for opponent attackers */
        const oppAttackerIDs = userData.Attackers.split(",").map((id) =>
          id.trim()
        );
        let totalOppAttackerRating = 0;

        for (const attackerID of oppAttackerIDs) {
          const { data: attackerStatsData, error: attackerStatsError } =
            await supabase
              .from("player_stats")
              .select("Card, Rating, Name")
              .eq("ID", attackerID);

          if (attackerStatsError) {
            throw attackerStatsError;
          }

          const { Card, Rating } = attackerStatsData[0];
          setOppAttackerStats((prevStats) => ({
            ...prevStats,
            [attackerID]: { Card, Rating },
          }));
          totalOppAttackerRating += Rating;
        }

        // Calculate total opponent player count
        const totalOppPlayerCount =
          oppDefenderIDs.length +
          oppMidfielderIDs.length +
          oppAttackerIDs.length +
          1; // +1 for goalkeeper

        // Calculate average opponent lineup rating
        const awayLineupRating =
          (goalkeeperStatsData[0]?.Rating +
            totalOppDefenderRating +
            totalOppMidfielderRating +
            totalOppAttackerRating) /
          totalOppPlayerCount;
        setAwayLineup(awayLineupRating);
      }
    } catch (error) {
      console.error("Error fetching Opponents data:", error.message);
    }
  };

  const renderOppDefenderCards = () => {
    return oppdefenders.split(",").map((defenderID, index) => {
      const defender = oppdefenderStats[defenderID.trim()];
      return (
        <div
          key={index}
          className={`border-2 p-2`}
          style={{ borderRadius: "12px" }}
        >
          {defender?.Card && (
            <img
              src={defender.Card}
              alt={`opponent defender ${index + 1}`}
              style={{
                height: "170px",
                transition: "transform 0.3s ease-in-out",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.2)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          )}
        </div>
      );
    });
  };

  const renderOppMidfielderCards = () => {
    return oppmidfielders.split(",").map((midfielderID, index) => {
      const midfielder = oppmidfielderStats[midfielderID.trim()];
      return (
        <div
          key={index}
          className={`border-2 p-2`}
          style={{ borderRadius: "12px" }}
        >
          {midfielder?.Card && (
            <img
              src={midfielder.Card}
              alt={`opponent midfielder ${index + 1}`}
              style={{
                height: "170px",
                transition: "transform 0.3s ease-in-out",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.2)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          )}
        </div>
      );
    });
  };

  const renderOppAttackerCards = () => {
    return oppattackers.split(",").map((attackerID, index) => {
      const attacker = oppattackerStats[attackerID.trim()];
      return (
        <div
          key={index}
          className={`border-2 p-2`}
          style={{ borderRadius: "12px" }}
        >
          {attacker?.Card && (
            <img
              src={attacker.Card}
              alt={`opponent attacker ${index + 1}`}
              style={{
                height: "170px",
                transition: "transform 0.3s ease-in-out",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.2)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          )}
        </div>
      );
    });
  };

  const renderOppGoalkeeperCard = () => {
    return (
      <div className={`border-2 p-2`} style={{ borderRadius: "12px" }}>
        <img
          src={`${oppgoalkeeperStats.Card}`}
          style={{
            height: "170px",
            transition: "transform 0.3s ease-in-out",
          }}
          alt=""
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserData(params.homeClubID);
        await fetchOppData(params.awayClubID);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [params.user_ID, params.sUserID]);

  const handleBack = () => {
    router.push(
      `/landing/${params.user_ID}/predict/UCL/${homeClubID}/${awayClubID}`
    );
  };
  const handlePlayAgain = () => {
    router.push(`/landing/${params.user_ID}/predict/UCL`);
  };

  const makePrediction = async (homeLineup: string, awayLineup: string) => {
    try {
      setShowContainers(false);
      setShowButtons(false);
      setShowLoading(true);

      const response = await axios.post("http://127.0.0.1:5000/api/predict", {
        home_lineup: homeLineup,
        away_lineup: awayLineup,
      });
      console.log(response.data.result);
      setResult(response.data.result);

      setTimeout(() => {
        setShowLoading(false);
      }, 2500);
    } catch (error) {
      console.error("Prediction failed:", error);
    }
  };

  const handlePlayMatch = (e) => {
    console.log(homeLineup);
    console.log(awayLineup);
    e.preventDefault(); // Prevent default form submission behavior
    makePrediction(homeLineup, awayLineup);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, [result, params.user_ID, params.sUserID]);

  return (
    <>
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
        <div style={{ marginLeft: 200, marginTop: 70 }}>
          <div>
            {/* Loading gif */}
            {showLoading && (
              <>
                <center>
                  <div
                    style={{
                      height: "400px",
                    }}
                  >
                    <iframe
                      src="https://giphy.com/embed/gQAkGsCgCayYtnmigI"
                      width="100%"
                      height="100%"
                      className="giphy-embed"
                    ></iframe>
                  </div>
                </center>
              </>
            )}

            {/* WIN or LOSE message */}
            {result && !showLoading && (
              <div style={{ textAlign: "center" }}>
                {result === "Win" ? (
                  <>
                    <center>
                      <div
                        style={{
                          width: "70%",
                          height: "450px",
                        }}
                      >
                        <iframe
                          src="https://giphy.com/embed/dRcb3xrnZJQmPVnY2W"
                          width="100%"
                          height="100%"
                        ></iframe>
                      </div>
                    </center>
                    <div className="text-xl" style={{ marginTop: "7px" }}>
                      Congratulations you <b>WIN</b>
                    </div>
                    <div>
                      <button
                        className="w-full text-white py-2 rounded-md font-semibold"
                        style={{
                          backgroundColor: "#004d98",
                          transition: "background-color 0.3s ease",
                          width: "200px",
                          marginTop: "7px",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#002f5b")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#004d98")
                        }
                        onClick={handlePlayAgain}
                      >
                        Play Again
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <center>
                      <div
                        style={{
                          width: "70%",
                          height: "450px",
                        }}
                      >
                        <iframe
                          src="https://giphy.com/embed/obBRY85qHrHIOX7TsF"
                          width="100%"
                          height="100%"
                        ></iframe>
                      </div>
                    </center>
                    <div className="text-xl" style={{ marginTop: "7px" }}>
                      You <b>Lost</b>, Better Luck Next Time
                    </div>
                    <div>
                      <button
                        className="w-full text-white py-2 rounded-md font-semibold"
                        style={{
                          backgroundColor: "#004d98",
                          transition: "background-color 0.3s ease",
                          width: "200px",
                          marginTop: "7px",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#002f5b")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#004d98")
                        }
                        onClick={handlePlayAgain}
                      >
                        Play Again
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {showContainers && (
              <div
                className="grid grid-cols-2 p-1"
                style={{ gap: "15px", maxHeight: "820px" }}
              >
                <div>
                  <p className="text-xl font-semibold"> Your Team</p>
                  <div
                    className="border-2 border-gray-500 justify-between p-2"
                    style={{
                      width: "570px",
                      borderRadius: "12px",
                      maxHeight: "810px",
                    }}
                  >
                    {/*line up container*/}
                    <div
                      className="grid grid-rows-4"
                      style={{ maxHeight: "800px" }}
                    >
                      <center>
                        <div>
                          <div className="inline-flex gap-1">
                            {renderAttackerCards()}
                          </div>
                        </div>
                        <div>
                          <div className="inline-flex gap-1">
                            {renderMidfielderCards()}
                          </div>{" "}
                        </div>
                        <div>
                          <div className="inline-flex gap-1">
                            {renderDefenderCards()}
                          </div>
                        </div>
                        <div>
                          <div className="inline-flex">
                            {renderGoalkeeperCard()}
                          </div>
                        </div>
                      </center>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xl font-semibold"> Opponents Team</p>
                  <div
                    className="border-2 border-gray-500  justify-between p-2"
                    style={{
                      width: "570px",
                      borderRadius: "12px",
                      maxHeight: "810px",
                    }}
                  >
                    {/*away line up container*/}
                    <div
                      className="grid grid-rows-4"
                      style={{ maxHeight: "800px" }}
                    >
                      <center>
                        <div>
                          <div className="inline-flex gap-1">
                            {renderOppAttackerCards()}
                          </div>
                        </div>
                        <div>
                          <div className="inline-flex gap-1">
                            {renderOppMidfielderCards()}
                          </div>{" "}
                        </div>
                        <div>
                          <div className="inline-flex gap-1">
                            {renderOppDefenderCards()}
                          </div>
                        </div>
                        <div>
                          <div className="inline-flex">
                            {renderOppGoalkeeperCard()}
                          </div>
                        </div>
                      </center>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <br />
          {showButtons && (
            <div>
              <center>
                <div className=" inline-flex gap-6 p-3 items-center">
                  <div>
                    <button
                      className="w-full text-white py-3 rounded-md font-semibold"
                      style={{
                        backgroundColor: "#004d98",
                        transition: "background-color 0.3s ease",
                        width: "200px",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#002f5b")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#004d98")
                      }
                      onClick={handleBack}
                    >
                      Go Back
                    </button>
                  </div>
                  <div>
                    <button
                      className="w-full text-white py-3 rounded-md font-semibold"
                      style={{
                        backgroundColor: "#004d98",
                        transition: "background-color 0.3s ease",
                        width: "200px",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#002f5b")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#004d98")
                      }
                      onClick={handlePlayMatch}
                    >
                      Play Match
                    </button>
                  </div>
                </div>
              </center>
            </div>
          )}
          <br />
        </div>
      </div>
      <br />
      <br />
    </>
  );
};

export default Dashboard;
