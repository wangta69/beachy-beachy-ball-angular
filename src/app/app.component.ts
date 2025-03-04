import { Component, OnInit} from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{


  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) { 
  }

  ngOnInit() {
    (window as any).gameVersion = '0.0.1';
    this.iconRegistry
      .addSvgIcon('logo_ball_stroke', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/logo_ball_stroke.svg'))
      .addSvgIcon('logo_white', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/logo_white.svg'))
      .addSvgIcon('mm_white', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/mm_white.svg'))
      .addSvgIcon('wordmark', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/wordmark.svg'))
  }
  
}