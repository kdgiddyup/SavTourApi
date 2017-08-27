var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String, //TourStop or Sponsor
    required: true
  },
  map: {
    type: Boolean,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  pos: {
    type: Object,
    required: false
  }
});

var Location = mongoose.model("Location", LocationSchema);

module.exports = Location;
