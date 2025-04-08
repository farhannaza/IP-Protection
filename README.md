# 🛠️ Environment Setup Guide

This guide helps you set up the development environment required for your project using **Node.js**, **Visual Studio Code**, **Truffle Suite**, and **Alchemy**.

---

## 📚 Table of Contents

- [1️⃣ Node.js](#1-nodejs)
- [2️⃣ Visual Studio Code](#2-visual-studio-code)
  - [📁 Create Folder](#create-folder)
  - [📂 Open Folder in Explorer](#open-folder-in-explorer)
- [3️⃣ Truffle Suite](#3-truffle-suite)
- [4️⃣ Alchemy](#4-alchemy)

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

---

## 4️⃣ Alchemy

**Alchemy** provides access to Ethereum nodes via a hosted API, so you don’t need to run your own full node.

You can deploy and interact with smart contracts on the Ethereum network using **Alchemy’s RPC URL** and **HDWalletProvider**.

### 🔧 Installation

Install the required dependencies:

```bash
npm install @truffle/hdwallet-provider
npm install dotenv
```

### 🛠️ Use Case

- **HDWalletProvider** — Connects your wallet to Ethereum through Alchemy’s RPC URL.
- **dotenv** — Loads environment variables securely (e.g., private key, API key).

You’ll use these in your `truffle-config.js` to configure networks like this:

```js
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    goerli: {
      provider: () => new HDWalletProvider(process.env.PRIVATE_KEY, process.env.ALCHEMY_URL),
      network_id: 5,       // Goerli network ID
      confirmations: 2,    // Wait for 2 confirmations
      timeoutBlocks: 200,  // Timeout for deployment
      skipDryRun: true     // Skip dry run before migrations
    }
  },
};
```

✅ That’s it! You can now deploy smart contracts using Alchemy without running a local Ethereum node.

---

Let me know if you want to include **MetaMask**, **Ganache**, or a smart contract deployment walkthrough next!
