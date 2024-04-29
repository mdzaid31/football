import React from "react";

const Services = () => {
  return (
    <div className="p-3" style={{ backgroundColor: "#004d98" }}>
      <span
        className="font-bold text-2xl text-white"
        style={{ borderBottom: "3px solid white", marginLeft: "40px" }}
      >
        Services
      </span>
      <div className="grid grid-rows-2 p-3" style={{ marginLeft: "40px" }}>
        <div className="grid grid-cols-3 p-3">
          <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105">
            <div className="flex items-center space-x-2">
              <img src="../predictions.svg" width="27" />
              <span className="mb-2 text-2xl font-bold tracking-tight text-gray-900 p-1">
                Match Predictions
              </span>
            </div>
            <p className="font-normal text-gray-700">
              Quick AI powered football match outcome predictions.
            </p>
          </div>

          <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105">
            <div className="flex items-center space-x-2">
              <img src="../team.svg" width="27" />
              <span className="mb-2 text-2xl font-bold tracking-tight text-gray-900 p-1">
                Ultimate Team
              </span>
            </div>
            <p className="font-normal text-gray-700">
              Make your own team and compete against your friends.
            </p>
          </div>

          <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105">
            <div className="flex items-center space-x-2">
              <img src="../comparison.svg" width="27" />
              <span className="mb-2 text-2xl font-bold tracking-tight text-gray-900 p-1">
                Player Comparison
              </span>
            </div>
            <p className="font-normal text-gray-700">
              Compare up to 4 players with each other using radar charts.
            </p>
          </div>

          {/* Add more service blocks here */}
        </div>
        <div className="grid grid-cols-3 p-3">
          {/* Add more service blocks here */}
          <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105">
            <div className="flex items-center space-x-2">
              <img src="../scouting.svg" width="27" />
              <span className="mb-2 text-2xl font-bold tracking-tight text-gray-900 p-1">
                Scouting
              </span>
            </div>
            <p className="font-normal text-gray-700">
              Find players similar to the given player.
            </p>
          </div>

          <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105">
            <div className="flex items-center space-x-2">
              <img src="../analytics.svg" width="27" />
              <span className="mb-2 text-2xl font-bold tracking-tight text-gray-900 p-1">
                Analytics
              </span>
            </div>
            <p className="font-normal text-gray-700">
              View player analytics to gain insights on players' attributes.
            </p>
          </div>

          <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105">
            <div className="flex items-center space-x-2">
              <img src="../chatbot.svg" width="27" />
              <span className="mb-2 text-2xl font-bold tracking-tight text-gray-900 p-1">
                Chatbot
              </span>
            </div>
            <p className="font-normal text-gray-700">
              Interact with an intelligent chatbot that will help you navigate
              the website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
