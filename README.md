# 🛠️ Environment Setup Guide

This guide walks you through setting up your development environment using **Node.js**, **Visual Studio Code**, **Truffle Suite**, **Alchemy**, and **Metamask** to build and deploy Ethereum smart contracts.

---

## 📚 Table of Contents

- [1️⃣ Node.js](#1️⃣-nodejs)  
- [2️⃣ Visual Studio Code](#2️⃣-visual-studio-code)  
- [3️⃣ Truffle Suite](#3️⃣-truffle-suite)  
- [4️⃣ Alchemy](#4️⃣-alchemy)  
- [5️⃣ Metamask](#5️⃣-metamask)  
- [6️⃣ Smart Contract Setup](#6️⃣-smart-contract-setup)  
- [7️⃣ Deploying to Ethereum](#7️⃣-deploying-to-ethereum)  

---

## 1️⃣ Node.js

**Node.js** is a JavaScript runtime built on Chrome’s V8 engine.

### Installation Steps

1. Download Node.js (LTS version): [https://nodejs.org/](https://nodejs.org/)  
2. Verify the installation:

```bash
node -v
```

![Node Version](/assets/node-v.png)

---

## 2️⃣ Visual Studio Code

**VS Code** is a powerful code editor for modern development.

### Installation Steps

1. Download VS Code: [https://code.visualstudio.com/](https://code.visualstudio.com/)  
2. Install and launch it  
3. Open the integrated terminal: <kbd>Ctrl</kbd> + <kbd>`</kbd>

![VS Code Terminal](/assets/vs-terminal.png)

---

### 📁 Create Project Folder

Use these command in terminal to manage your project directory:

```bash
mkdir folderName
cd folderName
cd ..
ls
```

💡 Tip: Press `Tab` to auto-complete names.

Navigate to your desired directory and create folder `IP-Prottection`.

![Create Directory](/assets/create-directory.png)

Or go to:  
**File > Open Folder > Select Folder**

---

### 📂 Open Folder in Explorer

To open your folder in file explorer, type `code .` in the terminal

![Explorer](/assets/explorer.png)

---

## 3️⃣ Truffle Suite

**Truffle** is a development framework for Ethereum smart contracts.

### Installation Steps

1. Install Truffle globally:

```bash
npm install -g truffle
```

2. Verify the installation:

```bash
truffle version
```

![Truffle Version](/assets/truffle-v.png)

3. Initialize a new Truffle project:

```bash
truffle init
```

![Truffle Init](/assets/truffle-init.png)

### 📂 Truffle Project Structure

- `contracts/` — Solidity smart contracts  
- `migrations/` — Deployment scripts  
- `test/` — Unit tests  
- `truffle-config.js` — Configuration file  

---

## 4️⃣ Alchemy

**Alchemy** provides access to Ethereum nodes via APIs.

### Install Dependencies

```bash
npm install @truffle/hdwallet-provider
npm install dotenv
```

- `HDWalletProvider`: Connects your wallet  
- `dotenv`: Loads environment variables

---

### 📝 Update `truffle-config.js`

- Uncomment config lines  
- Rename `goerli` to `sepolia`  

💡 Use <kbd>Ctrl</kbd> + <kbd>/</kbd> to toggle comments/uncomments in VS Code

![Uncomment Code](/assets/uncomment.png)  
![Network Name](/assets/network-name.png)

---

### 🧾 Create Alchemy App

1. Register: [https://www.alchemy.com/](https://www.alchemy.com/)  
2. Create a new app (e.g., Wallet use case)  
3. Choose **Ethereum** and click **Create App**

![Create App](/assets/create-app.png)

---

### 🛠️ Configure `.env`

1. Create a `.env` file in the root directory  

![Create .env](/assets/env.png)  

2. Add the following into the `.env` file:

```env
PROJECT_ID=yourAlchemyApiKey
MNEMONIC=yourWalletMnemonicOrPrivateKey
```

3. Copy the API key from Alchemy website:
![API Key Setup](/assets/api-key.png)  

4. Paste it into the `.env` file:
![Full .env File](/assets/env-content.png)

---

### 🌐 Alchemy Network Settings

1. Open the **Network** tab in Alchemy  
2. Change:
   - **Mainnet** → **Sepolia**  
   - **HTTP** → **WebSocket**
3. Copy the Sepolia link

![Network Settings](/assets/network-alchemy.png)

4. Update `truffle-config.js`:
   - Replace the existing goerli link with sepolia's link
   - Replace URL with `${PROJECT_ID}`  
   - Set `network_id: 11155111`  
   - Add `websocket: true`  

![Refactor API](/assets/refactor-api.png)

---

## 5️⃣ Metamask - Retreive the MNEMONIC

**Metamask** is a wallet for managing Ethereum accounts.

1. Install: [https://metamask.io/](https://metamask.io/)  
2. Create a wallet (ensure that you secure your Secret Recovery Phrase)
3. Retrieve the MNEMONIC: 

![Metamask Setup](/assets/met-collage.png)

4. Copy the 12-word Secret Recovery Phrase  
5. Paste into `.env` like so:

![Full .env File](/assets/full-env.png)

---

## 6️⃣ Smart Contract Setup

### 1. Migrations Contract

Create `contracts/Migrations.sol`:

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

📌 *This file is required for deploying any contract with Truffle.*

---

### 2. Migration Script

Create `migrations/1_migration.js`:

```javascript
const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
```

---

### 3. Main Smart Contract

Create `contracts/HashStorage.sol`:

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

---

### 4. Deployment Script

Create `migrations/2_HashStorage.js`:

```javascript
const HashStorage = artifacts.require("HashStorage");
const fs = require('fs');
const path = require('path');

module.exports = function (deployer) {
  deployer.deploy(HashStorage)
    .then(() => {
      const addressData = {
        address: HashStorage.address,
        network: deployer.network
      };
      fs.writeFileSync(
        path.join(__dirname, '../client/lib/contract-address.json'),
        JSON.stringify(addressData, null, 2)
      );
    });
};
```

---

### 🗂️ Project Directory Structure

Your project should look like this:

![Directory](/assets/directory.png)

---

## 7️⃣ Deploying to Ethereum

### 1. Change to Sepolia Network and Retrieve Wallet Address

![Directory](/assets/met-change.png)

---

### 2. Fund Your Wallet

1. Use the Sepolia faucet:  
[Ethereum Sepolia faucet(Google)](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

2. Paste your wallet address:
![Sepolia Faucet](/assets/sepolia-faucet.png)

---

### 3. Deploy Smart Contract

Compile and migrate with:

```bash
truffle migrate --network sepolia --reset
```

🎉 Congrats! Your migration is successful.

![Success](/assets/success-migrate.png)

---

### 4. Verify Smart Contract Deployment

![Transaction Hash](/assets/trans-hash.png)

Copy and paste details into Etherscan:  
[https://sepolia.etherscan.io/](https://sepolia.etherscan.io/)

- Transaction hash  
- Contract address  
- Block number  
- Deployer account

![Etherscan](/assets/etherscan.png)

🔍 You can explore your deployed contract and verify method behavior here.

---
