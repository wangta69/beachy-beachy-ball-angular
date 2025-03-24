
import * as THREE from "three";
import {
  RigidBodyDesc,
} from "@dimforge/rapier3d-compat";

export type RigidBodyTypeString =
  | "fixed"
  | "dynamic"
  | "kinematicPosition"
  | "kinematicVelocity";

  const rigidBodyTypeMap = {
    fixed: 1,
    dynamic: 0,
    kinematicPosition: 2,
    kinematicVelocity: 3
  } as const;

const RigidBodyOptions: any = {
  angularDamping: (collider:RigidBodyDesc, value: number) => {
    collider.setAngularDamping(value);
  },
  linearDamping: (collider:RigidBodyDesc, value: number) => {
    collider.setLinearDamping(value);
  },
  position: (collider:RigidBodyDesc, value: THREE.Vector3) => {
    collider.setTranslation(value.x,  value.y, value.z);
  },

  rotation: (collider:RigidBodyDesc, value: THREE.Quaternion ) => {
    collider.setRotation(value);
  },

  userData: (collider:RigidBodyDesc, value: any ) => {
    collider.setUserData(value);
  },
};

export class RapierRigidBody {

  constructor() {}

  public createRigidBodyFromOptions(options: any): RigidBodyDesc | null {
    const type = this.rigidBodyTypeFromString(options?.type || "dynamic");
    const desc = new RigidBodyDesc(type);
    return this.setRigidBodyDescFromOption(<RigidBodyDesc>desc, options);
  };

  private rigidBodyTypeFromString(type: RigidBodyTypeString){
    return rigidBodyTypeMap[type];
  }
  
  private setRigidBodyDescFromOption(desc: RigidBodyDesc, options: any) {
    Object.keys(options).forEach((key: any) =>{
      if(key in RigidBodyOptions) {
        RigidBodyOptions[key](desc, options[key]);
      }
    })
    return desc;
  }
}


