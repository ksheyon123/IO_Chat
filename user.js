var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name : String,
    phone : String,
    email : String,
    friends : Array,
    rooms : Array
})

module.exports = mongoose.model("user", userSchema)