"use client";
import NavBar1 from "./components/navbar1";
import Slideshow from "./components/slideshow";
import Services from "./components/services";
import Clubs from "./components/clubs";
import Competitions from "./components/competitions";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://kinfgtgpmlvumilrpqdg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpbmZndGdwbWx2dW1pbHJwcWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkzNzc5MTksImV4cCI6MjAyNDk1MzkxOX0.Ag7F-hNuj6YX7kn_ruie0CQJsZ2SBke6U3iTPbWWTEo"
);

function Home() {
  return (
    <div>
      <NavBar1 />
      <Slideshow />
      <Services />
      <Clubs />
      <br />
      <Competitions />
    </div>
  );
}

export default Home;
