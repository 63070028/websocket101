import { Repository } from "typeorm";
import { Item } from "../model/Item";

export class ItemService {
    private repository: Repository<Item>
    
    constructor(repository: Repository<Item>){
        this.repository = repository;
    }

    public findAll():Promise<Item[]>{
       return this.repository.find();
    }
}