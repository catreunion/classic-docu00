---
sidebar_position: 1
---

# Catstronauts

A learning platform for adventurous cats who want to explore the universe! 😺 🚀 Created by [Apollo Odyssey](https://www.apollographql.com/tutorials/), a series of amazing and super helpful tutorials about GraphQL. Thank you the creation team!! 🙏🏻

## What data do we need?

Think of an app's data as a collection of **objects** and **relationships** between objects.

Think of the entire data model as a **graph** of nodes and edges.

An illustration by [Apollo Odyssey](https://www.apollographql.com/tutorials/lift-off-part1/feature-data-requirements) - Identifying the pieces of data for each node

![Identifying the pieces of data for each node](https://res.cloudinary.com/apollographql/image/upload/e_sharpen:50,c_scale,q_90,w_1440,fl_progressive/v1612409160/odyssey/lift-off-part1/LO_02_v2.00_04_53_09.Still002_g8xow6_bbgabz.jpg)

## Setup

In the directory of your choice with your preferred terminal, clone one of the [Apollo Odyssey](https://www.apollographql.com/tutorials/voyage-part1/intro-to-federation) repositories that suits your needs.

```bash title="repos from Apollo Odyssey tutorials"
# clone a repo that suits you
git clone https://github.com/apollographql/odyssey-lift-off-part1
git clone https://github.com/apollographql/odyssey-lift-off-part2
git clone https://github.com/apollographql/odyssey-lift-off-part3
git clone https://github.com/apollographql/odyssey-lift-off-part4
git clone https://github.com/apollographql/odyssey-lift-off-part5

# navigate to the server directory
cd odyssey-lift-off-part1/server

# install the default dependencies
yarn

# install additional dependencies
yarn add apollo-server apollo-datasource-rest graphql

# start up the server
yarn start

# navigate to localhost:4000 in a web browser
```

```bash title="in a new terminal window"
# navigate to the client directory
cd odyssey-lift-off-part1/client

# install the default dependencies
yarn

# install additional dependencies
yarn add graphql @apollo/client

# start up the client
yarn start

# navigate to localhost:3000 in a web browser
```

## Schema Definition Language (SDL)

A schema is a collection of **object types** that contain **fields**. Like a contract between a server and it's clients, it defines what a GraphQL API can and can't do, and how clients can request or change data.

Structure the schema as intuitively as possible.

The **fields** of **Query object type** are the **entry points** into the schema where clients can query for. Two other kinds of entry points are **Mutation** and **Subscription**

Open the repository in your favorite IDE.

```js title="server/src/schema.js"
// declare a constant called typeDefs (short for "type definitions")
// wrap GraphQL strings with the gql tag (template literal)
// convert/parse GraphQL strings into the format that Apollo libraries understand
// use backticks (`), don't confused with single quotes (')

// declare an object type called SpaceCat in PascalCase with curly brackets
// declare a field called name in camelCase with a colon and without commas
// if a field should never be null (non-nullable), add an exclamation mark after its type
// declare a field called missions which is an array of Mission enclosed by square brackets

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

Sandbox is a special mode of Apollo Studio.

```graphql title="query for tracks"
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

The web app (GraphQL client) sends a GraphQL query operation, formatted as a string in HTTP POST or GET request, to the GraphQL server.

The server **parses** and **transforms** the string into a tree-structured document called an Abstract Syntax Tree (AST).

The server **validates** the query operation against the **types** and **fields** defined in **schema**.

For **each field** in the query, the server invokes that field's **resolver function** to populate data from the correct source.

As all of the query's fields are resolved, the data is **assembled / stitched into a JSON object** with the **exact same shape as the query**.

The server assigns the JSON object to the **data key** of the HTTP response body, and send it back to the web app.

The web app (GraphQL client) receives the response and passes the data to the right components for rendering.

An illustration by [Apollo Odyssey](https://www.apollographql.com/tutorials/lift-off-part2/journey-of-a-graphql-query) - Journey of a GraphQL query operation

![Journey of a GraphQL query operation](https://res.cloudinary.com/apollographql/image/upload/e_sharpen:50,c_scale,q_90,w_1440,fl_progressive/v1617351987/odyssey/lift-off-part2/lop2-1-06_enfbis.jpg)

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

An illustration by [Apollo Odyssey](https://www.apollographql.com/tutorials/lift-off-part2/exploring-our-data) - A GraphQL server can retrieve data from as a database, a REST API and a web hook.

![A GraphQL server can retrieve data from as a database, a REST API and a web hook](https://res.cloudinary.com/apollographql/image/upload/e_sharpen:50,c_scale,q_90,w_1440,fl_progressive/v1612408870/odyssey/lift-off-part2/lop2-2-01_actpy7.jpg)

### How is our data structured?

A GraphQL query operation is often composed of a mix of **different** fields and **types**, coming from **different endpoints**, with different cache policies.

```graphql title="query for tracks"
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

```json title="result from the /tracks endpoint"
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

The field name `authorId` is used in the data source.

### The 1+n problem

One call to fetch tracks but n subsequent calls to fetch the author subfield for each track.

Making n calls to the exact same endpoint to fetch the exact same data is very inefficient, especially if n is a large number.

```graphql title="the 1+n problem"
{
  tracks {
    title
    author {
      # n calls for n tracks
      name
    }
  }
}
```

### The `RESTDataSource` class

```js title="server/src/datasources/spacecats-api.js"
class SpaceCatsAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = "https://fake-spacecats-rest-api.cat/"
  }
  getSpaceCats() {
    return this.get("spacecats")
  }
  getMissions(catId) {
    return this.get(`spacecats/${catId}/missions`)
  }
}
```

### Resolver Functions

`parent` : Contain the **data** returned from the **previous** function in a **resolver chain**.

`args` : Contain all the **arguments** provided to the field for querying a specific item.

`context` : Used to access the helper methods defined in `RESTDataSource` or to access authentication info.

`info` : Contain informational properties about the operation's execution state.

```js title="server/src/resolvers.js"
const resolvers = {
  Query: {
    spaceCats: (_, __, { dataSources }) => {
      return dataSources.spaceCatsAPI.getSpaceCats()
    },
    spaceCat: (_, { id }, { dataSources }) => {
      return dataSources.spaceCatsAPI.getSpaceCat(id)
    }
  }
  SpaceCat: {
    missions: ({ id }, _, { dataSources }) => {
      return dataSources.spaceCatsAPI.getMissions(id)
    }
  }
}
```

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

```bash title="connecting to Hygraph"
# on the existing Sandbox, change the address to
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

### Putting all together

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

  type Query {
    tracksForHome: [Track!]!
    "Query for a specific track provided with the track's ID."
    track(id: ID!): Track!
    "Query for a specific module provided with the module's ID"
    module(id: ID!): Module!
  }
`
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
  getTrack(trackId) {
    return this.get(`track/${trackId}`)
  }
  getAuthor(authorId) {
    return this.get(`author/${authorId}`)
  }
  getTrackModules(trackId) {
    return this.get(`track/${trackId}/modules`)
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
