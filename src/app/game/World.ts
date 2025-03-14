import * as THREE from 'three';
import RAPIER, { Vector3 } from '@dimforge/rapier3d-compat';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {RapierDebugRenderer} from './rapier/RapierDebugRenderer'
// import {Animation} from './Animation';

export class World {

  public game: any;
  // public game:<T> ()= {} as T
  
  private container: any;
  public scene = new THREE.Scene();
  // public rapierWorld!:RAPIER.World;
  private clock = new THREE.Clock();

  private rapierDebugRenderer: RapierDebugRenderer;

  // public dynamicBodies: [THREE.Object3D, RAPIER.RigidBody][] = [];

  private controls!:OrbitControls;

  private renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
 
  public camera:THREE.PerspectiveCamera; 
  private lights: any;
  private stage = { width: 2, height: 3 };
  private fov = 10;

  private width!: number;
  private height!: number;



  private onResize = [];


  constructor( game: any ) {

    // super( true );
    this.game = game;
    // this.createRapier();
   
    // this.game.ball;
    this.container = document.getElementById('game');

    const sceneWidth = window.innerWidth;
    const sceneHeight  = window.innerHeight;

    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( sceneWidth, sceneHeight );
    this.container.appendChild( this.renderer.domElement );

    this.createLights();
    // this.setAxesHelper();
    this.resize();
    window.addEventListener( 'resize', () => this.resize(), false );


    const fov = 25; // 45
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1; 
    const far = 200; // 200

    this.camera = new THREE.PerspectiveCamera( fov, aspect, near, far )
    this.camera.position.set( 0, 0, 100 ); // 0, 0, 200



    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled


    const helper = new THREE.GridHelper( 1000, 40, 0x303030, 0x303030 );
    helper.position.y = -75;
    this.scene.add( helper );

    this.rapierDebugRenderer = new RapierDebugRenderer(this.scene, this.game.rapier.world)

    setTimeout(() => {
      this.update();
    }, 1000);
   

  }

  // private async createRapier() {

  //   await RAPIER.init(); // This line is only needed if using the compat version
  //   const gravity = new RAPIER.Vector3(0.0, -9.81, 0.0);
  //   this.rapierWorld = new RAPIER.World(gravity);


   
  // }

  public render() {


    const delta = this.clock.getDelta();
    this.game.rapier.world.timestep = Math.min(delta, 0.1);
    this.game.rapier.world.step();


    for (let i = 0, n = this.game.rapier.dynamicBodies.length; i < n; i++) {
      this.game.rapier.dynamicBodies[i].object3d.position.copy(this.game.rapier.dynamicBodies[i].rigidBody.translation())
      this.game.rapier.dynamicBodies[i].object3d.quaternion.copy(this.game.rapier.dynamicBodies[i].rigidBody.rotation())
      this.game.rapier.dynamicBodies[i].update(this.clock);
    }
    
    this.controls.update();
    // this.game.ball.update();
    if(this.game.ball) {
      // console.log(delta);
      this.game.ball.update(delta);
    }
    this.rapierDebugRenderer.update();
    this.renderer.render( this.scene, this.camera );
  }

  private update = () => {
    this.render();
    requestAnimationFrame(this.update); // request next update
  }

  private resize() {
/*
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer.setSize( this.width, this.height );

    
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

    // if ( this.onResize ) this.onResize.forEach( (cb) => cb() );

  }

  createLights() {

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

}