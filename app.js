// Bring the Dependencies
const cors = require("cors");
const path = require("path");
const express = require("express");
const consola = require("consola");
const passport = require("passport");
const { connect } = require("mongoose");
const bodyParser = require("body-parser");
const { PORT, db } = require("./config/config");

// Initialize the express application
const app = express();

// Setup the middlewares
app.use(cors());
app.use(bodyParser.json());

// Setup express static directory
app.use(express.static(path.join(__dirname, "./public")));

// Passport middleware
app.use(passport.initialize());
// Bring in Passport startegy
require("./middlewares/passport")(passport);

app.use("/api/users", require("./routes/users"));
app.use("/api/blogs", require("./routes/blogs"));

const startServer = async () => {
  // Connect with the database
  await connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      consola.success({
        message: `Database Connected Successfully\n${db}`,
        badge: true
      });
    })
    .catch(err =>
      consola.error({
        message: `Unable to connect with the database\n${err}`,
        badge: true
      })
    );

  // Start listening for the server
  app.listen(PORT, () =>
    consola.success({
      message: `Server started on port ${PORT}`,
      badge: true
    })
  );
};

startServer();
