import express from "express";
import mongodb from "mongodb";
import bodyParser from "body-parser";
import cors from "cors";

import DBActions from "./dbActions.mjs";

const MongoClient = mongodb.MongoClient;
// Connection URL
const url = "mongodb://localhost:27017";
const dbName = "spoofer";
const dbActions = new DBActions(null);

MongoClient.connect(url, function(err, client) {
  console.log("Connected successfully to server");
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
  const units = await dbActions.getUnits();
  const str = JSON.stringify(units);
  return res.send(str);
});

app.post("/units", async (req, res) => {
  const unitData = await dbActions.addUnit(req.body);
  return res.send(unitData);
});

//put = add new user, patch = modify user
app.put("/units/:unitId", async (req, res) => {
  // console.log(req.params.unitId);
  let _id = req.params.unitId;
  if (mongodb.ObjectID.isValid(_id)) {
    const unitId = mongodb.ObjectID(_id);
    const result = await dbActions.editUnit(unitId, req.body);
    return res.send({ res: result });
  } else {
    return res.send({ res: "invalid ID" });
  }
});

app.delete("/units/:unitId", async (req, res) => {
  const userId = req.params.userId;

  return res.send("Received a DELETE HTTP method");
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));

export default app;
