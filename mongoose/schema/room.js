// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var roomSchema = new Schema({
//     user : Array,
//     name : String,
//     logs : Array,
//     reg_date : Date
// })

// module.exports = mongoose.model("room", roomSchema)

module.exports = (mongoose) => {
    return new mongoose.Schema({
        user: Array,
        name: String,
        logs: Array,
        reg_date: Date
    })
}