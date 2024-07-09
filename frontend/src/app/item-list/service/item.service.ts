import { Injectable } from '@angular/core';
import {Item} from "../model/item";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private socket: WebSocket;
  private itemsSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  constructor() {
    this.socket = new WebSocket("ws://localhost:8000");

    this.socket.addEventListener("open", () => {
      console.log('WebSocket connection opened');
    });

    this.socket.addEventListener("message", (e:MessageEvent<String>)=>{
      const items: Item[] = JSON.parse(e.data.valueOf());
      this.itemsSubject.next(items);
    })
  }

  public getAll():Observable<Item[]>{
    return this.itemsSubject.asObservable();
  }
}
