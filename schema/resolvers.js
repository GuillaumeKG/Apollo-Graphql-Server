import axios from 'axios'
import { PubSub, withFilter } from 'graphql-subscriptions'

// Sample data
const authors = [
  { id: 1, firstName: 'Tom', lastName: 'Coleman' },
  { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
  { id: 3, firstName: 'Mikhail', lastName: 'Novikov' },
];
const posts = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2, imgUrl: 'https://placeimg.com/960/720/nature/1', keywords:['Nature', 'Forest', 'Winter'] },
  { id: 2, authorId: 2, title: 'Welcome to Meteor', votes: 3, imgUrl: 'https://placeimg.com/320/240/nature/2', keywords:['Nature', 'Forest', 'Winter'] },
  { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1, imgUrl: 'https://placeimg.com/320/240/nature/3', keywords:['Nature', 'Forest', 'Winter'] },
  { id: 4, authorId: 3, title: 'Launchpad is Cool', votes: 7, imgUrl: 'https://placeimg.com/320/240/nature/4', keywords:['Nature', 'Forest', 'Winter']  },
  { id: 5, authorId: 1, title: 'Introduction to GraphQL', votes: 2, imgUrl: 'https://placeimg.com/320/240/nature/5', keywords:['Nature', 'Forest', 'Winter'] },
  { id: 6, authorId: 2, title: 'Welcome to Meteor', votes: 3, imgUrl: 'https://placeimg.com/320/240/nature/6', keywords:['Nature', 'Forest', 'Winter']  },
  { id: 7, authorId: 2, title: 'Advanced GraphQL', votes: 1, imgUrl: 'https://placeimg.com/320/240/nature/7', keywords:['Nature', 'Forest', 'Winter'] },
  { id: 8, authorId: 3, title: 'Launchpad is Cool', votes: 7, imgUrl: 'https://placeimg.com/320/240/nature/8', keywords:['Nature', 'Forest', 'Winter']  },
  { id: 9, authorId: 1, title: 'Introduction to GraphQL', votes: 2, imgUrl: 'https://placeimg.com/320/240/nature/9', keywords:['Nature', 'Forest', 'Winter'] },
  { id: 10, authorId: 2, title: 'Welcome to Meteor', votes: 3, imgUrl: 'https://placeimg.com/320/240/nature/10', keywords:['Nature', 'Forest', 'Winter']  },
  { id: 11, authorId: 2, title: 'Advanced GraphQL', votes: 1, imgUrl: 'https://placeimg.com/320/240/nature/11', keywords:['Nature', 'Forest', 'Winter'] },
  { id: 12, authorId: 3, title: 'Launchpad is Cool', votes: 7, imgUrl: 'https://placeimg.com/320/240/nature/12', keywords:['Nature', 'Forest', 'Winter']  },
  { id: 13, authorId: 1, title: 'Introduction to GraphQL', votes: 2, imgUrl: 'https://placeimg.com/320/240/nature/13', keywords:['Nature', 'Forest', 'Winter'] },
  { id: 14, authorId: 2, title: 'Welcome to Meteor', votes: 3, imgUrl: 'https://placeimg.com/320/240/nature/14', keywords:['Nature', 'Forest', 'Winter']  },
  { id: 15, authorId: 2, title: 'Advanced GraphQL', votes: 1, imgUrl: 'https://placeimg.com/320/240/nature/15', keywords:['Nature', 'Forest', 'Winter'] },
  { id: 16, authorId: 3, title: 'Launchpad is Cool', votes: 7, imgUrl: 'https://placeimg.com/320/240/nature/16', keywords:['Nature', 'Forest', 'Winter']  },
  { id: 17, authorId: 1, title: 'Introduction to GraphQL', votes: 2, imgUrl: 'https://placeimg.com/320/240/nature/17', keywords:['Nature', 'Forest', 'Winter'] },
  { id: 18, authorId: 2, title: 'Welcome to Meteor', votes: 3, imgUrl: 'https://placeimg.com/320/240/nature/18', keywords:['Nature', 'Forest', 'Winter']  },
  { id: 19, authorId: 2, title: 'Advanced GraphQL', votes: 1, imgUrl: 'https://placeimg.com/320/240/nature/19', keywords:['Nature', 'Forest', 'Winter'] },
  { id: 20, authorId: 3, title: 'Launchpad is Cool', votes: 7, imgUrl: 'https://placeimg.com/320/240/nature/20', keywords:['Nature', 'Forest', 'Winter']  },
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