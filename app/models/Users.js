var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({ 
 // basic-auth-mongoose plugin will add user/pass fields
});

//To add authentication functionality, all you need to do is plugin basic-auth, and create your new User model:
UserSchema.plugin(require("basic-auth-mongoose"));

var User = mongoose.model("User", UserSchema);

module.exports = User;

