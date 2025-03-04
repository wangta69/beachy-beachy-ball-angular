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
// import type RAPIER from "@dimforge/rapier3d";
// type RAPIER_API = typeof import("@dimforge/rapier3d");
// import useGame from "../../stores/useGame.js";
import Star from "./Star";




export class Blocks {
  private game: any;
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

  constructor(game: any) {
    this.game = game;
  }


  /**
   * 
   * @param rapier = {type, position, restitution, friction}
   * @param mesh  = {type, geometry, material, scale, castShadow, receiveShadow}
   */
  private async createRigidBody(rapierOpt:any, meshOpt:any, group:THREE.Object3D) {

    let mesh: any;

    switch(meshOpt.type) {
      case 'star':
        const star: any = await Star(null);
        mesh = star.children[0];
        mesh.scale.set(meshOpt.scale);
        console.log('star mesh >>', mesh);
        group.add(mesh);
        break;
      default:
        mesh = new THREE.Mesh( this.options[meshOpt.geometry], this.options[meshOpt.material] );
        break;
    }
     
    console.log('====================meshOpt.scale:', meshOpt);
    if(meshOpt.scale && meshOpt.type==='mesh') mesh.scale.set(meshOpt.scale[0], meshOpt.scale[1], meshOpt.scale[2]);
    
    if(meshOpt.castShadow) mesh.castShadow = true;
    if(meshOpt.receiveShadow) mesh.receiveShadow = true;
    group.add(mesh);

    let rigidBody: any;
    switch(rapierOpt.type) {
      case 'kinematicPosition':
        rigidBody = this.game.world.rapierWorld.createRigidBody(
          RAPIER.RigidBodyDesc.kinematicPositionBased()
          // .setTranslation(0, 0.4, 0)
          //.setCanSleep(false)
        );
        break;
      case 'fixed':
        rigidBody = this.game.world.rapierWorld.createRigidBody(
          RAPIER.RigidBodyDesc.fixed()
          // .setTranslation(0, 0.4, 0)
          //.setCanSleep(false)
        );
        break;
    }
    // const rigidBody = this.game.world.rapierWorld.createRigidBody(
    //   RAPIER.RigidBodyDesc.kinematicPositionBased()
    //   .setTranslation(0, 0.4, 0)
    //   //.setCanSleep(false)
    // );

    const _matrix4 = new THREE.Matrix4();
    const _position = new THREE.Vector3();
    const _rotation = new THREE.Quaternion();
    const _scale = new THREE.Vector3();
    const invertedParentMatrixWorld = mesh.matrixWorld.clone().invert();
    mesh.updateWorldMatrix(true, false);
      _matrix4
      .copy(mesh.matrixWorld)
      .premultiply(invertedParentMatrixWorld)
      .decompose(_position, _rotation, _scale);

    const rotationEuler = new THREE.Euler().setFromQuaternion(_rotation, "XYZ");

    const { args, offset } = this.getColliderArgsFromGeometry(
      mesh.geometry, // geometry,
      rapierOpt.colliders || 'cuboid'
    );

    // if (options.includeInvisible) {
    //   object.traverse(this.colliderFromChild(object.child));
    // } else {
    //   object.traverseVisible(colliderFromChild);
    // }

    console.log('createRigidBody: args:', args, ', offset:', offset);
    const colliderDesc = RAPIER.ColliderDesc.cuboid(args[0], args[1], args[2]);

    // // colliderDesc.setMass(1);
    colliderDesc.setRestitution(rapierOpt.restitution);
    colliderDesc.setFriction(rapierOpt.friction);

    this.game.world.rapierWorld.createCollider(colliderDesc, rigidBody);
    this.game.world.dynamicBodies.push([mesh, rigidBody]);
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

    console.log('getColliderArgsFromGeometry:geometry:', geometry, ', colliders:', colliders)
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

  /**
   * BlockEmpty
   */
  public BlockEmpty(position = [0, 0, 0]) {

    const group = new THREE.Object3D();
    group.position.set(position[0], position[1], position[2]);
    
    const beach = new THREE.Mesh( this.boxGeometry, this.beachMaterial ); 
    beach.position.set(0, -0.2, 0);
    beach.scale.set(this.blockDimensions.width,  this.blockDimensions.height, this.blockDimensions.length);
    beach.receiveShadow = true;
    group.add(beach);
    return group;
  }

  /**
   * BlockSpinner
   */
  public BlockSpinner = (position = [0, 0, 0], difficulty: number) => {

    console.log('======================= BlockSpinner');
    const group = new THREE.Object3D();
    group.position.set(position[0], position[1], position[2]);

    const beach = new THREE.Mesh( this.boxGeometry, this.beachMaterial ); 
    beach.position.set(0, -0.2, 0);
    beach.scale.set(this.blockDimensions.width,  this.blockDimensions.height, this.blockDimensions.length);
    beach.receiveShadow = true;
    group.add(beach);

    this.createRigidBody(
      {type:'kinematicPosition', position: [0, 0.4, 0], restitution:0.2, friction: 0},
      {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [4.5, 0.3, 0.3], castShadow: true, receiveShadow: true},
      group
    );



    // const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5).setMass(1).setRestitution(1.1);
    // const rapier = this.game.world.rapierWorld.createCollider(colliderDesc, rigidBody);
    // this.game.world.dynamicBodies.push([obstacle, rigidBody]);

    return group;

    /*
    const obstacle = useRef();
    const [speed] = useState(
      () => (Math.random() + difficulty + 0.5) * (Math.random() < 0.5 ? -1 : 1)
    );

    useFrame((state) => {
      const time = state.clock.getElapsedTime();
      const rotation = new THREE.Quaternion();
      rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
      obstacle.current.setNextKinematicRotation(rotation);
    });

    return (
      <group position={position}>
        <mesh
          geometry={boxGeometry}
          material={beachMaterial}
          position={[0, -0.2, 0]}
          scale={[
            blockDimensions.width,
            blockDimensions.height,
            blockDimensions.length,
          ]}
          receiveShadow
        />
        <RigidBody
          ref={obstacle}
          type="kinematicPosition"
          position={[0, 0.4, 0]}
          restitution={0.2}
          friction={0}
        >
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[4.5, 0.3, 0.3]}
            castShadow
            receiveShadow
          />
        </RigidBody>
      </group>
    );
    */
  }

  /**
   * BlockDoubleSpinner
   */
  public BlockDoubleSpinner(position = [0, 0, 0], difficulty: number) {

    const group = new THREE.Object3D();
    group.position.set(position[0], position[1], position[2]);
    console.log('--------------------------------------------------');
    console.log('this.boxGeometry:', this.boxGeometry);
    const beach = new THREE.Mesh( this.boxGeometry, this.beachMaterial ); 
    beach.position.set(0, -0.2, 0);
    beach.scale.set(this.blockDimensions.width,  this.blockDimensions.height, this.blockDimensions.length);
    beach.receiveShadow = true;
    group.add(beach);


    this.createRigidBody(
      {type:'kinematicPosition', position: [this.blockDimensions.width / 4, 0.4, 0], restitution:0.2, friction: 0},
      {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [2.25, 0.3, 0.3], castShadow: true, receiveShadow: true},
      group
    );

    this.createRigidBody(
      {type:'kinematicPosition', position: [-this.blockDimensions.width / 4, 0.4, 0], restitution:0.2, friction: 0},
      {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [1.8, 0.3, 0.3], castShadow: true, receiveShadow: true},
      group
    );
    
    return group;
    /*
    const obstacle1 = useRef();
    const obstacle2 = useRef();

    const [direction] = useState(() => (Math.random() < 0.5 ? -1 : 1));
    const [speed] = useState(() => difficulty * 2 * direction);

    useFrame((state) => {
      const time = state.clock.getElapsedTime();
      const rotation1 = new THREE.Quaternion();
      rotation1.setFromEuler(new THREE.Euler(0, time * speed, 0));
      obstacle1.current.setNextKinematicRotation(rotation1);

      const rotation2 = new THREE.Quaternion();
      rotation2.setFromEuler(new THREE.Euler(0, time * -speed, 0));
      obstacle2.current.setNextKinematicRotation(rotation2);
    });

    return (
      <group position={position}>
        <mesh
          geometry={boxGeometry}
          material={beachMaterial}
          position={[0, -0.2, 0]}
          scale={[
            blockDimensions.width,
            blockDimensions.height,
            blockDimensions.length,
          ]}
          receiveShadow
        />
        <RigidBody
          ref={obstacle1}
          type="kinematicPosition"
          position={[blockDimensions.width / 4, 0.4, 0]}
          restitution={0.2}
          friction={0}
        >
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[2.25, 0.3, 0.3]}
            castShadow
            receiveShadow
          />
        </RigidBody>
        <RigidBody
          ref={obstacle2}
          type="kinematicPosition"
          position={[-blockDimensions.width / 4, 0.4, 0]}
          restitution={0.2}
          friction={0}
        >
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[1.8, 0.3, 0.3]}
            castShadow
            receiveShadow
          />
        </RigidBody>
      </group>
      
    );*/
  }

  /**
   * BlockLimbo
   */
  public BlockLimbo(position = [0, 0, 0], difficulty:number) {
    const group = new THREE.Object3D();
    group.position.set(position[0], position[1], position[2]);


    const beach = new THREE.Mesh( this.boxGeometry, this.beachMaterial ); 
    beach.position.set(0, -0.2, 0);
    beach.scale.set(this.blockDimensions.width,  this.blockDimensions.height, this.blockDimensions.length);
    beach.receiveShadow = true;

    group.add(beach);


    this.createRigidBody(
      {type:'kinematicPosition', restitution:0.2, friction: 0},
      {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [4, 0.3, 0.3], castShadow: true, receiveShadow: true},
      group
    );

    return group;
    /*
    const obstacle = useRef();
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

    useFrame((state) => {
      const time = state.clock.getElapsedTime();
      const y = Math.sin(1.5 * difficulty * time + timeOffset) + 1.3;
      obstacle.current.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y,
        z: position[2],
      });
    });

    return (
      <group position={position}>
        <mesh
          geometry={boxGeometry}
          material={beachMaterial}
          position={[0, -0.2, 0]}
          scale={[
            blockDimensions.width,
            blockDimensions.height,
            blockDimensions.length,
          ]}
          receiveShadow
        />
        <RigidBody
          ref={obstacle}
          type="kinematicPosition"
          restitution={0.2}
          friction={0}
        >
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[4, 0.3, 0.3]}
            castShadow
            receiveShadow
          />
        </RigidBody>
      </group>
    );
    */
  }

  /**
   * BlockDoubleLimbo
   */
  public BlockDoubleLimbo(position = [0, 0, 0], difficulty:number) {

    const group = new THREE.Object3D();
    group.position.set(position[0], position[1], position[2]);

    const beach = new THREE.Mesh( this.boxGeometry, this.beachMaterial ); 
    beach.position.set(0, -0.2, 0);
    beach.scale.set(this.blockDimensions.width,  this.blockDimensions.height, this.blockDimensions.length);
    beach.receiveShadow = true;
    group.add(beach);

    this.createRigidBody(
      {type:'kinematicPosition', restitution:0.2, friction: 0},
      {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [4, 0.3, 0.3], castShadow: true, receiveShadow: true},
      group
    );

    this.createRigidBody(
      {type:'kinematicPosition', restitution:0.2, friction: 0},
      {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [4, 0.3, 0.3], castShadow: true, receiveShadow: true},
      group
    );


    return group;
    /*
    const obstacle1 = useRef();
    const obstacle2 = useRef();
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

    useFrame((state) => {
      const time = state.clock.getElapsedTime();
      const y1 = 0.3 * Math.sin(difficulty * 1.5 * time + timeOffset) + 1.3;
      obstacle1.current.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y1 + 0.2,
        z: position[2],
      });

      const y2 = -0.3 * Math.sin(1.5 * difficulty * time + timeOffset) + 1.3;
      obstacle2.current.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y2 - 0.8,
        z: position[2],
      });
    });

    return (
      <group position={position}>
        <mesh
          geometry={boxGeometry}
          material={beachMaterial}
          position={[0, -0.2, 0]}
          scale={[
            blockDimensions.width,
            blockDimensions.height,
            blockDimensions.length,
          ]}
          receiveShadow
        />
        <RigidBody
          ref={obstacle1}
          type="kinematicPosition"
          restitution={0.2}
          friction={0}
        >
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[4, 0.3, 0.3]}
            castShadow
            receiveShadow
          />
        </RigidBody>
        <RigidBody
          ref={obstacle2}
          type="kinematicPosition"
          restitution={0.2}
          friction={0}
        >
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[4, 0.3, 0.3]}
            castShadow
            receiveShadow
          />
        </RigidBody>
      </group>
    );
    */
  }

  /**
   * BlockPlatformLimbo
   */
  public BlockPlatformLimbo(position = [0, 0, 0], difficulty:number) {
    const group = new THREE.Object3D();
    group.position.set(position[0], position[1], position[2]);

    const beach = new THREE.Mesh( this.boxGeometry, this.beachMaterial ); 
    beach.position.set(0, -0.2, 0);
    beach.scale.set(this.blockDimensions.width,  this.blockDimensions.height, this.blockDimensions.length);
    beach.receiveShadow = true;

    group.add(beach);

    this.createRigidBody(
      {type:'kinematicPosition', restitution:0.2, friction: 0},
      {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [4, 0.3, 3], castShadow: true, receiveShadow: true},
      group
    );

    return group;
    /*
    const obstacle = useRef();
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

    useFrame((state) => {
      const time = state.clock.getElapsedTime();
      const y = Math.sin(1.5 * difficulty * time + timeOffset) + 1.3;
      obstacle.current.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y,
        z: position[2],
      });
    });

    return (
      <group position={position}>
        <mesh
          geometry={boxGeometry}
          material={beachMaterial}
          position={[0, -0.2, 0]}
          scale={[
            blockDimensions.width,
            blockDimensions.height,
            blockDimensions.length,
          ]}
          receiveShadow
        />
        <RigidBody
          ref={obstacle}
          type="kinematicPosition"
          restitution={0.2}
          friction={0}
        >
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[4, 0.3, 3]}
            castShadow
            receiveShadow
          />
        </RigidBody>
      </group>
    );
    */
  }

  /**
   * BlockRamp
   */
  public BlockRamp(position = [0, 0, 0], difficulty:number) {
    const group = new THREE.Object3D();
    group.position.set(position[0], position[1], position[2]);

    const beach = new THREE.Mesh( this.boxGeometry, this.beachMaterial ); 
    beach.position.set(0, -0.2, 0);
    beach.scale.set(this.blockDimensions.width,  this.blockDimensions.height, this.blockDimensions.length);
    beach.receiveShadow = true;

    group.add(beach);


    this.createRigidBody(
      {type:'kinematicPosition', restitution:0.2, friction: 0},
      {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', position:[0, 0.4, 0], 
        rotation:[0.75, 0, 0], scale: [4, 0.3, 1.5], castShadow: true, receiveShadow: true},
      group
    );

    return group;
    /*
    return (
      <group position={position}>
        <mesh
          geometry={boxGeometry}
          material={beachMaterial}
          position={[0, -0.2, 0]}
          scale={[
            blockDimensions.width,
            blockDimensions.height,
            blockDimensions.length,
          ]}
          receiveShadow
        />
        <RigidBody type="kinematicPosition" restitution={0.2} friction={0}>
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            position={[0, 0.4, 0]}
            scale={[4, 0.3, 1.5]}
            rotation={[0.75, 0, 0]}
            castShadow
            receiveShadow
          />
        </RigidBody>
      </group>
    );
    */
  }

  /**
   * BlockSlidingWall
   */
  public BlockSlidingWall(position = [0, 0, 0], difficulty:number) {

    const group = new THREE.Object3D();
    group.position.set(position[0], position[1], position[2]);

    const beach = new THREE.Mesh( this.boxGeometry, this.beachMaterial ); 
    beach.position.set(0, -0.2, 0);
    beach.scale.set(this.blockDimensions.width,  this.blockDimensions.height, this.blockDimensions.length);
    beach.receiveShadow = true;

    group.add(beach);

/*
    const obstacle = new THREE.Mesh( this.boxGeometry, this.obstacleMaterial ); 
    obstacle.scale.set(1.7, 1.8, 0.3);
    obstacle.castShadow = true;
    obstacle.receiveShadow = true;
    group.add(obstacle);


    const rigidBody = this.game.world.rapierWorld.createRigidBody(
      RAPIER.RigidBodyDesc.kinematicPositionBased()
      .setTranslation(0, 0.4, 0)
      //.setCanSleep(false)
    );

    const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
      .setMass(1)
      .setRestitution(1.1)
      .setFriction(0);
    this.game.world.rapierWorld.createCollider(colliderDesc, rigidBody);
    this.game.world.dynamicBodies.push([obstacle, rigidBody]);


    const rigidbodymesh = new THREE.Mesh( this.boxGeometry, this.obstacleMaterial ); 
    rigidbodymesh.scale.set(4.5, 0.3, 0.3);
    rigidbodymesh.receiveShadow = true;
    rigidbodymesh.castShadow = true;
    rigidbodymesh.receiveShadow = true
    // rapier.add(rigidbodymesh);
*/

    this.createRigidBody(
      {type:'kinematicPosition', restitution:0.2, friction: 0},
      {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [4.5, 0.3, 0.3], castShadow: true, receiveShadow: true},
      group
    );
    return group;
    /*
    const obstacle = useRef();
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

    useFrame((state) => {
      const time = state.clock.getElapsedTime();
      const x = Math.sin(difficulty * 1.5 * time + timeOffset) * 1.25;
      obstacle.current.setNextKinematicTranslation({
        x: position[0] + x,
        y: position[1] + 0.75,
        z: position[2],
      });
    });

    return (
      <group position={position}>
        <mesh
          geometry={boxGeometry}
          material={beachMaterial}
          position={[0, -0.2, 0]}
          scale={[
            blockDimensions.width,
            blockDimensions.height,
            blockDimensions.length,
          ]}
          receiveShadow
        />
        <RigidBody
          ref={obstacle}
          type="kinematicPosition"
          restitution={0.2}
          friction={0}
        >
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[1.7, 1.8, 0.3]}
            castShadow
            receiveShadow
          />
        </RigidBody>
      </group>
    );
    */
  }

  /**
   * BlockDoubleSlidingWall
   */
  public BlockDoubleSlidingWall(position = [0, 0, 0], difficulty:number) {
    const group = new THREE.Object3D();
    group.position.set(position[0], position[1], position[2]);
    // group.scale.set( this.blockDimensions.width, this.blockDimensions.height, this.blockDimensions.height);

    const beach = new THREE.Mesh( this.boxGeometry, this.beachMaterial ); 
    beach.position.set(0, -0.2, 0);
    beach.scale.set(this.blockDimensions.width,  this.blockDimensions.height, this.blockDimensions.length);
    beach.receiveShadow = true;


    const timeOffset = Math.random() * Math.PI * 2;
    const time = this.game.world.clock.getElapsedTime();
    const x1 = Math.sin(difficulty * 2 * time + timeOffset) * 0.5 + 1;


    this.createRigidBody(
      {type:'kinematicPosition', restitution:0.2, friction: 0},
      {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [1, 1.8, 0.3], castShadow: true, receiveShadow: true},
      group
    );

    this.createRigidBody(
      {type:'kinematicPosition', restitution:0.2, friction: 0},
      {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [1, 1.8, 0.3], castShadow: true, receiveShadow: true},
      group
    );
/*
    // wall 1
    const wall1 = new THREE.Mesh( this.boxGeometry, this.obstacleMaterial ); 
    // wall1.position.set(0, -0.2, 0);
    wall1.scale.set(1, 1.8, 0.3);
    wall1.castShadow = true;
    wall1.receiveShadow = true;

    group.add(wall1);


    const rigidBody1 = this.game.world.rapierWorld.createRigidBody(
      RAPIER.RigidBodyDesc.kinematicPositionBased()
      // .setTranslation(0, 0.4, 0)
      //.setCanSleep(false)
    );

    const colliderDesc1 = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
      // .setMass(1)
      .setRestitution(0.2)
      .setFriction(0);
    this.game.world.rapierWorld.createCollider(colliderDesc1, rigidBody1);
    this.game.world.dynamicBodies.push([wall1, rigidBody1]);

    // wall 2
    const wall2 = new THREE.Mesh( this.boxGeometry, this.obstacleMaterial ); 
    // wall1.position.set(0, -0.2, 0);
    wall2.scale.set(1, 1.8, 0.3);
    wall2.castShadow = true;
    wall2.receiveShadow = true;

    group.add(wall2);


    const rigidBody2 = this.game.world.rapierWorld.createRigidBody(
      RAPIER.RigidBodyDesc.kinematicPositionBased()
      // .setTranslation(0, 0.4, 0)
      //.setCanSleep(false)
    );

    const colliderDesc2 = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
      // .setMass(1)
      .setRestitution(0.2)
      .setFriction(0);
    this.game.world.rapierWorld.createCollider(colliderDesc2, rigidBody2);
    this.game.world.dynamicBodies.push([wall2, rigidBody2]);
*/
    return group;
    /*
    const wall1 = useRef();
    const wall2 = useRef();

    const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

    useFrame((state) => {
      const time = state.clock.getElapsedTime();
      const x1 = Math.sin(difficulty * 2 * time + timeOffset) * 0.5 + 1;
      wall1.current.setNextKinematicTranslation({
        x: position[0] + x1,
        y: position[1] + 0.75,
        z: position[2],
      });

      const x2 = -Math.sin(difficulty * 2 * time + timeOffset) * 0.5 - 1;
      wall2.current.setNextKinematicTranslation({
        x: position[0] + x2,
        y: position[1] + 0.75,
        z: position[2],
      });
    });

    return (
      <group position={position}>
        <mesh
          geometry={boxGeometry}
          material={beachMaterial}
          position={[0, -0.2, 0]}
          scale={[
            blockDimensions.width,
            blockDimensions.height,
            blockDimensions.length,
          ]}
          receiveShadow
        />
        <RigidBody
          ref={wall1}
          type="kinematicPosition"
          restitution={0.2}
          friction={0}
        >
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[1, 1.8, 0.3]}
            castShadow
            receiveShadow
          />
        </RigidBody>
        <RigidBody
          ref={wall2}
          type="kinematicPosition"
          restitution={0.2}
          friction={0}
        >
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[1, 1.8, 0.3]}
            castShadow
            receiveShadow
          />
        </RigidBody>
      </group>
    );
    */
  }

  /**
   * BlockEnd
   */


    
  public async BlockEnd(position = [0, 0, 0]) {
    const group = new THREE.Object3D();
    group.position.set(position[0], position[1], position[2]);

    const beach = new THREE.Mesh( this.boxGeometry, this.beachMaterial ); 
    beach.position.set(0, -0.2, 0);
    beach.scale.set(this.blockDimensions.width,  this.blockDimensions.height, this.blockDimensions.length);
    beach.receiveShadow = true;
    group.add(beach);

    this.createRigidBody(
      {type:'fixed', colliders: 'trimesh', position: [0, 1.05, 0], rotation:[0, Math.PI / 2, 0], restitution:0.2, friction: 0},
      {type:'star', scale:0.012},
      group
    );
/*
    const rigidBody = this.game.world.rapierWorld.createRigidBody(
      RAPIER.RigidBodyDesc.fixed()
      // .setTranslation(0, 0.4, 0)
      //.setCanSleep(false)
    );

    const colliderDesc1 = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
      // .setMass(1)
      .setRestitution(0.2)
      .setFriction(0);
    this.game.world.rapierWorld.createCollider(colliderDesc1, rigidBody);
    this.game.world.dynamicBodies.push([beach, rigidBody]);
*/

    // const star: any = await Star(null);
    // star.scale.set(0.012);
    // group.add(star);
    // return group;
    /*
    const { end } = useGame();

    function onHit() {
      end();
    }

    return (
      <group position={position}>
        <mesh
          geometry={boxGeometry}
          material={beachMaterial}
          position={[0, -0.2, 0]}
          scale={[
            blockDimensions.width,
            blockDimensions.height,
            blockDimensions.length,
          ]}
          receiveShadow
        />
        <Float
          speed={25}
          rotationIntensity={0.25}
          floatIntensity={0.25}
          floatingRange={[-0.01, 0.01]}
        >
          <RigidBody
            type="fixed"
            colliders="trimesh"
            position={[0, 1.05, 0]}
            rotation={[0, Math.PI / 2, 0]}
            restitution={0.2}
            friction={0}
            onCollisionEnter={onHit}
          >
            <Star scale={0.012} />
          </RigidBody>
        </Float>
      </group>
    );
    */
  }

}
