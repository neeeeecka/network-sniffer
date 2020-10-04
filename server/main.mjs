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

import arrayBufferToBuffer from 'arraybuffer-to-buffer';
import dump from "buffer-hexdump";

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

const port = 5000;

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

const trafficReader = new TrafficReader("wlp2s0", io);

// io.eio.pingTimeout = 1000;
// io.eio.pingInterval = 1000;

io.on('connection', (socket) => {
  console.log('connected', socket.id, socket.handshake.address);
  socket.on("disconnectMe", () => {
    socket.disconnect();
    console.log("disconnected ", socket.id);
  });
  socket.on("filter", filter => {
    console.log(filter);
  });
  socket.on("decodeBuffer", (raw_buffer) => {
    const buffer = arrayBufferToBuffer(raw_buffer);
    // const strUtf8 = buffer.toString('utf8');
    const dumped = dump(buffer);
    io.emit("decodeBuffer", dumped);
  });

});


export default app;
