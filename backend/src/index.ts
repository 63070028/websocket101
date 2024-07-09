import dotnev from "dotenv";
import WebSocket from 'ws';
import { AddItemRequest, Item} from "./model/Item";
import { AppDataSource, initSubscriber } from "./data-source";
import { ItemService } from "./service/ItemService";
import express, { Request, Response } from "express";
import cors from "cors"

dotnev.config();

const app = express();
const port = process.env.HTTP_PORT;
const itemService = new ItemService(AppDataSource.getRepository(Item));

app.use(cors());
app.use(express.json());


app.post("/", async (req:Request<AddItemRequest>, res:Response<Item>) => {
   await itemService.add(req.body)
   .then(item => res.send(item))
   .catch(error => {
      console.log(error);
      res.status(500).send(error);
   })
});

app.delete("/:id", async (req:Request, res:Response<Item>) => {
  const id = Number(req.params.id);
  console.log(id)
  await itemService.remove(id)
  .then(item => res.send(item))
  .catch(error => {
     console.log(error);
     res.status(404).send(error);
  })
});




app.listen(port, async ()=>{

  AppDataSource.initialize()
  .then(() => {
      console.log('[orm]: orm task initialize');
  })
  .catch((error) => {
      console.error('Error during Data Source initialization:', error.message);
      console.error(error.stack);
  });

  const wss = new WebSocket.Server({ port: Number(process.env.WS_PORT)});
  console.log("backend websocket start ....")

  const subscriber = initSubscriber;

  subscriber.connect()
    .then(() => subscriber.listenTo('data_change'))
    .catch((err) => console.error('Error connecting to subscriber:', err));


  wss.on("connection", async (ws:WebSocket)=>{

      console.log('Client is connected');

      try {
        const items =  await itemService.findAll();
        ws.send(JSON.stringify(items));
      } catch (error) {
        console.log(error);
      }
      
        ws.on('close', () => {
          console.log('Client disconnected');
        });
  });

  subscriber.notifications.on('data_change', (payload) => {
    console.log('Data changed:', payload);
    // Broadcast to all connected clients
    wss.clients.forEach(async (client) => {
        try {
          const items =  await itemService.findAll();
          client.send(JSON.stringify(items));
        } catch (error) {
          console.log(error);
        }
    });
  });

  subscriber.events.on('error', (error) => {
    console.error('Database error:', error);
  });

  console.log(`[server]: task-service is running at http://localhost:${port}`)
})