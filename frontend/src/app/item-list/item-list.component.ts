import {Component, Input} from '@angular/core';
import {Item} from "./model/item";

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent {
  @Input() item!:Item
}
