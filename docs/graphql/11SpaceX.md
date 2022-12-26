---
sidebar_position: 11
---

# Apollo Client

@apollo/client : includes the in-memory cache, local state management, error handling, and a React-based view layer.

graphql : used to parse GraphQL queries

```bash
yarn add @apollo/client graphql
```

Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL. Use it to fetch, cache, and modify application data, all while automatically updating your UI.

Apollo Client helps you structure code in an economical, predictable, and declarative way that's consistent with modern development practices. The core @apollo/client library provides built-in integration with React, and the larger Apollo community maintains integrations for other popular view layers.

Declarative data fetching: Write a query and receive data without manually tracking loading states.

Excellent developer experience: Enjoy helpful tooling for TypeScript, Chrome / Firefox devtools, and VS Code.

Designed for modern React: Take advantage of the latest React features, such as hooks.

Incrementally adoptable: Drop Apollo into any JavaScript app and incorporate it feature by feature.

Universally compatible: Use any build setup and any GraphQL API.

Community driven: Share knowledge with thousands of developers in the GraphQL community.

Queries and Mutations. These are the read and write operations of GraphQL.

Caching overview. Apollo Client's normalized cache enables you to skip network requests entirely when data is already available locally.

Managing local state. Apollo Client provides APIs for managing both remote and local data, enabling you to consolidate all of your application's state.

Basic HTTP networking. Learn how to send custom headers and other authentication metadata in your queries.

Testing React components. Test your GraphQL operations without requiring a connection to a server.

Community integrations

This documentation set focuses on React, but Apollo Client supports many other libraries and languages:

JavaScript
Vue

Web Components
Apollo Elements

---

Fetching GraphQL Data in Next.js with Apollo GraphQL

Colby Fayock

Next.js has been steadily growing as a must-have tool for developers creating React apps. Part of what makes it great is its data fetching APIs to request data for each page. But how can we use that API to make GraphQL queries for our app?

fetch data with a GraphQL query in Next.js using Apollo Client

[YouTube](https://youtu.be/oxUPXhZ1t9I)

GraphQL is a query language and runtime that provides a different way of interacting with an API than what you would expect with a traditional REST API.

When fetching data, instead of making a GET request to a URL to grab that data, GraphQL endpoints take a “query”, consisting of what data you want to grab, whether it’s an entire dataset or a limited portion of it.

Grabbing only the data you need.

The cool thing is, you can also provide complex relationships between the data. With a single query, you could additionally request that data from different parts of the database that would traditionally take multiple requests with a REST API.

putting the burden on the client to take the time to make those requests.

show the latest 10 launches from SpaceX

use the API maintained by SpaceX Land to make a GraphQL query that grabs the last 10 flights.

rendered statically

```bash
yarn create next-app isaac-sx
cd isaac-sx
yarn add @apollo/client graphql
yarn dev
```

pass/inject the returned data as a prop to our main compon

back to the top of the page to see what our launches prop looks like

show the last 10 launches of SpaceX
