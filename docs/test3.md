# Hello

This is my **first Docusaurus document**!

[Google Chrome Web Browser](https://www.google.com/intl/en_hk/chrome/)

[Data model (Reference)](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#defining-models)

Data model

Represent the entities of your application domain

Map to the tables (relational databases like PostgreSQL) or collections (MongoDB) in your database

Form the foundation of the queries available in the generated Prisma Client API

When used with TypeScript, Prisma Client provides generated type definitions for your models and any variations of them to make database access entirely type safe.

```
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

The data model definition is made up of:

Models (model primitives) that define a number of fields, including relations between models

Attributes and functions that change the behavior of fields and models

A model maps to the underlying structures of the data source.

The following query uses the Prisma Client generated from this data model to create:

A User record
Two nested Post records
Three nested Category records

```ts title="Query Example"
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

Your data model reflects your application domain. For example:

map it to your database using Prisma Migrate. In this case, the data model is the single source of truth for the models of your application.

Generate the data model via introspection: When you have an existing database or prefer migrating your database schema with SQL, you generate the data model by introspecting your database. In this case, the database schema is the single source of truth for the models of your application.

Mapping model names to tables or collections

Prisma model naming conventions (singular form, PascalCase) do not always match table names in the database. A common approach for naming tables/collections in databases is to use plural form and snake_case notation - for example: comments.

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

```
model Comment {
  id      Int    @id @default(autoincrement())
  title   String
  content String
}

model Tag {
  name String @id
}
```

See complete list of scalar field types .

Relation fields

A relation field's type is another model - for example, a post (Post) can have multiple comments (Comment[]):

```
model Post {
  id       Int       @id @default(autoincrement())
  // Other fields
  comments Comment[] // A post can have many comments
}

model Comment {
  id     Int
  // Other fields
  Post   Post? @relation(fields: [postId], references: [id]) // A comment can have one post
  postId Int?
}
```

Refer to the relations documentation for more examples and information about relationships between models.

Type modifiers
The type of a field can be modified by appending either of two modifiers:

[] Make a field a list
? Make a field optional
Note: You cannot combine type modifiers - optional lists are not supported.

Lists
The following example includes a scalar list and a list of related models:

```
model Post {
  id       Int       @id @default(autoincrement())
  // Other fields
  comments Comment[] // A list of comments
  keywords String[] // A scalar list
}
```

Note: Scalar lists are only supported if the database connector supports scalar lists, either natively or at a Prisma level.

Optional and mandatory fields

```
model Comment {
  id      Int     @id @default(autoincrement())
  title   String
  content String?
}

model Tag {
  name String @id
}
```

When not annotating a field with the ? type modifier, the field will be required on every record of the model. This has effects on two levels:

Databases
Relational databases: Required fields are represented via NOT NULL constraints in the underlying database.
MongoDB: Required fields are not a concept on a MongoDB database level.
Prisma Client: Prisma Client's generated TypeScript types that represent the models in your application code will also define these fields as required to ensure they always carry values at runtime.
Note: The default value of an optional field is null.

Defining attributes
Attributes modify the behavior of fields or model blocks. The following example includes three field attributes (@id , @default , and @unique ) and one block attribute (@@unique ):

```
model User {
  id        Int     @id @default(autoincrement())
  firstName String
  lastName  String
  email     String  @unique
  isAdmin   Boolean @default(false)

  @@unique([firstName, lastName])
}
```

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

```
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  role    Role     @default(USER)
  posts   Post[]
  profile Profile?
}
```

Composite IDs
In the following example, the User ID is represented by a combination of the firstName and lastName fields:

```
model User {
  firstName String
  lastName  String
  email     String  @unique
  isAdmin   Boolean @default(false)

  @@id([firstName, lastName])
}
```

@unique fields as unique identifiers
In the following example, users are uniquely identified by a @unique field. Because the email field functions as a unique identifier for the model (which is required by Prisma), it must be mandatory:

```
model User {
  email   String   @unique
  name    String?
  role    Role     @default(USER)
  posts   Post[]
  profile Profile?
}
```

Constraint names in relational databases
You can optionally define a custom primary key constraint name in the underlying database.

Defining IDs in MongoDB
The MongoDB connector has specific rules for defining an ID field that differs from relational databases. An ID must be defined by a single field using the @id attribute and must include @map("\_id").

In the following example, the User ID is represented by the id string field that accepts an auto-generated ObjectId:

```
model User {
  id      String   @id @default(auto()) @map("_id") @db.ObjectId
  email   String   @unique
  name    String?
  role    Role     @default(USER)
  posts   Post[]
  profile Profile?
}
```

In the following example, the User ID is represented by the id string field that accepts something other than an ObjectId - for example, a unique username:

```
model User {
  id      String   @id @map("_id")
  email   String   @unique
  name    String?
  role    Role     @default(USER)
  posts   Post[]
  profile Profile?
}
```

MongoDB does not support @@id
MongoDB does not support composite IDs, which means you cannot identify a model with a @@id block.

Defining a default value
You can define default values for scalar fields of your models using the @default attribute:

Relational databases
MongoDB

```
model Post {
  id         Int        @id @default(autoincrement())
  createdAt  DateTime   @default(now())
  title      String
  published  Boolean    @default(false)
  author     User       @relation(fields: [authorId], references: [id])
  authorId   Int
  categories Category[] @relation(references: [id])
}
```

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

```
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

In the following example, a combination of authorId and title must be unique:

Relational databases
MongoDB

```
model Post {
  id         Int        @id @default(autoincrement())
  createdAt  DateTime   @default(now())
  title      String
  published  Boolean    @default(false)
  author     User       @relation(fields: [authorId], references: [id])
  authorId   Int
  categories Category[] @relation(references: [id])

  @@unique([authorId, title])
}
```

Constraint names in relational databases
You can optionally define a custom unique constraint name in the underlying database.

Composite type unique constraints
When using the MongoDB provider in version 3.12.0 and later, you can define a unique constraint on a field of a composite type using the syntax @@unique([compositeType.field]). As with other fields, composite type fields can be used as part of a multi-column unique constraint.

The following example defines a multi-column unique constraint based on the email field of the User model and the number field of the Address composite type which is used in User.address:

schema.prisma

```
type Address {
  street String
  number Int
}

model User {
  id      Int     @id
  email   String
  address Address

  @@unique([email, address.number])
}
```

This notation can be chained if there is more than one nested composite type:

schema.prisma

```
type City {
  name String
}

type Address {
  number Int
  city   City
}

model User {
  id      Int       @id
  address Address[]

  @@unique([address.city.name])
}
```

Defining an index
You can define indexes on one or multiple fields of your models via the @@index on a model. The following example defines a multi-column index based on the title and content field:

```
model Post {
  id      Int     @id @default(autoincrement())
  title   String
  content String?

  @@index([title, content])
}
```

Index names in relational databases
You can optionally define a custom index name in the underlying database.

Defining composite type indexes
When using the MongoDB provider in version 3.12.0 and later, you can define an index on a field of a composite type using the syntax @@index([compositeType.field]). As with other fields, composite type fields can be used as part of a multi-column index.

The following example defines a multi-column index based on the email field of the User model and the number field of the Address composite type:

schema.prisma

```
type Address {
  street String
  number Int
}

model User {
  id      Int     @id
  email   String
  address Address

  @@index([email, address.number])
}
```

This notation can be chained if there is more than one nested composite type:

schema.prisma

```
type City {
  name String
}

type Address {
  number Int
  city   City
}

model User {
  id      Int       @id
  address Address[]

  @@index([address.city.name])
}
```

Defining enums
You can define enums in your data model if enums are supported for your database connector, either natively or at Prisma level.

Enums are considered scalar types in the Prisma data model. They're therefore by default included as return values in Prisma Client queries.

Enums are defined via the enum block. For example, a User has a Role:

Relational databases
MongoDB

```
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  role  Role    @default(USER)
}

enum Role {
  USER
  ADMIN
}
```

Defining composite types
Composite types were added in version 3.10.0 under the mongodb Preview feature flag and are in General Availability since version 3.12.0.

Composite types are currently only available on MongoDB.

Composite types (known as embedded documents in MongoDB) provide support for embedding records inside other records, by allowing you to define new object types. Composite types are structured and typed in a similar way to models.

To define a composite type, use the type block. As an example, take the following schema:

schema.prisma

```
model Product {
  id     String  @id @default(auto()) @map("_id") @db.ObjectId
  name   String
  photos Photo[]
}

type Photo {
  height Int
  width  Int
  url    String
}
```

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

```
model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
}
```

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

```
const newUser = await prisma.user.create({
  data: {
    name: 'Alice',
  },
})
const allUsers = await prisma.user.findMany()
```

Type definitions
Prisma Client also generates type definitions that reflect your model structures. These are part of the generated @prisma/client node module.

When using TypeScript, these type definitions ensure that all your database queries are entirely type safe and validated at compile-time (even partial queries using select or include ).

Even when using plain JavaScript, the type definitions are still included in the @prisma/client node module, enabling features like IntelliSense/autocompletion in your editor.

Note: The actual types are stored in the .prisma/client folder. @prisma/client/index.d.ts exports the contents of this folder.

For example, the type definition for the User model from above would look as follows:

```
export type User = {
  id: number
  email: string
  name: string | null
  role: string
}
```

Note that the relation fields posts and profile are not included in the type definition by default. However, if you need variations of the User type you can still define them using some of Prisma Client's generated helper types (in this case, these helper types would be called UserGetIncludePayload and UserGetSelectPayload).
