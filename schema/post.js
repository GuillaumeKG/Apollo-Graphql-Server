import Author from './author';
import Comment from './comment';

const Post = `
  interface Post {
    id: Int!
    title: String!
    author: Author!
    votes: Int
    comments: [Comment]
    keywords: [String]
  }

  type ImgPost implements Post{
    id: Int!
    title: String!
    author: Author!
    votes: Int
    comments: [Comment]
    keywords: [String]
    imgUrl: String!
    width: Int
    height: Int
    size: Int
  }

  type BlogPost implements Post{
    id: Int!
    title: String!
    author: Author!
    votes: Int
    comments: [Comment]
    keywords: [String]
    text: String
  }
`;

export default () => [Post, Author, Comment];