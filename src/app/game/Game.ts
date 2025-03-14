import { Component,OnInit,AfterViewInit,ViewChild,ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subject, filter, map } from 'rxjs';
import * as THREE from 'three';
import {World} from './World';
import {Rapier} from './rapier/Rapier';
import {RigidBody} from './rapier/RigidBody';
import {Ball} from './objects/Ball';
// import {BlockEmpty} from './level/components/Blocks';
import {Levels} from './level/Level';
import { getLocalStorage, setLocalStorage } from './stores/utils';
import {Event, Message} from './services/event.service';
// import { Observable, filter, map } from 'rxjs';
@Component({
  standalone: true,
  selector: 'app-game',
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, MatIconModule],
  templateUrl: './game.html',
  styleUrls: ['./game.scss']
})
export class Game implements OnInit, AfterViewInit{

  public world!:World;
  public ball!:Ball;
  private rigidBody!: RigidBody;
  // private rapier!: Rapier; // = new Rapier(0.0, -9.81, 0.0);
  public rapier:Rapier = new Rapier();
  private isInGame = false;
  public isSettings = false;
  private performance = false;
  public mode = 'random';
  public difficulty = 1;
  public blocksCount = 10;

  private levels!:Levels;
  public level = 'copacabana';


  private highScoreRandom = 0;
  private highScoreCopacabana = 0;
  private highScoreSantaMonica = 0;

  // Time
  private startTime = 0;
  private endTime = 0;
  // private blocksSeed = 0;
  // Phases
  // private phase = 'ready';
  private phase = 'playing'; // playing | ready
  private state:any;
  public event: Event;

  constructor(event: Event) { // 
    this.mode = getLocalStorage("mode") || "random"; // "random", "tour", "adventure"
    this.difficulty = parseInt(getLocalStorage("difficulty")) || 1; // 1, 1.25, 1.5, 2
    this.blocksCount = parseInt(getLocalStorage("blocksCount")) || 10;
    this.level = getLocalStorage("level") || "copacabana";
     // High scores
    this.highScoreRandom = getLocalStorage("highScoreRandom") || 0;
    this.highScoreCopacabana = getLocalStorage("highScoreCopacabana") || 0;
    this.highScoreSantaMonica = getLocalStorage("highScoreSantaMonica") || 0;  
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
                this.event.broadcast('status', {phase: 'ready'});
              }
              //  return { phase: "ready", blocksSeed: Math.random() };
              // this.ball.action({act: 'restart'});
              break;
            case 'ready':
              this.ball.action({act:'ready'});
              break;
            case 'end':
              this.end();
              // this.ball.action({act:'ready'});
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
      return { phase: "playing", startTime: Date.now() };
    } 
    return {};
  }

  private restart() {
    if (this.phase === "playing" || this.phase === "ended") {
      return { phase: "ready", blocksSeed: Math.random() };
    }
    return {};
  }

  private end() {
    if (this.phase === "playing") {
      const endTime = Date.now();
      const score = endTime - this.startTime;

      if (this.mode === "random") {
        const highScoreRandom =
        this.highScoreRandom === 0 || score < this.highScoreRandom
            ? score
            : this.highScoreRandom;

        setLocalStorage("highScoreRandom", highScoreRandom);
        this.event.broadcast('status', {phase: 'ended', endTime, highScoreRandom });
      } else if (this.mode === "tour") {
        if (this.level === "copacabana") {
          const highScoreCopacabana =
            this.highScoreCopacabana === 0 ||
            score < this.highScoreCopacabana
              ? score
              : this.highScoreCopacabana;

          setLocalStorage("highScoreCopacabana", highScoreCopacabana);
          this.event.broadcast('status', {phase: 'ended', endTime, highScoreCopacabana });
        } else if (this.level === "santamonica") {
          const highScoreSantaMonica =
          this.highScoreSantaMonica === 0 ||
            score < this.highScoreSantaMonica
              ? score
              : this.highScoreSantaMonica;

          setLocalStorage("highScoreSantaMonica", highScoreSantaMonica);
          // return { phase: "ended", endTime, highScoreSantaMonica };
          this.event.broadcast('status', {phase: 'ended', endTime, highScoreSantaMonica});
        }
      }
    }

  }




  // controller part end

  private async create() {
    await this.rapier.initRapier(0.0, -9.81, 0.0);
    this.world = new World( this );
    // this.world = new World<GameComponent>( GameComponent );
    // this.world = new World( GameComponent );
    this.rigidBody = new RigidBody(this.rapier);
    setTimeout(async () => {
      this.ball = new Ball(this);

      this.levels = new Levels(this);
       
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




  // Is the player in the game or in the main menu?
  public setIsInGame (inOrOut:boolean) {
    this.isInGame = inOrOut
  }

  public setIsSettings (inOrOut:boolean) {
    this.isSettings = inOrOut;
  }

  public setLocalStorage(k: string, v: string|number) {
    setLocalStorage(k, v);
  }


  // Show performance
  private showPerformance(){
    this.performance =true
  }


   // pixelated: false,


    // Mode

   
  public setMode(gameMode: string){
    setLocalStorage("mode", gameMode);
    this.mode = gameMode;
  }

  // Difficulty 
  public setDifficulty(dif: number) {
    setLocalStorage("difficulty", dif);
    this.difficulty = dif;
  }

  // Random level generation 
  public setBlocksCount(count: number){
    setLocalStorage("blocksCount", count);
    this.blocksCount = count;
  };

   // Level (tour) 
  public setLevel(name: string) {
    setLocalStorage("level", name);
    this.level = name;
  }


  

  
}


