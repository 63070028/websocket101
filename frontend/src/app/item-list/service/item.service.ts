import { Injectable } from '@angular/core';
import {AddItemPayload, Item} from "../model/item";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private socket: WebSocket;
  private itemsSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  constructor(private http: HttpClient) {
    this.socket = new WebSocket("ws://localhost:8001");

    this.socket.addEventListener("open", () => {
      console.log('WebSocket connection opened');
    });

    this.socket.addEventListener("message", (e:MessageEvent<String>)=>{
      this.itemsSubject.next(JSON.parse(e.data.valueOf()));
    })
  }

  public getAll():Observable<Item[]>{
    return this.itemsSubject.asObservable();
  }

  public addItem(payload:AddItemPayload){
    this.http.post("http://localhost:8000", payload).subscribe(res => console.log(res));
  }

  public removeItem(payload:number){
    this.http.delete(`http://localhost:8000/${payload}`).subscribe(res => console.log(res));
  }
}
