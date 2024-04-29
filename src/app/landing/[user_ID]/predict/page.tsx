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
  const handleLaLiga = () => {
    // Call the function for LaLiga
    laliga();
  };

  // Function to handle UEFA Champions League selection
  const handleUCL = () => {
    // Call the function for UEFA Champions League
    ucl();
  };

  // Function to handle English Premier League selection
  const handleEPL = () => {
    // Call the function for English Premier League
    epl();
  };

  // Function for LaLiga
  const laliga = () => {
    // Add your logic for LaLiga here
    console.log("LaLiga selected");
    router.push(`/landing/${params.user_ID}/predict/Laliga`);
  };

  // Function for UEFA Champions League
  const ucl = () => {
    // Add your logic for UEFA Champions League here
    console.log("UEFA Champions League selected");
    router.push(`/landing/${params.user_ID}/predict/UCL`);
  };

  // Function for English Premier League
  const epl = () => {
    // Add your logic for English Premier League here
    console.log("English Premier League selected");
    router.push(`/landing/${params.user_ID}/predict/EPL`);
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
          <div>
            <span
              className="font-bold text-2xl"
              style={{ borderBottom: "3px solid white", marginLeft: "40px" }}
            >
              Choose The Competition
            </span>
            <center>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                <div
                  className="block p-4 bg-white border border-gray-200 rounded-lg shadow-md transform transition duration-300 hover:scale-105 items-center cursor-pointer"
                  onClick={handleLaLiga}
                >
                  <img src="/laliga.png" height="120px" />
                  <span className="mb-2 text-xl md:text-2xl font-bold tracking-tight text-gray-900 p-1">
                    LaLiga
                  </span>
                </div>

                <div
                  className="block p-4 bg-white border border-gray-200 rounded-lg shadow-md transform transition duration-300 hover:scale-105 items-center cursor-pointer"
                  onClick={handleUCL}
                >
                  <img src="/ucl.png" height="120px" />
                  <span className="mb-2 text-xl md:text-2xl font-bold tracking-tight text-gray-900 p-1">
                    Champions League
                  </span>
                </div>

                <div
                  className="block p-4 bg-white border border-gray-200 rounded-lg shadow-md transform transition duration-300 hover:scale-105 items-center cursor-pointer"
                  onClick={handleEPL}
                >
                  <img src="/pl.png" height="120px" />
                  <span className="mb-2 text-xl md:text-2xl font-bold tracking-tight text-gray-900 p-1">
                    Premier League
                  </span>
                </div>
              </div>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
