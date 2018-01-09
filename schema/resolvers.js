import axios from 'axios'
import { PubSub, withFilter } from 'graphql-subscriptions'
import uuidv4   from 'uuid/v4'

// Sample data
const users = [
  { id: 1, firstName: 'Tom', lastName: 'Coleman' },
  { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
  { id: 3, firstName: 'Mikhail', lastName: 'Novikov' },
];
const posts = [
  { id: uuidv4(), authorId: 1, title: 'Introduction to GraphQL', votes: 2, imgUrl: 'https://placeimg.com/960/720/nature/1', keywords:['Nature', 'Forest', 'Winter'] },
  { id: uuidv4(), authorId: 2, title: 'Welcome to Meteor', votes: 3, imgUrl: 'https://placeimg.com/320/240/nature/2', keywords:['Nature', 'Forest', 'Winter'] },
  { id: uuidv4(), authorId: 2, title: 'Advanced GraphQL', votes: 1, imgUrl: 'https://placeimg.com/320/240/nature/3', keywords:['Nature', 'Forest', 'Winter'] },
  { id: uuidv4(), authorId: 3, title: 'Launchpad is Cool', votes: 7, imgUrl: 'https://placeimg.com/320/240/nature/4', keywords:['Nature', 'Forest', 'Winter']  },
  { id: uuidv4(), authorId: 1, title: 'Introduction to GraphQL', votes: 2, imgUrl: 'https://placeimg.com/320/240/nature/5', keywords:['Nature', 'Forest', 'Winter'] },
  { id: uuidv4(), authorId: 2, title: 'Welcome to Meteor', votes: 3, imgUrl: 'https://placeimg.com/320/240/nature/6', keywords:['Nature', 'Forest', 'Winter']  },
  { id: uuidv4(), authorId: 2, title: 'Advanced GraphQL', votes: 1, imgUrl: 'https://placeimg.com/320/240/nature/7', keywords:['Nature', 'Forest', 'Winter'] },
  { id: uuidv4(), authorId: 3, title: 'Launchpad is Cool', votes: 7, imgUrl: 'https://placeimg.com/320/240/nature/8', keywords:['Nature', 'Forest', 'Winter']  },
  { id: uuidv4(), authorId: 1, title: 'Introduction to GraphQL', votes: 2, imgUrl: 'https://placeimg.com/320/240/nature/9', keywords:['Nature', 'Forest', 'Winter'] },
  { id: uuidv4(), authorId: 2, title: 'Welcome to Meteor', votes: 3, imgUrl: 'https://placeimg.com/320/240/nature/10', keywords:['Nature', 'Forest', 'Winter']  },
  { id: uuidv4(), authorId: 2, title: 'Advanced GraphQL', votes: 1, imgUrl: 'https://placeimg.com/320/240/nature/11', keywords:['Nature', 'Forest', 'Winter'] },
  { id: uuidv4(), authorId: 3, title: 'Launchpad is Cool', votes: 7, imgUrl: 'https://placeimg.com/320/240/nature/12', keywords:['Nature', 'Forest', 'Winter']  },
  { id: uuidv4(), authorId: 1, title: 'Introduction to GraphQL', votes: 2, imgUrl: 'https://placeimg.com/320/240/nature/13', keywords:['Nature', 'Forest', 'Winter'] },
  { id: uuidv4(), authorId: 2, title: 'Welcome to Meteor', votes: 3, imgUrl: 'https://placeimg.com/320/240/nature/14', keywords:['Nature', 'Forest', 'Winter']  },
  { id: uuidv4(), authorId: 2, title: 'Advanced GraphQL', votes: 1, imgUrl: 'https://placeimg.com/320/240/nature/15', keywords:['Nature', 'Forest', 'Winter'] },
  { id: uuidv4(), authorId: 3, title: 'Launchpad is Cool', votes: 7, imgUrl: 'https://placeimg.com/320/240/nature/16', keywords:['Nature', 'Forest', 'Winter']  },
  { id: uuidv4(), authorId: 1, title: 'Introduction to GraphQL', votes: 2, imgUrl: 'https://placeimg.com/320/240/nature/17', keywords:['Nature', 'Forest', 'Winter'] },
  { id: uuidv4(), authorId: 2, title: 'Welcome to Meteor', votes: 3, imgUrl: 'https://placeimg.com/320/240/nature/18', keywords:['Nature', 'Forest', 'Winter']  },
  { id: uuidv4(), authorId: 2, title: 'Advanced GraphQL', votes: 1, imgUrl: 'https://placeimg.com/320/240/nature/19', keywords:['Nature', 'Forest', 'Winter'] },
  { id: uuidv4(), authorId: 3, title: 'Launchpad is Cool', votes: 7, imgUrl: 'https://placeimg.com/320/240/nature/20', keywords:['Nature', 'Forest', 'Winter']  },
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
const COMMENT_ADDED_TOPIC = 'commentAdded'
const POST_ADDED_TOPIC = 'postAdded'
const POST_VOTE_ADDED_TOPIC = 'postVoteAdded';

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
    user: (obj, { id }, context, info) => {
      return users.find(user => user.id === id)
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
      console.log(posts)
      console.log(id)
      const post = posts.find(post => post.id === id)
      if (!post) {
        throw new Error(`Couldn't find post with id ${id}`);
      }
      post.votes += 1
      pubsub.publish(POST_VOTE_ADDED_TOPIC, post)
      return post;
    },
    submitComment: (obj, { id, title, message }, context, info) => {
      // Persist comment here
      let comment = { id: uuidv4(), title, message }
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
        console.log('commentAdded resolve payload')
        console.log(payload)
        console.log(variables)
        return payload.id
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(COMMENT_ADDED_TOPIC), 
        (payload, variables) => {
          console.log('commentAdded withFilter ')
          console.log(payload)
          console.log(variables)
          return payload.id === variables.id
        }
      )
    },
    postVoted: {
      // Allow to manipulate payload before processing
      resolve: (payload, args) => {
        console.log('postVoted resolve')
        console.log(payload)
        return payload
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(POST_VOTE_ADDED_TOPIC), 
        (payload, variables) => {
          console.log('postVoted withFilter ')
          console.log(payload)
          console.log(variables)
          return true
        }
      )
    }
  },

  /******************************************* */
  /*               NESTED RESOLVERS            */
  /******************************************* */
  User: {
    posts: (user, args, context, info) => posts.find(post => post.authorId === user.id)
  },

  ImgPost: {
    author: (post, args, context, info) => users.find(user => user.id === post.authorId),
    // Asynchroneous fecth example
    comments: (post, args, context, info) => {
      return getPosts()
        .then(response => {
          let comments = response.data.map(post => {
            return { id: post.id, title: post.title, message: post.body }
          })
          return comments
        })
        .catch(error => {
          throw new Error("Couldn't get Comments.");
        })
    }
  },

  /******************************************* */
  /*              RESOLVE SUBTYPES             */
  /******************************************* */
  Post: {
    __resolveType(obj, context, info) {
      return 'ImgPost';
      /*
      if (obj.imgUrl) {
        console.log('Type ImgPost deduced')
        return 'ImgPost';
      } else {
        console.log('Type BlogPost deduced')
        return 'BlogPost';
      }*/
    },
  },
}