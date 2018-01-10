
# Modeling

Type

String
ID
Int
Boolean
Float

scalar DATE

const resolverFunctions = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
        return new Date(value); // value from the client
        },
        serialize(value) {
        return value.getTime(); // value sent to the client
        },
        parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return parseInt(ast.value, 10); // ast value is always in string format
        }
        return null;
        },
    }),
    AllowedColor: {
        RED: '#f00',
        GREEN: '#0f0',
        BLUE: '#00f',
    }
}

--------------------------------

enum Language = {
    FRENCH
    ENGLISH
    GERMAN
    ITALIAN
}

interface Post {
    id: ID!
    title: String!
    description(lang: Language = FRENCH): String
    createDate: String
    publishedDate: String
}

type ImgPost extends Post {
  /* Redefine all fields in interface*/
  imgUrl: String!
  
}

// Used for mutation parameters
input PostInput {
    ...
}


// only type can be used, no interface or other unions
union SearchResult = Post | Image | Book

// Metafields
__typename
__schema
__type
__typeKind
__field
__inputValue
__EnumValue
__Directive



#Query

query mailStakejolder ($senderId: ID, $recipientId: ID = 12, $isDetailed:Boolean = false){
  sender: user(id: $senderId) {
    ...basicFields
    ...detailedFields @include(if:$isDetailed)
  }

  recipient: user(id: $recipientId) {
    ...basicFields
    ...detailedFields @skip(if:$isDetailed)
  }
}

fragment basicFields on User {
  name
  email
}

fragment detailedFields on User {
  nickname
  biopic
}

// In case of interface or union
query PostList() {
  posts() {
    name
    ... on ImgPost {
      imgUrl
    }
    ... on BlogPost {
      text
    }
  }
}


# Mutation









# Resolver

Query: {
  user(parent, args, context) {
    return context.db.loadUserByID(args.id).then(
      userData => new User(userData)
    )
  }
}