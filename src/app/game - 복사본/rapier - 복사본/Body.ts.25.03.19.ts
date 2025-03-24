import { Injectable, Injector, inject } from '@angular/core';
import * as THREE from "three";
import RAPIER from '@dimforge/rapier3d-compat';
import {Rapier} from './Rapier';

import {
  CreateColliderPropsFromMesh, 
  createColliderFromOptions, 
  setColliderOptions,
} from './src/_utils/utils-collider';
import {
  rigidBodyDescFromOptions,
  setRigidBodyOptions,
} from "./src/_utils/utils-rigidbody"

import  {
  ColliderProps
} from './src/components/AnyCollider'

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
   * @param args = {rigidBody, object3d}
   */
  public async create(params: any) {
    this.object3d = params.object3d;
    // console.log('============ option.name', params.rigidBody.name);
  
    if(params.rigidBody.onCollisionEnter) {
      this.onCollisionEnter = params.rigidBody.onCollisionEnter;
    }
    const option = params.rigidBody;

    // console.log('option:', option)
    const childColliderProps = CreateColliderPropsFromMesh({object: this.object3d, options: option, ignoreMeshColliders: true})
    const rigidBodyDesc = rigidBodyDescFromOptions(option);
    const props: ColliderProps = childColliderProps[0];

    
    // console.log('rigidBodyDesc:', rigidBodyDesc);
    // console.log('props:', props);
    props.scale = props.scale || [1, 1, 1];


    const colliderDesc: RAPIER.ColliderDesc = <RAPIER.ColliderDesc>createColliderFromOptions(
      props,
      new THREE.Vector3(props.scale[0], props.scale[1], props.scale[2]));
    // const colliderDesc: RAPIER.ColliderDesc = <RAPIER.ColliderDesc>createColliderFromOptions(
    //   props, 
    //   this.rapier.world, 
    //   new THREE.Vector3(props.scale[0], props.scale[1], props.scale[2]));
        

    // props.restitution ? colliderDesc.setRestitution(props.restitution): 1;
    // props.friction ? colliderDesc.setFriction(props.friction): 1;

    // option.mass ? colliderDesc.setMass(option.mass): 0;

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

    // let rigidBodyDesc: RAPIER.RigidBodyDesc;
    // switch(option.type) {
    //   case 'kinematicPosition':
    //     rigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
    //       // .setTranslation(0, 0.4, 0)
    //       //.setCanSleep(false)
    //     break;
    //   case 'fixed':
    //       rigidBodyDesc = RAPIER.RigidBodyDesc.fixed()
    //     break;
    //   default: // dynamic
    //       rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    //   break;
    // }

    

    // props.position ? rigidBodyDesc.translation = new THREE.Vector3(
    //   ((props.position[0] as unknown) as number), 
    //   ((props.position[1] as unknown) as number), 
    //   ((props.position[2] as unknown) as number)):null;

      // props.position ? rigidBodyDesc.translation = new THREE.Vector3(
      //   (<number>(props.position[0] as unknown)), 
      //   ((props.position[1] as unknown) as number), 
      //   ((props.position[2] as unknown) as number)):null;

    // option.linearDamping ? rigidBodyDesc.setLinearDamping(option.linearDamping) : null;
    // option.angulularDamping ? rigidBodyDesc.setAngularDamping(option.angulularDamping) : null;
    // if(props.rotation) {
    //   const rotaionX:number = typeof props.rotation[0] === 'number' ? props.rotation[0] : 0;
    //   const rotaionY:number = typeof props.rotation[1] === 'number' ? props.rotation[1] : 0;
    //   const rotaionZ:number = typeof props.rotation[2] === 'number' ? props.rotation[2] : 0;
    //   const rotation =  {  x: rotaionX, y: rotaionY, z: rotaionZ, w: 1.0 };
    //   rigidBodyDesc.setRotation(rotation);
    // }


    this.rigidBody = this.rapier.world.createRigidBody(rigidBodyDesc);
    // console.log('this.rigidBody >>', this.rigidBody);
    // console.log('setRigidBodyOptions', setRigidBodyOptions(this.rigidBody, option));
    // option.name ? this.rigidBody.userData = {name: option.name}: null;
    // option.userData = {name: option.name};
    // console.log('setRigidBodyOptions', setRigidBodyOptions(this.rigidBody, option));

    setRigidBodyOptions(this.rigidBody, option);
    // this.rigidBody.setRotation({  x: 0.0, y: tween.rotate, z: 0.0, w: 1.0 }, true)
    // if(props.rotation) {
    //   const rotaionX:number = typeof props.rotation[0] === 'number' ? props.rotation[0] : 0;
    //   const rotaionY:number = typeof props.rotation[1] === 'number' ? props.rotation[1] : 0;
    //   const rotaionZ:number = typeof props.rotation[2] === 'number' ? props.rotation[2] : 0;
    //   const rotation =  {  x: rotaionX, y: rotaionY, z: rotaionZ, w: 1.0 };
    //   this.rigidBody.setRotation(rotation, true);
    // }



    const collider = this.rapier.world.createCollider(colliderDesc, this.rigidBody);
    // const collider = createColliderFromOptions(props, this.rapier.world, new THREE.Vector3(props.scale[0], props.scale[1], props.scale[2]));
    setColliderOptions(collider, props, this.object3d);
 // console.log('colliderDesc:', colliderDesc);
    // console.log('this.rigidBody:', this.rigidBody);
    console.log('collider:', collider);
    
   
    // option.name ? collider.userData = {name: option.name} | null;
    collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)// CONTACT_FORCE_EVENTS
    // this.rapier.dynamicBodies.push([this.object3d, this.rigidBody]);



    // props.restitution ? collider.setRestitution(props.restitution): 1;
    // props.friction ? collider.setFriction(props.friction): 1;
    // console.log('option.mass:', option.mass);
    // option.mass ? collider.setMass(option.mass): 0;

    // console.log("collider:", collider);


    this.rapier.dynamicBodies.push(this);


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
  }


  public update(time: number) {
    if(typeof this.onCollisionEnter === 'function') {
      // https://github.com/8Observer8/pong-2d-noobtuts-port-rapier2dcompat-webgl-js-the-raw-is-undefined/blob/main/src/index.js
      this.rapier.world.step(this.eventQueue);
      this.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
        this.rapier.world.narrowPhase.contactPair(handle1, handle2, (manifold, flipped) => {
          this.onCollisionEnter();
        });
      });
    }
    if(this.useFrame) {
      this.useFrame({time});
    }
  }

}


