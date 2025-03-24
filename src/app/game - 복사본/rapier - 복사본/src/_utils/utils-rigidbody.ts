import { RigidBody, RigidBodyDesc,  } from "@dimforge/rapier3d-compat";
// import { useEffect, useMemo } from "react";
import { Matrix4, Object3D, Vector3, } from "three";
import { RigidBodyProps , Boolean3Tuple, Vector3Tuple } from "../index";
import {vectorArrayToVector3, vector3ToRapierVector} from './utils'
import  {
  ColliderProps
} from '../components/AnyCollider'
import {
  EventMap,
  RigidBodyState,
  RigidBodyStateMap
} from '../components/Physics';

import {
  _matrix4,
  _position,
  _rotation,
  _scale,
  _vector3
} from "./shared-objects";

// import { rigidBodyTypeFromString, vectorToTuple } from "./utils";
import { rigidBodyTypeFromString, vectorToTuple } from "./utils";

export const rigidBodyDescFromOptions = (options: RigidBodyProps) => {
  const type = rigidBodyTypeFromString(options?.type || "dynamic");

  const desc = new RigidBodyDesc(type);

  // Apply immutable options
  desc.canSleep = options?.canSleep ?? true;

  return desc;
};

/*
interface CreateRigidBodyStateOptions {
  object: Object3D;
  rigidBody: RigidBody;
  setMatrix?: (matrix: Matrix4) => void;
  getMatrix?: (matrix: Matrix4) => Matrix4;
  worldScale?: Vector3;
  meshType?: RigidBodyState["meshType"];
}
*/
/*
export const createRigidBodyState = ({
  rigidBody,
  object,
  setMatrix,
  getMatrix,
  worldScale,
  meshType = "mesh"
}: CreateRigidBodyStateOptions): RigidBodyState => {
  object.updateWorldMatrix(true, false);
  const invertedWorldMatrix = object.parent!.matrixWorld.clone().invert();

  return {
    object,
    rigidBody,
    invertedWorldMatrix,
    setMatrix: setMatrix
      ? setMatrix
      : (matrix: Matrix4) => {
          object.matrix.copy(matrix);
        },
    getMatrix: getMatrix
      ? getMatrix
      : (matrix: Matrix4) => matrix.copy(object.matrix),
    scale: worldScale || object.getWorldScale(_scale).clone(),
    isSleeping: false,
    meshType
  };
};

type ImmutableRigidBodyOptions = (keyof RigidBodyProps)[];
*/
/*
export const immutableRigidBodyOptions: ImmutableRigidBodyOptions = [
  "args",
  "colliders",
  "canSleep"
];

type MutableRigidBodyOptions = {
  [Prop in keyof RigidBodyProps]: (rb: RigidBody, value: any) => void;
};
*/
// export const mutableRigidBodyOptions: MutableRigidBodyOptions = {

export const mutableRigidBodyOptions: any = {
  gravityScale: (rb: RigidBody, value: number) => {
    rb.setGravityScale(value, true);
  },
  additionalSolverIterations(rb: RigidBody, value: number) {
    rb.setAdditionalSolverIterations(value);
  },
  linearDamping: (rb: RigidBody, value: number) => {
    rb.setLinearDamping(value);
  },
  angularDamping: (rb: RigidBody, value: number) => {
    rb.setAngularDamping(value);
  },
  dominanceGroup: (rb: RigidBody, value: number) => {
    rb.setDominanceGroup(value);
  },
  enabledRotations: (rb: RigidBody, [x, y, z]: Boolean3Tuple) => {
    rb.setEnabledRotations(x, y, z, true);
  },
  enabledTranslations: (rb: RigidBody, [x, y, z]: Boolean3Tuple) => {
    rb.setEnabledTranslations(x, y, z, true);
  },
  lockRotations: (rb: RigidBody, value: boolean) => {
    rb.lockRotations(value, true);
  },
  lockTranslations: (rb: RigidBody, value: boolean) => {
    rb.lockTranslations(value, true);
  },
  angularVelocity: (rb: RigidBody, [x, y, z]: Vector3Tuple) => {
    rb.setAngvel({ x, y, z }, true);
  },
  linearVelocity: (rb: RigidBody, [x, y, z]: Vector3Tuple) => {
    rb.setLinvel({ x, y, z }, true);
  },
  ccd: (rb: RigidBody, value: boolean) => {
    rb.enableCcd(value);
  },
  softCcdPrediction: (rb: RigidBody, value: number) => {
    rb.setSoftCcdPrediction(value);
  },
  userData: (rb: RigidBody, value: { [key: string]: any }) => {
    rb.userData = value;
  },
  type(rb: any, value: any) {
    rb.setBodyType(rigidBodyTypeFromString(value), true);
  },
  position: () => {},
  rotation: () => {},
  quaternion: () => {},
  scale: () => {}
};


const mutableRigidBodyOptionKeys = Object.keys(mutableRigidBodyOptions);

export const setRigidBodyOptions = (
  rigidBody: RigidBody,
  options: RigidBodyProps
  // options: RigidBodyProps
) => {

  console.log('# setRigidBodyOptions: options', options);
  if (!rigidBody) {
    return;
  }

  // rigidBody.setTranslation(_position, false);
  // rigidBody.setRotation(_rotation, false);

  // options.position ? rigidBody.setTranslation(vector3ToRapierVector(options.position), false) : null;
  options.position ? rigidBody.setTranslation(options.position, false) : null;
  options.rotation ? rigidBody.setRotation(options.rotation, false) : null;
  // rigidBody.setRotation(vectorArrayToVector3(<Vector3Tuple>options.rotation), false)
  mutableRigidBodyOptionKeys.forEach((key) => {

    if (key in options) {
      console.log('key in options: key:', key);
      mutableRigidBodyOptions[key as keyof RigidBodyProps]!(
        rigidBody,
        options[key as keyof RigidBodyProps]
        // options[key as keyof RigidBodyProps]
      );
    }
  });

};
/*
export const setRigidBodyOptions = (
  rigidBody: RigidBody,
  options: RigidBodyProps,
  object: Object3D,
  // states: RigidBodyStateMap,
  updateTranslations: boolean = true
) => {
  if (!rigidBody) {
    return;
  }

  if (updateTranslations) {
    object.updateWorldMatrix(true, false);

    _matrix4
      .copy(object.matrixWorld)
      .decompose(_position, _rotation, _scale);

    rigidBody.setTranslation(_position, false);
    rigidBody.setRotation(_rotation, false);
  }
  mutableRigidBodyOptionKeys.forEach((key) => {

    if (key in options) {
      mutableRigidBodyOptions[key as keyof RigidBodyProps]!(
        rigidBody,
        options[key as keyof RigidBodyProps]
      );
    }
  });

};
*/
export const useUpdateRigidBodyOptions = (
  getRigidBody: RigidBody,
  // getRigidBody: () => RigidBody,
  props: RigidBodyProps,
  // states: RigidBodyStateMap,
  updateTranslations: boolean = true
) => {
  // TODO: Improve this, split each prop into its own effect
  const mutablePropsAsFlatArray =
    (props: RigidBodyProps) =>
      mutableRigidBodyOptionKeys.flatMap((key) => {
        return vectorToTuple(props[key as keyof RigidBodyProps]);
      })
  ;

  // return mutablePropsAsFlatArray;

};
/*
export const useRigidBodyEvents = (
  // getRigidBody: () => RigidBody,
  getRigidBody: any,
  props: RigidBodyProps,
  events: EventMap
) => {
  const {
    onWake,
    onSleep,
    onCollisionEnter,
    onCollisionExit,
    onIntersectionEnter,
    onIntersectionExit,
    onContactForce
  } = props;

  const eventHandlers = {
    onWake,
    onSleep,
    onCollisionEnter,
    onCollisionExit,
    onIntersectionEnter,
    onIntersectionExit,
    onContactForce
  };
};
*/