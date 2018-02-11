require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://" +
    process.env.DB_USER +
    ":" +
    process.env.DB_PWD +
    "@" +
    process.env.DB_HOST +
    "/quotes"
);

const Quote = require("./models/quote");

const app = express();

const port = process.env.PORT || 3000;

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "it's alive" });
});

router.get("/quote", (req, res) => {
  Quote.aggregate(
    [
      {
        $sample: { size: 1 }
      },
      {
        $project: { _id: 0 }
      }
    ],
    (err, quote) => {
      if (err) {
        console.log(err);
        return;
      }
      res.json(quote);
    }
  );
});

app.use("/api", router);

app.listen(port);
console.log("Magic happening on port " + port);
