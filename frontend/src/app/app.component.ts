import {Component, OnDestroy, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AddItemPayload, Item} from './item-list/model/item';
import {NgForOf, NgIf} from "@angular/common";
import {ItemListComponent} from "./item-list/item-list.component";
import {ItemService} from "./item-list/service/item.service";
import {Subscription} from "rxjs";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf, ItemListComponent, NgIf, ReactiveFormsModule, HttpClientModule],
  providers:[ItemService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy{

  public items: Item[] = [];
  private subscription:Subscription;
  public isOpen = false;
  public itemForm = new FormGroup({
    name: new FormControl(),
    price: new FormControl(),
    qty: new FormControl()
  });
  constructor(private itemService: ItemService){
    this.subscription = this.itemService.getAll().subscribe(items => this.items = items);
  }

  onSubmit(){
    const data = this.itemForm.getRawValue();
    console.log(data)
    this.itemService.addItem(new AddItemPayload(data.name, data.price, data.qty));
  }

  remove(id:number){
    this.itemService.removeItem(id);
  }


  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
