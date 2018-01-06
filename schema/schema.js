import  { makeExecutableSchema, addResolveFunctionsToSchema  } from 'graphql-tools'

import Author from './author'

import resolvers from './resolvers'

// Endpoints exposed
const SchemaDefinition = `
  type Query { 
      author(id: Int!): Author
      post(id: Int!): Post
      posts: [ImgPost]
    }
  type Mutation {
    upvotePost(id: Int!):Post
    submitComment(id: Int!, message:String!):Comment
  }
  type Subscription {
    commentAdded(id: Int!): Comment
  }
`
// Create GraphQL schema
var schema = makeExecutableSchema({
  typeDefs: [
    SchemaDefinition, 
    Author
  ],
  resolvers:{},
  //logger: { log: (e) => console.log(e) }
})

// Add resolver a posteriori. Usefull to merge resolvers
addResolveFunctionsToSchema (schema, resolvers)

export default schema