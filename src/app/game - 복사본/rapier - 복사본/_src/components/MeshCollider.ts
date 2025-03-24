// import React, { ReactNode, useRef, useMemo, memo } from "react";
import { Object3D } from "three";
import { AnyCollider } from "../_index";
import { useChildColliderProps, useRapier } from "../hooks/hooks";
import { useRigidBodyContext } from "./RigidBody";
import { RigidBodyAutoCollider } from "../types";

export interface MeshColliderProps {
  // children: ReactNode;
  // type: RigidBodyAutoCollider;
  children: any;
  type: RigidBodyAutoCollider;
}

/**
 * A mesh collider is a collider that is automatically generated from the geometry of the children.
 * @category Colliders
 */

export const MeshCollider = (props: MeshColliderProps) => {
  const { children, type } = props;
  const { physicsOptions } = useRapier();
  const object = null; // useRef<Object3D>(null);
  const { options } = useRigidBodyContext();

  const mergedOptions = {
      ...physicsOptions,
      ...options,
      children: undefined,
      colliders: type
  };

  const childColliderProps = useChildColliderProps(
    object,
    mergedOptions,
    false
  );

  return {
    // <object3D
    //   ref={object}
    //   userData={{
    //     r3RapierType: "MeshCollider"
    //   }}
    // >
    //   {children}
    //   {childColliderProps.map((colliderProps, index) => (
    //     <AnyCollider key={index} {...colliderProps} />
    //   ))}
    // </object3D>
  };
};
/*
MeshCollider.displayName = "MeshCollider";
*/
