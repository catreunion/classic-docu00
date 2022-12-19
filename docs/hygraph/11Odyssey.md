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

## Apollo Server

```js title='server/src/index.js'
const { ApolloServer } = require("apollo-server")
const typeDefs = require("./schema")
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
  }),
  SpaceCat: () => ({
    id: () => "spacecat_01",
    title: () => "spacecat pioneer"
  })
}

// create an instance of the ApolloServer class
// const server = new ApolloServer({ typeDefs, mocks: true })
const server = new ApolloServer({ typeDefs, mocks })

server.listen().then(() => {
  console.log(`
    🚀  Server is running!
    🔉  Listening on port 4000
    📭  Query at http://localhost:4000
  `)
})
```

## Apollo Explorer

Apollo Sandbox : A special mode of Apollo Studio that lets you test your local graph changes before deploying them.
http://localhost:4000

```
query GetTracks {
  tracksForHome {
    id
    title
    thumbnail
    length
    modulesCount
    author {
      id
      name
      photo
    }
  }
}
```

```bash
yarn add graphql @apollo/client
```

```js
import React from "react"
import ReactDOM from "react-dom"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import GlobalStyles from "./styles"
import Pages from "./pages"

// create a new client instance
const client = new ApolloClient({
  // specify the location of our GraphQL server
  uri: "http://localhost:4000",
  // provide an InMemoryCache instance in the cache option
  // store and reuse query results
  cache: new InMemoryCache()
})

ReactDOM.render(
  // pass the Apollo Client instance as a prop
  // make it available throughout the component tree with React's Context API
  // pages, containers, and components can access the client via React Hooks
  <ApolloProvider client={client}>
    <GlobalStyles />
    <Pages />
  </ApolloProvider>,
  document.getElementById("root")
)
```

creat client queries

design the first query that our client will execute. Specifically, we'll design the query that our tracks page will use to display its card grid.

The code for our tracks page lives in

```js title='src/pages/tracks.js'
import { gql } from "@apollo/client"

// wrap all GraphQL strings in the gql template literal
const TRACKS = gql`
  query GetTracks {
    tracksForHome {
      id
      title
      thumbnail
      length
      modulesCount
      author {
        name
        photo
      }
    }
  }
`

const SPACECATS = gql`
  query ListSpaceCats {
    spaceCats {
      name
      age
      missions {
        name
        description
      }
    }
  }
`
```

Create a ListSpaceCats query with a spaceCats query field and its name, age and missions selection set in that order. For the missions field, select name and description

Executing with useQuery

The useQuery hook is the primary API for executing queries in a React application. We run a query within a React component by calling useQuery and passing it our GraphQL query string. This makes running queries from React components a breeze.

When our component renders, useQuery returns an object from Apollo Client that contains loading, error, and data properties that we can use to render our UI. Let's put all of that into code.

```js title='src/pages/tracks.js'
import { useQuery, gql } from "@apollo/client"

const Tracks = () => {
  const { loading, error, data } = useQuery(TRACKS)

  if (loading) return "Loading..."
  if (error) return `Error! ${error.message}`

  return <Layout grid>{JSON.stringify(data)}</Layout>
}
```

Now, in our Tracks functional component (below the opened curly brace), we'll declare three destructured constants from our useQuery hook

just dump our raw data object with JSON.stringify to see what happens.

```js
// consider the SPACECATS query:
const SPACECATS = gql`
  query ListSpaceCats {
    spaceCats{
      name
      age
      missions {
        name
        description
      }
```

tracksForHome object (the name of our operation)

The component takes a track prop and uses its title, thumbnail, author, length, and modulesCount. So, we just need to pass each TrackCard a Track object from our query response.

Let's head back to src/pages/tracks.js. We've seen that the server response to our TRACKS GraphQL query includes a tracksForHome key, which contains the array of tracks.

To create one card per track, we'll map through the tracksForHome array and return a TrackCard component with its corresponding track data as its prop:

We refresh our browser, and voila! We get a bunch of nice-looking cards with cool catstronaut thumbnails. Our track title, length, number of modules, and author information all display nicely thanks to our TrackCard component. Pretty neat!

The UI of our Catstronauts app, displaying a number of track cards
Note: You might see a warning in the browser console saying something like, "Encountered two children with the same key, track_01." This is happening because we're still mocking our track data, so every track has the same id, but React wants each key to be unique. This warning will go away after we update our server to use real track data (in Lift-off II), so we can safely ignore it for now.

Wrapping query results

While refreshing the browser, you might have noticed that because we return the loading message as a simple string, we don't currently show the component's entire layout and navbar (the same issue goes for the error message). We should make sure that our UI's behavior is consistent throughout all of a query's phases.

That's where our QueryResult helper component comes in. This isn't a component that's provided directly by an Apollo library. We've added it to use query results in a consistent, predictable way throughout our app.

Let's open components/query-result. This component takes the useQuery hook's return values as props. It then performs basic conditional logic to either render a spinner, an error message, or its children:

We can now remove the lines in this file that handle the loading and error states, because the QueryResult component will handle them instead.

Apollo Server : Build a basic GraphQL endpoint that provides mocked responses.

Apollo Sandbox Explorer : Interactively build and test queries against the local GraphQL server.

Connect our app to live data using a REST data source and write our first resolvers to provide that data to clients.

## Wording

In the directory of your choice with your preferred terminal, clone the app's starter repository:
