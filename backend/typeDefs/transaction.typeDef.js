const transactionTypeDef = `#graphql
type Transaction {
   _id: ID!
   userId: ID!
   description: String!
   paymentType: String!
   category: String!
   amount: Float!
   date: String!
   location: String
}

type Query {
   transactions: [Transaction!],
   transaction(transactionId: ID!): Transaction,
   # // TODO => ADD CATEGORY STATISTICS QUERY
},

type Mutation {
   createTransaction(input: CreateTransactionInput!): Transaction!,
   updateTransaction(transactionId: ID!, input: UpdateTransactionInput!): Transaction!,
   deleteTransaction(transactionId: ID!): Transaction!
},

input CreateTransactionInput {
   description: String!
   paymentType: String!
   category: String!
   amount: Float!
   date: String!
   location: String
},

input UpdateTransactionInput {
   transactionId: ID!,
   description: String
   paymentType: String
   category: String
   amount: Float
   date: String
   location: String
}
`

export default transactionTypeDef
