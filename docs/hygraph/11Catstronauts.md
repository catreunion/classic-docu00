---
sidebar_position: 12
---

# Apollo Tutorials - Defining a schema

Think of each object as a node and each relationship as an edge between two nodes. A schema defines this graph structure in Schema Definition Language (SDL). Schema is the single **source of truth** for your data.

[apollographql.com](apollographql.com) provides an amazing tutorial about the principle of schema

Source : [Lift-off I: Basics](https://www.apollographql.com/tutorials/lift-off-part1/feature-overview-and-setup)
by Raph Terrier

Catstronauts : A learning platform for adventurous cats (developers) who want to explore the universe (GraphQL)! 😺 🚀

## Setup

In the directory of your choice with your preferred terminal, clone the starter repository.

```bash
git clone https://github.com/apollographql/odyssey-lift-off-part1
cd server
yarn
yarn add apollo-server graphql
yarn start
# navigate to http://localhost:4000 in Firefox or Chrome
```

In a new terminal window, navigate to the repo's client directory.

```bash
cd client
yarn
yarn add graphql @apollo/client
yarn start
# navigate to http://localhost:3000 in any browser
```

## Defining the schema

Think of each object as a node and each relationship as an edge between two nodes.

A schema defines this **graph structure** in Schema Definition Language (SDL).

`gql` : Called a **tagged template literal** wrapping GraphQL strings with backticks.

`type SpaceCat` : Declare an **object type** called SpaceCat in **PascalCase** with **curly brackets**.

`name: String!` : Declare a **field** called name in **camelCase** with a **colon** and **without commas**.

If a field should never be null, add an **exclamation mark** after its type.

`missions: [Mission]` : A space cat should have an **array** of missions indicated by **square brackets**.

```js
const typeDefs = gql`
  type SpaceCat {
    id: ID!
    name: String!
    age: Int
    missions: [Mission]
  }
`
```

A schema is like a contract between the server and the client. It defines what a GraphQL API can and can't do, and how clients can request or change data.

The `Query` type contains the **entry points** to our schema. There are two other possible entry points: **Mutation** and **Subscription**

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

  "define all queries"
  type Query {
    "return a non-null list of non-null Tracks"
    tracksForHome: [Track!]!
    spaceCats: [SpaceCat]
  }
`

module.exports = typeDefs
```

## Apollo Server

Build a basic GraphQL endpoint that provides mocked responses.

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

## Apollo Sandbox Explorer

A special mode of Apollo Studio that lets you interactively build and test queries against the local GraphQL server.

```
query GetTracks {
  "use the existing query tracksForHome"
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

## Frontend

Creat client queries.

```js title='client/src/index.js'
import React from "react"
import ReactDOM from "react-dom"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import GlobalStyles from "./styles"
import Pages from "./pages"

// create an instance of the ApolloClient class
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
  // pages, containers and components can access the client via React Hooks
  <ApolloProvider client={client}>
    <GlobalStyles />
    <Pages />
  </ApolloProvider>,
  document.getElementById("root")
)
```

```js title='client/src/pages/tracks.js'
import React from "react"
import { useQuery, gql } from "@apollo/client"
import TrackCard from "../containers/track-card"
import { Layout, QueryResult } from "../components"

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

const Tracks = () => {
  // useQuery executes the query and then return an object from Apollo Client
  // destructure these properties from useQuery
  const { loading, error, data } = useQuery(TRACKS)

  // if (loading) return "Loading..."
  // if (error) return `Error! ${error.message}`

  return (
    <>
      {/* dump the raw data object with JSON.stringify to see what happens */}
      {/* <Layout grid>{JSON.stringify(data)}</Layout> */}

      <Layout grid>
        {/* properties returned from useQuery are used in a consistent, predictable way throughout all of a query's phases */}
        <QueryResult loading={loading} error={error} data={data}>
          {/* data includes a tracksForHome key which contains the array of tracks
           */}
          {data?.tracksForHome?.map((item, index) => (
            // pass each TrackCard a Track object as its prop
            <TrackCard key={item.id} track={item} />
          ))}
        </QueryResult>
      </Layout>
    </>
  )
}

export default Tracks
```

## Wording

In the directory of your choice with your preferred terminal, clone the app's starter repository:
