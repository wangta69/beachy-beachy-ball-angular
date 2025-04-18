import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import {MainMenu} from './interface/MainMenu';
import {Game} from './Game';
import {Sounds} from './services/sound.service';
@Component({
  selector: 'app-root',
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, MatIconModule, MainMenu, Game],
  templateUrl: './main.html',
  styleUrls: ['./game.scss']
})
export class Main{

  public isPlaying = false;

  constructor(soundSvc: Sounds) {
    soundSvc.load();
  }
  
  public gameStar(ev: any) {
    this.isPlaying = true;
  }

}


