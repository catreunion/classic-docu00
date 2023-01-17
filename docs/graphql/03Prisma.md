---
sidebar_position: 3
---

# Prisma

[Prisma](https://prisma.io) is an open source Object-Relational Mapper (ORM). It consists of Prisma Client (a query builder for Node.js & TypeScript), Prisma Migrate, and Prisma Studio.

**TypeScript** makes database access entirely **type safe**.

[SQLite](https://www.prisma.io/docs/getting-started/quickstart), [Get started](https://pris.ly/d/getting-started), [Prisma schema](https://pris.ly/d/prisma-schema), [tsconfig.json](https://aka.ms/tsconfig), [Examples repo](https://github.com/prisma/prisma-examples/), [Overview](https://www.prisma.io/docs/concepts/overview/what-is-prisma)

```bash title="setup"
# initialize a project
yarn init -y

# install dev dependencies
yarn add -D typescript ts-node @types/node prisma

# create tsconfig.json
npx tsc --init

# create prisma/schema.prisma & .env for different types of databases
npx prisma init --datasource-provider sqlite | mongodb | postgresql

# build the Prisma data models

# format the schema file
npx prisma format

# install dependencies
# invoke autocompletion using CTRL + SPACE
yarn add @prisma/client

# apply changes against the database
# create `prisma/migrations/` and `prisma/dev.db`
npx prisma migrate dev --name init

# manually regenerate Prisma Client after a schema change
npx prisma generate
```

PostgreSQL - a Relational database

Prisma with Next.js, Prisma with GraphQL, Prisma with Apollo, Prisma with Nestjs, Prisma with Express, Prisma with hapi

## notes

GraphQL API

delete the current `migrations` directory and `dev.db` file

will use here is similar to the one from the REST API lesson before:

```graphql
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  content   String?
  published Boolean  @default(false)
  viewCount Int      @default(0)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}
```

Prisma is invoking the `prisma db seed` command for you which in turn invokes the `prisma.seed` script defined in `package.json` and enters the data from the `prisma/seed.ts` file into the database.

You can test your implementations by starting the server and opening the GraphQL Playground at `http://localhost:4000`.

### `Query.allUsers: [User!]!`

Fetches all users.

```tsx
allUsers: (_parent, _args, context: Context) => {
  return context.prisma.user.findMany()
},
```

```graphql
{
  allUsers {
    id
    name
    email
    posts {
      id
      title
    }
  }
}
```

### `Query.postById(id: Int!): Post`

Fetches a post by its ID.

```tsx
postById: (_parent, args: { id: number }, context: Context) => {
  return context.prisma.post.findUnique({
    where: { id: args.id }
  })
},
```

- Sample query

```graphql
{
  postById(id: 1) {
    id
    title
    content
    published
    viewCount
    author {
      id
      name
      email
    }
  }
}
```

### `Query.feed(searchString: String, skip: Int, take: Int): [Post!]!`

Fetches all published posts and optionally paginates and/or filters them by checking whether the search string appears in either title or content.

- Solution

```tsx
feed: (
  _parent,
  args: {
    searchString: string | undefined;
    skip: number | undefined;
    take: number | undefined;
  },
  context: Context
) => {
  const or = args.searchString
    ? {
        OR: [
          { title: { contains: args.searchString as string } },
          { content: { contains: args.searchString as string } },
        ],
      }
    : {};

  return context.prisma.post.findMany({
    where: {
      published: true,
      ...or,
    },
    skip: Number(args.skip) || undefined,
    take: Number(args.take) || undefined,
  });
},
```

- Sample query

```graphql
{
  feed {
    id
    title
    content
    published
    viewCount
    author {
      id
      name
      email
    }
  }
}
```

### `Query.draftsByUser(id: Int!): [Post]`

Fetches the unpublished posts of a specific user.

```tsx
draftsByUser: (_parent, args: { id: number }, context: Context) => {
  return context.prisma.user.findUnique({
    where: { id: args.id }
  }).posts({
    where: {
      published: false
    }
  })
},
```

```graphql
{
  draftsByUser(id: 3) {
    id
    title
    content
    published
    viewCount
    author {
      id
      name
      email
    }
  }
}
```

### `Mutation.signupUser(name: String, email: String!): User!`

Creates a new user.

```tsx
signupUser: (
  _parent,
  args: { name: string | undefined; email: string },
  context: Context
) => {
  return context.prisma.user.create({
    data: {
      name: args.name,
      email: args.email
    }
  })
},
```

```graphql
mutation {
  signupUser(name: "Nikolas", email: "burk@prisma.io") {
    id
    posts {
      id
    }
  }
}
```

### `Mutation.createDraft(title: String!, content: String, authorEmail: String): Post`

Creates a new post.

- Solution

```tsx
createDraft: (
  _parent,
  args: { title: string; content: string | undefined; authorEmail: string },
  context: Context
) => {
  return context.prisma.post.create({
    data: {
      title: args.title,
      content: args.content,
      author: {
        connect: {
          email: args.authorEmail
        }
      }
    }
  })
},
```

- Sample mutation

```graphql
mutation {
  createDraft(title: "Hello World", authorEmail: "burk@prisma.io") {
    id
    published
    viewCount
    author {
      id
      email
      name
    }
  }
}
```

### `Mutation.incrementPostViewCount(id: Int!): Post`

Increments the views of a post by 1.

- Solution

```tsx
incrementPostViewCount: (
  _parent,
  args: { id: number },
  context: Context
) => {
  return context.prisma.post.update({
    where: { id: args.id },
    data: {
      viewCount: {
        increment: 1
      }
    }
  })
},
```

- Sample mutation

```graphql
mutation {
  incrementPostViewCount(id: 1) {
    id
    viewCount
  }
}
```

### `Mutation.deletePost(id: Int!): Post`

Deletes a post.

- Solution

```tsx
deletePost: (_parent, args: { id: number }, context: Context) => {
  return context.prisma.post.delete({
    where: { id: args.id }
  })
},
```

- Sample mutation

```graphql
mutation {
  deletePost(id: 1) {
    id
  }
}
```

### `User.posts: [Post!]!`

Returns the posts of a given user.

- Solution

```tsx
User: {
  posts: (parent, _args, context: Context) => {
    return context.prisma.user.findUnique({
      where: { id: parent.id }
    }).posts()
  },
},
```

### `Post.author: User`

Returns the author of a given post.

- Solution

---

`id`: an auto-incrementing integer to uniquely identify each user in the database

explore some of the available database queries you can send with it. You'll learn about CRUD queries, relation queries (like nested writes), filtering and pagination. Along the way, you will run another migration to introduce a second model with a _[relation](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)_ to the `User` model that you created before.

```bash
yarn dev
```

```ts title="update an existing record"
async function main() {
  const updateOneRecord = await prisma.user.update({
    where: {
      email: "alice@prisma.io"
    },
    data: {
      name: "Alice"
    }
  })
  console.log(updateOneRecord)
}
```

`id`: an auto-incrementing integer to uniquely identify each post in the database

`author` and `authorId`: configures a _relation_ from a post to a user who should be considered the author of the post; the relation should be _optional_ so that a post doesn't necessarily need an author in the database; note that _all_ relations in Prisma are bi-directional, meaning you'll need to add the second side of the relation on the already existing `User` model as well

the `authorId` foreign key column in the database.

set foreign keys but you can configure relations

```ts title="update an existing related record"
async function main() {
  const updateOneRelatedRecord = await prisma.post.update({
    where: { id: 1 },
    data: {
      author: {
        connect: { email: "alice@prisma.io" }
      }
    }
  })
  console.log(updateOneRelatedRecord)
}
```

```ts
const result: (User & { posts: Post[] }) | null

type Post = {
  id: number
  title: string
  content: string | null
  published: boolean
  authorId: number | null
}

type User = {
  id: number
  name: string | null
  email: string
}
```

```tsx
async function main() {
  const newUserWithRelatedPost = await prisma.user.create({
    data: {
      name: "Nikolas",
      email: "burk@prisma.io",
      posts: {
        create: { title: "A practical introduction to Prisma" }
      }
    }
  })
  console.log(newUserWithRelatedPost)
}
```

```ts title=""
async function main() {
  const pagination = await prisma.user.findMany({
    skip: 2,
    take: 2
  })
  console.log(pagination)
}
```

Prisma Client supports _atomic operations_ on integers. Write a Prisma Client query that updates an existing `Post` record by increasing the value of its `viewCount` by 1.

```jsx
async function main() {
  const result = await prisma.post.update({
    where: { id: 1 },
    data: {
      viewCount: {
        increment: 1
      }
    }
  })
  console.log(result)
}
```

## `prisma/schema.prisma`

Prisma Schema Language (PSL) : An intuitive data modeling language. [Docs](https://www.prisma.io/docs/concepts/components/prisma-schema), [Relations (Reference)](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)

The **single source of truth** for the **models** of your application. Models represent the **entities** of your application domain. A model defines a number of **fields**. Fields can include **relations** between models, **attributes**, and **modifiers**.

Schema forms the foundation of **queries**. It **maps** to tables (relational databases like **PostgreSQL** using Prisma Migrate) or collections (**MongoDB**) in your database.

### Modifiers

Examples : `[]`, `?`

Modifiers cannot be combined. --> Optional lists are not supported.

The default value of an optional field is `null`.

### Attributes

Attributes modify the behavior of fields or model blocks.

Field attributes : `@id`, `@default`, `@unique`, `@relation`

Block attribute : `@@unique`

> `@default` accepts arguments

Prisma's model naming conventions (singular form, PascalCase) do not always match table/collection names in database. A common approach for naming tables/collections in databases is to use plural form and snake_case notation.

A Prisma schema can only have **one** [data source](https://www.prisma.io/docs/concepts/components/prisma-schema/data-sources).

A Prisma schema can have **one or more** [generators](https://www.prisma.io/docs/concepts/components/prisma-schema/generators). The generator for Prisma's JavaScript Client accepts multiple properties.

```prisma title="accept multiple properties"
generator client {
  provider = "prisma-client-js"
  output   = "./generated/prisma-client-js"
}
```

### Schema of a blog app

```prisma title="schema of a blog app"
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  email     String   @unique
  firstName String?
  lastName  String?
  isAdmin   Boolean  @default(false)
  role      Role     @default(USER)
  profile   Profile?
  posts     Post[]

  @@unique([firstName, lastName])
}

enum Role {
  USER
  ADMIN
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique
}

model Post {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  title     String
  content   String?
  published Boolean   @default(false)
  author    User?      @relation(fields: [authorId], references: [id])
  authorId  Int?
  keywords  String[] // a scalar list
  // categories Category[] @relation(references: [id])
  // a list of related models
  // a post can have many comments
  comments  Comment[]
  viewCount Int     @default(0)
}

model Category {
  id   Int    @id @default(autoincrement())
  name String
  // posts Post[] @relation(references: [id])
}

model Comment {
  id      Int     @id @default(autoincrement())
  title   String
  content String?
  // a comment can have one post
  Post    Post?   @relation(fields: [postId], references: [id])
  postId  Int?
}

model Tag {
  name String @id
}

model Comment {
}
```

An illustration by [Prisma](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model) showing the relations between models.

![the relations between models](https://www.prisma.io/docs/static/fc0ed56f4213ebf4d2309c0965b166da/3c492/sample-database.png)

A relation field's type is another model.

> One User record

> Two nested Post records

> Three nested Category records

```ts title="an example query"
const user = await prisma.user.create({
  data: {
    email: "ariadne@prisma.io",
    name: "Ariadne",
    posts: {
      create: [
        {
          title: "My first day at Prisma",
          categories: {
            create: {
              name: "Office"
            }
          }
        },
        {
          title: "How to connect to a SQLite database",
          categories: {
            create: [{ name: "Databases" }, { name: "Tutorials" }]
          }
        }
      ]
    }
  }
})
```

```json title="package.json"
"prisma": {
  "schema": "db/schema.prisma"
}
```

This comment will show up in the abstract syntax tree (AST) of the schema file as descriptions to AST nodes. Tools can then use these comments to provide additional information. All comments are attached to the next available node - free-floating comments are not supported and are not included in the AST.

The User record is connected to the two other ones via

`Post.author` ↔ `User.posts`
`Profile.user` ↔ `User.profile`
[relation fields](https://www.prisma.io/docs/concepts/components/prisma-schema/relations#relation-fields) respectively. [Relation queries](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#nested-writes)

"publish" the Post record you just created using an update query.

## Prisma Migrate

An imperative schema [migration tool](https://www.prisma.io/docs/concepts/components/prisma-migrate)

An illustration by [Prisma.io](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/install-prisma-client-typescript-postgres) showing typical workflow with Prisma Migrate.

![Typical workflow with Prisma Migrate](https://www.prisma.io/docs/static/153657b52bde1b006c94234b5753d495/3c492/prisma-migrate-development-workflow.png)

An illustration by [Prisma.io](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/install-prisma-client-typescript-postgres) showing the workflow of `prisma generate`

![prisma generate](https://res.cloudinary.com/prismaio/image/upload/v1628761155/docs/FensWfo.png)

## Prisma Client

A type-safe query builder. Query result is statically typed --> Can't accidentally access a property that doesn't exist. [Docs](https://www.prisma.io/docs/concepts/components/prisma-client), [API Reference](https://www.prisma.io/docs/concepts/components/prisma-client)

[REST API](https://www.prisma.io/docs/concepts/overview/prisma-in-your-stack/rest), [GraphQL API](https://www.prisma.io/docs/concepts/overview/prisma-in-your-stack/graphql)

```bash title="create a user with a post"
npx ts-node scripts/03addUser.ts

# by default, Prisma only returns scalar fields
{ id: 2, email: 'bob@prisma.io', name: 'Bob' }
```

## Prisma Studio

[prisma-examples repository](https://github.com/prisma/prisma-examples/), [Build a REST API with NestJS](https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0)

[rest-nextjs-api-routes](https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-nextjs-api-routes) : Simple Next.js app (React) with a REST API

[graphql-nextjs](https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql-nextjs) : Simple Next.js app (React) with a GraphQL API

[graphql-apollo-server](https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql) : Simple GraphQL server based on apollo-server

[rest-express](https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-express) : Simple REST API with Express.JS

[grpc](https://github.com/prisma/prisma-examples/tree/latest/typescript/grpc) : Simple gRPC API

## Relations

A user can have many blog posts.

```prisma title="a relationship in a relational database"
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  author   User @relation(fields: [authorId], references: [id])
  authorId Int // relation scalar field
}
```

```prisma title="a relationship in MongoDB"
model User {
  id    String @id @default(auto()) @map("_id") @db.ObjectId
  posts Post[]
}

model Post {
  id       String @id @default(auto()) @map("_id") @db.ObjectId
  author   User   @relation(fields: [authorId], references: [id])
  authorId String @db.ObjectId // relation scalar field
}
```

> The relation fields, `author` and `posts`, define connections between models at the Prisma level and do not exist in the database. These fields are used to generate the Prisma Client.

The scalar authorId field, which is referenced by the @relation attribute. This field does exist in the database - it is the foreign key that connects Post and User.

showing an one-to-many relationship between a user and posts table in a relational database

![an one-to-many relationship between a user and posts table in a relational database](https://www.prisma.io/docs/static/e83a6a5933258930b5e6b7bc6f1bf839/5819f/one-to-many.png)

In SQL, you use a foreign key to create a relation between two tables. Foreign keys are stored on one side of the relation. Our example is made up of:

A foreign key column in the Post table named authorId.
A primary key column in the User table named id. The authorId column in the Post table references the id column in the User table.
In the Prisma schema, the foreign key / primary key relationship is represented by the @relation attribute on the author field:

author User @relation(fields: [authorId], references: [id])
Note: Relations in the Prisma schema represent relationships that exist between tables in the database. If the relationship does not exist in the database, it does not exist in the Prisma schema.

MongoDB
For MongoDB, Prisma currently uses a normalized data model design, which means that documents reference each other by ID in a similar way to relational databases.

The following document represents a User (in the User collection):

```json
{ "_id": { "$oid": "60d5922d00581b8f0062e3a8" }, "name": "Ella" }
```

The following list of Post documents (in the Post collection) each have a userId field which reference the same user:

```json
[
  {
    "_id": { "$oid": "60d5922e00581b8f0062e3a9" },
    "title": "How to make sushi",
    "authorId": { "$oid": "60d5922d00581b8f0062e3a8" }
  },
  {
    "_id": { "$oid": "60d5922e00581b8f0062e3aa" },
    "title": "How to re-install Windows",
    "authorId": { "$oid": "60d5922d00581b8f0062e3a8" }
  }
]
```

This data structure represents a one-to-many relation because multiple Post documents refer to the same User document.

@db.ObjectId on IDs and relation scalar fields
If your model's ID is an ObjectId (represented by a String field), you must add @db.ObjectId to the model's ID and the relation scalar field on the other side of the relation:

Relations in the Prisma Client

get, create, and update records

The following query creates a User record and two connected Post records:

```ts
const userAndPosts = await prisma.user.create({
  data: {
    posts: {
      create: [
        { title: "Prisma Day 2020" }, // Populates authorId with user's id
        { title: "How to write a Prisma schema" } // Populates authorId with user's id
      ]
    }
  }
})
```

creates a User with an auto-generated id (for example, 20)

creates two new Post records and sets the authorId of both records to 20

```ts title="retrieves a User by id and includes any related Post records"
const getAuthor = await prisma.user.findUnique({
  where: {
    id: "20"
  },
  include: {
    posts: true // All posts where authorId == 20
  }
})
```

Retrieves the User record with an id of 20

Retrieves all Post records with an authorId of 20

The following query associates an existing Post record with an existing User record:

```ts
const updateAuthor = await prisma.user.update({
  where: {
    id: 20
  },
  data: {
    posts: {
      connect: {
        id: 4
      }
    }
  }
})
```

this query uses a nested connect query to link the post with an id of 4 to the user with an id of 20. The query does this with the following steps:

The query first looks for the user with an id of 20.
The query then sets the authorID foreign key to 20. This links the post with an id of 4 to the user with an id of 20.
In this query, the current value of authorID does not matter. The query changes authorID to 20, no matter its current value.

Types of relations

There are three different types (or cardinalities) of relations in Prisma:

One-to-one (also called 1-1 relations)
One-to-many (also called 1-n relations)
Many-to-many (also called m-n relations)

The following Prisma schema includes every type of relation:

one-to-one : User ↔ Profile
one-to-many : User ↔ Post
many-to-man y: Post ↔ Category

```prisma
model User {
  id      Int      @id @default(autoincrement())
  posts   Post[]
  profile Profile?
}

model Profile {
  id     Int  @id @default(autoincrement())
  user   User @relation(fields: [userId], references: [id])
  userId Int  @unique // relation scalar field
}

model Post {
  id         Int        @id @default(autoincrement())
  author     User       @relation(fields: [authorId], references: [id])
  authorId   Int // relation scalar field
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  posts Post[]
}
```

This schema is the same as the example data model but has all scalar fields removed (except for the required relation scalars) so you can focus on the relation fields.
This example uses implicit many-to-many relations. These relations do not require the @relation attribute unless you need to disambiguate relations.

Notice that the syntax is slightly different between relational databases and MongoDB - particularly for many-to-many relations.

For relational databases, the following entity relationship diagram represents the database that corresponds to the sample Prisma schema:

showing the entity relationship diagram

![the entity relationship diagram](https://www.prisma.io/docs/static/80c7aa384ca962faf5be1ee91f89aa7e/3c492/sample-schema.png)

For MongoDB, Prisma uses a normalized data model design, which means that documents reference each other by ID in a similar way to relational databases. See the MongoDB section for more details.

Implicit and explicit many-to-many relations
Many-to-many relations in relational databases can be modelled in two ways:

explicit many-to-many relations, where the relation table is represented as an explicit model in your Prisma schema

implicit many-to-many relations, where Prisma manages the relation table and it does not appear in the Prisma schema.

Implicit many-to-many relations require both models to have a single @id. Be aware of the following:

You cannot use a multi-field ID
You cannot use a @unique in place of an @id
To use either of these features, you must set up an explicit many-to-many instead.

The implicit many-to-many relation still manifests in a relation table in the underlying database. However, Prisma manages this relation table.

If you use an implicit many-to-many relation instead of an explicit one, it makes the Prisma Client API simpler (because, for example, you have one fewer level of nesting inside of nested writes).

If you're not using Prisma Migrate but obtain your data model from introspection, you can still make use of implicit many-to-many relations by following Prisma's conventions for relation tables.

Relation fields
Relational databases
MongoDB

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  role  Role   @default(USER)
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int // relation scalar field
}
```

These models have the following fields:

Relational databases
MongoDB
Model Field Relational Relation field
User id Int No
email String No
role Role No
posts Post[] Yes (Prisma-level)
Post id Int No
title String No
authorId Int No (relation scalar field)
author User Yes (annotated)

Both posts and author are relation fields because their types are not scalar types but other models.

Also note that the annotated relation field author needs to link the relation scalar field authorId on the Post model inside the @relation attribute. The relation scalar represents the foreign key in the underlying database.

The other relation field called posts is defined purely on a Prisma-level, it doesn't manifest in the database.

Annotated relation fields
Relations that require one side of the relation to be annotated with the @relation attribute are referred to as annotated relation fields. This includes:

one-to-one relations
one-to-many relations
many-to-many relations for MongoDB only
The side of the relation which is annotated with the @relation attribute represents the side that stores the foreign key in the underlying database. The "actual" field that represents the foreign key is required on that side of the relation as well, it's called relation scalar field, and is referenced inside @relation attribute:

Relational databases
MongoDB

```
author     User    @relation(fields: [authorId], references: [id])
authorId   Int
```

A scalar field becomes a relation scalar field when it's used in the fields of a @relation attribute.

Relation scalar fields
Relation scalar fields are read-only in the generated Prisma Client API. If you want to update a relation in your code, you can do so using nested writes.

Relation scalar naming conventions
Because a relation scalar field always belongs to a relation field, the following naming convention is common:

Relation field: author
Relation scalar field: authorId (relation field name + Id)

## The @relation attribute

The @relation attribute can only be applied to the relation fields, not to scalar fields.

The @relation attribute is required when:

you define a one-to-one or one-to-many relation, it is required on one side of the relation (with the corresponding relation scalar field)
you need to disambiguate a relation (that's e.g. the case when you have two relations between the same models)
you define a self-relation
you define a many-to-many relation for MongoDB
you need to control how the relation table is represented in the underlying database (e.g. use a specific name for a relation table)
Note: Implicit many-to-many relations in relational databases do not require the @relation attribute.

Disambiguating relations
When you define two relations between the same two models, you need to add the name argument in the @relation attribute to disambiguate them. As an example for why that's needed, consider the following models:

Relational databases
MongoDB

```prisma
model User {
  id           Int     @id @default(autoincrement())
  name         String?
  writtenPosts Post[]
  pinnedPost   Post?
}

model Post {
  id         Int     @id @default(autoincrement())
  title      String?
  author     User    @relation(fields: [authorId], references: [id])
  authorId   Int
  pinnedBy   User?   @relation(fields: [pinnedById], references: [id])
  pinnedById Int?
}
```

In that case, the relations are ambiguous, there are four different ways to interpret them:

User.writtenPosts ↔ Post.author + Post.authorId
User.writtenPosts ↔ Post.pinnedBy + Post.pinnedById
User.pinnedPost ↔ Post.author + Post.authorId
User.pinnedPost ↔ Post.pinnedBy + Post.pinnedById

To disambiguate these relations, you need to annotate the relation fields with the @relation attribute and provide the name argument. You can set any name (except for the empty string ""), but it must be the same on both sides of the relation:

Relational databases
MongoDB

```prisma
model User {
  id           Int     @id @default(autoincrement())
  name         String?
  writtenPosts Post[]  @relation("WrittenPosts")
  pinnedPost   Post?   @relation("PinnedPost")
}

model Post {
  id         Int     @id @default(autoincrement())
  title      String?
  author     User    @relation("WrittenPosts", fields: [authorId], references: [id])
  authorId   Int
  pinnedBy   User?   @relation(name: "PinnedPost", fields: [pinnedById], references: [id])
  pinnedById Int?
}
```

---

## Prisma with MongoDB

The [MongoDB database connector](https://www.prisma.io/docs/concepts/database-connectors/mongodb) uses transactions to support nested writes. Transactions requires a [replica set](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set/) deployment. The easiest way to deploy a replica set is with [Atlas](https://www.mongodb.com/docs/atlas/getting-started/). [Migrate from Mongoose](https://www.prisma.io/docs/guides/migrate-to-prisma/migrate-from-mongoose)

MongoDB projects do not rely on internal schemas where changes need to be managed with an extra tool. Management of @unique indexes is realized through db push. --> NO Prisma Migrate

Primary keys in MongoDB are always on the \_id field of a model. --> NO @@id attribute and autoincrement()

MongoDB only allows you to start a transaction on a replica set. Prisma uses transactions internally to avoid partial writes on nested queries. This means we inherit the requirement of needing a replica set configured.

An illustration by [Prisma](https://www.prisma.io/docs/concepts/database-connectors/mongodb) showing the structure of a MongoDB connection URL

![Structure of MongoDB connection URL](https://www.prisma.io/docs/static/b5ef4062c4686c772571b3079ba1331c/3c492/mongodb.png)

```env title=".env"
DATABASE_URL="mongodb+srv://<username>:<password>@<host>/testDB"
```

[MongoDB schema reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#mongodb-2)

include the posts relations on the returned User objects

Type mapping between MongoDB and the Prisma schema

Prisma schema reference for type mappings organized by Prisma type.

Mapping from Prisma to MongoDB types on migration

The MongoDB connector maps the scalar types from the Prisma data model to MongoDB's native column types as follows:

Prisma MongoDB, String string, Boolean bool, Int int, BigInt long, Float double, DateTime timestamp, Date date, Bytes binData

## Prisma with PostgreSQL

[SSL with PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql#configuring-an-ssl-connection)

[Connection URLs (Reference)](https://www.prisma.io/docs/reference/database-reference/connection-urls)

Connect your database

prisma/schema.prisma

```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

```env
DATABASE_URL="postgresql://janedoe:janedoe@localhost:5432/janedoe?schema=hello-prisma"

DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

DATABASE_URL="postgresql://opnmyfngbknppm:XXX@ec2-46-137-91-216.eu-west-1.compute.amazonaws.com:5432/d50rgmkqi2ipus?schema=hello-prisma"
```

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

DATABASE: The name of the database

SCHEMA: The name of the schema inside the database

Using Prisma Migrate

prisma/schema.prisma

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String   @db.VarChar(255)
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  user   User    @relation(fields: [userId], references: [id])
  userId Int     @unique
}

model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  posts   Post[]
  profile Profile?
}
```

```bash
npx prisma migrate dev --name init
```

create a new SQL migration file for this migration

run the SQL migration file against the database

`generate` is called under the hood by default, after running `prisma migrate dev`

## misc

```bash title=""
# turn your database schema into a Prisma schema https://pris.ly/d/prisma-schema
prisma db pull

# generate the Prisma Client https://pris.ly/d/getting-started
prisma generate
```

## Postgres.app

A full-featured PostgreSQL installation packaged as a standard Mac app.

[Docs](https://postgresapp.com/)

```bash title="configure $PATH to use CLI tools"
sudo mkdir -p /etc/paths.d &&
echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp

# Host : localhost
# Port : 5432
# User : your system user name
# Database : same as user
# Password: none
# Connection URL: postgresql://localhost

# connect
psql
```

Graphical Clients

pgAdmin 4 is an open source PostgreSQL client.

Postico is a commercial Mac app, made by the same people that maintain Postgres.app

Invoke autocompletion by pressing the CTRL+SPACE keys on your keyboard.

## Next

filtering, sorting, pagination, updating and deleting

---

[Fullstack app with TypeScript, Next.js, Prisma & GraphQL](https://www.prisma.io/blog/fullstack-nextjs-graphql-prisma-oklidw1rhw)

Next.js, Apollo Server, Apollo Client, Nexus (construct GraphQL schema), Prisma (ORM for migrations and database access), PostgreSQL, AWS S3, Auth0, TypeScript, TailwindCSS,
Vercel

```bash title=""
# clone
git clone -b part-1 https://github.com/m-abdelwahab/awesome-links.git

# create a basic Prisma setup
npx prisma init

# start the development server
yarn dev
```

## Prisma, an ORM

```prisma title="schema.prisma"
model User {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  email     String?  @unique
  image     String?
  role      Role     @default(USER)
  // a user can have many links and a link can have many usersa
  bookmarks Link[]
}

enum Role {
  USER
  ADMIN
}

model Link {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  title       String
  description String
  url         String
  imageUrl    String
  category    String
  users       User[]
}
```

![database](https://prisma-blog-ebon.vercel.app/blog/posts/database-url-breakdown.png)

Host HOST IP address/domain of your database server, e.g. localhost

Port PORT Port on which your database server is running, e.g. 5432

User USER Name of your database user, e.g. janedoe

Password PASSWORD Password for your database user

Database DATABASE Name of the database you want to use, e.g. mydb

PSL (Prisma Schema Language

In the datasource field, we specified that we're using PostgreSQL and that we're loading the database URL from the .env file.

Next, in the generator block, we're specifying that we want to generate Prisma Client based on our data models.

Prisma Client is an auto-generated and type-safe query builder

models are spelled in PascalCase and should use the singular form.

`User` instead of user, users or Users.

All fields are required by default. To make a field optional, can add a ? after the field type.

## Migrating and pushing changes to the database

prisma db push is useful for schema prototyping, where the goal is to synchronize a new schema with a development database. As your schema evolves, you will want to create and maintain a migration history, to do that you will use Prisma Migrate.

Seeding the database

Since the database is currently empty, we want to populate it with data. The first thing we need to do is install Prisma Client, a type-safe query builder, which will allow us to interact with our database.

use Prisma's integrated seeding functionality

the createMany() function to create multiple records. We are passing the hard-coded data we have as a parameter.

By default, Next.js forces the use of ESNext modules, we need to override this behavior or else we will not be able to execute the seeding script. To do so, first install ts-node as a development dependency:

Then in the tsconfig.json file, specify that ts-node will use CommonJS modules.

npx prisma db seed

If everything worked correctly you should see the following output:

Environment variables loaded from .envPrisma schema loaded from prisma/schema.prismaRunning seed: ts-node --compiler-options '{"module":"CommonJS"}' "prisma/seed.ts" ...
🌱 Your database has been seeded.
Use Prisma Studio to explore your database

Prisma comes with Prisma Studio, a GUI for exploring and manipulating your data. You can use it to view, create, update or delete data from your database.

If you've done all the steps correctly you should you have the Link and User models inside your database. Inside the Link model you'll find 4 records and for the User model you'll find 1 record.
