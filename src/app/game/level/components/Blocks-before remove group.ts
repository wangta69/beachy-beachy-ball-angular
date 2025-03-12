// Beachy Beachy Ball
// Copyright (c) 2023 Michael Kolesidis <michael.kolesidis@gmail.com>
// Licensed under the GNU Affero General Public License v3.0.
// https://www.gnu.org/licenses/gpl-3.0.html

// import { useState, useRef } from "react";
// import { useFrame } from "@react-three/fiber";
// import { Float } from "@react-three/drei";
// import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
// import RAPIER from '@dimforge/rapier3d-compat';
// import type RAPIER from "@dimforge/rapier3d";
// type RAPIER_API = typeof import("@dimforge/rapier3d");
// import useGame from "../../stores/useGame.js";
import Star from "./Star";
import {Mesh} from '../../threejs/Mesh';
import {RigidBody} from '../../rapier/RigidBody';
import * as GSAP from 'gsap';




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


  private async beach() {
    const mesh = new Mesh();
    const beach = await mesh.create({
      geometry: {type: 'box', width: 1, height: 1, depth: 1}, 
      material: {type: 'standard', color: 'orange'},
      mesh: {
        position:{x:0, y:-0.2, z:0},
        scale: {x: this.blockDimensions.width,  y:this.blockDimensions.height, z:this.blockDimensions.length},
        receiveShadow: true
      }
    });
    return beach;
  }
  /**
   * BlockEmpty
   */
  
  public async BlockEmpty(position = [0, 0, 0]) {
    const group = new THREE.Object3D();
    group.position.set(position[0], position[1], position[2]);
    const beach = await this.beach();
    group.add(beach);
    return group;
  }

  /**
   * BlockSpinner
   */
  public async BlockSpinner(position = [0, 0, 0], difficulty: number){
 
    const group = new THREE.Object3D();
    group.position.set(position[0], position[1], position[2]);


    const beachObject = new Mesh({
      geometry: {type: 'box', width: 1, height: 1, depth: 1}, 
      material: {type: 'standard', color: 'orange'},
      mesh: {position: [0, -0.2, 0],
      scale:[
        this.blockDimensions.width,
        this.blockDimensions.height,
        this.blockDimensions.length,
      ],
      receiveShadow: true
    }
      
  });

    group.add(beachObject.mesh);

    const rigidBody: any = new RigidBody(this.game.rapier);
    await rigidBody.create(
      {
        rigidBody: {
          type:'kinematicPosition', 
          position: {x:0, y:0.4, z:0}, restitution:0.2, friction: 0
        },
        geometry: {type: 'box', width: 1, height: 1, depth: 1},
        material: {
          type: 'standard',
          color: 'tomato'
        },
        
        mesh: {
          castShadow: true, 
          receiveShadow: true,
          scale: {x:4.5, y:0.3, z:0.3}
        }
      }
    );

    const obstacle = rigidBody.meshObject.mesh;
    obstacle.position.set(0, -0.2, 0);
    obstacle.scale.set(this.blockDimensions.width,  this.blockDimensions.height, this.blockDimensions.length);
    obstacle.receiveShadow = true;
    group.add(obstacle);


    // const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5).setMass(1).setRestitution(1.1);
    // const rapier = this.game.rapier.world.createCollider(colliderDesc, rigidBody);
    // this.game.rapier.dynamicBodies.push([obstacle, rigidBody]);

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
  public async BlockDoubleSpinner(position = [0, 0, 0], difficulty: number) {

    const group = new THREE.Object3D();
    group.position.set(position[0], position[1], position[2]);


    
    const beach = new THREE.Mesh( this.boxGeometry, this.beachMaterial ); 
    beach.position.set(0, -0.2, 0);
    beach.scale.set(this.blockDimensions.width,  this.blockDimensions.height, this.blockDimensions.length);
    beach.receiveShadow = true;
    group.add(beach);


    const rigidBody: any = new RigidBody(this.game.rapier);
    await rigidBody.create(
      {
        rigidBody: {
          type:'kinematicPosition', 
          position: {x:this.blockDimensions.width / 4, y:0.4, z:0}, restitution:0.2, friction: 0
        },
        geometry: {type: 'box', width: 1, height: 1, depth: 1},
        material: {
          type: 'standard',
          color: 'tomato'
        },
        
        mesh: {
          scale: {x:2.25, y:0.3, z:0.3}, castShadow: true, receiveShadow: true
        }
      }
    );

    const obstacle1 = rigidBody.meshObject.mesh;
    group.add(obstacle1);
    // this.createRigidBody(
    //   {type:'kinematicPosition', position: [this.blockDimensions.width / 4, 0.4, 0], restitution:0.2, friction: 0},
    //   {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [2.25, 0.3, 0.3], castShadow: true, receiveShadow: true},
    //   group
    // );


    const rigidBody1: any = new RigidBody(this.game.rapier);
    rigidBody1.create(
      {
        rigidBody: {
          type:'kinematicPosition', 
          position: {x:-this.blockDimensions.width / 4, y:0.4, z:0}, restitution:0.2, friction: 0
        },
        geometry: {type: 'box', width: 1, height: 1, depth: 1},
        material: {
          type: 'standard',
          color: 'tomato'
        },
        
        mesh: {
          scale: {x:1.8, y:0.3, z:0.3}, castShadow: true, receiveShadow: true
        }
      }
    );

    const obstacle2 = rigidBody1.meshObject.mesh;
    group.add(obstacle2);


    // this.createRigidBody(
    //   {type:'kinematicPosition', position: [-this.blockDimensions.width / 4, 0.4, 0], restitution:0.2, friction: 0},
    //   {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [1.8, 0.3, 0.3], castShadow: true, receiveShadow: true},
    //   group
    // );
    
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
  public async BlockLimbo(position = [0, 0, 0], difficulty:number) {
    const group = new THREE.Object3D();
    group.position.set(position[0], position[1], position[2]);


    const beach = new THREE.Mesh( this.boxGeometry, this.beachMaterial ); 
    beach.position.set(0, -0.2, 0);
    beach.scale.set(this.blockDimensions.width,  this.blockDimensions.height, this.blockDimensions.length);
    beach.receiveShadow = true;

    group.add(beach);

    const rigidBody: any = new RigidBody(this.game.rapier);
    await rigidBody.create(
      {
        rigidBody: {
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },
        geometry: {type: 'box', width: 1, height: 1, depth: 1},
        material: {
          type: 'standard',
          color: 'tomato'
        },
        
        mesh: {
          scale: {x:4, y:0.3, z:0.3}, castShadow: true, receiveShadow: true
        }
      }
    );

    const obstacle = rigidBody.meshObject.mesh;
    group.add(obstacle);
    // this.createRigidBody(
    //   {type:'kinematicPosition', restitution:0.2, friction: 0},
    //   {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [4, 0.3, 0.3], castShadow: true, receiveShadow: true},
    //   group
    // );

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
  public async BlockDoubleLimbo(position = [0, 0, 0], difficulty:number) {

    const group = new THREE.Object3D();
    group.position.set(position[0], position[1], position[2]);

    const beach = new THREE.Mesh( this.boxGeometry, this.beachMaterial ); 
    beach.position.set(0, -0.2, 0);
    beach.scale.set(this.blockDimensions.width,  this.blockDimensions.height, this.blockDimensions.length);
    beach.receiveShadow = true;
    group.add(beach);


    const rigidBody: any = new RigidBody(this.game.rapier);
    await rigidBody.create(
      {
        rigidBody: {
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },
        geometry: {type: 'box', width: 1, height: 1, depth: 1},
        material: {
          type: 'standard',
          color: 'tomato'
        },
        
        mesh: {
          scale: {x:4, y:0.3, z:0.3}, castShadow: true, receiveShadow: true
        }
      }
    );

    // this.createRigidBody(
    //   {type:'kinematicPosition', restitution:0.2, friction: 0},
    //   {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [4, 0.3, 0.3], castShadow: true, receiveShadow: true},
    //   group
    // );

    const rigidBody1: any = new RigidBody(this.game.rapier);
    rigidBody1.create(
      {
        rigidBody: {
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },
        geometry: {type: 'box', width: 1, height: 1, depth: 1},
        material: {
          type: 'standard',
          color: 'tomato'
        },
        
        mesh: {
          scale: {x:4, y:0.3, z:0.3}, castShadow: true, receiveShadow: true
        }
      }
    );

    // this.createRigidBody(
    //   {type:'kinematicPosition', restitution:0.2, friction: 0},
    //   {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [4, 0.3, 0.3], castShadow: true, receiveShadow: true},
    //   group
    // );


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
  public async BlockPlatformLimbo(position = [0, 0, 0], difficulty:number) {
    const group = new THREE.Object3D();
    group.position.set(position[0], position[1], position[2]);

    const beach = new THREE.Mesh( this.boxGeometry, this.beachMaterial ); 
    beach.position.set(0, -0.2, 0);
    beach.scale.set(this.blockDimensions.width,  this.blockDimensions.height, this.blockDimensions.length);
    beach.receiveShadow = true;

    group.add(beach);

    const rigidBody: any = new RigidBody(this.game.rapier);
    await rigidBody.create(
      {
        rigidBody: {
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },
        geometry: {type: 'box', width: 1, height: 1, depth: 1},
        material: {
          type: 'standard',
          color: 'tomato'
        },
        
        mesh: {
          scale: {x:4, y:0.3, z:3}, castShadow: true, receiveShadow: true
        }
      }
    );


    // this.createRigidBody(
    //   {type:'kinematicPosition', restitution:0.2, friction: 0},
    //   {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [4, 0.3, 3], castShadow: true, receiveShadow: true},
    //   group
    // );

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
  public async BlockRamp(position = [0, 0, 0], difficulty:number) {
    const group = new THREE.Object3D();
    group.position.set(position[0], position[1], position[2]);

    const beach = new THREE.Mesh( this.boxGeometry, this.beachMaterial ); 
    beach.position.set(0, -0.2, 0);
    beach.scale.set(this.blockDimensions.width,  this.blockDimensions.height, this.blockDimensions.length);
    beach.receiveShadow = true;

    group.add(beach);

    const rigidBody: any = new RigidBody(this.game.rapier);
    await rigidBody.create(
      {
        rigidBody: {
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },
        geometry: {type: 'box', width: 1, height: 1, depth: 1},
        material: {
          type: 'standard',
          color: 'tomato'
        },
        
        mesh: {
          position:{x:0, y:0.4, z:0}, 
        rotation:{x:0.75, y:0, z:0}, scale: {x:4, y:0.3, z:1.5}, castShadow: true, receiveShadow: true
        }
      }
    );

    // this.createRigidBody(
    //   {type:'kinematicPosition', restitution:0.2, friction: 0},
    //   {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', position:[0, 0.4, 0], 
    //     rotation:[0.75, 0, 0], scale: [4, 0.3, 1.5], castShadow: true, receiveShadow: true},
    //   group
    // );

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
  public async BlockSlidingWall(position = [0, 0, 0], difficulty:number) {

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


    const rigidBody = this.game.rapier.world.createRigidBody(
      RAPIER.RigidBodyDesc.kinematicPositionBased()
      .setTranslation(0, 0.4, 0)
      //.setCanSleep(false)
    );

    const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
      .setMass(1)
      .setRestitution(1.1)
      .setFriction(0);
    this.game.rapier.worldd.createCollider(colliderDesc, rigidBody);
    this.game.rapier.dynamicBodies.push([obstacle, rigidBody]);


    const rigidbodymesh = new THREE.Mesh( this.boxGeometry, this.obstacleMaterial ); 
    rigidbodymesh.scale.set(4.5, 0.3, 0.3);
    rigidbodymesh.receiveShadow = true;
    rigidbodymesh.castShadow = true;
    rigidbodymesh.receiveShadow = true
    // rapier.add(rigidbodymesh);
*/

  const rigidBody: any = new RigidBody(this.game.rapier);
  await rigidBody.create(
      {
        rigidBody: {
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },
        geometry: {type: 'box', width: 1, height: 1, depth: 1},
        material: {
          type: 'standard',
          color: 'tomato'
        },
        
        mesh: {
          scale: {x:4.5, y:0.3, z:0.3}, castShadow: true, receiveShadow: true
        }
      }
    );


    // this.createRigidBody(
    //   {type:'kinematicPosition', restitution:0.2, friction: 0},
    //   {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [4.5, 0.3, 0.3], castShadow: true, receiveShadow: true},
    //   group
    // );
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
  public async BlockDoubleSlidingWall(position = [0, 0, 0], difficulty:number) {
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


    const rigidBody: any = new RigidBody(this.game.rapier);
    await rigidBody.create(
      {
        rigidBody: {
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },
        geometry: {type: 'box', width: 1, height: 1, depth: 1},
        material: {
          type: 'standard',
          color: 'tomato'
        },
        
        mesh: {
          scale: {x:1, y:1.8, z:0.3}, castShadow: true, receiveShadow: true
        }
      }
    );
    // this.createRigidBody(
    //   {type:'kinematicPosition', restitution:0.2, friction: 0},
    //   {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [1, 1.8, 0.3], castShadow: true, receiveShadow: true},
    //   group
    // );

    const rigidBody1: any = new RigidBody(this.game.rapier);
    rigidBody1.create(
      {
        rigidBody: {
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },
        geometry: {type: 'box', width: 1, height: 1, depth: 1},
        material: {
          type: 'standard',
          color: 'tomato'
        },
        
        mesh: {
          scale: {x:1, y:1.8, z:0.3}, castShadow: true, receiveShadow: true
        }
      }
    );

    // this.createRigidBody(
    //   {type:'kinematicPosition', restitution:0.2, friction: 0},
    //   {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [1, 1.8, 0.3], castShadow: true, receiveShadow: true},
    //   group
    // );
/*
    // wall 1
    const wall1 = new THREE.Mesh( this.boxGeometry, this.obstacleMaterial ); 
    // wall1.position.set(0, -0.2, 0);
    wall1.scale.set(1, 1.8, 0.3);
    wall1.castShadow = true;
    wall1.receiveShadow = true;

    group.add(wall1);


    const rigidBody1 = this.game.rapier.world.createRigidBody(
      RAPIER.RigidBodyDesc.kinematicPositionBased()
      // .setTranslation(0, 0.4, 0)
      //.setCanSleep(false)
    );

    const colliderDesc1 = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
      // .setMass(1)
      .setRestitution(0.2)
      .setFriction(0);
    this.game.rapier.world.createCollider(colliderDesc1, rigidBody1);
    this.game.rapier.dynamicBodies.push([wall1, rigidBody1]);

    // wall 2
    const wall2 = new THREE.Mesh( this.boxGeometry, this.obstacleMaterial ); 
    // wall1.position.set(0, -0.2, 0);
    wall2.scale.set(1, 1.8, 0.3);
    wall2.castShadow = true;
    wall2.receiveShadow = true;

    group.add(wall2);


    const rigidBody2 = this.game.rapier.world.createRigidBody(
      RAPIER.RigidBodyDesc.kinematicPositionBased()
      // .setTranslation(0, 0.4, 0)
      //.setCanSleep(false)
    );

    const colliderDesc2 = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
      // .setMass(1)
      .setRestitution(0.2)
      .setFriction(0);
    this.game.rapier.world.createCollider(colliderDesc2, rigidBody2);
    this.game.rapier.dynamicBodies.push([wall2, rigidBody2]);
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

    const beach = await this.beach();
    group.add(beach);

    const mesh = new Mesh();

    const star = await mesh.loadGLTF({
      url: '/models/star.glb', 
      name: 'pCylinder3', 
      castShadow: true, 
      receiveShadow: true, 
      scale:{x:0.012, y:0.012, z:0.012}});


    group.add(star);

    if ("isMesh" in group) {
      console.log ('=========================================');
    } else {
      console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn group', group);
    }
   
    const rigidBody: RigidBody = new RigidBody(this.game.rapier);
    const rigidbody = await rigidBody.create(
      {
        rigidBody: {
          type:'fixed', 
          colliders: 'trimesh', 
          position: {x:0, y:1.05, z:0}, 
          rotation:{x:0, y:Math.PI / 2, z:0}, 
          restitution:0.2, friction: 0
        },
        mesh: star,
      }
    );

    // group.add(rigidbody);

  
    // const star = rigidBody.meshObject.mesh;
    // group.add(star);
/*
    const tween = {
      prerotate: 0,
      rotate: -1,
    };

    GSAP.gsap.to(tween, {
      duration: 0.25,
      ease: GSAP.Linear.easeNone,
      repeat:-1,
      rotate: 1, 

      // rotate: 3,
      onUpdate: () => {
        // 2초동안(duration) bounce.out 으로 position의 각 값들이 변화된느 것을 확인 할 수 있습니다.

        
        // const delta = tween.rotate - tween.prerotate;
        // const deltaAngle = delta;

        // rigidBody.rigidBody.setRotation({ w: 1.0, x: 0.0, y: deltaAngle, z: 0.0 });
        rigidBody.rigidBody.setRotation({  x: 0.0, y: tween.rotate, z: 0.0, w: 1.0 }, true);
        // new THREE.Euler( 0, tween.rotate, 0, 'XYZ' );
        // rigidBody.rigidBody.setRotation(new THREE.Euler( 0, tween.rotate, 0, 'XYZ' ));

        // rigidBody.rigidBody.setTranslation(0, 0, 0);
        // rigidBody.rigidBody.setTranslation(rotation.x++, rotation.y++, rotation.z++);
    
      },
      onComplete: () => {
        
      }
    });
*/
    return group;
    // this.createRigidBody(
    //   {type:'fixed', colliders: 'trimesh', position: [0, 1.05, 0], rotation:[0, Math.PI / 2, 0], restitution:0.2, friction: 0},
    //   {type:'star', scale:0.012},
    //   group
    // );
/*
    const rigidBody = this.game.rapier.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed()
      // .setTranslation(0, 0.4, 0)
      //.setCanSleep(false)
    );

    const colliderDesc1 = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
      // .setMass(1)
      .setRestitution(0.2)
      .setFriction(0);
    this.game.rapier.world.createCollider(colliderDesc1, rigidBody);
    this.game.rapier.dynamicBodies.push([beach, rigidBody]);
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
