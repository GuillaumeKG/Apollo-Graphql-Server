import User from './user'
import Post from './post'

const Collection = `
  type Collection {
    id: ID!
    title: String!
    description: String
    category: Category
    secret: Boolean!
    author: User
    createdDate: String
    posts: [Post]
    sections: [Section]
    subscribers: Int
    hasSubscribed: Boolean
  }

  type Section {
    id: ID!
    parentCollection: Collection
    title: String!
    description: String
    category: Category
    secret: Boolean!
    author: User
    createdDate: String
    posts: [Post]
    subscribers: Int
    hasSubscribed: Boolean
  }

  type Category {
    id: ID!
    name: String
  }
`

export default () => [Collection, User]