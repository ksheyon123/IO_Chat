const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { rndStringGenerator } = require('./rndStringGenerator');
let user = [];
var schema = buildSchema(`
  type User {
    id : ID!
    name : String!
    friends : [ID]!
  }
  input UserInput {
    name : String!
  }
  type Query {
    user(id : ID!) : User
    users : User
  }

  type Mutation {
    createUser(input : UserInput) : User
    insertFriend(id : ID!) : User
  }
`)

const resolver = {
  user : ({id}) => {
    var data = Object.keys(user).filter(element => {
      if (element.id == id) {
        return element;
      }
    })
    return user[data]
  },
  users : () => {
    return user
  },
  createUser: ({ input }) => {
    var objectID = rndStringGenerator();
    user.push({id : objectID, name : input.name, friends : []})
    return { id: objectID, name: input.name, friends : [] };
  },
  insertFriend : ({id, targetID}) => {
    Object.keys(user).filter(element => {
      if (element.id == id) {

      }
    })
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