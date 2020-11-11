const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { rndStringGenerator } = require('./rndStringGenerator');
const User = require('./user');

const mongoose = require('mongoose');
var db = mongoose.connection;
db.once('open', () => {
  console.log("Connected to mongodb server");
})
mongoose.connect("mongodb://localhost:27017/local", { useNewUrlParser: true, useUnifiedTopology: true });

let user = [];
let Rooms = []
let Messages = [];
var schema = buildSchema(`
type User {
  id : ID!
  name : String
  phone : String
  email : String
  friends : [User!]
  rooms : [Room!]
}

type Room {
  id: ID!
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
  user(id : ID!) : User
  users : [User!]
  myRooms(id : ID!) : [Room!]
}

type Mutation {
  addUser(input : UserInput) : User
  addFriend(id : ID!, input : UserInput) : User
  createRoom (input : RoomInput) : Room
  newMessage (input : MessageInput) : Message
}
`)

const resolver = {
  user: async ({ id }) => {
    console.log("GraphQL Get User : ", id)
    try {
      await User.findOne({ id }, (err, user) => {
        if (err) return console.log(err)
        if (!user) return console.log("사용자가 없습니다")
        console.log(user)
        return user;
      }).catch(err => console.log(err))
    } catch (err) {
      console.log("User Error : ", err);
    }
  },
  addUser: async ({ input }) => {
    console.log("GraphQL Add User : ", input)
    var objectID = rndStringGenerator();
    var rawObject = {
      id: objectID, name: input.name, phone: input.phone, email: input.email, friends: [], rooms : []
    }
    try {
      var user = new User();
      user.id = rawObject.id;
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
  users: () => {
    console.log(user)
    console.log()
    return user;
  },
  getRooms: ({ id }) => {

  },
  addFriend: ({ id, input }) => {
    console.log(id, input)
    console.log('user', user)
    var index = user.findIndex(element => {
      if (element.id == id) {
        return element;
      }
    });
    console.log(user[index])
    var targetIndex = user.findIndex(element => {
      if (element.phone == input.phone) {
        return element;
      }
    });
    console.log('targetID', targetIndex)
    user[index].friends.push(user[targetIndex])
    console.log(user[index])
    return user[index]
  },
  createRoom: ({ input }) => {
    var roomID = rndStringGenerator();
    input["room_id"] = roomID;
    input["reg_date"] = new Date();
    Rooms.push(input);
    return input;
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