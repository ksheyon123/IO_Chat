const express = require('express');
const { graphqlHTTP } = require('express-graphql');

var app = express();

const {schema, resolver} = require('./graphql/schema');

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolver,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://192.168.0.120:4000/graphql');