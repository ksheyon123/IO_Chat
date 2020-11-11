const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { rndStringGenerator } = require('./rndStringGenerator');
const User = require('./user');
const Room = require('./room');
const Message = require('./message');

const mongoose = require('mongoose');
var db = mongoose.connection;
db.once('open', () => {
  console.log("Connected to mongodb server");
})
mongoose.connect("mongodb://localhost:27017/local", { useNewUrlParser: true, useUnifiedTopology: true });

var schema = buildSchema(`
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
      var user = await User.findOne({ _id: _id }, (err, user) => {
        if (err) return console.log(err)
        if (!user) return console.log("사용자가 없습니다")
        return user;
      });
      var fID_List = user.friends;
      var rID_List = user.rooms;
      var fList = await User.find({ _id: fID_List });
      var rList = await Room.find({ _id: rID_List });
      user.friends = fList;
      user.rooms = rList;
      return user;
    } catch (err) {
      console.log("User Error : ", err);
    }
  },
  addUser: async ({ input }) => {
    console.log("GraphQL Add User : ", input)
    var rawObject = {
      name: input.name, phone: input.phone, email: input.email, friends: [], rooms: []
    }
    try {
      var user = new User();
      user.name = rawObject.name;
      user.phone = rawObject.phone;
      user.email = rawObject.email;
      user.friends = rawObject.friends;
      user.rooms = rawObject.rooms;
      // Replace fakeDatabase to real database Function
      user.save((err) => {
        if (err) {
          console.error(err);
          return err;
        }
      });
      return new User(rawObject);
    } catch (err) {
      console.log(err);
    }
  },
  users: async () => {
    try {
      var users = await User.find((err, user) => {
        if (err) return console.log(err);
        return user;
      });

      console.log(users)

      return users;
    } catch (err) {
      console.log(err);
    }
  },
  
  addFriend: async ({ _id, target_id }) => {
    try {
      await User.updateOne({ _id: _id }, { $addToSet: { friends: target_id } });
      await User.updateOne({ _id: target_id }, { $addToSet: { friends: _id } });

      var user = await User.findOne({ _id }, (err, user) => {
        if (err) return console.log(err)
        if (!user) return console.log("사용자가 없습니다")
        return user;
      });

      var fID_List = user.friends;

      var fList = await User.find({ _id: fID_List });
      user.friends = fList;
      return user;
    } catch (err) {
      console.log(err);
    }
  },
  createRoom: async ({ input }) => {
    console.log(input)
    var rawObject = new Object();
    try {

      var user = await User.findOne({_id : input.id});
      var reg_date = new Date().toISOString();
      rawObject = {user : user, name : input.name, logs : [], reg_date : reg_date}
      var room = new Room();
      room.user = [rawObject.user];
      room.name = rawObject.name;
      room.logs = [];
      room.reg_date = rawObject.reg_date;
      // Replace fakeDatabase to real database Function
      room.save((err) => {
        if (err) {
          console.error(err);
          return err;
        }
      });
      await User.updateOne({_id : input.id}, {$push : {rooms : room._id}});
      return room;
    } catch (err) {
      console.log(err);
    }
  },
  joinRoom: async ({ _id, room_id }) => {
    try {
      await User.updateOne({_id : _id }, {$addToSet : {rooms : room_id}});
      await Room.updateOne({_id : room_id} , {$addToSet : {user : _id}});
      var room = await Room.findOne({_id : room_id});
      var uID_List = room.user;
      var uList = await User.find({ _id : uID_List});
      room.user = uList;
      return room;
    } catch (err) {
      console.log(err);
    }
  },
  leaveRoom: ({ room_id }) => {

  },
  room : async ({ _id }) => {
    try {
      var room = await Room.findOne({_id : _id});
      var mList = await Message.find({ room_id : _id});
      console.log("room : ", room);
      console.log("mList : ", mList)
      room.logs = mList;
      return room;
    } catch (err) {
      console.log(err);
    }
  },
  newMessage: async ({ input }) => {
    console.log(input);
    var rawObject = {
      room_id : input.room_id, 
      owner : input.id,
      message : input.message,
      reg_time : new Date().toISOString(),
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

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolver,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://192.168.0.120:4000/graphql');