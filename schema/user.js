import Post from './post'
import Collection from './collection'

// Notifications
// Historic
const User = `
  type User {
    id: ID!
    firstName: String
    lastName: String
    username: String
    sexe: String
    avatar: Avatar
    about: String
    place: String
    country: String
    website: String
    email: String
    language: String
    
    collections: [Collection]
    posts: [Post]
    
    nbFollowers: Int
    followedUsers:[User]
    followedCollections:[Collection]
    followedThemes:[Category]
  }

  type Avatar {
    url: String,
    height: Int,
    width: Int
  }
`

export default () => [User, Post]