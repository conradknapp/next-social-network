import express from "express";
import next from "next";
import bodyParser from "body-parser";
import mongoose from "mongoose";
require("dotenv").config({ path: "variables.env" });

mongoose
  .connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const ROOT_URL = dev ? `http://localhost:${port}` : "<production-url>";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  server.post("/api/users", (req, res) => {
    console.log(req.body);
    res.send(req.body);
  });

  server.get("*", (req, res) => handle(req, res));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`Server listening on ${ROOT_URL}`);
  });
});
