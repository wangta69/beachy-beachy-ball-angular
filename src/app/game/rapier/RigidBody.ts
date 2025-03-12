// Beachy Beachy Ball
// Copyright (c) 2023 Michael Kolesidis <michael.kolesidis@gmail.com>
// Licensed under the GNU Affero General Public License v3.0.
// https://www.gnu.org/licenses/gpl-3.0.html


import * as THREE from "three";
import RAPIER from '@dimforge/rapier3d-compat';
import {Rapier} from '../rapier/Rapier';

import {createColliderPropsFromChildren} from './src/utils/utils-collider';
import {
  rigidBodyDescFromOptions,

} from "./src/utils/utils-rigidbody"

import { UseFrame } from './Interface';

export class RigidBody {
  private rapier: Rapier;
  public object3d: any; // Mesh;
  public rigidBody!: RAPIER.RigidBody;
  // public useFrame = () => {};
  public useFrame!: {(argument:UseFrame): void;};
  constructor(rapier: Rapier) {
    this.rapier = rapier;
  }



  /**
   * 
   * @param args = {rigidBody, object3d}
   */
  public async create(params: any) {
    this.object3d = params.object3d;
    const option = params.rigidBody;

    const childColliderProps = createColliderPropsFromChildren({object: this.object3d, options: option, ignoreMeshColliders: true})
    const desc = rigidBodyDescFromOptions(option);
    const props = childColliderProps[0];


    const args = props.args;
    let colliderDesc: RAPIER.ColliderDesc;

    switch(option.colliders) {
      case 'ball':
        colliderDesc = RAPIER.ColliderDesc.ball(args[0]);
        break;
      case 'trimesh':
        const scale = props.scale ? props.scale[0]: 1;
        const a0 = args[0].map((x:number) => x * (scale as number));
        // const a0 = args[0].map((x:number) => x * 0.012);
        // const a0 = args[0].map((x:number) => x);
        colliderDesc = RAPIER.ColliderDesc.trimesh(a0, args[1]);
        // colliderDesc = RAPIER.ColliderDesc.trimesh(args[0], args[1]);
        break;
      default: // cuboid
        // const scalex: number = props.scale && props.scale[0] ? props.scale[0] : 1;
        args[0] = props.scale ?  props.scale[0] * args[0] : 1;
        args[1] = props.scale ?  props.scale[1] * args[1] : 1;
        args[2] = props.scale ?  props.scale[2] * args[2] : 1;
        colliderDesc = RAPIER.ColliderDesc.cuboid(args[0], args[1], args[2]);
        break;
    }

    props.restitution ? colliderDesc.setRestitution(props.restitution): null;
    props.friction ? colliderDesc.setFriction(props.friction): null;
    // props.rotation ? colliderDesc.setRotation({  x: props.rotation[0], y: props.rotation[1], z: props.rotation[2], w: 1.0 }): null;
    // if(props.rotation) {
    //   const rotaionX:number = typeof props.rotation[0] === 'number' ? props.rotation[0] : 0;
    //   const rotaionY:number = typeof props.rotation[1] === 'number' ? props.rotation[1] : 0;
    //   const rotaionZ:number = typeof props.rotation[2] === 'number' ? props.rotation[2] : 0;
    //   const rotation =  {  x: rotaionX, y: rotaionY, z: rotaionZ, w: 1.0 };
    //   colliderDesc.setRotation(rotation);
    // }
    // props.scale ? colliderDesc.setScale(props.friction): null;

    // new THREE.Vector3(((props.position[0] as unknown) as number), 1, 1)
    // const x = (props.position[0] as number);

    let rigidBodyDesc: RAPIER.RigidBodyDesc;
    switch(option.type) {
      case 'kinematicPosition':
        rigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
          // .setTranslation(0, 0.4, 0)
          //.setCanSleep(false)
        break;
      case 'fixed':
          rigidBodyDesc = RAPIER.RigidBodyDesc.fixed()
        break;
      default: // dynamic
          rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      break;
    }


    props.position ? rigidBodyDesc.translation = new THREE.Vector3(
      ((props.position[0] as unknown) as number), 
      ((props.position[1] as unknown) as number), 
      ((props.position[2] as unknown) as number)):null;
    option.linearDamping ? rigidBodyDesc.setLinearDamping(option.linearDamping) : null;
    option.angulularDamping ? rigidBodyDesc.setAngularDamping(option.angulularDamping) : null;
    // if(props.rotation) {
    //   const rotaionX:number = typeof props.rotation[0] === 'number' ? props.rotation[0] : 0;
    //   const rotaionY:number = typeof props.rotation[1] === 'number' ? props.rotation[1] : 0;
    //   const rotaionZ:number = typeof props.rotation[2] === 'number' ? props.rotation[2] : 0;
    //   const rotation =  {  x: rotaionX, y: rotaionY, z: rotaionZ, w: 1.0 };
    //   rigidBodyDesc.setRotation(rotation);
    // }


    

    this.rigidBody = this.rapier.world.createRigidBody(rigidBodyDesc);
    // this.rigidBody.setRotation({  x: 0.0, y: tween.rotate, z: 0.0, w: 1.0 }, true)
    if(props.rotation) {
      const rotaionX:number = typeof props.rotation[0] === 'number' ? props.rotation[0] : 0;
      const rotaionY:number = typeof props.rotation[1] === 'number' ? props.rotation[1] : 0;
      const rotaionZ:number = typeof props.rotation[2] === 'number' ? props.rotation[2] : 0;
      const rotation =  {  x: rotaionX, y: rotaionY, z: rotaionZ, w: 1.0 };
      this.rigidBody.setRotation(rotation, true);
    }



    this.rapier.world.createCollider(colliderDesc, this.rigidBody);
    // this.rapier.dynamicBodies.push([this.object3d, this.rigidBody]);
    this.rapier.dynamicBodies.push(this);

    return this.rigidBody;
  }

  public update(clock: any) {
    const time = clock.getElapsedTime()
    if(this.useFrame) {
      this.useFrame({time});
    }
    
    // console.log(clock);
    // console.log(this.useFrame);
    // console.log(this.useFrame);
  }
}


