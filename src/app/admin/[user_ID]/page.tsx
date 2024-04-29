"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Message from "C:/Users/HomePC/Desktop/football/src/app/components/message";
import Swal from "sweetalert2";

const supabase = createClient(
  "https://binohqobswgaznnhogsn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbm9ocW9ic3dnYXpubmhvZ3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2NzcwOTMsImV4cCI6MjAyNjI1MzA5M30.AYRRtfz5U__Jyalsy7AQxXrnjKr4eNooJUxnI51A6kk"
);

const Dashboard = ({ params }) => {
  const router = useRouter();
  const [signOutMessage, setSignOutMessage] = useState("");
  const [displayContent, setDisplayContent] = useState("Users"); // Default to "Users"
  const [userData, setUserData] = useState([]);
  const [activeNavItem, setActiveNavItem] = useState("Users");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("user_ID, Full_Name, Email")
          .order("user_ID", { ascending: true });

        if (error) {
          throw error;
        }

        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    if (displayContent === "Users") {
      fetchUserData();
    }
  }, [displayContent]);

  const handleNavItemClicked = (content) => {
    setDisplayContent(content);
    setActiveNavItem(content);
  };

  const handleDeleteConfirmation = (userID) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { error } = await supabase
            .from("users")
            .delete()
            .eq("user_ID", userID);

          if (error) {
            throw error;
          }

          setUserData(userData.filter((user) => user.user_ID !== userID));

          Swal.fire({
            title: "Deleted!",
            text: "User has been deleted.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting user:", error.message);
          Swal.fire({
            title: "Error",
            text: "An error occurred while deleting the user.",
            icon: "error",
          });
        }
      }
    });
  };

  const handleView = (userID) => {
    router.push(`/admin/${params.user_ID}/${userID}`);
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

  return (
    <div>
      {signOutMessage && (
        <Message
          message={signOutMessage}
          onClose={() => setSignOutMessage("")}
        />
      )}

      <div style={{ position: "relative" }}>
        <nav
          style={{
            backgroundColor: "#004d98",
            height: "50px",
            top: "0",
            left: "0",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
            zIndex: "2",
          }}
        >
          <div
            className="font-semibold text-xl nav-item"
            style={{ color: "#fff" }}
          >
            Logo or Brand
          </div>
          <div
            className="font-semibold text-xl nav-item"
            style={{ color: "#fff", cursor: "pointer" }}
            onClick={handleSignOut}
          >
            Sign Out
          </div>
        </nav>

        <div
          style={{
            width: 200,
            backgroundColor: "#004d98",
            height: "100vh",
            zIndex: "1",
            position: "absolute",
            top: "0",
            left: "0",
          }}
        >
          <nav style={{ marginTop: "50px" }}>
            <div
              className={`font-semibold text-xl nav-item ${
                activeNavItem === "Users" ? "active" : ""
              }`}
              style={{
                padding: "15px 0",
                textAlign: "center",
                color: "#fff",
                maxHeight: "60px",
              }}
              onClick={() => handleNavItemClicked("Users")}
            >
              Users
            </div>
            <div
              className={`font-semibold text-xl nav-item ${
                activeNavItem === "Players" ? "active" : ""
              }`}
              style={{
                padding: "15px 0",
                textAlign: "center",
                color: "#fff",
                maxHeight: "60px",
              }}
              onClick={() => handleNavItemClicked("Players")}
            >
              Players
            </div>
            <div
              className={`font-semibold text-xl nav-item ${
                activeNavItem === "Clubs" ? "active" : ""
              }`}
              style={{
                padding: "15px 0",
                textAlign: "center",
                color: "#fff",
                maxHeight: "60px",
              }}
              onClick={() => handleNavItemClicked("Clubs")}
            >
              Clubs
            </div>
          </nav>
        </div>
      </div>

      <div style={{ marginLeft: 210, marginTop: 30 }}>
        {displayContent === "Players" && (
          <img
            src="/soon.png"
            alt="Players"
            style={{ display: "block", margin: "0 auto", height: "500px" }}
          />
        )}
        {displayContent === "Clubs" && (
          <img
            src="/soon.png"
            alt="Clubs"
            style={{ display: "block", margin: "0 auto", height: "500px" }}
          />
        )}
        {displayContent === "Users" && (
          <center>
            <table className="border-2 border-black">
              <thead>
                <tr>
                  <th className="text-xl border-2 border-black p-2 font-semibold">
                    ID
                  </th>
                  <th className="text-xl border-2 border-black p-2 font-semibold">
                    Name
                  </th>
                  <th className="text-xl border-2 border-black p-2 font-semibold">
                    Email
                  </th>
                  <th className="text-xl border-2 border-black p-2 font-semibold">
                    View
                  </th>
                  <th className="text-xl border-2 border-black p-2 font-semibold">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => (
                  <tr key={user.user_ID}>
                    <td className="border-2 border-black p-2">
                      {user.user_ID}
                    </td>
                    <td className="border-2 border-black p-2">
                      {user.Full_Name}
                    </td>
                    <td className="border-2 border-black p-2">{user.Email}</td>
                    <td className="border-2 border-black p-2 items-center">
                      <div
                        className="w-full text-white p-2 rounded-md font-semibold"
                        style={{
                          backgroundColor: "#004d98",
                          transition: "background-color 0.3s ease",
                          textAlign: "center",
                        }}
                        onClick={() => handleView(user.user_ID)}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#002f5b")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#004d98")
                        }
                      >
                        View
                      </div>
                    </td>
                    <td className="border-2 border-black p-2 items-center">
                      <div
                        className="w-full text-white p-2 rounded-md font-semibold"
                        style={{
                          backgroundColor: "#004d98",
                          transition: "background-color 0.3s ease",
                          textAlign: "center",
                        }}
                        onClick={() => handleDeleteConfirmation(user.user_ID)}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#002f5b")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#004d98")
                        }
                      >
                        Remove
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </center>
        )}
      </div>
      <style jsx>{`
        .nav-item:hover,
        .active {
          background-color: #a50044; /* Change this to whatever color you want */
          cursor: pointer; /* Optional: Change cursor to pointer on hover */
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
