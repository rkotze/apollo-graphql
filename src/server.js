const express = require('express')
const bodyParser = require('body-parser') 
const { graphqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')

const PORT = 3000

const app = express()

const typeDefs = `
    type Query {
        status: String    
    }
`

const resolvers = {
    Query: {
        status: () => "GraphQL status: OK"
    }
}

const graphQLSchema =  makeExecutableSchema({
    typeDefs,
    resolvers,
});

app.get('/status', (req, res) => res.send('Express status: OK'))
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: graphQLSchema }))

console.log(`Express running on ${PORT}`)
app.listen(PORT)