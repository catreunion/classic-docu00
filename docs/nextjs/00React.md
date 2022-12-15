---
sidebar_position: 1
---

# React

## DOM

When a user visits a web page, the server returns a HTML file to the browser.

The browser reads the file and **constructs** a [Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction).

- DOM is an **object representation** of **HTML elements**, acting as a bridge between the code and UI.

- A **tree-like structure** with **parent and child relationships**.

- **Listen** to user **events** and [respond accordingly](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents).

Source : [HTML vs DOM](https://developer.chrome.com/docs/devtools/dom/#appendix), [UI Tree](https://beta.reactjs.org/learn/preserving-and-resetting-state#the-ui-tree), [view DOM in Google Chrome](https://developer.chrome.com/docs/devtools/dom/), [view DOM in Firefox](https://firefox-source-docs.mozilla.org/devtools-user/debugger/how_to/highlight_and_inspect_dom_nodes/index.html), [browser dev tools](https://developer.chrome.com/docs/devtools/overview/)

## Imperative Programming

Giving a **step-by-step guide** on how to make a pizza

```html
<html>
  <body>
    <div id="app"></div>
    <script type="text/javascript">
      const app = document.getElementById("app")
      const header = document.createElement("h1")
      const headerContent = document.createTextNode("Hello World")
      header.appendChild(headerContent)
      app.appendChild(header)
    </script>
  </body>
</html>
```

## Declarative Programming

Ordering a pizza **without being concerned the steps** it takes to make the pizza 🍕

```html
<html>
  <body>
    <div id="app"></div>
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/jsx">
      const app = document.getElementById('app');
      ReactDOM.render(<h1>Hello World</h1>, app);
    </script>
  </body>
</html>
```

## React

A **declarative JavaScript library** for building **modern interactive UI**.

**Initial rendering** and **data fetching** happen on **browser**.

1. Browser receives an **empty HTML shell** from the server along with the **JavaScript** to construct UI

2. User sees a **blank page** during rendering

Source : [the three JSX rules](https://beta.reactjs.org/learn/writing-markup-with-jsx#the-rules-of-jsx), [render method](https://beta.reactjs.org/apis/render), [writing Markup with JSX](https://beta.reactjs.org/learn/writing-markup-with-jsx), [React from a JavaScript perspective](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) and [Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), [Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), [Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), [Conditional/Ternary Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator), [ES Modules and Import/Export Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

## Components

A [component](https://beta.reactjs.org/learn/your-first-component) is a **function** that **returns UI elements**.

Inside the return statement of the function, we write **JSX**.

Break down UI into smaller building blocks.

Think of components as **LEGO bricks** which can be combined together to **form a larger structure**.

Self-contained, reusable snippets of code <-- Modularity

Source : [import and export components](https://beta.reactjs.org/learn/importing-and-exporting-components)

## Props and State

Data (state) can be passed **from parent to child** components as props (short for properties).

Data flows down component tree <-- One-way

Example 1 :

```jsx
// child component
const Header1 = (props) => {
  console.log(props)
  console.log(props.title)
  return <h1>{props.title}</h1>
}

// child component
const Header2 = ({ title }) => {
  console.log(title)
  return <h1>{title}</h1>
}

// parent component
const HomePage = () => {
  return (
    <>
      <Header1 title="a cat 😺" />
    </>
  )
}

export default HomePage
```

Example 2 :

```jsx
const Header = ({ title }) => {
  const createTitle = (title) => {
    if (title) {
      return title
    } else {
      return "default title"
    }
  }

  console.log(title)

  return (
    <>
      <h1>{`template literal: ${title}`}</h1>
      <h1>{createTitle(title)}</h1>
    </>
  )
}

const HomePage = () => {
  return (
    <>
      <Header title="a cat 😺" />
      <Header />
    </>
  )
}

export default HomePage
```

Example 3 :

```jsx
import { useState } from "react"

const Header = ({ title }) => {
  return <h1>{title ? title : "default title"}</h1>
}

const Home = () => {
  const names = ["Ada Lovelace", "Grace Hopper", "Margaret Hamilton"]
  const [likes, setLikes] = useState(0)

  const handleClick = () => {
    setLikes(likes + 1)
  }

  return (
    <>
      <Header title="Develop. Preview. Ship. 🚀" />

      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <button onClick={handleClick}>Likes ({likes})</button>
      <button
        onClick={() => {
          setLikes(likes + 1)
        }}
      >
        Likes ({likes})
      </button>
    </>
  )
}

export default Home
```

**object destructuring** explicitly name the values of props inside the function parameters

Source : [Passing Props to a Component](https://beta.reactjs.org/learn/passing-props-to-a-component), [Rendering Lists](https://beta.reactjs.org/learn/rendering-lists), [Conditional Rendering](https://beta.reactjs.org/learn/conditional-rendering), curly braces `{ }`, [Introducing Hooks](https://reactjs.org/docs/hooks-intro.html), [Adding Interactivity](https://beta.reactjs.org/learn/adding-interactivity), [Managing State](https://beta.reactjs.org/learn/managing-state), [State: A Component's Memory](https://beta.reactjs.org/learn/state-a-components-memory#), [Meet your first Hook](https://beta.reactjs.org/learn/state-a-components-memory#meet-your-first-hook), [Responding to Events](https://beta.reactjs.org/learn/responding-to-events)

{% callout type="layout" title="array.map()" %}
Manipulate data and generate UI elements that are identical in style but hold different information.
Iterates over the array and use an arrow function to map a name to a list item.
{% /callout %}

{% callout type="warning" title="key={a_variable}" %}
Uniquely identifies items in an array so it knows which elements to update in the DOM
{% /callout %}

{% callout type="warning" title="State is initiated and stored within a component" %}
You can pass the state information to children components as props, but the logic for updating the state should be kept within the component where state was initially created.
{% /callout %}

When you stuck in coding, go to sleep and come back with a cup of coffee.
