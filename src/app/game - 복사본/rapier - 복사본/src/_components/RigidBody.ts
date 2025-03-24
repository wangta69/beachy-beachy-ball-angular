/*
import { Object3D } from "three";
import { useChildColliderProps, useRapier } from "../hooks/hooks";
import { useForwardedRef } from "../hooks/use-forwarded-ref";
import { useImperativeInstance } from "../hooks/use-imperative-instance";
*/
import { RapierRigidBody, RigidBodyOptions } from "../types.ts.adf";
/*
import {
  createRigidBodyState,
  immutableRigidBodyOptions,
  rigidBodyDescFromOptions,
  useRigidBodyEvents,
  useUpdateRigidBodyOptions
} from "../utils/utils-rigidbody";
import { AnyCollider } from "./AnyCollider";

// type RigidBodyContextType = {
//   ref: RefObject<Object3D>;
//   getRigidBody: () => RapierRigidBody;
//   options: RigidBodyOptions;
// };

// export const RigidBodyContext = createContext<RigidBodyContextType>(undefined!);
// export const useRigidBodyContext = () => useContext(RigidBodyContext);
export const RigidBodyContext = undefined;

export const useRigidBodyContext = () => {return {options: {}}};
*/
export interface RigidBodyProps extends RigidBodyOptions {
  // children?: ReactNode;
  // ref?: Ref<RapierRigidBody>;
  children: any;
  ref?: any;
}

/**
 * A rigid body is a physical object that can be simulated by the physics engine.
 * @category Components
 */
/*
// export const RigidBody = memo((props: RigidBodyProps) => {
*/
export const RigidBody = (props: RigidBodyProps) => {
  const {
    ref,
    children,

    type,
    position,
    rotation,
    scale,

    quaternion,
    // transformState,
    ...objectProps
  } = props;
}
/*
  const objectRef = null; //useRef<Object3D>(null);
  const rigidBodyRef = useForwardedRef(ref);
  const { world, rigidBodyStates, physicsOptions, rigidBodyEvents } =
    useRapier();

  const mergedOptions: any = () => {
    return {
      ...physicsOptions,
      ...props,
      children: undefined
    };
  };

  const immutablePropArray = immutableRigidBodyOptions.flatMap((key) => {
    return Array.isArray(mergedOptions[key])
      ? [...mergedOptions[key]]
      : mergedOptions[key];
  });

  const childColliderProps = useChildColliderProps(objectRef, mergedOptions);

  // Provide a way to eagerly create rigidbody
  const getRigidBody = useImperativeInstance(
    () => {
      const desc = rigidBodyDescFromOptions(mergedOptions);
      const rigidBody = world.createRigidBody(desc);

      if (typeof ref === "function") {
        ref(rigidBody);
      }
      rigidBodyRef.current = rigidBody;

      return rigidBody;
    },
    (rigidBody) => {
      if (world.getRigidBody(rigidBody.handle)) {
        world.removeRigidBody(rigidBody);
      }
    },
    immutablePropArray
  );


  useUpdateRigidBodyOptions(getRigidBody, mergedOptions, rigidBodyStates);
  useRigidBodyEvents(getRigidBody, mergedOptions, rigidBodyEvents);

  const contextValue = () => {
    return {
      ref: objectRef, // as RigidBodyContextType["ref"],
      getRigidBody: getRigidBody,
      options: mergedOptions
    };
  };

  return null;
};

*/

