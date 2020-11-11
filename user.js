var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    id : String,
    name : String,
    phone : String,
    email : String,
    friends : Array,
    rooms : Array
})

module.exports = mongoose.model("user", userSchema)