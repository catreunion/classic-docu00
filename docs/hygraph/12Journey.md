---
sidebar_position: 13
---

# Apollo Tutorials - Journey of a GraphQL query

[apollographql.com](apollographql.com) provides an amazing tutorial about the principle of fetching live data in Node.js environment.

Source : [Lift-off II Resolvers](https://www.apollographql.com/tutorials/lift-off-part2/journey-of-a-graphql-query) by Raph Terrier & Michelle Mabuyo

```bash
git clone https://github.com/apollographql/odyssey-lift-off-part2
```

##

1. Our web app (GraphQL client) sends a query, in HTTP POST or GET requests, to the remote GraphQL server. The query itself is formatted as a string.

2. The server **parses** and **transforms** the string into something it can better manipulate : a tree-structured document called an Abstract Syntax Tree (AST).

3. The server **validates** the query against the **types** and **fields** in our **schema**.

- If anything is off, the server throws an error and sends it right back to the app.

- Queries must use valid GraphQL syntax and must only include schema-defined fields.

- If the query looks good, the server can execute it and fetch the data.

4. For **each field** in the query, the server invokes that field's **resolver function** to populate data from a correct source.

5. As all of the query's fields are resolved, the **data is assembled into a nicely ordered JSON object** with the **exact same shape as the query**.

6. The server assigns the object to the HTTP response body's **data key**, and it's time for the return trip, back to our app.

7. Our web app (GraphQL client) receives the response with exactly the data it needs, passes that data to the right components to render them.

![An amazing illustration by apollographql.com](https://res.cloudinary.com/apollographql/image/upload/e_sharpen:50,c_scale,q_90,w_1440,fl_progressive/v1617351987/odyssey/lift-off-part2/lop2-1-06_enfbis.jpg)

## Fetching live data from a REST API in Node.js environment

One query is often composed of a mix of different fields and types, coming from different REST API endpoints, with different cache policies.

[The Catstronauts REST API](https://odyssey-lift-off-rest-api.herokuapp.com/)

```text title='contains 6 endpoints'
GET   /tracks
GET   /track/:id
PATCH /track/:id
GET   /track/:id/modules
GET   /author/:id
GET   /module/:id
```

`axios` / `node-fetch` : Libraries providing easy access to HTTP methods and nice async behavior.

```js title='fetch data from the /tracks endpoint'
fetch("apiUrl/tracks").then(function (response) {
  // do something
})
```

```json title='response from the /tracks endpoint'
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

Compare with the **Track object type** in our GraphQL schema

```text title='GraphQL schema'
type Track {
  id: ID!
  title: String!
  author: Author!
  thumbnail: String
  length: Int
  modulesCount: Int
}
```

`author` is missing.

```js title='fetch data from the /author/:id endpoint'
fetch(`apiUrl/author/${authorId}`).then(function (response) {
  // do something
})
```

```json title='response from the /author/:id endpoint'
{
  "id": "cat-1",
  "name": "Henri, le Chat Noir",
  "photo": "https://images.unsplash.com/photo-1442291928580-fb5d0856a8f1?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjExNzA0OH0"
}
```

Compare with the **Author object type** in our GraphQL schema

```text title='GraphQL schema'
type Author {
  id: ID!
  name: String!
  photo: String
}
```

## The classic N+1 problem

1 : the call to fetch the top-level tracks field

N : the number of subsequent calls to fetch the author subfield for each track

Making N calls to the exact same endpoint to fetch the exact same data is very inefficient, especially if N is a large number.

```text title='The classic N+1 problem'
{
  tracks {
    title
    author {
      name
    }
  }
}
```

## Implementing the `RESTDataSource` class in our app

The RESTDataSource class **provides helper methods** for HTTP requests.

Efficiently handle resource caching and deduplication.

- Prevent unneccessary REST API calls for data that doesn't get updated frequently.

- Help manage the mix of different endpoints with different cache policies.

Data resolvers in a GraphQL server can work with any number of data sources, forming a **single API** that serves the needs of your client app.

Resolver functions filter the data properties to match only what the query asks for.

GraphQL server stitches the results together, forming the shape of the data that our resolver, and our query, is expecting.

```js title='server/src/datasources/track-api.js'
const { RESTDataSource } = require("apollo-datasource-rest")

// declare a class called TrackAPI that extends RESTDataSource
class TrackAPI extends RESTDataSource {
  // define a constructor method
  constructor() {
    // call super() to access RESTDataSource features
    super()
    // assign the base url of Catstronauts REST API
    this.baseURL = "https://odyssey-lift-off-rest-api.herokuapp.com/"
  }
  // define a method called getTracksForHome
  getTracksForHome() {
    // perform a GET request to the `tracks` endpoint
    // return the results of that call
    return this.get("tracks")
  }
  // define a method called getAuthor
  // take `authorId` as an argument
  getAuthor(authorId) {
    // perform a GET request to the `/author/:id` endpoint
    // backticks (`) string interpolation
    return this.get(`author/${authorId}`)
  }
}

module.exports = TrackAPI
```

```js title='server/src/datasources/spacecats-api.js'
const { RESTDataSource } = require("apollo-datasource-rest")

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

module.exports = SpaceCatsAPI
```

## Implementing resolvers in our app

A resolver is a function. It has the **same name as the field** that it populates the data for. It can fetch data from any data source. Data will be transformed into the shape that you request.

```js title='server/src/resolvers.js'
// declare a resolvers constant (an object)
// will be used in server config options
const resolvers = {
  // resolvers' object keys correspond to our schema's types and fields
  Query: {
    // return an array of Tracks
    // will be used to populate the homepage grid
    tracksForHome: (parent, args, context, info) => {}
  }
}

module.exports = resolvers
```

### 4 optional parameters of a resolver function <-- signature

`parent`

- the returned value of the resolver for this field's parent

- will be useful when dealing with resolver chains.

`args`

- an object that contains all GraphQL arguments that were provided for the field by the GraphQL operation. When querying for a specific item (such as a specific track instead of all tracks), in client-land we'll make a query with an id argument that will be accessible via this args parameter in server-land. We'll cover this further in Lift-off III.

`context`

- an object shared across all resolvers that are executing for a particular operation

- used to share state, e.g. authentication info, database connection or in our case the RESTDataSource

`info`

- contains information about the operation's execution state, including the field name, the path to the field from the root, and more

- used in more advanced actions like setting cache policies at the resolver level

### coding

```js title='server/src/resolvers.js'
const resolvers = {
  Query: {
    // destructure `context` to access its child object `dataSources`
    tracksForHome: (_, __, { dataSources }) => {
      // trackAPI : an instance of our TrackAPI class
      return dataSources.trackAPI.getTracksForHome()
    }
  },
  // add a resolver specifically for a track's author
  // indicating that it's for the Track type in our schema
  Track: {
    // parent contains data returned by tracksForHome resolver
    // include title, description and authorId
    // destructure `parent` to access its child object `authorId`
    author: ({ authorId }, _, { dataSources }) => {
      return dataSources.trackAPI.getAuthor(authorId)
    }
  }
}

module.exports = resolvers
```

```js
const resolvers = {
  Query: {
    spaceCats: (_, __, { dataSources }) => {
      return dataSources.spaceCatsAPI.getSpaceCats()
    }
  }
}
```

```js
const resolvers = {
  Query: {
    spaceCats: (_, __, { dataSources }) => {
      return dataSources.spaceCatsAPI.getSpaceCats()
    }
  }
  SpaceCat: {
    missions: ({catId}, _, {dataSources}) => {
      return dataSources.spaceCatsAPI.getMissions(catId)
    }
  }
}
```
