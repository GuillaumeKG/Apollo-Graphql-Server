import User from './user'
import Comment from './comment'
import Collection from './collection'

const Post = `
  interface Post {
    id: ID!
    title: String!
    description: String
    keywords: [String]
    initialCollection: Collection
    author: User!
    
    votes: Int
    comments: [Comment]
  }

  type ImgPost implements Post{
    id: ID!
    title: String!
    description: String
    keywords: [String]
    initialCollection: Collection
    author: User!
    
    imgUrl: String!
    origin: String
    width: Int
    height: Int
    size: Int

    votes: Int
    comments: [Comment]
  }

  type BlogPost implements Post{
    id: ID!
    title: String!
    description: String
    text: String
    keywords: [String]
    initialCollection: Collection
    author: User!
    
    votes: Int
    comments: [Comment]
  }
`

export default () => [Post, User, Comment, Collection]