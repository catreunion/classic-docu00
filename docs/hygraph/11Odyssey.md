---
sidebar_position: 12
---

# Apollo Tutorials

Catstronauts : A learning platform for adventurous cats (developers) who want to explore the universe (GraphQL)! 😺 🚀

Source : [Lift-off I: Basics](https://www.apollographql.com/tutorials/lift-off-part1/feature-overview-and-setup)

## Setup

```bash
git clone https://github.com/apollographql/odyssey-lift-off-part1
cd server
yarn
yarn add apollo-server graphql
yarn start
```

Open a new terminal.

```bash
cd client
yarn
yarn start
# go to http://localhost:3000/
```

## Defining the schema

Think of each object as a node and each relationship as an edge between two nodes.

A schema defines this **graph structure** in Schema Definition Language (SDL).

`gql` : Called a **tagged template literal** wrapping GraphQL strings with backticks

`type SpaceCat` : Declare an **object type** called SpaceCat in **PascalCase** with **curly brackets**.

`name: String!` : Declare a **field** called name in **camelCase** with a **colon** and **without commas**.

If a field should never be null, add an **exclamation mark** after its type.

`missions: [Mission]` : A space cat should have an **array** of missions indicated by **square brackets**

```js
const typeDefs = gql`
  type SpaceCat {
    name: String!
    age: Int
    missions: [Mission]
  }
`
```

A schema is like a contract between the server and the client. It defines what a GraphQL API can and can't do, and how clients can request or change data.

Writing strings (in **double quotes**) directly above types or fields as **descriptions**

```js title='server/src/schema.js'
const { gql } = require("apollo-server")

const typeDefs = gql`
  "a track is a group of Modules. Each of which about a specific topic"
  type Track {
    id: ID!
    title: String!
    author: Author!
    "will be shown in cards & details"
    thumbnail: String
    "approximate length to complete, in minutes"
    length: Int
    "number of modules this track contains"
    modulesCount: Int
  }

  "an author might create multiple tracks"
  type Author {
    id: ID!
    "author's first and last name"
    name: String!
    "url of author's profile picture"
    photo: String
  }

  type Query {
    "return a non-null list of non-null Tracks"
    tracksForHome: [Track!]!
    spaceCats: [SpaceCat]
  }

  type SpaceCat {
    id: ID!
    name: String!
    age: Int
    missions: [Mission]
  }

  type Mission {
    id: ID!
    name: String!
    description: String!
  }
`

module.exports = typeDefs
```

## Apollo Server and Apollo Explorer

Receive an incoming GraphQL query from our client
Validate that query against our newly created schema
Populate the queried schema fields with mocked data
Return the populated fields as a response

The Apollo Server library helps us implement this server quickly, painlessly, and in a production-ready way.

To create our server, we'll use the apollo-server package that we installed previously. From that package, we'll only need the named export ApolloServer, so we'll declare that constant between curly braces. Just below, we'll import our typeDefs from our schema.js file:

```js title='server/src/index.js'
const { ApolloServer } = require("apollo-server")
const typeDefs = require("./schema")
```

Next, we'll create an instance of the ApolloServer class and pass it our typeDefs in its options object:

Note: We're using shorthand property notation with implied keys, because we've named our constant with the matching key (typeDefs).

```js
const server = new ApolloServer({ typeDefs })
```

Finally, to start it up, we'll call the async listen method. When it resolves, it logs a nice little message letting us know that our server is indeed up and running:

```js
server.listen().then(() => {
  console.log(`
    🚀  Server is running!
    🔉  Listening on port 4000
    📭  Query at http://localhost:4000
  `)
})
```

Save your changes. From the terminal, we'll launch our server with npm run start (make sure you're in the server/ folder).

We get the log message and...not much else! We have a running server, but that's it. Floating in the vacuum of localhost space without access to any data, it's a sad and lonely server for now. 😿

Which of these are purposes of a GraphQL server?

Even though our server isn't connected to any data sources yet, it would be great to be able to send the server a test query and get a valid response. Fortunately, ApolloServer provides a way to do exactly that, using mocked data.

To enable basic mocked data, we could provide mocks:true to the ApolloServer constructor, like so:

```js
const server = new ApolloServer({
  typeDefs,
  mocks: true
})
```

This instructs Apollo Server to populate every queried schema field with a placeholder value (such as Hello World for String fields).

However, Hello World isn't a very realistic value for the title of a track or the URL of an author's picture! To serve mocked data that's closer to reality, we'll pass an object to the mocks property instead of just true. This object contains functions that provide the mocked data we want the server to return for each queried field.

Here's our mocks object:

```js
const mocks = {
  Track: () => ({
    id: () => "track_01",
    title: () => "Astro Kitty, Space Explorer",
    author: () => {
      return {
        name: "Grumpy Cat",
        photo: "https://res.cloudinary.com/dety84pbu/image/upload/v1606816219/kitty-veyron-sm_mctf3c.jpg"
      }
    },
    thumbnail: () => "https://res.cloudinary.com/dety84pbu/image/upload/v1598465568/nebula_cat_djkt9r.jpg",
    length: () => 1210,
    modulesCount: () => 6
  })
}
```

This object defines mock values for all of the fields of a Track object (including the Author object it contains). We pass this object to the ApolloServer constructor like so:

```js
const server = new ApolloServer({
  typeDefs,
  mocks
})
```

With mocks enabled, Apollo Server always returns exactly two entries for every list field.
To get more entries at a time, let's say 6, we'll add a Query.tracksForHome to our mocks object and return an Array of that given length like so: [...new Array(6)].

```js
const mocks = {
  Query: () => ({
    tracksForHome: () => [...new Array(6)]
  }),
  Track: () => ({
    id: () => "track_01",
    title: () => "Astro Kitty, Space Explorer",
    author: () => {
      return {
        name: "Grumpy Cat",
        photo: "https://res.cloudinary.com/dety84pbu/image/upload/v1606816219/kitty-veyron-sm_mctf3c.jpg"
      }
    },
    thumbnail: () => "https://res.cloudinary.com/dety84pbu/image/upload/v1598465568/nebula_cat_djkt9r.jpg",
    length: () => 1210,
    modulesCount: () => 6
  })
}
```

Which of these are true about querying Apollo Server without a connected data source?

Code Challenge!

Create a mock object with a type SpaceCat, an id of spacecat_01, and a title of 'spacecat pioneer'

```
const mocks = {
  // define your mock properties here
}
```

Now, with our server loaded with mocked data, how can we run a query on it to test if everything works as expected? In the next lesson, we'll use the Apollo Studio Explorer to build and run test queries seamlessly.

## Wording

In the directory of your choice with your preferred terminal, clone the app's starter repository:
