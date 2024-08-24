import Transaction from '../models/transaction.model.js'

const transactionResolver = {
	Query: {
		transactions: async (_, __, context) => {
			try {
				if (!context.getUser()) throw new Error('Unauthorized')
				const userId = await context.getUser()._id
				const transactions = await Transaction.find({ userId })
				return transactions
			} catch (err) {
				console.error(`Error in transactions: ${err}`)
				throw new Error(err.message || `Error getting transactions`)
			}
		},

		transaction: async (_, { transactionId }) => {
			try {
				const transaction = await Transaction.findById(transactionId)
				return transaction
			} catch (err) {
				console.error(`Error in transaction: ${err}`)
				throw new Error(err.message || `Error getting transaction`)
			}
		},

		// TODO => ADD CATEGORY STATISTICS QUERY
	},
	Mutation: {
		createTransaction: async (_, { input }, context) => {
			try {
				const newTransaction = new Transaction({
					...input,
					userId: await context.getUser()._id,
				})
				await newTransaction.save()
				return newTransaction
			} catch (err) {
				console.error(`Error in creating Transaction: ${err}`)
				throw new Error(err.message || `Error creating transaction`)
			}
		},

		updateTransaction: async (_, { input }) => {
			try {
				const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, { new: true })
				return updatedTransaction
			} catch (err) {
				console.error(`Error in updating Transaction: ${err}`)
				throw new Error(err.message || `Error updating transaction`)
			}
		},

		deleteTransaction: async (_, { transactionId }) => {
			try {
				const deletedTransaction = await Transaction.findByIdAndDelete(transactionId)
				return deletedTransaction
			} catch (err) {
				console.error(`Error in deleting Transaction: ${err}`)
				throw new Error(err.message || `Error deleting transaction`)
			}
		},

		// TODO => ADD TRANSACTION/USER RELATIONSHIP
	},
}

export default transactionResolver
