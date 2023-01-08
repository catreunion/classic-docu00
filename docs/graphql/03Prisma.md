---
sidebar_position: 3
---

# Prisma

◭ [Prisma](https://prisma.io), an open source Object-Relational Mapper (ORM), is a modern DB toolkit to model, migrate, and query a database. [prisma-examples repo](https://github.com/prisma/prisma-examples/), [What is Prisma? (Overview)](https://www.prisma.io/docs/concepts/overview/what-is-prisma)

Relational databases
MongoDB

## A plain TS project

[Quickstart with TypeScript & SQLite](https://www.prisma.io/docs/getting-started/quickstart), [Get started](https://pris.ly/d/getting-started), [Prisma schema](https://pris.ly/d/prisma-schema), [tsconfig.json](https://aka.ms/tsconfig)

```bash title="setup a TS project with Prisma"
# initialize a project
yarn init -y

# install dev dependencies
yarn add -D typescript ts-node @types/node prisma

# install dependencies
yarn add @prisma/client

# create tsconfig.json
npx tsc --init

# create prisma/schema.prisma & .env
npx prisma init --datasource-provider sqlite
```

```env title=".env"
DATABASE_URL="file:./dev.db"
```

## Data modeling

A Prisma schema can only have one [data source](https://www.prisma.io/docs/concepts/components/prisma-schema/data-sources). [Configuring an SSL connection with PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql#configuring-an-ssl-connection)

```prisma title="if certificate files are located outside the ./prisma directory"
datasource db {
  provider = "postgresql"
  url      = "postgresql://johndoe:mypassword@localhost:5432/mydb?schema=public&sslmode=require&sslcert=../server-ca.pem&sslidentity=../client-identity.p12&sslpassword=<REDACTED>"
}
```

A Prisma schema can have one or more [generators](https://www.prisma.io/docs/concepts/components/prisma-schema/generators). <-- Specify what clients should be generated based on the data model (e.g. Prisma Client)

A generator determines which assets are created when you run the prisma generate command. The generator for Prisma's JavaScript Client accepts multiple additional properties.

```prisma title=""
generator client {
  provider = "prisma-client-js"
  output   = "./generated/prisma-client-js"
}
```

data model definition / application models / Prisma models is the single source of truth for the models of your application.

Made up of :

Models (model primitives) that define a number of fields, including relations between models

Enums (enum primitives) (if your connector supports Enums)

Attributes and functions that change the behavior of fields and models

data model is the single source of truth for the models of your application.

When used with TypeScript, Prisma Client provides generated type definitions for your models and any variations of them to make database access entirely type safe.

```prisma title="a schema describing a blogging platform"
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  role    Role     @default(USER)
  posts   Post[]
  profile Profile?
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique
}

model Post {
  id         Int        @id @default(autoincrement())
  createdAt  DateTime   @default(now())
  title      String
  published  Boolean    @default(false)
  author     User       @relation(fields: [authorId], references: [id])
  authorId   Int
  categories Category[] @relation(references: [id])
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[] @relation(references: [id])
}

enum Role {
  USER
  ADMIN
}
```

The corresponding database looks like this:

```ts title="2 nested Post records, 3 nested Category records"
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

Models represent the entities of your application domain. Models are represented by model blocks and define a number of fields.

Mapping model names to tables or collections

Prisma model naming conventions (singular form, PascalCase) do not always match table names in the database. A common approach for naming tables/collections in databases is to use plural form and snake_case notation - for example: comments. When you introspect a database with a table named comments, the result Prisma model will look like this:

```
model comments {
  // Fields
}
```

However, you can still adhere to the naming convention without renaming the underlying comments table in the database by using the @@map attribute:

```
model Comment {
  // Fields

  @@map("comments")
}
```

With this model definition, Prisma automatically maps the Comment model to the comments table in the underlying database.

Note: You can also @map a column name or enum value, and @@map an enum.

@map and @@map allow you to tune the shape of your Prisma Client API by decoupling model and field names from table and column names in the underlying database.

Defining fields
The properties of a model are called fields, which consist of:

A field name
A field type
Optional type modifiers
Optional attributes, including native database type attributes
A field's type determines its structure, and fits into one of two categories:

Scalar types (includes enums) that map to columns (relational databases) or document fields (MongoDB) in the database - for example, String or Int
Model types (the field is then called relation field) - for example Post or Comment[].
The following table describes User model's fields from the sample schema:

Expand to see table
Scalar fields
The following example extends the Comment and Tag models with several scalar types. Some fields include attributes:

Relational databases
MongoDB
model Comment {
id Int @id @default(autoincrement())
title String
content String
}

model Tag {
name String @id
}
See complete list of scalar field types .

Relation fields
A relation field's type is another model - for example, a post (Post) can have multiple comments (Comment[]):

Relational databases
MongoDB
model Post {
id Int @id @default(autoincrement())
// Other fields
comments Comment[] // A post can have many comments
}

model Comment {
id Int
// Other fields
Post Post? @relation(fields: [postId], references: [id]) // A comment can have one post
postId Int?
}
Refer to the relations documentation for more examples and information about relationships between models.

Native types mapping
Version 2.17.0 and later support native database type attributes (type attributes) that describe the underlying database type:

model Post {
id Int @id
title String @db.VarChar(200)
content String
}
Type attributes are:

Specific to the underlying provider - for example, PostgreSQL uses @db.Boolean for Boolean whereas MySQL uses @db.TinyInt(1)
Written in PascalCase (for example, VarChar or Text)
Prefixed by @db, where db is the name of the datasource block in your schema
Furthermore, during Introspection type attributes are only added to the schema if the underlying native type is not the default type. For example, if you are using the PostgreSQL provider, String fields where the underlying native type is text will not have a type attribute.

See complete list of native database type attributes per scalar type and provider .

Benefits and workflows
Control the exact native type that Prisma Migrate creates in the database - for example, a String can be @db.VarChar(200) or @db.Char(50)
See an enriched schema when you introspect
Type modifiers
The type of a field can be modified by appending either of two modifiers:

[] Make a field a list
? Make a field optional
Note: You cannot combine type modifiers - optional lists are not supported.

Lists
The following example includes a scalar list and a list of related models:

Relational databases
MongoDB
model Post {
id Int @id @default(autoincrement())
// Other fields
comments Comment[] // A list of comments
keywords String[] // A scalar list
}
Note: Scalar lists are only supported if the database connector supports scalar lists, either natively or at a Prisma level.

Optional and mandatory fields
Relational databases
MongoDB
model Comment {
id Int @id @default(autoincrement())
title String
content String?
}

model Tag {
name String @id
}
When not annotating a field with the ? type modifier, the field will be required on every record of the model. This has effects on two levels:

Databases
Relational databases: Required fields are represented via NOT NULL constraints in the underlying database.
MongoDB: Required fields are not a concept on a MongoDB database level.
Prisma Client: Prisma Client's generated TypeScript types that represent the models in your application code will also define these fields as required to ensure they always carry values at runtime.
Note: The default value of an optional field is null.

Unsupported types
When you introspect a relational database, unsupported types are added as Unsupported :

location Unsupported("polygon")?
The Unsupported attribute allows you to define fields in the Prisma schema for database types that are not yet supported by Prisma. For example, MySQL's POLYGON type is not currently supported by Prisma, but can now be added to the Prisma schema using the Unsupported("polygon") type.

Unsupported fields are not available in the generated Prisma Client API, but you can still use Prisma's raw database access feature to query these fields.

Note: If a model has mandatory Unsupported fields, the generated client will not include create or update methods for that model.

Note: The MongoDB connector does not support nor require the Unsupported type because it supports all scalar types.

Defining attributes
Attributes modify the behavior of fields or model blocks. The following example includes three field attributes (@id , @default , and @unique ) and one block attribute (@@unique ):

Relational databases
MongoDB
model User {
id Int @id @default(autoincrement())
firstName String
lastName String
email String @unique
isAdmin Boolean @default(false)

@@unique([firstName, lastName])
}
Some attributes accept arguments - for example, @default accepts true or false:

isAdmin Boolean @default(false) // short form of @default(value: false)
See complete list of field and block attributes

Defining an ID field
An ID uniquely identifies individual records of a model. A model can only have one ID:

In relational databases, the ID can be a single field with or based on multiple fields. If a model does not have an @id or an @@id, you must define a mandatory @unique field or @@unique block instead.
In MongoDB, an ID must be a single field that defines an @id attribute and a @map("\_id") attribute.
Defining IDs in relational databases
In relational databases, an ID can be defined by a single field using the @id attribute, or multiple fields using the @@id attribute.

Single field IDs
In the following example, the User ID is represented by the id integer field:

model User {
id Int @id @default(autoincrement())
email String @unique
name String?
role Role @default(USER)
posts Post[]
profile Profile?
}
Composite IDs
In the following example, the User ID is represented by a combination of the firstName and lastName fields:

model User {
firstName String
lastName String
email String @unique
isAdmin Boolean @default(false)

@@id([firstName, lastName])
}
@unique fields as unique identifiers
In the following example, users are uniquely identified by a @unique field. Because the email field functions as a unique identifier for the model (which is required by Prisma), it must be mandatory:

model User {
email String @unique
name String?
role Role @default(USER)
posts Post[]
profile Profile?
}
Constraint names in relational databases
You can optionally define a custom primary key constraint name in the underlying database.

Defining IDs in MongoDB
The MongoDB connector has specific rules for defining an ID field that differs from relational databases. An ID must be defined by a single field using the @id attribute and must include @map("\_id").

In the following example, the User ID is represented by the id string field that accepts an auto-generated ObjectId:

model User {
id String @id @default(auto()) @map("\_id") @db.ObjectId
email String @unique
name String?
role Role @default(USER)
posts Post[]
profile Profile?
}
In the following example, the User ID is represented by the id string field that accepts something other than an ObjectId - for example, a unique username:

model User {
id String @id @map("\_id")
email String @unique
name String?
role Role @default(USER)
posts Post[]
profile Profile?
}
MongoDB does not support @@id
MongoDB does not support composite IDs, which means you cannot identify a model with a @@id block.

Defining a default value
You can define default values for scalar fields of your models using the @default attribute:

Relational databases
MongoDB
model Post {
id Int @id @default(autoincrement())
createdAt DateTime @default(now())
title String
published Boolean @default(false)
author User @relation(fields: [authorId], references: [id])
authorId Int
categories Category[] @relation(references: [id])
}
@default attributes either:

Represent DEFAULT values in the underlying database (relational databases only) or
Use a Prisma-level function. For example, cuid() and uuid() are provided by Prisma's query engine for all connectors.
Default values can be:

Static values that correspond to the field type, such as 5 (Int), Hello (String), or false (Boolean)
Lists of static values, such as [5, 6, 8] (Int[]) or ["Hello", "Goodbye"] (String[]). These are available in versions 4.0.0 and later, when using databases where Prisma supports them (PostgreSQL, CockroachDB and MongoDB)
Functions, such as now() or uuid()
Refer to the attribute function reference documentation for information about connector support for functions.

Defining a unique field
You can add unique attributes to your models to be able to uniquely identify individual records of that model. Unique attributes can be defined on a single field using @unique attribute, or on multiple fields (also called composite or compound unique constraints) using the @@unique attribute.

In the following example, the value of the email field must be unique:

Relational databases
MongoDB
model User {
id Int @id @default(autoincrement())
email String @unique
name String?
}
In the following example, a combination of authorId and title must be unique:

Relational databases
MongoDB
model Post {
id Int @id @default(autoincrement())
createdAt DateTime @default(now())
title String
published Boolean @default(false)
author User @relation(fields: [authorId], references: [id])
authorId Int
categories Category[] @relation(references: [id])

@@unique([authorId, title])
}
Constraint names in relational databases
You can optionally define a custom unique constraint name in the underlying database.

Composite type unique constraints
When using the MongoDB provider in version 3.12.0 and later, you can define a unique constraint on a field of a composite type using the syntax @@unique([compositeType.field]). As with other fields, composite type fields can be used as part of a multi-column unique constraint.

The following example defines a multi-column unique constraint based on the email field of the User model and the number field of the Address composite type which is used in User.address:

schema.prisma
type Address {
street String
number Int
}

model User {
id Int @id
email String
address Address

@@unique([email, address.number])
}
This notation can be chained if there is more than one nested composite type:

schema.prisma

type City {
name String
}

type Address {
number Int
city City
}

model User {
id Int @id
address Address[]

@@unique([address.city.name])
}
Defining an index
You can define indexes on one or multiple fields of your models via the @@index on a model. The following example defines a multi-column index based on the title and content field:

model Post {
id Int @id @default(autoincrement())
title String
content String?

@@index([title, content])
}
Index names in relational databases
You can optionally define a custom index name in the underlying database.

Defining composite type indexes
When using the MongoDB provider in version 3.12.0 and later, you can define an index on a field of a composite type using the syntax @@index([compositeType.field]). As with other fields, composite type fields can be used as part of a multi-column index.

The following example defines a multi-column index based on the email field of the User model and the number field of the Address composite type:

schema.prisma
type Address {
street String
number Int
}

model User {
id Int @id
email String
address Address

@@index([email, address.number])
}
This notation can be chained if there is more than one nested composite type:

schema.prisma

type City {
name String
}

type Address {
number Int
city City
}

model User {
id Int @id
address Address[]

@@index([address.city.name])
}
Defining enums
You can define enums in your data model if enums are supported for your database connector, either natively or at Prisma level.

Enums are considered scalar types in the Prisma data model. They're therefore by default included as return values in Prisma Client queries.

Enums are defined via the enum block. For example, a User has a Role:

Relational databases
MongoDB
model User {
id Int @id @default(autoincrement())
email String @unique
name String?
role Role @default(USER)
}

enum Role {
USER
ADMIN
}
Defining composite types
Composite types were added in version 3.10.0 under the mongodb Preview feature flag and are in General Availability since version 3.12.0.

Composite types are currently only available on MongoDB.

Composite types (known as embedded documents in MongoDB) provide support for embedding records inside other records, by allowing you to define new object types. Composite types are structured and typed in a similar way to models.

To define a composite type, use the type block. As an example, take the following schema:

schema.prisma
model Product {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
photos Photo[]
}

type Photo {
height Int
width Int
url String
}
In this case, the Product model has a list of Photo composite types stored in photos.

Considerations when using composite types
Composite types only support a limited set of attributes. The following attributes are supported:

@default
@map
Native types, such as @db.ObjectId
The following attributes are not supported inside composite types:

@unique
@id
@relation
@ignore
@updatedAt
However, unique constraints can still be defined by using the @@unique attribute on the level of the model that uses the composite type. For more details, see Composite type unique constraints.

Indexes can be defined by using the @@index attribute on the level of the model that uses the composite type. For more details, see Composite type indexes.

Using functions
The Prisma schema supports a number of functions . These can be used to specify default values on fields of a model.

For example, the default value of createdAt is now() :

Relational databases
MongoDB
model Post {
id Int @id @default(autoincrement())
createdAt DateTime @default(now())
}
cuid() and uuid() are implemented by Prisma and therefore are not "visible" in the underlying database schema. You can still use them when using introspection by manually changing your Prisma schema and generating Prisma Client, in that case the values will be generated by Prisma's query engine

Support for autoincrement() , now() and dbgenerated() differ between databases.

Relational database connectors implement autoincrement(), dbgenerated(), and now() at database level. The MongoDB connector does not support autoincrement() or dbgenerated(), and now() is implemented at Prisma level. The auto() function is used to generate an ObjectId.

Relations
Refer to the relations documentation for more examples and information about relationships between models.

Models in Prisma Client
Queries (CRUD)
Every model in the data model definition will result in a number of CRUD queries in the generated Prisma Client API:

findMany
findFirst
findFirstOrThrow
findUnique
findUniqueOrThrow
create
update
upsert
delete
createMany
updateMany
deleteMany
The operations are accessible via a generated property on the Prisma Client instance. By default the name of the property is the lowercase form of the model name, e.g. user for a User model or post for a Post model.

Here is an example illustrating the use of a user property from the Prisma Client API:

const newUser = await prisma.user.create({
data: {
name: 'Alice',
},
})
const allUsers = await prisma.user.findMany()
Type definitions
Prisma Client also generates type definitions that reflect your model structures. These are part of the generated @prisma/client node module.

When using TypeScript, these type definitions ensure that all your database queries are entirely type safe and validated at compile-time (even partial queries using select or include ).

Even when using plain JavaScript, the type definitions are still included in the @prisma/client node module, enabling features like IntelliSense/autocompletion in your editor.

Note: The actual types are stored in the .prisma/client folder. @prisma/client/index.d.ts exports the contents of this folder.

For example, the type definition for the User model from above would look as follows:

export type User = {
id: number
email: string
name: string | null
role: string
}
Note that the relation fields posts and profile are not included in the type definition by default. However, if you need variations of the User type you can still define them using some of Prisma Client's generated helper types (in this case, these helper types would be called UserGetIncludePayload and UserGetSelectPayload).

Data model definition: Specifies your application models (the shape of the data per data source) and their relations

See the Prisma schema API reference for detailed information about each section of the schema.

Whenever a prisma command is invoked, the CLI typically reads some information from the schema file, e.g.:

prisma generate: Reads all above mentioned information from the Prisma schema to generate the correct data source client code (e.g. Prisma Client).

prisma migrate dev: Reads the data sources and data model definition to create a new migration.

Several native data type attributes (@db.VarChar(255), @db.ObjectId)

```
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
  name      String?
  role      Role     @default(USER)
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  published Boolean  @default(false)
  title     String   @db.VarChar(255)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}

enum Role {
  USER
  ADMIN
}
```

Naming

```bash
prisma generate --schema ./database/myschema.prisma
# or
prisma generate --schema=./alternative/schema.prisma
```

Prisma Schema Language (PSL).

[VS Code extension]() for syntax highlighting, auto-format the contents, indicates syntax errors with red squiggly lines

```json title="package.json"
"prisma": {
  "schema": "db/schema.prisma"
}
```

/// This comment will show up in the abstract syntax tree (AST) of the schema file as descriptions to AST nodes. Tools can then use these comments to provide additional information. All comments are attached to the next available node - free-floating comments are not supported and are not included in the AST.

Two ways to format .prisma files :

Run the `prisma format` command.

Install the [Prisma VS Code extension]() and invoke the VS Code format action - manually or on save.

There are no configuration options - formatting rules are fixed (similar to Golang's gofmt but unlike Javascript's prettier):

The data model is a collection of models. Define application models in an intuitive data modeling language. [Docs](https://www.prisma.io/docs/concepts/components/prisma-schema), [Relations (Reference)](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)

```prisma title="prisma/schema.prisma"
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
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

The User record is connected to the two other ones via

`Post.author` ↔ `User.posts`

`Profile.user` ↔ `User.profile` [relation fields](https://www.prisma.io/docs/concepts/components/prisma-schema/relations#relation-fields) respectively. [Relation queries](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#nested-writes)

The numbers in

the `authorId` column on `Post` and

`userId` column on `Profile` both

reference the `id` column of the User table

"publish" the Post record you just created using an update query. Adjust the main function as follows:

## Prisma Migrate

An imperative schema [migration tool](https://www.prisma.io/docs/concepts/components/prisma-migrate)

An illustration by [Prisma.io](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/install-prisma-client-typescript-postgres) showing typical workflow with Prisma Migrate.

![Typical workflow with Prisma Migrate](https://www.prisma.io/docs/static/153657b52bde1b006c94234b5753d495/3c492/prisma-migrate-development-workflow.png)

```bash title="create database tables"
npx prisma migrate dev --name init
```

Create `prisma/migrations/` and `prisma/dev.db`

Generate **Prisma Client** in `node_modules/@prisma/client/`

An illustration by [Prisma.io](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/install-prisma-client-typescript-postgres) showing the workflow of `prisma generate`

![prisma generate](https://res.cloudinary.com/prismaio/image/upload/v1628761155/docs/FensWfo.png)

```bash title="more about Prisma CLI"
# show introduction
npx prisma

# whenever making changes in Prisma schema, need to invoke `prisma generate` to accommodate the changes
npx prisma generate

# pull the schema from an existing database, updating the Prisma schema
npx prisma db pull

# push the Prisma schema state to the database
npx prisma db push

# validate your Prisma schema
npx prisma validate

# format your Prisma schema
npx prisma format
```

## Prisma Client

A type-safe query builder. Query result is statically typed --> Can't accidentally access a property that doesn't exist. [Docs](https://www.prisma.io/docs/concepts/components/prisma-client), [API Reference](https://www.prisma.io/docs/concepts/components/prisma-client)

Prisma Client can be used in any Node.js (supported versions) or TypeScript backend application (including serverless applications and microservices). This can be a [REST API](https://www.prisma.io/docs/concepts/overview/prisma-in-your-stack/rest), a [GraphQL API](https://www.prisma.io/docs/concepts/overview/prisma-in-your-stack/graphql), a gRPC API, or anything else that needs a database.

Installing the `@prisma/client` package invokes the `prisma generate` command, which reads your Prisma schema and generates the Prisma Client code in `node_modules/.prisma/client`

```bash title="manually regenerate Prisma Client after a schema change"
prisma generate
```

CTRL + SPACE : Invoke autocompletion

```ts title="scripts/01addUser.ts"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const main = async () => {
  const newUser = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@prisma.io"
    }
  })
  console.log(newUser)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

```bash title="create a record of a given model"
npx ts-node scripts/01addUser.ts

{ id: 1, email: 'alice@prisma.io', name: 'Alice' }
```

```ts title="scripts/02getUsers.ts"
const main = async () => {
  const users = await prisma.user.findMany()
  console.log(users)
}
```

```bash title="retrieve all users"
npx ts-node scripts/02getUsers.ts

[ { id: 1, email: 'alice@prisma.io', name: 'Alice' } ]
```

```ts title="scripts/03addUser.ts"
const main = async () => {
  const newUser = await prisma.user.create({
    data: {
      name: "Bob",
      email: "bob@prisma.io",
      posts: {
        create: {
          title: "Hello World"
        }
      }
    }
  })
  console.log(newUser)
}
```

```bash title="create a user with a post"
npx ts-node scripts/03addUser.ts

# by default, Prisma only returns scalar fields
{ id: 2, email: 'bob@prisma.io', name: 'Bob' }
```

```ts title="scripts/04getUsers.ts"
const main = async () => {
  const usersWithPosts = await prisma.user.findMany({
    include: {
      posts: true
    }
  })
  console.dir(usersWithPosts, { depth: null })
}
```

```bash title="retrieve all users and their posts"
npx ts-node scripts/04getUsers.ts

[
  { id: 1, email: 'alice@prisma.io', name: 'Alice', posts: [] },
  {
    id: 2,
    email: 'bob@prisma.io',
    name: 'Bob',
    posts: [
      {
        id: 1,
        title: 'Hello World',
        content: null,
        published: false,
        authorId: 2
      }
    ]
  }
]
```

```ts title="scripts/05addUserBio.ts"
async function main() {
  await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@prisma.io",
      posts: {
        create: { title: "Hello World" }
      },
      profile: {
        create: { bio: "I like turtles" }
      }
    }
  })

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true
    }
  })
  console.dir(allUsers, { depth: null })
}
```

```bash title="create a user with a post & a bio"
[
  {
    id: 2,
    email: 'alice@prisma.io',
    name: 'Alice',
    posts: [
      {
        id: 1,
        createdAt: 2023-01-07T09:54:17.185Z,
        updatedAt: 2023-01-07T09:54:17.185Z,
        title: 'Hello World',
        content: null,
        published: false,
        authorId: 2
      }
    ],
    profile: { id: 1, bio: 'I like turtles', userId: 2 }
  }
]
```

```ts title="update an existing post"
const post = await prisma.post.update({
  where: { id: 42 },
  data: { published: true }
})
```

```ts title="filter posts that contain a keyword"
const filteredPosts = await prisma.post.findMany({
  where: {
    OR: [{ title: { contains: "prisma" } }, { content: { contains: "prisma" } }]
  }
})
```

## Prisma Studio

[prisma-examples repository](https://github.com/prisma/prisma-examples/), [Build a REST API with NestJS](https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0)

```bash
# open Prisma Studio
npx prisma studio

# go to
http://localhost:5555
```

[rest-nextjs-api-routes](https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-nextjs-api-routes) : Simple Next.js app (React) with a REST API

[graphql-nextjs](https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql-nextjs) : Simple Next.js app (React) with a GraphQL API

[graphql-apollo-server](https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql) : Simple GraphQL server based on apollo-server

[rest-express](https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-express) : Simple REST API with Express.JS

[grpc](https://github.com/prisma/prisma-examples/tree/latest/typescript/grpc) : Simple gRPC API

## PostgreSQL

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

```
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

SQL
Tables

```sql
CREATE TABLE "Post" (
  "id" SERIAL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "content" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "authorId" INTEGER NOT NULL,
  PRIMARY KEY ("id")
);

CREATE TABLE "Profile" (
  "id" SERIAL,
  "bio" TEXT,
  "userId" INTEGER NOT NULL,
  PRIMARY KEY ("id")
);

CREATE TABLE "User" (
  "id" SERIAL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Profile.userId_unique" ON "Profile"("userId");
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
ALTER TABLE "Post" ADD FOREIGN KEY("authorId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Profile" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

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

official PostgreSQL docs

Invoke autocompletion by pressing the CTRL+SPACE keys on your keyboard.

## Next

filtering, sorting, pagination, updating and deleting

---

[Fullstack app with TypeScript, Next.js, Prisma & GraphQL](https://www.prisma.io/blog/fullstack-nextjs-graphql-prisma-oklidw1rhw)

## Mahmoud Abdelwahab's Tutorial

## GraphQL API

## Authentication w Auth0

## Authorization

## Image upload

## Deployment

Next.js, Apollo Server, Apollo Client, Nexus (construct GraphQL schema), Prisma (ORM for migrations and database access), PostgreSQL, AWS S3, Auth0, TypeScript, TailwindCSS,
Vercel

```bash title=""
# clone
git clone -b part-1 https://github.com/m-abdelwahab/awesome-links.git

# navigate into the cloned directory
cd awesome-links

# install the dependencies
yarn

# install Prisma CLI
yarn add -D prisma

# create a basic Prisma setup
npx prisma init

# start the development server
yarn dev
```

## Prisma, an ORM

[prisma](https://pris.ly/d/getting-started), [schema.prisma](https://pris.ly/d/prisma-schema)

```env title="demo db URL"
DATABASE_URL="postgresql://giwuzwpdnrgtzv:d003c6a604bb400ea955c3abd8c16cc98f2d909283c322ebd8e9164b33ccdb75@ec2-54-170-123-247.eu-west-1.compute.amazonaws.com:5432/d6ajekcigbuca9"
```

```prisma title="schema.prisma"
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

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

```bash
# create these tables in the database
npx prisma db push

# turn database schema into a Prisma schema.
prisma db pull

# generate the Prisma Client
prisma generate
```

![database](https://prisma-blog-ebon.vercel.app/blog/posts/database-url-breakdown.png)

NAME PLACEHOLDER DESCRIPTION

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

To install Prisma Client, run the following command:

npm install @prisma/client
COPY

Next, create a new file called /prisma/seed.ts, it will allow us to use Prisma's integrated seeding functionality. Inside this file, import Prisma Client, instantiate it, and create some records:

// prisma/seed.ts
import { PrismaClient } from '@prisma/client'import { data } from '../data/links'const prisma = new PrismaClient()
async function main() { await prisma.user.create({ data: { email: `testemail@gmail.com`, role: 'ADMIN', }, })
await prisma.link.createMany({ data: data, })}
main() .catch(e => { console.error(e) process.exit(1) }) .finally(async () => { await prisma.$disconnect() })
COPY

We are first creating a user using the create() function, which creates a new database record.

Next, we are using the createMany() function to create multiple records. We are passing the hard-coded data we have as a parameter.

By default, Next.js forces the use of ESNext modules, we need to override this behavior or else we will not be able to execute the seeding script. To do so, first install ts-node as a development dependency:

npm install ts-node -D
COPY

Then in the tsconfig.json file, specify that ts-node will use CommonJS modules.

{ //...
"include": [ "next-env.d.ts", "**/*.ts", "**/*.tsx" ], "exclude": [ "node_modules" ],+ "ts-node": {+ "compilerOptions": {+ "module": "commonjs"+ }+ }}
You can now seed your database by running the following command:

npx prisma db seed
COPY

If everything worked correctly you should see the following output:

Environment variables loaded from .envPrisma schema loaded from prisma/schema.prismaRunning seed: ts-node --compiler-options '{"module":"CommonJS"}' "prisma/seed.ts" ...
🌱 Your database has been seeded.
Use Prisma Studio to explore your database

Prisma comes with Prisma Studio, a GUI for exploring and manipulating your data. You can use it to view, create, update or delete data from your database.

If you've done all the steps correctly you should you have the Link and User models inside your database. Inside the Link model you'll find 4 records and for the User model you'll find 1 record.

In this article we explained the problem domain and modeled our data using Prisma. We also seeded our database and explored it using Prisma Studio. Now we have a Next.js app that is connected to a PostgreSQL database.

In the next part of the course, we will learn about:

GraphQL and the advantages it has over REST when building APIs.
Building a GraphQL API for our app using Apollo server and Nexus.
Consuming the API on the client using Apollo Client.
GraphQL pagination so that we don't load all links at once and have better performance.
