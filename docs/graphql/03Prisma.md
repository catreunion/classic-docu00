---
sidebar_position: 3
---

# Prisma

◭ [Prisma](https://prisma.io), an open source Object-Relational Mapper (ORM), is a modern DB toolkit to model, migrate, and query a database. [Examples repo](https://github.com/prisma/prisma-examples/), [Overview](https://www.prisma.io/docs/concepts/overview/what-is-prisma)

## A plain TS project

[SQLite](https://www.prisma.io/docs/getting-started/quickstart), [Get started](https://pris.ly/d/getting-started), [Prisma schema](https://pris.ly/d/prisma-schema), [tsconfig.json](https://aka.ms/tsconfig)

```bash title="setup Prisma with SQLite"
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

A Prisma schema can only have **one** [data source](https://www.prisma.io/docs/concepts/components/prisma-schema/data-sources). [SSL with PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql#configuring-an-ssl-connection)

```prisma title="if certificate files are outside ./prisma directory"
datasource db {
  provider = "postgresql"
  url      = "postgresql://johndoe:mypassword@localhost:5432/mydb?schema=public&sslmode=require&sslcert=../server-ca.pem&sslidentity=../client-identity.p12&sslpassword=<REDACTED>"
}
```

A Prisma schema can have **one or more** [generators](https://www.prisma.io/docs/concepts/components/prisma-schema/generators). When used with **TypeScript**, Prisma Client provides generated type definitions for your models and any variations of them to **make database access entirely type safe**. The generator for Prisma's JavaScript Client accepts multiple properties.

```prisma title="multiple properties of prisma-client-js"
generator client {
  provider = "prisma-client-js"
  output   = "./generated/prisma-client-js"
}
```

`prisma/schema.prisma` : the **single source of truth** for the models of your application

> Models represent the entities of your application domain. A model defines a number of fields.

> Enums

> Attributes and functions that change the behavior of fields and models

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
  createdAt DateTime @default(now())
  email   String   @unique
  name    String?
  role    Role     @default(USER)
  profile Profile?
  posts   Post[]
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
  id         Int        @id @default(autoincrement())
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
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
```

An illustration by [Prisma](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model) showing the relations between models.

![the relations between models](https://www.prisma.io/docs/static/fc0ed56f4213ebf4d2309c0965b166da/3c492/sample-database.png)

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

```bash
prisma generate --schema ./database/myschema.prisma
# or
prisma generate --schema=./alternative/schema.prisma
```

Prisma Schema Language (PSL).

VS Code extension for syntax highlighting, auto-format the contents, indicates syntax errors with red squiggly lines

```json title="package.json"
"prisma": {
  "schema": "db/schema.prisma"
}
```

This comment will show up in the abstract syntax tree (AST) of the schema file as descriptions to AST nodes. Tools can then use these comments to provide additional information. All comments are attached to the next available node - free-floating comments are not supported and are not included in the AST.

Two ways to format .prisma files :

Run the `prisma format` command.

Install the Prisma VS Code extension and invoke the VS Code format action - manually or on save.

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
