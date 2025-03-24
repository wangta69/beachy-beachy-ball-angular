import { EventEmitter, Output, Component,OnInit,AfterViewInit,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {Settings} from './types';
import {Storage} from '../services/storage.service';

@Component({
  standalone: true,
  selector: 'app-main',
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, MatIconModule],
  templateUrl: './mainmenu.html',
  styleUrls: ['../game.scss']
})
export class MainMenu implements OnInit, AfterViewInit{
  @Output() started: EventEmitter<Settings> = new EventEmitter<Settings>()

  public settings: Settings = {
    isInGame: false,
    isSettings: false,
    mode: 'random',
    difficulty: 1,
    blocksCount: 10,
    level: 'copacabana',
    audio: true,
  }

  private storage: Storage;

  constructor(storage: Storage) { 
    this.storage = storage;
    const settings = storage.get('beachyball.settings');
    settings ? this.settings = settings : null; 
  }
  
  ngOnInit() {}

  ngAfterViewInit() {}

  // Is the player in the game or in the main menu?
  public setIsInGame (bool:boolean) {
    this.settings.isInGame = bool;
    this.store();
    this.started.emit(this.settings);
  }

  public setIsSettings (bool:boolean) {
    this.settings.isSettings = bool;
    this.store();
  }

   
  public setMode(mode: string){
    this.settings.mode = mode;
    this.store();
  }

  // Difficulty 
  public setDifficulty(dif: number) {
    this.settings.difficulty = dif;
    this.store();
  }

  // Random level generation 
  public setBlocksCount(count: number){
    this.settings.blocksCount = count;
    this.store();
  };

   // Level (tour) 
  public setLevel(name: string) {
    this.settings.level = name;
    this.store();
  }

  private store() {
    this.storage.set('beachyball.settings', this.settings);
  }
}


