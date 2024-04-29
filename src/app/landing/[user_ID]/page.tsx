"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import Message from "../../components/message";
import LandingNavbar from "../../components/landingnavbar";
import VerticalNavbar from "../../components/verticalnavbar";
import Chatbot from "../../components/chatbot";
import { supabase } from "../../../lib/supabase";


interface Dashboard1Props {
  user_ID: string;
}

const Dashboard1: React.FC<Dashboard1Props> = ({ user_ID }) => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const router = useRouter();
  const [signOutMessage, setSignOutMessage] = useState<string>("");

  const handleHover = (newIconSrc: string) => {
    setHoveredIcon(newIconSrc);
  };

  const handleMouseLeave = () => {
    setHoveredIcon(null);
  };

  const handleCardClick = (cardName: string) => {
    router.push(`/landing/${user_ID}/${cardName.toLowerCase()}`);
  };


  return (
    <div className="p-3 items-center">
    {/* Sign-out message */}
    {signOutMessage && (
      <div className="bg-green-500 text-white py-2 px-4 mb-4">
        {signOutMessage}
      </div>
    )}
    {/* First row */}
    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Kick Off card */}
        <div
          className="flex flex-col justify-between p-6 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105 items-center"
          style={{
            cursor: "pointer",
            backgroundColor:
              hoveredIcon === "../kickoffWhite.svg" ? "#a50044" : "#FFFFFF",
          }}
          onMouseEnter={() => handleHover("../kickoffWhite.svg")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleCardClick("KickOff")}
        >
          <div className="flex items-center justify-center mb-4">
            <img
              src={
                hoveredIcon === "../kickoffWhite.svg"
                  ? "../kickoffWhite.svg"
                  : "../kickoff.svg"
              }
              width="70"
              alt="Kick Off"
            />
          </div>
          <span
            className="ml-2 text-2xl font-bold tracking-tight text-gray-900"
            style={{
              color:
                hoveredIcon === "../kickoffWhite.svg" ? "#FFFFFF" : "#000000",
            }}
          >
            Kick Off
          </span>
        </div>
        {/* Predict card */}
        <div
          className="flex flex-col justify-between p-6 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105 items-center"
          style={{
            cursor: "pointer",
            backgroundColor:
              hoveredIcon === "../predictWhite.svg" ? "#a50044" : "#FFFFFF",
          }}
          onMouseEnter={() => handleHover("../predictWhite.svg")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleCardClick("Predict")}
        >
          <div className="flex items-center justify-center mb-4">
            <img
              src={
                hoveredIcon === "../predictWhite.svg"
                  ? "../predictWhite.svg"
                  : "../predict.svg"
              }
              width="70"
              alt="Predict"
            />
          </div>
          <span
            className="ml-2 text-2xl font-bold tracking-tight text-gray-900"
            style={{
              color:
                hoveredIcon === "../predictWhite.svg" ? "#FFFFFF" : "#000000",
            }}
          >
            Predict
          </span>
        </div>
        {/* Leaderboard card */}
        <div
          className="flex flex-col justify-between p-6 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105 items-center"
          style={{
            cursor: "pointer",
            backgroundColor:
              hoveredIcon === "../leaderboardWhite.svg" ? "#a50044" : "#FFFFFF",
          }}
          onMouseEnter={() => handleHover("../leaderboardWhite.svg")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleCardClick("Leaderboard")}
        >
          <div className="flex items-center justify-center mb-4">
            <img
              src={
                hoveredIcon === "../leaderboardWhite.svg"
                  ? "../leaderboardWhite.svg"
                  : "../leaderboard.svg"
              }
              width="70"
              alt="Leaderboard"
            />
          </div>
          <span
            className="ml-2 text-2xl font-bold tracking-tight text-gray-900"
            style={{
              color:
                hoveredIcon === "../leaderboardWhite.svg"
                  ? "#FFFFFF"
                  : "#000000",
            }}
          >
            Leaderboard
          </span>
        </div>
      </div>
      {/* Second row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mt-4">
        {/* Players card */}
        <div
          className="flex flex-col justify-between p-6 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105 items-center"
          style={{
            cursor: "pointer",
            backgroundColor:
              hoveredIcon === "../playersWhite.svg" ? "#a50044" : "#FFFFFF",
          }}
          onMouseEnter={() => handleHover("../playersWhite.svg")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleCardClick("Players")}
        >
          <div className="flex items-center justify-center mb-4">
            <img
              src={
                hoveredIcon === "../playersWhite.svg"
                  ? "../playersWhite.svg"
                  : "../players.svg"
              }
              width="70"
              alt="Players"
            />
          </div>
          <span
            className="ml-2 text-2xl font-bold tracking-tight text-gray-900"
            style={{
              color:
                hoveredIcon === "../playersWhite.svg" ? "#FFFFFF" : "#000000",
            }}
          >
            Players
          </span>
        </div>
        {/* Compare card */}
        <div
          className="flex flex-col justify-between p-6 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105 items-center"
          style={{
            cursor: "pointer",
            backgroundColor:
              hoveredIcon === "../compareWhite.svg" ? "#a50044" : "#FFFFFF",
          }}
          onMouseEnter={() => handleHover("../compareWhite.svg")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleCardClick("Compare")}
        >
          <div className="flex items-center justify-center mb-4">
            <img
              src={
                hoveredIcon === "../compareWhite.svg"
                  ? "../compareWhite.svg"
                  : "../compare.svg"
              }
              width="70"
              alt="Compare"
            />
          </div>
          <span
            className="ml-2 text-2xl font-bold tracking-tight text-gray-900"
            style={{
              color:
                hoveredIcon === "../compareWhite.svg" ? "#FFFFFF" : "#000000",
            }}
          >
            Compare
          </span>
        </div>
        {/* Add an empty div to maintain grid layout */}
       
      </div>
      {/* Third row */}
   
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mt-4">
          {/* Clubs card */}
          <div
            className="flex flex-col justify-between p-6 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105 items-center"
            style={{
              cursor: "pointer",
              backgroundColor:
                hoveredIcon === "../clubsWhite.svg" ? "#a50044" : "#FFFFFF",
            }}
            onMouseEnter={() => handleHover("../clubsWhite.svg")}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleCardClick("Clubs")}
          >
            <img
              src={
                hoveredIcon === "../clubsWhite.svg"
                  ? "../clubsWhite.svg"
                  : "../clubs.svg"
              }
              width="70"
              alt="Clubs"
            />
            <span
              className="ml-2 text-2xl font-bold tracking-tight text-gray-900"
              style={{
                color:
                  hoveredIcon === "../clubsWhite.svg" ? "#FFFFFF" : "#000000",
              }}
            >
              Clubs
            </span>
          </div>
          {/* Scout card */}
          <div
            className="flex flex-col justify-between p-6 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105 items-center"
            style={{
              cursor: "pointer",
              backgroundColor:
                hoveredIcon === "../scoutWhite.svg" ? "#a50044" : "#FFFFFF",
            }}
            onMouseEnter={() => handleHover("../scoutWhite.svg")}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleCardClick("Scout")}
          >
            <div className="flex items-center justify-center mb-4">
              <img
                src={
                  hoveredIcon === "../scoutWhite.svg"
                    ? "../scoutWhite.svg"
                    : "../scout.svg"
                }
                width="70"
                alt="Scout"
              />
            </div>
            <span
              className="ml-2 text-2xl font-bold tracking-tight text-gray-900"
              style={{
                color:
                  hoveredIcon === "../scoutWhite.svg" ? "#FFFFFF" : "#000000",
              }}
            >
              Scout
            </span>
          </div>
          {/* Add an empty div to maintain grid layout */}
          
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
  const [session, setSession] = useState(null);
  useEffect(() => {
    const session = supabase.auth.getSession();
    if (!session) {
      router.push("/login"); // Redirect to login page if not authenticated
    } else {
      setSession(session);
      fetchUserData(params.user_ID); // Fetch user data when user_ID changes
    }
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
        setSession(null); // Clear the session state
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
          <center>
            <div className="text-xl font-semibold">
              Welcome {userName && userName}
            </div>
          </center>

          {session && <Dashboard1 user_ID={params.user_ID} />}
          <br></br>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
