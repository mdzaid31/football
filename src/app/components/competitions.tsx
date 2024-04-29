import React from "react";

const Competitions = () => {
  return (
    <div className="p-4" style={{ backgroundColor: "#004d98" }}>
      <span
        className="font-bold text-2xl text-white"
        style={{ borderBottom: "3px solid white", marginLeft: "40px" }}
      >
        Competitions
      </span>
      <center>
        <div className="grid grid-cols-3 p-3" style={{ marginLeft: "40px" }}>
          <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105 items-center">
            <img src="./laliga.png" height="200px" />
            <span className="mb-2 text-2xl font-bold tracking-tight text-gray-900 p-1">
              LaLiga
            </span>
          </div>

          <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105 items-center">
            <img src="./ucl.png" height="200px" />
            <span className="mb-2 text-2xl font-bold tracking-tight text-gray-900 p-1">
              Champions League
            </span>
          </div>

          <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105 items-center">
            <img src="./pl.png" height="200px" />
            <span className="mb-2 text-2xl font-bold tracking-tight text-gray-900 p-1">
              Premier League
            </span>
          </div>
        </div>
      </center>
    </div>
  );
};

export default Competitions;
