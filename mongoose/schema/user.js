module.exports = (mongoose) => {
    return new mongoose.Schema({
        name : String,
        phone : String,
        email : String,
        friends : Array,
        rooms : Array
    })
}