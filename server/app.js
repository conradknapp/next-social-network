import express from "express";
import next from "next";
import session from "express-session";
import mongoose from "mongoose";
import logger from "morgan";
import dotenv from "dotenv";
import connect from "connect-mongo";
import expressValidator from "express-validator";
const MongoStore = connect(session);
const passport = require("passport");
dotenv.config({ path: "variables.env" });

// import models to use mongoose.model() Singleton
import "./models/Post";
import "./models/User";

import routes from "./routes";

// Import passport config
import "./passport";

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true
  }
);

mongoose.connection.on("error", err => {
  console.log(`DB connection error: ${err.message}`);
});

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const ROOT_URL = dev ? `http://localhost:${port}` : "<production-url>";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const sessionConfig = {
    name: "next-social.sid",
    // used to signed cookies into the session
    secret: process.env.COOKIE_SECRET,
    // forces the session to be saved back to the store
    resave: false,
    // don't save unmodified sessions
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  };

  if (!dev) {
    sessionConfig.cookie.secure = true; // serve secure cookies in production environment
    server.set("trust proxy", 1); // trust first proxy
  }

  /* Body Parser built-in to Express as of version 4.16 */
  server.use(express.json());
  server.use(expressValidator());
  server.use(session(sessionConfig));

  /* Passport Middleware */
  server.use(passport.initialize());
  server.use(passport.session());

  server.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
  });

  /* Morgan for Request Logging from Client, skip to ignore static files from _next folder */
  server.use(
    logger("dev", {
      skip: req => req.url.includes("_next")
    })
  );

  /* Apply our routes */
  server.use("/", routes);

  // Create custom routes with route params
  server.get("/profile/:userId", (req, res) => {
    const queryParams = Object.assign({}, req.params, req.query);
    return app.render(req, res, "/profile", queryParams);
  });

  server.get("/edit-profile/:userId", (req, res) => {
    const queryParams = Object.assign({}, req.params, req.query);
    return app.render(req, res, "/edit-profile", queryParams);
  });

  server.get("/user/:userId", (req, res) => {
    const queryParams = Object.assign({}, req.params, req.query);
    return app.render(req, res, "/user", queryParams);
  });

  // give all Nextjs's request to Nextjs server
  server.get("/_next/*", (req, res) => {
    handle(req, res);
  });

  server.get("/static/*", (req, res) => {
    handle(req, res);
  });

  // Default Route
  // Allow Next to handle all other routes:
  // - Includes the numerous `/_next/...` routes which must be exposed
  //   for the next app to work correctly
  // - Includes 404'ing on unknown routes
  server.get("*", (req, res) => {
    handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`Server listening on ${ROOT_URL}`);
  });
});
