module.exports = (function () {
    const model = require('../mongoose/model');

    const newMessage = async (object) => {
        const newMessage = new model.Message(object);
        const result = await newMessage.save();
        return await result;
    }

    // findWithID Function is not in use.
    const findWithID = async (FromData) => {
        return await model.Message.findOne(FromData)
    }

    const findAll = async () => {
        return await model.Message.find();
    }

    const findChunk = async (FromData) => {
        return await model.Message.find(FromData);
    }

    const updateOne = async (key, parameter) => {
        return await model.Message.updateOne(key, parameter)
    }

    return {
        newMessage: newMessage,
        findWithID: findWithID,
        findAll: findAll,
        findChunk: findChunk,
        updateOne: updateOne
    }
})