const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const PORT = 3000;
const MONGO_STRING =
  "mongodb+srv://crudsuperuser:IndustryStandardPassword1.@crud-app.qiu6w.mongodb.net/?retryWrites=true&w=majority";

/*
Initilizations 
- Body Parser 
- EJS as view engine
- Express static middleware to expose the public folder (Where our JS lives)
*/

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

// Establish mongo connection & define routes

MongoClient.connect(MONGO_STRING, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");

    // **************
    //  MONGO CODE
    // **************
    // define our database & collections
    const db = client.db("star-wars-quotes");
    const quotesCollection = db.collection("quotes");

    // **************
    //   NODE CODE
    // **************

    app.get("/", (req, res) => {
      //   console.log(req);
      const cursor = db
        .collection("quotes")
        .find()
        .toArray()
        .then((results) => {
          console.log(results);
          res.render("index.ejs", { quotes: results });
        });
      console.log(cursor);
    });

    app.post("/quotes", (req, res) => {
      // view the request body
      //console.log(req.body);

      // insert the request body from the form into the database as a record
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          console.log(result);
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          res.json("Success");
        })
        .catch((error) => console.error(error));
    });

    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json(`Deleted ${req.body.name}'s quote`);
        })
        .catch((error) => console.error(error));
    });

    app.listen(PORT, () => console.log(`listening on ${PORT}`));
  })
  .catch((error) => console.error(error));
