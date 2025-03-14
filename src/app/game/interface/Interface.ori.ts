// Beachy Beachy Ball
// Copyright (c) 2023 Michael Kolesidis <michael.kolesidis@gmail.com>
// Licensed under the GNU Affero General Public License v3.0.
// https://www.gnu.org/licenses/gpl-3.0.html

import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { addEffect } from "@react-three/fiber";
import useGame from "../stores/useGame.js";
import useAudio from "../stores/useAudio.js";
import Logo from "../assets/logo_white.svg";

export default function Interface() {
  const time = useRef();
  const { mode, setMode, restart, phase, setIsInGame } = useGame();
  const { audio, toggleAudio } = useAudio();
  // const forward = useKeyboardControls((state) => state.forward);
  // const backward = useKeyboardControls((state) => state.backward);
  // const leftward = useKeyboardControls((state) => state.leftward);
  // const rightward = useKeyboardControls((state) => state.rightward);
  // const jump = useKeyboardControls((state) => state.jump);

  /**
   * Mode
   */
  const [modeName, setModeName] = useState(mode);

  useEffect(() => {
    switch (mode) {
      case "random":
        setModeName("Random");
        break;
      case "tour":
        setModeName("Tour");
        break;
      case "adventure":
        setModeName("Adventure");
        break;
    }
  }, [mode]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Restart game
      if (e.code === "Escape") {
        setIsModalOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, setIsModalOpen]);

  const clearData = () => {
    window.localStorage.clear();
  };

  const handleRestart = () => {
    restart();
  };

  const [selectedMode, setSelectedMode] = useState(null);

  useEffect(() => {
    setSelectedMode(modeOptions.find((m) => m.name === mode));
  }, []);

  function handleModeClick(mode) {
    setSelectedMode(mode);
  }

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState();

      let elapsedTime = 0;

      if (state.phase === "playing") {
        elapsedTime = Date.now() - state.startTime;
      } else if (state.phase === "ended") {
        elapsedTime = state.endTime - state.startTime;
      }

      elapsedTime /= 1000;
      elapsedTime = elapsedTime.toFixed(2);

      if (time.current) {
        time.current.textContent = elapsedTime;
      }
    });

    return () => {
      unsubscribeEffect();
    };
  }, []);

  let modes = [
    { id: "0", text: "Random", name: "random" },
    { id: "1", text: "Tour", name: "tour" },
    { id: "2", text: "Adventure", name: "adventure" },
  ];

  const modeOptions = modes.map((mode) => (
    <div
      key={mode.id}
      class={`mode-selection ${
        selectedMode && selectedMode.name === mode.name ? "selected-mode" : ""
      }`}
      onClick={() => {
        handleModeClick(mode);
        setMode(`${mode.name}`);
        window.localStorage.setItem("mode", `"${mode.name}"`);
        handleRestart();
      }}
    >
      {mode.text}
    </div>
  ));

  return (
    <div class="interface">
      {/* Logo */}
      <img class="logo" src={Logo} alt="Beachy Beachy Ball Logo" />
      {/* Restart */}
      {phase === "ended" && (
        <div class="restart">
          <div class="finished">Finished!</div>
          <img
            src="./icons/replay.png"
            class="restart-button"
            onClick={restart}
          />
          <div>Play Again</div>
        </div>
      )}
      {/* Control Buttons (top-right) */}
      <div class="control-buttons">
        <div class="control-button" id="sound" onClick={toggleAudio}>
          {audio ? (
            <img src="./icons/sound_on.svg" />
          ) : (
            <img src="./icons/sound_off.svg" />
          )}
        </div>
        <div
          class="control-button"
          id="menu"
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <img src="./icons/menu.svg" />
        </div>
      </div>
      {/* Bottom */}
      <div class="bottom">
        {/* Controls */}
        <div class="controls">
          {/* Mode */}
          <div class="bottom-label">Mode</div>
          <div class="mode">{mode}</div>
          {/* <div class="raw">
            <div class={`key ${forward ? "active" : ""}`}></div>
          </div>
          <div class="raw">
            <div class={`key ${leftward ? "active" : ""}`}></div>
            <div class={`key ${backward ? "active" : ""}`}></div>
            <div class={`key ${rightward ? "active" : ""}`}></div>
          </div>
          <div class="raw">
            <div class={`key large ${jump ? "active" : ""}`}></div>
          </div> */}
        </div>
        {/* Time */}
        <div class="bottom-right">
          <div class="time-container">
            <div class="bottom-label">Time</div>
            <div class="time" ref={time}></div>
            {/* <div class="mode">{mode}</div> */}
          </div>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div class="modal" onClick={() => setIsModalOpen(false)}>
          <div class="modal-box" onClick={(e) => e.stopPropagation()}>
            <div class="modal-title">Menu</div>

            <div class="modal-main">
              <div class="section-title">Mode</div>
              <div class="mode-area">{modeOptions}</div>
              <div
                class="modal-button disabled"
                onClick={() => {
                  console.log("High Scores");
                }}
              >
                High Scores
              </div>
              <div
                class="modal-button"
                onClick={() => {
                  clearData();
                }}
              >
                Clear Data
              </div>
              <div
                class="modal-button disabled"
                onClick={() => {
                  console.log("Help");
                }}
              >
                Help
              </div>
              <div
                class="modal-button disabled"
                onClick={() => {
                  console.log("Credits");
                }}
              >
                Credits
              </div>
              <div
                class="modal-button"
                onClick={() => {
                  setIsInGame(false);
                }}
              >
                Main Menu
              </div>
              <div
                class="modal-button"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Back
              </div>
            </div>
            <div class="modal-about-area">
              <div class="modal-about">
                <a href="https://github.com/michaelkolesidis/beachy-beachy-ball">
                  © 2023 Michael Kolesidis.
                </a>
              </div>
              <div class="modal-about">
                <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">
                  Licensed under the GNU AGPL 3.0
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
