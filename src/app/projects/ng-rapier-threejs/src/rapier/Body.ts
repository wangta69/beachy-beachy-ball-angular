import { Injectable, Injector, inject } from '@angular/core';
import * as THREE from "three";
// import { Euler, Matrix4, Object3D, Quaternion, Vector3 } from "three";

import RAPIER from '@dimforge/rapier3d-compat';
import {Rapier} from './Rapier';
import {ColliderPropsFromMesh} from './ColliderPropsFromMesh';
import {RapierColliderDesc} from './RapierColliderDesc';
import {RapierRigidBody} from './RapierRigidBody';

// import {
//   CreateColliderPropsFromMesh, 
//   createShapeFromOptions, 
//   setColliderOptions,
// } from './src/_utils/utils-collider';
// import {
//   rigidBodyDescFromOptions,
//   setRigidBodyOptions,
// } from "./src/_utils/utils-rigidbody"

// import  {
//   ColliderProps
// } from './src/components/AnyCollider'

@Injectable()
export class Body {
  private rapier: Rapier;
  public object3d!: THREE.Object3D; // Mesh;
  public rigidBody!: RAPIER.RigidBody;
  // public useFrame = () => {};
  public useFrame!: {(argument:any): void;};
  private eventQueue: RAPIER.EventQueue;

  // private collideCallback!: () => void;
  private onCollisionEnter!: (args?:any) => void;

  constructor(rapier: Rapier) {
    this.rapier = rapier;
    this.eventQueue = new RAPIER.EventQueue(true);
  }

  /**
   * 
   * @param args = {object3d, collider}
   */
  public async create(params: any) {
    this.object3d = params.object3d;

    // 메시를 이용하여 기본적인 정보를 불러온다(position, rotation, scale, args, colliders, offset)
    const colliderPropsFromMesh = new ColliderPropsFromMesh();
    const props = colliderPropsFromMesh.create(params);
    // console.log('props:', props);
    /*
    // const option = params.rigidBody;
    const colliderOpt = params.collider;
    console.log('[ name ] ==========:', params.rigidBody.name);
    */
    if(params.collider.onCollisionEnter) {
      this.onCollisionEnter = params.collider.onCollisionEnter;
    }
/*
    if(colliderOpt) { //colliderOpt 가 있으면 이 부분을 적용

    } else {

    }
*/  const rapierColliderDesc = new RapierColliderDesc();
    const colliderDesc: RAPIER.ColliderDesc = <RAPIER.ColliderDesc>rapierColliderDesc.createShapeFromOptions(props);
    
/*
    // const collierProps: ColliderProps = CreateColliderPropsFromMesh({object: this.object3d, options: params.collider, ignoreMeshColliders: true})
    const colliderDesc: RAPIER.ColliderDesc = <RAPIER.ColliderDesc>createShapeFromOptions(props);
    // collier(cuboid, ball....), scale(scale은 모양을 나타낼때 사용), mass, restituion
    console.log('collierProps:', collierProps);
    

    
    */
    const rapierRigidBody = new RapierRigidBody()
    const rigidBodyDesc = <RAPIER.RigidBodyDesc>rapierRigidBody.createRigidBodyFromOptions(props);
    // this.rigidBody = this.rapier.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0).setCanSleep(false));
    /*
    // console.log('option:', option);
    const rigidBodyDesc = rigidBodyDescFromOptions(collierProps); // 기본적인 형태만 가져옮 (type을 이용하여 new RigidBodyDesc(type);)

    this.rigidBody = this.rapier.world.createRigidBody(rigidBodyDesc);
 
    setRigidBodyOptions(this.rigidBody, collierProps);
    
    
    const collider = this.rapier.world.createCollider(colliderDesc, this.rigidBody);
    setColliderOptions(collider, collierProps, this.object3d);
    console.log('colliderDesc: ', colliderDesc);
    console.log('rigidBodyDesc: ', rigidBodyDesc);
    console.log('rigidBody: ', this.rigidBody);
    console.log('collider: ', collider);
    collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)// CONTACT_FORCE_EVENTS


    


    // const events = new RAPIER.Map

    // events.set(this.rigidBody.handle, {
    //   onCollisionEnter: this.onCollisionEnter1
    //   // onCollisionEnter,
    //   // onCollisionExit,
    //   // onIntersectionEnter,
    //   // onIntersectionExit,
    //   // onContactForce
    // });


    return this.rigidBody;
    */

    // const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5).setMass(1);
    // this.rigidBody = this.rapier.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0).setCanSleep(false));
    this.rigidBody = this.rapier.world.createRigidBody(rigidBodyDesc);
    this.rapier.world.createCollider(colliderDesc, this.rigidBody);

    this.rapier.dynamicBodies.push(this);

    return this.rigidBody;
  }


  public update(time: number) {
    if(typeof this.onCollisionEnter === 'function') {
      // https://github.com/8Observer8/pong-2d-noobtuts-port-rapier2dcompat-webgl-js-the-raw-is-undefined/blob/main/src/index.js
      this.rapier.world.step(this.eventQueue);
      this.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
        if (started) {
          this.rapier.world.narrowPhase.contactPair(handle1, handle2, (manifold, flipped) => {
            this.onCollisionEnter();
          });
        }
      });
    }
    if(this.useFrame) {
      this.useFrame({time});
    }
  }









  
}


