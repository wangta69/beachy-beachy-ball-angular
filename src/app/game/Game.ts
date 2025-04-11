import { Component,OnInit,AfterViewInit,ViewChild,ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import {Rapier, World, EventListener} from '../../../projects/ng-rapier-threejs/src/public-api';
// import {Rapier, World} from 'ng-rapier-threejs'
import {Ball} from './objects/Ball';
import {Levels} from './level/Level';
import {Settings} from './interface/types';
import {Event, Message} from './services/event.service';
import {Storage} from './services/storage.service';
import {Sounds} from './services/sound.service';
import {Interface} from './interface/Interface';

@Component({
  standalone: true,
  selector: 'app-game',
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, MatIconModule, Interface], // , 
  templateUrl: './game.html',
  styleUrls: ['./game.scss']
})
export class Game implements OnInit, AfterViewInit{
  // private game = {
  //   isInGame: false,
  //   isSettings: false,
  //   mode: 'random',
  //   difficulty: 1,
  //   blocksCount: 10,
  //   level: 'copacabana',
  //   audio: true
  // }

  public world!:World;
  public ball!:Ball;
  public rapier!:Rapier;
  private isInGame = false;
  public isSettings = false;
  private performance = false;
  public mode = 'random';
  public difficulty = 1;
  public blocksCount = 10;
  private sounds: Sounds;
  private levels!:Levels;
  public level = 'copacabana';



  public settings: Settings = {
    isInGame: false,
    isSettings: false,
    mode: 'random',
    difficulty: 1,
    blocksCount: 10,
    level: 'copacabana',
    audio: true
  }

  public statics:any = {
    random: {highscore: 0},
    copacabana: {highscore: 0},
    santamonica: {highscore: 0},
  }

  // private highScoreRandom = 0;
  // private highScoreCopacabana = 0;
  // private highScoreSantaMonica = 0;

  // Time
  private startTime = 0;
  private endTime = 0;
  // private blocksSeed = 0;
  // Phases
  // private phase = 'ready';
  private phase = 'playing'; // playing | ready
  private state:any;
  public event: Event;
  public evListener: EventListener;
  private storage: Storage;

  constructor(event: Event, storage: Storage, world: World, sounds: Sounds, evListener: EventListener) { // 
    
    this.storage = storage;
    this.world = world;
    this.evListener = evListener;
    this.sounds = sounds;
    this.settings = storage.get('beachyball.settings');

    const statics = storage.get('beachyball.statics');
    statics ? this.statics = statics : null; 

    // this.mode = getLocalStorage("mode") || "random"; // "random", "tour", "adventure"
    // this.difficulty = parseInt(getLocalStorage("difficulty")) || 1; // 1, 1.25, 1.5, 2
    // this.blocksCount = parseInt(getLocalStorage("blocksCount")) || 10;
    // this.level = getLocalStorage("level") || "copacabana";
     // High scores
    // this.highScoreRandom = getLocalStorage("highScoreRandom") || 0;
    // this.highScoreCopacabana = getLocalStorage("highScoreCopacabana") || 0;
    // this.highScoreSantaMonica = getLocalStorage("highScoreSantaMonica") || 0;  
    this.event = event;


    event.subscribe().subscribe((res: Message) => {
  
      switch(res.type) {
        case 'status': 
          // this.state = res.payload;
       //   this.phase = res.payload.phase;
          switch(res.payload.phase) {
            case 'restart':
              // this.restart();
              if (this.phase === "playing" || this.phase === "ended") {
                // return { phase: "ready", blocksSeed: Math.random() };

                this.ball.action({act:'ready'});
                // this.phase = 'ready';
                // this.event.broadcast('status', {phase: 'ready'});
              }
              //  return { phase: "ready", blocksSeed: Math.random() };
              // this.ball.action({act: 'restart'});
              break;
            case 'ready':
              this.phase = res.payload.phase;
              
              // this.event.broadcast('status', {phase: 'playing'});
              break;
            case 'end':
              this.end();
              // this.ball.action({act:'ready'});
              break;

            default:
              this.phase = res.payload.phase;
              break;
          }
          break;

      }
    });
  }
  

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.create();
    document.addEventListener("keydown", this.handleKeyDown.bind(this), false);
  }

  // controller part start
  private handleKeyDown(e: any) {
    this.event.broadcast('keyboard', {ev: e});
    switch(e.code) {
      case 'KeyR':
        this.restart(); break;
      case 'KeyM': // Toggle sound
        this.toggleAudio(); break;
      case 'KeyP': // Toggle performance
        this.showPerformance(); break;
      // case 'ArrowUp': case 'KeyW': // forward
      //   this.ball.action({act: 'dir', dir: 'forward'})
      //   break;
      // case 'ArrowDown': case 'KeyS':
      //   this.ball.action({act: 'dir', dir: 'backward'})
      //   break;
      // case 'ArrowLeft': case 'KeyA':
      //   this.ball.action({act: 'dir', dir: 'leftward'})
      //   break;
      // case 'ArrowRight': case 'KeyD':
      //   this.ball.action({act: 'dir', dir: 'rightward'})
      //   break;
      // case 'Space': this.ball.action({act: 'jump'}); break;
    }
  }

  private toggleAudio() {

  }

  private start() {
    if (this.phase === "ready") {
      this.event.broadcast('status', { phase: "playing", startTime: Date.now() });
      // return { phase: "playing", startTime: Date.now() };
    } 
    return {};
  }

  private restart() {
    if (this.phase === "playing" || this.phase === "ended") {
      this.event.broadcast('status', { phase: "ready", blocksSeed: Math.random() });
    }
    // return {};
  }

  private end() {
    if (this.phase === "playing") {
      const endTime = Date.now();
      const score = endTime - this.startTime;
      const level = this.mode === 'random' ? 'random' : this.level;

      // if (this.mode === "random") {
      //   this.statics.random.highscore = score < this.statics.random.highscore
      //       ? score
      //       : this.statics.random.highscore;

      //   // setLocalStorage("highScoreRandom", highScoreRandom);
      //   this.event.broadcast('status', {phase: 'ended', endTime, this.statics.random.highscore });
      // } else if (this.mode === "tour") {
      //   if (this.level === "copacabana") {
      //     this.statics.copacabana.highscore = score < this.statics.copacabana.highscore
      //       ? score
      //       : this.statics.copacabana.highscore;

      //     // setLocalStorage("highScoreCopacabana", highScoreCopacabana);
      //     this.event.broadcast('status', {phase: 'ended', endTime, highScoreCopacabana });
      //   } else if (this.level === "santamonica") {
      //     const highScoreSantaMonica =
      //     this.highScoreSantaMonica === 0 ||
      //       score < this.highScoreSantaMonica
      //         ? score
      //         : this.highScoreSantaMonica;

      //     // setLocalStorage("highScoreSantaMonica", highScoreSantaMonica);
      //     // return { phase: "ended", endTime, highScoreSantaMonica };
      //     this.event.broadcast('status', {phase: 'ended', endTime, highScoreSantaMonica});
      //   }
      // }
      this.statics[level].highscore = score < this.statics[level].highscore
        ? score
        : this.statics[level].highscore;

      this.event.broadcast('status', {phase: 'ended', endTime, level, statics: this.statics.random.highscore });
      this.store();
    }
    
  }


  private store() {
    this.storage.set('beachyball.statics', this.statics);
  }

  // controller part end

  private async create() {
    
    this.world.clear()
      .setContainer(<HTMLElement>document.getElementById('game'))
      .setScreen()
      .setCamera({fov:25, near: 0.1, far: 200, position: [0, 0, 200]})
      .setRenderer({antialias: true, alpha: true}, {
        pixelRatio: window.devicePixelRatio
      })
      .setLights([{
          type: 'ambient',
          // color: 0xffffff,
          intensity: 0.7
        }, 
        {
          type: 'directional',
          // color: 0xffffff,
          intensity: 0.19,
          position: [-1.5, -5, -3],
          helper: true
        }, {
          type: 'directional',
          // color: 0xffffff,
          intensity: 3,
          position: [1.5, 5, 3],
          helper: true
        }
      ])
      
      .enableRapier(async (rapier: Rapier) => {
        this.rapier = rapier;
        setTimeout(() => {
          rapier.init([0.0, -9.81,  0.0]);
          rapier.enableRapierDebugRenderer();
        }, 1000);
        
        // 
      })
      .enableControls({damping: true, target:{x: 0, y: 1, z: 0}})
      .setGridHelper({position: {x: 0, y: -75, z: 0}})
      .update(); // requestAnimationFrame(this.update)

      this.evListener.activeWindowResize();
      this.evListener.addWindowResize(this.world.onResize.bind(this.world));

      this.evListener.activeClickEvent(this.world.renderer);
      this.evListener.activePointerlockchange(this.world.renderer);

    setTimeout(async () => {
      this.ball = new Ball(this.world, this.rapier, this.event, this.sounds, this.evListener);
      this.levels = new Levels(this.world, this.rapier, this.event);
       
      const blocks = await this.levels.RandomLevel();
      blocks.forEach((block: any) => {
        // if( block instanceof Mesh) {
        if( block && block.isObject3D ) {
          this.world.scene.add(block);
        }
      });

      // this.ball.reset();
     
    }, 1000);


    
  }

  // Show performance
  private showPerformance(){
    this.performance =true
  }
}


