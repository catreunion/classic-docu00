---
sidebar_position: 1
---

# Essential Tools for Coding

## Powerlevel10k

Install **MesloLGS** NF font : [Regular.ttf](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Regular.ttf), [Bold.ttf](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold.ttf), [Italic.ttf](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Italic.ttf), [Bold Italic.ttf](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold%20Italic.ttf)

Install the essential tools : [Brave Browser](https://brave.com/), [1Password](https://1password.com/downloads/mac/), [iTerm2](https://iterm2.com/downloads.html), [VS Code](https://code.visualstudio.com/download), [Postgres.app](https://postgresapp.com/)

```bash title="setup for Mac"
# install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# install a few utilities
brew install tree neofetch git sl

# install Powerlevel10k
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k
echo 'source ~/powerlevel10k/powerlevel10k.zsh-theme' >>~/.zshrc

# install oh-my-zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# restart the Mac
# run Terminal and complete the Powerlevel10k setup
```

```bash title="setup for Linux"
# update the system
sudo apt update && apt upgrade -y

# install a few utilities
sudo apt install tree git sl

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

# restart the computer
# run Terminal and complete the Powerlevel10k setup
```

## VS Code

suggested extensions

> coding : [One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme), [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

> frontend : [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

> backend : [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma), [MongoDB for VS Code](https://marketplace.visualstudio.com/items?itemName=mongodb.mongodb-vscode), [Rainbow CSV](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv)

```json title="suggested settings"
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

## Node.js

[Node.js](https://nodejs.org/en/) is a Javascript runtime environment for the development of web apps and network tools.

With Node.js, JavaScript can be executed outside a web browser <-- become a standalone process on Node

JavaScript packages are distributed via [npm Registry](https://www.npmjs.com/).

libraries / dependencies VS executables / binaries

```bash title="setup for Linux"
sudo apt install curl build-essential
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node  -v
```

## Yarn

A [package manager](https://classic.yarnpkg.com/en/docs/getting-started) created by Facebook.

```bash title="setup for Mac"
brew install yarn
```

```bash title="setup for Linux"
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

```bash title="basic operations"
# install all dependencies
yarn

# install a package to dependencies
yarn add <package>

# install a package to devDependencies
yarn add -d <package>

# remove a dependency
yarn remove <package>
```

## WSL2 Part 1

[WSL2](https://docs.microsoft.com/en-us/windows/wsl/about) lets developers run a GNU/Linux environment directly on Windows.

Your app, the **server**, runs remotely on **WSL2**.

VS Code, the **client**, runs on **Windows**.

Make sure **Add to PATH** is ticked when installing VS Code.

Install [Windows Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701?hl=en-hk&gl=hk). Run Windows Terminal → Settings → Open JSON file

```json title="suggested settings for Windows Terminal"
"defaults":
{
  "closeOnExit": "always",
  "colorScheme": "Tango Dark",
  "fontFace": "MesloLGS NF",
  "fontSize": 12
},
```

Save and quit Windows Terminal.

## WSL2 Part 2

Open Windows Terminal with **admin privileges**.

```bash title="setup Ubuntu & Powerlevel10k"
# install Ubuntu
wsl --install

# restart Windows
# create a new user account

# run Ubuntu
wsl -d Ubuntu

# update Ubuntu
sudo apt update && sudo apt upgrade -y

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

# restart Windows
# run Windows Terminal and complete the Powerlevel10k setup

# open VS Code from Windows Terminal
code .
```

## WSL2 Part 3

In **local environment** : install Remote Development (includes WSL, Dev Containers, Remote - SSH), One Dark Pro

In **WSL environment** : Prettier, Tailwind CSS IntelliSense, Volar

```json title="suggested VS Code Settings"
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
