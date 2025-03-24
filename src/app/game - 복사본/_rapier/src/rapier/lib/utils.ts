import {
  Quaternion as RapierQuaternion,
  Vector3
} from "@dimforge/rapier3d-compat";
import * as THREE from "three";

export const vector3ToRapierVector = (v: THREE.Vector3Like) => {
  if (Array.isArray(v)) {
    return new Vector3(v[0], v[1], v[2]);
  } else if (typeof v === "number") {
    return new Vector3(v, v, v);
  } else {
    const threeVector3 = v as THREE.Vector3;
    return new Vector3(threeVector3.x, threeVector3.y, threeVector3.z);
  }
};