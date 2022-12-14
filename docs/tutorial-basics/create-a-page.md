---
sidebar_position: 1
---

# Creating a Page

## Option 1 : React Page

Create a file at `src/pages/my-react-page.js`:

```jsx title="src/pages/my-react-page.js"
import React from "react"
import Layout from "@theme/Layout"

const TestPage = () => {
  return (
    <Layout>
      <h1>My React page</h1>
      <p>This is a React page</p>
    </Layout>
  )
}

export default TestPage
```

## Option 2 : Markdown Page

Create a file at `src/pages/my-markdown-page.md`:

```mdx title="src/pages/my-markdown-page.md"
# My Markdown page

This is a Markdown page
```

- Pages do not have sidebars, only docs do.

- Every page component should export a React component
