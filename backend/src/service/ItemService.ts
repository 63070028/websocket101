import { Repository } from "typeorm";
import { AddItemRequest, Item} from "../model/Item";

export class ItemService {
    private repository: Repository<Item>
    
    constructor(repository: Repository<Item>){
        this.repository = repository;
    }

    public findAll():Promise<Item[]>{
       return this.repository.find();
    }

    public findById(id:number):Promise<Item>{
        return this.repository.findOneByOrFail({id:id});
    }

    public add(payload:AddItemRequest):Promise<Item>{
        return this.repository.save(new Item(payload.name, payload.price, payload.qty));
    }

    public async remove(payload:number):Promise<Item>{
        const item = await this.findById(payload);
        return this.repository.remove(item);
    }
}