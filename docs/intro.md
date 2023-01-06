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

# find out the executable path of zsh
whereis zsh

# find out your username
whoami

# set zsh as the default shell
chsh -s /usr/bin/zsh <username>

# quit Terminal and restart the Mac
# run Terminal and complete the Powerlevel10k setup
```

```bash title="setup for Linux"
# update the system
sudo apt update && apt upgrade -y

# install a few utilities
sudo apt install tree neofetch git sl

# install Powerlevel10k
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k
echo 'source ~/powerlevel10k/powerlevel10k.zsh-theme' >>~/.zshrc

# install zsh
sudo apt install zsh

# run Terminal and complete the Powerlevel10k setup
```

## Node.js

[Node.js](https://nodejs.org/en/) is a Javascript runtime environment in the development of web apps and network tools. With Node.js, JavaScript can be executed outside a web browser <-- A standalone process on Node

JavaScript packages are distributed via [npm Registry](https://www.npmjs.com/).

libraries / dependencies VS executables / binaries

```bash title="installing Node.js"
sudo apt update
sudo apt install curl build-essential
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node  -v
```

## Yarn

A [package manager](https://classic.yarnpkg.com/en/docs/getting-started) created by Facebook.

```bash title="installing Yarn via Homebrew"
brew install yarn
brew upgrade yarn
```

```bash title="installing Yarn via repository"
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

VS Code, the **client**, runs on **Windows**.

Your app, the **server**, runs remotely on **WSL2**.

Install [VS Code](https://code.visualstudio.com/download). Make sure **Add to PATH** is ticked during installation.

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

```bash title="setup Ubuntu & Powerlevel10k"
# open Windows Terminal with admin privileges

# install Ubuntu
wsl --install

# restart Windows
# create a user account

# run Ubuntu
wsl -d Ubuntu

# update Ubuntu's repos
sudo apt update

# install system updates
sudo apt upgrade -y

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

Install these extensions in **local environment** : Remote Development (includes WSL, Dev Containers, Remote - SSH), One Dark Pro

Install these extensions in **WSL environment** : Prettier, Tailwind CSS IntelliSense, Volar

## Suggested VS Code Settings

```json title="for Mac"
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

```json title="for Windows"
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
