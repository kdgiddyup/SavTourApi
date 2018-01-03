var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ClientSchema = new Schema({ 
    name: {
        type: String,
        required: true
        },
    email: {
        type: String,
        unique: true
}
});
var Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
