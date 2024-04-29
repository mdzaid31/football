import Link from "next/link";
import useState from "react";
import React from "react";
const NavBar2: React.FC = () => {
  return (
    <nav
      style={{ backgroundColor: "#004d98" }}
      className="flex justify-between items-center min-h-14"
    >
      <div className="flex items-center space-x-4">
        <a href="/" className="flex items-center space-x-2">
          <img src="" alt="" width={14} />
          <img src="" alt="" width={14} />
          <img src="/logo.png" className="h-11 w-11" />
          <span className="text-white text-3xl font-semibold">KickOff</span>
        </a>
      </div>
      <div className="flex items-center space-x-4 text-xl text-white min-h-14">
        <div>
          <NavLink href="/">Home</NavLink>
        </div>
        <div
          className="font-semibold min-h-14 flex items-center"
          style={{
            backgroundColor: "#a50044",
            color: "#FFFFFF",
          }}
        >
          <NavLink href="/register">Register</NavLink>
        </div>
        <div>
          <NavLink href="/login">Login</NavLink>
        </div>
        <img src="" alt="" width={14} />
        <img src="" alt="" width={14} />
      </div>
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <a
      href={href}
      className="text-black px-3 py-2 transition-colors min-h-14 flex items-center"
      style={{
        backgroundColor: hovered ? "#a50044" : "inherit",
        color: hovered ? "#FFFFFF" : "inherit",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
};

export default NavBar2;
