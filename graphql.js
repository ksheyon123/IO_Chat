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
    name : String!
    phone : String!
    email : String!
    friends : [User!]
    rooms : [Room!]
  }
  input UserInput {
    name : String!
    phone : String!
    email : String!
  }

  input FriendInput {
    id : ID
    name : String
    phone : String
    email : String
  }

  type Room {
    id : ID!
    name : String!
    newlog : [Chat!]
    oldlog : [Chat!]
  }

  type Chat {
    data : String!
  }

  type Query {
    user(id : ID!) : User
    users : User
  }

  type Mutation {
    addUser(input : UserInput) : User
    addFriend(input : FriendInput) : User
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
    return user
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
  addFriend: ({ input }) => {
    console.log(input)
    console.log(Object.keys(user))

    var data = Object.keys(user).filter(element => {
      console.log(element)
      if (element.name == input.name) {
        return element
      }
    });
    var data = Object.keys(user).filter(element => {
      if (element.id == id) {
        return element
      }
    });
    user[data].friends.push()

    return new User()
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