---
sidebar_position: 1
---

# React

## DOM

When a user visits a web page, the server returns a HTML file to the browser.

The browser reads the file and **constructs** a [Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction).

DOM is an **object representation** of **HTML elements**, acting as a bridge between the code and UI.

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
