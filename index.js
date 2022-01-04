const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dvprb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("autofix");
    const garagesCollection = database.collection("garages");
    const concernsCollection = database.collection("concerns");

    app.get("/garages", async (req, res) => {
      const cursor = garagesCollection.find({});
      const garages = await cursor.toArray();
      res.send(garages);
    });

    app.post("/concerns", async (req, res) => {
      const concern = req.body;
      const result = await concernsCollection.insertOne(concern);
      console.log(concern);
      res.json(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello AutoFix");
});

app.listen(port, () => {
  console.log("Listening at port", port);
});
