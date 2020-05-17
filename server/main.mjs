import express from "express";

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
