import express from "express";
import next from "next";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config({ path: "variables.env" });

import apiRoutes from "./routes";

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

  server.use(cookieParser(process.env.COOKIE_SECRET));

  server.use(
    morgan("tiny", {
      skip: req => req.url.includes("_next")
    })
  );

  apiRoutes(server);

  // server.post("/api/users", (req, res) => {
  //   console.log(req.body);
  //   res.send(req.body);
  // });

  // Custom Routes
  server.get("/edit-profile/:userId", (req, res) => {
    // const mergedQuery = Object.assign({}, req.query, req.params);
    return app.render(req, res, "/edit-profile", req.params.userId);
  });

  // Default Route
  server.get("*", (req, res) => handle(req, res));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`Server listening on ${ROOT_URL}`);
  });
});
