---
sidebar_position: 1
---

# Catstronauts

A learning platform for adventurous cats who want to explore the universe! 😺 🚀 Created by [Apollo Odyssey tutorials](https://www.apollographql.com/tutorials/), a series of amazing and helpful tutorials about GraphQL. Thank you the creation team!! 🙏🏻

## What data do we need?

1. Think of our app's data as a collection of objects (**nodes**) and relationships (**edges**) between objects.

2. Think of our entire data model as a graph of nodes and edges.

3. Define this graph structure using a schema.

A very helpful illustration by [Apollo Odyssey tutorials](https://www.apollographql.com/tutorials/voyage-part1/intro-to-federation) - Identifying the pieces of data for each card

![Identifying the pieces of data for each card](https://res.cloudinary.com/apollographql/image/upload/e_sharpen:50,c_scale,q_90,w_1440,fl_progressive/v1612409160/odyssey/lift-off-part1/LO_02_v2.00_04_53_09.Still002_g8xow6_bbgabz.jpg)

## Setup

In the directory of your choice with your preferred terminal, clone one of the [Apollo Odyssey tutorials](https://www.apollographql.com/tutorials/voyage-part1/intro-to-federation) repositories that suits your level.

```bash title="repos from Apollo Odyssey tutorials"
git clone https://github.com/apollographql/odyssey-lift-off-part1
# or
git clone https://github.com/apollographql/odyssey-lift-off-part2
# or
git clone https://github.com/apollographql/odyssey-lift-off-part3
# or
git clone https://github.com/apollographql/odyssey-lift-off-part4

# navigate to the server directory
cd odyssey-lift-off-part1/server

# install
yarn
yarn add apollo-server graphql
yarn add apollo-datasource-rest

# start up the server
yarn start

# navigate to http://localhost:4000 in Firefox or Chrome
```

```bash title="in a new terminal window"
# navigate to the client directory
cd odyssey-lift-off-part1/client

# install
yarn
yarn add graphql @apollo/client

# start up the client
yarn start

# navigate to http://localhost:3000 in any web browser
```

## Schema Definition Language (SDL)

At its heart, a schema is a collection of **object types** that **contain fields**. A schema is like a contract between the server and the client. It defines what a GraphQL API can and can't do, and how clients can request or change data.

The **fields** of Query object type are the **entry points** into the schema. They are the **top-level** fields that clients can query for. Two other possible entry points : **Mutation** and **Subscription**

We structure our schema to provide that data as intuitively as possible.

Open the repository in your favorite IDE.

```js title="server/src/schema.js"
// declare a typeDefs (short for "type definitions") constant
// wrap GraphQL strings with the gql tag (template literal)
// convert/parse GraphQL strings into the format that Apollo libraries expect
// use backticks (`), don't confused with single quotes (')
// declare an object type called SpaceCat in PascalCase with curly brackets
// declare a field called name in camelCase with a colon and without commas
// if a field should never be null (non-nullable), add an exclamation mark after its type
// declare a field called missions which is an array of missions indicated by square brackets
// descriptions are strings wrapped with double quotes

const typeDefs = gql`
  type SpaceCat {
    id: ID!
    name: String!
    age: Int
    missions: [Mission]
  }

  type Mission {
    id: ID!
    codename: String!
    to: String!
    scheduled: Boolean!
    crewMembers: [SpaceCat]!
  }

  type Query {
    spaceCats: [SpaceCat]
  }
`
```

## Sending a query in Apollo Sandbox

Sandbox is a special mode of Apollo Studio for testing the **local server** before deploying the graph to Schema Registry.

```graphql title="running a client query in Apollo Sandbox"
<!-- start up the local Apollo server -->
<!-- navigate to http://localhost:4000 in Firefox or Chrome -->

query getTracksForHome {
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

## Journey of a query operation

1. Our web app (GraphQL client) sends a GraphQL query operation, formatted as a string in HTTP POST or GET request, to the remote GraphQL server.

2. The server **parses** and **transforms** the string into a tree-structured document called an Abstract Syntax Tree (AST).

3. The server **validates** the query operation against the **types** and **fields** defined in our **schema**.

4. For **each field** in the query, the server invokes that field's **resolver function** to populate data from the correct source.

5. As all of the query's fields are resolved, the **data is assembled / stitched into a nicely ordered JSON object** with the **exact same shape as the query**.

6. The server assigns the JSON object to the **data key** of the HTTP response body, and send it back to our web app.

7. The GraphQL client receives the response and then passes the data to the right components for rendering.

A very helpful illustration by [Apollo Odyssey tutorials](https://www.apollographql.com/tutorials/voyage-part1/intro-to-federation) - Journey of a GraphQL query operation

![An amazing illustration by apollographql.com](https://res.cloudinary.com/apollographql/image/upload/e_sharpen:50,c_scale,q_90,w_1440,fl_progressive/v1617351987/odyssey/lift-off-part2/lop2-1-06_enfbis.jpg)

## Data fetching

### Where is our data stored?

[the Catstronauts REST API](https://odyssey-lift-off-rest-api.herokuapp.com/)

```text title="6 endpoints"
GET   /tracks
GET   /track/:id
GET   /author/:id
GET   /track/:id/modules
PATCH /track/:id
GET   /module/:id
```

A very helpful illustration by [Apollo Odyssey tutorials](https://www.apollographql.com/tutorials/voyage-part1/intro-to-federation) - A GraphQL server retrieving data from data sources such as a database, REST API and a web hook

![A GraphQL server retrieving data from data sources such as a database, REST API and a web hook](https://res.cloudinary.com/apollographql/image/upload/e_sharpen:50,c_scale,q_90,w_1440,fl_progressive/v1612408870/odyssey/lift-off-part2/lop2-2-01_actpy7.jpg)

### How is our data structured?

A GraphQL query operation is often composed of a mix of different fields and types, coming from different endpoints, with different cache policies.

```graphql title="a client query operation"
<!-- start up the local Apollo server -->
<!-- navigate to http://localhost:4000 in Firefox or Chrome -->
query getTracksForHome {
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

Is that structure different from our client app's needs and schema?

```json title="result of fetching all tracks"
[
  {
    "id": "c_0",
    "thumbnail": "https://res.cloudinary.com/dety84pbu/image/upload/v1598465568/nebula_cat_djkt9r.jpg",
    "topic": "Cat-stronomy",
    "authorId": "cat-1",
    "title": "Cat-stronomy, an introduction",
    "description": "Curious to learn what Cat-stronomy is all about? Explore the planetary and celestial alignments and how they have affected our space missions.",
    "numberOfViews": 0,
    "createdAt": "2018-09-10T07:13:53.020Z",
    "length": 2377,
    "modulesCount": 10,
    "modules": ["l_0", "l_1", "l_2", "l_3", "l_4", "l_5", "l_6", "l_7", "l_8", "l_9"]
  },
  {...},
]
```

`author` is missing.

### The N+1 problem

"1" : the call to fetch the top-level tracks field.

"N" : the number of subsequent calls to fetch the author subfield for each track.

Making N calls to the exact same endpoint to fetch the exact same data is very inefficient, especially if N is a large number.

```graphql title="the N+1 problem"
{
  tracks {
    # 1
    title
    author {
      # N calls for N tracks
      name
    }
  }
}
```

### The `RESTDataSource` class

How to retrieve and transform the data that we need to match the fields in our schema?

cache : avoid unnecessary calls to our REST API.

Resource caching prevents unneccessary API calls for data that doesn't change frequently.

```js title="server/src/datasources/spacecats-api.js"
const { RESTDataSource } = require("apollo-datasource-rest")

// declare a class called `SpaceCatsAPI` that extends the RESTDataSource class
class SpaceCatsAPI extends RESTDataSource {
  // constructor method
  constructor() {
    super()
    this.baseURL = "https://fake-spacecats-rest-api.cat/"
  }

  // define the following helper methods that make API calls efficient

  getSpaceCats() {
    // perform a GET request to the `spacecats` endpoint
    return this.get("spacecats")
  }

  // take `catId` as an argument
  getMissions(catId) {
    // string interpolation
    return this.get(`spacecats/${catId}/missions`)
  }
}

module.exports = SpaceCatsAPI
```

### Resolver Functions

A resolver, having 4 parameters, is a function populating the data for a field in your schema. It must has the same name as the field that it populates the data for.

`parent` : Contain the **data** returned from the **previous** function in a **resolver chain**.

`args` : Contain all the **arguments** provided to the field for querying a specific item.

`context` : Used to access the helper methods defined in `RESTDataSource` or to access authentication info.

`info` : Contain informational properties about the operation's execution state.

Their **keys** correspond to the **object types** in schema.

```js title="server/src/resolvers.js"
// declare an object
// the keys correspond to the object types in the schema
const resolvers = {
  // known as the `Query` key
  Query: {
    // x: (parent, args, context, info) => {},

    // known as the `spaceCats` key
    // define the resolver function for the `spaceCats` field
    // destructure `context` to access its child object `dataSources`
    spaceCats: (_, __, { dataSources }) => {
      // spaceCatsAPI : an instance of the SpaceCatsAPI class
      return dataSources.spaceCatsAPI.getSpaceCats()
    },
    spaceCat: (_, { id }, { dataSources }) => {
      return dataSources.spaceCatsAPI.getSpaceCat(id)
    }

  }
  SpaceCat: {
    // Query.spaceCats resolver passes data to SpaceCat.missions resolver as a parent parameter
    // these two resolvers form a resolver chain
    // destructure `parent` to access its child object `catId`
    // SpaceCat.missions resolver will only be called when the query asks for that specific SpaceCat
    // prevent unnecessary REST API calls when a query doesn't ask for other SpaceCat
    // keep each resolver lightweight and responsible for specific pieces of data
    missions: ({ catId }, _, { dataSources }) => {
      return dataSources.spaceCatsAPI.getMissions(catId)
    }
  }
}
```

Keep resolver functions as thin as possible.

1. Make your API more resilient to future changes.

2. Can safely refactor your data fetching code, or change the source entirely from a REST API to a database, without breaking your API.

3. Keep your resolvers readable and easier to understand, which comes in handy as you define more and more of them!

## Argument

### Local Catstronauts

```bash title="opening Apollo Sandbox"
# navigate to the server directory
cd server/

# start up the server
yarn start

# navigate to http://localhost:4000 in Firefox or Chrome
```

```graphql title="query for a specific track"
query GetTrack($trackId: ID!) {
  track(id: $trackId) {
    id
    title
    author {
      id
      name
      photo
    }
    thumbnail
    length
    modulesCount
    numberOfViews
    modules {
      id
      title
      length
    }
    description
  }
}
```

```bash title="input a track id"
{
  "trackId": "c_0"
}
```

### Isaac's outdoor blog

```bash title="opening Apollo Sandbox"
# open an existing Sandbox
# change the sandbox address to
# https://api-us-east-1.hygraph.com/v2/clbq4ju4z13gl01uuf7xi0ulm/master
```

```graphql title="query for all activities"
query getActivities {
  activities {
    id
    title
    calories
    desc {
      text
    }
  }
}
```

```graphql title="query for a specific activity"
query getActivity {
  activity(where: { slug: "2022-dec-15-kowloon-peak-running" }) {
    title
    activityDate
    avgHr
    avgPace
    calories
    hours
    id
    maxHr
    mins
    secs
    totalAscent
    totalDescent
    desc {
      text
    }
  }
}
```

## Schema, `RESTDataSource` & Resolvers

```js title="server/src/schema.js"
const typeDefs = gql`
  type Track {
    id: ID!
    title: String!
    author: Author!
    thumbnail: String
    length: Int
    modulesCount: Int
    description: String
    numberOfViews: Int
    modules: [Module!]!
  }

  type Author {
    id: ID!
    name: String!
    photo: String
  }

  type Module {
    id: ID!
    title: String!
    length: Int
    content: String
    videoUrl: String
  }

  "Queries on the server are the entry points into the schema. They are the top-level fields that clients can query for."
  type Query {
    tracksForHome: [Track!]!
    "Query for a specific track provided with the track's ID."
    track(id: ID!): Track!
    "Query for a specific module provided with the module's ID"
    module(id: ID!): Module!
  }
`
```

```json title="result of fetching all tracks"
[
  {
    "id": "c_0",
    "thumbnail": "https://res.cloudinary.com/dety84pbu/image/upload/v1598465568/nebula_cat_djkt9r.jpg",
    "topic": "Cat-stronomy",
    "authorId": "cat-1",
    "title": "Cat-stronomy, an introduction",
    "description": "Curious to learn what Cat-stronomy is all about? Explore the planetary and celestial alignments and how they have affected our space missions.",
    "numberOfViews": 0,
    "createdAt": "2018-09-10T07:13:53.020Z",
    "length": 2377,
    "modulesCount": 10,
    "modules": ["l_0", "l_1", "l_2", "l_3", "l_4", "l_5", "l_6", "l_7", "l_8", "l_9"]
  },
  {...},
]
```

```json title="result of fetching author cat-1 "
{
  "id": "cat-1",
  "name": "Henri, le Chat Noir",
  "photo": "https://images.unsplash.com/photo-1442291928580-fb5d0856a8f1?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjExNzA0OH0"
}
```

```graphql title="running a client query in Apollo Sandbox"
<!-- start up the local Apollo server -->
<!-- navigate to http://localhost:4000 in Firefox or Chrome -->
query getTracksForHome {
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

```text title="6 endpoints"
GET   /tracks
GET   /track/:id
GET   /author/:id
GET   /track/:id/modules
PATCH /track/:id
GET   /module/:id
```

```js title="server/src/datasources/track-api.js"
class TrackAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = "https://odyssey-lift-off-rest-api.herokuapp.com/"
  }
  getTracksForHome() {
    return this.get("tracks")
  }
  getTrack(id) {
    return this.get(`track/${id}`)
  }
  getAuthor(authorId) {
    return this.get(`author/${authorId}`)
  }
  getTrackModules(id) {
    return this.get(`track/${id}/modules`)
  }
  incrementTrackViews(trackId) {
    return this.patch(`track/${trackId}/numberOfViews`)
  }
}
```

```js title="server/src/resolvers.js"
const resolvers = {
  Query: {
    tracksForHome: (_, __, { dataSources }) => {
      return dataSources.trackAPI.getTracksForHome()
    },
    track: (_, { id }, { dataSources }) => {
      return dataSources.trackAPI.getTrack(id)
    }
  },
  Track: {
    author: ({ authorId }, _, { dataSources }) => {
      return dataSources.trackAPI.getAuthor(authorId)
    },
    modules: ({ id }, _, { dataSources }) => {
      return dataSources.trackAPI.getTrackModules(id)
    }
  }
}
```

```js title="server/src/index.js"
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      trackAPI: new TrackAPI()
    }
  }
})
```

##

## wording

Things never go smoothly in the real world.

underlined by a red squiggly line

help to narrow down what caused the issues.

There are more than a few ways things can go south.

red squiggly

The key to happiness must be found somewhere else.

```js title="if using fetch"
const resolvers = {
  Query: {
    tracksForHomeFetch: async () => {
      const baseUrl = "https://odyssey-lift-off-rest-api.herokuapp.com"
      const res = await fetch(`${baseUrl}/tracks`)
      return res.json()
    }
  },
  Track: {
    // using fetch instead of dataSources
    author: async ({ authorId }, _, { dataSources }) => {
      const baseUrl = "https://odyssey-lift-off-rest-api.herokuapp.com"
      const res = await fetch(`${baseUrl}/author/${authorId}`)
      return res.json()

      // return dataSources.trackAPI.getAuthor(authorId);
    }
  }
}
```
