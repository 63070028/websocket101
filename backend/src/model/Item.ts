import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("items")
export class Item{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    qty: number;


    constructor(name:string, qty:number, price:number){
        this.name = name;
        this.price = price;
        this.qty = qty;
    }
}