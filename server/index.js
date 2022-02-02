import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import TrafficReader from "./trafficReader.js";

// import readline from "readline";
import { networkInterfaces } from "os";
import socketio from "socket.io";
import * as http from "http";

import arrayBufferToBuffer from "arraybuffer-to-buffer";
import dump from "buffer-hexdump";

const port = 5000;

const app = express();
const httpApp = http.createServer(app);
const io = socketio(httpApp);

/*
curl -X GET http://localhost:2999/units
curl -H "Content-Type: application/json" -X POST -d '{"test":"yes"}' http://localhost:2999/units
curl -H "Content-Type: application/json" -X POST -d '{"mac":"some-mac-mac"}' http://localhost:2999/units
*/

app.get("/", async (req, res) => {
  return res.send("Server is running");
});

httpApp.listen(port, () => {
  console.log(`listening on *${port}`);
});

const interfaces = networkInterfaces();
// console.log(interfaces);

const trafficReader = new TrafficReader("wlo1", io);

// io.eio.pingTimeout = 1000;
// io.eio.pingInterval = 1000;

io.on("connection", (socket) => {
  console.log("connected", socket.id, socket.handshake.address);
  socket.on("disconnectMe", () => {
    socket.disconnect();
    console.log("disconnected ", socket.id);
  });
  socket.on("filter", (filter) => {
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
