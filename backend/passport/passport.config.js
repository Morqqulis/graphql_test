import passport from 'passport'
import bcrypt from 'bcryptjs'
import { GraphQLLocalStrategy } from 'graphql-passport'
import User from '../models/user.model.js'

export const configurePassport = async () => {
	passport.serializeUser((user, done) => {
		console.log(`Serializing user`)
		done(null, user.id)
	})

	passport.deserializeUser(async (id, done) => {
		console.log(`Deserializing user`)
		try {
			done(null, await User.findById(id))
		} catch (err) {
			done(err)
		}
	})

	passport.use(
		new GraphQLLocalStrategy(async (username, password, done) => {
			try {
				const user = await User.findOne({ username })
				const validPassword = bcrypt.compare(password, user.password)
				if (!user) {
					return done(null, false, { message: 'Incorrect username' })
				}
				if (!validPassword) {
					return done(null, false, { message: 'Incorrect password' })
				}

				return done(null, user)
			} catch (err) {
				done(err)
			}
		}),
	)
}
