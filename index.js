import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import cors from 'cors'
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';

import schema from './schema/schema'


let PORT = 3000;
if (process.env.PORT) {
  PORT = parseInt(process.env.PORT, 10) + 100;
}
const CLIENT_PORT = 8080;

// Initialize the app
const app = express()

app.use('*', cors({ origin: `http://localhost:${CLIENT_PORT}` }));
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
        value: "contextValue"
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
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
  }))

// Wrap the Express server
const ws = createServer(app);

ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`)

  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer(
    {
      schema,
      execute,
      subscribe
    },
    {
      server: ws,
      path: '/subscriptions',
    }
  );
})
