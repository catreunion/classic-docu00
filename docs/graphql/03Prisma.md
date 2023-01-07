---
sidebar_position: 3
---

# Prisma

Object-Relational Mapper (ORM)

[prisma-examples repository](https://github.com/prisma/prisma-examples/)

## A plain TS project

[Quickstart with TypeScript & SQLite](https://www.prisma.io/docs/getting-started/quickstart), [Get started](https://pris.ly/d/getting-started), [Prisma schema](https://pris.ly/d/prisma-schema), [tsconfig.json](https://aka.ms/tsconfig)

```bash title="setup a plain TypeScript project"
# initialize a project
yarn init -y

# install dev dependencies
yarn add -D typescript ts-node @types/node prisma

# install dependencies
yarn add @prisma/client

# create tsconfig.json
npx tsc --init

# create prisma/schema.prisma/ & .env
npx prisma init --datasource-provider sqlite
```

```env title=".env"
DATABASE_URL="file:./dev.db"
```

## Data modeling

[Docs](https://www.prisma.io/docs/concepts/components/prisma-schema)

[Relations (Reference)](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)

```prisma title="prisma/schema.prisma"
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}
```

## Prisma Migrate

An imperative schema [migration tool](https://www.prisma.io/docs/concepts/components/prisma-migrate)

Create `prisma/migrations/` and `prisma/dev.db`

Generate **Prisma Client** in `./node_modules/@prisma/client/`

```bash title="create database tables"
npx prisma migrate dev --name init
```

## Prisma Client

An auto-generated and type-safe query builder for Node.js & TypeScript.

CTRL + SPACE : Invoke autocompletion

[Docs](https://www.prisma.io/docs/concepts/components/prisma-client)

```ts title="script1.ts"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
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
npx ts-node script1.ts

{ id: 1, email: 'alice@prisma.io', name: 'Alice' }
```

```ts title="script2.ts"
async function main() {
  const users = await prisma.user.findMany()
  console.log(users)
}
```

```bash title="retrieve all records of a given model"
npx ts-node script2.ts

[ { id: 1, email: 'alice@prisma.io', name: 'Alice' } ]
```

```ts title="script3.ts"
async function main() {
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

```bash title="create a user record with post"
npx ts-node script3.ts

# by default, Prisma only returns scalar fields
{ id: 2, email: 'bob@prisma.io', name: 'Bob' }
```

```ts title="script4.ts"
async function main() {
  const usersWithPosts = await prisma.user.findMany({
    include: {
      posts: true
    }
  })
  console.dir(usersWithPosts, { depth: null })
}
```

```bash title="retrieve all users and their posts"
npx ts-node script.ts

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

## Prisma Studio

```bash
# open Prisma Studio
npx prisma studio

# go to
http://localhost:5555
```

[prisma-examples repository](https://github.com/prisma/prisma-examples/)

[Build a REST API with NestJS](https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0)

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
