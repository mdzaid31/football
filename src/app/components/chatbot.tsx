import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Circle: React.FC<{ position: "left" | "right" }> = ({ position }) => {
  const circleStyle = {
    width: "37px",
    height: "37px",
    borderRadius: "50%",
    backgroundColor: "#004d98", // Blue color
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const iconStyle = {
    height: "24px",
  };

  return (
    <div style={circleStyle} className="items-center">
      <center>
        <img
          className="items-center"
          src={position === "left" ? "/chatbot2.png" : "/user.png"}
          alt="Icon"
          style={iconStyle}
        />
      </center>
    </div>
  );
};

const Chatbot: React.FC = () => {
  const [clicked, setClicked] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setClicked(true);
  };

  const handleClose = () => {
    setClicked(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/chatbot", {
        message: inputValue,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        `You: ${inputValue}`,
        `Bot: ${response.data.response}`,
      ]);
      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Automatic scrolling to bottom
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Initial message from the chatbot
  useEffect(() => {
    setMessages([
      "Bot: Hello! My name is Kickoff Bot. How may I be of assistance today?",
    ]);
  }, []);

  return (
    <>
      {!clicked && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: "1000", // Ensure the button is above other content
          }}
        >
          <button
            className="border-2 border-black items-center"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "#004d98", // Set button color
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
            onClick={handleClick}
          >
            <center>
              <img
                src="/chatbot2.png" // Assuming the icon is placed in the public directory
                alt="Chatbot"
                style={{ height: "30px" }}
              />
            </center>
          </button>
        </div>
      )}
      {clicked && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: "1000", // Ensure the chatbot is above other content
          }}
        >
          <div
            className="border border-white"
            style={{
              backgroundImage: `url('/background.png')`,
              backgroundSize: "cover", // Optional: Adjust the background size
              width: "445px",
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Chat container contents */}
            <nav
              className="border border-white rounded-md inline-flex items-center"
              style={{
                backgroundColor: "#fff",
                justifyContent: "space-between",
                padding: "16px",
              }}
            >
              <button
                className="items-center border-2 border-black"
                onClick={handleClose}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "20%",
                  backgroundColor: "#004d98", // Set button color
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                <center>
                  <img
                    src="/back.png" // Assuming the icon is placed in the public directory
                    alt="back"
                    style={{ height: "21px" }}
                  />
                </center>
              </button>

              <div
                className="border border-white inline"
                style={{
                  gridTemplateColumns: "auto auto",
                  marginLeft: "85px",
                  marginRight: "94px",
                }}
              >
                <h1
                  className="text-xl font-semibold border border-white py-2 px-2"
                  style={{
                    backgroundColor: "#004d98",
                    color: "#fff",
                  }}
                >
                  Kickoff Chatbot
                </h1>
              </div>
              <div></div>
            </nav>

            <div
              ref={messageContainerRef}
              className="border-2 border-white"
              style={{
                backgroundColor: "#fff",
                padding: "8px",
                borderRadius: "8px",
                height: "320px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                maxHeight: "320px",
                overflowY: "auto",
                marginBottom: "10px",
                marginTop: "10px",
              }}
            >
              {/* Displaying messages */}
              <div>
                {messages.map((message, index) => (
                  <div key={index}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: message.startsWith("Bot")
                          ? "flex-start"
                          : "flex-end",
                        marginBottom: "10px",
                        alignItems: "center",
                      }}
                    >
                      {message.startsWith("Bot") ? (
                        <Circle position="left" />
                      ) : null}
                      <div
                        className="border border-black"
                        style={{
                          backgroundColor: message.startsWith("Bot")
                            ? "#c3d1ff"
                            : "#fff", // Blue for Bot, Light blue for You
                          color: message.startsWith("You") ? "#000" : "#000", // White for You, Black for Bot
                          padding: "10px",
                          borderRadius: "8px",
                          display: "inline-block",
                          maxWidth: "320px", // Max width of individual message
                          marginLeft: message.startsWith("Bot") ? "5px" : "0", // Left margin for Bot
                          marginRight: message.startsWith("You") ? "5px" : "0", // Right margin for You
                        }}
                      >
                        <div style={{ padding: "5px" }}>
                          {message
                            .split(":")[1]
                            .split("\n")
                            .map((line, idx) => (
                              <div key={idx}>{line}</div>
                            ))}
                        </div>
                      </div>
                      {message.startsWith("You") ? (
                        <Circle position="right" />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="border-2 border-white"
              style={{
                backgroundColor: "#fff",
                padding: "8px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <input
                type="text"
                placeholder="Ask a question..."
                value={inputValue}
                onChange={handleInputChange}
                style={{
                  width: "calc(100% - 70px)",
                  padding: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginRight: "10px",
                }}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  width: "60px",
                  padding: "5px",
                  borderRadius: "5px",
                  backgroundColor: "#004d98", // Set button color
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
