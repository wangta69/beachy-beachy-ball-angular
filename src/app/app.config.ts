import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {Event} from './game/services/event.service';
import {Storage} from './game/services/storage.service';
import {Sounds} from './game/services/sound.service';
import {Controller} from './game/services/controller.service';
import {Rapier} from './game/rapier/Rapier';
import {World} from './game/threejs/World';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    Event,
    Storage,
    Sounds,
    Controller,
    Rapier,
    World
  ]
};
