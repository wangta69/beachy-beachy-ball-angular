import { Component,OnInit,AfterViewInit,ViewChild,ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import * as THREE from 'three';
import {World} from './World';
import {Ball} from './Ball';
// import {BlockEmpty} from './level/components/Blocks';
import {Levels} from './level/Level';
import { getLocalStorage, setLocalStorage } from './stores/utils';

@Component({
  selector: 'app-root',
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, MatIconModule],
  templateUrl: './game.html',
  styleUrls: ['./game.scss']
})
export class GameComponent implements OnInit, AfterViewInit{

  private world!:World;
  private ball!:Ball;


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
  private blocksSeed = 0;
  // Phases
  private phase = 'ready';

  constructor() {
    this.mode = getLocalStorage("mode") || "random"; // "random", "tour", "adventure"
    this.difficulty = parseInt(getLocalStorage("difficulty")) || 1; // 1, 1.25, 1.5, 2
    this.blocksCount = parseInt(getLocalStorage("blocksCount")) || 10;
    this.level = getLocalStorage("level") || "copacabana";
     // High scores
    this.highScoreRandom = getLocalStorage("highScoreRandom") || 0;
    this.highScoreCopacabana = getLocalStorage("highScoreCopacabana") || 0;
    this.highScoreSantaMonica = getLocalStorage("highScoreSantaMonica") || 0;  


  }
  

  ngOnInit() {

  }


  ngAfterViewInit() {


    this.create();

    // document.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
    document.addEventListener("keydown", this.handleKeyDown.bind(this), false);
  }

  // controller part start
  private handleKeyDown(e: any) {
    console.log('handleKeyDown:e:',  e);

    switch(e.code) {
      case 'KeyR':
        this.restart(); break;
      case 'KeyM': // Toggle sound
        this.toggleAudio(); break;
      case 'KeyP': // Toggle performance
        this.showPerformance(); break;
      case 'ArrowUp': case 'KeyW': // forward
        break;
      case 'ArrowDown': case 'KeyS':
        break;
      case 'ArrowLeft': case 'KeyA':
        break;
      case 'ArrowRight': case 'KeyD':
        break;
      case 'Space': this.ball.jump(); break;

    }
    //   { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    // { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    // { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
    // { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
    // { name: 'jump', keys: ['Space'] },
    // }
    
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
        return { phase: "ended", endTime, highScoreRandom };
      } else if (this.mode === "tour") {
        if (this.level === "copacabana") {
          const highScoreCopacabana =
            this.highScoreCopacabana === 0 ||
            score < this.highScoreCopacabana
              ? score
              : this.highScoreCopacabana;

          setLocalStorage("highScoreCopacabana", highScoreCopacabana);
          return { phase: "ended", endTime, highScoreCopacabana };
        } else if (this.level === "santamonica") {
          const highScoreSantaMonica =
          this.highScoreSantaMonica === 0 ||
            score < this.highScoreSantaMonica
              ? score
              : this.highScoreSantaMonica;

          setLocalStorage("highScoreSantaMonica", highScoreSantaMonica);
          return { phase: "ended", endTime, highScoreSantaMonica };
        }
      }
    }

    return {};
  }

  // controller part end

  private create() {
    
    this.world = new World( this );
    setTimeout(() => {
      this.ball = new Ball(this);
      this.levels = new Levels(this);
      const blocks = this.levels.RandomLevel();

      console.log ('blocks:', blocks);
      blocks.forEach((block: any) => {
        // console.log(block);
        // if( block instanceof Mesh) {
          if( block ) {
            console.log(block);
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


