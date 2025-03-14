import { Injectable } from '@angular/core';


@Injectable()
export class Storage {

  constructor(
  ) {

    console.log('Storage constructor');
  }

  public set<T>(key:string, value: T) {
    if(typeof value === 'string') {
      window.localStorage.setItem(key, value);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }

  public get(key:string) {
    const item = window.localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }
}