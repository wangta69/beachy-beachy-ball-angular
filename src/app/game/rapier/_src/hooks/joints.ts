import {
  FixedImpulseJoint,
  ImpulseJoint,
  PrismaticImpulseJoint,
  RevoluteImpulseJoint,
  RopeImpulseJoint,
  SphericalImpulseJoint,
  SpringImpulseJoint
} from "@dimforge/rapier3d-compat";
// import { RefObject, useRef } from "react";
import {
  FixedJointParams,
  PrismaticJointParams,
  RapierRigidBody,
  RevoluteJointParams,
  RopeJointParams,
  SphericalJointParams,
  SpringJointParams,
  UseImpulseJoint,
  useRapier
} from "../_index";
import {
  vector3ToRapierVector,
  quaternionToRapierQuaternion
} from "../utils/utils";

import type Rapier from "@dimforge/rapier3d-compat";
import { useImperativeInstance } from "./use-imperative-instance";

/**
 * @internal
 */
export const useImpulseJoint = <JointType extends ImpulseJoint>(
  // body1: RefObject<RapierRigidBody>,
  // body2: RefObject<RapierRigidBody>,
  // params: Rapier.JointData
  body1: any,
  body2: any,
  params: Rapier.JointData
) => {
  const { world } = useRapier();
  // const jointRef = useRef<JointType | undefined>(undefined);
  const jointRef:any = undefined;
  useImperativeInstance(
    () => {
      if (body1.current && body2.current) {
        const newJoint = world.createImpulseJoint(
          params,
          body1.current,
          body2.current,
          true
        ) as JointType;

        jointRef.current = newJoint;

        return newJoint;
      }

      return null; // 에러 방지로 추가
    },
    (joint) => {
      if (joint) {
        jointRef.current = undefined;
        if (world.getImpulseJoint(joint.handle)) {
          world.removeImpulseJoint(joint, true);
        }
      }
    },
    []
  );

  return jointRef;
};

/**
 * A fixed joint ensures that two rigid-bodies don't move relative to each other.
 * Fixed joints are characterized by one local frame (represented by an isometry) on each rigid-body.
 * The fixed-joint makes these frames coincide in world-space.
 *
 * @category Hooks - Joints
 */
export const useFixedJoint: UseImpulseJoint<
  FixedJointParams,
  FixedImpulseJoint
> = (
  body1,
  body2,
  [body1Anchor, body1LocalFrame, body2Anchor, body2LocalFrame]
) => {
  const { rapier } = useRapier();

  return useImpulseJoint<FixedImpulseJoint>(
    body1,
    body2,
    rapier.JointData.fixed(
      vector3ToRapierVector(body1Anchor),
      quaternionToRapierQuaternion(body1LocalFrame),
      vector3ToRapierVector(body2Anchor),
      quaternionToRapierQuaternion(body2LocalFrame)
    )
  );
};

/**
 * The spherical joint ensures that two points on the local-spaces of two rigid-bodies always coincide (it prevents any relative
 * translational motion at this points). This is typically used to simulate ragdolls arms, pendulums, etc.
 * They are characterized by one local anchor on each rigid-body. Each anchor represents the location of the
 * points that need to coincide on the local-space of each rigid-body.
 *
 * @category Hooks - Joints
 */
export const useSphericalJoint: UseImpulseJoint<
  SphericalJointParams,
  SphericalImpulseJoint
> = (body1, body2, [body1Anchor, body2Anchor]) => {
  const { rapier } = useRapier();

  return useImpulseJoint<SphericalImpulseJoint>(
    body1,
    body2,
    rapier.JointData.spherical(
      vector3ToRapierVector(body1Anchor),
      vector3ToRapierVector(body2Anchor)
    )
  );
};

/**
 * The revolute joint prevents any relative movement between two rigid-bodies, except for relative
 * rotations along one axis. This is typically used to simulate wheels, fans, etc.
 * They are characterized by one local anchor as well as one local axis on each rigid-body.
 *
 * @category Hooks - Joints
 */
export const useRevoluteJoint: UseImpulseJoint<
  RevoluteJointParams,
  RevoluteImpulseJoint
> = (body1, body2, [body1Anchor, body2Anchor, axis, limits]) => {
  const { rapier } = useRapier();

  const params = rapier.JointData.revolute(
    vector3ToRapierVector(body1Anchor),
    vector3ToRapierVector(body2Anchor),
    vector3ToRapierVector(axis)
  );

  if (limits) {
    params.limitsEnabled = true;
    params.limits = limits;
  }

  return useImpulseJoint<RevoluteImpulseJoint>(body1, body2, params);
};

/**
 * The prismatic joint prevents any relative movement between two rigid-bodies, except for relative translations along one axis.
 * It is characterized by one local anchor as well as one local axis on each rigid-body. In 3D, an optional
 * local tangent axis can be specified for each rigid-body.
 *
 * @category Hooks - Joints
 */
export const usePrismaticJoint: UseImpulseJoint<
  PrismaticJointParams,
  PrismaticImpulseJoint
> = (body1, body2, [body1Anchor, body2Anchor, axis, limits]) => {
  const { rapier } = useRapier();

  const params = rapier.JointData.prismatic(
    vector3ToRapierVector(body1Anchor),
    vector3ToRapierVector(body2Anchor),
    vector3ToRapierVector(axis)
  );

  if (limits) {
    params.limitsEnabled = true;
    params.limits = limits;
  }

  return useImpulseJoint<PrismaticImpulseJoint>(body1, body2, params);
};

/**
 * The rope joint limits the max distance between two bodies.
 * @category Hooks - Joints
 */
export const useRopeJoint: UseImpulseJoint<
  RopeJointParams,
  RopeImpulseJoint
> = (body1, body2, [body1Anchor, body2Anchor, length]) => {
  const { rapier } = useRapier();

  const vBody1Anchor = vector3ToRapierVector(body1Anchor);
  const vBody2Anchor = vector3ToRapierVector(body2Anchor);

  const params = rapier.JointData.rope(length, vBody1Anchor, vBody2Anchor);

  return useImpulseJoint<RopeImpulseJoint>(body1, body2, params);
};

/**
 * The spring joint applies a force proportional to the distance between two objects.
 * @category Hooks - Joints
 */
export const useSpringJoint: UseImpulseJoint<
  SpringJointParams,
  SpringImpulseJoint
> = (
  body1,
  body2,
  [body1Anchor, body2Anchor, restLength, stiffness, damping]
) => {
  const { rapier } = useRapier();

  const vBody1Anchor = vector3ToRapierVector(body1Anchor);
  const vBody2Anchor = vector3ToRapierVector(body2Anchor);

  const params = rapier.JointData.spring(
    restLength,
    stiffness,
    damping,
    vBody1Anchor,
    vBody2Anchor
  );

  return useImpulseJoint<SpringImpulseJoint>(body1, body2, params);
};
