---
sidebar_position: 2
---

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
