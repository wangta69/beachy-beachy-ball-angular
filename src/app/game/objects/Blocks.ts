import * as THREE from "three";
// import {Rapier, World, Body, Mesh} from 'ng-rapier-threejs';
import {Rapier, World, Body, Mesh} from '../../../../projects/ng-rapier-threejs/src/public-api';
import {Event} from '../services/event.service';
import * as GSAP from 'gsap';

type UseFrame = {
  time: number;
  delta: number;
}
export class Blocks {
  // private world: World; 
  private rapier: Rapier;
  private event: Event;

  public blockDimensions = {
    width: 4.2,
    height: 0.3,
    length: 4,
  };

  constructor(world:World, rapier:Rapier, event:Event) {
    // this.world = world;
    this.rapier = rapier;
    this.event = event;
  }

  private async beach(position:THREE.Vector3Like) {
    const mesh = new Mesh();
    const beach = await mesh.create({
      geometry: {type: 'box', args: [1, 1, 1]},
      material: {type: 'standard', color: 'orange'},
      mesh: {
        position:new THREE.Vector3(0, -0.2, 0).add(position),
        // scale: {x: this.blockDimensions.width,  y:this.blockDimensions.height, z:this.blockDimensions.length},
        scale: {x: this.blockDimensions.width,  y:this.blockDimensions.height, z:this.blockDimensions.length},
        receiveShadow: true
      }
    });

    const body: Body = new Body(this.rapier);
    await body.create(
    // await rigidBody.create(
      {
        body: {type: 'fixed', userData: {name: 'beach'}},
        collider: {         
          // restitution:0.2, friction: 0,
          // mass: 0.1 // 테스트로 넣어둚
        },
        object3d: beach
      }
    );
    return beach;
  }

  private async obstacle(position:THREE.Vector3Like) {
    const mesh = new Mesh();
    const obstacle = await mesh.create({
      geometry: {type: 'box', args: [1, 1, 1]},
      material: {type: 'standard', color: 'tomato'},
      mesh: {
        position:new THREE.Vector3(0, -0.2, 0).add(position),
        // scale: {x: this.blockDimensions.width,  y:this.blockDimensions.height, z:this.blockDimensions.length},
        castShadow: true,
        receiveShadow: true
      }
    });
    return obstacle;
  }

 /**
   * Bound
   */
  public async Bound(length:number) {
    const body: Body = new Body(this.rapier);
    await body.create(
      // await rigidBody.create(
        {
          body: {
            type:'fixed',
            userData: {name: 'bound'},
            position: {x: 0, y: -0.1, z: -(length * 2) + 2},
          },
          collider: {
            args: [this.blockDimensions.width / 2, 0.1, 2 * length],
            restitution: 0.2,
            friction:1
          }
        }
      );


 /*
     <RigidBody type="fixed" restitution={0.2} friction={0}>
     <CuboidCollider
       args={[blockDimensions.width / 2, 0.1, 2 * length]}
       position={[0, -0.1, -(length * 2) + 2]}
       restitution={0.2}
       friction={1}
     />
   </RigidBody>
   */
   }


  /**
   * BlockEmpty
   */
  public async BlockEmpty(position = [0, 0, 0]) {
    // const group = new THREE.Object3D();
    // group.position.set(position[0], position[1], position[2]);
    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});
    // group.add(beach);


    return [beach];
  }

  /**
   * BlockSpinner
   */
  public async BlockSpinner(position = [0, 0, 0], difficulty: number){
 
    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});
    const obstacle = await this.obstacle({x: position[0], y: position[1] + 0.4, z: position[2]});
    obstacle.scale.set(4.5, 0.3, 0.3);

    const body: Body = new Body(this.rapier);
    await body.create(
      {
        body: {
          type:'kinematicPosition',
          userData: {name: 'obstacle'}
        },
        collider: {
          restitution:0.2, friction: 0
        },
        object3d: obstacle
      }
    );


    const speed = (Math.random() + difficulty + 0.5) * (Math.random() < 0.5 ? -1 : 1);

    body.useFrame = (clock: UseFrame) => {


      const time = clock.time;
      const rotation = new THREE.Quaternion();

      rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
      // console.log('inner userFrame', rotation);
      body.rigidBody.setNextKinematicRotation(rotation);
    };

    return [beach, obstacle];
  }

  /**
   * BlockDoubleSpinner
   */

  public async BlockDoubleSpinner(position = [0, 0, 0], difficulty: number) {

    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});

    const obstacle1 = await this.obstacle({x:position[0] + this.blockDimensions.width / 4, y: position[1] + 0.4, z: position[2]});
    obstacle1.scale.set(2.25, 0.3, 0.3);
    // const rigidBody = await this.rapier.rigidBody.create(
      const body: Body = new Body(this.rapier);
      await body.create(
      {
        body: {
          type:'kinematicPosition',
          userData: {name: 'obstacle'}
        },
        collider: {
          restitution:0.2, friction: 0
        }, 
        object3d: obstacle1
      }
    );

    const direction = (Math.random() < 0.5 ? -1 : 1);
    const speed = difficulty * 2 * direction;
    body.useFrame = (clock: any) => {
      const time = clock.time;
      const rotation = new THREE.Quaternion();

      rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
      body.rigidBody.setNextKinematicRotation(rotation);
    };


    const obstacle2 = await this.obstacle({x: -this.blockDimensions.width / 4 + position[0], y: position[1] + 0.4, z: position[2]});
    obstacle2.scale.set(1.8, 0.3, 0.3);
    const rigidBody1: any = new Body(this.rapier);
    rigidBody1.create(
      {
        body: {
          type:'kinematicPosition',
          userData: {name: 'obstacle'}
        },
        collider: {
          restitution:0.2, friction: 0
        },
        object3d: obstacle2
      }
    );

    rigidBody1.useFrame = (clock: any) => {
      const time = clock.time;
      const rotation = new THREE.Quaternion();
      rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
      rigidBody1.rigidBody.setNextKinematicRotation(rotation);
    };
    return [beach, obstacle1, obstacle2];
  }

  /**
   * BlockLimbo
   */

  public async BlockLimbo(position = [0, 0, 0], difficulty:number) {
    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});

    const obstacle = await this.obstacle({x: position[0], y: position[1], z: position[2]});
    obstacle.scale.set(4, 0.3, 0.3);

    const body: Body = new Body(this.rapier);
    await body.create(
      {
        body: {
          type:'kinematicPosition',
          userData: {name: 'obstacle'}
        },
        collider: {
          restitution:0.2, friction: 0
        },
        
        object3d: obstacle
      }
    );

    const timeOffset = Math.random() * Math.PI * 2;
    body.useFrame = (clock: any) => {
      const time = clock.time;
      const y = Math.sin(1.5 * difficulty * time + timeOffset) + 1.3;
      body.rigidBody.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y,
        z: position[2],
      });
    };

    return [beach, obstacle];

  }

  /**
   * BlockDoubleLimbo
   */

  public async BlockDoubleLimbo(position = [0, 0, 0], difficulty:number) {

    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});

    const obstacle1 = await this.obstacle({x: position[0], y: position[1], z: position[2]});
    obstacle1.scale.set(4, 0.3, 0.3);

    const body: Body = new Body(this.rapier);
    await body.create(
      {
        body: {
          type:'kinematicPosition',
          userData: {name: 'obstacle'}
        },
        collider: {
          restitution:0.2, friction: 0
        },
        
        object3d: obstacle1
      }
    );

    const timeOffset = Math.random() * Math.PI * 2;
    body.useFrame = (clock: any) => {
      const time = clock.time;
      const y = 0.3 * Math.sin(difficulty * 1.5 * time + timeOffset) + 1.3;
      body.rigidBody.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y + 0.2,
        z: position[2],
      });
    };

    const obstacle2 = await this.obstacle({x: position[0], y: position[1], z: position[2]});
    obstacle2.scale.set(4, 0.3, 0.3);

    const body1: Body = new Body(this.rapier);
    await body1.create(
      {
        body: {
          type:'kinematicPosition',
          userData: {name: 'obstacle'}
        },
        collider: {
          restitution:0.2, friction: 0
        },
        
        object3d: obstacle2
      }
    );

    body1.useFrame = (clock: any) => {
      const time = clock.time;
      const y = -0.3 * Math.sin(1.5 * difficulty * time + timeOffset) + 1.3;
      body1.rigidBody.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y- 0.8,
        z: position[2],
      });
    };


    return [beach, obstacle1, obstacle2];
  }

  /**
   * BlockPlatformLimbo
   */

  public async BlockPlatformLimbo(position = [0, 0, 0], difficulty:number) {
    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});

    const obstacle = await this.obstacle({x: position[0], y: position[1], z: position[2]});
    obstacle.scale.set(4, 0.3, 3);

    const body: Body = new Body(this.rapier);
    await body.create(
      {
        body: {
          type:'kinematicPosition',
          userData: {name: 'obstacle'}
        },
        collider: {
          restitution:0.2, friction: 0
        },
        object3d: obstacle
      }
    );


    const timeOffset = Math.random() * Math.PI * 2;
    body.useFrame = (clock: any) => {
      const time = clock.time;
      const y = Math.sin(1.5 * difficulty * time + timeOffset) + 1.3;
      body.rigidBody.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y,
        z: position[2],
      });
    };

    return [beach, obstacle];
  }

  /**
   * BlockRamp
   */

  public async BlockRamp(position = [0, 0, 0], difficulty:number) {
    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});

    const obstacle = await this.obstacle({x: position[0], y: position[1] + 0.4, z: position[2]});
    obstacle.scale.set(4, 0.3, 1.5);
    obstacle.rotation.set(0.75, 0, 0);
    // obstacle.rotation.set(100, 0.75, 0.75);


    const body: Body = new Body(this.rapier);
    await body.create(
      {
        body: {
          type:'kinematicPosition',
          userData: {name: 'obstacle'}
        },
        collider: {
          restitution:0.2, friction: 0
        },
        object3d: obstacle
      }
    );

    return [beach, obstacle];
  }

  /**
   * BlockSlidingWall
   */
  public async BlockSlidingWall(position = [0, 0, 0], difficulty:number) {

    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});

    const obstacle = await this.obstacle({x:position[0], y: position[1], z: position[2]});
    obstacle.scale.set(1.7, 1.8, 0.3);

    const body: Body = new Body(this.rapier);
    await body.create(
      {
        body: {
          type:'kinematicPosition',
          userData: {name: 'obstacle'}
        },
        collider: {
          restitution:0.2, friction: 0
        },
        object3d: obstacle
      }
    );

    const timeOffset = Math.random() * Math.PI * 2;

    body.useFrame = (clock: any) => {
      const time = clock.time;
      const x = Math.sin(difficulty * 1.5 * time + timeOffset) * 1.25;
      body.rigidBody.setNextKinematicTranslation({
        x: position[0] + x,
        y: position[1] + 0.75,
        z: position[2],
      });
    };

    return [beach, obstacle];
  }

  /**
   * BlockDoubleSlidingWall
   */

  public async BlockDoubleSlidingWall(position = [0, 0, 0], difficulty:number) {
    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});

    const obstacle1 = await this.obstacle({x: position[0], y: position[1], z: position[2]});
    obstacle1.scale.set(1, 1.8, 0.3);

    const body: Body = new Body(this.rapier);
    await body.create(
      {
        body: {
          type:'kinematicPosition',
          userData: {name: 'obstacle'}
        },
        collider: {
          restitution:0.2, friction: 0
        },
        object3d: obstacle1
      }
    );

    const timeOffset = Math.random() * Math.PI * 2;

    body.useFrame = (clock: any) => {
      const time = clock.time;
      const x1 = Math.sin(difficulty * 2 * time + timeOffset) * 0.5 + 1;
      body.rigidBody.setNextKinematicTranslation({
        x: position[0] + x1,
        y: position[1] + 0.75,
        z: position[2],
      });
    };

    const obstacle2 = await this.obstacle({x: position[0], y: position[1], z: position[2]});
    obstacle2.scale.set(1, 1.8, 0.3);

    const body1: Body = new Body(this.rapier);
    await body1.create(
      {
        body: {
          type:'kinematicPosition',
          userData: {name: 'obstacle'}
        },
        collider: {
          restitution:0.2, friction: 0
        },
        object3d: obstacle2
      }
    );

    body1.useFrame = (clock: any) => {
      const time = clock.time;
      const x2 = -Math.sin(difficulty * 2 * time + timeOffset) * 0.5 - 1;
      body1.rigidBody.setNextKinematicTranslation({
        x: position[0] + x2,
        y: position[1] + 0.75,
        z: position[2],
      });
    };

    return [beach, obstacle1, obstacle2];
  }


  /**
   * BlockEnd
   */
  public async BlockEnd(position = [0, 0, 0]) {

    console.log('============ BlockEnd:')
    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});

    // const mesh = new Mesh();
    // const star = await mesh.loadGLTF({
    let star:THREE.Mesh | any;
    let body: Body;
    await new Mesh().loadGLTF({
      url: '/models/star.glb', 
    },(gltf:any)=>{
      star = gltf.getObjectByName('pCylinder3');
      star.castShadow = true;
      star.receiveShadow = true; 
      star.position.set(position[0], 1.05 + position[1], position[2]);
      star.scale.set(0.012, 0.012, 0.012);
      body = new Body(this.rapier);
      body.create(
        {
          body: {
            type:'fixed', 
            userData: {name: 'star'},
            // colliders: 'trimesh', 
            // position: {x:0+position[0], y:1.05+position[1], z:0+position[2]}, 
            // rotation:{x:0, y:Math.PI / 2, z:0}, 
            // restitution:0.2, friction: 0,
            onCollisionEnter:this.onHit
          },
          collider: {
            shape: 'trimesh', 
            rotation:{x:0, y:Math.PI / 2, z:0},
            restitution:0.2, friction: 0
          },
          object3d: star,
        }
      );
    });

    const tween = {
      prerotate: 0,
      rotate: -1,
    };

    GSAP.gsap.to(tween, {
      // duration: 0.25,
      duration: 0.5,
      ease: GSAP.Linear.easeNone,
      repeat:-1,
      rotate: 1, 

      // rotate: 3,
      onUpdate: () => {
        // 2초동안(duration) bounce.out 으로 position의 각 값들이 변화된느 것을 확인 할 수 있습니다.
        body.rigidBody.setRotation({  x: 0.0, y: tween.rotate, z: 0.0, w: 1.0 }, true);
    
      },
      onComplete: () => {
        
      }
    });

    return [beach, star];
    // this.createRigidBody(
    //   {type:'fixed', colliders: 'trimesh', position: [0, 1.05, 0], rotation:[0, Math.PI / 2, 0], restitution:0.2, friction: 0},
    //   {type:'star', scale:0.012},
    //   group
    // );


    // const star: any = await Star(null);
    // star.scale.set(0.012);
    // group.add(star);
    // return group;

   

  }
  

  private onHit() {
    this.event.broadcast('status', {phase: 'end'});
  }

}
