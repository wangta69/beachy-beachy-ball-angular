// import { useFrame } from "@react-three/fiber";
// import React, { memo } from "react";
import { useRaf } from "../utils/utils-physics";
import { PhysicsProps } from "./Physics";

interface FrameStepperProps {
  type?: PhysicsProps["updateLoop"];
  onStep: (dt: number) => void;
  updatePriority?: number;
}

const UseFrameStepper = (onStep:(dt: number) => void, updatePriority?: number) => {
  // useFrame((_, dt) => {
  //   onStep(dt);
  // }, updatePriority);

  return null;
};

const RafStepper = (onStep: (dt: number) => void) => {
  useRaf((dt) => {
    onStep(dt);
  });

  return null;
};

export const FrameStepper = (onStep:(dt: number) => void,  type?: PhysicsProps["updateLoop"], updatePriority?: number) => {
  return type === "independent" ? (
    // <RafStepper onStep={onStep} />
    RafStepper(onStep)
  ) : (
    UseFrameStepper(onStep, updatePriority)
  );
};
/*
export default memo(FrameStepper);
*/