module.exports = (function () {
    const model = require('../mongoose/model');

    const createRoom = async (object) => {
        const newRoom = new model.Room(object);
        const result = await newRoom.save();
        return await result;
    }

    const findWithID = async (FromData) => {
        return await model.Room.findOne(FromData)
    }

    const findAll = async () => {
        return await model.Room.find();
    }

    const findChunk = async (FromData) => {
        return await model.Room.find(FromData);
    }

    const updateOne = async (key, parameter) => {
        return await model.Room.updateOne(key, parameter)
    }

    return {
        createRoom: createRoom,
        findWithID: findWithID,
        findAll: findAll,
        findChunk: findChunk,
        updateOne: updateOne
    }
})