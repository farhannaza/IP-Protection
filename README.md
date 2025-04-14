<h1 align="center">   
  IP-Shield (Ethereum)
</h1> 

## 🛠️ Environment Setup Guide

This guide walks you through setting up your development environment using **Node.js**, **Visual Studio Code**, **Truffle Suite**, **Alchemy**, and **Metamask** to build and deploy Ethereum smart contracts.

---

## 📚 Table of Contents

- [1️⃣ Node.js](#1️⃣-nodejs)  
- [2️⃣ Visual Studio Code](#2️⃣-visual-studio-code)  
- [3️⃣ Truffle Suite](#3️⃣-truffle-suite)  
- [4️⃣ Alchemy](#4️⃣-alchemy)  
- [5️⃣ Metamask](#5️⃣-metamask)  
- [6️⃣ Smart Contract Setup](#6️⃣-smart-contract-setup)  
- [7️⃣ Sepolia: Deploying to Ethereum](#7️⃣-deploying-to-ethereum)  
- [8 Ganache: Deploying to Ethereum](#7️⃣-deploying-to-ethereum) 

---

<h1 align="center">   
  Blockchain Development: Backend
</h1> 

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
mkdir 'folderName' : To create new folder
cd 'folderName'    : To go to specific folder
cd ..              : To go back to previous folder
ls                 : List folder content
```

💡 Tip: Press `Tab` to auto-complete names.

Navigate to your desired directory and create folder `IP-Prottection`.

![Create Directory](/assets/create-directory.png)

Alternative method (If you do not want to use terminal):  
**Press File > Open Folder > Select Your Folder**

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

module.exports = function (deployer) {
  deployer.deploy(HashStorage)
};
```

---

### 🗂️ Project Directory Structure

Your project should look like this:

![Directory](/assets/directory.png)

---

## 7️⃣ Sepolia: Deploying to Ethereum

### 1. Change to Sepolia Network and Retrieve Wallet Address

![Directory](/assets/met-change.png)

---

### 2. Fund Your Wallet
fund in your wallet is needed to pay for the migration process.

1. Use the Sepolia faucet:  
[Ethereum Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

2. Paste your wallet address:
![Sepolia Faucet](/assets/sepolia-faucet.png)

---

### 3. Deploy Smart Contract

Compile and migrate with:

```bash
truffle migrate --network sepolia --reset
```

![Success](/assets/success-migrate.png)
🎉 Congrats! Your migration is successful.

---

### 4. Verify Smart Contract Deployment

![Transaction Hash](/assets/trans-hash.png)

Copy and paste either one into Etherscan:  
[Sepolia Etherscan](https://sepolia.etherscan.io/)

- Transaction hash  
- Contract address  
- Block number  
- Deployer account

![Etherscan](/assets/etherscan.png)

You can explore your deployed contract and verify method behavior here.

---

## 7️⃣ Ganache: Deploying to Ethereum
Ganache is personal blockchain for Ethereum development that you can use to deploy contracts, develop applications, and run tests.

1. Setup

- download : ganache link

- install and launch the software

2. create new workspace:

![Etherscan](/assets/ganache-dash.png)

- choose name for your Ethereum local network.
- go to server tab and change the hostname to Loopback.
  - we choose loopback since we will only use one device for the development.
  - Loopback represent your own device.
  - you can always use other setting as needed.
- Start your new workspace.

![Etherscan](/assets/ganache-collage.png)


3. Copy ganache RPC server URL :

![Etherscan](/assets/ganache-ip.png)

4. Add Ganache Network To Metamask
    - fill in all information to add custom network as per picture

![Etherscan](/assets/met-ganache.png)

5. Import Ganache account to Metamask


- Choose your desired account:

![Etherscan](/assets/ganache-key.png)

- copy the private key:

![Etherscan](/assets/ganache-priv.png)

- Add the account into metamask by importing the private key: 

![Etherscan](/assets/met-ganachenet.png)

- Succesfully added ganache account to metamask!

![Etherscan](/assets/met-gansuc.png)

6. Refactor truffle-config.js

- Uncomment the highlighted area `truffle-config.js`
- Change the file base on information from Ganache
    - `development` to `ganache`
    - port: `8545` to `7545`
    - network_id: `*` to `5777`

![Etherscan](/assets/refactor.png)

- version: `0.8.21` to `0.8.19`

![Etherscan](/assets/truffle-version.png)

7. Ganache: Deploy Smart Contract

deploy using this command: 
`truffle migrate --network ganache --reset`

![Etherscan](/assets/ganache-deploy.png)

- Success!

8. Verify Smart Contract Deployment

- You can verify either on blocks or transaction 

- chatgpt, please explain the difference between those two

![Etherscan](/assets/ganache-verify.png)

Here's a breakdown of what those blocks might represent:

- Initialize Block (Block 0): The first block which often referred as genesis block or Block 0. This block doesn't contain any transactions (since you haven't deployed any contracts or made any transactions yet), but it's necessary to initialize the blockchain. All subsequent blocks (which will contain your transactions) will link back to this block.

- Migrations Contract Deployment (Block 1): The first transaction is usually the deployment of the Migrations contract. Truffle uses this contract to keep track of which migrations have been run. The contract is deployed only once, when you run your migrations for the first time.

- Migrations Contract Update (Block 2): After the Migrations contract is deployed, Truffle records that the first migration (the deployment of the Migrations contract itself) has been completed. It does this by calling a function on the Migrations contract, which creates a transaction.

- Your Contract Deployment (Block 3): The next transaction is the deployment of your actual contract. This is the contract you've written and are deploying with your second migration script.

- Migrations Contract Update (Block 4): After your contract is deployed, Truffle records that the second migration has been completed. Again, it does this by calling a function on the Migrations contract, which creates another transaction.

## 8️⃣ Ganache: Deploying to Ethereum

**Ganache** is a personal Ethereum blockchain used for deploying contracts, developing applications, and testing.

### 1. Install and Launch Ganache

- Download Ganache: [Ganache Official Website](https://trufflesuite.com/ganache/)
- Install and open the software

### 2. Create a New Workspace

- Choose a name for your local Ethereum network
- Navigate to the **Server** tab and set the **Hostname** to **Loopback**
  - Loopback refers to your own device, ideal for local development
- Click **Save Workspace** and **Start**

![Ganache Dashboard](/assets/ganache-dash.png)
![Ganache Config](/assets/ganache-collage.png)

### 3. Retrieve RPC Server URL

- Copy the RPC URL displayed at the top (e.g., `http://127.0.0.1:7545`)

![RPC URL](/assets/ganache-ip.png)

### 4. Add Ganache Network to MetaMask

- Open MetaMask and go to **Settings > Networks > Add Network**
- Enter the following:
  - Network Name: Ganache
  - New RPC URL: Paste the RPC URL from Ganache
  - Chain ID: 1337 or 5777 (whichever Ganache displays)
  - Currency Symbol: ETH
- Save the network

![MetaMask Add Network](/assets/met-ganache.png)

### 5. Import Ganache Account to MetaMask

- In Ganache, select an account and click **Export Private Key**
- Copy the private key

![Private Key](/assets/ganache-key.png)
![Private Key Export](/assets/ganache-priv.png)

- In MetaMask, go to **Import Account** and paste the private key

![Import Account](/assets/met-ganachenet.png)
![Success Import](/assets/met-gansuc.png)

### 6. Update `truffle-config.js`

Modify your configuration as follows:

```js
ganache: {
  host: "127.0.0.1",
  port: 7545,
  network_id: "5777", // Match Ganache network id
},
```

- Also, make sure the compiler version is set to `0.8.19` to match your contract:

```js
compilers: {
  solc: {
    version: "0.8.19"
  }
}
```

![Truffle Config](/assets/refactor.png)
![Compiler Version](/assets/truffle-version.png)

### 7. Deploy to Ganache

Run the deployment command:

```bash
truffle migrate --network ganache --reset
```

![Deploy Success](/assets/ganache-deploy.png)

🎉 Your smart contract is now deployed to your local Ganache blockchain!

### 8. Verify Deployment

Ganache provides both a block explorer and transaction list. Here's how to interpret them:

- **Blocks** represent grouped transactions. Each new contract deployment creates a block.
- **Transactions** are the individual actions (like deploying a contract or sending ETH).

![Ganache Verification](/assets/ganache-verify.png)

#### Example Breakdown:

- **Block 0**: The Genesis block (initial block with no transactions)
- **Block 1**: Deployment of the `Migrations` contract by Truffle
- **Block 2**: Records that the migration has been completed
- **Block 3**: Deployment of your `HashStorage` contract














