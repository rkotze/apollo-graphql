const express = require('express')
const bodyParser = require('body-parser') 
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const os = require('os');

const PORT = 3000

const app = express()

const typeDefs = `
    type Status {
        code: Int
        message: String
        lastUpdated: Float
    }
    type CPU {
        model: String
        speed: Int
    }
    type Query {
        status: Status
        cpuDetails(cpuNumber: Int): CPU  
    }
`

const resolvers = {
    Query: {
        status: () => ({ code: 200, msg: "OK" }),
        cpuDetails: (obj, args) => (os.cpus()[args.cpuNumber])
    },
    Status: {
      code: (obj) => obj.code,
      message: (obj) => obj.msg,
      lastUpdated: (obj) => new Date().getTime()
    },
    CPU: {
        model: (cpu) => cpu.model,
        speed: (cpu) => cpu.speed,
    }
}

const graphQLSchema =  makeExecutableSchema({
    typeDefs,
    resolvers,
});

app.get('/status', (req, res) => res.send('Express status: OK'))
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: graphQLSchema }))

console.log(`Express running on ${PORT}`)
app.listen(PORT)