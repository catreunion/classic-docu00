---
sidebar_position: 3
---

# Tailwind CSS

Tailwind UI is more like a set of blueprints, patterns, and ideas than a rigid UI kit.

Style in this order : Layout > Box > Borders > Backgrounds > Typography > Others

Useful tools : [​IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss), [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

Source : [Heroicons](https://unpkg.com/browse/@heroicons/react/outline/), [Headless UI](https://headlessui.com/), [@tailwindcss/aspect-ratio](https://github.com/tailwindlabs/tailwindcss-aspect-ratio), [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms), [@tailwindcss/line-clamp](https://github.com/tailwindlabs/tailwindcss-line-clamp), [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)

## Installation

```bash
# create a Next.js project using Create Next App
yarn create next-app {projectName}

# move to the project root directory
cd {projectName}

# install Tailwind CSS and its peer dependencies
yarn add -D tailwindcss postcss autoprefixer

# install the official plugins of Tailwind CSS
yarn add -D @tailwindcss/aspect-ratio @tailwindcss/forms @tailwindcss/line-clamp @tailwindcss/typography

# install the official icon sets and UI utilities of Tailwind CSS
yarn add @heroicons/react @headlessui/react@latest

# install Prettier and its peer dependency
yarn add -D prettier prettier-plugin-tailwindcss

# generate `tailwind.config.js` and `postcss.config.js`
npx tailwindcss init -p

# install extra dependencies
yarn add clsx focus-visible postcss-focus-visible
```
