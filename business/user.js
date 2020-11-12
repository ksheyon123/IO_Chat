module.exports = (function () {
    const model = require('../mongoose/model');

    const addUser = async (object) => {
        const newUser = new model.User(object);
        const result = await newUser.save();
        return await result;
    }

    const findWithID = async (FromData) => {
        return await model.User.findOne(FromData)
    }

    const findAll = async () => {
        return await model.User.find();
    }

    const findChunk = async (FromData) => {
        return await model.User.find(FromData)
    }

    const updateOne = async (key, parameter) => {
        return await model.User.updateOne(key, parameter)
    }

    return {
        addUser: addUser,
        findWithID: findWithID,
        findAll: findAll,
        findChunk : findChunk,
        updateOne: updateOne
    }
})