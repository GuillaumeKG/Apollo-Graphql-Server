import User from './user'

const Message = `
  type Message {
    id: ID!
    title: String!
    content: String
    author: User!
    recipients: [User]
    createDate: String
    receivedDate: String
    isNew: Boolean
  }

  type MailBox{
    new: Int!
    messages: [Message]
  }
`

// we export Author and all types it depends on
// in order to make sure we don't forget to include
// a dependency and we wrap it in a function
// to avoid strings deduplication
export default () => [Message]