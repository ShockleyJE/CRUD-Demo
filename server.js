const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const PORT = 3000;

/*
Initilizations 
- Body Parser
*/
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  //   console.log(req);
  res.sendfile(__dirname + "/index.html");
});

app.post("/quotes", (req, res) => {
  console.log(req.body);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));

MongoClient.connect(
  MONGO_STRING,
  {
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.error(err);
    console.log("Connected to Database");
  }
);
