import * as THREE from "three";
import {Material} from './Material';
import {LoaderGLTF} from './LoaderGLTF';
export class Mesh {
  public mesh!: THREE.Object3D | THREE.Mesh;
  public geometry: any;
  public material: any;
  constructor(args: any = {}) {
    // this.create(args);
  }

  /**
   * 
   * @param args 
   * @param geometry {type: sphereGeometry}
   * @param material 
   */
  public async create(args: any) {


  // const sphereGeometry = new THREE.SphereGeometry(0.3, 128, 128);
    //   const meshStandardMaterial = new THREE.MeshStandardMaterial({  map: ballTexture, flatShading: true });
    //   // const meshStandardMaterial = new THREE.MeshStandardMaterial({  flatShading: true });
    //   this.bodyMesh = new THREE.Mesh( sphereGeometry, meshStandardMaterial);
    //   this.bodyMesh.castShadow = true;
    //   // sphereGeometry.scale(10, 10, 10); // 공이 안보여서 임시로
    //   this.game.world.scene.add(this.bodyMesh);
    //   this.bodyMesh.position.set(0, 1, 0);

    this.createGeometry(args.geometry)
    const material = new Material();
    this.material = await material.createMaterial(args.material);
    // this.createMaterial(args.material);
    this.mesh = this.createMesh(args.mesh || {});
    return this.mesh;
  }

  public async loadGLTF(args: any) {
    const loader = new LoaderGLTF();
    this.mesh = await loader.create(args.url);
    this.mesh.name = args.name || null;
    args.scale? this.mesh.scale.set(args.scale.x, args.scale.y, args.scale.z): null;
    this.mesh.castShadow = args.castShadow || false;
    this.mesh.receiveShadow = args.receiveShadow || false;
    this.mesh.position.set(args.position.x, args.position.y, args.position.z);

    return this.mesh;
  }

  private createGeometry(args: any) {
    switch(args.type) {
      case 'box':
        this.geometry = new THREE.BoxGeometry(args.width, args.height, args.depth);
        break;
      case 'sphere':
        this.geometry = new THREE.SphereGeometry(args.radius, args.width, args.height);
        break;
    }
  }

  // private createMaterial(args: any) {
  //   this.loadmap(args);
  //   switch(args.type) {
  //     case 'standard':
  //       this.material = new THREE.MeshStandardMaterial({  map: args.map, flatShading: args.flatShading, color: args.color });
  //       // if(args.color) this.material.setColor(args.color);
  //       break;
  //   }
  // }

  private createMesh(args: any) {
    const mesh = new THREE.Mesh( this.geometry, this.material);
    if(args.position) mesh.position.set(args.position.x, args.position.y, args.position.z);
    if(args.scale) mesh.scale.set(args.scale.x, args.scale.y, args.scale.z);
    if(args.castShadow) mesh.castShadow = true;
    if(args.receiveShadow) mesh.receiveShadow = true;

    return mesh
  }
}