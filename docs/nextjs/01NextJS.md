---
sidebar_position: 2
---

# Next.js

A **React framework** handling all these tasks :

1. **Routing** - navigating **between pages** of the app

2. **Data Fetching** - **where** the data lives and **how** to get it

3. **Rendering** - **when and where** render the **static or dynamic** content

4. **Integrations** - what third-party services and **how to connect** them

5. **Infrastructure** - **deploy** to where (serverless, CDN, edge ...)

6. **Performance** - how to **optimize** the app

7. **Scalability** - how to **adapt** as data and traffic grow

Your code needs to be **compiled**, **bundled**, **minified** and **split** to make it performant and accessible in the **production** environment

## Compiling

The process of taking code in one language and outputting it in another language or another version of that language

JSX needs to **be compiled into regular JavaScript** before browsers can understand

![compiler](https://nextjs.org/static/images/learn/foundations/compiling.png)

## Minifying

The process of removing unnecessary code formatting and comments without changing the code’s functionality to improve performance (file size decreases)

![Minifying](https://nextjs.org/static/images/learn/foundations/minifying.png)

## Bundling

The process of **resolving** the web of dependencies and **merging/packaging** them into **optimized bundles**

![Bundling](https://nextjs.org/static/images/learn/foundations/bundling.png)

Exporting and importing **components** and **functions**, as well as external third-party **packages**, creates a **complex web of file dependencies**

## Code Splitting

The process of **splitting** the app bundle into **smaller chunks** required by **each entry point**

Developers usually split their app into multiple pages that can be accessed from different URLs

**Each page** becomes a unique **entry point**

Only load the code required to run that page/entry point

Any code shared between pages is also split into another bundle to avoid re-downloading the same code on further navigation

![Code Splitting](https://nextjs.org/static/images/learn/foundations/code-splitting.png)

## Routing

A **page** is a React component exported from a file in the `pages` directory.

Each page is associated with **a route** based on its **file name**.

Index routes

- `pages/index.jsx` → `/`

- `pages/blog/index.jsx` → `/blog`

Nested routes : `pages/info/about.jsx` → `/info/about`

Dynamic routes

- `pages/posts/[id].jsx` → `/posts/:id`

- `pages/[username]/settings.jsx` → `/:username/settings`

## \_App.js

Pass JSX attributes and children to this component as a single object
