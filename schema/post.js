import Author from './author';
import Comment from './comment';

const Post = `
  interface Post {
    id: Int!
    title: String
    author: Author
    votes: Int
    comments: [Comment]
  }

  type ImgPost implements Post{
    id: Int!
    title: String
    author: Author
    votes: Int
    comments: [Comment]
    imgUrl: String!
    width: Int
    height: Int
    size: Int
  }

  type BlogPost implements Post{
    id: Int!
    title: String
    author: Author
    votes: Int
    comments: [Comment]
    text: String
  }
`;

export default () => [Post, Author, Comment];