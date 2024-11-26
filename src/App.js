import React, { useState, useRef } from "react";
import "./App.css";
import { fetchFact } from "./api/utils";
import StarsLoop from "./StarsLoop.mp4"; // Background video
import TestOverlay from "./TestOverlay.webm"; // Transition video
import TimePortalGif from "./TimePortal.gif"; // Logo GIF
import TwitterLogo from "./TwitterPng.png"; // Social media logos
import PhotonLogo from "./PhotonPng.png";
import PortalLogo from "./PortalLogo.png";
import LoadingCircle from "./LoadingCircle.mp4";

function App() {
  const [dateInput, setDateInput] = useState(""); // State for date input
  const [data, setDataInput] = useState([]); // State for date input
  const [facts, setFacts] = useState([]); // State to hold fetched facts
  const [transitionActive, setTransitionActive] = useState(false); // State to control transition video visibility
  const [loadingVisible, setLoadingVisible] = useState(false); // State to control loading video visibility
  const [transitionTriggered, setTransitionTriggered] = useState(false); // State to prevent multiple triggers
  const transitionRef = useRef(null); // Ref for transition video
  const [dateMessage, setDateMessage] = useState("Enter a significant date");

  async function generateFact() {
    // Function to fetch and display facts based on the input date

    const [year, month, day] = dateInput.split("-"); // Split input date into components

    try {
      const dataReceived = await fetchFact(month, day); // Fetch facts using utility function
      setDataInput(dataReceived);
      setTransitionActive(true);
    } catch (error) {
      setDateMessage("Server error, please try again");
      console.error(error);
    }
  }

  // Function to fetch and display facts based on the input date
  async function applyFact() {
    const [year, month, day] = dateInput.split("-"); // Split input date into components

    // Activate transition once data is fetched
    const categories = ["selected", "events", "holidays", "deaths", "births"];
    let allFacts = [];

    // Combine all categories of facts into a single array
    categories.forEach((category) => {
      if (data[category] && data[category].length > 0) {
        allFacts = allFacts.concat(
          data[category].map((item) => ({ ...item, category }))
        );
      }
    });

    // Filter facts to match the specified year
    const factsForYear = allFacts.filter(
      (fact) => fact.year && parseInt(fact.year) === parseInt(year)
    );

    if (factsForYear.length > 0) {
      setFacts(factsForYear); // Set filtered facts
      setDateMessage("Enter a significant date");
      console.log(factsForYear);
    } else {
      console.log("No significant events");
      setDateMessage("No significant events found"); // Show message if no facts found
      setFacts([]);
    }

    setTransitionTriggered(false);
  }

  // Function triggered when the "Start" button is clicked
  function searchDate() {
    if (!dateInput) {
      setDateMessage("Please enter a valid date!"); // Display error if no date entered
      setFacts([]); // Clear facts
      return;
    }
    setLoadingVisible(true); // Show loading video

    generateFact(); // Start fetching data
  }

  // Function to track video progress and start actions at 90%
  function handleTransitionProgress() {
    const video = transitionRef.current;
    if (!video || transitionTriggered) return;

    const progress = video.currentTime / video.duration;
    if (progress >= 0.7) {
      setTransitionTriggered(true); // Prevent multiple triggers
      applyFact();
    }
    if (progress >= 1) {
      setTransitionActive(false); // Hide transition video
      // Stop loading video
      setLoadingVisible(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText("TOKEN ADDRESS");
    alert("Copied to clipboard! \nTOKEN ADDRESS ");
  }

  return (
    <div className="overflow-auto font-sans space-gas-bg text-white relative">
      <div id="coinLogo">
        <p>Copy Token</p>
        <img
          src={PortalLogo}
          alt="Spinning Coin Logo"
          onClick={copyToClipboard}
        />
      </div>

      {/* Background Video */}
      <video
        id="backgroundVideo"
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src={StarsLoop} type="video/mp4" />
      </video>

      {/* Transition Video */}
      {transitionActive && (
        <video
          ref={transitionRef}
          className="absolute top-0 left-0 w-full h-full object-cover z-50"
          autoPlay
          muted
          onTimeUpdate={handleTransitionProgress} // Track video progress
        >
          <source src={TestOverlay} type="video/webm" />
        </video>
      )}

      {/* Main Content */}
      <div
        id="main-content"
        className="relative flex flex-col items-center min-h-screen text-center"
      >
        <img
          src={TimePortalGif}
          alt="Time Portal Logo"
          className="fade-in glitch"
          width="1000"
        />
        {/* Social Media Links */}
        <div className="flex space-x-4 justify-center mb-6 fade-in">
          <a
            href="https://x.com/INTIMEPORTAL"
            target="_blank"
            rel="noopener noreferrer"
            className="float-wave hover-stop"
          >
            <img src={TwitterLogo} alt="Twitter Logo" className="w-12 h-12" />
          </a>
          <a
            href="https://photon-sol.tinyastro.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="float-wave hover-stop"
          >
            <img src={PhotonLogo} alt="Photon Logo" className="w-12 h-12" />
          </a>
        </div>

        <p className="text-4xl text-gray-100 mb-6">{dateMessage}</p>
        <div className="flex space-x-4 justify-center mb-8">
          <input
            type="date"
            className="px-4 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 text-white-800"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
          <button
            onClick={searchDate}
            disabled={loadingVisible}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md"
          >
            {!loadingVisible && "Enter the Portal"}

            {/* Loading Video */}
            {loadingVisible && (
              <video
                id="loadingVideo"
                autoPlay
                muted
                loop
                className="absolute top-0 left-0 w-full h-full object-cover z-50"
              >
                <source src={LoadingCircle} type="video/mp4" />
              </video>
            )}
          </button>
        </div>

        {/* Facts Output */}
        {facts.length > 0 && (
          <div className="w-10/12 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg p-6 output">
            {facts
              .filter((fact) => fact?.pages?.[0]?.originalimage?.source) // Only include facts with an image
              .map((fact, index) => (
                <div
                  key={index}
                  className="fact-item bg-gray-700 bg-opacity-60 text-white p-4 rounded-lg mb-6"
                >
                  <div className="fact-text mb-4">
                    {/* Conditionally add "was born" or "died" */}
                    {fact.category === "births"
                      ? `${fact.text} was born`
                      : fact.category === "deaths"
                      ? `${fact.text} died`
                      : fact.text}
                  </div>
                  <div>
                    {/* Fact Image */}
                    {fact.pages[0].originalimage.source && (
                      <img
                        src={fact.pages[0].originalimage.source}
                        alt="Fact Image"
                        className="fact-image"
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
