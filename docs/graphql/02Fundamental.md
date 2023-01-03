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

## Traversy's Express Ver.

[MongoDB Compass](https://www.mongodb.com/try/download/compass), [GraphQL Queries & Mutations](https://gist.github.com/bradtraversy/fc527bc9a4659ab8de8e8066f3498723)

In the directory of your choice with your preferred terminal, follow these steps :

```bash title="implementing Traversy's setup"
# create a new directory and move into it
mkdir m2-mine && cd m2-mine

# initialize a new Node.js project
yarn init -y

# install dependencies
yarn add express express-graphql graphql mongoose cors colors
yarn add -D nodemon dotenv

# create these files
touch .env index.js

# create these directories
mkdir db models schema

# create these files
touch db/db.js
touch models/Client.js models/Project.js
touch schema/schema.js
```

```json title="add these to package.json"
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

```env title=".env"
PORT = 5000
NODE_ENV = "development"
MONGO_URL= "mongodb+srv://isaac:<password>@cluster0.k2tca6i.mongodb.net/?retryWrites=true&w=majority"
```

```js title="index.js"
require("dotenv").config()
const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const connectDB = require("./config/db.js")
const cors = require("cors")
const { graphqlHTTP } = require("express-graphql")
const schema = require("./schema/schema.js")
const colors = require("colors")

connectDB()
app.use(cors())
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development"
  })
)
app.listen(port, console.log(`Server running on port ${port}`))
```

```js title="db/db.js"
const mongoose = require("mongoose")

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URL)
  console.log(`MongoDB connected : ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = connectDB
```

```js title="models/Client.js"
const mongoose = require("mongoose")

const ClientSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  }
})

module.exports = mongoose.model("Client", ClientSchema)
```

```js title="models/Project.js"
const mongoose = require("mongoose")

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String
  },
  desc: {
    type: String
  },
  status: {
    type: String,
    enum: ["Not started", "In progress", "Completed"]
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client"
  }
})

module.exports = mongoose.model("Project", ProjectSchema)
```

```js title="schema/schema.js"
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require("graphql")
const Client = require("../models/Client")
const Project = require("../models/Project")

const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString }
  })
})

const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    desc: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        // return clients.find((client) => client.id === parent.clientId)
        return Client.findById(parent.clientId)
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find()
      }
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return clients.find((client) => client.id === args.id)
        return Client.findById(args.id)
      }
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find()
      }
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return projects.find((project) => project.id === args.id)
        return Project.findById(args.id)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})
```

```bash title="on the root directory"
# start the dev server
yarn dev

# response from the Express GraphQL Server
yarn run v1.22.19
Server running on port 5000
MongoDB connected : ac-vzbfpmx-shard-00-00.k2tca6i.mongodb.net

# go to http://localhost:5000/graphql in a web browser
```

```text title="graphql hints"
Type queries into this side of the screen, and you will see intelligent
typeaheads aware of the current GraphQL type schema and live syntax and
validation errors highlighted within the text.

{
  field(arg: "value") {
    subField
  }
}

Prettify Query:  Shift-Ctrl-P (or Prettify button)
   Merge Query:  Shift-Ctrl-M (or Merge button)
     Run Query:  Ctrl-Enter (or Play button)
 Auto Complete:  Ctrl-Space (or just start typing)
```

```graphql title="query for all clients"
query GetClients {
  clients {
    id
    name
  }
}
```

```json title="response from GraphQL server"
{
  "data": {
    "clients": [
      {
        "id": "63b185f09c63df26be024568",
        "name": "Tony Stark"
      }
    ]
  }
}
```

```graphql title="query for a specific client"
query GetOneClient {
  client(id: "63b185f09c63df26be024568") {
    id
    name
  }
}
```

```json title="response from GraphQL server"
{
  "data": {
    "client": {
      "id": "63b185f09c63df26be024568",
      "name": "Tony Stark"
    }
  }
}
```

```graphql title="query for all projects"
query GetProjects {
  projects {
    id
    name
  }
}
```

```json title="response from GraphQL server"
{
  "data": {
    "projects": [
      {
        "id": "63b186c59c63df26be02456a",
        "name": "Mobile App"
      }
    ]
  }
}
```

```graphql title="query for a specific project"
query GetOneProject {
  project(id: "63b186c59c63df26be02456a") {
    id
    name
  }
}
```

```json title="response from GraphQL server"
{
  "data": {
    "project": {
      "id": "63b186c59c63df26be02456a",
      "name": "Mobile App"
    }
  }
}
```

```graphql title="query for more details"
query getOneProject {
  project(id: "63b186c59c63df26be02456a") {
    id
    name
    client {
      id
      name
    }
  }
}
```

```json title="response from GraphQL server"
{
  "data": {
    "project": {
      "id": "63b186c59c63df26be02456a",
      "name": "Mobile App",
      "client": {
        "id": "63b185f09c63df26be024568",
        "name": "Tony Stark"
      }
    }
  }
}
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

nullable, nullability, exclamation mark

root operation types: Query, Mutation, and Subscription

Input types
Input types are special object types that allow you to provide hierarchical data as arguments to fields (as opposed to providing only flat scalar arguments).

An input type's definition is similar to an object type's, but it uses the input keyword:

```
input BlogPostContent {
  title: String
  body: String
}
```

Each field of an input type can be only a scalar, an enum, or another input type:

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

```
type Mutation {
  createBlogPost(content: BlogPostContent!): Post
  updateBlogPost(id: ID!, content: BlogPostContent!): Post
}
```

Input types can sometimes be useful when multiple operations require the exact same set of information, but you should reuse them sparingly. Operations might eventually diverge in their sets of required arguments.

Take care if using the same input type for fields of both Query and Mutation. In many cases, arguments that are required for a mutation are optional for a corresponding query. You might want to create separate input types for each operation type.

Enum types
An enum is similar to a scalar type, but its legal values are defined in the schema. Here's an example definition:

```
enum AllowedColor {
  RED
  GREEN
  BLUE
}
```

Enums are most useful in situations where the user must pick from a prescribed list of options. As an additional benefit, enum values autocomplete in tools like the Apollo Studio Explorer.

An enum can appear anywhere a scalar is valid (including as a field argument), because they serialize as strings:

```
type Query {
  favoriteColor: AllowedColor # enum return value
  avatar(borderColor: AllowedColor): String # enum argument
}
```

A query might then look like this:

```
query GetAvatar {
  avatar(borderColor: RED)
}
```

Internal values (advanced)
Sometimes, a backend forces a different value for an enum internally than in the public API. You can set each enum value's corresponding internal value in the resolver map you provide to Apollo Server.

This feature usually isn't required unless another library in your application expects enum values in a different form.

The following example uses color hex codes for each AllowedColor's internal value:

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

Growing with a schema
As your organization grows and evolves, your graph grows and evolves with it. New products and features introduce new schema types and fields. To track these changes over time, you should maintain your schema's definition in version control.

Most additive changes to a schema are safe and backward compatible. However, changes that remove or alter existing behavior might be breaking changes for one or more of your existing clients. All of the following schema changes are potentially breaking changes:

Removing a type or field
Renaming a type or field
Adding nullability to a field
Removing a field's arguments
A graph management tool such as Apollo Studio helps you understand whether a potential schema change will impact any of your active clients. Studio also provides field-level performance metrics, schema history tracking, and advanced security via operation safelisting.

Descriptions (docstrings)
GraphQL's schema definition language (SDL) supports Markdown-enabled documentation strings, called descriptions. These help consumers of your graph discover fields and learn how to use them.

The following snippet shows how to use both single-line string literals and multi-line blocks:

```
"Description for the type"
type MyObjectType {
  """
  Description for field
  Supports **multi-line** description for your [API](http://example.com)!
  """
  myField: String!

  otherField(
    "Description for argument"
    arg: Int
  )
}
```

A well documented schema helps provide an enhanced development experience, because GraphQL development tools (such as the Apollo Studio Explorer) auto-complete field names along with descriptions when they're provided. Furthermore, Apollo Studio displays descriptions alongside field usage and performance details when using its metrics reporting and client awareness features.

Naming conventions
The GraphQL specification is flexible and doesn't impose specific naming guidelines. However, it's helpful to establish a set of conventions to ensure consistency across your organization. We recommend the following:

Field names should use camelCase. Many GraphQL clients are written in JavaScript, Java, Kotlin, or Swift, all of which recommend camelCase for variable names.
Type names should use PascalCase. This matches how classes are defined in the languages mentioned above.
Enum names should use PascalCase.
Enum values should use ALL_CAPS, because they are similar to constants.
These conventions help ensure that most clients don't need to define extra logic to transform the results returned by your server.

Query-driven schema design
A GraphQL schema is most powerful when it's designed for the needs of the clients that will execute operations against it. Although you can structure your types so they match the structure of your back-end data stores, you don't have to! A single object type's fields can be populated with data from any number of different sources. Design your schema based on how data is used, not based on how it's stored.

If your data store includes a field or relationship that your clients don't need yet, omit it from your schema. It's easier and safer to add a new field to a schema than it is to remove an existing field that some of your clients are using.

Example of a query-driven schema
Let's say we're creating a web app that lists upcoming events in our area. We want the app to show the name, date, and location of each event, along with the weather forecast for it.

In this case, we want our web app to be able to execute a query with a structure similar to the following:

```
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

As mentioned, each of these types can be populated with data from a different data source (or multiple data sources). For example, the Event type's name and date might be populated with data from our back-end database, whereas the WeatherInfo type might be populated with data from a third-party weather API.

Designing mutations

In GraphQL, it's recommended for every mutation's response to include the data that the mutation modified. This enables clients to obtain the latest persisted data without needing to send a followup query.

A schema that supports updating the email of a User would include the following:

```
type Mutation {
  # This mutation takes id and email parameters and responds with a User
  updateUserEmail(id: ID!, email: String!): User
}

type User {
  id: ID!
  name: String!
  email: String!
}
```

A client could then execute a mutation against the schema with the following structure:

```
mutation updateMyUser {
  updateUserEmail(id: 1, email: "jane@example.com") {
    id
    name
    email
  }
}
```

After the GraphQL server executes the mutation and stores the new email address for the user, it responds to the client with the following:

```
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

Although it isn't mandatory for a mutation's response to include the modified object, doing so greatly improves the efficiency of client code. And as with queries, determining which mutations would be useful for your clients helps inform the structure of your schema.

Structuring mutation responses
A single mutation can modify multiple types, or multiple instances of the same type. For example, a mutation that enables a user to "like" a blog post might increment the likes count for a Post and update the likedPosts list for the User. This makes it less obvious what the structure of the mutation's response should look like.

Additionally, mutations are much more likely than queries to cause errors, because they modify data. A mutation might even result in a partial error, in which it successfully modifies one piece of data and fails to modify another. Regardless of the type of error, it's important that the error is communicated back to the client in a consistent way.

To help resolve both of these concerns, we recommend defining a MutationResponse interface in your schema, along with a collection of object types that implement that interface (one for each of your mutations).

Here's what a MutationResponse interface might look like:

```
interface MutationResponse {
  code: String!
  success: Boolean!
  message: String!
}
```

And here's what an object that implements MutationResponse might look like:

```
type UpdateUserEmailMutationResponse implements MutationResponse {
  code: String!
  success: Boolean!
  message: String!
  user: User
}
```

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

Let’s break this down field by field:

code is a string that represents the status of the data transfer. Think of it like an HTTP status code.
success is a boolean that indicates whether the mutation was successful. This allows a coarse check by the client to know if there were failures.
message is a human-readable string that describes the result of the mutation. It is intended to be used in the UI of the product.
user is added by the implementing type UpdateUserEmailMutationResponse to return the newly updated user to the client.
If a mutation modifies multiple types (like our earlier example of "liking" a blog post), its implementing type can include a separate field for each type that's modified:

```
type LikePostMutationResponse implements MutationResponse {
  code: String!
  success: Boolean!
  message: String!
  post: Post
  user: User
}
```

Because our hypothetical likePost mutation modifies fields on both a Post and a User, its response object includes fields for both of those types. A response has the following structure:

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

Following this pattern provides a client with helpful, detailed information about the result of each requested operation. Equipped with this information, developers can better react to operation failures in their client code.
