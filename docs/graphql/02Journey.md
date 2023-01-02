---
sidebar_position: 2
---

# Fundamental of GraphQL

## A GraphQL.js script

Running a GraphQL query on command line tool. [Getting started with GraphQL.js](https://graphql.org/graphql-js/)

```bash title="setup for running a GraphQL.js script"
# create a new directory and move into it
mkdir m1 && cd m1

# initialize a new Node.js project
yarn init -y

# install GraphQL.js
yarn add graphql
# or : yarn add graphql --save

# create a JavaScript file
touch hello.js
```

The following code shows ES6 features like [Promises](https://web.dev/learn/), classes, and [fat arrow functions](https://strongloop.com/strongblog/an-introduction-to-javascript-es6-arrow-functions/).

```js title="hello.js"
var { buildSchema, graphql } = require("graphql")

var schema = buildSchema(`
  type Query {
    hello: String
  }
`)
var source = "{ hello }"
// `rootValue` provides a resolver function that just returns “Hello world!”
var rootValue = { hello: () => "Hello world!" }

// run the GraphQL query '{ hello }'
graphql({ schema, source, rootValue }).then((response) => {
  console.log(response)
})
```

```bash title="running the GraphQL.js script"
# execute the GraphQL query in hello.js
node hello.js

# the GraphQL response printed out
{ data: [Object: null prototype] { hello: 'Hello world!' } }
```

## Express GraphQL Server

Running a GraphQL query over HTTP. [Getting started Express GraphQL Server](https://graphql.org/graphql-js/running-an-express-graphql-server/)

```bash title="setup for running an Express webserver"
# create a new directory and move into it
mkdir m2 && cd m2

# initialize a new Node.js project
yarn init -y

# install dependencies
yarn add express express-graphql graphql

# create a JavaScript file
touch server.js
```

```js title="server.js"
var { buildSchema } = require("graphql")
var { graphqlHTTP } = require("express-graphql")
var express = require("express")

var schema = buildSchema(`
  type Query {
    hello: String
  }
`)
var rootValue = { hello: () => "Hello world!" }
var app = express()

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: rootValue,
    graphiql: true
  })
)
app.listen(4000, () => console.log("Now browse to localhost:4000/graphql"))
```

```bash title="starting the Express webserver"
# start the Express GraphQL server
node server.js

# the response printed out
Now browse to localhost:4000/graphql

# go to http://localhost:4000/graphql with a web browser
```

## Apollo Server

Apollo Server has a built in standalone HTTP server and middleware for Express, and has an framework integration API that supports all Node.js HTTP server frameworks and serverless environments via community integrations.

Apollo Server has a plugin API, integration with Apollo Studio, and performance and security features such as caching, automatic persisted queries, and CSRF prevention.

[Apollo Server 4](https://www.apollographql.com/docs/apollo-server/)

```bash title="setup for running an Apollo Server"
# create a new directory and move into it
mkdir m3 && cd m3

# initialize a new Node.js project
yarn init -y

# install dependencies
yarn add @apollo/server graphql

# create a JavaScript file
touch server.js

# start the Apollo Server
node server.js

# response from the Apollo Server
🚀  Server ready at: http://localhost:4000/

# go to http://localhost:4000 with a web browser
```

```graphql title="returning all books"
query GetBook {
  books {
    title
  }
}
```

An illustration by [Apollo](https://www.apollographql.com/docs/apollo-server) showing Apollo Server bridging frontend and backend.

![showing Apollo Server bridging frontend and backend](https://www.apollographql.com/docs/c5e2d4db4b0b5568a87ebf082ffe79e6/frontend_backend_diagram.svg)

Straightforward setup, so your client developers can start fetching data quickly

Incremental adoption, enabling you to add features as they're needed

Universal compatibility with any data source, any build tool, and any GraphQL client

Production readiness, enabling you to confidently run your graph in production

Obtain a basic understanding of GraphQL principles

Define a GraphQL schema that represents the structure of your data set

Run an instance of Apollo Server that lets you execute queries against your schema

This tutorial assumes that you are familiar with the command line and JavaScript and have installed a recent Node.js (v14.16.0+) version. Additionally, for those interested, this tutorial includes an optional section describing how to set up Apollo Server with TypeScript.

graphql (also known as graphql-js) is the library that implements the core GraphQL parsing and execution algorithms.

@apollo/server is the main library for Apollo Server itself. Apollo Server knows how to turn HTTP requests and responses into GraphQL operations and run them in an extensible context with support for plugins and other features.

Step 3: Define your GraphQL schema

Every GraphQL server (including Apollo Server) uses a schema to define the structure of data that clients can query. In this example, we'll create a server for querying a collection of books by title and author.

```js title="index.js"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin"
  },
  {
    title: "City of Glass",
    author: "Paul Auster"
  }
]

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books
  }
}

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers
})

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`🚀  Server ready at: ${url}`)
```

Adding #graphql to the beginning of a template literal provides GraphQL syntax highlighting in supporting IDEs.

This snippet defines a simple, valid GraphQL schema. Clients will be able to execute a query named books, and our server will return an array of zero or more Books.

Step 4: Define your data set

define the structure of our data, we can define the data itself.

Apollo Server can fetch data from any source you connect to (including a database, a REST API, a static object storage service, or even another GraphQL server). For the purposes of this tutorial, we'll hardcode our example data.

Add the following to the bottom of your index.ts file:

Step 5: Define a resolver

Resolvers tell Apollo Server how to fetch the data associated with a particular type.

index.js

```js title=""
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books
  }
}
```

Step 6: Create an instance of ApolloServer
defined our schema, data set, and resolver
provide this information to Apollo Server when we initialize it.

index.js

```js title=""
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers
})

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`🚀  Server ready at: ${url}`)
```

Apollo Server's standalone web server. If you'd like to integrate Apollo Server with your favorite web framework such as Express, see our web framework integrations.

```bash title="in  the project's root directory"
# Start the server
npm start
```

You should now see the following output at the bottom of your terminal:

🚀 Server ready at: http://localhost:4000/
We're up and running!

Step 8: Execute your first query

execute GraphQL queries on our server with Apollo Sandbox

Visit http://localhost:4000 in your browser, which will open the Apollo Sandbox:

Apollo Sandbox
The Sandbox UI includes:

An Operations panel for writing and executing queries (in the middle)
A Response panel for viewing query results (on the right)
Tabs for schema exploration, search, and settings (on the left)
A URL bar for connecting to other GraphQL servers (in the upper left)
Our server supports a single query named books. Let's execute it!

Here's a GraphQL query string for executing the books query:

```graphql title=""
query GetBooks {
  books {
    title
    author
  }
}
```

Paste this string into the Operations panel and click the blue button in the upper right. The results (from our hardcoded data set) appear in the Response panel:

Sandbox response panel
Note: If Apollo Sandbox can't find your schema, ensure you have introspection enabled by passing introspection: true to the ApolloServer constructor. We recommend disabling introspection when using Apollo Server in a production environment.

One of the most important concepts of GraphQL is that clients can choose to query only for the fields they need. Delete author from the query string and execute it again. The response updates to include only the title field for each book!

Complete example
You can view and fork the complete example on Code Sandbox:

Edit server-getting-started
Next steps
This example application is a great starting point for working with Apollo Server. Check out the following resources to learn more about the basics of schemas, resolvers, and generating types:

Schema basics
Resolvers
Generating TS types for your schema
Want to learn how to modularize and scale a GraphQL API? Check out the Apollo Federation Docs to learn how a federated architecture can create a unified supergraph that combines multiple GraphQL APIs.

If you want to use Apollo Server with a specific web framework, see our list of integrations. If we don't have an Apollo Server integration for your favorite framework, you can help our community by building one!

©

mongoose [Mongoose v6.8.2: Getting Started](https://mongoosejs.com/docs/)

SPONSOR #native_company# — #native_desc#

First be sure you have MongoDB and Node.js installed.

```bash
npm install mongoose --save
```

Now say we like fuzzy kittens and want to record every kitten we ever meet in MongoDB. The first thing we need to do is include mongoose in our project and open a connection to the test database on our locally running instance of MongoDB.

// getting-started.js

```js
const mongoose = require("mongoose")

main().catch((err) => console.log(err))

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test")

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
```

For brevity, let's assume that all following code is within the main() function.

With Mongoose, everything is derived from a Schema. Let's get a reference to it and define our kittens.

```js
const kittySchema = new mongoose.Schema({
  name: String
})
```

So far so good. We've got a schema with one property, name, which will be a String. The next step is compiling our schema into a Model.

```js
const Kitten = mongoose.model("Kitten", kittySchema)
```

A model is a class with which we construct documents. In this case, each document will be a kitten with properties and behaviors as declared in our schema. Let's create a kitten document representing the little guy we just met on the sidewalk outside:

```js
const silence = new Kitten({ name: "Silence" })
console.log(silence.name) // 'Silence'
```

Kittens can meow, so let's take a look at how to add "speak" functionality to our documents:

```js
// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function speak() {
  const greeting = this.name ? "Meow name is " + this.name : "I don't have a name"
  console.log(greeting)
}

const Kitten = mongoose.model("Kitten", kittySchema)
```

Functions added to the methods property of a schema get compiled into the Model prototype and exposed on each document instance:

```js
const fluffy = new Kitten({ name: "fluffy" })
fluffy.speak() // "Meow name is fluffy"
```

We have talking kittens! But we still haven't saved anything to MongoDB. Each document can be saved to the database by calling its save method. The first argument to the callback will be an error if any occurred.

```js
await fluffy.save()
fluffy.speak()
```

Say time goes by and we want to display all the kittens we've seen. We can access all of the kitten documents through our Kitten model.

```js
const kittens = await Kitten.find()
console.log(kittens)
```

We just logged all of the kittens in our db to the console. If we want to filter our kittens by name, Mongoose supports MongoDBs rich querying syntax.

```js
await Kitten.find({ name: /^fluff/ })
```

This performs a search for all documents with a name property that begins with "fluff" and returns the result as an array of kittens to the callback.

Congratulations
That's the end of our quick start. We created a schema, added a custom document method, saved and queried kittens in MongoDB using Mongoose. Head over to the guide, or API docs for more.

---

A query language for your API
GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

Ask for what you need, get exactly that

Send a GraphQL query to your API and get exactly what you need, nothing more and nothing less. GraphQL queries always return predictable results. Apps using GraphQL are fast and stable because they control the data they get, not the server.

```
{
  hero {
    name
    height
    mas
  }
}
{
  "hero": {
      "name": "Luke Skywalker",
      "height": 1.72
  }
}
```

Get many resources in a single request
GraphQL queries access not just the properties of one resource but also smoothly follow references between them. While typical REST APIs require loading from multiple URLs, GraphQL APIs get all the data your app needs in a single request. Apps using GraphQL can be quick even on slow mobile network connections.

```
{
    hero {
    name
    friends {
        name
        }
    }
}
{
    "hero": {
      "name": "Luke Skywalker",
      "friends": [
        { "name": "Obi-Wan Kenobi" },
        { "name": "R2-D2" },
        { "name": "Han Solo" },
        { "name": "Leia Organa" }
      ]
    }
}
```

Describe what’s possible with a type system
GraphQL APIs are organized in terms of types and fields, not endpoints. Access the full capabilities of your data from a single endpoint. GraphQL uses types to ensure Apps only ask for what’s possible and provide clear and helpful errors. Apps can use types to avoid writing manual parsing code.

```
{
  hero {
    name
    friends {
      name
      homeWorld {
        name
        climate
      }
      species {
        name
        lifespan
        origin {
          name
        }
      }
    }
  }
}

type Query {
  hero: Character
}

type Character {
  name: String
  friends: [Character]
  homeWorld: Planet
  species: Species
}

type Planet {
  name: String
  climate: String
}

type Species {
  name: String
  lifespan: Int
  origin: Planet
}
```

Move faster with powerful developer tools
Know exactly what data you can request from your API without leaving your editor, highlight potential issues before sending a query, and take advantage of improved code intelligence.

Evolve your API without versions

Add new fields and types to your GraphQL API without impacting existing queries. Aging fields can be deprecated and hidden from tools. By using a single evolving version, GraphQL APIs give apps continuous access to new features and encourage cleaner, more maintainable server code.

```
type Film {
  title: String
  episode: Int
  releaseDate: String
}

type Film {
  title: String
  episode: Int
  releaseDate: String
  openingCrawl: String
}

type Film {
  title: String
  episode: Int
  releaseDate: String
  openingCrawl: String
  director: String
}

type Film {
  title: String
  episode: Int
  releaseDate: String
  openingCrawl: String
  director: String
  directedBy: Person
}

type Person {
  name: String
  directed: [Film]
  actedIn: [Film]
}

type Film {
  title: String
  episode: Int
  releaseDate: String
  openingCrawl: String
  director: String @deprecated
  directedBy: Person
}
```

Bring your own data and code
GraphQL creates a uniform API across your entire application without being limited by a specific storage engine. Write GraphQL APIs that leverage your existing data and code with GraphQL engines available in many languages. You provide functions for each field in the type system, and GraphQL calls them with optimal concurrency.

```
type Character {
    name: String
    homeWorld: Planet
    friends: [Character]
}

// type Character {
class Character {
    // name: String
    getName() {
        return this._name
    }

    // homeWorld: Planet
    getHomeWorld() {
        return fetchHomeworld(this._homeworldID)
    }

    // friends: [Character]
    getFriends() {
        return this._friendIDs.map(fetchCharacter)
    }
}
# type Character {
class Character:
    # name: String
    def name(self):
        return self._name

    # homeWorld: Planet
    def homeWorld(self):
        return fetchHomeworld(self._homeworldID)

    # friends: [Character]
    def friends(self):
        return map(fetchCharacter, self._friendIDs)


// type Character {
public class Character {
  // name: String
  public String Name { get; }

  // homeWorld: Planet
  public async Task<Planet> GetHomeWorldAsync() {
    return await FetchHomeworldAsync(_HomeworldID);
  }

  // friends: [Character]
  public async IEnumerable<Task<Character>> GetFriendsAsync() {
    return _FriendIDs.Select(FetchCharacterAsync);
  }
}
```
