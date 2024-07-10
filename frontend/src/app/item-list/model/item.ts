export interface Item{
    id: number;
    name: string;
    price: number;
    qty: number;
}

export class AddItemPayload {
  name: string;
  price: number;
  qty: number;

  constructor(name:string, price:number, qty:number) {
    this.name = name;
    this.price = price;
    this.qty = qty;
  }
}

export class EditItemPayload{
  id: number;
  name: string;
  price: number;
  qty: number;

  constructor(id: number, name:string, price:number, qty:number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.qty = qty;
  }
}

