const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { rndStringGenerator } = require('./rndStringGenerator');
const User = require('./user');
const Room = require('./room');

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
  newlog : [Message!]
  oldlog : [Message!]
  reg_date : String!
}

type Message {
  room_id : ID!
  message : String!
  reg_time : String!
  read : Boolean!
}

input UserInput {
  name : String
  phone : String
  email : String
}

input RoomInput {
  name : String!
  user : UserInput
}

input MessageInput {
  room_id : ID!
  message : String!
  read : Boolean!
}

type Query {
  user(_id : ID!) : User
  users : [User!]
  myRooms(_id : ID!) : [Room!]
}

type Mutation {
  addUser(input : UserInput) : User
  addFriend(_id : ID!, target_id : ID!) : User
  createRoom (input : RoomInput) : Room
  newMessage (input : MessageInput) : Message
}
`)

const resolver = {
  user: async ({ _id }) => {
    console.log("GraphQL Get User : ", _id)
    try {
      var user = await User.findOne({ _id : _id }, (err, user) => {
        if (err) return console.log(err)
        if (!user) return console.log("사용자가 없습니다")
        return user;
      });
      return user;
    } catch (err) {
      console.log("User Error : ", err);
    }
  },
  addUser: async ({ input }) => {
    console.log("GraphQL Add User : ", input)
    var rawObject = {
      name: input.name, phone: input.phone, email: input.email, friends: [], rooms : []
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
  getRooms: ({ id }) => {

  },
  addFriend: async ({ _id, target_id }) => {
    console.log("_id", _id, " target_id ", target_id)
    try {
      await User.updateOne({ _id : _id }, {$push : {friends : target_id}});
      
      var user = await User.findOne({ _id }, (err, user) => {
        if (err) return console.log(err)
        if (!user) return console.log("사용자가 없습니다")
        return user;
      });
      console.log("Get User", user)

      var fID_List = user.friends;
      console.log(fID_List);

      var fList = await User.find({_id : fID_List});
      console.log("fList", fList);
      user.friends = fList;
      return user;
    } catch (err) {
      console.log(err);
    }
  },
  createRoom: async ({ input }) => {
    try {

    } catch (err) {
      console.log(err);
    }
  },
  joinRoom: ({ id, room_id }) => {

  },
  leaveRoom: ({ room_id }) => {

  },
  newMessage: ({ input }) => {
    console.log(input)
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