---
sidebar_position: 2
---

# Back to fundamental

## A GraphQL.js script

Running a GraphQL query on command line tool. [Getting started with GraphQL.js](https://graphql.org/graphql-js/)

```bash title="setup for running a GraphQL.js script"
# create a new directory and move into it
mkdir m1 && cd m1

# initialize a new Node.js project
yarn init -y

# install GraphQL.js
yarn add graphql
# or : yarn add graphql --save

# create a JavaScript file
touch hello.js
```

The following code shows ES6 features like [Promises](https://web.dev/learn/), classes, and [fat arrow functions](https://strongloop.com/strongblog/an-introduction-to-javascript-es6-arrow-functions/).

```js title="hello.js"
var { buildSchema, graphql } = require("graphql")

var schema = buildSchema(`
  type Query {
    hello: String
  }
`)
var source = "{ hello }"
// `rootValue` provides a resolver function that just returns “Hello world!”
var rootValue = { hello: () => "Hello world!" }

// run the GraphQL query '{ hello }'
graphql({ schema, source, rootValue }).then((response) => {
  console.log(response)
})
```

```bash title="running the GraphQL.js script"
# execute the GraphQL query in hello.js
node hello.js

# response from the command line tool
{ data: [Object: null prototype] { hello: 'Hello world!' } }
```

## Express GraphQL Server

Running a GraphQL query over HTTP. [Getting started Express GraphQL Server](https://graphql.org/graphql-js/running-an-express-graphql-server/)

```bash title="setup for running an Express webserver"
# create a new directory and move into it
mkdir m2 && cd m2

# initialize a new Node.js project
yarn init -y

# install dependencies
yarn add express express-graphql graphql

# create a JavaScript file
touch server.js
```

```js title="server.js"
var { buildSchema } = require("graphql")
var { graphqlHTTP } = require("express-graphql")
var express = require("express")

var schema = buildSchema(`
  type Query {
    hello: String
  }
`)
var rootValue = { hello: () => "Hello world!" }
var app = express()

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: rootValue,
    graphiql: true
  })
)
app.listen(4000, () => console.log("Now browse to localhost:4000/graphql"))
```

```bash title="starting the Express webserver"
# start the Express GraphQL server
node server.js

# response from the Express GraphQL Server
Now browse to localhost:4000/graphql

# go to http://localhost:4000/graphql with a web browser
```

## Apollo Server

An illustration by [Apollo](https://www.apollographql.com/docs/apollo-server) showing Apollo Server bridging frontend and backend.

![showing Apollo Server bridging frontend and backend](https://www.apollographql.com/docs/c5e2d4db4b0b5568a87ebf082ffe79e6/frontend_backend_diagram.svg)

```bash title="running an Apollo Server"
# create a new directory and move into it
mkdir m3 && cd m3

# initialize a new Node.js project
yarn init -y

# install dependencies
yarn add @apollo/server graphql

# create a JavaScript file
touch index.js

# start the Apollo Server
yarn start

# response from the Apollo Server
🚀  Server ready at: http://localhost:4000/

# go to http://localhost:4000 with a web browser
```

`"type": "module"` loads your JavaScript files as ES modules, enabling top-level await calls.

```json title="package.json"
{
  "main": "index.js",
  "dependencies": {
    "@apollo/server": "^4.3.0",
    "graphql": "^16.6.0"
  },
  "type": "module",
  "scripts": {
    "start": "node index.js"
  }
}
```

```graphql title="executing the books query"
query GetBook {
  books {
    title
  }
}
```

`graphql` (also known as graphql-js) is the library that implements the core GraphQL parsing and execution algorithms.

`startStandaloneServer` and `expressMiddleware` <-- Official integrations

[`@as-integrations/next`](https://www.npmjs.com/package/@as-integrations/next) and [`@as-integrations/h3`](https://www.npmjs.com/package/@as-integrations/h3) <-- unofficial

---

GraphQL schema basics

An **object type** contains a collection of fields, each of which has its own type.

Not responsible for defining where data comes from or how it's stored

Describe the shape of your available data

Defines a hierarchy of types with fields that are populated from your back-end data stores

Defines a collection of types and the relationships between those types

Specifies exactly which queries and mutations are available for clients to execute.

The GraphQL specification defines a human-readable schema definition language (or SDL) that you use to define your schema and store it as a string.

```graphql title="two object types"
type Book {
  title: String
  # a Book can have an associated author
  author: Author
}

type Author {
  name: String!
  # an Author can have a list of books, indicated by square brackets []
  books: [Book!]!
}

# the Query type defines entry points for read operations
type Query {
  books: [Book]
  authors: [Author]
}

type User {
  id: ID!
  name: String!
  email: String!
}

# the Mutation type defines entry points for write operations
type Mutation {
  # need two arguments (title and author)
  # return a newly created Book object
  addBook(title: String, author: String): Book
  # This mutation takes id and email parameters and responds with a User
  updateUserEmail(id: ID!, email: String!): User
}

interface MutationResponse {
  code: String!
  success: Boolean!
  message: String!
}

# a mutation that modifies multiple types
type LikePostMutationResponse implements MutationResponse {
  code: String!
  success: Boolean!
  message: String!
  # a separate field for each type that's modified
  post: Post
  user: User
}

type UpdateUserEmailMutationResponse implements MutationResponse {
  code: String!
  success: Boolean!
  message: String!
  user: User
}
```

Every mutation's response should include the data that the mutation modified. This enables clients to obtain the latest persisted data without needing to send a followup query.

```graphql title="updating a field"
mutation UpdateMyUser {
  updateUserEmail(id: 1, email: "jane@example.com") {
    id
    name
    email
  }
}
```

```json title="response"
{
  "data": {
    "updateUserEmail": {
      "id": "1",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}
```

Each field returns data of the type specified. A field's return type can be a scalar, object, enum, union, or interface.

If ! appears outside the square brackets, the list itself can't be null.

If ! appears inside the square brackets, the returned list can't include items that are null.

nullable, non-nullable, nullability

## Query, Mutation, and Subscription

three special root operation types

### Scalar types

Always resolve to concrete data <-- known primitive types

`Int` : Signed 32‐bit integer

`Float`: Signed double-precision floating-point value

`String` : UTF‐8 character sequence

`Boolean` : true or false

`ID` : Unique identifier that's often used to refetch an object or as the key for a cache. Although it's serialized as a String, an ID is not intended to be human‐readable. Serialized as a String.

These primitive types cover the majority of use cases. For more specific use cases, you can create custom scalar types.

### Object types

The **typename field
Every object type in your schema automatically has a field named **typename (you don't need to define it). The \_\_typename field returns the object type's name as a String (e.g., Book or Author).

GraphQL clients use an object's **typename for many purposes, such as to determine which type was returned by a field that can return multiple types (i.e., a union or interface). Apollo Client relies on **typename when caching results, so it automatically includes \_\_typename in every object of every query.

Because \_\_typename is always present, this is a valid query for any GraphQL server:

```
query UniversalQuery {
  __typename
}
```

### The Query type

The Query type is **a special object** type that defines all of the top-level entry points for queries that clients execute against your server.

Each field of the Query type defines the name and return type of a different entry point. The Query type for our example schema might resemble the following:

a REST-based API
/api/books and
/api/authors

```graphql title="requesting multiple resources in a single request"
query GetBooksAndAuthors {
  books {
    title
  }
  authors {
    name
  }
}
```

```json title="result / response"
{
  "data": {
    "books": [
      {
        "title": "City of Glass"
      },
      ...
    ],
    "authors": [
      {
        "name": "Paul Auster"
      },
      ...
    ]
  }
}
```

```graphql title="requesting details of a book"
query GetBooks {
  books {
    title
    author {
      name
    }
  }
}
```

```json title="result / response"
{
  "data": {
    "books": [
      {
        "title": "City of Glass",
        "author": {
          "name": "Paul Auster"
        }
      },
      ...
    ]
  }
}
```

The Mutation type

As with queries, our server would respond to this mutation with a result that matches the mutation's structure, like so:

```
{
  "data": {
    "addBook": {
      "title": "Fox in Socks",
      "author": {
        "name": "Dr. Seuss"
      }
    }
  }
}
```

A single mutation operation can include multiple top-level fields of the Mutation type. This usually means that the operation will execute multiple back-end writes (at least one for each field). To prevent race conditions, top-level Mutation fields are resolved serially in the order they're listed (all other fields can be resolved in parallel).

## Input types

Each field of an input type can be only a scalar, an enum, or another input type

```
input BlogPostContent {
  title: String
  body: String
  media: [MediaDetails!]
}

input MediaDetails {
  format: MediaFormat!
  url: String!
}

enum MediaFormat {
  IMAGE
  VIDEO
}
```

After you define an input type, any number of different object fields can accept that type as an argument:

type Mutation {
createBlogPost(content: BlogPostContent!): Post
updateBlogPost(id: ID!, content: BlogPostContent!): Post
}
Input types can sometimes be useful when multiple operations require the exact same set of information, but you should reuse them sparingly. Operations might eventually diverge in their sets of required arguments.

Take care if using the same input type for fields of both Query and Mutation. In many cases, arguments that are required for a mutation are optional for a corresponding query. You might want to create separate input types for each operation type.

### Enum types

```
enum AllowedColor {
  RED
  GREEN
  BLUE
}
```

```
type Query {
  favoriteColor: AllowedColor # enum return value
  avatar(borderColor: AllowedColor): String # enum argument
}
```

```
query GetAvatar {
  avatar(borderColor: RED)
}
```

Internal values (advanced)
Sometimes, a backend forces a different value for an enum internally than in the public API. You can set each enum value's corresponding internal value in the resolver map you provide to Apollo Server.

This feature usually isn't required unless another library in your application expects enum values in a different form.

uses color hex codes for each AllowedColor's internal value:

```
const resolvers = {
  AllowedColor: {
    RED: '#f00',
    GREEN: '#0f0',
    BLUE: '#00f',
  },
  // ...other resolver definitions...
};
```

These internal values don't change the public API at all. Apollo Server resolvers accept these values instead of the schema values, as shown:

```
const resolvers = {
  AllowedColor: {
    RED: '#f00',
    GREEN: '#0f0',
    BLUE: '#00f',
  },
  Query: {
    favoriteColor: () => '#f00',
    avatar: (parent, args) => {
      // args.borderColor is '#f00', '#0f0', or '#00f'
    },
  },
};
```

Union and interface types
See Unions and interfaces.

Apollo Studio provides field-level performance metrics, schema history tracking, and advanced security via operation safelisting.

Naming conventions to ensure consistency

Field names should use camelCase.

Type names should use PascalCase. This matches how classes are defined in the languages mentioned above.

Enum values should use ALL_CAPS, because they are similar to constants.

Query-driven schema design

Design your schema based on how data is used, not based on how it's stored.

an app to show the name, date, and location of each event, along with the weather forecast for it.

```graphql title=""
query EventList {
  upcomingEvents {
    name
    date
    location {
      name
      weather {
        temperature
        description
      }
    }
  }
}
```

Because we know this is the structure of data that would be helpful for our client, that can inform the structure of our schema:

```
type Query {
  upcomingEvents: [Event!]!
}

type Event {
  name: String!
  date: String!
  location: Location
}

type Location {
  name: String!
  weather: WeatherInfo
}

type WeatherInfo {
  temperature: Float
  description: String
}
```

## Structuring mutation responses

A single mutation can modify multiple types, or multiple instances of the same type.

to "like" a blog post
increment the likes count for a Post
update the likedPosts list for the User

Our updateUserEmail mutation would specify UpdateUserEmailMutationResponse as its return type (instead of User), and the structure of its response would be the following:

```
{
  "data": {
    "updateUserEmail": {
      "code": "200",
      "success": true,
      "message": "User email was successfully updated",
      "user": {
        "id": "1",
        "name": "Jane Doe",
        "email": "jane@example.com"
      }
    }
  }
}
```

code is a string that represents the status of the data transfer. Think of it like an HTTP status code.
success is a boolean that indicates whether the mutation was successful. This allows a coarse check by the client to know if there were failures.
message is a human-readable string that describes the result of the mutation. It is intended to be used in the UI of the product.
user is added by the implementing type UpdateUserEmailMutationResponse to return the newly updated user to the client.

```
{
  "data": {
    "likePost": {
      "code": "200",
      "success": true,
      "message": "Thanks!",
      "post": {
        "id": "123",
        "likes": 5040
      },
      "user": {
        "likedPosts": ["123"]
      }
    }
  }
}
```
