"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Message from "../components/message";
import { useRouter } from "next/navigation";

interface Country {
  Country_Name: string;
}

import { supabase } from "../../lib/supabase";
const RegistrationForm = () => {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState(null);
  const [countries, setCountries] = useState<Country[]>([]);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

  const handleRegistration = async () => {
    if (formData.password !== formData.confirm_password) {
      alert("Passwords don't match. Please try again.");
      return;
    }

    try {
      const profilePictureBinary = profilePicture.split(",")[1];
      const { user, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password, // Set the password here
      });

      if (error) {
        throw error;
      }

      // Insert user data after successful sign up
      const { data, error: insertError } = await supabase.from("users").insert([
        {
          Full_Name: formData.full_name,
          Email: formData.email,
          Phone_Number: formData.phone,
          Age: formData.age,
          Nationality: formData.nationality,
          Username: formData.username,
          Password: formData.password, // Ensure the password is included here as well
          Pfp: profilePictureBinary,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        router.push("/login"); // Redirect to login page after successful registration
      }, 3000);

      console.log("User registered successfully:", user);
    } catch (error) {
      console.error("Error during registration:", error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Registration Page</title>
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
        <style>
          {`
            input[type="text"],
            input[type="email"],
            input[type="tel"],
            input[type="number"],
            input[type="file"],
            select {
              height: 45px;
              padding-right: 40px; /* Adjusted padding for icon */
            }
            .icon-button {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 10px;
              cursor: pointer;
              background: none;
              border: none;
            }
          `}
        </style>
      </Head>
      <div className="bg-gray-100">
        <div className="container mx-auto mt-8">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Create an Account
            </h2>
            <form
              className="grid grid-cols-3 gap-4"
              onSubmit={handleRegistration}
            >
              <div>
                <div className="mb-4">
                  <label
                    htmlFor="full_name"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="age"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Age
                  </label>
                  <input
                    required
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              <div>
                <div className="mb-4">
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
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Username
                  </label>
                  <input
                    required
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={passwordVisible ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <button
                      type="button"
                      className="icon-button absolute inset-y-0 right-0 px-3 py-2"
                      onClick={handleTogglePasswordVisibility}
                    >
                      <img
                        src={passwordVisible ? "/hide.svg" : "/show.svg"}
                        alt={passwordVisible ? "Hide" : "Show"}
                        className="h-6 w-6"
                      />
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="confirm_password"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={confirmPasswordVisible ? "text" : "password"}
                      id="confirm_password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <button
                      type="button"
                      className="icon-button absolute inset-y-0 right-0 px-3 py-2"
                      onClick={handleToggleConfirmPasswordVisibility}
                    >
                      <img
                        src={confirmPasswordVisible ? "/hide.svg" : "/show.svg"}
                        alt={confirmPasswordVisible ? "Hide" : "Show"}
                        className="h-6 w-6"
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <label
                    htmlFor="profile_picture"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Profile Picture
                  </label>
                  <input
                    required
                    type="file"
                    id="profile_picture"
                    name="profile_picture"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="border border-gray-300 rounded-md p-2">
                  {profilePicture && (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-full rounded-md"
                    />
                  )}
                </div>
              </div>
              <div className="col-span-3 mt-6"></div>
            </form>
            <button
              type="submit"
              onClick={handleRegistration}
              className="w-full text-white py-3 rounded-md font-semibold"
              style={{
                backgroundColor: "#004d98",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#002f5b")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#004d98")}
            >
              Register
            </button>
          </div>
        </div>
      </div>
      {/* Conditionally render MessagePopup */}
      {showMessage && (
        <Message
          message="Account successfully created"
          onClose={() => setShowMessage(false)}
        />
      )}
    </>
  );
};

export default RegistrationForm;
