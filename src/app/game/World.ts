import * as THREE from 'three';
import RAPIER, { Vector3 } from '@dimforge/rapier3d-compat';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {RapierDebugRenderer} from './rapier/RapierDebugRenderer'
// import {Animation} from './Animation';

export class World {

  private game: any;

  private container: any;
  public scene = new THREE.Scene();
  // public rapierWorld!:RAPIER.World;
  private clock = new THREE.Clock();

  private rapierDebugRenderer: RapierDebugRenderer;

  // public dynamicBodies: [THREE.Object3D, RAPIER.RigidBody][] = [];

  private controls!:OrbitControls;

  private renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
 
  private camera:THREE.PerspectiveCamera; 
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
    // this.rapierWorld.step()


    // const { vertices, colors } = this.game.rapier.world.debugRender()

    // for (let i = 0, n = this.dynamicBodies.length; i < n; i++) {
    //   this.dynamicBodies[i][0].position.copy(this.dynamicBodies[i][1].translation())
    //   this.dynamicBodies[i][0].quaternion.copy(this.dynamicBodies[i][1].rotation())
    // }
    for (let i = 0, n = this.game.rapier.dynamicBodies.length; i < n; i++) {
      // const { vertices, colors } = this.game.rapier.world.debugRender()
     
      // this.game.rapier.dynamicBodies[i][0].position.copy(this.game.rapier.dynamicBodies[i][1].translation())
      // this.game.rapier.dynamicBodies[i][0].quaternion.copy(this.game.rapier.dynamicBodies[i][1].rotation())
      // console.log('===========================');
      // console.log(this.game.rapier.dynamicBodies[i][1].translation());
      if(this.game.rapier.dynamicBodies[i][0].parent instanceof THREE.Scene) {
        this.game.rapier.dynamicBodies[i][0].position.copy(this.game.rapier.dynamicBodies[i][1].translation())
        this.game.rapier.dynamicBodies[i][0].quaternion.copy(this.game.rapier.dynamicBodies[i][1].rotation())
      } else {
        
        const position = this.game.rapier.dynamicBodies[i][1].translation();
        var v =  new THREE.Vector3(position.x, position.y, position.z); // world position
        // console.log(v);
        // var nowposition = this.game.rapier.dynamicBodies[i][0].parent.worldToLocal(v);
        // console.log('nowposition:', nowposition);
        // v.copy(this.game.rapier.dynamicBodies[i][0].position);
        // this.game.rapier.dynamicBodies[i][0].localToWorld(v);
        
        this.game.rapier.dynamicBodies[i][0].position.copy(this.game.rapier.dynamicBodies[i][1].translation())
        this.game.rapier.dynamicBodies[i][0].quaternion.copy(this.game.rapier.dynamicBodies[i][1].rotation())

        // const position = this.game.rapier.dynamicBodies[i][1].translation();
        // // console.log('position:', position);
        // const vector3 = new THREE.Vector3(position.x, position.y, position.z);
        // // console.log('vector3:', vector3);
        // const newPosition = this.game.rapier.dynamicBodies[i][0].clone().worldToLocal(vector3);
        // this.game.rapier.dynamicBodies[i][0].position.copy(newPosition);
        // // console.log('newPosition:', newPosition);
        // // console.log('this.game.rapier.dynamicBodies[i][1].translation():', this.game.rapier.dynamicBodies[i][1].translation());
        // this.game.rapier.dynamicBodies[i][0].quaternion.copy(this.game.rapier.dynamicBodies[i][1].rotation())
      }
      
      // this.game.rapier.dynamicBodies[i][0].position.copy(this.game.rapier.dynamicBodies[i][1].translation())
      // const rigid = this.game.rapier.dynamicBodies[i][1].translation();
      // console.log('this.game.rapier.dynamicBodies[i][1].translation():', [rigid.x, rigid.y, rigid.z])
      // console.log('this.game.rapier.dynamicBodies[i][0]:', this.game.rapier.dynamicBodies[i][0].position.clone())
      // this.game.rapier.dynamicBodies[i][0].position.clone().copy( rigid );
      // new Vector(rigid.x, rigid.y, rigid.z).worldToLocal( this.game.rapier.dynamicBodies[i][0].position );
      // this.game.rapier.dynamicBodies[i][0].position.updateWorldMatrix(true, true);

      // this.game.rapier.dynamicBodies[i][0].quaternion.copy(this.game.rapier.dynamicBodies[i][1].rotation())
    }
    
    this.controls.update();
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