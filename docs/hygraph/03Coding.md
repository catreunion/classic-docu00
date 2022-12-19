---
sidebar_position: 4
---

# Fetching GraphQL Data in Next.js

Both GraphQL and Next.js are gaining popularity in the recent years. Let's go over

by Aagam Vadecha
AUG 18, 2022

GraphQL is a query language and a runtime to efficiently write and manage backend APIs.

Developed by Facebook in 2012 to use internally and made public in 2015.

Allow querying, mutating data, and also publishing/subscribing to real-time events. Due to numerous advantages, it has become a great alternative to REST APIs, you can read about the precise differences here. Along with us a lot of other reputable software firms also use it in production.

When we want to call a backend Graphql API server to query or mutate some data there are many clients that we can use from the frontend. It really depends on the use case and the scope of the project

Server-Side SetupAnchor
wherein we have one model named NextUser and another model named Post
one user can have multiple posts.

Querying user details in the Hygraph API playground is quite easy

Here we are sending a query to get details of a user, we pass email as a variable to this query. You can do a similar setup on Hygraph within a few minutes, and in case you already have any other GraphQL API server running you’re good to go. On the frontend side, we will be using a Next.js application.

The code snippets ahead will contain the core parts, in case you’re stuck somewhere, please find the entire working Next.js app with all different clients here. If you clone this repository, you will need to create a .env.local file, then add HYGRAPH_URL and HYGRAPH_PERMANENTAUTH_TOKEN environment variables for your setup.

If you’re building a small application, or if your application has few GraphQL API calls then you might not need a separate client specific to GraphQL, and using the existing package like fetch, axios and request to make those API calls might do the job.

FETCHAnchor
At its very base an API call to a GraphQL server is still an HTTP network call, this means that you can use Curl / Fetch with the correct parameters and payload to make the same call.

Here’s what a fetch call would look like. And you can check the full component [here](You can check the full component here.).

```js
import { HYGRAPH_URL, HYGRAPH_PERMANENTAUTH_TOKEN } from "../lib/constants"
const getUserDetailByFetchAPICall = async () => {
  try {
    if (!email) {
      return
    }
    setIsLoading(true)
    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${HYGRAPH_PERMANENTAUTH_TOKEN}`
    }
    const requestBody = {
      query: `query getNextUserByEmail($email:String!){
                nextUser(where:{email:$email}){
                  firstname
                  lastname
                  email
                  posts{
                    title
                  }
                }
              }`,
      variables: { email }
    }
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody)
    }
    const response = await (await fetch(HYGRAPH_URL, options)).json()
    console.log("RESPONSE FROM FETCH REQUEST", response?.data)
    setUserDetails(response?.data?.nextUser ?? {})
  } catch (err) {
    console.log("ERROR DURING FETCH REQUEST", err)
  } finally {
    setIsLoading(false)
  }
}
```

Fetch example

Here we have sent a GraphQL request, which is a POST call, the graphql query/mutation and respective variables are passed as a part of the request body. For authentication, we have passed an Authorization header with a token.

AXIOSAnchor
The axios implementation is quite similar to fetch, axios is a bit more high level and developer friendly library and many code bases might already be using axios.

Here’s what an axios call would look like. And you can check the full component here.

```js
import axios from "axios"
import { HYGRAPH_URL, HYGRAPH_PERMANENTAUTH_TOKEN } from "../lib/constants"
const getUserDetailByAxiosAPICall = async () => {
  try {
    if (!email) {
      return
    }
    setIsLoading(true)
    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${HYGRAPH_PERMANENTAUTH_TOKEN}`
    }
    const requestBody = {
      query: `query getNextUserByEmail($email:String!){
                nextUser(where:{email:$email}){
                  firstname
                  lastname
                  email
                  posts{
                    title
                  }
                }
              }`,
      variables: { email }
    }
    const options = {
      method: "POST",
      url: HYGRAPH_URL,
      headers,
      data: requestBody
    }
    const response = await axios(options)
    console.log("RESPONSE FROM AXIOS REQUEST", response.data)
    setUserDetails(response?.data?.data?.nextUser ?? {})
  } catch (err) {
    console.log("ERROR DURING AXIOS REQUEST", err)
  } finally {
    setIsLoading(false)
  }
}
```

Axios example

With libraries like fetch or axios you will manually have to manage loading states for all the queries and mutations, write separate code for error handling as well. This might become an overhead when the number of requests scale. Also advanced features like client side caching, GraphQL subscriptions based on websocket protocols, refetching queries, cannot be used in a straight-forward manner.

APOLLO CLIENTAnchor
Apollo client is a robust, production-ready, and mature client for GraphQL on the web. It is the most popular GraphQL client and has support for major frontend frameworks. It enables us to use powerful features like polling & refetching data, simplifies managing and configuring client-side cache, helps to use GraphQL fragments, and also supports subscriptions. If you are building a full-blown enterprise application that relies heavily on GraphQL, you might want to consider Apollo client.

Let’s look at how to configure it in a Next.js app.

First, make a file that initializes and exports the Apollo client.

lib/apolloClient.js

```js
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client"
import { HYGRAPH_URL, HYGRAPH_PERMANENTAUTH_TOKEN } from "../lib/constants"
import { setContext } from "@apollo/client/link/context"

const httpLink = createHttpLink({
  uri: HYGRAPH_URL
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${HYGRAPH_PERMANENTAUTH_TOKEN}`
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

export default client
```

Next.js is a hybrid framework, so if you are using static or server rendered pages you can directly import and use this client right away. For client side rendering we can provide the client via ApolloProvider.

Import this client in your \_app.js and then use ApolloProvider to provide this client to your components down the tree.

pages/\_app.js

```js
import React from "react"
import Layout from "../components/Layout"
import "../styles/globals.css"
import client from "../lib/apolloClient"
import { ApolloProvider } from "@apollo/client"

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </Layout>
  )
}
```

Now, simply use hooks provided by apolloClient like useQuery, useLazyQuery, etc it in your component something like this. And you can get the full component here.

```js
import { React, useState } from 'react';
import { UserDetail } from '../components/UserDetail';
import { gql, useLazyQuery } from '@apollo/client';

const query = gql`
  query getNextUserByEmail($email:String!){
    nextUser(where:{email:$email}){
      firstname
      lastname
      email
      posts{
        title
      }
    }
  }`;


export default function ApolloClient() {

  const [email, setEmail] = useState('');
  const [getUserDetailByApolloClientAPICall, { loading, error, data }] = useLazyQuery(query, { variables: { email } });

  if (error) return <div> Error ! </div>;

  return (
    // template... , with onClick event that calls → getUserDetailByApolloClientAPICall
  );
}
```

ApolloClient example

We don’t have to manage the loading, error states manually for all queries, also there is a common client that can be used by any component unlike axios and fetch where all API calls need to send the payload to the url with the authentication header. The advanced features that Apollo client supports are beyond the scope of this article but they are worth looking into.

GRAPHQL REQUESTAnchor
GraphQL Request is another lightweight graphql client with good features and ease of use. It can be considered as a GraphQL client meant to provide ease of use and can be put above a normal fetch or axios API call, but it does not have as many advanced features like cache management as the apollo client, so functionality wise it lies somewhere between the axios and apollo client. Here’s how to use it.

```js
import { React, useState } from 'react';
import { HYGRAPH_URL, HYGRAPH_PERMANENTAUTH_TOKEN } from '../lib/constants';
import { GraphQLClient, gql } from 'graphql-request';
import { UserDetail } from '../components/UserDetail';
const client = new GraphQLClient(HYGRAPH_URL, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_PERMANENTAUTH_TOKEN}`,
  },
});
const query = gql`
  query getNextUserByEmail($email:String!){
    nextUser(where:{email:$email}){
      firstname
      lastname
      email
      posts{
        title
      }
    }
  }`;

export default function GraphQLRequest() {
  const [email, setEmail] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getUserDetailByGraphQLRequestAPICall = async () => {
    try {
      setIsLoading(true);
      const variables = { email };
      const response = await client.request(query, variables);
      console.log('RESPONSE FROM GRAPHQL-REQUEST API CALL', response);
      if (response?.nextUser) {
        setUserDetails(response.nextUser);
      }
    }
    catch (err) {
      console.log('ERROR FROM GRAPHQL-REQUEST API CALL', err);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    // template...
  );
}
```

GraphQLRequest example

You can also take a look here to checkout more GraphQL clients and if you are new to GraphQL we recommend to checkout these awesome tools that are quite popular in the GraphQL community.

Aagam Vadecha
Aagam Vadecha

- the syntax is modern and straightforward to read

```bash
# install dependencies
yarn add graphql-request graphql
```

Demo 2 : Next.js Internationalized Routing with localized Hygraph content

```bash
npx degit hygraph/hygraph-examples/with-nextjs-i18n-routing demo02-i18n
cd demo02-i18n
yarn
yarn dev
```

Demo 5 : Use markdown fields from Hygraph with MDX in Next.js

```bash
npx degit hygraph/hygraph-examples/with-nextjs-mdx-remote demo04-mdx
cd demo04-mdx
yarn
yarn dev
```

```bash
# install dependencies
yarn add graphql-request graphql
```

- querying via GraphQL

[Create a Model | YouTube](https://youtu.be/gDlWGrg8nxw), [Add fields | YouTube](https://youtu.be/W1x2OOFt7Ro)

[Publish content | YouTube](https://youtu.be/FOhtCIUgsvw)

Hygraph automatically generates queries to fetch content entries, as well as mutations to create, update, delete, publish, and unpublish them.

filtering, pagination, ordering, transforming image assets

Hygraph will automatically generate GraphQL mutations so you can create, update, delete, publish, and unpublish content entries.

```
mutation {

}
```

```GraphQL
mutation {
  updateProduct(where: { id: "..." }, data: { price: 2000 }) {
    id
    name
    price
  }
}
```
