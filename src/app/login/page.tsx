"use client";
import { useState } from "react";
import NavBar3 from "C:/Users/HomePC/Desktop/football/src/app/components/navbar3";
import { useRouter } from "next/navigation"; // Import useRouter hook
import { supabase } from "C:/Users/HomePC/Desktop/football/src/lib/supabase";

function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    type: "user",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (formData.type === "user") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          throw error;
        }
        const { data: users, error: userError } = await supabase
          .from("users")
          .select("user_ID")
          .eq("Email", formData.email)
          .single();

        if (userError) {
          throw userError;
        }

        router.push(`/landing/${users.user_ID}`);
      } else if (formData.type === "admin") {
        console.log("Admin login not available");
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          throw error;
        }
        const { data: admins, error: adminsError } = await supabase
          .from("admins")
          .select("user_ID")
          .eq("Email", formData.email)
          .single();

        if (adminsError) {
          throw adminsError;
        }

        router.push(`/admin/${admins.user_ID}`);
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      setErrorMessage("Error logging in. Please try again later");
    }
  };

  return (
    <div className="bg-gray-100">
      <NavBar3 />
      <br />
      <div className="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Login</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit} method="POST">
          <div className="mb-4">
            <label
              htmlFor="type"
              className="block text-gray-700 font-semibold mb-2"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-4">
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

          <div className="mt-6">
            <button
              type="submit"
              className="w-full text-white py-3 rounded-md font-semibold"
              style={{
                backgroundColor: "#004d98",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#002f5b")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#004d98")}
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
}

export default Home;
