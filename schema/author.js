// author.js
import Post from './post';
import Comment from './comment';

const Author = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post]
    comments: [Comment]
  }
`;

// we export Author and all types it depends on
// in order to make sure we don't forget to include
// a dependency and we wrap it in a function
// to avoid strings deduplication
export default () => [Author, Post, Comment];