import * as THREE from "three";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class LoaderGlb {
  public body!:THREE.Group; 
  public mesh: any;
  public geometry: any;
  public material: any;
  constructor() {
    // this.create(args);
  }

  /**
   * 
   * @param args 
   * @param geometry {type: sphereGeometry}
   * @param material 
   */
  public async create(args: any = {}) {
    this.body = await this.loader(args.url);
    this.mesh = this.body.children[0];

    if(args.name) this.mesh.name = args.name;
    if(args.scale) this.mesh.scale.set(args.scale.x, args.scale.y, args.scale.z);
    if(args.castShadow) this.mesh.castShadow = args.castShadow;
    if(args.receiveShadow) this.mesh.receiveShadow = args.receiveShadow;
    // if(args.scale) this.mesh.scale.set(1, 1, 1);
    return this;
  }

/*
  private loader(url: string) {


    const loader = new GLTFLoader().loadAsync(url).then((glb) => {
  
        // this.myModel = glb.scene.children[0];
      const myModel = glb.scene; 
        

    });
  }
  */

  private loader(url: string) {

    return new Promise<THREE.Group>((resolve, reject) => {
      const loader = new GLTFLoader(); 
      loader.load(url,  ( glb ) => {
        // this.myModel = glb.scene.children[0];
        const myModel = glb.scene; 
        resolve(myModel);
      }, ( xhr ) => {// called while loading is progressing
        // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      }, ( error ) => {// called when loading has errors
        // console.log( 'An error happened' );
      });
    })
  }



}