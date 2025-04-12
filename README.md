# 🛠️ Environment Setup Guide

This guide walks you through setting up your development environment using **Node.js**, **Visual Studio Code**, **Truffle Suite**, **Alchemy**, and **Metamask** to build and deploy Ethereum smart contracts.

---

## 📚 Table of Contents

- [Node.js](#nodejs)  
- [Visual Studio Code](#visual-studio-code)  
  - [Create Folder](#create-folder)  
  - [Open Folder in Explorer](#open-folder-in-explorer)  
- [Truffle Suite](#truffle-suite)  
- [Alchemy](#alchemy)  
- [Metamask](#metamask)  
- [Smart Contract Setup](#smart-contract-setup)  
- [Deployment of Smart Contract (Ethereum)](#deployment-of-smart-contract-ethereum)  

---

## 1️⃣ Node.js

**Node.js** is a cross-platform JavaScript runtime built on Chrome's V8 engine.

### 🧩 Installation Steps

1. Download Node.js (LTS version): [https://nodejs.org/](https://nodejs.org/)  
2. After installation, verify in your terminal:

```bash
node -v
```

![Node Version](/assets/node-v.png)

---

## 2️⃣ Visual Studio Code

**Visual Studio Code** is a powerful code editor for modern development.

### 🧩 Installation Steps

1. Download VS Code: [https://code.visualstudio.com/](https://code.visualstudio.com/)  
2. Install and launch it.  
3. Open the integrated terminal:  
   Press `Ctrl + \`` (backtick)

![VS Code Terminal](/assets/vs-terminal.png)

---

### 📁 Create Folder

Use the terminal to manage your project directory:

```bash
mkdir folderName
cd folderName
cd ..
ls
```

💡 Tip: Press `Tab` to auto-complete names.

![Create Directory](/assets/create-directory.png)

Or go to:  
**File > Open Folder > Select Folder**

---

### 📂 Open Folder in Explorer

To open your folder in VS Code's file explorer:

```bash
code .
```

![Explorer](/assets/explorer.png)

---

## 3️⃣ Truffle Suite

**Truffle Suite** is a development framework for Ethereum smart contracts.

### 🧩 Installation Steps

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
- `truffle-config.js` — Config file  

---

## 4️⃣ Alchemy

**Alchemy** provides a way to access Ethereum nodes without running one yourself.

### 🔧 Install Dependencies

```bash
npm install @truffle/hdwallet-provider
npm install dotenv
```

### ⚙️ Config Setup

- `HDWalletProvider`: Connects your wallet  
- `dotenv`: Loads environment variables

---

### 📝 Update `truffle-config.js`

- Uncomment config lines  
- Rename `goerli` to `sepolia`  

💡 Use `Ctrl + /` to toggle comments in VS Code

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
2. Add:

```dotenv
PROJECT_ID=yourAlchemyApiKey
MNEMONIC=yourWalletMnemonicOrPrivateKey
```

![Create .env](/assets/env.png)  
![API Key Setup](/assets/api-key.png)  
![Full .env File](/assets/env-content.png)

---

### 🌐 Alchemy Network Settings

1. Open the **Network** tab in Alchemy  
2. Change:
   - **Mainnet** → **Sepolia**  
   - **HTTP** → **WebSocket**  

![Network Settings](/assets/network-alchemy.png)

3. Update `truffle-config.js`:
   - Replace URL with `${PROJECT_ID}`  
   - Set `network_id: 11155111`  
   - Add `websocket: true`  

![Refactor API](/assets/refactor-api.png)

---

## 5️⃣ Metamask

**Metamask** is a wallet for managing Ethereum accounts.

1. Install: [https://metamask.io/](https://metamask.io/)  
2. Create a wallet  
3. Secure your Secret Recovery Phrase

![Metamask Pin](/assets/met-pin.png)  
![Metamask Setup](/assets/met-collage.png)

4. Copy the 12-word Secret Recovery Phrase  
5. Paste into `.env` as:

```dotenv
MNEMONIC=your 12 word phrase
```

![Full .env File](/assets/full-env.png)

---

## 6️⃣ Smart Contract Setup

### 1. Migrations Contract (Required)

Inside `contracts/Migrations.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Migrations {
    address public owner = msg.sender;
    uint public last_completed_migration;

    modifier restricted() {
        require(
            msg.sender == owner,
            "This function is restricted to the contract's owner"
        );
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

Inside `migrations/1_migration.js`:

```javascript
const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
```

📌 *The `migrations/` folder contains scripts that help Truffle know which contracts to deploy and in what order.*

---

### 3. Main Smart Contract

Inside `contracts/HashStorage.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HashStorage {
    // Structure to store hash and file information
    struct HashData {
        bytes32 hash;
        string fileName;
        string fileType;
        string fileSize;
        uint256 timestamp;
        bool exists;
    }
    
    // Mapping to store HashData by hash
    mapping(bytes32 => HashData) public hashRecords;
    
    // Array to store all hashes for retrieval
    bytes32[] public allHashes;
    
    // Event to emit when new hash is stored
    event HashStored(
        bytes32 indexed hash, 
        string fileName, 
        string fileType,
        string fileSize,
        uint256 timestamp
    );

    // Function to store a hash with file information
    function storeHash(
        bytes32 _hash, 
        string memory _fileName,
        string memory _fileType,
        string memory _fileSize
    ) public {
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
    
    // Function to retrieve hash data
    function getHashData(bytes32 _hash) public view returns (
        bytes32,
        string memory,
        string memory,
        string memory,
        uint256
    ) {
        require(hashRecords[_hash].exists, "Hash does not exist");
        
        HashData memory data = hashRecords[_hash];
        return (
            data.hash,
            data.fileName,
            data.fileType,
            data.fileSize,
            data.timestamp
        );
    }
    
    // Function to get all stored hashes
    function getAllHashes() public view returns (bytes32[] memory) {
        return allHashes;
    }
    
    // Function to check if hash exists
    function hashExists(bytes32 _hash) public view returns (bool) {
        return hashRecords[_hash].exists;
    }
}
```

---

### 4. Deployment Script

Inside `migrations/2_HashStorage.js`:

```javascript
const HashStorage = artifacts.require("HashStorage");

module.exports = function (deployer) {
  deployer.deploy(HashStorage)
};
```

---

### 🗂️ Project Directory Structure

Your project should look like this:

![Directory](/assets/directory.png)

---

## 7️⃣ Deployment of Smart Contract (Ethereum)

### 1. Change to Sepolia Network and Retrieve Wallet Address 

![Directory](/assets/met-change.png)

### 2. Fund Your Wallet

Use the Sepolia faucet:  
[https://cloud.google.com/application/web3/faucet/ethereum/sepolia](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

![Directory](/assets/sepolia-faucet.png)

### 3. Deploy Smart Contract

Compile and deploy the smart contract with:

```bash
truffle migrate --network sepolia --reset
```

Congratulations, your migration has succeeded!

![Directory](/assets/success-migrate.png)

---

### 4. Verify Smart Contract Deployment

![Directory](/assets/trans-hash.png)

- Copy either the:
  - Transaction hash  
  - Contract address  
  - Block number  
  - Account  

Paste into [Etherscan Sepolia](https://sepolia.etherscan.io/) to view the transaction details.

![Directory](/assets/etherscan.png)

You can inspect and confirm all your contract interactions here.

