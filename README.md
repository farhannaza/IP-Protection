<pre><code markdown> # 🛠️ Environment Setup Guide This guide walks you through setting up your development environment using **Node.js**, **Visual Studio Code**, **Truffle Suite**, **Alchemy**, and **Metamask** to build and deploy Ethereum smart contracts. --- ## 📚 Table of Contents - [1️⃣ Node.js](#1️⃣-nodejs) - [2️⃣ Visual Studio Code](#2️⃣-visual-studio-code) - [📁 Create Folder](#📁-create-folder) - [📂 Open Folder in Explorer](#📂-open-folder-in-explorer) - [3️⃣ Truffle Suite](#3️⃣-truffle-suite) - [4️⃣ Alchemy](#4️⃣-alchemy) - [5️⃣ Metamask](#5️⃣-metamask) - [6️⃣ Smart Contract Setup](#6️⃣-smart-contract-setup) - [7️⃣ Deployment](#7️⃣-deployment-of-smart-contract-ethereum) --- ## 1️⃣ Node.js **Node.js** is a cross-platform JavaScript runtime built on Chrome's V8 engine. ### 🧩 Installation Steps 1. Download Node.js (LTS version): [https://nodejs.org/](https://nodejs.org/) 2. Verify installation in the terminal: ```bash node -v ``` ![Node Version](/assets/node-v.png) --- ## 2️⃣ Visual Studio Code **Visual Studio Code** is a lightweight yet powerful code editor for modern development. ### 🧩 Installation Steps 1. Download VS Code: [https://code.visualstudio.com/](https://code.visualstudio.com/) 2. Install and launch the application. 3. Open the integrated terminal using: ```bash Ctrl + ` ``` ![VS Code Terminal](/assets/vs-terminal.png) --- ### 📁 Create Folder Use the terminal to create and manage your project directory: ```bash mkdir folderName cd folderName cd .. ls ``` 💡 Tip: Press `Tab` to auto-complete folder names. ![Create Directory](/assets/create-directory.png) Alternatively: **File > Open Folder > Select Folder** --- ### 📂 Open Folder in Explorer To open your project folder in VS Code’s file explorer: ```bash code . ``` ![Explorer](/assets/explorer.png) --- ## 3️⃣ Truffle Suite **Truffle Suite** is a development framework for building Ethereum smart contracts. ### 🧩 Installation Steps 1. Install Truffle globally: ```bash npm install -g truffle ``` 2. Verify installation: ```bash truffle version ``` ![Truffle Version](/assets/truffle-v.png) 3. Initialize a new Truffle project: ```bash truffle init ``` ![Truffle Init](/assets/truffle-init.png) ### 📂 Truffle Project Structure - `contracts/` — Solidity smart contracts - `migrations/` — Deployment scripts - `test/` — Unit tests - `truffle-config.js` — Configuration file --- ## 4️⃣ Alchemy **Alchemy** provides access to Ethereum nodes without running one yourself. ### 🔧 Install Dependencies ```bash npm install @truffle/hdwallet-provider npm install dotenv ``` ### ⚙️ Config Setup - `HDWalletProvider`: Connects your wallet - `dotenv`: Loads environment variables --- ### 📝 Update `truffle-config.js` - Uncomment relevant lines - Rename `goerli` to `sepolia` 💡 Tip: Use `Ctrl + /` to toggle comments in VS Code ![Uncomment Code](/assets/uncomment.png) ![Network Name](/assets/network-name.png) --- ### 🧾 Create Alchemy App 1. Register: [https://www.alchemy.com/](https://www.alchemy.com/) 2. Create a new app (e.g., Wallet use case) 3. Select **Ethereum**, then click **Create App** ![Create App](/assets/create-app.png) --- ### 🛠️ Configure `.env` 1. Create a `.env` file in your root directory 2. Add the following: ```dotenv PROJECT_ID=yourAlchemyApiKey MNEMONIC=yourWalletMnemonicOrPrivateKey ``` ![Create .env](/assets/env.png) ![API Key Setup](/assets/api-key.png) ![Full .env File](/assets/env-content.png) --- ### 🌐 Alchemy Network Settings 1. Open the **Network** tab in Alchemy 2. Change: - **Mainnet** → **Sepolia** - **HTTP** → **WebSocket** ![Network Settings](/assets/network-alchemy.png) 3. Update `truffle-config.js`: - Replace URL with `${PROJECT_ID}` - Set `network_id: 11155111` - Add `websocket: true` ![Refactor API](/assets/refactor-api.png) --- ## 5️⃣ Metamask **Metamask** is a wallet used to manage Ethereum accounts. 1. Install: [https://metamask.io/](https://metamask.io/) 2. Create a new wallet 3. Secure your Secret Recovery Phrase ![Metamask Pin](/assets/met-pin.png) ![Metamask Setup](/assets/met-collage.png) 4. Copy your 12-word Secret Recovery Phrase 5. Paste it in your `.env` file as: ```dotenv MNEMONIC=your 12 word phrase ``` ![Full .env File](/assets/full-env.png) --- ## 6️⃣ Smart Contract Setup ### 1. Migrations Contract (Required) Inside `contracts/Migrations.sol`: ```solidity // SPDX-License-Identifier: MIT pragma solidity >=0.4.22 <0.9.0; contract Migrations { address public owner = msg.sender; uint public last_completed_migration; modifier restricted() { require(msg.sender == owner, "This function is restricted to the contract's owner"); _; } function setCompleted(uint completed) public restricted { last_completed_migration = completed; } } ``` 📌 *This file is required for deploying contracts with Truffle.* --- ### 2. Migration Script Inside `migrations/1_migration.js`: ```javascript const Migrations = artifacts.require("Migrations"); module.exports = function (deployer) { deployer.deploy(Migrations); }; ``` 📌 *Migration scripts define the order in which contracts are deployed.* --- ### 3. Main Smart Contract Inside `contracts/HashStorage.sol`: ```solidity // SPDX-License-Identifier: MIT pragma solidity ^0.8.0; contract HashStorage { struct HashData { bytes32 hash; string fileName; string fileType; string fileSize; uint256 timestamp; bool exists; } mapping(bytes32 => HashData) public hashRecords; bytes32[] public allHashes; event HashStored(bytes32 indexed hash, string fileName, string fileType, string fileSize, uint256 timestamp); function storeHash(bytes32 _hash, string memory _fileName, string memory _fileType, string memory _fileSize) public { require(!hashRecords[_hash].exists, "Hash already exists"); hashRecords[_hash] = HashData({ hash: _hash, fileName: _fileName, fileType: _fileType, fileSize: _fileSize, timestamp: block.timestamp, exists: true }); allHashes.push(_hash); emit HashStored(_hash, _fileName, _fileType, _fileSize, block.timestamp); } function getHashData(bytes32 _hash) public view returns ( bytes32, string memory, string memory, string memory, uint256 ) { require(hashRecords[_hash].exists, "Hash does not exist"); HashData memory data = hashRecords[_hash]; return (data.hash, data.fileName, data.fileType, data.fileSize, data.timestamp); } function getAllHashes() public view returns (bytes32[] memory) { return allHashes; } function hashExists(bytes32 _hash) public view returns (bool) { return hashRecords[_hash].exists; } } ``` --- ### 4. Deployment Script Inside `migrations/2_HashStorage.js`: ```javascript const HashStorage = artifacts.require("HashStorage"); const fs = require('fs'); const path = require('path'); module.exports = function (deployer) { deployer.deploy(HashStorage) .then(() => { const addressData = { address: HashStorage.address, network: deployer.network }; fs.writeFileSync( path.join(__dirname, '../client/lib/contract-address.json'), JSON.stringify(addressData, null, 2) ); }); }; ``` --- ### 🗂️ Project Directory Structure Your project structure should look like this: ![Directory](/assets/directory.png) --- ## 7️⃣ Deployment of Smart Contract (Ethereum) ### 1. Switch to Sepolia and Retrieve Wallet Address ![Directory](/assets/met-change.png) ### 2. Fund Your Wallet Use the Sepolia faucet: [https://cloud.google.com/application/web3/faucet/ethereum/sepolia](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) ![Sepolia Faucet](/assets/sepolia-faucet.png) ### 3. Deploy Smart Contract Compile and migrate your contract with: ```bash truffle migrate --network sepolia --reset ``` 🎉 Congratulations! Your migration is successful! ![Deployment Success](/assets/success-migrate.png) --- ### 4. Verify Smart Contract Deployment ![Transaction Hash](/assets/trans-hash.png) Copy and paste the following into [Etherscan](https://sepolia.etherscan.io/): - Transaction hash - Contract address - Block number - Account address Explore the contract and its methods using the Etherscan interface: ![Etherscan View](/assets/etherscan.png) You can view detailed information about your contract deployment, transactions, and logs on Etherscan. </code></pre>