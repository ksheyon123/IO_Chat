var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
schema {
    query : IO_Chat
}
    type IO_Chat {
    user(id : ID!) : User
  }
   
  type User {
    id: ID
    name: String
    friendIds : [User]
  }
`);

var root = {
    IO_Chat: () => { }
};

var app = express();
app.use('/dbConfig', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to http://localhost:4000/dbConfig'));