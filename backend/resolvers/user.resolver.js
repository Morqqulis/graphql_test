import bcrypt from 'bcryptjs'
import { users } from '../dummyData/data.js'
import User from '../models/user.model.js'

const userResolver = {
	Mutation: {
		signUp: async (_, { input }, context) => {
			try {
				const { username, name, password, gender } = input
				if (!username || !name || !password || !gender) {
					// throw new Error('All fields are required')
				}

				const existingUser = await User.findOne({ username })

				if (existingUser) {
					// throw new Error('User already exists')
				}

				const salt = await bcrypt.genSalt(10)
				const hashedPassword = await bcrypt.hash(password, salt)
				const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
				const girlrofilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

				const newUser = new User({
					username,
					name,
					password: hashedPassword,
					profilePicture: gender === 'male' ? boyProfilePic : girlrofilePic,
					gender,
					profilePicture: gender === 'male' ? boyProfilePic : girlrofilePic,
				})

				await newUser.save()
				await context.login(newUser)
				return newUser
			} catch (err) {
				console.error(`Error in createUser resolver: ${err}`)
				throw new Error(err.message || `Internal server error`)
			}
		},

		login: async (_, { input }, context) => {
			try {
				const { username, password } = input
				const { user } = await context.authenticate('graphql-local', {
					username,
					password,
				})
				await context.login(user)
				return user
			} catch (err) {
				console.error(`Error in login: ${err}`)
				throw new Error(err.message || `Internal server error`)
			}
		},

		logout: async (_, __, context) => {
			try {
				await context.logout()
				req.session.destroy(err => {
					if (err) throw new Error(err)
				})
				res.clearCookie('connect.sid')

				return { message: 'Logged out successfully' }
			} catch (err) {
				console.error(`Error in logout: ${err}`)
				throw new Error(err.message || `Internal server error`)
			}
		},
	},
	Query: {
		// users: async (_, { req, res }) => {
		// 	return users
		// },

		authUser: async (_, __, context) => {
			try {
				const user = context.getUser()
				return user
			} catch (err) {
				console.error(`Error in authUser: ${err}`)
				throw new Error(err.message || `Internal server error`)
			}
		},

		user: async (_, { userId }) => {
			try {
				const user = await User.findById(userId)
				return user
			} catch (err) {
				console.error(`Error in user query: ${err}`)
				throw new Error(err.message || `Error getting user`)
			}
		},

		// TODO => ADD USER/TRANSACTION RELATIONSHIP

		// user: async (_, { userId }) => {
		// 	return users.find(user => user._id === userId)
		// },
	},
}

export default userResolver
