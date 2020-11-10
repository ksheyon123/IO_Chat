const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { rndStringGenerator } = require('./rndStringGenerator');
let user = [];
let Rooms = []
let Chattings = [];
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
  owner : ID!
  room_id : ID!
  user : [UserInput!]
  name : String!
  newlog : [Chat!]
  oldlog : [Chat!]
  reg_date : String!
}

input UserInput {
  name : String
  phone : String
  email : String
}

input RoomInput {
  owner : ID!
  user : [UserInput!]
  name : String!
  reg_date : String!
}

type Chat {
  owner : ID!
  room_id : ID!
  message : String!
  reg_time : String!
  read : Boolean!
}

type Query {
  user(id : ID!) : User
  users : [User!]
}

type Mutation {
  addUser(input : UserInput) : User
  addFriend(id : ID!, input : UserInput) : User
  createRoom (input : RoomInput, input : UserInput) : Room
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
    return user;
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