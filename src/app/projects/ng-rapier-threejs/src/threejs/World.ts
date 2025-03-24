import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

@Injectable({
  providedIn: 'root',
})
export class World {

  public game: any;
  // public game:<T> ()= {} as T
  
  private container: any;
  public scene = new THREE.Scene();
  private clock = new THREE.Clock();

  public updates:any[] = [];

  private controls!:OrbitControls;
  private controlsEnable = false;

  private renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
 
  public camera!:THREE.PerspectiveCamera; 
  private lights: any;
  private screen = {width: 0, height: 0};

  constructor() {}

  public create() {

    this.container = document.getElementById('game');
    this.setScrensize();
    
    this.createRenderer();

  
    this.createLights();
    // this.setAxesHelper();
    
    // window.addEventListener( 'resize', () => this.onResize(), false );

    this.createCamera();
   
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled


    const helper = new THREE.GridHelper( 1000, 40, 0x303030, 0x303030 );
    helper.position.y = -75;
    this.scene.add( helper );

    setTimeout(() => {
      this.update();
    }, 1000);
  }

  private setScrensize() {
    this.screen = {width:  window.innerWidth, height: window.innerHeight};
  }
  private createRenderer() {
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( this.screen.width, this.screen.height );
    this.container.appendChild( this.renderer.domElement );
  }

  private createCamera() {
    const fov = 25; // 현재값 : 25
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1; 
    const far = 200; // 200

    this.camera = new THREE.PerspectiveCamera( fov, aspect, near, far )
    this.camera.position.set( 0, 0, 100 ); // 0, 0, 200
  }

  public onResize() {
    this.setScrensize();
    this.renderer.setSize( this.screen.width, this.screen.height );
  /*
  
      
      this.camera.fov = this.fov;
      this.camera.aspect = this.width / this.height;
  
      const aspect = this.stage.width / this.stage.height;
      const fovRad = this.fov * THREE.MathUtils.DEG2RAD;
  
      let distance = ( aspect < this.camera.aspect )
        ? ( this.stage.height / 2 ) / Math.tan( fovRad / 2 )
        : ( this.stage.width / this.camera.aspect ) / ( 2 * Math.tan( fovRad / 2 ) );
  
      distance *= 0.5;
  
      this.camera.position.set( distance, distance, distance);
      this.camera.lookAt( this.scene.position );
      this.camera.updateProjectionMatrix();
  
      const docFontSize = ( aspect < this.camera.aspect )
        ? ( this.height / 100 ) * aspect
        : this.width / 100;
  
      document.documentElement.style.fontSize = docFontSize + 'px';
  
      */
  
 
    }
    
    private createLights() {
  
      this.lights = {
        holder:  new THREE.Object3D,
        ambient: new THREE.AmbientLight( 0xffffff, 0.7),
        front:   new THREE.DirectionalLight( 0xffffff, 3 ),
        back:    new THREE.DirectionalLight( 0xffffff, 0.19 ),
      };
  
      this.lights.front.position.set( 1.5, 5, 3 );
      this.lights.back.position.set( -1.5, -5, -3 );
  
      this.lights.holder.add( this.lights.ambient );
      this.lights.holder.add( this.lights.front );
      this.lights.holder.add( this.lights.back );
  
      this.scene.add( this.lights.holder );
  
    }

  public render() {
    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();
    if(this.controlsEnable) {
      this.controls.update();
    }

    this.updates.forEach((fnc:(body: any) => void)=>{
      fnc({delta, elapsedTime});
    })

    this.renderer.render( this.scene, this.camera );
  }

  private update = () => {
    this.render();
    requestAnimationFrame(this.update); // request next update
  }



}