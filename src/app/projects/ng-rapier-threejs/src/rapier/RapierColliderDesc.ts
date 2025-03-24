
import * as THREE from "three";
import {
  Collider,
  ColliderDesc,
  Vector
} from "@dimforge/rapier3d-compat";

export type ColliderShape =
  | "cuboid"
  | "trimesh"
  | "ball"
  | "capsule"
  | "convexHull"
  | "heightfield"
  | "polyline"
  | "roundCuboid"
  | "cylinder"
  | "roundCylinder"
  | "cone"
  | "roundCone"
  | "convexMesh"
  | "roundConvexHull"
  | "roundConvexMesh";


const ColliderOptions: any = {

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
  mass: (collider:Collider, value: number) => {
    collider.setMass(value);
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
  }
};

export class RapierColliderDesc {

  constructor() {}

  public extractPropsFromOptions() {

  }
  public createShapeFromOptions(options: any): ColliderDesc | null {
    const shape:ColliderShape = options.shape;
    const scale = options.scale;
    const scaledArgs = this.scaleColliderArgs(shape!, options.args, scale);
    let desc;
  
    switch(shape) {
      case 'heightfield': // Heightfield uses a vector
        desc = ColliderDesc[shape](<number>scaledArgs[0], <number>scaledArgs[1], <Float32Array<ArrayBufferLike>>scaledArgs[2], <Vector>scaledArgs[3], <number>scaledArgs[4]);
        break;
      case 'trimesh':
      case 'convexMesh':
        desc = ColliderDesc[shape](<Float32Array<ArrayBufferLike>>scaledArgs[0], <Uint32Array<ArrayBufferLike>>scaledArgs[1]);break
      case 'convexHull':
        desc = ColliderDesc[shape](<Float32Array<ArrayBufferLike>>scaledArgs[0]);break;
      case 'polyline': desc = ColliderDesc[shape!](<Float32Array<ArrayBufferLike>>scaledArgs[0], <Uint32Array<ArrayBufferLike>>scaledArgs[1]);break;
      case 'roundConvexHull': desc = ColliderDesc[shape!](<Float32Array<ArrayBufferLike>>scaledArgs[0], <number>scaledArgs[1]);break;
      case 'roundConvexMesh': desc = ColliderDesc[shape!](<Float32Array<ArrayBufferLike>>scaledArgs[0], <Uint32Array<ArrayBufferLike>>scaledArgs[1], <number>scaledArgs[2]);break;
    
      case 'ball': desc = ColliderDesc[shape](<number>scaledArgs[0]);break;
  
      case 'capsule': 
      case 'cylinder': 
      case 'cone': 
        desc = ColliderDesc[shape!](<number>scaledArgs[0], <number>scaledArgs[1]);break;
  
      case 'roundCuboid': 
        desc = ColliderDesc[shape!](<number>scaledArgs[0], <number>scaledArgs[1], <number>scaledArgs[2], <number>scaledArgs[3]);break;
      default: // cuboid, roundCylinder, roundCone
        desc = ColliderDesc[shape!](<number>scaledArgs[0], <number>scaledArgs[1], <number>scaledArgs[2]);
        break;
    }
  
    return this.setColliderDescFromOption(<ColliderDesc>desc, options);
  };


  private setColliderDescFromOption(desc: ColliderDesc, options: any) {
    Object.keys(options).forEach((key: any) =>{
      if(key in ColliderOptions) {
        ColliderOptions[key](desc, options[key]);
      }
    })
    return desc;
  }

  private scaleColliderArgs(
    shape: ColliderShape,
    args: (number | ArrayLike<number> | { x: number; y: number; z: number })[],
    scale: THREE.Vector3
  ) {
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
        newArgs[0] = this.scaleVertices(newArgs[0] as ArrayLike<number>, scale);
        return newArgs;
      default:
        const scaleArray = [scale.x, scale.y, scale.z, scale.x, scale.x];
        return newArgs.map((arg, index) => scaleArray[index] * (arg as number));
    }
    
  };

  private scaleVertices(vertices: ArrayLike<number>, scale: THREE.Vector3){
    const scaledVerts = Array.from(vertices);

    for (let i = 0; i < vertices.length / 3; i++) {
      scaledVerts[i * 3] *= scale.x;
      scaledVerts[i * 3 + 1] *= scale.y;
      scaledVerts[i * 3 + 2] *= scale.z;
    }

    return scaledVerts;
  };
}


