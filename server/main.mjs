import express from "express";
import mongodb from "mongodb";
import bodyParser from "body-parser";
import cors from "cors";

import DBActions from "./dbActions.mjs";
import TrafficReader from "./trafficReader.mjs";

// import readline from "readline";
import { networkInterfaces } from 'os';
import socketio from "socket.io";
import * as http from "http";

const MongoClient = mongodb.MongoClient;
// Connection URL
const url = "mongodb://localhost:27017";
const dbName = "spoofer";
const dbActions = new DBActions(null);

MongoClient.connect(url, { useUnifiedTopology: true },
  function (err, client) {
    // console.log("Connected successfully to server");
    dbActions.init(client.db(dbName));
  });

const port = 2999;

const app = express();
const httpApp = http.createServer(app);
const io = socketio(httpApp);

/*
curl -X GET http://localhost:2999/units
curl -H "Content-Type: application/json" -X POST -d '{"test":"yes"}' http://localhost:2999/units
curl -H "Content-Type: application/json" -X POST -d '{"mac":"some-mac-mac"}' http://localhost:2999/units
*/

app.use(
  bodyParser.json({
    // extended: true
  })
);
app.use(cors());

app.get("/", async (req, res) => {
  return res.send("Server is running");
});

app.get("/units", async (req, res) => {

});

app.post("/units", async (req, res) => {

});

//put = add new user, patch = modify user
app.put("/units/:unitId", async (req, res) => {

});

app.delete("/units/:unitId", async (req, res) => {

});

httpApp.listen(port, () => {
  console.log(`listening on *${port}`);
});

const interfaces = networkInterfaces();
// console.log(interfaces);

const sockets = [];

const trafficReader = new TrafficReader("wlp2s0", io);

io.on('connection', (socket) => {
  console.log('connected', socket.id);
  sockets.push(socket);
  socket.on("disconnectMe", () => {
    socket.disconnect();
    console.log("disconnected ", socket.id);
  });
  socket.on("filter", filter => {
    console.log(filter);
  });
  
});


export default app;
