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
    
  );
}
