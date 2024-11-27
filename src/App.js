import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { fetchFact } from "./api/utils";
import StarsLoop from "./StarsLoop.mp4"; // Background video
import TestOverlay from "./TestOverlay.webm"; // Transition video
import TimePortalGif from "./TimePortal.gif"; // Logo GIF
import TwitterLogo from "./TwitterPng.png"; // Social media logos
import PhotonLogo from "./PhotonPng.png";
import PortalLogo from "./PortalLogo.png";
import LoadingCircle from "./LoadingCircle.mp4";
import ButtonHoverSound from "./button-hover.mp3";
import TimePortalTheme from "./timeportal-theme.mp3";

function App() {
  const [dateInput, setDateInput] = useState(""); // State for date input
  const [data, setData] = useState([]); // State for date input
  const [facts, setFacts] = useState([]); // State to hold fetched facts
  const [transitionActive, setTransitionActive] = useState(false); // State to control transition video visibility
  const [loadingVisible, setLoadingVisible] = useState(false); // State to control loading video visibility
  const [transitionTriggered, setTransitionTriggered] = useState(false); // State to prevent multiple triggers
  const transitionRef = useRef(null); // Ref for transition video
  const [dateMessage, setDateMessage] = useState("Enter a significant date");
  const audioRef = useRef(null);
  const hoverAudioRef = useRef(null); // Ref for hover sound

  async function generateFact() {
    const [year, month, day] = dateInput.split("-"); // Split input date into components
  
    try {
      const dataReceived = await fetchFact(month, day); // Fetch facts using utility function
      setData(dataReceived);
  
      // Apply the facts once data is successfully set
      await applyFact(dataReceived, year);
    } catch (error) {
      setDateMessage("Server error, please try again");
      console.error(error);
    }
  }
  
  async function applyFact(dataReceived, year) {
    const categories = ["selected", "events", "holidays", "deaths", "births"];
    let allFacts = [];
  
    // Combine all categories of facts into a single array
    categories.forEach((category) => {
      if (dataReceived[category] && dataReceived[category].length > 0) {
        allFacts = allFacts.concat(
          dataReceived[category].map((item) => ({ ...item, category }))
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
      setDateMessage("No significant events found"); // Show message if no facts found
      setFacts([]);
    }
  
    setLoadingVisible(false);
    setTransitionTriggered(false);
  }
  
  async function searchDate() {
    if (!dateInput) {
      setDateMessage("Please enter a valid date!"); // Display error if no date entered
      setFacts([]); // Clear facts
      return;
    }
    setLoadingVisible(true); // Show loading video
  
    // Await the generateFact function to ensure it completes before proceeding
    await generateFact();
  }

  function copyToClipboard() {
    navigator.clipboard.writeText("TOKEN ADDRESS");
    alert("Copied to clipboard! \nTOKEN ADDRESS ");
  }

  function playHoverSound() {
    if (hoverAudioRef.current) {
      hoverAudioRef.current.currentTime = 0; // Restart the sound
      hoverAudioRef.current.play().catch((err) => {
        console.error("Hover sound playback failed:", err);
      });
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.0; // Set volume to 15%
    }

    if (hoverAudioRef.current) {
      hoverAudioRef.current.volume = 0.8; // Set hover sound volume
    }
  }, []);

  return (
    <div className="overflow-auto font-sans space-gas-bg text-white relative">
      {/* Hover Sound */}
      <audio ref={hoverAudioRef}>
        <source src={ButtonHoverSound} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      {/* Background Audio */}
      <audio ref={audioRef} autoPlay loop>
        <source src={TimePortalTheme} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

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
            <img
              src={TwitterLogo}
              alt="Twitter Logo"
              className="w-12 h-12"
              onMouseEnter={playHoverSound} // Play hover sound
            />
          </a>
          <a
            href="https://photon-sol.tinyastro.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="float-wave hover-stop"
          >
            <img
              src={PhotonLogo}
              alt="Photon Logo"
              className="w-12 h-12"
              onMouseEnter={playHoverSound} // Play hover sound
            />
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
            onMouseEnter={playHoverSound} // Play hover sound
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
