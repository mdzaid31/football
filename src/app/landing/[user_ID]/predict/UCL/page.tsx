"use client";
import React, { useEffect, useState } from "react";
import Message from "../../../../components/message";
import LandingNavbar from "../../../../components/landingnavbar";
import VerticalNavbar from "../../../../components/verticalnavbar";
import { useRouter } from "next/navigation";
import Chatbot from "../../../../components/chatbot";
import { supabase } from "../../../../../lib/supabase";
const UCL = ({ params }) => {
  const [profilePicture, setProfilePicture] = useState("");
  const [userName, setUserName] = useState("");
  const [signOutMessage, setSignOutMessage] = useState("");
  const [clubs, setClubs] = useState([]);
  const [homeClubID, setHomeClubID] = useState(null);
  const [awayClubID, setAwayClubID] = useState(null);
  const [otherClubs, setOtherClubs] = useState([]);
  const [homeClubName, setHomeClubName] = useState(null);
  const [awayClubName, setAwayClubName] = useState(null);
  const [saveChangesVisible, setSaveChangesVisible] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState("");
  const router = useRouter();
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
        .select("Club_ID, Club_Name, Logo")
        .order("Club_ID");

      if (error) {
        throw error;
      }

      if (data) {
        setClubs(data);
      }
    } catch (error) {
      console.error("Error fetching clubs data:", error.message);
    }
  };

  const handleClubClick = async (clubID, isHomeClub = false) => {
    try {
      const { data, error } = await supabase
        .from("clubs")
        .select("Club_Name")
        .eq("Club_ID", clubID)
        .single();

      if (error) {
        throw error;
      }

      if (isHomeClub) {
        setHomeClubID(clubID);
        setHomeClubName(data.Club_Name);
      } else {
        setAwayClubID(clubID);
        setAwayClubName(data.Club_Name);
        setOtherClubs([]);
        // Redirect to new page when away team is selected
        router.push(
          `/landing/${params.user_ID}/predict/UCL/${homeClubID}/${clubID}`
        );
      }
    } catch (error) {
      console.error("Error fetching club name:", error.message);
    }
  };

  useEffect(() => {
    if (homeClubID) {
      // Filter other clubs excluding the home club
      const filteredClubs = clubs.filter((club) => club.Club_ID !== homeClubID);
      setOtherClubs(filteredClubs);
    }
  }, [homeClubID]);

  const handleBack = () => {
    router.push(`/landing/${params.user_ID}/predict`);
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
          <button
            className="text-white p-3 rounded-md font-semibold"
            style={{
              backgroundColor: "#004d98",
              transition: "background-color 0.3s ease",
              marginLeft: "15px",
              marginBottom: "10px",
              width: "155px",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#002f5b")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#004d98")}
            onClick={handleBack}
          >
            Go Back
          </button>
          <center>
            {homeClubID ? (
              <div style={{ alignItems: "center" }}>
                <p>
                  Your Club : {homeClubName}
                  <br />
                  {awayClubID && <div>Away Club : {awayClubName}</div>}
                </p>
              </div>
            ) : (
              <div
                className="border-2 border-grey-600 p-3 "
                style={{
                  borderRadius: "12px",
                  width: "1100px",
                }}
              >
                <div
                  className="text-xl font-semibold"
                  style={{ textAlign: "left" }}
                >
                  Select Your Team
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {clubs.map((club) => (
                    <div
                      key={club.Club_ID}
                      className="border-2 border-grey-600 p-3"
                      style={{ borderRadius: "12px", cursor: "pointer" }}
                      onClick={() => handleClubClick(club.Club_ID, true)}
                    >
                      <img
                        src={club.Logo}
                        style={{ height: "110px" }}
                        alt={club.Club_Name}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "scale(1.2)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      />
                      <span>{club.Club_Name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </center>
          {homeClubID && !awayClubID && (
            <div style={{ marginTop: "20px" }}>
              <center>
                <div
                  className="border-2 border-grey-600 p-3 "
                  style={{
                    borderRadius: "12px",
                    width: "1100px",
                  }}
                >
                  <div
                    className="text-xl font-semibold"
                    style={{ textAlign: "left" }}
                  >
                    Select Opponent's Team
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {otherClubs.map((club) => (
                      <div
                        key={club.Club_ID}
                        className="border-2 border-grey-600 p-3"
                        style={{ borderRadius: "12px", cursor: "pointer" }}
                        onClick={() => handleClubClick(club.Club_ID)}
                      >
                        <img
                          src={club.Logo}
                          style={{ height: "110px" }}
                          alt={club.Club_Name}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.2)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                        <span>{club.Club_Name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </center>
            </div>
          )}
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};
export default UCL;
