import { Injectable } from '@angular/core';
import { Observable, Subject, filter, map } from 'rxjs';

export interface Message {
  type: string | null;
  payload: any;
}

@Injectable()
export class Event {
  private handler = new Subject<Message>();
  // private message: Message = {type: null, payload: null};

  constructor( ) {
    // this.handler.asObservable()
    // .subscribe((message) => { // payload: any
    //   this.message = message;
    // });
  }

  broadcast(type: string, payload: any) {
    this.handler.next({ type, payload });
  }

  subscribe() {
    return this.handler.asObservable();
  }

  // get(type: string) {
  //   return this.message.type === type ? this.message.payload : null;
  // }
}
