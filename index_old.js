import  express from 'express'
import  bodyParser from 'body-parser'
import  { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import cors from 'cors'
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';

import schema from './schema/schema'


let PORT = 3000;
if (process.env.PORT) {
  PORT = parseInt(process.env.PORT, 10) + 100;
}
const WS_PORT = process.env.WS_PORT || 8080;


// Initialize the app
const app = express()

//app.use('*', cors({ origin: `http://localhost:${PORT}` }));
app.use(bodyParser.urlencoded({ extended: true }))

// The GraphQL endpoint
app.use('/graphql', 
        bodyParser.json(), 
        graphqlExpress(req => {

          return {
            schema: schema,
            // Accessible by any resolver as 3d argument. (Optional)
            // Can call a function as well (authentification for instance)
            // resolve: (?, args, {value}) => {}
            context: {
              value: req.body.something
            },
            // Custom error formatter (Optional)
            formatError: err => {
              if (err.originalError && err.originalError.error_message) {
                err.message = err.originalError.error_message;
              }
            
              return err.message;
            },
            //tracing: true, 
            // other options here
          }
        })
      )

// GraphiQL, a visual editor for queries
app.use('/graphiql', 
        graphiqlExpress({ 
          endpointURL: '/graphql',
          subscriptionsEndpoint: `ws://localhost:${WS_PORT}/subscriptions`
         }))

// Start the server
app.listen(PORT, () => {
  console.log('Go to http://localhost:3000/graphiql to run queries!')
})

/*******************************************************/
/*                  SUBSCRIPTION SERVER                */
/*******************************************************/


// WebSocket server for subscriptions
const websocketServer = createServer((request, response) => {
  response.writeHead(404);
  response.end();
})

websocketServer.listen(WS_PORT, () => console.log( 
  `Websocket Server is now running on http://localhost:${WS_PORT}`
))

const subscriptionServer = SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
  },
  {
    server: websocketServer,
    path: '/subscriptions',
  },
)