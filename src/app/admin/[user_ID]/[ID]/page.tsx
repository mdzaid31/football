"use client";
import { useRouter } from "next/navigation"; // Corrected import
import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Head from "next/head";
import Message from "C:/Users/HomePC/Desktop/football/src/app/components/message";

const supabase = createClient(
  "https://binohqobswgaznnhogsn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbm9ocW9ic3dnYXpubmhvZ3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2NzcwOTMsImV4cCI6MjAyNjI1MzA5M30.AYRRtfz5U__Jyalsy7AQxXrnjKr4eNooJUxnI51A6kk"
);

const Dashboard = ({ params }) => {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState("");
  const [userName, setUserName] = useState("");
  const horizontalNavbarRef = useRef<HTMLDivElement>(null);
  const [signOutMessage, setSignOutMessage] = useState("");
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    age: "",
    nationality: "",
    username: "",
  });

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    fetchUserData(params.ID);
  }, [params.ID]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data, error } = await supabase.from("countries").select("*");
        if (error) {
          throw error;
        }
        if (data) {
          setCountries(data);
        }
      } catch (error) {
        console.error("Error fetching countries:", error.message);
      }
    };

    fetchCountries();
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
        const base64Image = userData.Pfp;
        const imageDataUrl = `data:image/png;base64,${base64Image}`;
        setProfilePicture(imageDataUrl);
      }

      if (userData && userData.Full_Name) {
        setUserName(userData.Full_Name);
      }

      setFormData({
        full_name: userData?.Full_Name || "",
        email: userData?.Email || "",
        phone: userData?.Phone_Number || "",
        age: userData?.Age || "",
        nationality: userData?.Nationality || "",
        username: userData?.Username || "",
      });
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
  const goBack = () => {
    router.push(`/admin/${params.user_ID}`);
  };
  return (
    <>
      <Head>
        <title>Edit Profile</title>
        {/* Add necessary head content here */}
      </Head>
      <div>
        {signOutMessage && (
          <Message
            message={signOutMessage}
            onClose={() => setSignOutMessage("")}
          />
        )}
        <div style={{ position: "relative" }}>
          {/* Horizontal Navbar */}
          <nav
            style={{
              backgroundColor: "#004d98",
              height: "50px",
              top: "0",
              left: "0",
              width: "100%",
              display: "flex",
              justifyContent: "space-between", // Align items to the sides
              alignItems: "center",
              padding: "0 20px", // Add padding to adjust spacing
              zIndex: "2", // Ensure it's above the vertical navbar
            }}
          >
            <div
              className="font-semibold text-xl nav-item"
              style={{ color: "#fff" }}
            >
              Logo or Brand
            </div>
            <div
              className="font-semibold text-xl"
              style={{ color: "#fff", cursor: "pointer" }}
              onClick={handleSignOut}
            >
              Sign Out
            </div>
          </nav>

          {/* Vertical Navbar */}
          <div
            style={{
              width: 200,
              backgroundColor: "#004d98",
              height: "120vh",
              zIndex: "1", // Ensure it's below the horizontal navbar
              position: "absolute",
              top: "0",
              left: "0",
            }}
          >
            <nav style={{ marginTop: "50px" }}>
              <div
                className="font-semibold text-xl nav-item"
                style={{
                  padding: "15px 0",
                  textAlign: "center",
                  color: "#fff",
                  maxHeight: "60px",
                }}
                onClick={goBack}
              >
                Back
              </div>
            </nav>
          </div>
        </div>
        <div style={{ marginLeft: 210 }}>
          <div className="bg-gray-100">
            <div className="container mx-auto mt-8">
              <div className="max-w-4xl mx-auto bg-white p-8 rounded-md shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  User Profile
                </h2>

                {/* Left Column */}
                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    {/* Add Full Name field */}
                    <div>
                      <label
                        htmlFor="full_name"
                        className="block text-gray-700 font-semibold mb-2"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        disabled
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    {/* Email */}
                    {/* Add Email field */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-gray-700 font-semibold mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    {/* Phone Number */}
                    {/* Add Phone Number field */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-gray-700 font-semibold mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        disabled
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    {/* Age */}
                    {/* Add Age field */}
                    <div>
                      <label
                        htmlFor="age"
                        className="block text-gray-700 font-semibold mb-2"
                      >
                        Age
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        disabled
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    {/* Nationality */}
                    {/* Add Nationality field */}
                    <div>
                      <label
                        htmlFor="nationality"
                        className="block text-gray-700 font-semibold mb-2"
                      >
                        Nationality
                      </label>
                      <select
                        id="nationality"
                        name="nationality"
                        value={formData.nationality}
                        disabled
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        style={{ height: "42px" }}
                      >
                        {countries
                          .sort((a, b) =>
                            a.Country_Name.localeCompare(b.Country_Name)
                          )
                          .map((country) => (
                            <option
                              key={country.Country_ID}
                              value={country.Country_ID}
                            >
                              {country.Country_Name}
                            </option>
                          ))}
                      </select>
                    </div>
                    {/* Username */}
                    {/* Add Username field */}
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-gray-700 font-semibold mb-2"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        disabled
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                  </div>
                </div>
                {/* Right Column for Profile Picture */}
                <div>
                  <div className="border border-gray-300 rounded-md p-2 mt-2">
                    {profilePicture && (
                      <center>
                        <img
                          src={profilePicture}
                          alt="Profile"
                          className="rounded-md"
                          style={{ height: "200px" }}
                        />
                      </center>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showMessage && (
            <Message
              message="Account successfully updated"
              onClose={() => setShowMessage(false)}
            />
          )}
        </div>
      </div>
      <br />
      <br />
      <style jsx>{`
        .nav-item:hover {
          background-color: #a50044; /* Change this to whatever color you want */
          cursor: pointer; /* Optional: Change cursor to pointer on hover */
        }
      `}</style>
    </>
  );
};

export default Dashboard;
