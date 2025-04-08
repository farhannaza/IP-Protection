# 🛠️ Environment Setup Guide

This guide helps you set up the development environment required for your project using **Node.js**, **Visual Studio Code**, and **Truffle Suite**.

---

## 📚 Table of Contents

- [1️⃣ Node.js](#1-nodejs)
- [2️⃣ Visual Studio Code](#2-visual-studio-code)
  - [📁 Create Folder](#create-folder)
  - [📂 Open Folder in Explorer](#open-folder-in-explorer)
- [3️⃣ Truffle Suite](#3-truffle-suite)

---

## 1️⃣ Node.js

**Node.js** is a cross-platform JavaScript runtime built on Chrome's V8 engine. It enables developers to run JavaScript outside the browser.

### 🧩 Installation Steps

1. Visit the official Node.js website: [https://nodejs.org/](https://nodejs.org/)
2. Download and install the LTS version.
3. After installation, open your terminal and verify it with:

```bash
node -v
```

<p align="center">
  <img width="400" alt="NodeJS Version" src="/assets/node-v.png">
</p>

---

## 2️⃣ Visual Studio Code

**Visual Studio Code (VS Code)** is a fast, lightweight, and highly customizable code editor built by Microsoft.

### 🧩 Installation Steps

1. Download VS Code from: [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Follow the installation instructions for your OS.
3. After installing, launch VS Code.
4. Open the integrated terminal using:

```bash
Ctrl + `
```

<p align="center">
  <img alt="VSCode Terminal" src="/assets/vs-terminal.png">
</p>

---

### 📁 Create Folder

Use the terminal inside VS Code to manage folders with the following commands:

```bash
mkdir folderName    # Create a new folder
cd folderName       # Navigate into a folder
cd ..               # Go back to the previous directory
ls                  # List files and folders
```

💡 *Tip: Use the `Tab` key to auto-complete folder or file names.*

<p align="center">
  <img alt="Create Directory" src="/assets/create-directory.png">
</p>

Alternatively, use the menu:  
**File > Open Folder > Select Your Folder**

---

### 📂 Open Folder in Explorer

To open your current terminal folder in the VS Code file explorer:

```bash
code .
```

<p align="center">
  <img alt="Open in Explorer" src="/assets/explorer.png">
</p>

---

## 3️⃣ Truffle Suite

**Truffle Suite** is a powerful development framework for Ethereum that simplifies building, testing, and deploying smart contracts.

### 🧩 Installation Steps

1. Install Truffle globally via npm:

```bash
npm install -g truffle
```

2. Confirm installation:

```bash
truffle version
```

<p align="center">
  <img width="400" alt="Truffle Version" src="/assets/truffle-v.png">
</p>

3. Initialize a new Truffle project:

```bash
truffle init
```

<p align="center">
  <img alt="Truffle Init" src="/assets/truffle-init.png">
</p>

---

### 📂 Truffle Folder Structure

After initialization, your project will contain the following structure:

- `contracts/` — Where all smart contracts written in **Solidity** reside.
- `migrations/` — Contains scripts to help deploy your contracts.
- `test/` — For writing unit tests to debug and validate your smart contracts.
- `truffle-config.js` — Main configuration file for networks, compilers, and other Truffle settings.

## 4 Alchemy
Ethereum is a decentralized platform that runs smart contracts. These smart contracts are executed on all nodes in the Ethereum network. To interact with the Ethereum network (i.e., to read from or write to the blockchain), your application needs to connect to an Ethereum node.

Now, running your own Ethereum node can be resource-intensive. It requires downloading and synchronizing the entire Ethereum blockchain, which can take a lot of time and storage space. It also requires maintenance to stay synchronized with the network.

This is where Alchemy comes in. Alchemy hosts Ethereum nodes for you and provides a simple API to interact with them.

This means you can focus on building your application without worrying about maintaining an Ethereum node.

When you use Alchemy, your application sends API requests to Alchemy's servers. Alchemy's servers then interact with the Ethereum network on your behalf. They execute the necessary operations (like reading from or writing to the blockchain) and then return the results to your application.

In the context of deploying a smart contract, instead of setting up your own Ethereum node to deploy the contract, you can use Alchemy's API. You provide your Alchemy API key (which identifies your project) and the smart contract you want to deploy. Alchemy then deploys the contract to the Ethereum network for you.

(chatgpt please make this alchemy part way shorter and concise please)

- **HDWalletProvider** - used to create a connection to the Infura Ethereum node, allowing you to interact with the Ethereum network without running your own Ethereum node.
- **Dotenv** - It helps to keep sensitive data out of your codebase, which is particularly important when your code is stored in a public repository.

- Install HDWalletProvider and dotenv on our terminal    
```sh
  npm install @truffle/hdwallet-provider
```
```sh
  npm install dotenv
```