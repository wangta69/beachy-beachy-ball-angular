// Beachy Beachy Ball
// Copyright (c) 2023 Michael Kolesidis <michael.kolesidis@gmail.com>
// Licensed under the GNU Affero General Public License v3.0.
// https://www.gnu.org/licenses/gpl-3.0.html

// import { useState, useRef } from "react";
// import { useFrame } from "@react-three/fiber";
// import { Float } from "@react-three/drei";
// import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import RAPIER from '@dimforge/rapier3d-compat';
import {Rapier} from '../rapier/Rapier';
import {Mesh} from '../threejs/Mesh';
import {LoaderGlb} from '../threejs/LoaderGlb';
// import type RAPIER from "@dimforge/rapier3d";
// type RAPIER_API = typeof import("@dimforge/rapier3d");
// import useGame from "../../stores/useGame.js";
import Star from "../level/components/Star";
import {createColliderPropsFromChildren} from './src/utils/utils-collider';



export class RigidBody {
  private rapier: Rapier;
  public object3d: any; // Mesh;
  // private glbObject!: LoaderGlb;
  private game: any;
  // public world: any;
  public rigidBody!: RAPIER.RigidBody;
  // public dynamicBodies: [THREE.Object3D, RAPIER.RigidBody][] = [];

  private ignoreMeshColliders = true;
  private options: any = {
    boxGeometry: new THREE.BoxGeometry(1, 1, 1),
    beachMaterial: new THREE.MeshStandardMaterial({ color: "orange" }),
    obstacleMaterial: new THREE.MeshStandardMaterial({ color: "tomato" }),
  }
  private boxGeometry = new THREE.BoxGeometry(1, 1, 1);

  private beachMaterial = new THREE.MeshStandardMaterial({ color: "orange" });
  private obstacleMaterial = new THREE.MeshStandardMaterial({ color: "tomato" });

  public blockDimensions = {
    width: 4.2,
    height: 0.3,
    length: 4,
  };

  constructor(rapier: Rapier) {
    this.rapier = rapier;
  }



  /**
   * 
   * @param args = {rigidBody, geometry, material, mesh}
   */
  public async create(params: any) {

    // if(params.glb) {
    //   const loaderGlb = new LoaderGlb();
    //   this.object3d = await loaderGlb.create(params.glb);
    // } else {
    //   this.object3d = new Mesh({geometry: params.geometry, material: params.material, mesh: params.mesh});
    // }
    
    this.object3d = params.object3d;


    // if(meshOpt.scale && meshOpt.type==='mesh') mesh.scale.set(meshOpt.scale[0], meshOpt.scale[1], meshOpt.scale[2]);
    
    // if(meshOpt.castShadow) mesh.castShadow = true;
    // if(meshOpt.receiveShadow) mesh.receiveShadow = true;
    // group.add(mesh);
    const option = params.rigidBody;
  //  / let rigidBody: any;
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

   

    
    // option.position ? rigidBodyDesc.translation(option.position.x, option.position.y, option.position.z) : null;
    // option.friction ? rigidBodyDesc.friction(option.friction) : null;
    // if(option.restitution) {


    // const rigidBody = this.game.world.rapierWorld.createRigidBody(
    //   RAPIER.RigidBodyDesc.kinematicPositionBased()
    //   .setTranslation(0, 0.4, 0)
    //   //.setCanSleep(false)
    // );

   

    const _matrix4 = new THREE.Matrix4();
    const _position = new THREE.Vector3();
    const _rotation = new THREE.Quaternion();
    const _scale = new THREE.Vector3();
    const invertedParentMatrixWorld = this.object3d.matrixWorld.clone().invert();


    const worldScale = this.object3d.getWorldScale(_scale);

    this.object3d.updateWorldMatrix(true, false);

      _matrix4
      .copy(this.object3d.matrixWorld)
      .premultiply(invertedParentMatrixWorld)
      .decompose(_position, _rotation, _scale);

    const rotationEuler = new THREE.Euler().setFromQuaternion(_rotation, "XYZ");

    const shape = option.colliders || 'cuboid';
    const { args, offset } = this.getColliderArgsFromGeometry(
      this.object3d.geometry, // geometry,
      shape
    );

    // console.log('worldScale:', worldScale);
    // console.log('_position:', _position);
    // console.log('offset:', offset);
    // rigidBodyDesc.shape = shape;
    // rigidBodyDesc.rotation = [rotationEuler.x, rotationEuler.y, rotationEuler.z]
    // // rigidBodyDesc.scale = [worldScale.x, worldScale.y, worldScale.z];
    rigidBodyDesc.setTranslation(
      _position.x + offset.x * worldScale.x,
      _position.y + offset.y * worldScale.y,
      _position.z + offset.z * worldScale.z
    )
    // rigidBodyDesc.setGravityScale(0.0001);

    // rigidBodyDesc.gravityScale = 0.0001;

    // console.log('rigidBodyDesc:', rigidBodyDesc);

    // this.object3d.position.set(_position);

    // rigidBodyDesc.position = [
    //   _position.x + offset.x * worldScale.x,
    //   _position.y + offset.y * worldScale.y,
    //   _position.z + offset.z * worldScale.z
    // ];
    // if (options.includeInvisible) {
    //   object.traverse(this.colliderFromChild(object.child));
    // } else {
    //   object.traverseVisible(colliderFromChild);
    // }


    let colliderDesc: RAPIER.ColliderDesc;
    switch(option.colliders) {
      case 'ball':
        colliderDesc = RAPIER.ColliderDesc.ball(args[0]);
        break;
      case 'trimesh':
        console.log('trimesh: args:', args);
        const a0 = args[0].map((x:number) => x * 0.01);
        colliderDesc = RAPIER.ColliderDesc.trimesh(a0, args[1]);
        // colliderDesc = RAPIER.ColliderDesc.trimesh(args[0], args[1]);
        break;
      default:
        colliderDesc = RAPIER.ColliderDesc.cuboid(args[0], args[1], args[2]);
        break;
    }
    

    // // colliderDesc.setMass(1);
    option.restitution ? colliderDesc.setRestitution(option.restitution): null;
    option.friction ? colliderDesc.setFriction(option.friction): null;

    
    // colliderDesc.scale = [worldScale.x, worldScale.y, worldScale.z]; 
    // colliderDesc.setScscale = [0.00001, 0.00001, 0.00001]; 
    // console.log('rigidBodyDesc1:', rigidBodyDesc);
    this.rigidBody = this.rapier.world.createRigidBody(rigidBodyDesc);

    
    console.log('rigidBodyDesc2:', rigidBodyDesc);
    option.linearDamping ? rigidBodyDesc.setLinearDamping(option.linearDamping) : null;
    option.angulularDamping ? rigidBodyDesc.setAngularDamping(option.angulularDamping) : null;
    // rigidBodyDesc.setGravityScale(worldScale);
    // option.restitution ? colliderDesc.restitution(option.restitution) : null;

    // this.rigidBody.setTranslation(
      
    //   {x: _position.x + offset.x * worldScale.x,
    //   y: _position.y + offset.y * worldScale.y,
    //   z: _position.z + offset.z * worldScale.z}, true
    // )


    this.rapier.world.createCollider(colliderDesc, this.rigidBody);
    this.rapier.dynamicBodies.push([this.object3d, this.rigidBody]);

    console.log('colliderDesc', colliderDesc);
    console.log("this.rigidBody", this.rigidBody);
    
    return this.rigidBody;
  }

  private isChildOfMeshCollider(child: THREE.Mesh) {
    let flag = false;
    child.traverseAncestors((a) => {
      if ((a.userData as any).r3RapierType === "MeshCollider") flag = true;
    });
    return flag;
  };
/*
  private colliderFromChild(child: THREE.Object3D) {

    const _matrix4 = new THREE.Matrix4();
    const _position = new THREE.Vector3();
    const _rotation = new THREE.Quaternion();
    const _scale = new THREE.Vector3();

    if ("isMesh" in child) {
      if (this.BlockPlatformLimboignoreMeshColliders && this.isChildOfMeshCollider(child as THREE.Mesh)) return;

      const worldScale = child.getWorldScale(_scale);
      const shape = autoColliderMap[
        options.colliders || "cuboid"
      ] as ColliderShape;

      child.updateWorldMatrix(true, false);
      _matrix4
        .copy(child.matrixWorld)
        .premultiply(invertedParentMatrixWorld)
        .decompose(_position, _rotation, _scale);

      const rotationEuler = new THREE.Euler().setFromQuaternion(_rotation, "XYZ");

      const { geometry } = child as Mesh;
      const { args, offset } = this.getColliderArgsFromGeometry(
        geometry,
        options.colliders || "cuboid"
      );

      const colliderProps: ColliderProps = {
        ...cleanRigidBodyPropsForCollider(options),
        args: args,
        shape: shape,
        rotation: [rotationEuler.x, rotationEuler.y, rotationEuler.z],
        position: [
          _position.x + offset.x * worldScale.x,
          _position.y + offset.y * worldScale.y,
          _position.z + offset.z * worldScale.z
        ],
        scale: [worldScale.x, worldScale.y, worldScale.z]
      };

      childColliderProps.push(colliderProps);
    }
  };
  */


  private getColliderArgsFromGeometry(
    geometry: any, // THREE.BufferGeometry
    colliders: string
  ){

  // ): { args: unknown[]; offset: Vector3 } => {
   
    switch (colliders) {
      case "cuboid":
        {

          
          geometry.computeBoundingBox();
          const { boundingBox } = geometry;
  
          const size = boundingBox!.getSize(new THREE.Vector3());
  
          return {
            args: [size.x / 2, size.y / 2, size.z / 2],
            offset: boundingBox!.getCenter(new THREE.Vector3())
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
          // const clonedGeometry = geometry.index
          //   ? geometry.clone()
          //   : mergeVertices(geometry);

          const clonedGeometry = geometry.clone();
  
          return {
            args: [
              (clonedGeometry.attributes as any).position.array as Float32Array,
              clonedGeometry.index?.array as Uint32Array
            ],
            offset: new THREE.Vector3()
          };
        }
        break;
  
      case "hull":
        {
          const g = geometry.clone();
  
          return {
            args: [(g.attributes as any).position.array as Float32Array],
            offset: new THREE.Vector3()
          };
        }
        break;
    }
  
    return { args: [], offset: new THREE.Vector3() };
  };

}


