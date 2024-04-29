"use client";
import React, { useEffect, useState } from "react";
import Message from "../../../../../components/message";
import LandingNavbar from "../../../../../components/landingnavbar";
import VerticalNavbar from "../../../../../components/verticalnavbar";
import { useRouter } from "next/navigation";
import Chatbot from "../../../../../components/chatbot";
import { supabase } from "../../../../../../lib/supabase";

const Laliga = ({ params }) => {
  const [profilePicture, setProfilePicture] = useState("");
  const [userName, setUserName] = useState("");
  const [signOutMessage, setSignOutMessage] = useState("");
  const [clubs, setClubs] = useState([]);
  const [homeClubID, setHomeClubID] = useState(null);
  const [awayClubID, setAwayClubID] = useState(null);
  const [otherClubs, setOtherClubs] = useState([]);
  const [goalkeeper, setGoalkeeper] = useState("");
  const [defenders, setDefenders] = useState("");
  const [midfielders, setMidfielders] = useState("");
  const [attackers, setAttackers] = useState("");
  const [formation, setFormation] = useState("");
  const [goalkeeperStats, setGoalkeeperStats] = useState({});
  const [defenderStats, setDefenderStats] = useState({});
  const [midfielderStats, setMidfielderStats] = useState({});
  const [attackerStats, setAttackerStats] = useState({});
  const [type, setType] = useState({});
  const [editMode, setEditMode] = useState(false);

  const [selectedFormation, setSelectedFormation] = useState("");
  const [playerSelectorCards, setPlayerSelectorCards] = useState([]);
  const [selectedDefenderIndex, setSelectedDefenderIndex] = useState(null);
  const [selectedMidfielderIndex, setSelectedMidfielderIndex] = useState(null);
  const [selectedAttackerIndex, setSelectedAttackerIndex] = useState(null);

  const [saveChangesVisible, setSaveChangesVisible] = useState(false);



  const router = useRouter();
  useEffect(() => {
    fetchUserData(params.user_ID);

    fetchClubData(params.homeClubID);
  }, [params.user_ID, homeClubID]);

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

  useEffect(() => {
    setHomeClubID(params.homeClubID);
    setAwayClubID(params.awayClubID);
  }, []); // Empty dependency array to run the effect only once

  const fetchClubData = async (clubID) => {
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
        setProfilePicture(userData.Pfp);
        setGoalkeeper(userData.Goalkeeper);
        setDefenders(userData.Defenders);
        setMidfielders(userData.Midfielders);
        setAttackers(userData.Attackers);

        const { data: goalkeeperStatsData, error: goalkeeperStatsError } =
          await supabase
            .from("goalkeeper_stats")
            .select("Card")
            .eq("ID", userData.Goalkeeper);

        if (goalkeeperStatsError) {
          throw goalkeeperStatsError;
        }

        if (goalkeeperStatsData && goalkeeperStatsData.length > 0) {
          const { Card } = goalkeeperStatsData[0];
          setGoalkeeperStats({ Card });
        }

        /* defenders*/

        const defenderIDs = userData.Defenders.split(",").map((id) =>
          id.trim()
        );

        const combinedDefenderStats = {};

        for (const defenderID of defenderIDs) {
          const { data: defenderStatsData, error: defenderStatsError } =
            await supabase
              .from("player_stats")
              .select("Card, Rating, Name")
              .eq("ID", defenderID);

          if (defenderStatsError) {
            throw defenderStatsError;
          }
          combinedDefenderStats[defenderID] = defenderStatsData[0];
        }

        setDefenderStats(combinedDefenderStats);

        /* midfielders*/
        const midfielderIDs = userData.Midfielders.split(",").map((id) =>
          id.trim()
        );

        const combinedMidfielderStats = {};

        for (const midfielderID of midfielderIDs) {
          const { data: midfielderStatsData, error: midfielderStatsError } =
            await supabase
              .from("player_stats")
              .select("Card, Rating, Name")
              .eq("ID", midfielderID);

          if (midfielderStatsError) {
            throw midfielderStatsError;
          }

          combinedMidfielderStats[midfielderID] = midfielderStatsData[0];
        }

        setMidfielderStats(combinedMidfielderStats);

        /* attackers*/
        const attackerIDs = userData.Attackers.split(",").map((id) =>
          id.trim()
        );

        const combinedattackerStats = {};

        for (const attackerID of attackerIDs) {
          const { data: attackerStatsData, error: attackerStatsError } =
            await supabase
              .from("player_stats")
              .select("Card, Rating, Name")
              .eq("ID", attackerID);

          if (attackerStatsError) {
            throw attackerStatsError;
          }

          console.log("attacker Stats Data:", attackerStatsData);

          combinedattackerStats[attackerID] = attackerStatsData[0];
        }

        setAttackerStats(combinedattackerStats);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setSaveChangesVisible(!editMode); // Show save changes button when entering edit mode
  };

  // Function to handle saving changes
  const handleSaveChanges = () => {
    // Logic to save changes
    setEditMode(false); // Exit edit mode after saving changes
    setSaveChangesVisible(false); // Hide save changes button
    window.location.reload();
  };

  const renderDefenderCards = () => {
    return defenders.split(",").map((defenderID, index) => {
      const defender = defenderStats[defenderID.trim()];
      return (
        <div
          key={index}
          className={`border-2 p-2 ${editMode ? "cursor-pointer" : ""}`}
          style={{ borderRadius: "12px" }}
          onClick={editMode ? () => handleDefenderCardClick(index) : undefined}
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

  const handleDefenderCardClick = async (index) => {
    setSelectedDefenderIndex(index);
    try {
      const selectedDefenderID = defenders.split(",")[index].trim();
      const { data: defenderStatsData, error: defenderStatsError } =
        await supabase
          .from("player_stats")
          .select("Card, Type, ID")
          .eq("Type", "defender")
          .eq("Club_ID", homeClubID)
          // Filter rows where Club_ID falls in the provided list
          .order("ID", { ascending: true });

      if (defenderStatsError) {
        throw defenderStatsError;
      }

      const defenderData = defenderStatsData.map((defender) => ({
        Card: defender.Card,
        Type: defender.Type,
        ID: defender.ID,
      }));
      setPlayerSelectorCards(defenderData);
      setType(defenderData[0].Type);
      console.log(type);
    } catch (error) {
      console.error("Error fetching defender stats:", error.message);
    }
  };

  const renderDefenderSelectorCards = () => {
    return playerSelectorCards.map((player, index) => (
      <div
        key={index}
        className="p-1"
        style={{ width: "calc(100% / 3)", boxSizing: "border-box" }}
        onClick={() => handleDefenderSelectorClick(player)}
      >
        <center>
          <img
            src={player.Card}
            alt={`player ${index + 1}`}
            style={{
              height: "190px",
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </center>
      </div>
    ));
  };

  const handleDefenderSelectorClick = async (player) => {
    try {
      const updatedDefenders = [...defenders.split(",")];
      updatedDefenders[selectedDefenderIndex] = player.ID;
      const newDefenders = updatedDefenders.join(",");

      // Update user data in the users table
      const { error } = await supabase
        .from("clubs")
        .update({
          Defenders: newDefenders,
        })
        .eq("Club_ID", homeClubID);

      if (error) {
        throw error;
      } else {
        console.log("Player replaced successfully.");
        // Update the state with the new defenders
        setDefenders(newDefenders);
        console.log("Updated Defenders:", newDefenders);
      }
    } catch (error) {
      console.error("Error updating user data:", error.message);
    }
  };

  const renderMidfielderCards = () => {
    return midfielders.split(",").map((midfielderID, index) => {
      const midfielder = midfielderStats[midfielderID.trim()];
      return (
        <div
          key={index}
          className={`border-2 p-2 ${editMode ? "cursor-pointer" : ""}`}
          onClick={
            editMode ? () => handleMidfielderCardClick(index) : undefined
          }
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

  const handleMidfielderCardClick = async (index) => {
    setSelectedMidfielderIndex(index);
    try {
      const selectedMidfielderID = midfielders.split(",")[index].trim();
      const { data: midfielderStatsData, error: midfielderStatsError } =
        await supabase
          .from("player_stats")
          .select("Card, Type, ID")
          .eq("Type", "midfielder")
          .eq("Club_ID", homeClubID)
          .order("ID", { ascending: true });

      if (midfielderStatsError) {
        throw midfielderStatsError;
      }

      const midfielderData = midfielderStatsData.map((midfielder) => ({
        Card: midfielder.Card,
        Type: midfielder.Type,
        ID: midfielder.ID,
      }));
      setPlayerSelectorCards(midfielderData);
      setType(midfielderData[0]?.Type);
      console.log(type);
    } catch (error) {
      console.error("Error fetching midfielder stats:", error.message);
    }
  };

  const renderMidfielderSelectorCards = () => {
    return playerSelectorCards.map((player, index) => (
      <div
        key={index}
        className="p-2"
        style={{ width: "calc(100% / 3)", boxSizing: "border-box" }}
        onClick={() => handleMidfielderSelectorClick(player)}
      >
        <center>
          <img
            src={player.Card}
            alt={`player ${index + 1}`}
            style={{
              height: "210px",
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </center>
      </div>
    ));
  };

  const handleMidfielderSelectorClick = async (player) => {
    try {
      const updatedMidfielders = [...midfielders.split(",")];
      updatedMidfielders[selectedMidfielderIndex] = player.ID;
      const newMidfielders = updatedMidfielders.join(",");

      // Update user data in the users table
      const { error } = await supabase
        .from("clubs")
        .update({
          Midfielders: newMidfielders,
        })
        .eq("Club_ID", homeClubID);

      if (error) {
        throw error;
      } else {
        console.log("Player replaced successfully.");
        // Update the state with the new midfielders
        setMidfielders(newMidfielders);
        console.log("Updated Midfielders:", newMidfielders);
      }
    } catch (error) {
      console.error("Error updating user data:", error.message);
    }
  };

  const renderAttackerCards = () => {
    return attackers.split(",").map((attackerID, index) => {
      const attacker = attackerStats[attackerID.trim()];
      return (
        <div
          key={index}
          className={`border-2 p-2 ${editMode ? "cursor-pointer" : ""}`}
          onClick={editMode ? () => handleAttackerCardClick(index) : undefined}
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

  const handleAttackerCardClick = async (index) => {
    setSelectedAttackerIndex(index);
    try {
      const { data: attackerStatsData, error: attackerStatsError } =
        await supabase
          .from("player_stats")
          .select("Card, Type, ID")
          .eq("Type", "forward")
          .eq("Club_ID", homeClubID)
          .order("ID", { ascending: true });

      if (attackerStatsError) {
        throw attackerStatsError;
      }

      const attackerData = attackerStatsData.map((attacker) => ({
        Card: attacker.Card,
        Type: attacker.Type,
        ID: attacker.ID,
      }));
      setPlayerSelectorCards(attackerData);
      setType(attackerData[0]?.Type);
      console.log(type);
    } catch (error) {
      console.error("Error fetching attacker stats:", error.message);
    }
  };

  const renderAttackerSelectorCards = () => {
    return playerSelectorCards.map((player, index) => (
      <div
        key={index}
        className=""
        style={{
          width: "calc(100% / 3)",

          boxSizing: "border-box",
        }}
        onClick={() => handleAttackerSelectorClick(player)}
      >
        <center>
          <img
            src={player.Card}
            alt={`player ${index + 1}`}
            style={{
              height: "200px",
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </center>
      </div>
    ));
  };

  const handleAttackerSelectorClick = async (player) => {
    try {
      const updatedAttackers = [...attackers.split(",")];
      updatedAttackers[selectedAttackerIndex] = player.ID;
      const newAttackers = updatedAttackers.join(",");

      // Update user data in the users table
      const { error } = await supabase
        .from("clubs")
        .update({
          Attackers: newAttackers,
        })
        .eq("Club_ID", homeClubID);

      if (error) {
        throw error;
      } else {
        console.log("Player replaced successfully.");
        // Update the state with the new attackers
        setAttackers(newAttackers);
        console.log("Updated Attackers:", newAttackers);
      }
    } catch (error) {
      console.error("Error updating user data:", error.message);
    }
  };
  const renderGoalkeeperCard = () => {
    return (
      <div
        className={`border-2 p-2 ${editMode ? "cursor-pointer" : ""}`}
        onClick={editMode ? handleGoalkeeperCardClick : undefined}
      >
        <img
          src={`${goalkeeperStats.Card}`}
          alt="Goalkeeper"
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

  const handleGoalkeeperCardClick = async () => {
    try {
      const { data: goalkeeperStatsData, error: goalkeeperStatsError } =
        await supabase
          .from("goalkeeper_stats")
          .select("Card, ID")
          .eq("Club_ID", homeClubID) // Filter rows where Club_ID falls in the provided list
          .order("ID", { ascending: true });

      if (goalkeeperStatsError) {
        throw goalkeeperStatsError;
      }

      const goalkeeperData = goalkeeperStatsData.map((goalkeeper) => ({
        Card: goalkeeper.Card,
        ID: goalkeeper.ID,
      }));
      setPlayerSelectorCards(goalkeeperData);
      setType("goalkeeper");
      console.log(type);
    } catch (error) {
      console.error("Error fetching goalkeeper stats:", error.message);
    }
  };

  const renderGoalkeeperSelectorCards = () => {
    return playerSelectorCards.map((player, index) => (
      <div
        key={index}
        className=""
        style={{ width: "calc(100% / 3)", boxSizing: "border-box" }}
        onClick={() => handleGoalkeeperSelectorClick(player)}
      >
        <center>
          <img
            src={player.Card}
            alt={`player ${index + 1}`}
            style={{
              height: "210px",
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </center>
      </div>
    ));
  };

  const handleGoalkeeperSelectorClick = async (player) => {
    try {
      // No need to split goalkeeper, as it's a single ID
      const newGoalkeeper = player.ID;

      // Update user data in the users table
      const { error } = await supabase
        .from("clubs")
        .update({
          Goalkeeper: newGoalkeeper,
        })
        .eq("Club_ID", homeClubID);

      if (error) {
        throw error;
      } else {
        console.log("Player replaced successfully.");
        // Update the state with the new goalkeeper
        setGoalkeeper(newGoalkeeper);
        console.log("Updated Goalkeeper:", newGoalkeeper);
      }
    } catch (error) {
      console.error("Error updating user data:", error.message);
    }
  };

  const handleFormationSelect = async (formation) => {
    setSelectedFormation(formation);
    try {
      let defenders = "";
      let midfielders = "";
      let attackers = "";

      if (formation === "4-4-2") {
        defenders = "0,0,0,0";
        midfielders = "0,0,0,0";
        attackers = "0,0";
      } else if (formation === "4-3-3") {
        defenders = "0,0,0,0";
        midfielders = "0,0,0";
        attackers = "0,0,0";
      } else if (formation === "3-4-3") {
        defenders = "0,0,0";
        midfielders = "0,0,0,0";
        attackers = "0,0,0";
      }

      // Update user data in the users table
      const { error } = await supabase
        .from("clubs")
        .update({
          Defenders: defenders,
          Midfielders: midfielders,
          Attackers: attackers,
        })
        .eq("Club_ID", params.homeClubID);

      if (error) {
        throw error;
      } else {
        console.log("Formation and player positions updated successfully.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating user data:", error.message);
    }
  };
  const handleBack = () => {
    router.push(`/landing/${params.user_ID}/predict/Laliga`);
  };

  const handlePlayNow = () => {
    router.push(
      `/landing/${params.user_ID}/predict/Laliga/${params.homeClubID}/match`
    );
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
      <LandingNavbar user_ID={params.user_ID} handleSignOut={handleSignOut} />
      <div style={{ marginTop: "var(--horizontal-navbar-height, 0)" }}>
        <VerticalNavbar user_ID={params.user_ID} />
        <div style={{ marginLeft: 210, marginTop: 70 }}>
          <center>
            <div>
              {!editMode && (
                <div className="grid grid-cols-2">
                  <center>
                    <button
                      className="text-white p-3 rounded-md font-semibold"
                      style={{
                        backgroundColor: "#004d98",
                        transition: "background-color 0.3s ease",
                        marginLeft: "15px",
                        marginBottom: "10px",
                        width: "155px",
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
                    <button
                      className="text-white p-3 rounded-md font-semibold"
                      style={{
                        backgroundColor: "#004d98",
                        transition: "background-color 0.3s ease",
                        marginLeft: "15px",
                        marginBottom: "10px",
                        width: "155px",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#002f5b")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#004d98")
                      }
                      onClick={toggleEditMode}
                    >
                      Edit Team
                    </button>
                  </center>
                </div>
              )}
              <div>
                {editMode && (
                  <>
                    <div
                      className="border-2 border-gray-500"
                      style={{ width: "1125px", borderRadius: "12px" }} // Increased width
                    >
                      <p className="p-3 font-semibold text-xl">
                        Select Formation
                      </p>
                      <div className="grid grid-cols-3 gap-3 p-1">
                        <button
                          className="flex flex-col items-center"
                          style={{ width: "100%" }}
                          onClick={() => handleFormationSelect("4-4-2")}
                        >
                          <img
                            src="https://i.postimg.cc/y6S4JdrC/442.png"
                            alt="4-4-2"
                            height="180px"
                            width="180px" // Fixed width
                            style={{
                              transition: "transform 0.3s ease-in-out",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform = "scale(1.03)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform = "scale(1)")
                            }
                          />
                          <div className="font-semibold text-center mt-2">
                            4-4-2
                          </div>
                        </button>
                        <button
                          className="flex flex-col items-center"
                          style={{ width: "100%" }}
                          onClick={() => handleFormationSelect("4-3-3")}
                        >
                          <img
                            src="https://i.postimg.cc/pLCgNnyz/433.png"
                            alt="4-3-3"
                            height="180px"
                            width="180px" // Fixed width
                            style={{
                              transition: "transform 0.3s ease-in-out",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform = "scale(1.03)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform = "scale(1)")
                            }
                          />
                          <div className="font-semibold text-center mt-2">
                            4-3-3
                          </div>
                        </button>
                        <button
                          className="flex flex-col items-center"
                          style={{ width: "100%" }}
                          onClick={() => handleFormationSelect("3-4-3")}
                        >
                          <img
                            src="https://i.postimg.cc/Dyq9gNTC/343.png"
                            alt="3-4-3"
                            height="180px"
                            width="180px" // Fixed width
                            style={{
                              transition: "transform 0.3s ease-in-out",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform = "scale(1.03)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform = "scale(1)")
                            }
                          />
                          <div className="font-semibold text-center mt-2">
                            3-4-3
                          </div>
                        </button>
                      </div>
                    </div>
                    <br />
                  </>
                )}
                <div
                  className="grid grid-cols-2 p-1"
                  style={{
                    gap: "15px",
                    maxHeight: "970px",
                    overflowY: "auto",
                  }}
                >
                  <div
                    className="p-3 border-2 border-gray-500 flex flex-col justify-between"
                    style={{ width: "600px", borderRadius: "12px" }}
                  >
                    {/*line up container*/}
                    <div className="grid grid-rows-4">
                      <div>
                        <div className="font-semibold">Attackers:</div>
                        <center>
                          <div className="inline-flex gap-2">
                            {renderAttackerCards()}
                          </div>
                        </center>
                      </div>
                      <div>
                        <div className="font-semibold">Midfielders:</div>
                        <center>
                          <div className="inline-flex gap-2">
                            {renderMidfielderCards()}
                          </div>{" "}
                        </center>{" "}
                      </div>
                      <div>
                        {" "}
                        <div className="font-semibold">Defenders:</div>{" "}
                        <center>
                          <div className="inline-flex gap-2">
                            {renderDefenderCards()}
                          </div>
                        </center>
                      </div>
                      <div>
                        <div className="font-semibold">Goalkeeper:</div>
                        <center>
                          <div className="inline-flex">
                            {renderGoalkeeperCard()}
                          </div>
                        </center>
                      </div>
                    </div>
                    <div className="text-right text-gray-600 text-xs">
                      {" "}
                      Note: Click on Save changes to make the changes visible
                    </div>
                  </div>
                  {/* player selector*/}
                  {editMode && (
                    <div
                      className="border-2 border-gray-500"
                      style={{
                        borderRadius: "12px",
                        width: "480px",
                        marginLeft: "55px",
                        overflowY: "auto", // Add overflow-y auto
                        maxHeight: "850px",
                      }}
                    >
                      <div
                        style={{
                          height: "650px",
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                        }}
                      >
                        {type === "defender" && renderDefenderSelectorCards()}
                        {type === "midfielder" &&
                          renderMidfielderSelectorCards()}
                        {type === "forward" && renderAttackerSelectorCards()}
                        {type === "goalkeeper" &&
                          renderGoalkeeperSelectorCards()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <br />
              <center>
                <div style={{ marginBottom: "20px" }}>
                  {/* Save Changes Button */}
                  {editMode && (
                    <button
                      className="text-white p-3 rounded-md font-semibold"
                      style={{
                        backgroundColor: "#004d98",
                        transition: "background-color 0.3s ease",
                        width: "155px",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#002f5b")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#004d98")
                      }
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </center>
            </div>
          </center>
          <center>
            <div style={{ marginBottom: "20px" }}>
              {!editMode && ( // Conditionally render the "Play Now" button
                <button
                  className="text-white p-3 rounded-md font-semibold"
                  style={{
                    backgroundColor: "#004d98",
                    transition: "background-color 0.3s ease",
                    marginLeft: "15px",
                    marginBottom: "10px",
                    width: "155px",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#002f5b")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#004d98")
                  }
                  onClick={handlePlayNow}
                >
                  Play Now
                </button>
              )}
            </div>
          </center>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};
export default Laliga;
