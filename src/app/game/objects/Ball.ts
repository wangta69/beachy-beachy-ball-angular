import * as THREE from "three";
import RAPIER from '@dimforge/rapier3d-compat';
import {RigidBody} from '../rapier/RigidBody';

import {Mesh} from '../threejs/Mesh';
import { Game } from "../Game";

export class Ball {
  private game: Game;
  private bodyMesh!:THREE.Object3D | THREE.Mesh; 
  private body!: RAPIER.RigidBody;

  private direction: string | null = null;

  private smoothedCameraPosition = new THREE.Vector3(0, 0, 200); // initial camera position
  private smoothedCameraTarget = new THREE.Vector3();
  
  constructor( game: Game ) {
    this.game = game;
    this.createBall();
  }

  private async createBall() {

    const mesh = new Mesh();

    const ball = await mesh.create({
      geometry: {type: 'sphere', radius: 0.3, width: 128, height: 128}, 
      material: {type: 'standard', textureUrl: '/textures/beach_ball_texture.png', flatShading: true},
      mesh: {castShadow: true, receiveShadow: true, position: {x:0, y:1, z:0}}
    });



    this.bodyMesh = ball;

    const rigidBody: RigidBody = new RigidBody(this.game.rapier);
    console.log('createball--------');
    this.body = await rigidBody.create(
      {
        rigidBody: {
          // type:'kinematicPosition', 
          name: 'ball',
          colliders:'ball',
          restitution:0.2,
          friction:1,
          linearDamping:0.5,
          angulularDamping:0.5,
          // position:{x:0, y:1, z:0}
          onCollisionEnter:this.onHit
        },
        object3d:ball
      }
    );
    
    this.game.world.scene.add(this.bodyMesh);
    // this.game.world.update(); 
/*

    <RigidBody
      name="ball"
      ref={body}
      colliders="ball"
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angulularDamping={0.5}
      position={[0, 1, 0]}
      // onCollisionEnter={onHit}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.3, 128, 128]} />
        <meshStandardMaterial map={ballTexture} flatShading />
      </mesh>
    </RigidBody>

  );
  */

  }

  public action(params: any) {
    switch(params.act) {
      case 'jump':
        this.jump();
        break;
      case 'dir':
        this.direction = params.dir;
        break;
      case 'ready':
        this.reset();
        break;

    }
  }
  
  private jump(){
    // const origin = this.bodyMesh.position;
    const origin = this.body.translation();
    origin.y -= 0.31;

    // console.log('this.body:', this.body);
    // console.log('origin 2:', origin);
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new RAPIER.Ray(origin, direction);
    const hit: RAPIER.RayColliderHit | null = this.game.rapier.world.castRay(ray, 10, true); // true: considers everything as solid
    
    if (hit && hit.timeOfImpact < 0.15) {
      this.body.applyImpulse(new RAPIER.Vector3(0, 0.75, 0), true);
    }
  };


  public reset () {
    this.body.setTranslation({ x: 0, y: 0.75, z: 0 }, true);
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  };


  public update(delta: number) {
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    switch(this.direction) {
      case 'forward':
        impulse.z -= impulseStrength;
        torque.x -= torqueStrength;
        break;

      case 'rightward':
        impulse.x += impulseStrength;
        torque.z -= torqueStrength;
        break;

      case 'backward':
        impulse.z += impulseStrength;
        torque.x += torqueStrength;
        break;

      case 'leftward':
        impulse.x -= impulseStrength;
        torque.z += torqueStrength;
        break;
    }

    this.body.applyImpulse(impulse, true);
    this.body.applyTorqueImpulse(torque, true);

    this.direction = null;

    /**
   * Camera
   */

    const bodyPosition = this.body.translation();

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    this.smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
    this.smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

    this.game.world.camera.position.copy(this.smoothedCameraPosition);
    this.game.world.camera.lookAt(this.smoothedCameraTarget);


    // Restart
    
    if (bodyPosition.y < -4) {
      this.game.event.broadcast('status', {phase: 'restart'});
    }

  }

   private onHit() {
    console.log('onHit.............');
  //   hitSound.currentTime = 0
  //   hitSound.volume = Math.random() * 0.1
  //   hitSound.play()
  }


/*
  return (
    <RigidBody
      name="ball"
      ref={body}
      colliders="ball"
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angulularDamping={0.5}
      position={[0, 1, 0]}
      // onCollisionEnter={onHit}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.3, 128, 128]} />
        <meshStandardMaterial map={ballTexture} flatShading />
      </mesh>
    </RigidBody>
  );
  */
}
