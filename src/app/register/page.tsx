"use client";
import { useEffect, useState } from "react";
import NavBar2 from "../components/navbar2";
import RegistrationForm from "../components/registration";


function Home() {
  return (
    <div className="bg-gray-100">
      <NavBar2 />
      <RegistrationForm />
    </div>
  );
}

export default Home;
