import {Component, OnDestroy, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Item } from './item-list/model/item';
import {NgForOf} from "@angular/common";
import {ItemListComponent} from "./item-list/item-list.component";
import {ItemService} from "./item-list/service/item.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf, ItemListComponent],
  providers:[ItemService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy{

  public items: Item[] = [];
  private subscription:Subscription;
  constructor(private itemService: ItemService){
    this.subscription = this.itemService.getAll().subscribe(items => this.items = items);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
