import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import {MainComponent} from './Main';
import {Game} from './Game';

@Component({
  selector: 'app-root',
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, MatIconModule, MainComponent, Game],
  templateUrl: './welcome.html',
  styleUrls: ['./game.scss']
})
export class Welcome{

  public isPlaying = false;

  constructor() {}
  
  public gameStar(ev: any) {
    this.isPlaying = true;
  }

}


