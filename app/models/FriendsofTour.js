var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FriendsofTourSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

var FriendsofTour = mongoose.model("FriendsofTour", FriendsofTourSchema);

module.exports = FriendsofTour;