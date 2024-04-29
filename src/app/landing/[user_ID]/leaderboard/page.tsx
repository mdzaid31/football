"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";

import Message from "../../../components/message";
import LandingNavbar from "../../../components/landingnavbar";
import VerticalNavbar from "../../../components/verticalnavbar";
import Chatbot from "../../../components/chatbot";
import { supabase } from "../../../../lib/supabase";

const styles = {
  tableHeader: {
    backgroundColor: "#a50044",
    border: "2px solid #ddd",
    padding: "8px",
  },
  tableCell: {
    backgroundColor: "#f4f4f4",
    border: "2px solid #ddd",
    padding: "8px",
  },
  expandedRow: {
    backgroundColor: "#e2e2e2",
  },
};

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("Full_Name, Nationality, score, Pfp, Username")
          .order("score", { ascending: false });

        if (error) {
          throw error;
        }

        // Convert Base64 PFP to Data URL format
        const usersWithPfpUrl = data.map((user) => ({
          ...user,
          PfpUrl: `data:image/png;base64,${user.Pfp}`, // Assuming PFP is in PNG format, adjust if different
        }));

        const usersWithCountryData = await Promise.all(
          usersWithPfpUrl.map(async (user) => {
            const { data: countryData, error: countryError } = await supabase
              .from("countries")
              .select("image, rounded, Country_Name")
              .eq("Country_ID", user.Nationality)
              .single();

            if (countryError) {
              throw countryError;
            }

            return {
              ...user,
              rounded: countryData?.rounded || null,
              image: countryData?.image || null,
              Country_Name: countryData?.Country_Name || null,
            };
          })
        );

        setUsersData(usersWithCountryData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }

    fetchUsers();
  }, []);

  const toggleRow = (index) => {
    const updatedRows = [...expandedRows];
    updatedRows[index] = !updatedRows[index];
    setExpandedRows(updatedRows);
  };

  return (
    <div className="items-center">
      <table
        className="items-center"
        style={{ width: "80%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th
              className="text-xl text-white font-semibold"
              style={styles.tableHeader}
            >
              Rank
            </th>
            <th
              className="text-xl text-white font-semibold"
              style={styles.tableHeader}
            >
              Full Name
            </th>
            <th
              className="text-xl text-white font-semibold"
              style={styles.tableHeader}
            >
              Username
            </th>
            <th
              className="text-xl text-white font-semibold"
              style={styles.tableHeader}
            >
              Nationality
            </th>
            <th
              className="text-xl text-white font-semibold"
              style={styles.tableHeader}
            >
              Score
            </th>
          </tr>
        </thead>
        <tbody>
          {usersData.map((user, index) => (
            <React.Fragment key={index}>
              <tr
                onClick={() => toggleRow(index)}
                className={expandedRows[index] ? styles.expandedRow : ""}
              >
                <td style={styles.tableCell}>{index + 1}</td>
                <td style={styles.tableCell}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={user.PfpUrl}
                      width={expandedRows[index] ? 200 : 60}
                      style={{ borderRadius: expandedRows[index] ? 0 : "50%" }}
                      alt={user.Username}
                    />
                    <span>{user.Full_Name}</span>
                  </div>
                </td>
                <td style={styles.tableCell}>{user.Username}</td>
                <td style={styles.tableCell}>
                  <center>
                    <div>
                      <img
                        src={expandedRows[index] ? user.image : user.rounded}
                        width={expandedRows[index] ? 180 : 60}
                        style={{
                          borderRadius: expandedRows[index] ? 0 : "50%",
                        }}
                        alt={user.Country_Name}
                      />
                      <br />
                      {expandedRows[index] && (
                        <div>
                          <b>{user.Country_Name}</b>
                        </div>
                      )}
                    </div>
                  </center>
                </td>
                <td style={styles.tableCell}>{user.score}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
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
          <center>
            <div className="text-2xl font-semibold">LEADERBOARD</div>
            <br />
            <Users />
            <br />
            <br />
          </center>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
