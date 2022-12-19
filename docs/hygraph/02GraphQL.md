---
sidebar_position: 3
---

# GraphQL

[Learn GraphQL In 40 Minutes](https://youtu.be/ZQL7tL2S0oQ), ["What Is an API?" by MuleSoft](https://youtu.be/s7wmiS2mSXY), [Representational state transfer (REST)](https://en.wikipedia.org/wiki/Representational_state_transfer), [React.js Conf 2015 - Data fetching for React applications](https://youtu.be/9sc8Pyc51uU), [GraphQL Introduction](https://reactjs.org/blog/2015/05/01/graphql-introduction.html), [Falcor: One Model Everywhere](https://netflix.github.io/falcor/), [Netflix TechBlog](https://netflixtechblog.com/), [GraphQL Conf.](https://graphqlconf.org/), [JustGraphQL](https://www.justgraphql.com/), [the 36 most important GraphQL concepts](https://36-concepts-graphql.netlify.app/), [Lessons from 4 Years of GraphQL](https://www.graphql.com/articles/4-years-of-graphql-lee-byron)

How GraphQL solves the over-fetching and under-fetching problem of REST APIs

GraphQL allows frontend and backend teams to work independently

## Create a GraphQL schema

```
{
  allPersons {
    name
  }
}

{
  "allPersons": [
    { "name": "Johnny" },
    { "name": "Sarah" },
    { "name": "Alice" }
  ]
}
```

- `allPersons` : called the root field of the query

- Everything that follows the root field : called the payload of the query

```
{
  activities {
    title
  }
}

{
  "data": {
    "activities": [
      {
        "title": "2022-Dec-15 Kowloon Peak | Running"
      },
      {
        "title": "2022-Dec-12 Kowloon Peak | Running"
      },
      {
        "title": "2022-Dec-07 Kowloon Peak | Running"
      },
      {
        "title": "2022-Dec-03 Kowloon Peak | Running"
      },
      {
        "title": "2022-Nov-17 Garmin 10k Competition"
      },
      {
        "title": "2022-Nov-08 Kowloon Peak | Running"
      },
      {
        "title": "2022-Oct-29 HK Parkview to Quarry Bay | Running"
      },
      {
        "title": "2022-Oct-27 Kowloon Peak | Running"
      },
      {
        "title": "2022-Dec-18 Kowloon Peak | Running"
      }
    ]
  }
}
```

```
// Load all the posts that a Person has written
{
  allPersons {
    name
    age
    posts {
      title
    }
  }
}
```

```
// return up to a specific number of persons
{
  allPersons(last: 2) {
    name
  }
}
```

```
{
  activities(last: 2) {
    id
    title
  }
}

{
  "data": {
    "activities": [
      {
        "id": "clbro22wklvd10ak2gsqy448a",
        "title": "2022-Oct-27 Kowloon Peak | Running"
      },
      {
        "id": "clbtb12bn1z3p0bk2r84rb79u",
        "title": "2022-Dec-18 Kowloon Peak | Running"
      }
    ]
  }
}
```

```
mutation {
  createPerson(name: "Bob", age: 36) {
    name
    age
  }
}

"createPerson": {
  "name": "Bob",
  "age": 36,
}
```

`createPerson` <-- root field

two arguments

```
type Person {
  id: ID!
  username: String!
  age: Int!
}

```

```
// ask for the id in the payload of the mutation
mutation {
  createPerson(name: "Alice", age: 36) {
    id
  }
}
```

Like with a query, we’re also able to specify a payload for a mutation in which we can ask for different properties of the new Person object

When a client subscribes to an event, it will initiate and hold a steady connection to the server. Whenever that particular event then actually happens, the server pushes the corresponding data to the client. Unlike queries and mutations that follow a typical “request-response-cycle”, subscriptions represent a stream of data sent over to the client.

```
// subscribe to events happening on the Person type:
subscription {
  newPerson {
    name
    age
  }
}
```

{
"newPerson": {
"name": "Jane",
"age": 23
}
}

schema specifies the capabilities of the API and defines how clients can request the data. It is often seen as a contract between the server and the client.

a collection of GraphQL types

special root types:
type Query { ... }
type Mutation { ... }
type Subscription { ... }

```
type Query {
  allPersons: [Person!]!
}
```

`allPersons` : called a root field of the API

```
type Query {
  allPersons(last: Int): [Person!]!
}
```

```
type Mutation {
  createPerson(name: String!, age: Int!): Person!
}
```

```
type Subscription {
  newPerson: Person!
}
```

the full schema for all the queries and mutation

```
type Query {
  allPersons(last: Int): [Person!]!
}

type Mutation {
  createPerson(name: STring!, age: Int!): Person!
}

type Subscription {
  newPerson: Person!
}

type Person {
  name: String!
  age: Int!
  posts: [Post!]!
}

type Post {
  title: String!
  author: Person!
}
```

Define a CRUD-style API by adding a couple of new fields to the schema’s root types

add another field to the Query type

```
type Query {
  allPersons(last: Int): [Person!]!
  allPosts(last: Int): [Post!]!
}
```

Notice that with this setup,

all we can do is ask for all the posts and all the persons that are currently stored in the backend, but it is not possible to query individual posts or person objects.

adding two more mutations

The updatePerson mutation takes an ID that allows us to specify which person should be updated, as well as the person's properties as arguments

the deletePerson mutation only takes an ID to tell the server which person to delete

type Mutation {
createPerson(name: String!, age: Int!): Person!
updatePerson(id: ID!, name: String!, age: String!): Person!
deletePerson(id: ID!): Person!
}

add the create, update, and delete mutations for the Post type analogous to how we specified them for the Person type. Notice that we also need to add an ID to the Post type for the create and delete mutations to work.

type Mutation {
createPerson(name: String!, age: Int!): Person!
updatePerson(id: ID!, name: String!, age: String!): Person!
deletePerson(id: ID!): Person!
createPost(title: String!): Post!
updatePost(id: ID!, title: String!): Post!
deletePost(id: ID!): Post!
}

Finally, to complete the setup, we are also adding the ability for clients to subscribe to all these events on the Person and on the Post types that we just created. This is a more realistic setup of an API that defines useful capabilities.

type Subscription {
newPerson: Person!
updatedPerson: Person!
deletedPerson: Person!
newPost: Post!
updatedPost: Post!
deletedPost: Post!
}

Notice that the way we define the schema still has a couple of flaws. For example, at the moment, it's not really possible to set and modify the relation between person and post. We will leave this as an exercise to you to think about what the corresponding mutations would look like. In general, this whole schema already does illustrate the general ideas you need to follow when writing a GraphQL schema. Here is the final schema, all put together:

type Query {
allPersons(last: Int): [Person!]!
allPosts(last: Int): [Post!]!
}

type Mutation {
createPerson(name: String!, age: Int!): Person!
updatePerson(id: ID!, name: String!, age: String!): Person!
deletePerson(id: ID!): Person!
createPost(title: String!): Post!
updatePost(id: ID!, title: String!): Post!
deletePost(id: ID!): Post!
}

type Subscription {
newPerson: Person!
updatedPerson: Person!
deletedPerson: Person!
newPost: Post!
updatedPost: Post!
deletedPost: Post!
}

type Person {
name: String!
age: Int!
posts: [Post!]!
}

type Post {
title: String!
author: Person!
}

Prisma creates tools and that replaces traditional ORMs. Prisma enriches the GraphQL ecosystem and community by creating high-quality tools and software.

Novvum is a versatile full-stack agency specializing in GraphQL, React and Node. Novvum partners with companies to create meaningful products from start to finish.

Hasura is an open source engine that connects to your databases & microservices and auto-generates a production-ready GraphQL backend. Hasura gives you realtime GraphQL APIs that are high-performance, scalable, extensible & secure (with authorization baked in).

Course prerequisites and length
Course learning objectives and the outline
edX platform guidelines
Discussion forums, course timing, and learning aids
Grading, progress, and course completion
Professional Certificate Program Audit and verified tracks
The Linux Foundation's history, events, training, and certifications.

LinuxFoundationX

GraphQL is an open source query language and a runtime to fulfill those queries with your existing data

Familiarity with web architecture, such as clients and servers
Familiarity with web development concepts such as caching, HTTP requests, build-time, etc.

What advantages GraphQL has over other paradigms, such as REST

World class institutions and universities
edX support
Shareable certificate upon completion
Graded assignments and exams
Read our FAQsin a new tab about frequently asked questions on these tracks.

---

# Introduction to GraphQL

[official docs](https://graphql.org/learn/)

Learn about GraphQL, how it works, and how to use it. Looking for documentation on how to build a GraphQL service? There are libraries to help you implement GraphQL in many different languages. For an in-depth learning experience with practical tutorials, see How to GraphQL. Check out the free online course, Exploring GraphQL: A Query Language for APIs.

GraphQL is a query language for your API, and a server-side runtime for executing queries using a type system you define for your data. GraphQL isn't tied to any specific database or storage engine and is instead backed by your existing code and data.

A GraphQL service is created by defining types and fields on those types, then providing functions for each field on each type. For example, a GraphQL service that tells you who the logged in user is (me) as well as that user's name might look like this:

```
type Query {
  me: User
}

type User {
  id: ID
  name: String
}
```

Along with functions for each field on each type:

```
function Query_me(request) {
  return request.auth.user;
}

function User_name(user) {
  return user.getName();
}
```

After a GraphQL service is running (typically at a URL on a web service), it can receive GraphQL queries to validate and execute. The service first checks a query to ensure it only refers to the types and fields defined, and then runs the provided functions to produce a result.

```
{
  me {
    name
  }
}

{
  "me": {
    "name": "Luke Skywalker"
  }
}
```

---

A query language for your API
GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

Ask for what you need,
get exactly that

Send a GraphQL query to your API and get exactly what you need, nothing more and nothing less. GraphQL queries always return predictable results. Apps using GraphQL are fast and stable because they control the data they get, not the server.

```
{
  hero {
    name
    height
    mass
  }
}
{
  "hero": {
      "name": "Luke Skywalker",
      "height": 1.72,
      "mass": 77
  }
}
```

Get many resources
in a single request
GraphQL queries access not just the properties of one resource but also smoothly follow references between them. While typical REST APIs require loading from multiple URLs, GraphQL APIs get all the data your app needs in a single request. Apps using GraphQL can be quick even on slow mobile network connections.

```
{
    hero {
    name
    friends {
        name
        }
    }
}
{
    "hero": {
      "name": "Luke Skywalker",
      "friends": [
        { "name": "Obi-Wan Kenobi" },
        { "name": "R2-D2" },
        { "name": "Han Solo" },
        { "name": "Leia Organa" }
      ]
    }
}
```

Describe what’s possible
with a type system
GraphQL APIs are organized in terms of types and fields, not endpoints. Access the full capabilities of your data from a single endpoint. GraphQL uses types to ensure Apps only ask for what’s possible and provide clear and helpful errors. Apps can use types to avoid writing manual parsing code.

```
{
  hero {
    name
    friends {
      name
      homeWorld {
        name
        climate
      }
      species {
        name
        lifespan
        origin {
          name
        }
      }
    }
  }
}

type Query {
  hero: Character
}

type Character {
  name: String
  friends: [Character]
  homeWorld: Planet
  species: Species
}

type Planet {
  name: String
  climate: String
}

type Species {
  name: String
  lifespan: Int
  origin: Planet
}
```

Move faster with
powerful developer tools
Know exactly what data you can request from your API without leaving your editor, highlight potential issues before sending a query, and take advantage of improved code intelligence. GraphQL makes it easy to build powerful tools like GraphiQL by leveraging your API’s type system.

Evolve your API
without versions
Add new fields and types to your GraphQL API without impacting existing queries. Aging fields can be deprecated and hidden from tools. By using a single evolving version, GraphQL APIs give apps continuous access to new features and encourage cleaner, more maintainable server code.

type Film {
title: String
episode: Int
releaseDate: String

```
}
type Film {
  title: String
  episode: Int
  releaseDate: String
  openingCrawl: String


}
type Film {
  title: String
  episode: Int
  releaseDate: String
  openingCrawl: String
  director: String

}
type Film {
  title: String
  episode: Int
  releaseDate: String
  openingCrawl: String
  director: String
  directedBy: Person
}

type Person {
  name: String
  directed: [Film]
  actedIn: [Film]
}
type Film {
  title: String
  episode: Int
  releaseDate: String
  openingCrawl: String
  director: String @deprecated
  directedBy: Person
}

type Person {
  name: String
  directed: [Film]
  actedIn: [Film]

}
```

Bring your own
data and code
GraphQL creates a uniform API across your entire application without being limited by a specific storage engine. Write GraphQL APIs that leverage your existing data and code with GraphQL engines available in many languages. You provide functions for each field in the type system, and GraphQL calls them with optimal concurrency.

```
type Character {
    name: String
    homeWorld: Planet
    friends: [Character]
}
// type Character {
class Character {
    // name: String
    getName() {
        return this._name
    }

    // homeWorld: Planet
    getHomeWorld() {
        return fetchHomeworld(this._homeworldID)
    }

    // friends: [Character]
    getFriends() {
        return this._friendIDs.map(fetchCharacter)
    }
}

# type Character {
class Character:
    # name: String
    def name(self):
        return self._name

    # homeWorld: Planet
    def homeWorld(self):
        return fetchHomeworld(self._homeworldID)

    # friends: [Character]
    def friends(self):
        return map(fetchCharacter, self._friendIDs)


// type Character {
public class Character {
  // name: String
  public String Name { get; }

  // homeWorld: Planet
  public async Task<Planet> GetHomeWorldAsync() {
    return await FetchHomeworldAsync(_HomeworldID);
  }

  // friends: [Character]
  public async IEnumerable<Task<Character>> GetFriendsAsync() {
    return _FriendIDs.Select(FetchCharacterAsync);
  }
}
```

Who’s using GraphQL?
Facebook's mobile apps have been powered by GraphQL since 2012. A GraphQL spec was open sourced in 2015 and is now available in many environments and used by teams of all sizes.

# What is GraphQL?

[GraphQL : The Documentary](https://youtu.be/783ccP__No8), [GraphQL.org](https://graphql.org/)

GraphQL is an open-source data query and manipulation language for APIs, and a runtime for fulfilling queries with existing data. GraphQL was developed internally by Facebook in 2012 before being publicly released in 2015.

Adoption of GraphQL
GraphQL vs. REST
Frequently Asked Questions

GraphQL is a modern query language and a runtime for APIs, widely seen as a successor to REST APIs.

without any under fetching or over fetching of data.

GraphQL makes it easier to aggregate data from multiple sources, and uses a type system to describe data rather than multiple endpoints.

The GraphQL Landscape shows an aggregated GraphQL adoption table covering over 116k stars, a market cap of $4.7 trillion, and a funding of over $9 billion.

The team at Honeypot filmed a documentary on the history and emergence of GraphQL that can be viewed on YouTube.

Quite simply put, GraphQL is a query language for APIs and a runtime for fulfilling those queries with existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

GraphQL supports reading, writing (mutating), and subscribing to changes to data (realtime updates – most commonly implemented using WebHooks). GraphQL servers are available for multiple languages, including Haskell, JavaScript, Perl, Python, Ruby, Java, C++, C#, Scala, Go, Erlang, PHP, and R.

The attraction for GraphQL is primarily based on the concept of asking for what you need, and receiving just that - nothing more, nothing less. When sending queries to your API, GraphQL returns a very predictable result, without any over fetching or under fetching, ensuring that apps using GraphQL are fast, stable, and scalable.

To visualise how this would look like using our website as an example

The query would look similar to this:

```
{
  academyPosts {
    title
  }
}
```

From here we can infer that we're just asking for the title of Academy posts, and nothing else. Therefore, the results returned would be:

```text
{
  "data": {
    "academyPosts": [
      {
        "title": "Headless Mobile Content Management System (Mobile CMS)"
      },
      {
        "title": "What is Content as a Service (Caas)"
      },
      {
        "title": "Headless CMS and SEO Best Practices"
      },
      {
        "title": "What Is A Headless CMS?"
      },
      {
        "title": "Understanding Digital Experience Platforms (DXP) and Headless CMS"
      },
      {
        "title": "Understanding the Content Mesh and how a Headless CMS fits in."
      },
      {
        "title": "The Era of Application Content"
      },
      {
        "title": "Best Practices for Headless Content Modelling"
      },
      {
        "title": "Choosing the best Headless CMS"
      },
      {
        "title": "What is GraphQL?"
      },
      {
        "title": "Choosing a Headless CMS for Content Creators"
      },
      {
        "title": "Selecting a Headless CMS - a Checklist"
      },
      {
        "title": "What is a DXP (Digital Experience Platform)?"
      },
      {
        "title": "What is the JAMStack?"
      }
    ]
  }
}
```

On such a simple request it is easy to highlight how the payload would be minimal. However, GraphQL queries access not just the fields of a single resource, but also follow references between them. While typical REST APIs require loading from multiple URLs, GraphQL APIs get all the data in a single request - making apps quick even on slow mobile network connections.

To visualize this, let's try a more complex request where we want to see a list of blog posts on Hygraph, but rather than just the postTitle, also get the authors these posts are related to, the slugs of the posts, and the categories these blog posts fall under.

```
{
  blogPosts{
    title
    authors {
      name
      twitterHandle
      title
    }
    slug
    categories {
      title
    }
  }
}
```

The results given back (shortened to just one) look like:

```
{
  "data": {
    "blogPosts": [
      {
        "title": "Delivering a DIY Store powered by a Headless CMS for ECommerce",
        "authors": [
          {
            "name": "Jamie Barton",
            "twitterHandle": "notrab",
            "title": "Developer Advocate"
          },
          {
            "name": "Jonathan Steele",
            "twitterHandle": "ynnoj",
            "title": "Developer Advocate"
          }
        ],
        "slug": "delivering-a-diy-store-powered-by-a-headless-cms-for-ecommerce",
        "categories": [
          {
            "title": "Content Management"
          },
          {
            "title": "Headless CMS"
          },
          {
            "title": "Projects and Examples"
          }
        ]
      }
}
```

GraphQL APIs are organized in terms of types and fields, not endpoints, making them extremely easy to get up and running, since you can access all of your data from a single endpoint. GraphQL uses types to ensure apps only ask for what’s possible and provide clear and helpful errors. Apps can use types to avoid writing manual parsing code.

In summation, the 3 key characteristics of what makes GraphQL a dream syntax are:

Clients can specify exactly what data they need,
Aggregating data from multiple sources is easy, and
GraphQL uses a type system to describe data rather than endpoints.

The History of GraphQL

Similar to React, GraphQL was developed internally by Facebook in 2012 before being publicly released in 2015. Following GraphQL's transition to being made open source, the GraphQL project was moved from Facebook to the newly-established GraphQL Foundation, hosted by the Linux Foundation, in 2018.

The origin of GraphQL comes out of Facebook's attempts to scale their mobile app. At the time, their app was an adaptation of their website, when their mobile strategy was to simply "adopt" HTML5 to mobile. Due to issues related to high network usage and a less than ideal UX, the team decided to build up the iOS from scratch using native technologies.

Brenda Clark put the history of GraphQL quite well on LevelUp's post:

The main problem with Facebook’s News Feed implementation on mobile. It wasn’t as simple as retrieving a story, who wrote it, what it says, the list of comments, and who’s liked the post. Each story was interconnected, nested, and recursive. The existing APIs weren’t designed to allow developers to expose a rich, news feed-like experience on mobile. They didn’t have a hierarchical nature, let developers select what they needed, or the capability to display a list of heterogeneous feed stories.

Long story short, the core team at Facebook decided they needed to build a new News Feed API, which is when GraphQL began to take shape. Over the next several months, the surface area of the GraphQL API expanded to cover most of the Facebook iOS app, and in 2015, the GraphQL spec was first published along with the reference implementation in JavaScript.

The team at Honeypot made a comprehensible documentary into the birth and adoption of GraphQL, with a highly detailed insight into the emergence of the technology.

GraphQL The Documentary by Honeypot.png

The documentary can be viewed on YouTube.

Adoption of GraphQL

Understandably, the adoption for GraphQL skyrocketed since the need for such a solution was quite prevalent in the industry. Within half a year there were already implementations of GraphQL in different languages, including PHP, JavaScript, Python, Scala, and Ruby.

Starting off as a "hobbyist" spec, GraphQL rapidly gained enterprise validation, and was adopted by companies like GitHub, Yelp, AirBnB, and many more.

The GraphQL Landscape shows an aggregated GraphQL adoption table covering over 116k stars, a market cap of $4.7 trillion, and a funding of over $9 billion.

Between all the GraphQL servers, clients, gateways, and apps, the GraphQL ecosystem has exploded in terms of market adoption, claiming GraphQL's spot as a force to reckon with.

GraphQL vs. REST

A REST API is an "architectural concept" for network-based software. GraphQL, on the other hand, is a query language and a set of tools that operate over a single endpoint. In addition, over the last few years, REST has been used to make new APIs, while the focus of GraphQL has been to optimize for performance and flexibility.

When using REST, you’ll always be returned complete "datasets". If you wanted to request information from x objects, you’d need to perform x REST API requests. If you're requesting information on a product for an eCommerce website, your requests may be structured in this way:

Request productInfo for product names, descriptions, etc. in one request
Request pricing for prices pertaining to that product in another request
Request images for product shots from another dataset
... and so on

While you'll still get everything you asked for, it would be done in several requests, and each dataset might send you tons of other information you didn't want or need, such as reviews, variations, discounts, etc. depending on how the content/data was structured at each endpoint. On one hand, this is extremely simple - you have one endpoint that does one task, so it’s easy to understand and manipulate. In other words, if you have X endpoint, it provides X data.

Conversely, if you wanted to gather some information from a specific endpoint, you couldn’t limit the fields that the REST API returns; you’ll always get a complete data set - or over fetching.

GraphQL uses its query language to tailor the request to exactly what you need, from multiple objects down to specific fields within each entity. GraphQL would take X endpoint, and it can do a lot with that information, but you have to tell it what you want first.

Using the same example, the request would simply be to get productName, productDescription, productImage, and productPrice from the same endpoint, within one request, and no more. All other content within the database wouldn't be returned, so the issue of over-fetching wouldn't be a concern.

For an amusing ELI5 on the topic, Ben Halpern, the founder of dev.to explains the conceptual differences between GraphQL and REST. Worth a read.

Frequently Asked Questions

What is GraphQL?

GraphQL is a query language for your API, and a server-side runtime for executing queries by using a type system you define for your data.

Is GraphQL better than REST?

It depends on the use case. However, the most commonly stated benefit is that GraphQL solves both over-fetching and under-fetching issues by allowing the client to request only the data that is required. Since there is more efficiency associated with working with GraphQL, development is much faster with GraphQL than it would be with REST.

Is GraphQL faster than REST?

GraphQL queries themselves are not faster than REST queries, but since you have full control over what you want to query and what the payload should be, GraphQL requests will always be smaller and more efficient. GraphQL also enables developers to retrieve multiple entities in one request, from one endpoint, further adding to each query's efficiency.

Why is GraphQL so popular?

GraphQL is commonly associated with a better developer experience through team independence and making API versioning redundant. A strongly typed schema, declarative data fetching, and predictable code & payload are other reasons why GraphQL is favored.

How can I learn GraphQL?

If you’re just getting started with GraphQL, How to GraphQL, GraphQL.org, and FreeCodeCamp are great places to start.

Why use a GraphQL CMS?

Hygraph is a 100% GraphQL Headless CMS. The advantage here is that you can build projects with minimum payload, client-driven data queries, generated documentation, powerful tooling, and extensive filtering for an utterly flexible interaction with your API. The generated GraphQL API works for read and write operations and scales seamlessly.
