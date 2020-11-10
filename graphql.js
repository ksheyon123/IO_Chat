const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { rndStringGenerator } = require('./rndStringGenerator');

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
  user : User!
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

class User {
  constructor(props) {
    this.id = props.id,
      this.name = props.name,
      this.phone = props.phone,
      this.email = props.email,
      this.friends = props.friends
  }
}

const resolver = {
  user: ({ id }) => {
    var data = Object.keys(user).filter(element => {
      if (element.id == id) {
        return element;
      }
    })
    return user[data]
  },
  users: () => {
    console.log(user)
    console.log()
    return user;
  },
  getRooms : ({id}) => {

  },
  addUser: ({ input }) => {
    var objectID = rndStringGenerator();
    var rawObject = {
      id: objectID, name: input.name, phone: input.phone, email: input.email, friends: []
    }

    // Replace fakeDatabase to real database Function
    user.push(rawObject);
    return new User(rawObject);
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
  joinRoom : ({id, room_id}) => {
    
  },
  leaveRoom : ({room_id}) => {

  },
  newMessage : ({input}) => {
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