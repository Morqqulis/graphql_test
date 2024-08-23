import mongoose from 'mongoose'

export const connectDB = async () => {
	// connect to db
	try {
		const db = await mongoose.connect(process.env.MONGO_URI)
		console.log(`MongoDB Connected: ${db.connection.host}`)
	} catch (err) {
		console.log(`Error: ${err.message}`)
		process.exit(1)
	}
}
