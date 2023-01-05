---
sidebar_position: 12
---

# Prisma

Postgres.app is a full-featured PostgreSQL installation packaged as a standard Mac app.

Click "Initialize" to create a new server.

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

[official PostgreSQL docs]()

Invoke autocompletion by pressing the CTRL+SPACE keys on your keyboard.

## Prisma in a plain TypeScript project

[Quickstart with TypeScript & SQLite](https://www.prisma.io/docs/getting-started/quickstart), [Get started](https://pris.ly/d/getting-started), [Prisma schema](https://pris.ly/d/prisma-schema), [tsconfig.json](https://aka.ms/tsconfig)

```bash
# initialize a project
yarn init -y

# install TypeScript
yarn add -D typescript ts-node @types/node

# create tsconfig.json
npx tsc --init

  target: es2016
  module: commonjs
  strict: true
  esModuleInterop: true
  skipLibCheck: true
  forceConsistentCasingInFileNames: true

# install Prisma CLI
yarn add -D prisma

# invoke the Prisma CLI
# configure SQLite as your database with Prisma
# create schema.prisma
# creates the .env file
npx prisma init --datasource-provider sqlite
```

### Data modeling

`prisma generate` : Read all above mentioned information from the Prisma schema to generate the correct data source client code (e.g. Prisma Client).

`prisma migrate dev` : Read the data sources and data model definition to create a new migration.

[Docs](https://www.prisma.io/docs/concepts/components/prisma-schema)

```prisma title="prisma/schema.prisma"
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
```

### Prisma Migrate

An imperative schema [migration tool](https://www.prisma.io/docs/concepts/components/prisma-migrate).

Keep the database schema in sync with Prisma schema.

Generate a history of .sql migration files.

```bash title="create a local SQLite database"
# create a local SQLite database
# the prisma/migrations directory & dev.db are created
npx prisma migrate dev --name init
```

```bash title="creating a SQLite database"
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

SQLite database dev.db created at file:./dev.db

Applying migration `20230103123128_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20230103123128_init/
    └─ migration.sql

Your database is now in sync with your schema.

Running generate... (Use --skip-generate to skip the generators)
yarn add v1.22.19
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
[4/4] 🔨  Building fresh packages...
success Saved lockfile.
success Saved 2 new dependencies.
info Direct dependencies
└─ @prisma/client@4.8.0
info All dependencies
├─ @prisma/client@4.8.0
└─ @prisma/engines-version@4.8.0-61.d6e67a83f971b175a593ccc12e15c4a757f93ffe
✨  Done in 4.51s.

✔ Generated Prisma Client (4.8.0 | library) to ./node_modules/@prisma/client in 99ms
```

### Operations from frontend

[Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client) is an auto-generated and type-safe query builder.

Whenever you make changes to your database that are reflected in the Prisma schema, you need to manually re-generate Prisma Client to update the generated code in the node_modules/.prisma/client directory:

```bash
prisma generate
```

```ts title="script1.ts"
import { PrismaClient } from "@prisma/client"

// instantiate PrismaClient
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

```bash title="adding a User record"
# execute the script
npx ts-node script1.ts

# response
# { id: 1, email: 'alice@prisma.io', name: 'Alice' }
```

```ts title="script2.ts"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // return all records from the database for a given model
  const users = await prisma.user.findMany()
  console.log(users)
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

```bash title="retrieving all User records"
# execute the script
npx ts-node script2.ts

# response
# [ { id: 1, email: 'alice@prisma.io', name: 'Alice' } ]
```

```ts title="script3.ts"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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

```bash title="creating a User and a Post at the same time"
# execute the script
npx ts-node script3.ts

# by default, Prisma only returns scalar fields in the result objects of a query.
{ id: 2, email: 'bob@prisma.io', name: 'Bob' }
```

### Retrieving relation with `include`

```ts title="script4.ts"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const usersWithPosts = await prisma.user.findMany({
    include: {
      posts: true
    }
  })
  console.dir(usersWithPosts, { depth: null })
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

```bash title="retrieving users and their posts"
# execute the script
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

# open Prisma Studio
npx prisma studio
```

```bash title="running Prisma Studio"
# install Prisma Client
yarn add @prisma/client

# run Prisma Studio
npx prisma studio

# go to
http://localhost:5555
```

[prisma-examples repository](https://github.com/prisma/prisma-examples/)

[Build a REST API with NestJS](https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0)

### Next

filtering, sorting, pagination, updating and deleting

---

[Fullstack app with TypeScript, Next.js, Prisma & GraphQL](https://www.prisma.io/blog/fullstack-nextjs-graphql-prisma-oklidw1rhw)

## Mahmoud Abdelwahab's Tutorial

### GraphQL API

### Authentication w Auth0

### Authorization

### Image upload

### Deployment

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

### Prisma, an ORM

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

### Migrating and pushing changes to the database

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