module.exports = (() => {
    const mongoose = require('mongoose');
    var db = mongoose.connection;
    db.on('error', console.error);
    db.once('open', () => {
        console.log("Connected to mongodb server");
    })
    mongoose.connect("mongodb://localhost:27017/local", { useNewUrlParser: true, useUnifiedTopology: true });

    const schema = {};
    const model = {};
    schema.User = require('./schema/user')(mongoose);
    schema.Room = require('./schema/room')(mongoose);
    schema.Message = require('./schema/message')(mongoose);
    // console.log("Schema  : ", schema);

    // variable k is key of schema, 
    for (let k in schema) {
        model[k] = mongoose.model(k, schema[k]);
    }
    return model;
})();