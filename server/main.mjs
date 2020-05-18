import express from "express";
import mongodb from "mongodb";
import DBActions from "./dbActions.mjs";
import bodyParser from "body-parser";

const MongoClient = mongodb.MongoClient;
// Connection URL
const url = "mongodb://localhost:27017";
const dbName = "spoofer";
const dbActions = new DBActions(null);

MongoClient.connect(url, function(err, client) {
  console.log("Connected successfully to server");
  dbActions.db = client.db(dbName);
});

const app = express();
const port = 2999;

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", async (req, res) => {
  return res.send("Server is running");
});

app.get("/units", async (req, res) => {
  const units = await dbActions.getUnits();
  const str = JSON.stringify(units);
  return res.send(str);
});

app.post("/units", async (req, res) => {
  // await dbActions.add
  console.log(req.body);
  return res.send("Received a POST HTTP method");
});

//put = add new user, patch = modify user
app.put("/units/:unitId", async (req, res) => {
  const userId = req.params.userId;

  return res.send("Received a PUT HTTP method");
});

app.delete("/units/:unitId", async (req, res) => {
  const userId = req.params.userId;

  return res.send("Received a DELETE HTTP method");
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));

export default app;
