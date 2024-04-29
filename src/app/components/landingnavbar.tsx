"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import Message from "C:/Users/HomePC/Desktop/football/src/app/components/message";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://binohqobswgaznnhogsn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbm9ocW9ic3dnYXpubmhvZ3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2NzcwOTMsImV4cCI6MjAyNjI1MzA5M30.AYRRtfz5U__Jyalsy7AQxXrnjKr4eNooJUxnI51A6kk"
);

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      className="text-white px-3 py-2 transition-colors min-h-14 flex items-center"
      style={{
        backgroundColor: hovered ? "#a50044" : "inherit",
        color: hovered ? "#FFFFFF" : "inherit",
        fontWeight: hovered ? "600" : "normal",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
};

const LandingNavbar = React.forwardRef<
  HTMLDivElement,
  { profilePicture: string; handleSignOut: () => void; user_ID: string }
>(({ profilePicture, handleSignOut, user_ID }, ref) => {
  return (
    <nav
      ref={ref}
      style={{
        backgroundColor: "#004d98",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000, // Ensure horizontal navbar is on top
      }}
    >
      <div className="flex items-center space-x-4">
        <a href="/" className="flex items-center space-x-2">
          <img src="" alt="" width={14} />
          <img src="" alt="" width={14} />
          <img src="/logo.png" className="h-11 w-11" />
          <span className="text-white text-2xl font-semibold">KickOff</span>
        </a>
      </div>
      <div className="flex items-center space-x-4 text-xl text-white">
        <div
          className="min-h-14 flex items-center cursor-pointer"
          style={{ backgroundColor: "#004d98", color: "#FFFFFF" }}
          onClick={handleSignOut}
        >
          Sign Out
        </div>
        <div>
          <NavLink href={`/landing/${user_ID}/team`}>My Team</NavLink>
        </div>
        <div>
          <NavLink href={`/landing/${user_ID}/profile`}>
            {profilePicture && (
              <img
                src={`data:image/png;base64,${profilePicture}`}
                alt=""
                width={40}
                style={{ borderRadius: "50%" }}
              />
            )}
            Profile
          </NavLink>
        </div>
        <img src="" alt="" width={14} />
      </div>
    </nav>
  );
});
export default LandingNavbar;
