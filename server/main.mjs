import express from "express";
import mongodb from "mongodb";
const MongoClient = mongodb.MongoClient;
// Connection URL
const url = "mongodb://localhost:27017";
const dbName = "spoofer";

MongoClient.connect(url, function(err, client) {
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});

const app = express();
const port = 2999;

app.get("/", (req, res) => {
  return res.send("Server is up!");
});

app.get("/units", (req, res) => {
  return res.send("Received a GET HTTP method");
});

app.post("/units", (req, res) => {
  return res.send("Received a POST HTTP method");
});

//put = add new user, patch = modify user
app.put("/units/:unitId", (req, res) => {
  const userId = req.params.userId;

  return res.send("Received a PUT HTTP method");
});

app.delete("/units/:unitId", (req, res) => {
  const userId = req.params.userId;

  return res.send("Received a DELETE HTTP method");
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));

export default app;
