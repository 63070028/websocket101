import dotnev from "dotenv";
import WebSocket from 'ws';
import { Item } from "./model/Item";
import { AppDataSource, initSubscriber } from "./data-source";
import { ItemService } from "./service/ItemService";

dotnev.config();

const wss = new WebSocket.Server({ port: Number(process.env.PORT)});
console.log("backend websocket start ....")


AppDataSource.initialize()
  .then(() => {
      console.log('[orm]: orm task initialize');
  })
  .catch((error) => {
      console.error('Error during Data Source initialization:', error.message);
      console.error(error.stack);
  });

const subscriber = initSubscriber;

subscriber.connect()
  .then(() => subscriber.listenTo('data_change'))
  .catch((err) => console.error('Error connecting to subscriber:', err));

const itemService = new ItemService(AppDataSource.getRepository(Item));

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
