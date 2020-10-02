import express from "express";
import mongodb from "mongodb";
import bodyParser from "body-parser";
import cors from "cors";

import DBActions from "./dbActions.mjs";
import TrafficReader from "./trafficReader.mjs";

import readline from "readline";
import { networkInterfaces } from 'os';

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

const app = express();
const port = 2999;

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

// app.listen(port, () => console.log(`Server listening on port ${port}!`));

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
// console.log("Choose your network interface: ");
// const interfaces = networkInterfaces();
// console.log(interfaces);
// rl.on('line', function (line) {

// });
//eth0 or lo
const trafficReader = new TrafficReader("eth0");

export default app;
