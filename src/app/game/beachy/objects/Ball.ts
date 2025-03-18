import * as THREE from "three";
import RAPIER from '@dimforge/rapier3d-compat';
import {Body} from '../../rapier/Body';

import {Mesh} from '../../threejs/Mesh';
import {World} from '../../threejs/World';
import {Rapier} from '../../rapier/Rapier';
import {Event} from '../../services/event.service';
import {Sounds} from '../../services/sound.service';

export class Ball {
  private bodyMesh!:THREE.Object3D | THREE.Mesh; 
  private body!: RAPIER.RigidBody;

  private world: World; 
  private rapier: Rapier;
  private event: Event;
  private sounds: Sounds;
  
  private direction: string | null = null;

  private smoothedCameraPosition = new THREE.Vector3(0, 0, 200); // initial camera position
  private smoothedCameraTarget = new THREE.Vector3();
  
  constructor(world:World, rapier:Rapier, event:Event, sounds:Sounds) { // rapier: Rapier
    this.world = world;
    this.rapier = rapier;
    this.event = event;
    this.sounds = sounds;
    console.log('ball constructor: sounds:', sounds)
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

    const body: Body = new Body(this.rapier);
    this.body = await body.create(
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
          onCollisionEnter:this.onHit.bind(this)
        },
        object3d:ball
      }
    );
    
    this.world.scene.add(this.bodyMesh);

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
      this.body.applyImpulse(new RAPIER.Vector3(0, 0.75, 0), true);
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

    this.world.camera.position.copy(this.smoothedCameraPosition);
    this.world.camera.lookAt(this.smoothedCameraTarget);


    // Restart
    
    if (bodyPosition.y < -4) {
      this.event.broadcast('status', {phase: 'restart'});
    }

  }

   private onHit() {
    console.log('onHit :', this.sounds);
    this.sounds.play('hit');
  //   hitSound.currentTime = 0
  //   hitSound.volume = Math.random() * 0.1
  //   hitSound.play()
  }
}
