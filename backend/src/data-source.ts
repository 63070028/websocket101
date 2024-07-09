import { DataSource } from "typeorm";
import dotnev from "dotenv";
import createSubscriber from 'pg-listen';
import { Item } from "./model/Item";

dotnev.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Item],
    subscribers: [],
    migrations: [],
})

export const initSubscriber =  createSubscriber({ connectionString: `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`});