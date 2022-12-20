---
sidebar_position: 13
---

# Apollo Tutorials - Journey of a GraphQL query

An amazing tutorial by Raph Terrier & Michelle Mabuyo @ apollographql.com

Source : [Lift-off II: Resolvers](https://www.apollographql.com/tutorials/lift-off-part2/journey-of-a-graphql-query)

```bash
git clone https://github.com/apollographql/odyssey-lift-off-part2
```

## Fetching remote data to populate its homepage

1. Our web app (GraphQL client) sends a query, in HTTP POST or GET requests, to the remote GraphQL server. The query itself is formatted as a string.

2. The server **parses** and **transforms** the string into something it can better manipulate : a tree-structured document called an Abstract Syntax Tree (AST).

3. The server **validates** the query against the **types** and **fields** in our schema.

- If anything is off, the server throws an error and sends it right back to the app.

- Queries must use valid GraphQL syntax and must only include schema-defined fields.

- If the query looks good, the server can execute it and fetch the data.

4. For each field in the query, the server invokes that field's **resolver function** to populate the correct data from the correct source, such as a database or a REST API.

5. As all of the query's fields are resolved, the data is assembled into a nicely ordered JSON object with the **exact same shape as the query**.

6. The server assigns the object to the HTTP response body's data key, and it's time for the return trip, back to our app.

7. Our web app (GraphQL client) receives the response with exactly the data it needs, passes that data to the right components to render them.

![An amazing illustration by apollographql.com](https://res.cloudinary.com/apollographql/image/upload/e_sharpen:50,c_scale,q_90,w_1440,fl_progressive/v1617351987/odyssey/lift-off-part2/lop2-1-06_enfbis.jpg)

## Fetching data from a REST API in a Node.js environment

One query is often composed of a mix of different fields and types, coming from different REST API endpoints, with different cache policies.

[the Catstronauts REST API](https://odyssey-lift-off-rest-api.herokuapp.com/)

```text title='6 endpoints'
GET   /tracks
GET   /track/:id
PATCH /track/:id
GET   /track/:id/modules
GET   /author/:id
GET   /module/:id
```

`axios` / `node-fetch` : Libraries providing easy access to HTTP methods and nice async behavior.

Calling the /tracks endpoint.

```js title='using node-fetch'
fetch("apiUrl/tracks").then(function (response) {
  // do something with our tracks JSON
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

Calling the /author/:id endpoint.

```js title='using node-fetch'
fetch(`apiUrl/author/${authorId}`).then(function (response) {
  // this is the author of our track
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

Data resolvers in a GraphQL server can work with any number of data sources, forming a **single API** that serves the needs of your client app.

Resolver functions filter the data properties to match only what the query asks for.

GraphQL server stitches the results together, forming the shape of the data that our resolver, and our query, is expecting.

## the classic N+1 problem : Challenges and Limitations

1 : the call to fetch the top-level tracks field

N : the number of subsequent calls to fetch the author subfield for each track.

```text
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

Making N calls to the exact same endpoint to fetch the exact same data is very inefficient, especially if N is a large number.

Resource caching

Prevent unneccessary REST API calls for data that doesn't get updated frequently.

Help manage the mix of different endpoints with different cache policies.

## Implementing `RESTDataSource` in our Catstronauts app

Efficiently handle resource caching and deduplication for our REST API calls.
