# 🛠️ Environment Setup Guide

This guide walks you through setting up your development environment using **Node.js**, **Visual Studio Code**, **Truffle Suite**, **Alchemy**, and **Metamask** to build and deploy Ethereum smart contracts.

---

## 📚 Table of Contents

- [1️⃣ Node.js](#1️⃣-nodejs)
- [2️⃣ Visual Studio Code](#2️⃣-visual-studio-code)
  - [📁 Create Folder](#📁-create-folder)
  - [📂 Open Folder in Explorer](#📂-open-folder-in-explorer)
- [3️⃣ Truffle Suite](#3️⃣-truffle-suite)
- [4️⃣ Alchemy](#4️⃣-alchemy)
- [5️⃣ Metamask](#5️⃣-metamask)
- [6️⃣ Smart Contract Setup](#6️⃣-smart-contract-setup)
- [7️⃣ Deployment](#7️⃣-deployment-of-smart-contract-ethereum)

---

## 1️⃣ Node.js

```bash
# Download and install from https://nodejs.org/ (LTS version)
node -v  # Verify installation
```

---

## 2️⃣ Visual Studio Code

```bash
# Download from https://code.visualstudio.com/
# Launch and open terminal with:
Ctrl + `
```

### 📁 Create Folder

```bash
mkdir folderName
cd folderName
cd ..
ls  # View folders
```

---

### 📂 Open Folder in Explorer

```bash
code .  # Open folder in VS Code
```

---

## 3️⃣ Truffle Suite

```bash
npm install -g truffle  # Install Truffle
truffle version        # Verify
truffle init           # Initialize project
```

### 📂 Truffle Project Structure

- `contracts/` — Solidity contracts  
- `migrations/` — Deployment scripts  
- `test/` — Unit tests  
- `truffle-config.js` — Config file

---

## 4️⃣ Alchemy

```bash
npm install @truffle/hdwallet-provider dotenv  # Dependencies
```

### ⚙️ Config Setup

Update `truffle-config.js`:

```js
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `wss://eth-sepolia.g.alchemy.com/v2/${process.env.PROJECT_ID}`),
      network_id: 11155111,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      websocket: true
    }
  },
  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
};
```

---

### 🧾 Create Alchemy App

```text
1. Go to https://www.alchemy.com/
2. Sign up and create new app
3. Select Ethereum + Sepolia network
4. Get HTTP/WebSocket endpoint & API Key
```

---

### 🛠️ Configure `.env`

```dotenv
PROJECT_ID=yourAlchemyApiKey
MNEMONIC=your 12 word phrase
```

---

## 5️⃣ Metamask

```text
1. Install from https://metamask.io/
2. Create or import wallet
3. Save your Secret Recovery Phrase securely
4. Add phrase in `.env` under MNEMONIC
```

---

## 6️⃣ Smart Contract Setup

### 🔹 Migrations Contract (`contracts/Migrations.sol`)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Migrations {
    address public owner = msg.sender;
    uint public last_completed_migration;

    modifier restricted() {
        require(msg.sender == owner, "This function is restricted to the contract's owner");
        _;
    }

    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }
}
```

### 🔹 Migration Script (`migrations/1_migration.js`)

```js
const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
```

### 🔹 Main Contract (`contracts/HashStorage.sol`)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HashStorage {
    struct HashData {
        bytes32 hash;
        string fileName;
        string fileType;
        string fileSize;
        uint256 timestamp;
        bool exists;
    }

    mapping(bytes32 => HashData) public hashRecords;
    bytes32[] public allHashes;

    event HashStored(bytes32 indexed hash, string fileName, string fileType, string fileSize, uint256 timestamp);

    function storeHash(bytes32 _hash, string memory _fileName, string memory _fileType, string memory _fileSize) public {
        require(!hashRecords[_hash].exists, "Hash already exists");

        hashRecords[_hash] = HashData({
            hash: _hash,
            fileName: _fileName,
            fileType: _fileType,
            fileSize: _fileSize,
            timestamp: block.timestamp,
            exists: true
        });

        allHashes.push(_hash);
        emit HashStored(_hash, _fileName, _fileType, _fileSize, block.timestamp);
    }

    function getHashData(bytes32 _hash) public view returns (
        bytes32, string memory, string memory, string memory, uint256
    ) {
        require(hashRecords[_hash].exists, "Hash does not exist");
        HashData memory data = hashRecords[_hash];
        return (data.hash, data.fileName, data.fileType, data.fileSize, data.timestamp);
    }

    function getAllHashes() public view returns (bytes32[] memory) {
        return allHashes;
    }

    function hashExists(bytes32 _hash) public view returns (bool) {
        return hashRecords[_hash].exists;
    }
}
```

### 🔹 Deployment Script (`migrations/2_HashStorage.js`)

```js
const HashStorage = artifacts.require("HashStorage");
const fs = require('fs');
const path = require('path');

module.exports = function (deployer, network) {
  deployer.deploy(HashStorage).then(() => {
    const addressData = {
      address: HashStorage.address,
      network: network
    };
    fs.writeFileSync(
      path.join(__dirname, '../client/lib/contract-address.json'),
      JSON.stringify(addressData, null, 2)
    );
  });
};
```

---

## 7️⃣ Deployment of Smart Contract (Ethereum)

### 🪙 Fund Wallet

Use Sepolia faucet:

```text
https://cloud.google.com/application/web3/faucet/ethereum/sepolia
```

---

### 🚀 Deploy

```bash
truffle migrate --network sepolia --reset
```

🎉 Deployment successful!

---

### 🔍 Verify on Etherscan

- Visit [https://sepolia.etherscan.io/](https://sepolia.etherscan.io/)
- Paste transaction hash / contract address
- Review:
  - **Tx Hash** — Unique identifier of the deployment transaction
  - **Block Number** — Block that includes the transaction
  - **From** — Your wallet address
  - **To** — Smart contract (if deploying)

✅ All methods defined in the contract (e.g., `storeHash`, `getHashData`) can be inspected and tested using Etherscan’s UI

