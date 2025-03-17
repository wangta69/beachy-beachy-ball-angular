import {Injectable} from '@angular/core';
import { Howl } from 'howler';

@Injectable()
export class Sounds {
  public assetsUrl: any = {path: ''};
  private bgSoundId: any;
  protected sounds: any = {};

  private soundsInfo = [
    {name: 'hit', src:'/sounds/hit.mp3'},
    {name: 'success', src:'/sounds/success.mp3'},
    {name: 'background', loop: true, paly: true, src:'/sounds/background.mp3'},
  ]
  constructor(
  ) {
  }

  public load() {
    this.soundsInfo.forEach((sound: any) => {
      const loop = sound.loop || false;
      const volume = sound.volume || 0.2;
      this.sounds[sound.name] = new Howl({
        src: [sound.src],
        preload: true,
        // html5: true,
        loop,
        volume,
        onloaderror: (id, err) => {
          console.warn('load ' + sound.name + ' error', { id, err });
        },
      });

      if(sound.paly) {
        this.sounds[sound.name].once('load', () => {
          this.play(sound.name);
        });
      }
    })
  }

  public play(name: string) {
    const id = this.sounds[name].play();
    this.sounds[name].id = id;
  }

  public stop(name: string) {
    this.sounds[name].stop();
    // this.sounds[name].stop(this.sounds[name].id);
  }

  public bgm(flag: string) {
    switch(flag) {
      // case 'stop': this.sounds.bgm.stop(this.bgSoundId); break;
      // case 'play': this.playGameSound('bgm'); break;
    }
  }

  /**
   * @param String sound : play, wailt, alert
   */
  public playGameSound(sound: string) {
    // switch(sound) {
    //   case 'bgm':
    //     if (this.configSvc.bgmsound) {
    //       this.sounds.bgm.stop(this.bgSoundId);
    //       this.bgSoundId = this.sounds[sound].play();
    //     }
    //     break;
    //   default:
    //     if (this.configSvc.effectsound) {
    //       this.sounds[sound].play();
    //     }
    //   break;
    // }
  }
}