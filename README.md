# 🛠️ Environment Setup Guide

This guide walks you through setting up your development environment using **Node.js**, **Visual Studio Code**, **Truffle Suite**, and **Alchemy**.

---

## 📚 Table of Contents

- [1️⃣ Node.js](#1-nodejs)
- [2️⃣ Visual Studio Code](#2-visual-studio-code)  
  - [📁 Create Folder](#create-folder)  
  - [📂 Open Folder in Explorer](#open-folder-in-explorer)
- [3️⃣ Truffle Suite](#3-truffle-suite)
- [4️⃣ Alchemy](#4-alchemy)
- [5️⃣ Metamask](#5-metamask)

---

## 1️⃣ Node.js

**Node.js** is a cross-platform JavaScript runtime built on Chrome's V8 engine. It enables you to run JavaScript code outside the browser.

### 🧩 Installation Steps

1. Go to the official Node.js website: [https://nodejs.org/](https://nodejs.org/)  
2. Download and install the **LTS** version.  
3. After installation, verify it in your terminal:

```bash
node -v
```

<p align="center">
  <img width="400" alt="NodeJS Version" src="/assets/node-v.png">
</p>

---

## 2️⃣ Visual Studio Code

**Visual Studio Code (VS Code)** is a lightweight yet powerful code editor developed by Microsoft, ideal for modern web development.

### 🧩 Installation Steps

1. Download VS Code from: [https://code.visualstudio.com/](https://code.visualstudio.com/)  
2. Follow the installation instructions for your operating system.  
3. Launch VS Code after installation.  
4. Open the integrated terminal using:

```bash
Ctrl + `
```

<p align="center">
  <img alt="VSCode Terminal" src="/assets/vs-terminal.png">
</p>

---

### 📁 Create Folder

Use the terminal to manage your project folders:

```bash
mkdir folderName    # Create a folder
cd folderName       # Enter the folder
cd ..               # Go back a directory
ls                  # List files and folders
```

💡 *Tip: Press `Tab` to auto-complete folder or file names.*

<p align="center">
  <img alt="Create Directory" src="/assets/create-directory.png">
</p>

Or use the menu:  
**File > Open Folder > Select Your Folder**

---

### 📂 Open Folder in Explorer

To open the current terminal directory in VS Code’s Explorer, type this command in the terminal:

```bash
code .
```

<p align="center">
  <img alt="Open in Explorer" src="/assets/explorer.png">
</p>

---

## 3️⃣ Truffle Suite

**Truffle Suite** is a development framework for Ethereum that makes it easier to build, test, and deploy smart contracts.

### 🧩 Installation Steps

1. Install Truffle globally:

```bash
npm install -g truffle
```

2. Verify the installation:

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

### 📂 Truffle Project Structure

After initialization, your project will include:

- `contracts/` — Contains Solidity smart contracts  
- `migrations/` — Deployment scripts for your contracts  
- `test/` — Smart contract unit tests  
- `truffle-config.js` — Project configuration file

---

## 4️⃣ Alchemy

**Alchemy** is a blockchain development platform that provides APIs for accessing Ethereum without running your own node.

### 🔧 Installation

Install the required packages:

```bash
npm install @truffle/hdwallet-provider
npm install dotenv
```

### ⚙️ Configuration

1. **HDWalletProvider** connects your wallet to Ethereum through Alchemy’s RPC URL.  
2. **dotenv** securely loads environment variables (e.g., private key, API key).

---

### 📝 Update `truffle-config.js`

- Uncomment the necessary lines to enable the network configuration.

💡 *Tip: Use `Ctrl + /` to toggle comments in VS Code.*

<p align="center">
  <img alt="Uncomment Code" src="/assets/uncomment.png">
</p>

- Rename the network from `goerli` to `sepolia`.

<p align="center">
  <img alt="Network Name" src="/assets/network-name.png">
</p>

---

### 🧾 Create Alchemy App

1. Register at: [https://www.alchemy.com/](https://www.alchemy.com/)  
2. Create a new app:

<p align="center">
  <img alt="Create App" src="/assets/create-app.png">
</p>

3. Set an app name and choose your use case (e.g., Wallet).  
4. Select **Ethereum** as the chain and click **Create App**.

---

### 🛠️ Configure Environment Variables

1. Create a `.env` file in your project directory.

<p align="center">
  <img width="400" alt="Create .env" src="/assets/env.png">
</p>

2. Copy the Alchemy API Key and add it to `.env`:

<p align="center">
  <img alt="API Key Setup" src="/assets/api-key.png">
</p>

```dotenv
PROJECT_ID=yourAlchemyApiKey
MNEMONIC=yourWalletMnemonicOrPrivateKey
```

<p align="center">
  <img alt="Full .env File" src="/assets/env-content.png">
</p>

---

### 🌐 Alchemy Network Settings

1. Go to the **Network** tab in your Alchemy dashboard.  
2. In the app settings:
   - Change the network from **Mainnet** to **Sepolia**.  
   - Switch from **HTTP** to **WebSocket**.  
   - Copy the WebSocket URL.

<p align="center">
  <img alt="Network Settings" src="/assets/network-alchemy.png">
</p>

3. Refactor your Alchemy URL in `truffle-config.js`:
   - Paste the copied WebSocket URL.
   - Replace the API part in the link with `${PROJECT_ID}` to load it from `.env`.
   - Change `network_id: 5` to `11155111` (Sepolia's network ID).
   - Add `websocket: true`.

<p align="center">
  <img alt="Refactor API" src="/assets/refactor-api.png">
</p>

---

## 5️⃣ Metamask

**Metamask** is a browser extension that allows you to interact with the Ethereum blockchain and manage your wallet.

1. Install Metamask: [https://metamask.io/](https://metamask.io/)  
   - Create a new wallet if you don't have one.  
   - **Make sure to store your Secret Recovery Phrase securely.**

2. Find your **Secret Recovery Phrase** (MNEMONIC):  
   - Complete the required security steps.  
   - Copy the 12-word Secret Recovery Phrase.

<p align="center">
  <img alt="Metamask Setup" src="/assets/met-collage.png">
</p>

3. Paste it into your `.env` file:

<p align="center">
  <img alt="Full .env File" src="/assets/full-env.png">
</p>

---


