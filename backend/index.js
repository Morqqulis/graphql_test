import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import passport from 'passport'
import session from 'express-session'
import ConnectMongoDBSession from 'connect-mongodb-session'
import { GraphQLLocalStrategy, buildContext } from 'graphql-passport'
import { configurePassport } from './passport/passport.config.js'
import { connectDB } from './db/connectDB.js'
import mergedResolvers from './resolvers/index.js'
import mergedTypeDefs from './typeDefs/index.js'

dotenv.config()
configurePassport()
const app = express()
const httpServer = http.createServer(app)

const MongoDBStore = ConnectMongoDBSession(session)

const store = new MongoDBStore({
	uri: process.env.MONGO_URI,
	collection: 'sessions',
})

store.on('error', err => console.log(err))

const server = new ApolloServer({
	typeDefs: mergedTypeDefs,
	resolvers: mergedResolvers,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

await server.start()

app.use(
	'/',
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	}),
	express.json(),
	expressMiddleware(server, {
		context: async ({ req, res }) => buildContext({ req, res }),
	}),
)

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7,
			httpOnly: true,
		},
		store,
	}),
	passport.initialize(),
)

app.use(passport.initialize())
app.use(passport.session())

await connectDB()

await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve))

console.log(`🚀 Server ready at http://localhost:4000`)
