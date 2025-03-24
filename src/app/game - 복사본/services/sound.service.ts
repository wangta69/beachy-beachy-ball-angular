import {Injectable} from '@angular/core';
import { Howl, HowlOptions } from 'howler';

@Injectable()
export class Sounds {
  public assetsUrl: any = {path: ''};
  private bgSoundId: any;
  protected sounds: any = {};

  private soundsInfo = [
    {name: 'hit', src:'/sounds/hit.mp3'},
    {name: 'success', src:'/sounds/success.mp3'},
    {name: 'background', loop: true, autoplay: true, src:'/sounds/background.mp3'},
  ]
  constructor(
  ) {
  }

  public load() {
    
    this.soundsInfo.forEach((sound: any) => {
      

      const option: HowlOptions = {
        src: [sound.src],
        preload: true,
        onloaderror: (id, err) => {
          console.warn('load ' + sound.name + ' error', { id, err });
        },
      }
      option.autoplay = sound.autoplay || false;
      option.loop = sound.loop || false;
      option.html5 = sound.html5 || false;
      option.volume = sound.volume || 0.2;
      
      this.sounds[sound.name] = new Howl(option);

      if(sound.play) {
        this.sounds[sound.name].once('load', () => {
          // console.log('this.play('+sound.name+')');
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