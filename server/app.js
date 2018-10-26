const express = require("express");
const next = require("next");
const session = require("express-session");
const mongoose = require("mongoose");
const logger = require("morgan");
const dotenv = require("dotenv");
const connect = require("connect-mongo");
const expressValidator = require("express-validator");
const MongoStore = connect(session);
const passport = require("passport");
const helmet = require("helmet");
const compression = require("compression");
dotenv.config({ path: "variables.env" });

// // import models to use mongoose.model() Singleton
require("./models/Post");
require("./models/User");

const routes = require("./routes");

// // Import passport config
require("./passport");

const options = {
  useNewUrlParser: true
  // useCreateIndex: true,
  // useFindAndModify: false
};

mongoose.connect(
  process.env.MONGO_URI,
  options
);
mongoose.set("useFindAndModify", false);

mongoose.connection.on("error", err => {
  console.log(`DB connection error: ${err.message}`);
});

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const ROOT_URL = dev ? `http://localhost:${port}` : process.env.PRODUCTION_URL;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // server.use(express.static(path.join(__dirname, "dist")));
  // server.use("/public", express.static(__dirname + "/public"));
  server.use("/public", express.static("public"));
  server.use(helmet());
  server.use(compression());
  /* Body Parser built-in to Express as of version 4.16 */
  server.use(express.json());
  server.use(expressValidator());

  // give all Nextjs's request to Nextjs server
  server.get("/_next/*", (req, res) => {
    handle(req, res);
  });

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

  // server.get("/edit-profile/:userId", (req, res) => {
  //   const queryParams = Object.assign({}, req.params, req.query);
  //   return app.render(req, res, "/edit-profile", queryParams);
  // });

  server.get("/user/:userId", (req, res) => {
    const queryParams = Object.assign({}, req.params, req.query);
    return app.render(req, res, "/user", queryParams);
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
