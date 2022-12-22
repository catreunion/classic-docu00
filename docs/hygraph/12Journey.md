---
sidebar_position: 13
---

## Fetching live data from a REST API in Node.js environment

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

### coding

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
