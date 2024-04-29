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

const EPL = ({ params }) => {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState("");
  const [userName, setUserName] = useState(""); // State to store user's name
  const horizontalNavbarRef = useRef<HTMLDivElement>(null);
  const [signOutMessage, setSignOutMessage] = useState("");
  const [clubs, setClubs] = useState([]);
  const [homeClubID, setHomeClubID] = useState(null);
  const [homeClubName, setHomeClubName] = useState(null);

  useEffect(() => {
    fetchUserData(params.user_ID);
    fetchClubsData();
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
  const handleBack = () => {
    router.push(`/landing/${params.user_ID}/predict`);
  };

  const fetchClubsData = async () => {
    try {
      const { data, error } = await supabase
        .from("clubs")
        .select("Club_ID, Club_Name, Logo")
        .eq("Country_ID", "F36")
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

  const handleClubClick = async (clubID) => {
    try {
      const { data: selectedClubData, error: selectedClubError } =
        await supabase
          .from("clubs")
          .select("Club_ID, Club_Name, Logo")
          .eq("Club_ID", clubID)
          .eq("Country_ID", "F36");

      if (selectedClubError) {
        throw selectedClubError;
      }

      setHomeClubID(clubID);
      setHomeClubName(selectedClubData[0]?.Club_Name || null); // Update state with the selected club name

      router.push(`/landing/${params.user_ID}/predict/EPL/${clubID}`);
    } catch (error) {
      console.error("Error fetching club data:", error.message);
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
          <br />
          <center>
            {homeClubID ? (
              <div style={{ alignItems: "center" }}>
                <p>Your Club : {homeClubName}</p>
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
            )}
          </center>
        </div>
      </div>
    </div>
  );
};

export default EPL;
