import {Component, OnDestroy, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AddItemPayload, EditItemPayload, Item} from './item-list/model/item';
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
  public isAddItem = false;
  public isEditItem = false;


  public itemForm = new FormGroup({
    name: new FormControl<string>(""),
    price: new FormControl<number>(0),
    qty: new FormControl<number>(0)
  });

  public itemEditForm = new FormGroup({
    id: new FormControl(),
    name: new FormControl<string>(""),
    price: new FormControl<number>(0),
    qty: new FormControl<number>(0)
  });

  public isFind = false;
  public errorIdNotFound = false;

  constructor(private itemService: ItemService){
    this.subscription = this.itemService.getAll().subscribe(items => {
      this.items = items;
    });
  }

  onSubmit(){
    const data = this.itemForm.getRawValue();
    if(data.name && data.price && data.qty){
      this.itemService.addItem(new AddItemPayload(data.name, data.price, data.qty));
    }
  }

  findItem(id:number){
    console.log(this.items);
      const item = this.items.find(item => item.id == id);
      if(item){
        this.errorIdNotFound = false;

        this.isFind = true;
        this.itemEditForm.patchValue({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty
        })
      }else{
        this.errorIdNotFound = true;
      }
  }

  resetItemEditForm(){
    this.itemEditForm.reset();
    this.isFind = false;
    this.errorIdNotFound = false;
  }

  closeEditForm(){
    this.resetItemEditForm();
    this.isEditItem = false;
  }

  remove(id:number){
    this.itemService.removeItem(id);
  }

  onEditSubmit(){
    const data = this.itemEditForm.getRawValue();
    if(data.id && data.name && data.price && data.qty){
      this.itemService.editItem(new EditItemPayload(data.id, data.name, data.price, data.price));
    }
  }


  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
