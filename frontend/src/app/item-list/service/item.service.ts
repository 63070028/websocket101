import { Injectable } from '@angular/core';
import {AddItemPayload, EditItemPayload, Item} from "../model/item";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private socket: WebSocket;
  private itemsSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([
    // {id:1, name:"Item1", price:100, qty:1},
    // {id:2, name:"Item2", price:102, qty:1},
    // {id:3, name:"Item3", price:103, qty:1},
    // {id:4, name:"Item4", price:104, qty:1},
  ]);
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

  public editItem(payload:EditItemPayload){
    this.http.put("http://localhost:8000", payload).subscribe(res => console.log(res));
  }
}
