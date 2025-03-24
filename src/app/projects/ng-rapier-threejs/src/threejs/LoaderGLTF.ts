import * as THREE from "three";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class LoaderGLTF {
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
  public async create(url: string) {

    const body = await this.loader(url);
    const mesh:THREE.Object3D = body.children[0];

   
    // if(args.scale) this.mesh.scale.set(1, 1, 1);
    return mesh;
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