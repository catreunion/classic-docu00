---
sidebar_position: 4
---

# API Routes

Any file inside the folder pages/api is mapped to /api/\* and will be treated as an API endpoint instead of a page.

Use cases of building your own API with API routes

1. Using Environment Variables on the server to securely access external services.

2. Masking the URL of an external service (e.g. /api/secret instead of https://company.com/secret-url)

Example 1 :

```js title='pages/api/user.js'
const handler = (req, res) => {
  res.status(200).json({ name: "John Doe" })
}

export default handler
```

Example 2 :

```js title='pages/api/user.js'
const handler = (req, res) => {
  if (req.method === "POST") {
    // process a POST request
  } else {
    // handle any other HTTP method
  }
}

export default handler
```

**request handler** returns a json response with a status code of 200

**req** : An instance of **http.IncomingMessage**, plus some pre-built middlewares

**res** : An instance of **http.ServerResponse**, plus some helper functions

Source : [API Routes | Intro](https://nextjs.org/docs/api-routes/introduction)
