import  { makeExecutableSchema, addResolveFunctionsToSchema  } from 'graphql-tools'

import User from './user'
import Message from './message'

import resolvers from './resolvers'

// Endpoints exposed
const SchemaDefinition = `
  type Query { 
      user(id: ID!): User
      post(id: ID!): ImgPost
      posts: [ImgPost]
      postsBySearch(searchCriteria: String!): [ImgPost]
      mailbox(id: ID!):  MailBox
    }
  type Mutation {
    upvotePost(id: ID!):Post
    submitComment(id: ID!, message:String!):Comment
  }
  type Subscription {
    commentAdded(id: ID!): Comment
    postVoted(id: ID!): Post
  }
`
// Create GraphQL schema
var schema = makeExecutableSchema({
  typeDefs: [
    SchemaDefinition, 
    User,
    Message
  ],
  resolvers:{},
  //logger: { log: (e) => console.log(e) }
})

// Add resolver a posteriori. Usefull to merge resolvers
addResolveFunctionsToSchema (schema, resolvers)

export default schema