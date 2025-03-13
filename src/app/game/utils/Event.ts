import { Observable, Subject, filter, map } from 'rxjs';

export interface Message {
  type: string | null;
  payload: any;
}

export class Event {
  private handler = new Subject<Message>();
  private message: Message = {type: null, payload: null};
  // private subject = new Subject<any>();
  // private ev = new Subject<any>();

  /**
   * @param Object obj {key, value}
   * key : platform, value : pause: 플레폼 background, resume: 플렛폼 result
   * key : game, value : pause:게임중지, resume:게임재개, start:게임시작, created: 게임생성, finished: 게임완료;
   */
  constructor( ) {
    console.log('event consctuctor..........................');
    this.handler.asObservable()
    // .pipe(map(message => message.payload))
    .subscribe((message) => { // payload: any
      this.message = message;
    });
  }

  broadcast(type: string, payload: any) {
    // console.log('broadcast', ',type: ', type, ', payload:', payload);
    this.handler.next({ type, payload });
  }

  subscribe() {
    return this.handler.asObservable();
  }

  get(type: string) {
    return this.message.type === type ? this.message.payload : null;
  }
}
