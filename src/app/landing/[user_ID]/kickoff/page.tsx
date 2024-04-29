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
  const horizontalNavbarRef = useRef<HTMLDivElement>(null);
  const [signOutMessage, setSignOutMessage] = useState("");
  const [allUsers, setAllUsers] = useState([]);

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

  const handlePlayerClick = async (loggedInUserID: any, sUserID: any) => {
    router.push(`/landing/${loggedInUserID}/kickoff/${sUserID}`);
  };

  const fetchUserData = async (userID: any) => {
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

      const { data: allUsersData, error: usersError } = await supabase
        .from("users")
        .select("user_ID, Full_Name, Pfp")
        .neq("user_ID", userID) // Exclude the logged-in user
        .order("user_ID", { ascending: true });

      if (usersError) {
        throw usersError;
      }

      setAllUsers(allUsersData);
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

  // Function to handle click on the "Back" button

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
        <div style={{ marginLeft: 195, marginTop: 70 }}>
          <div className="p-2">
            <center>
              <p
                className="text-2xl font-semibold p-4 border-2 border-gray-700 inline-flex gap-3"
                style={{ borderRadius: "12px" }}
              >
                Choose Your Opponent!!!
              </p>
              <div>
                <div className="flex flex-wrap justify-center">
                  {allUsers.map((user) => (
                    <div
                      key={user.user_ID}
                      className="p-2 border-2 border-gray-700 mx-4 my-4 cursor-pointer"
                      style={{
                        borderRadius: "12px",
                        maxWidth: "250px",
                        transition: "transform 0.3s ease-in-out",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.1)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                      onClick={async () =>
                        handlePlayerClick(params.user_ID, user.user_ID)
                      }
                    >
                      <img
                        src={`data:image/png;base64,${user.Pfp}`}
                        alt=""
                        style={{
                          height: "200px",
                        }}
                      />
                      <p className="font-semibold">{user.Full_Name}</p>
                    </div>
                  ))}
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
