"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import NavBar2 from "C:/Users/HomePC/Desktop/football/src/app/components/navbar2";
import RegistrationForm from "C:/Users/HomePC/Desktop/football/src/app/components/registration";
const supabase = createClient(
  "https://binohqobswgaznnhogsn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbm9ocW9ic3dnYXpubmhvZ3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2NzcwOTMsImV4cCI6MjAyNjI1MzA5M30.AYRRtfz5U__Jyalsy7AQxXrnjKr4eNooJUxnI51A6kk"
);
function Home() {
  return (
    <div className="bg-gray-100">
      <NavBar2 />
      <RegistrationForm />
    </div>
  );
}

export default Home;
