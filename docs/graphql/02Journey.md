---
sidebar_position: 2
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

A single track might include any number of modules, and **one module might be part of multiple tracks**

## Querying for a specific track

![the syntax breakdown of using GraphQL arguments](https://res.cloudinary.com/apollographql/image/upload/e_sharpen:50,c_scale,q_90,w_1440,fl_progressive/v1623354512/odyssey/lift-off-part3/args-syntax_t0wseq.jpg)

specify an unique track we're querying for by giving this field an **argument**

4 reasons to use arguments in a query

1. Provide a user-submitted search term

2. Transform a field's returned value

3. Retrieve a specific object

4. Filter a set of objects

To define an argument for a field in our schema, we add parentheses after the field name

Write the name of the argument followed by a colon, then the type of that argument, like String or Int

If we have more than one argument, we can separate them with commas.

the syntax breakdown of using GraphQL arguments

## Retrieving our data

```json title="response from the track/:id endpoint giving it the id = c_0"
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
}
```

```js
const resolvers = {
  Query: {
    spaceCat: (_, { id }, { dataSources }) => {
      return dataSources.spaceCatsAPI.getSpaceCat(id)
    }
  }
}
```

First let's determine where exactly we can place our call to get the details of a track's modules

We need that information in our track query, but should we add the call here in the track resolver?

```js
// EXAMPLE ONLY - should we add the getTrackModules call here in the track resolver?
track: async (_, { id }, { dataSources }) => {
  // get track details
  const track = dataSources.trackAPI.getTrack(id)

  // get module details for the track
  const modules = await dataSources.trackAPI.getTrackModules(id)

  // shape the data in the way that the schema expects it
  return { ...track, modules }
}
```

extracted author-fetching logic to a different resolver

⛓️ Resolver chains

```
query track(id: ‘c_0') {
  title
  author {
    name
  }
}
```

Resolver parameters

![yes](https://res.cloudinary.com/apollographql/image/upload/e_sharpen:50,c_scale,q_90,w_1440,fl_progressive/v1623355358/odyssey/lift-off-part3/resolver-parent_kne6hn.jpg)

## Variables

```
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

query getMission($isScheduled: Boolean) {
  mission(scheduled: $isScheduled) {
    id
    codename
  }
}
```

The $ symbol indicates a variable in GraphQL. Variables are denoted by the $ symbol. They are used to provide dynamic values for arguments to avoid including hardcoded values in a query. Each one's type must match the type specified in the
schema

## code

Declare a functional component that takes a trackId destructured from the props input. This prop will be coming as a parameter from the route, or the browser's URL.

/track/c_0
localhost:3000/track/c_0

Before the return line, we can declare our usual loading, error and data object that we'll receive from our useQuery hook.

```
const GET_SPACECAT = gql`
  query getSpacecat($spaceCatId: ID!) {
    spacecat(id: $spaceCatId) {
      name
    }
  }
`;

const spaceCatId = 'kitty-1';

const Cat = ({ spaceCatId }) => {
  const { loading, error, data } = useQuery(GET_SPACECAT, {
    variables: { spaceCatId }
  })

  return (
    <Layout>
      <QueryResult loading={loading} error={error} data={data}>
        <TrackDetail track={data?.track} />
      </QueryResult>
    </Layout>
  )
}

export default Track

```

The useQuery hook

The useQuery hook returns an object with three useful properties that we use in our app:

indicates whether the query has completed and results have been returned.

is an object that contains any errors that the operation has thrown.

contains the results of the query after it has completed. To set

in our query, we declare them in the

parameter of the useQuery hook, inside an options object.
Drag items from the box to the blanks above

The useQuery hook returns an object with three useful properties that we use in our app: **loading** indicates whether the query has completed and results have been returned. **error** is an object that contains any errors that the operation has thrown. **data** contains the results of the query after it has completed. To set **variables** in our query, we declare them in the **second** parameter of the useQuery hook, inside an options object.

Do you see the track page when you change the URL in the browser?

# Connecting the two pages

Then we add a to prop to the CardContainer, which will tell the router where to go when the component is clicked. In our case, we'll want to navigate to the track/id path, passing it the track's ID.

Can you navigate to the correct track page from the homepage? What's the last module on the track 'Cat-strophysics, master class'?
