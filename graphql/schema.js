const dao = require('../business/dao');
const { buildSchema } = require('graphql');
const { domainToASCII } = require('url');
const schema = buildSchema(`
type User {
  _id : ID!
  name : String
  phone : String
  email : String
  friends : [User!]
  rooms : [Room!]
}

type Room {
  _id: ID!
  user : [User!]
  name : String!
  logs : [Message!]
  reg_date : String!
}

type Message {
  room_id : ID!
  owner : ID!
  message : String!
  reg_time : String!
}

input UserInput {
  name : String
  phone : String
  email : String
}

input RoomInput {
  id : ID!  
  name : String!
}

input MessageInput {
  room_id : ID!
  owner : ID!
  message : String!
}

type Query {
  user(_id : ID!) : User
  users : [User!]
  room(_id : ID!) : Room!
}

type Mutation {
  addUser(input : UserInput) : User
  addFriend(_id : ID!, target_id : ID!) : User
  createRoom (input : RoomInput) : Room
  joinRoom(_id : ID!, room_id : ID!) : Room
  newMessage (input : MessageInput) : Message
}
`)

const resolver = {
  user: async ({ _id }) => {
    console.log("GraphQL Get User : ", _id)
    try {
      var user = await dao.user().findWithID({ _id: _id });
      var fIDs = user.friends;
      var rIDs = user.rooms;
      var fList = await dao.user().findChunk({ _id: fIDs });
      var rList = await dao.room().findChunk({ _id: rIDs });
      user.friends = fList;
      user.rooms = rList;
      return user;
    } catch (err) {
      console.log("User Error : ", err);
    }
  },
  addUser: async ({ input }) => {
    try {
      var rawObject = {
        name: input.name,
        phone: input.phone,
        email: input.email,
        friends: [],
        rooms: []
      }
      var data = await dao.user().addUser(rawObject);
      return data;
    } catch (err) {
      console.log(err);
    }
  },
  users: async () => {
    try {
      var users = await dao.user().findAll();
      return users;
    } catch (err) {
      console.log(err);
    }
  },

  addFriend: async ({ _id, target_id }) => {
    try {
      await dao.user().updateOne({ _id: _id }, { $addToSet: { friends: target_id } });
      var user = await dao.user().findWithID({ _id: _id });
      var fIDs = user.friends;
      var fList = await dao.user().findChunk({ _id: fIDs });
      user.friends = fList;
      return user;
    } catch (err) {
      console.log(err);
    }
  },
  createRoom: async ({ input }) => {
    console.log(input)
    try {
      var reg_date = new Date().toISOString();
      var rawObject = {
        user: input.id,
        name: input.name,
        logs: [],
        reg_date: reg_date
      }
      var room = await dao.room().createRoom(rawObject);
      await dao.user().updateOne({ _id: input.id }, { $push: { rooms: room._id } });
      await dao.room().updateOne({ _id: room.id }, { $push: { user: input.id } })
      return room;
    } catch (err) {
      console.log(err);
    }
  },
  joinRoom: async ({ _id, room_id }) => {
    try {
      await dao.user().updateOne({ _id: _id }, { $addToSet: { rooms: room_id } });
      await dao.room().updateOne({ _id: room_id }, { $addToSet: { user: _id } });

      var room = await dao.room().findWithID({ _id: room_id });
      var uIDs = room.user;
      var uList = await dao.user().findChunk({ _id: uIDs });
      room.user = uList;
      return room;
    } catch (err) {
      console.log(err);
    }
  },
  leaveRoom: ({ room_id }) => {

  },
  room: async ({ _id }) => {
    try {
      var room = await Room.findOne({ _id: _id });
      var mList = await Message.find({ room_id: _id });

      var uID_List = room.user;
      var user = await User.find({ _id: uID_List });
      console.log("room : ", room);
      console.log("mList : ", mList)
      room.user = user;
      room.logs = mList;
      return room;
    } catch (err) {
      console.log(err);
    }
  },
  newMessage: async ({ input }) => {
    console.log(input);
    var rawObject = {
      room_id: input.room_id,
      owner: input.owner,
      message: input.message,
      reg_time: new Date().toISOString(),
    }
    try {
      var message = new Message();
      message.room_id = rawObject.room_id;
      message.owner = rawObject.owner;
      message.message = rawObject.message;
      message.reg_time = rawObject.reg_time;
      message.save((err) => {
        if (err) {
          console.error(err);
          return err;
        }
      });
      return new Message(rawObject);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = { schema: schema, resolver: resolver }