"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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

const VerticalNavbar = ({ user_ID }) => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const openStateItems = [
    { href: `/landing/${user_ID}`, icon: "/homeWhite.svg", text: "Home" },
    {
      href: `/landing/${user_ID}/kickoff`,
      icon: "/kickoffWhite.svg",
      text: "Kick Off",
    },
    {
      href: `/landing/${user_ID}/predict`,
      icon: "/predictWhite.svg",
      text: "Predict",
    },
    {
      href: `/landing/${user_ID}/leaderboard`,
      icon: "/leaderboardWhite.svg",
      text: "Leaderboard",
    },
    {
      href: `/landing/${user_ID}/players`,
      icon: "/playersWhite.svg",
      text: "Players",
    },
    {
      href: `/landing/${user_ID}/compare`,
      icon: "/compareWhite.svg",
      text: "Compare",
    },
    {
      href: `/landing/${user_ID}/clubs`,
      icon: "/clubsWhite.svg",
      text: "Clubs",
    },
    {
      href: `/landing/${user_ID}/scout`,
      icon: "/scoutWhite.svg",
      text: "Scout",
    },
  ];

  const closedStateItems = [
    { href: `/landing/${user_ID}`, icon: "/homeWhite.svg" },
    { href: `/landing/${user_ID}/kickoff`, icon: "/kickoffWhite.svg" },
    { href: `/landing/${user_ID}/kickoff`, icon: "/predictWhite.svg" },
    {
      href: `/landing/${user_ID}/leaderboard`,
      icon: "/leaderboardWhite.svg",
    },
    { href: `/landing/${user_ID}/players`, icon: "/playersWhite.svg" },
    { href: `/landing/${user_ID}/compare`, icon: "/compareWhite.svg" },
    { href: `/landing/${user_ID}/clubs`, icon: "/clubsWhite.svg" },
    { href: `/landing/${user_ID}/scout`, icon: "/scoutWhite.svg" },
  ];

  const toggleNavbar = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <nav
      style={{
        backgroundColor: "#004d98",
        width: isOpen ? "200px" : "50px", // Adjust width based on open/close state
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: isOpen ? "flex-start" : "center", // Align items based on open/close state
        position: "fixed",
        top: "var(--horizontal-navbar-height, 0)",
        bottom: 0,
        zIndex: 999, // Ensure vertical navbar is below horizontal navbar
        transition: "width 0.3s ease-in-out", // Add transition for smooth animation
      }}
    >
      <div className="w-full text-white">
        <button
          onClick={toggleNavbar}
          className="text-white px-3 py-2 transition-colors min-h-14 flex items-center"
        >
          {isOpen ? "<<<" : ">>>"}
        </button>
      </div>
      {isOpen
        ? openStateItems.map((item, index) => (
            <div key={index} className="w-full text-white text-xl">
              <NavLink href={item.href}>
                <img src={item.icon} width="35" />
                {item.text}
              </NavLink>
            </div>
          ))
        : closedStateItems.map((item, index) => (
            <div key={index} className="w-full text-white text-xl">
              <NavLink href={item.href}>
                <img src={item.icon} width="35" />
              </NavLink>
            </div>
          ))}
    </nav>
  );
};

export default VerticalNavbar;
