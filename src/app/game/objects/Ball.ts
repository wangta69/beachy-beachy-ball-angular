import * as THREE from "three";
import RAPIER from '@dimforge/rapier3d-compat';

import {Event} from '../services/event.service';
import {Sounds} from '../services/sound.service';
// import {Rapier, World, Body, Mesh} from 'ng-rapier-threejs';
import {Rapier, World, Body, Mesh, EventListener} from '../../../../projects/ng-rapier-threejs/src/public-api';
export class Ball {
  private bodyMesh!:THREE.Object3D | THREE.Mesh; 
  private body!: RAPIER.RigidBody;

  private world: World; 
  private rapier: Rapier;
  private event: Event;
  private sounds: Sounds;
  private evListener: EventListener
  
  private direction: string | null = null;

  private smoothedCameraPosition = new THREE.Vector3(0, 0, 200); // initial camera position
  private smoothedCameraTarget = new THREE.Vector3();
  
  constructor(world:World, rapier:Rapier, event:Event, sounds:Sounds, evListener: EventListener) { // rapier: Rapier
    this.world = world;
    this.rapier = rapier;
    this.event = event;
    this.sounds = sounds;
    this.evListener = evListener;
    this.createBall();
  }

  private async createBall() {

    await this.world.addObject({
      geometry: {type: 'sphere', args: [0.3, 128, 128]}, 
      material: {type: 'standard', textureUrl: '/textures/beach_ball_texture.png', flatShading: true},
      mesh: {castShadow: true, receiveShadow: true, position: {x:0, y:1, z:0}},
      rapier: {
        body: {
          type:'dynamic', userData: {name: 'ball'}, linearDamping:0.5, angularDamping:0.5,
        },
        collider: {shape:'ball', friction: 1, mass: 0.1, restitution: 0.5,
          onCollisionEnter:this.onHit.bind(this)
        }
      }
    }, (mesh?: any, body?:Body)=>{
      body ? this.body = body.rigidBody: null;
    });

    

    this.world.updates.push((clock:any)=>{this.update(clock)});
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

    const origin = this.body.translation();
    origin.y -= 0.31;

    const direction = { x: 0, y: -1, z: 0 };
    const ray = new RAPIER.Ray(origin, direction);
    const hit: RAPIER.RayColliderHit | null = this.rapier.world.castRay(ray, 10, true); // true: considers everything as solid
    
    if (hit && hit.timeOfImpact < 0.15) {
      this.body.applyImpulse(new RAPIER.Vector3(0, 0.1, 0), true);
      // this.body.applyImpulse(new RAPIER.Vector3(0, 0.75, 0), true);
    }
  };

  public reset () {
    this.body.setTranslation({ x: 0, y: 0.75, z: 0 }, true);
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  };

  private update(clock: any) {
    // const delta = clock.getDelta();
    const delta = clock.delta;
    console.log('keyMap:', this.evListener.keyMap);

    if (this.evListener.keyMap['KeyW'] || this.evListener.keyMap['ArrowUp']) {
      this.direction = 'forward'
    } else if(this.evListener.keyMap['KeyA'] || this.evListener.keyMap['ArrowLeft']) {
      this.direction = 'leftward'
    } else if(this.evListener.keyMap['KeyD'] || this.evListener.keyMap['ArrowRight']) {
      this.direction = 'rightward'
    } else if(this.evListener.keyMap['KeyS'] || this.evListener.keyMap['ArrowDown']) {
      this.direction = 'backward'
    }
    
    if(this.evListener.keyMap['Space']) {
      this.jump();
    } 


      // case 'ArrowDown': case 'KeyS':
      //   this.ball.action({act: 'dir', dir: 'backward'})
      //   break;
      // case 'ArrowLeft': case 'KeyA':
      //   this.ball.action({act: 'dir', dir: 'leftward'})
      //   break;
      // case 'ArrowRight': case 'KeyD':
      //   this.ball.action({act: 'dir', dir: 'rightward'})
      //   break;
      // case 'Space': this.ball.action({act: 'jump'}); break;

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;
    // console.log(this.direction);
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

    this.world.camera.position.copy(this.smoothedCameraPosition);
    this.world.camera.lookAt(this.smoothedCameraTarget);


    // Restart
   
    if (bodyPosition.y < -4) {
      this.event.broadcast('status', {phase: 'restart'});
    }

  }

   private onHit() {
    this.sounds.play('hit');
  //   hitSound.currentTime = 0
  //   hitSound.volume = Math.random() * 0.1
  //   hitSound.play()
  }
}
