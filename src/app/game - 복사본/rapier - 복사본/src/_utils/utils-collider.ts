import {
  Collider,
  ColliderDesc,
  ActiveEvents,
  RigidBody,
  World,
  Vector
} from "@dimforge/rapier3d-compat";
// import { useEffect, useMemo } from "react";
import { BufferGeometry, Euler, Mesh, Object3D, Vector3 } from "three";
import { mergeVertices } from './BufferGeometryUtils';
import { ColliderProps, RigidBodyProps } from "../index";

import {
  ColliderState,
  ColliderStateMap,
  EventMap
} from "../components/Physics";

import {
  _matrix4,
  _position,
  _rotation,
  _scale,
  _vector3
} from './shared-objects';

import { ColliderShape, RigidBodyAutoCollider } from "../types.ts.adf";

import { scaleVertices, vectorToTuple } from "./utils";

export const scaleColliderArgs = (
  shape: ColliderShape,
  args: (number | ArrayLike<number> | { x: number; y: number; z: number })[],
  scale: Vector3
) => {
  const newArgs = args.slice();

  switch(shape) {
    case 'heightfield': // Heightfield uses a vector
      const s = newArgs[3] as { x: number; y: number; z: number };
      s.x *= scale.x;
      s.x *= scale.y;
      s.x *= scale.z;

      return newArgs;
    case 'trimesh':
    case 'convexHull':
      newArgs[0] = scaleVertices(newArgs[0] as ArrayLike<number>, scale);
      return newArgs;
    default:
      const scaleArray = [scale.x, scale.y, scale.z, scale.x, scale.x];
      return newArgs.map((arg, index) => scaleArray[index] * (arg as number));
  }
  
};


export const createShapeFromOptions = (
  options: ColliderProps, // any,
  // world: World,
  // scale: Vector3,
  // getRigidBody?: () => RigidBody
) => {
  options.scale = options.scale || [1, 1, 1];
  const scale = new Vector3(options.scale[0] || 0, options.scale[1], options.scale[2]);
  const scaledArgs = scaleColliderArgs(options.shape!, options.args, scale);
  let desc;

  switch(options.shape) {
    case 'heightfield': // Heightfield uses a vector
      desc = ColliderDesc[options.shape!](<number>scaledArgs[0], <number>scaledArgs[1], <Float32Array<ArrayBufferLike>>scaledArgs[2], <Vector>scaledArgs[3], <number>scaledArgs[4]);
      break;
    case 'trimesh':
    case 'convexMesh':
      desc = ColliderDesc[options.shape](<Float32Array<ArrayBufferLike>>scaledArgs[0], <Uint32Array<ArrayBufferLike>>scaledArgs[1]);break
    case 'convexHull':
      desc = ColliderDesc[options.shape](<Float32Array<ArrayBufferLike>>scaledArgs[0]);break;
    case 'polyline': desc = ColliderDesc[options.shape!](<Float32Array<ArrayBufferLike>>scaledArgs[0], <Uint32Array<ArrayBufferLike>>scaledArgs[1]);break;
    case 'roundConvexHull': desc = ColliderDesc[options.shape!](<Float32Array<ArrayBufferLike>>scaledArgs[0], <number>scaledArgs[1]);break;
    case 'roundConvexMesh': desc = ColliderDesc[options.shape!](<Float32Array<ArrayBufferLike>>scaledArgs[0], <Uint32Array<ArrayBufferLike>>scaledArgs[1], <number>scaledArgs[2]);break;
  
    case 'ball': desc = ColliderDesc[options.shape](<number>scaledArgs[0]);break;

    case 'capsule': 
    case 'cylinder': 
    case 'cone': 
      desc = ColliderDesc[options.shape!](<number>scaledArgs[0], <number>scaledArgs[1]);break;

    case 'roundCuboid': desc = ColliderDesc[options.shape!](<number>scaledArgs[0], <number>scaledArgs[1], <number>scaledArgs[2], <number>scaledArgs[3]);break;
    default: // cuboid, roundCylinder, roundCone
      desc = ColliderDesc[options.shape!](<number>scaledArgs[0], <number>scaledArgs[1], <number>scaledArgs[2]);
      break;
  }


  return desc;

  // const desc = ColliderDesc[options.shape!](...scaledArgs);
  // return world.createCollider(desc!, getRigidBody?.());
};
/*
export const createColliderFromOptions = (
  options: ColliderProps,
  world: World,
  scale: Vector3,
  getRigidBody?: () => RigidBody
) => {
  const scaledArgs = scaleColliderArgs(options.shape!, options.args, scale);
  // @ts-ignore
  const desc = ColliderDesc[options.shape!](...scaledArgs);

  return world.createCollider(desc!, getRigidBody?.());
};
*/
/*
type ImmutableColliderOptions = (keyof ColliderProps)[];

export const immutableColliderOptions: ImmutableColliderOptions = [
  "shape",
  "args"
];

type MutableColliderOptions = {
  [key in keyof ColliderProps]: (
    collider: Collider,
    value: Exclude<ColliderProps[key], undefined>,
    options: ColliderProps
  ) => void;
};
*/
const massPropertiesConflictError =
  "Please pick ONLY ONE of the `density`, `mass` and `massProperties` options.";

type MassPropertiesType = "mass" | "massProperties" | "density";
const setColliderMassOptions = (
  collider: Collider,
  options: Pick<ColliderProps, MassPropertiesType>
) => {
  if (options.density !== undefined) {
    if (options.mass !== undefined || options.massProperties !== undefined) {
      throw new Error(massPropertiesConflictError);
    }

    // console.log('collider.setDensity:', options.density);
    collider.setDensity(options.density);

    return;
  }

  // collider.setDensity(1);

  // if (options.mass !== undefined) {
  //   if (options.massProperties !== undefined) {
  //     throw new Error(massPropertiesConflictError);
  //   }
  //   console.log('collider.setMass:', options.mass);
  //   collider.setMass(options.mass);
  //   return;
  // }

  if (options.massProperties !== undefined) {
    collider.setMassProperties(
      options.massProperties.mass,
      options.massProperties.centerOfMass,
      options.massProperties.principalAngularInertia,
      options.massProperties.angularInertiaLocalFrame
    );
  }
};

// const mutableColliderOptions: MutableColliderOptions = {
const mutableColliderOptions: any = {
 
  sensor: (collider:Collider, value: boolean) => {
    collider.setSensor(value);
  },
  collisionGroups: (collider:Collider, value: number) => {
    collider.setCollisionGroups(value);
  },
  solverGroups: (collider:Collider, value: number) => {
    collider.setSolverGroups(value);
  },
  friction: (collider:Collider, value: number) => {
    collider.setFriction(value);
  },
  frictionCombineRule: (collider:Collider, value: number) => {
    collider.setFrictionCombineRule(value);
  },
  restitution: (collider:Collider, value: number) => {
    collider.setRestitution(value);
  },
  restitutionCombineRule: (collider:Collider, value: number) => {
    collider.setRestitutionCombineRule(value);
  },
  activeCollisionTypes: (collider:Collider, value: number) => {
    collider.setActiveCollisionTypes(value);
  },
  contactSkin: (collider:Collider, value: number) => {
    collider.setContactSkin(value);
  },

  // To make sure the options all mutable options are listed
  quaternion: () => {},
  position: () => {},
  rotation: () => {},
  scale: () => {}
};

const mutableColliderOptionKeys = Object.keys(
  mutableColliderOptions
) as (keyof ColliderProps)[];

export const setColliderOptions = (
  collider: Collider,
  options: ColliderProps,
  // states: ColliderStateMap
  object:Object3D
) => {
  // const state = states.get(collider.handle);
  const state = collider.handle;
//   if (state) {
 
//     // Update collider position based on the object's position

//     const parentWorldScale = object.getWorldScale(_vector3);
//     const parentInvertedWorldMatrix = null; // for test
//     // const parentInvertedWorldMatrix = state.worldParent?.matrixWorld
//     //   .clone()
//     //   .invert();


//       // object.updateWorldMatrix(true, false);

//     // _matrix4.copy(object.matrixWorld);

//     // if (parentInvertedWorldMatrix) {
//     //   _matrix4.premultiply(parentInvertedWorldMatrix);
//     // }

//     // _matrix4.decompose(_position, _rotation, _scale);

// /*
//     if (collider.parent()) {

      
//       collider.setTranslationWrtParent({
//         x: _position.x * parentWorldScale.x,
//         y: _position.y * parentWorldScale.y,
//         z: _position.z * parentWorldScale.z
//       });
//       collider.setRotationWrtParent(_rotation);
//     } else {
//       */

//     //   collider.setTranslation({
//     //     x: _position.x * parentWorldScale.x,
//     //     y: _position.y * parentWorldScale.y,
//     //     z: _position.z * parentWorldScale.z
//     //   });
//     //   collider.setRotation(_rotation);
//     // // }
 
    // mutableColliderOptionKeys.forEach((key) => {
    //   if (key in options) {

    //     console.log('setColliderOptions: key in options: key:', key);
    //     const option = options[key];
    //     mutableColliderOptions[key]!(
    //       collider,
    //       // @ts-ignore Option does not want to fit into the function, but it will
    //       option,
    //       options
    //     );
    //   }
    // });

    // handle mass separately, because the assignments
    // are exclusive.
      setColliderMassOptions(collider, options);
  // }
};

export const useUpdateColliderOptions = (
  getCollider: () => Collider,
  props: ColliderProps,
  states: ColliderStateMap
) => {
  // TODO: Improve this, split each prop into its own effect
  // const mutablePropsAsFlatArray = useMemo(
  //   () =>
  //     mutableColliderOptionKeys.flatMap((key) => {
  //       return vectorToTuple(props[key as keyof ColliderProps]);
  //     }),
  //   [props]
  // );

  // useEffect(() => {
  //   const collider = getCollider();
  //   setColliderOptions(collider, props, states);
  // }, [...mutablePropsAsFlatArray, getCollider]);
};

const isChildOfMeshCollider = (child: Mesh) => {
  let flag = false;
  child.traverseAncestors((a) => {
    // if (a.userData.r3RapierType === "MeshCollider") flag = true;
  });
  return flag;
};
/*
export const createColliderState = (
  collider: Collider,
  object: Object3D,
  rigidBodyObject?: Object3D | null
): ColliderState => {
  return {
    collider,
    worldParent: rigidBodyObject || undefined,
    object
  };
};
*/
const autoColliderMap: Record<string, string> = {
  cuboid: "cuboid",
  ball: "ball",
  hull: "convexHull",
  trimesh: "trimesh"
};

interface ColliderPropsFromMesh {
  (options: {
    object: Object3D;
    ignoreMeshColliders: boolean;
    options: RigidBodyProps;
  }): ColliderProps;
}

export const CreateColliderPropsFromMesh: ColliderPropsFromMesh =
  ({ object, ignoreMeshColliders = true, options }): ColliderProps => {
    // const childColliderProps: ColliderProps[] = [];
    const childColliderProps: ColliderProps[] = [];
    object.updateWorldMatrix(true, false);
    const invertedParentMatrixWorld = object.matrixWorld.clone().invert();

    const colliderFromChild = (child: Object3D) => {
      if ("isMesh" in child) {
        if (ignoreMeshColliders && isChildOfMeshCollider(child as Mesh)) return;

        const worldScale = child.getWorldScale(_scale);

        const shape = autoColliderMap[
          options.colliders || "cuboid"
        ] as ColliderShape;

        child.updateWorldMatrix(true, false);
        _matrix4
          .copy(child.matrixWorld)
          // .premultiply(invertedParentMatrixWorld)
          .decompose(_position, _rotation, _scale);

        const rotationEuler = new Euler().setFromQuaternion(_rotation, "XYZ");

        const { geometry } = child as Mesh;
        const { args, offset } = getColliderArgsFromGeometry(
          geometry,
          options.colliders || "cuboid"
        );
        // const colliderProps: ColliderProps = {
        const colliderProps: ColliderProps = {
          ...cleanRigidBodyPropsForCollider(options),
          args: args,
          shape: shape,
          mass: options.mass,
          rotation: _rotation,
          position: _position,
          // rotation: [rotationEuler.x, rotationEuler.y, rotationEuler.z],
          // position: [
          //   _position.x + offset.x * worldScale.x,
          //   _position.y + offset.y * worldScale.y,
          //   _position.z + offset.z * worldScale.z
          // ],
          
          scale: _scale,
          type: options.type || 'dynamic'
        };

        childColliderProps.push(colliderProps);
      }
    };

    if (options.includeInvisible) {
      object.traverse(colliderFromChild);
    } else {
      object.traverseVisible(colliderFromChild);
    }

    return childColliderProps[0];
};

export const getColliderArgsFromGeometry = (
  geometry: any,
  colliders: string
  // geometry: BufferGeometry,
  // colliders: RigidBodyAutoCollider
) => {
// ): { args: unknown[]; offset: Vector3 } => {
  switch (colliders) {
    case "cuboid":
      {
        geometry.computeBoundingBox();
        const { boundingBox } = geometry;

        const size = boundingBox!.getSize(new Vector3());

        return {
          args: [size.x / 2, size.y / 2, size.z / 2],
          offset: boundingBox!.getCenter(new Vector3())
        };
      }
      break;

    case "ball":
      {
        geometry.computeBoundingSphere();
        const { boundingSphere } = geometry;

        const radius = boundingSphere!.radius;

        return {
          args: [radius],
          offset: boundingSphere!.center
        };
      }
      break;

    case "trimesh":
      {
        const clonedGeometry = geometry.index
          ? geometry.clone()
          : mergeVertices(geometry);
        // const clonedGeometry = geometry.index
        //   ? geometry.clone()
        //   : geometry.clone();
        // const clonedGeometry = geometry.clone();

        return {
          args: [
            (clonedGeometry.attributes as any).position.array as Float32Array,
            clonedGeometry.index?.array as Uint32Array
          ],
          offset: new Vector3()
        };
      }
      break;

    case "hull":
      {
        const g = geometry.clone();

        return {
          // args: [],
          // offset: new Vector3()
          args: [(g.attributes as any).position.array as Float32Array],
          offset: new Vector3()
        };
      }
      break;
  }

  return { args: [], offset: new Vector3() };
};

/*
export const getActiveCollisionEventsFromProps = (props?: ColliderProps) => {
  return {
    collision: !!(
      props?.onCollisionEnter ||
      props?.onCollisionExit ||
      props?.onIntersectionEnter ||
      props?.onIntersectionExit
    ),
    contactForce: !!props?.onContactForce
  };
};

export const useColliderEvents = (
  getCollider: () => Collider,
  props: ColliderProps,
  events: EventMap,
  
  // The RigidBody can pass down active events to the collider without attaching the event listners

  activeEvents: {
    collision?: boolean;
    contactForce?: boolean;
  } = {}
) => {
  const {
    onCollisionEnter,
    onCollisionExit,
    onIntersectionEnter,
    onIntersectionExit,
    onContactForce
  } = props;
};

*/
export const cleanRigidBodyPropsForCollider = (props: any = {}) => {
  const {
    mass,
    linearDamping,
    angularDamping,
    type,
    onCollisionEnter,
    onCollisionExit,
    onIntersectionEnter,
    onIntersectionExit,
    onContactForce,
    // children,
    canSleep,
    ccd,
    gravityScale,
    softCcdPrediction,
    // ref,
    ...rest
  } = props;
  console.log('inner cleanRigidBodyPropsForCollider: props:', props);
  return rest;
};
