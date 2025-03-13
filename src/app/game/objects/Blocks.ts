import * as THREE from "three";

import {Mesh} from '../threejs/Mesh';
import {RigidBody} from '../rapier/RigidBody';
import * as GSAP from 'gsap';
import { UseFrame } from '../rapier/Interface';


export class Blocks {
  private game: any;

  public blockDimensions = {
    width: 4.2,
    height: 0.3,
    length: 4,
  };

  constructor(game: any) {
    this.game = game;
  }

  private async beach(position:THREE.Vector3Like) {
    const mesh = new Mesh();
    const beach = await mesh.create({
      geometry: {type: 'box', width: 1, height: 1, depth: 1},
      material: {type: 'standard', color: 'orange'},
      mesh: {
        position:new THREE.Vector3(0, -0.2, 0).add(position),
        scale: {x: this.blockDimensions.width,  y:this.blockDimensions.height, z:this.blockDimensions.length},
        receiveShadow: true
      }
    });

    const rigidBody: any = new RigidBody(this.game.rapier);
    await rigidBody.create(
      {
        rigidBody: {
          name: 'beach',
          type:'kinematicPosition', 
          restitution:0.2, friction: 0,
        },
        object3d: beach
      }
    );
    return beach;
  }

  private async obstacle(position:THREE.Vector3Like) {
    const mesh = new Mesh();
    const beach = await mesh.create({
      geometry: {type: 'box', width: 1, height: 1, depth: 1},
      material: {type: 'standard', color: 'tomato'},
      mesh: {
        position:new THREE.Vector3(0, -0.2, 0).add(position),
        // scale: {x: this.blockDimensions.width,  y:this.blockDimensions.height, z:this.blockDimensions.length},
        castShadow: true,
        receiveShadow: true
      }
    });
    return beach;
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

    const rigidBody: any = new RigidBody(this.game.rapier);
    await rigidBody.create(
      {
        rigidBody: {
          name: 'obstacle',
          type:'kinematicPosition', 
          restitution:0.2, friction: 0,
        },
        
        object3d: obstacle
      }
    );


    const speed = (Math.random() + difficulty + 0.5) * (Math.random() < 0.5 ? -1 : 1);

    rigidBody.useFrame = (clock: UseFrame) => {
      const time = clock.time;
      const rotation = new THREE.Quaternion();

      rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
      rigidBody.rigidBody.setNextKinematicRotation(rotation);
    };

    return [beach, obstacle];

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
        <mesh beachMaterial OK />
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

    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});

    const obstacle1 = await this.obstacle({x:position[0] + this.blockDimensions.width / 4, y: position[1] + 0.4, z: position[2]});
    obstacle1.scale.set(2.25, 0.3, 0.3);
    const rigidBody: any = new RigidBody(this.game.rapier);
    await rigidBody.create(
      {
        rigidBody: {
          name: 'obstacle',
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },       
        object3d: obstacle1
        //  {
        //   scale: {x:2.25, y:0.3, z:0.3}, castShadow: true, receiveShadow: true
        // }
      }
    );

    const direction = (Math.random() < 0.5 ? -1 : 1);
    const speed = difficulty * 2 * direction;
    rigidBody.useFrame = (clock: UseFrame) => {
      const time = clock.time;
      const rotation = new THREE.Quaternion();

      rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
      rigidBody.rigidBody.setNextKinematicRotation(rotation);
    };

    // const obstacle1 = rigidBody.meshObject.mesh;

    // this.createRigidBody(
    //   {type:'kinematicPosition', position: [this.blockDimensions.width / 4, 0.4, 0], restitution:0.2, friction: 0},
    //   {type:'mesh', geometry: 'boxGeometry', material: 'obstacleMaterial', scale: [2.25, 0.3, 0.3], castShadow: true, receiveShadow: true},
    //   group
    // );

    const obstacle2 = await this.obstacle({x: -this.blockDimensions.width / 4 + position[0], y: position[1] + 0.4, z: position[2]});
    obstacle2.scale.set(1.8, 0.3, 0.3);
    const rigidBody1: any = new RigidBody(this.game.rapier);
    rigidBody1.create(
      {
        rigidBody: {
          name: 'obstacle',
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },
        object3d: obstacle2
      }
    );

    rigidBody1.useFrame = (clock: UseFrame) => {
      const time = clock.time;
      const rotation = new THREE.Quaternion();
      rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
      rigidBody1.rigidBody.setNextKinematicRotation(rotation);
    };

    return [beach, obstacle1, obstacle2];
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
        <mesh beachMaterial OK />
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
    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});

    const obstacle = await this.obstacle({x: position[0], y: position[1], z: position[2]});
    obstacle.scale.set(4, 0.3, 0.3);

    const rigidBody: any = new RigidBody(this.game.rapier);
    await rigidBody.create(
      {
        rigidBody: {
          name: 'obstacle',
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },
        
        object3d: obstacle
      }
    );

    const timeOffset = Math.random() * Math.PI * 2;
    rigidBody.useFrame = (clock: UseFrame) => {
      const time = clock.time;
      const y = Math.sin(1.5 * difficulty * time + timeOffset) + 1.3;
      rigidBody.rigidBody.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y,
        z: position[2],
      });
    };

    return [beach, obstacle];
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
        <mesh beachMaterial OK />
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

    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});

    const obstacle1 = await this.obstacle({x: position[0], y: position[1], z: position[2]});
    obstacle1.scale.set(4, 0.3, 0.3);

    const rigidBody: any = new RigidBody(this.game.rapier);
    await rigidBody.create(
      {
        rigidBody: {
          name: 'obstacle',
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },
        
        object3d: obstacle1
      }
    );

    const timeOffset = Math.random() * Math.PI * 2;
    rigidBody.useFrame = (clock: UseFrame) => {
      const time = clock.time;
      const y = 0.3 * Math.sin(difficulty * 1.5 * time + timeOffset) + 1.3;
      rigidBody.rigidBody.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y + 0.2,
        z: position[2],
      });
    };

    const obstacle2 = await this.obstacle({x: position[0], y: position[1], z: position[2]});
    obstacle2.scale.set(4, 0.3, 0.3);

    const rigidBody1: any = new RigidBody(this.game.rapier);
    rigidBody1.create(
      {
        rigidBody: {
          name: 'obstacle',
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },
        
        object3d: obstacle2
      }
    );

    rigidBody1.useFrame = (clock: UseFrame) => {
      const time = clock.time;
      const y = -0.3 * Math.sin(1.5 * difficulty * time + timeOffset) + 1.3;
      rigidBody1.rigidBody.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y- 0.8,
        z: position[2],
      });
    };


    return [beach, obstacle1, obstacle2];
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
        <mesh beachMaterial OK />
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
    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});

    const obstacle = await this.obstacle({x: position[0], y: position[1], z: position[2]});
    obstacle.scale.set(4, 0.3, 3);

    const rigidBody: any = new RigidBody(this.game.rapier);
    await rigidBody.create(
      {
        rigidBody: {
          name: 'obstacle',
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },
        
        object3d: obstacle
      }
    );


    const timeOffset = Math.random() * Math.PI * 2;
    rigidBody.useFrame = (clock: UseFrame) => {
      const time = clock.time;
      const y = Math.sin(1.5 * difficulty * time + timeOffset) + 1.3;
      rigidBody.rigidBody.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y,
        z: position[2],
      });
    };

    return [beach, obstacle];
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
        <mesh beachMaterial OK />
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
    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});

    const obstacle = await this.obstacle({x: position[0], y: position[1] + 0.4, z: position[2]});
    obstacle.scale.set(4, 0.3, 1.5);
    obstacle.rotation.set(0.75, 0, 0);
    // obstacle.rotation.set(100, 0.75, 0.75);


    const rigidBody: any = new RigidBody(this.game.rapier);
    await rigidBody.create(
      {
        rigidBody: {
          name: 'obstacle',
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },
        
        object3d: obstacle
      }
    );

    return [beach, obstacle];
    /*
    return (
      <group position={position}>
        <mesh beachMaterial OK />
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

    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});

    const obstacle = await this.obstacle({x:position[0], y: position[1], z: position[2]});
    obstacle.scale.set(1.7, 1.8, 0.3);

    const rigidBody: any = new RigidBody(this.game.rapier);
    await rigidBody.create(
      {
        rigidBody: {
          name: 'obstacle',
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },
        object3d: obstacle
      }
    );

    const timeOffset = Math.random() * Math.PI * 2;

    rigidBody.useFrame = (clock: UseFrame) => {
      const time = clock.time;
      const x = Math.sin(difficulty * 1.5 * time + timeOffset) * 1.25;
      rigidBody.rigidBody.setNextKinematicTranslation({
        x: position[0] + x,
        y: position[1] + 0.75,
        z: position[2],
      });
    };

    return [beach, obstacle];
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
        <mesh beachMaterial OK />
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
    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});

    


    const obstacle1 = await this.obstacle({x: position[0], y: position[1], z: position[2]});
    obstacle1.scale.set(1, 1.8, 0.3);

    const rigidBody: any = new RigidBody(this.game.rapier);
    await rigidBody.create(
      {
        rigidBody: {
          name: 'obstacle',
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },
        
        object3d: obstacle1
      }
    );

    const timeOffset = Math.random() * Math.PI * 2;

    rigidBody.useFrame = (clock: UseFrame) => {
      const time = clock.time;
      const x1 = Math.sin(difficulty * 2 * time + timeOffset) * 0.5 + 1;
      rigidBody.rigidBody.setNextKinematicTranslation({
        x: position[0] + x1,
        y: position[1] + 0.75,
        z: position[2],
      });
    };

    const obstacle2 = await this.obstacle({x: position[0], y: position[1], z: position[2]});
    obstacle2.scale.set(1, 1.8, 0.3);

    const rigidBody1: any = new RigidBody(this.game.rapier);
    rigidBody1.create(
      {
        rigidBody: {
          name: 'obstacle',
          type:'kinematicPosition', 
          restitution:0.2, friction: 0
        },
        object3d: obstacle2
      }
    );

    rigidBody1.useFrame = (clock: UseFrame) => {
      const time = clock.time;
      const x2 = -Math.sin(difficulty * 2 * time + timeOffset) * 0.5 - 1;
      rigidBody1.rigidBody.setNextKinematicTranslation({
        x: position[0] + x2,
        y: position[1] + 0.75,
        z: position[2],
      });
    };

    return [beach, obstacle1, obstacle2];
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
        <mesh beachMaterial OK />
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
    const beach = await this.beach({x: position[0], y: position[1], z: position[2]});

    const mesh = new Mesh();
    const star = await mesh.loadGLTF({
      url: '/models/star.glb', 
      name: 'pCylinder3', 
      castShadow: true, 
      receiveShadow: true, 
      position: {x: position[0], y: 1.05 + position[1], z: position[2]},
      scale:{x:0.012, y:0.012, z:0.012}});

   
    const rigidBody: RigidBody = new RigidBody(this.game.rapier);
    await rigidBody.create(
      {
        rigidBody: {
          name: 'star',
          type:'fixed', 
          colliders: 'trimesh', 
          // position: {x:0+position[0], y:1.05+position[1], z:0+position[2]}, 
          rotation:{x:0, y:Math.PI / 2, z:0}, 
          restitution:0.2, friction: 0
        },
        object3d: star,
      }
    );


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

    return [beach, star];
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
        <mesh beachMaterial OK />
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
