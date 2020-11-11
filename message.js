var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    id : String,
    room_id : String,
    owner : String,
    message : String,
    reg_time : Date,
})

module.exports = mongoose.model("message", messageSchema)