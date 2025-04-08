# 🛠️ Environment Setup Guide

This guide helps you set up the development environment needed for your project using **Node.js**, **Visual Studio Code**, and **Truffle Suite**.

---

## 📚 Table of Contents

- [1️⃣ Node.js](#1-nodejs)
- [2️⃣ Visual Studio Code](#2-visual-studio-code)
  - [📁 Create Folder](#create-folder)
  - [📂 Open Folder in Explorer](#open-folder-in-explorer)
- [3️⃣ Truffle Suite](#3-truffle-suite)

---

## 1️⃣ Node.js

**Node.js** is an open-source, cross-platform JavaScript runtime environment that allows you to run JavaScript code outside of the web browser.

### 🧩 Installation Steps

1. Download Node.js from the official website: [https://nodejs.org/](https://nodejs.org/)
2. Install it following the setup instructions.
3. Open Command Prompt (CMD) or Terminal and run the command below to verify the installation:

```bash
node -v
```

<p align="center">
  <img width="400" alt="NodeJS" src="/assets/node-v.png">
</p>

---

## 2️⃣ Visual Studio Code

**Visual Studio Code (VS Code)** is a free, powerful, and lightweight code editor developed by Microsoft.

### 🧩 Installation Steps

1. Download VS Code from the official website: [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Follow the installation instructions.
3. Once installed, open VS Code.
4. Open the terminal in VS Code by pressing:

```bash
Ctrl + `
```

<p align="center">
  <img alt="VSCode Terminal" src="/assets/vs-terminal.png">
</p>

---

### 📁 Create Folder

Inside the VS Code terminal, use the following commands to manage folders:

```bash
cd folderName       # Navigate into a folder
cd ..               # Go back to the previous directory
ls                  # List files and folders
mkdir folderName    # Create a new folder
```

💡 *Tip: Press the `Tab` key to auto-complete file or folder names while typing.*

<p align="center">
  <img alt="Create Directory" src="/assets/create-directory.png">
</p>

Alternatively, go to **File > Open Folder > Choose Your Folder** to open a directory visually.

---

### 📂 Open Folder in Explorer

To open your current terminal directory in the VS Code explorer, use the following command:

```bash
code .
```

<p align="center">
  <img alt="explorer" src="/assets/explorer.png">
</p>

---

## 3️⃣ Truffle Suite

**Truffle Suite** is a development environment, testing framework, and asset pipeline for Ethereum. It simplifies writing, testing, and deploying smart contracts using **Solidity** and helps build full-stack dApps efficiently.

### 🧩 Installation Steps

1. To install Truffle globally, run:

```bash
npm install -g truffle
```

2. To verify the installation, use:

```bash
truffle version
```

<p align="center">
  <img width="400" alt="truffle-v" src="/assets/truffle-v.png">
</

3. Initialize truffle environment

```bash
truffle init
```

<p align="center">
  <img alt="truffle-v" src="/assets/truffle-init.png">
</

### Folder Description
  - **Contracts** - This file contain all of our smart contract
  - **Migrations** - This file is where we write script to deploy the smart contract
  - **Test** - This file is for test/debug our smart contract
  - `truffle-config.js` - This file contain our truffle configuration
---
