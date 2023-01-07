---
sidebar_position: 4
---

## Build a REST API

We're in love with TypeScript, but above all - we love Node.js.

```bash
# install the Nest CLI
$ npm i -g @nestjs/cli

# create a Nest project
$ nest new project-name

# or
$ nest new --strict project-name
```

app.controller.ts : A basic controller with a single route.
app.controller.spec.ts : The unit tests for the controller.
app.module.ts : The root module of the application.
app.service.ts : A basic service with a single method.
main.ts : The entry file of the application which uses the core function NestFactory to create a Nest application instance.

```ts title="main.ts"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(3000)
}
bootstrap()
```

To create a Nest application instance, we use the core NestFactory class. NestFactory exposes a few static methods that allow creating an application instance. The create() method returns an application object, which fulfills the INestApplication interface. This object provides a set of methods which are described in the coming chapters. In the main.ts example above, we simply start up our HTTP listener, which lets the application await inbound HTTP requests.

Note that a project scaffolded with the Nest CLI creates an initial project structure that encourages developers to follow the convention of keeping each module in its own dedicated directory.

By default, if any error happens while creating the application your app will exit with the code 1. If you want to make it throw an error instead disable the option abortOnError (e.g., NestFactory.create(AppModule, { abortOnError: false })).
Learn the right way!

Nest aims to be a platform-agnostic framework. Platform independence makes it possible to create reusable logical parts that developers can take advantage of across several different types of applications. Technically, Nest is able to work with any Node HTTP framework once an adapter is created. There are two HTTP platforms supported out-of-the-box: express and fastify. You can choose the one that best suits your needs.

platform-express Express is a well-known minimalist web framework for node. It's a battle tested, production-ready library with lots of resources implemented by the community. The @nestjs/platform-express package is used by default. Many users are well served with Express, and need take no action to enable it.
platform-fastify Fastify is a high performance and low overhead framework highly focused on providing maximum efficiency and speed. Read how to use it here.
Whichever platform is used, it exposes its own application interface. These are seen respectively as NestExpressApplication and NestFastifyApplication.

When you pass a type to the NestFactory.create() method, as in the example below, the app object will have methods available exclusively for that specific platform. Note, however, you don't need to specify a type unless you actually want to access the underlying platform API.

```js
const app = (await NestFactory.create) < NestExpressApplication > AppModule
```

Running the application#
Once the installation process is complete, you can run the following command at your OS command prompt to start the application listening for inbound HTTP requests:

```
$ npm run start
```

This command starts the app with the HTTP server listening on the port defined in the src/main.ts file. Once the application is running, open your browser and navigate to http://localhost:3000/. You should see the Hello World! message.

To watch for changes in your files, you can run the following command to start the application:

$ npm run start:dev
This command will watch your files, automatically recompiling and reloading the server.

Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications. It uses progressive JavaScript, is built with and fully supports TypeScript (yet still enables developers to code in pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

Under the hood, Nest makes use of robust HTTP Server frameworks like Express (the default) and optionally can be configured to use Fastify as well!

Nest provides a level of abstraction above these common Node.js frameworks (Express/Fastify), but also exposes their APIs directly to the developer. This gives developers the freedom to use the myriad of third-party modules which are available for the underlying platform.

In recent years, thanks to Node.js, JavaScript has become the “lingua franca” of the web for both front and backend applications. This has given rise to awesome projects like Angular, React and Vue, which improve developer productivity and enable the creation of fast, testable, and extensible frontend applications.

while plenty of superb libraries, helpers, and tools exist for Node (and server-side JavaScript), none of them effectively solve the main problem of - Architecture.

create highly testable, scalable, loosely coupled, and easily maintainable applications.

```bash title="suggested way"
# install
npm i -g @nestjs/cli

# create a project with TypeScript's strict mode
# populate the directory with the initial core Nest files and supporting modules, creating a conventional base structure for your project
nest new --strict project-name
```

```bash title="alternative way"
# use `degit` if you'd like to clone without the git history
$ git clone https://github.com/nestjs/typescript-starter.git project
$ cd project
$ npm install
$ npm run start

# open your browser and navigate to http://localhost:3000/
```

To install the JavaScript flavor of the starter project, use javascript-starter.git in the command sequence above.

```bash
$ npm i --save @nestjs/core @nestjs/common rxjs reflect-metadata

need to create the project boilerplate files
```

with NestJS, Prisma, PostgreSQL and Swagger.
