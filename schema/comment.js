import User from './user'

const Comment = `
  type Comment {
    id: ID!
    title: String!
    message: String!
    author: User
    createdDate: String
    like: Int
    dislike: Int
  }
`

export default () => [Comment, User]