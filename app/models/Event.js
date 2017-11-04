var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  start: {
    type: Date,
    required: false
  },
  end: {
    type: Date,
    required: false
  },
});

var Event = mongoose.model("Event", EventSchema);

module.exports = Event;