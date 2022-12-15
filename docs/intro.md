---
sidebar_position: 1
---

# Essential Tools for Coding

## Powerlevel10k

1. Install **MesloLGS** Nerd font : [Regular.ttf](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Regular.ttf), [Bold.ttf](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold.ttf), [Italic.ttf](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Italic.ttf), [Bold Italic.ttf](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold%20Italic.ttf)

2. Prepar the system and install Powerlevel10k

```bash
# for Mac
# 1A : install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# 2A : install a few utilities
brew install tree neofetch git sl

# for Linux
# 1B : update the system
sudo apt update && apt upgrade -y
# 2B : install a few utilities
sudo apt install tree neofetch git sl

# 3 : install Powerlevel10k
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k
echo 'source ~/powerlevel10k/powerlevel10k.zsh-theme' >>~/.zshrc

# for Mac
# 4A : install oh-my-zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# for Linux
# 4B : install zsh
sudo apt install zsh

# for Mac, follow steps 5 to 8
# 5 : find out the executable path of zsh
whereis zsh
# 6 : find out your username
whoami
# 7 : set zsh as the default shell
chsh -s /usr/bin/zsh <username>
# 8 : quit Terminal and restart the Mac

# 9 : run Terminal and complete the setup wizard of Powerlevel10k
```

## Node.js

[Node.js](https://nodejs.org/en/) is a Javascript runtime environment used in the development of web apps and network tools.

With Node.js, JavaScript can also be executed as a standalone process on Node (outside a web browser).

JavaScript packages are distributed via the **npm Registry**.

1. libraries / dependencies

2. executables / binaries

Installation :

```bash
sudo apt update
sudo apt install curl build-essential
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node  -v
```

## Yarn

A **package manager** created by Facebook

Installation :

```bash
# install Yarn through repository
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn

# install Yarn through Homebrew
brew install yarn
brew upgrade yarn

# install all dependencies of a project
yarn

# install a package to dependencies
yarn add <package>

# install a package to devDependencies
yarn add -d <package>

# remove a dependency
yarn remove <package>
```

Source : [Yarn official](https://classic.yarnpkg.com/en/docs/getting-started)

package.json

```shell
.
├── Dependencies
│   ├── bundledDependencies
│   ├── dependencies
│   ├── devDependencies
│   ├── flat
│   ├── optionalDependencies
│   ├── peerDependencies
│   ├── peerDependenciesMeta
│   └── resolutions
├── Essentials
│   ├── description
│   ├── keywords
│   ├── license
│   ├── name
│   └── version
├── Files
│   ├── bin
│   ├── directories
│   ├── files
│   ├── main
│   └── man
├── Links
│   ├── bugs
│   ├── homepage
│   └── repository
├── Maintainers
│   ├── author
│   └── contributors
├── Publishing
│   ├── private
│   └── publishConfig
├── System
│   ├── cpu
│   ├── os
│   └── resolutions
└── Tasks
    ├── config
    └── scripts
```

## WSL2

[WSL2](https://docs.microsoft.com/en-us/windows/wsl/about) lets developers run a GNU/Linux environment directly on Windows.

VS Code, the **client**, runs on **Windows**.

Your app, the **server**, runs remotely on **WSL2**.

### Installation (Part 1)

1. Install [VS Code](https://code.visualstudio.com/download).

2. Make sure **Add to PATH** is ticked during installation.

3. Install [Windows Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701?hl=en-hk&gl=hk).

4. Add **MesloLGS** Nerd font to Windows.

5. Run Windows Terminal → Settings → Open JSON file

6. Copy the following content to overwrite the corresponding property.

```json
"defaults":
{
  "closeOnExit": "always",
  "colorScheme": "Tango Dark",
  "fontFace": "MesloLGS NF",
  "fontSize": 12
},
```

7. Save and quit Windows Terminal.

### Installation (Part 2)

1. Open Windows Terminal with **admin privileges**.

2. Install Ubuntu : `wsl --install`

3. Restart Windows

4. Create a user account

5. Run Ubuntu : `wsl -d Ubuntu`

6. Update Ubuntu's repos : `sudo apt update`

7. Install system updates : `sudo apt upgrade -y`

8. Install **Powerlevel10k** and **zsh**.

```bash
# install Powerlevel10k
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k
echo 'source ~/powerlevel10k/powerlevel10k.zsh-theme' >>~/.zshrc

# install zsh
sudo apt install zsh

# find out the executable path of zsh
whereis zsh

# find out your username
whoami

# set zsh as the default shell
chsh -s /usr/bin/zsh <username>
```

9. Restart Windows

10. Run Windows Terminal and complete the setup wizard of Powerlevel10k

11. Open VS Code from Windows Terminal : `code .`

### Installation (Part 3)

Install the following extensions in **local environment** :

1. Remote Development (includes WSL, Dev Containers, Remote - SSH)
2. One Dark Pro

Install the following extensions in **WSL environment** :

1. Prettier
2. Tailwind CSS IntelliSense
3. Volar

Copy the following content to overwrite the settings in VS Code

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnPaste": true,
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "explorer.compactFolders": false,
  "explorer.confirmDelete": false,
  "explorer.confirmDragAndDrop": false,
  "files.autoSave": "onFocusChange",
  "files.associations": {
    "*.js": "javascriptreact"
  },
  "prettier.printWidth": 9999,
  "prettier.semi": false,
  "prettier.trailingComma": "none",
  "terminal.integrated.defaultProfile.windows": "Ubuntu (WSL)",
  "terminal.integrated.fontFamily": "MesloLGS NF",
  "terminal.integrated.profiles.windows": {
    "Command Prompt": {
      "path": ["${env:windir}\\Sysnative\\cmd.exe", "${env:windir}\\System32\\cmd.exe"],
      "args": [],
      "icon": "terminal-cmd"
    },
    "Git Bash": {
      "source": "Git Bash"
    },
    "PowerShell": {
      "source": "PowerShell",
      "icon": "terminal-powershell"
    },
    "Ubuntu (WSL)": {
      "path": "C:\\Windows\\System32\\wsl.exe",
      "args": ["-d", "Ubuntu"]
    }
  },
  "workbench.colorTheme": "One Dark Pro",
  "workbench.startupEditor": "none"
}
```

&nbsp;

### Miscellaneous

```bash
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

## GitHub

- connect and authenticate to GitHub using Secure Shell Protocol (SSH)

  - a secure channel over the Internet

  - If you haven't used your SSH key for one year, GitHub will automatically delete your inactive SSH key

- reference : [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [Git Handbook](https://docs.github.com/en/get-started/using-git/about-git), [GitHub](https://github.com/), [.gitignore](https://git-scm.com/docs/gitignore)

## Suggested VS Code Settings

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnPaste": true,
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "explorer.compactFolders": false,
  "explorer.confirmDelete": false,
  "explorer.confirmDragAndDrop": false,
  "files.autoSave": "onFocusChange",
  "files.associations": {
    "*.js": "javascriptreact"
  },
  "prettier.printWidth": 9999,
  "prettier.semi": false,
  "prettier.trailingComma": "none",
  "terminal.integrated.fontFamily": "MesloLGS NF",
  "workbench.colorTheme": "One Dark Pro",
  "workbench.startupEditor": "none"
}
```

## Useful Browser Extensions

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

- [GoFullPage](https://chrome.google.com/webstore/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl)

## Generating a new site

Generate a new Docusaurus site with the **classic template**

```bash
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

## Creating a pair of SSH keys on Mac

```shell
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

## Adding the private key to ssh-agent

```bash
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
