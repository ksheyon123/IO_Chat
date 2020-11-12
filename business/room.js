module.exports = (function () {
    const model = require('../mongoose/model');

    const addRoom = async (object) => {
        const newUser = new model.User(object);
        const result = await newUser.save();
        return await result;
    }

    const findWithID = async (id) => {
        return await model.User.findOne({ _id: id })
    }

    const findAll = async () => {
        return await model.User.find();
    }

    const findChunk = async (fIDs) => {
        return await model.User.find(fIDs)
    }

    return {
        addRoom: addRoom,
        findWithID: findWithID,
        findAll: findAll,
        findChunk: findChunk
    }
})