import { Component,OnInit,AfterViewInit,ViewChild,ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subject, filter, map } from 'rxjs';
import * as THREE from 'three';
// import {World} from '../threejs/World';
// import {Rapier} from '../rapier/Rapier';

import {Rapier, World} from 'ng-rapier-threejs'
// import {Body} from '../rapier/Body';
import {Ball} from './objects/Ball';
// import {BlockEmpty} from './level/components/Blocks';
import {Levels} from './level/Level';
// import { getLocalStorage, setLocalStorage } from './stores/utils';
import {Settings} from './interface/types';
import {Event, Message} from '../services/event.service';
import {Storage} from '../services/storage.service';
import {Sounds} from '../services/sound.service';
import {Interface} from './interface/Interface';
// import { Observable, filter, map } from 'rxjs';
@Component({
  standalone: true,
  selector: 'app-game',
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, MatIconModule, Interface],
  templateUrl: './game.html',
  styleUrls: ['../game.scss']
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
  public rapier:Rapier;
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
  private storage: Storage;

  constructor(event: Event, storage: Storage, world: World, rapier:Rapier, sounds: Sounds) { // 
    
    this.storage = storage;
    this.world = world;
    this.rapier = rapier;
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
      console.log('=============================this.phase:', this.phase, ' res.payload.phase:', res.payload.phase);
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

    // document.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
    document.addEventListener("keydown", this.handleKeyDown.bind(this), false);
    // document.addEventListener("keydown", this.event.broadcast.bind(null, 'keyboard'), false);
  }

  // controller part start
  private handleKeyDown(e: any) {
    this.event.broadcast('keyboard', {ev: e});
    // console.log(this.event.get('keyboard'));
    // const {code} = this.event.get('keyboard');
    // console.log('code is ' + code);
    switch(e.code) {
      case 'KeyR':
        this.restart(); break;
      case 'KeyM': // Toggle sound
        this.toggleAudio(); break;
      case 'KeyP': // Toggle performance
        this.showPerformance(); break;
      case 'ArrowUp': case 'KeyW': // forward
        this.ball.action({act: 'dir', dir: 'forward'})
        break;
      case 'ArrowDown': case 'KeyS':
        this.ball.action({act: 'dir', dir: 'backward'})
        break;
      case 'ArrowLeft': case 'KeyA':
        this.ball.action({act: 'dir', dir: 'leftward'})
        break;
      case 'ArrowRight': case 'KeyD':
        this.ball.action({act: 'dir', dir: 'rightward'})
        break;
      case 'Space': this.ball.action({act: 'jump'}); break;

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
      // return { phase: "ready", blocksSeed: Math.random() };
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
    await this.rapier.initRapier(0.0, -9.81, 0.0);
    this.world.create();

    setTimeout(async () => {
      this.ball = new Ball(this.world, this.rapier, this.event, this.sounds);
      this.levels = new Levels(this.world, this.rapier, this.event);
       
      const blocks = await this.levels.RandomLevel();

      blocks.forEach((block: any) => {
        // if( block instanceof Mesh) {
        if( block ) {
          this.world.scene.add(block);
        }
      });

      this.ball.reset();
     
    }, 1000);
    
  }






  // Show performance
  private showPerformance(){
    this.performance =true
  }


}


