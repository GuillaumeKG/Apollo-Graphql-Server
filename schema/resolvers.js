import axios from 'axios'
import { PubSub, withFilter } from 'graphql-subscriptions'

// Sample data
const authors = [
  { id: 1, firstName: 'Tom', lastName: 'Coleman' },
  { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
  { id: 3, firstName: 'Mikhail', lastName: 'Novikov' },
];
const posts = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
  { id: 2, authorId: 2, title: 'Welcome to Meteor', votes: 3, imgUrl: 'http://lorempixel.com/400/200/sports' },
  { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 },
  { id: 4, authorId: 3, title: 'Launchpad is Cool', votes: 7, imgUrl: 'http://lorempixel.com/400/200/nightlife' },
];


/******************************************* */
/*          DATA FETCHING FUNCTIONS          */
/******************************************* */
function getUsers() {
  return axios.get('https://jsonplaceholder.typicode.com/users')
}

function getPosts() {
  return axios.get('https://jsonplaceholder.typicode.com/posts')
}

/******************************************* */
/*        TOPIC NAMES FOR SUBSCRIPTIONS      */
/******************************************* */
const COMMENT_ADDED_TOPIC = 'commentAdded';
const POST_ADDED_TOPIC = 'postAdded';

const pubsub = new PubSub();

/******************************************* */
/*                  RESOLVERS                */
/******************************************* */

export default {
  /******************************************* */
  /*                    QUERY                  */
  /******************************************* */
  Query: {
    posts: (obj, args, context, info) => {
      return posts
    },
    author: (obj, { id }, context, info) => {
      return authors.find(author => author.id === id)
    },
    post: (obj, { id }, context, info) => {
      return posts.find(post => post.id === id)
    }
  },
  /******************************************* */
  /*                  MUTATIONS                */
  /******************************************* */
  Mutation: {
    upvotePost: (obj, { id }, context, info) => {
      const post = posts.find(post => post.id === id)
      if (!post) {
        throw new Error(`Couldn't find post with id ${id}`);
      }
      post.votes += 1;
      return post;
    },
    submitComment: (obj, { id, message }, context, info) => {
      // Persist comment here
      let comment = { id: 10, message }
      pubsub.publish(COMMENT_ADDED_TOPIC, comment)
      console.log('submitComment')
      return comment

    }
  },
  /******************************************* */
  /*               SUBSCRIPTIONS               */
  /******************************************* */
  Subscription: {
    commentAdded: {
      // Allow to manipulate payload before processing
      resolve: (payload, args) => {
        //console.log('resolve payload' + payload + ' ' + args)
        console.log('eahhhhhhhhhhhhhh')
        return payload.id
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(SOMETHING_CHANGED_TOPIC), 
        (payload, variables) => {
          console.log('withFilter ')
          return payload.id === variables.id
        }
      )
    }
  },

  /******************************************* */
  /*               NESTED RESOLVERS            */
  /******************************************* */
  Author: {
    posts: (author, args, context, info) => posts.find(post => post.authorId === author.id)
  },

  ImgPost: {
    author: (post, args, context, info) => authors.find(author => author.id === post.authorId),
    // Asynchroneous fecth example
    comments: (post, args, context, info) => {
      return getPosts()
        .then(response => {
          let comments = response.data.map(user => {
            return { id: user.id, message: user.body }
          })
          return comments
        })
        .catch(error => {
          throw new Error("Couldn't get Users.");
        })
    }
  },

  /******************************************* */
  /*              RESOLVE SUBTYPES             */
  /******************************************* */
  Post: {
    __resolveType(obj, context, info) {
      if (obj.imgUrl) {
        console.log('Type ImgPost deduced')
        return 'ImgPost';
      } else {
        console.log('Type BlogPost deduced')
        return 'BlogPost';
      }
    },
  },
}