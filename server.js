// ==================================================
// DEPENDENCIES
//===================================================
const express=require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const app = express();
var cors = require("cors");

const dotenv=require("dotenv");
dotenv.config();

// using the cors module to simplify setting headers
app.use(cors());

// BodyParser makes it easy for our server to interpret data sent to it.
// The code below is pretty standard.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" })); 

// Static directory
app.use(express.static(__dirname + "/app/public"));

// set up mongoose connection

var mongoose = require("mongoose");
var MONGODB = process.env.MONGODB_URI || "mongodb://localhost/savannahtour";

mongoose.connect(  
  MONGODB,
  { useMongoClient: true}
  );

var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose error: ", error);
});

// Once connected to the db through mongoose, log a success message
db.once("open", function() {
  console.log(`Mongoose connected on ${MONGODB}.`);
});

// ===================================================
// ROUTES
// ===================================================

require("./api/htmlRoutes")(app);
require("./api/adminApi")(app);

// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// ==================================================
// start our server
// ==================================================
app.listen(PORT, function() {
  console.log(`App listening on port ${PORT}`);
});