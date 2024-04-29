"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Head from "next/head";
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
    password: "",
    confirm_password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [editMode, setEditMode] = useState(false); // Track edit mode

  useEffect(() => {
    fetchUserData(params.user_ID);
  }, [params.user_ID]);

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
        password: "",
        confirm_password: "",
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleEditModeToggle = () => {
    setEditMode(!editMode); // Toggle edit mode
    if (editMode) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirm_password) {
      alert("Passwords don't match. Please try again.");
      return;
    }
    try {
      const profilePictureBinary = profilePicture.split(",")[1];
      const { data, error } = await supabase
        .from("users")
        .update({
          Full_Name: formData.full_name,
          Email: formData.email,
          Phone_Number: formData.phone,
          Age: formData.age,
          Nationality: formData.nationality,
          Username: formData.username,
          Password: formData.password,
          Pfp: profilePictureBinary,
        })
        .eq("user_ID", params.user_ID);

      if (error) {
        throw error;
      }

      console.log("User updated successfully:", data);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        router.refresh();
      }, 3000);
    } catch (error) {
      console.error("Error updating user:", error.message);
      // Handle the error, display a message, or log additional details
    }
  };
  return (
    <>
    <Chatbot />
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
        <LandingNavbar
          profilePicture={profilePicture}
          ref={horizontalNavbarRef}
          handleSignOut={handleSignOut}
          user_ID={params.user_ID}
        />
        <div style={{ marginTop: "var(--horizontal-navbar-height, 0)" }}>
          <VerticalNavbar user_ID={params.user_ID} />
          <div style={{ marginLeft: 210, marginTop: 70 }}>
            <div className="bg-gray-100">
              <div className="container mx-auto mt-8">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-md shadow-md">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Edit Profile
                  </h2>
                  <form
                    method="POST"
                    className="grid grid-cols-3 gap-4"
                    onSubmit={handleSubmit}
                  >
                    {/* Left Column */}
                    <div className="col-span-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
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
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required={editMode}
                            disabled={!editMode}
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
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required={editMode}
                            disabled={!editMode}
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
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required={editMode}
                            disabled={!editMode}
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
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required={editMode}
                            disabled={!editMode}
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
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            style={{ height: "42px" }}
                            required={editMode}
                            disabled={!editMode}
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
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required={editMode}
                            disabled={!editMode}
                          />
                        </div>
                        {/* Password */}
                        {/* Add Password field */}
                        <div>
                          <label
                            htmlFor="password"
                            className="block text-gray-700 font-semibold mb-2"
                          >
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={passwordVisible ? "text" : "password"}
                              id="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                              required={editMode}
                              disabled={!editMode}
                            />
                            <button
                              type="button"
                              className="icon-button absolute inset-y-0 right-0 px-3 py-2"
                              onClick={handleTogglePasswordVisibility}
                            >
                              <img
                                src={
                                  passwordVisible ? "/hide.svg" : "/show.svg"
                                }
                                alt={passwordVisible ? "Hide" : "Show"}
                                className="h-6 w-6"
                              />
                            </button>
                          </div>
                        </div>
                        {/* Confirm Password */}
                        {/* Add Confirm Password field */}
                        <div>
                          <label
                            htmlFor="confirm_password"
                            className="block text-gray-700 font-semibold mb-2"
                          >
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              type={
                                confirmPasswordVisible ? "text" : "password"
                              }
                              id="confirm_password"
                              name="confirm_password"
                              value={formData.confirm_password}
                              onChange={handleChange}
                              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                              required={editMode}
                              disabled={!editMode}
                            />
                            <button
                              type="button"
                              className="icon-button absolute inset-y-0 right-0 px-3 py-2"
                              onClick={handleToggleConfirmPasswordVisibility}
                            >
                              <img
                                src={
                                  confirmPasswordVisible
                                    ? "/hide.svg"
                                    : "/show.svg"
                                }
                                alt={confirmPasswordVisible ? "Hide" : "Show"}
                                className="h-6 w-6"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Right Column for Profile Picture */}
                    <div>
                      <div className="mb-4">
                        <label
                          htmlFor="profile_picture"
                          className="block text-gray-700 font-semibold mb-2"
                        >
                          Profile Picture
                        </label>
                        <input
                          type="file"
                          id="profile_picture"
                          name="profile_picture"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          disabled={!editMode}
                        />
                        <div className="border border-gray-300 rounded-md p-2 mt-2">
                          {profilePicture && (
                            <img
                              src={profilePicture}
                              alt="Profile"
                              className="w-full rounded-md"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Edit/Save Changes Button */}
                    <div className="col-span-3 mt-6">
                      <button
                        type={editMode ? "submit" : "button"}
                        onClick={handleEditModeToggle}
                        className="w-full text-white py-3 rounded-md font-semibold"
                        style={{
                          backgroundColor: "#004d98",
                          transition: "background-co0.3s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#002f5b")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#004d98")
                        }
                      >
                        {editMode ? "Save Changes" : "Edit Profile"}
                      </button>
                    </div>
                  </form>
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
      </div>
    </>
  );
};

export default Dashboard;
