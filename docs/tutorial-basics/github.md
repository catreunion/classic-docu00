---
sidebar_position: 1
---

# GitHub

## Create a repository on GitHub

Sign in to [GitHub](https://github.com/).

On the upper right corner, click the plus icon. Click "New repository".

Suggest a repository name, e.g. `next-demo-00`. Choose **private**. Click "Create repository".

On the section of **Quick setup**, click **SSH**. Click the copy icon.

```bash title="link a project with GitHub"
# stop the dev environment

# remove the default git directory
rm -rf .git

# initialize a local repository
git init

# add all the items to local repository
git add .

# leave a note for this stage
git commit -m 'version 1.0.0'

# create a new repository in GitHub

# connect to the remote repository
git remote add origin git@github.com:<username>/<project-name>.git

# create the main branch
git branch -M main

# add all the items to remote repository
git push -u origin main

# input the passphrase of the SSH keys
Enter passphrase for key '/Users/isaac/.ssh/id_ed25519':

# go to https://vercel.com and sign up for a free account
```

Connect and authenticate to GitHub using Secure Shell Protocol (SSH).

If you haven't used your SSH key for one year, GitHub will automatically delete your inactive SSH key.

Source : [Git official](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [Git Handbook](https://docs.github.com/en/get-started/using-git/about-git), [GitHub](https://github.com/), [.gitignore](https://git-scm.com/docs/gitignore)

Useful Browser Extensions

[React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

[GoFullPage](https://chrome.google.com/webstore/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl)

```bash title="Miscellaneous"
# wget : retrieve content from web servers
# ca-certificates : allow SSL-based applications to check for the authenticity of SSL connections
sudo apt-get install wget ca-certificates curl

# Linux views the Windows file system as a mounted drive
cd /mnt/c/Users/<username>

# Windows views the Linux file system as a computer on the network=
# \\wsl$\<DistroName>\home\<UserName>\

# show the mounted directory path
wsl pwd
# \wsl$\Ubuntu\home
# /mnt/c

# check the version and build number of your Windows
Windows + R > winver
```

## Generating a new site

```bash title="generate a new Docusaurus site "
# method 1
npx create-docusaurus@latest classic-docu01 classic

# method 2 (seems not responding but will eventually work)
npm init docusaurus@latest classic-docu01 classic

# yarn add @docusaurus/plugin-content-pages
# @docusaurus/preset-classic

cd classic-docu01

yarn

yarn start
# npx docusaurus start

# npx docusaurus --version
```

```bash title="Creating a pair of SSH keys on Mac"
# 1. generate a pair of SSH keys
ssh-keygen -t ed25519 -C <emailAddress>
# or: ssh-keygen -t rsa -b 4096 -C <emailAddress>

# 2. enter a secure passphrase and write it down immediately

# 3. accept the default location
# directory   : ~/.ssh/
# private key : ~/.ssh/id_ed25519
# public key  : ~/.ssh/id_ed25519.pub
# ~/.gitconfig

# 4. create a config file
touch ~/.ssh/config

# 5. add these lines to the config file
Host *
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519
```

```bash title="Adding the private key to ssh-agent"
# 1. make sure a SSH client is installed
ssh -V

# 2. start the ssh client in background
eval "$(ssh-agent -s)"

# 3A. if you are using Mac, follow it to add the private key to the ssh client
ssh-add -K ~/.ssh/id_ed25519
# In MacOS Monterey, -K and -A are replaced by --apple-use-keychain and --apple-load-keychain

# 3B. if you are using Linux, follow it
ssh-add ~/.ssh/id_ed25519

# adjust the file permissions of the SSH keys if necessary
chmod 600 ~/.ssh/*

# add the public key to GitHub if necessary

# 4. handle basic configuration
git config --global user.name <user name>
git config --global user.email <email address>

# 5. run a test
ssh -T git@github.com
```

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

# Creating a Document

Documents are **groups of pages** connected through:

- a **sidebar**
- **previous/next navigation**
- **versioning**

## Create your first Doc

Create a Markdown file at `docs/hello.md`:

```md title="docs/hello.md"
# Hello

This is my **first Docusaurus document**!
```

## Configure the Sidebar

Docusaurus automatically **creates a sidebar** from the `docs` folder.

Add metadata to customize the sidebar label and position:

```md title="docs/hello.md" {1-4}
---
sidebar_label: "Hi!"
sidebar_position: 3
---

# Hello

This is my **first Docusaurus document**!
```

It is also possible to create your sidebar explicitly in `sidebars.js`:

```js title="sidebars.js"
module.exports = {
  tutorialSidebar: [
    "intro",
    // highlight-next-line
    "hello",
    {
      type: "category",
      label: "Tutorial",
      items: ["tutorial-basics/create-a-document"]
    }
  ]
}
```

# Create a Blog Post

Docusaurus creates a **page for each blog post**, but also a **blog index page**, a **tag system**, an **RSS** feed...

## Create your first Post

Create a file at `blog/2021-02-28-greetings.md`:

```md title="blog/2021-02-28-greetings.md"
---
slug: greetings
title: Greetings!
authors:
  - name: Joel Marcey
    title: Co-creator of Docusaurus 1
    url: https://github.com/JoelMarcey
    image_url: https://github.com/JoelMarcey.png
  - name: Sébastien Lorber
    title: Docusaurus maintainer
    url: https://sebastienlorber.com
    image_url: https://github.com/slorber.png
tags: [greetings]
---

Congratulations, you have made your first post!

Feel free to play around and edit this post as much you like.
```

A new blog post is now available at [http://localhost:3000/blog/greetings](http://localhost:3000/blog/greetings).
