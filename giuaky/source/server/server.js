const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const cors = require('cors');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();

app.use(cors());

const schema = require('./schema');

app.use('/graphql', graphqlHTTP({
	schema: schema,
	graphiql: true
}));

app.listen(4000, ()=> console.log('server running in port 4000'))