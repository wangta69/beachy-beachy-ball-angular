import * as THREE from "three";
import RAPIER from '@dimforge/rapier3d-compat';




export class Rapier {
  public world!: RAPIER.World;
  public dynamicBodies: [THREE.Object3D, RAPIER.RigidBody][] = [];

  /**
   * 
   * @param args 
   */
  constructor() {

  }

  public async initRapier(x: number, y: number, z: number) {

    await RAPIER.init(); // This line is only needed if using the compat version
    const gravity = new RAPIER.Vector3(x, y, z);
    this.world = new RAPIER.World(gravity);
    console.log('async initRapier........this.world:', this.world);

  }


}


