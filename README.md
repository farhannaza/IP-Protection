<h1 align="center">   
  IP-Shield (Ethereum)
</h1> 

## 🛠️ Environment Setup Guide

This guide walks you through setting up your development environment using **Node.js**, **Visual Studio Code**, **Truffle Suite**, **Alchemy**, and **Metamask** to build and deploy Ethereum smart contracts.

---

## 📚 Table of Contents
- [Chapter 1: Backend](#backend)  
  - [1️⃣ Node.js](#1️⃣-nodejs)  
  - [2️⃣ Visual Studio Code](#2️⃣-visual-studio-code)  
  - [3️⃣ Truffle Suite](#3️⃣-truffle-suite)  
  - [4️⃣ Alchemy](#4️⃣-alchemy)  
  - [5️⃣ Metamask](#5️⃣-metamask)  
  - [6️⃣ Smart Contract Setup](#6️⃣-smart-contract-setup)  
  - [7️⃣ Sepolia: Deploying to Ethereum Testnet](#7️⃣-deploying-to-ethereum-testnet)  
  - [8️⃣ Ganache: Local Deployment for Testing](#8️⃣-ganache-local-deployment-for-testing)
- [Chapter 2: Frontend](#frontend)  
  - [1️⃣ Next.js Framework](#1️⃣-nextjs-framework)  
  - [2️⃣ UI Customization & ABI Integration](#2️⃣-ui-customization--abi-integration)  


---

<h1 align="center">   
  Chapter 1: Backend
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

## 7️⃣ Sepolia: Deploying to Ethereum Testnet

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

## 8️⃣ Ganache: Local Deployment for Testing

**Ganache** is a personal Ethereum blockchain used for deploying contracts, developing applications, and testing.

### 1. Install and Launch Ganache

- Download Ganache: [Ganache Official Website](https://trufflesuite.com/ganache/)
- Install and open the software

### 2. Create a New Workspace

- Choose a name for your local Ethereum network
![Ganache Dashboard](/assets/ganache-dash.png)

- Navigate to the **Server** tab and set the **Hostname** to **Loopback**
  - Loopback refers to your own device, ideal for local development
- Click **Save Workspace** and **Start**
![Ganache Config](/assets/ganache-collage.png)

### 3. Retrieve RPC Server URL

- Copy the RPC URL displayed at the top (e.g., `http://127.0.0.1:7545`)

![RPC URL](/assets/ganache-ip.png)

### 4. Add Ganache Network to MetaMask

- Open MetaMask and go to **Network logo(top left) > Add a custom network**
- Enter the following:
  - Network Name: Ganache
  - New RPC URL: Paste the RPC URL from Ganache
  - Chain ID: 1337
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

- Successfully importing wallet!

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
![Truffle Config](/assets/refactor.png)

- Also, make sure the compiler version is set to `0.8.19`:
- Using compilers with latest version on Ganache network might introduce unexpected error during migration.

```js
compilers: {
  solc: {
    version: "0.8.19"
  }
}
```
![Compiler Version](/assets/truffle-version.png)

### 7. Deploy to Ganache

Run the deployment command:

```bash
truffle migrate --network ganache --reset
```

![Deploy Success](/assets/ganache-deploy.png)

Your smart contract is now deployed to your local Ganache blockchain!

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

<h1 align="center">   
  Chapter 2: Frontend
</h1> 

## 1️⃣ Next.js Framework

In this section, we’ll set up the frontend for your dApp using **Next.js**, a popular React-based framework ideal for building fast and scalable web interfaces.

### 🧱 Setup Instructions

1. Run the following command inside your `IP-Protection` project directory:

```bash
npx create-next-app@latest
```

2. When prompted, name your project `client`.  
This matches the default Truffle `contracts_build_directory` used for ABI output we will use later.

3. Accept all default configuration options when prompted.

![Install Next.js](/assets/install-nextjs.png)

4. Navigate into your newly created frontend directory:

```bash
cd client
```

5. Start the development server:

```bash
npm run dev
```

6. Open the provided **Local** or **Network** URL in your browser.

If successful, you should see the default Next.js landing page:

![Next.js Client](/assets/nextjs-client.png)

---

## 2️⃣ UI Customization & ABI Integration

Now that our frontend is running, let’s connect it to the blockchain by linking the compiled contract artifacts.

### 1. Define the ABI Output Location

Update your `truffle-config.js` file to point to the frontend directory, so contract builds land inside your Next.js project:

```js
contracts_build_directory: "./client/app/routes/artifacts",
```

![ABI Directory](/assets/abi-directory.png)

### 2. Recompile Contracts

Recompile the smart contracts and migrate them to the local Ganache network:

```bash
truffle migrate --network ganache --reset
```

You should now see contract ABIs generated under:

```
client/app/routes/artifacts/
```

![ABI Location](/assets/abi-location.png)

### 3. Install Frontend Dependencies

Install the UI and blockchain interaction libraries used in this project:

```bash
npx shadcn@latest init
npm i lucide-react
npm i sonner
npm i radix-ui
npm i web3
```

- `shadcn/ui`: A modern UI component library  
- `lucide-react`: Icon library  
- `sonner`: Toast notification system  
- `radix-ui`: Unstyled primitives for building accessible UIs  
- `web3`: JavaScript library for Ethereum blockchain interactions

---

## 3️⃣ Use Template

1. We will be creating three new directories: `dashboard`, `components`, and `lib` with the following structure:

```
client/
├── app/
│   └── dashboard/
│       ├── verify/
│       │   └── page.tsx
│       └── page.tsx
├── components/
│   ├── asset-list.tsx
│   ├── file-uploader.tsx
├── lib/
│   ├── contract-config.ts
│   ├── hash.ts
│   └── web3.ts
...
```

### 🔧 Template for Each File

```tsx
// client/app/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, FileText, Music, ImageIcon, File, Video, Package } from "lucide-react"
import { FileUploader } from "@/components/file-uploader"
import { AssetList } from "@/components/asset-list"
import { Web3Service } from "@/lib/web3"
import { generateFileHash } from "@/lib/hash"
import { toast, Toaster } from "sonner"

export default function Dashboard() {
  const [assets, setAssets] = useState<
    Array<{
      id: string
      name: string
      type: string
      size: string
      uploadDate: string
      status: "processing" | "verified" | "error"
      txHash?: string
      timestamp?: string
    }>
  >([]);
  const [web3Service, setWeb3Service] = useState<Web3Service | null>(null);
  const [networkInfo, setNetworkInfo] = useState<{
    name: string;
    contractAddress: string;
  } | null>(null);

  useEffect(() => {
    const initializeWeb3AndLoadAssets = async () => {
      try {
        const service = new Web3Service();
        await service.initialize();
        
        // Get network information
        const networkName = await service.getNetworkName();
        const contractAddress = await service.getContractAddress();
        setNetworkInfo({
          name: networkName,
          contractAddress: contractAddress
        });

        setWeb3Service(service);

        // Load assets from blockchain
        const blockchainAssets = await service.getAllProtectedAssets();
        
        // Convert blockchain assets to UI format
        const formattedAssets = blockchainAssets.map(asset => ({
          id: asset.hash,
          name: asset.fileName,
          type: asset.fileType,
          size: asset.fileSize,
          uploadDate: new Date(asset.timestamp * 1000).toISOString().split('T')[0],
          status: "verified" as const,
          txHash: asset.hash,
          timestamp: new Date(asset.timestamp * 1000).toLocaleString(),
        }));

        setAssets(formattedAssets);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    initializeWeb3AndLoadAssets();
  }, []);

  const handleFileUpload = async (files: File[]) => {
    if (!web3Service) {
      toast.error("Web3 not initialized");
      return;
    }

    // Add new files to UI immediately with processing status
    const newAssets = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "processing" as const,
    }));

    setAssets(prev => [...newAssets, ...prev]);

    // Process each file
    for (const [index, file] of files.entries()) {
      try {
        // Generate hash
        const hash = await generateFileHash(file);

        // Store hash and file information on blockchain
        const txHash = await web3Service.storeHash(
          hash,
          file.name,
          file.type,
          `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        );

        // Update asset status
        setAssets(prev => prev.map(asset => {
          if (asset.id === newAssets[index].id) {
            return {
              ...asset,
              status: "verified",
              txHash,
              timestamp: new Date().toLocaleString(),
            };
          }
          return asset;
        }));

        toast.success(`File "${file.name}" has been protected`);
        
        // Refresh assets from blockchain
        const blockchainAssets = await web3Service.getAllProtectedAssets();
        const formattedAssets = blockchainAssets.map(asset => ({
          id: asset.hash,
          name: asset.fileName,
          type: asset.fileType,
          size: asset.fileSize,
          uploadDate: new Date(asset.timestamp * 1000).toISOString().split('T')[0],
          status: "verified" as const,
          txHash: asset.hash,
          timestamp: new Date(asset.timestamp * 1000).toLocaleString(),
        }));
        setAssets(formattedAssets);

      } catch (error: any) {
        console.error(error);
        
        setAssets(prev => prev.map(asset => {
          if (asset.id === newAssets[index].id) {
            return {
              ...asset,
              status: "error",
            };
          }
          return asset;
        }));

        toast.error(error.message || `Failed to protect "${file.name}"`);
      }
    }
  };

  // Helper function to categorize files
  const getCategoryCounts = () => {
    return {
      documents: assets.filter(a => 
        a.type.includes('pdf') || 
        a.type.includes('document') || 
        a.type.includes('txt') ||
        a.type.includes('doc')
      ).length,
      music: assets.filter(a => 
        a.type.includes('audio') || 
        a.type.includes('mp3') || 
        a.type.includes('wav')
      ).length,
      images: assets.filter(a => 
        a.type.includes('image') || 
        a.type.includes('png') || 
        a.type.includes('jpg') || 
        a.type.includes('jpeg') || 
        a.type.includes('gif')
      ).length,
      videos: assets.filter(a => 
        a.type.includes('video') || 
        a.type.includes('mp4') || 
        a.type.includes('mov') || 
        a.type.includes('avi')
      ).length,
      others: assets.filter(a => {
        const isDocument = a.type.includes('pdf') || a.type.includes('document') || a.type.includes('txt') || a.type.includes('doc');
        const isMusic = a.type.includes('audio') || a.type.includes('mp3') || a.type.includes('wav');
        const isImage = a.type.includes('image') || a.type.includes('png') || a.type.includes('jpg') || a.type.includes('jpeg') || a.type.includes('gif');
        const isVideo = a.type.includes('video') || a.type.includes('mp4') || a.type.includes('mov') || a.type.includes('avi');
        return !isDocument && !isMusic && !isImage && !isVideo;
      }).length
    };
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" />
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Shield className="h-6 w-6" />
          <span>IP Shield</span>
        </Link>
        {networkInfo && (
          <div className="ml-4 text-sm text-muted-foreground">
            <span className="font-medium">{networkInfo.name}</span>
            <span className="mx-2">|</span>
            <span className="font-mono text-xs truncate" title={networkInfo.contractAddress}>
              Contract: {networkInfo.contractAddress.slice(0, 6)}...{networkInfo.contractAddress.slice(-4)}
            </span>
          </div>
        )}
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard/verify">
            Verify
          </Link>
        </nav>
      </header>
      <main className="flex-1 container max-w-7xl mx-auto py-6 px-4">
        <div className="grid gap-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Manage and protect your intellectual property</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assets.length}</div>
                <p className="text-xs text-muted-foreground">Protected items</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                <File className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getCategoryCounts().documents}</div>
                <p className="text-xs text-muted-foreground">Protected documents</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Music</CardTitle>
                <Music className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getCategoryCounts().music}</div>
                <p className="text-xs text-muted-foreground">Protected audio files</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Images</CardTitle>
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getCategoryCounts().images}</div>
                <p className="text-xs text-muted-foreground">Protected images</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Videos</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getCategoryCounts().videos}</div>
                <p className="text-xs text-muted-foreground">Protected videos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Others</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getCategoryCounts().others}</div>
                <p className="text-xs text-muted-foreground">Other protected files</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload New Asset</CardTitle>
              <CardDescription>Upload your intellectual property to secure it on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader onFilesSelected={handleFileUpload} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Protected Assets</CardTitle>
              <CardDescription>View and manage your intellectual property</CardDescription>
            </CardHeader>
            <CardContent>
              <AssetList assets={assets} />
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="border-t py-4 px-6">
        <div className="container flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground">IP Shield.</p>
          <p className="text-xs text-muted-foreground">Powered by Blockchain Technology</p>
        </div>
      </footer>
    </div>
  )
}
```

```tsx
// client/app/dashboard/verify/page.tsx
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Search, CheckCircle, XCircle } from "lucide-react"
import { FileUploader } from "@/components/file-uploader"
import { Web3Service } from "@/lib/web3"
import { generateFileHash } from "@/lib/hash"
import { toast, Toaster } from "sonner"

export default function VerifyPage() {
  const [verificationMethod, setVerificationMethod] = useState<"file" | "hash">("file")
  const [hashInput, setHashInput] = useState("")
  const [web3Service, setWeb3Service] = useState<Web3Service | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<{
    name: string;
    contractAddress: string;
  } | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    status: "success" | "error" | null
    message: string
    details?: {
      fileName?: string
      fileType?: string
      fileSize?: string
      timestamp?: string
      txHash?: string
      etherscanTxHash?: string
    }
  }>({ status: null, message: "" });

  // Initialize Web3Service when component mounts
  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        const service = new Web3Service();
        await service.initialize(); // Make sure to await initialization
        
        // Get network information
        const networkName = await service.getNetworkName();
        const contractAddress = await service.getContractAddress();
        
        setNetworkInfo({
          name: networkName,
          contractAddress: contractAddress
        });
        
        setWeb3Service(service);
        setIsInitialized(true);
        
      } catch (error: any) {
        console.error('Initialization error:', error);
        toast.error(`Failed to initialize: ${error.message}`);
      }
    };

    initializeWeb3();
  }, []);

  const  handleFileUpload = async (files: File[]) => {
    if (!isInitialized || !web3Service) {
      toast.error("Please wait for Web3 initialization");
      return;
    }

    if (files.length === 0) return;

    try {
      setVerificationResult({ status: null, message: "Verifying file..." });

      // Generate hash from the file
      const hash = await generateFileHash(files[0]);

      // Verify hash on blockchain
      const result = await web3Service.verifyHash(hash);

      if (result.exists) {
        const timestamp = new Date(result.timestamp! * 1000).toLocaleString();
        
        // Get the actual transaction hash for Etherscan only
        const txHash = await web3Service.getHashTransactionHash(hash);
        
        setVerificationResult({
          status: "success",
          message: "File verified successfully!",
          details: {
            fileName: result.fileName,
            fileType: result.fileType,
            fileSize: result.fileSize,
            timestamp,
            txHash: hash, // Keep using file hash for display
            etherscanTxHash: txHash, // Add new field for Etherscan link
          },
        });
      } else {
        setVerificationResult({
          status: "error",
          message: "File not found in our records.",
        });
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setVerificationResult({
        status: "error",
        message: error.message || "Failed to verify file.",
      });
    }
  };

  const handleHashVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInitialized || !web3Service) {
      toast.error("Please wait for Web3 initialization");
      return;
    }

    if (!hashInput) return;

    try {
      setVerificationResult({ status: null, message: "Verifying hash..." });
      
      const result = await web3Service.verifyHash("0x"+hashInput);

      if (result.exists) {
        const timestamp = new Date(result.timestamp! * 1000).toLocaleString();
        
        // Get the actual transaction hash for Etherscan only
        const txHash = await web3Service.getHashTransactionHash("0x"+hashInput);
        
        setVerificationResult({
          status: "success",
          message: "Hash verified successfully!",
          details: {
            fileName: result.fileName,
            fileType: result.fileType,
            fileSize: result.fileSize,
            timestamp,
            txHash: "0x"+hashInput, // Keep using input hash for display
            etherscanTxHash: txHash, // Add new field for Etherscan link
          },
        });
      } else {
        setVerificationResult({
          status: "error",
          message: "Hash not found in our records.",
        });
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setVerificationResult({
        status: "error",
        message: error.message || "Failed to verify hash.",
      });
    }
  };

  const getBlockExplorerUrl = (txHash: string) => {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" />
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Shield className="h-6 w-6" />
          <span>IP Shield</span>
        </Link>
        {networkInfo && (
          <div className="ml-4 text-sm text-muted-foreground">
            <span className="font-medium">{networkInfo.name}</span>
            <span className="mx-2">|</span>
            <span className="font-mono text-xs truncate" title={networkInfo.contractAddress}>
              Contract: {networkInfo.contractAddress.slice(0, 6)}...{networkInfo.contractAddress.slice(-4)}
            </span>
          </div>
        )}
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard/verify">
            Verify
          </Link>
        </nav>
      </header>
      <main className="flex-1 container max-w-7xl mx-auto py-6 px-4">
        <div className="grid gap-6 max-w-2xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Verify Intellectual Property</h1>
            <p className="text-muted-foreground">Check if a file or hash exists on the blockchain</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Verification Method</CardTitle>
              <CardDescription>Choose how you want to verify intellectual property</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant={verificationMethod === "file" ? "default" : "outline"}
                  onClick={() => setVerificationMethod("file")}
                >
                  Upload File
                </Button>
                <Button
                  variant={verificationMethod === "hash" ? "default" : "outline"}
                  onClick={() => setVerificationMethod("hash")}
                >
                  Enter Hash
                </Button>
              </div>
            </CardContent>
          </Card>

          {verificationMethod === "file" ? (
            <Card>
              <CardHeader>
                <CardTitle>Upload File to Verify</CardTitle>
                <CardDescription>
                We&apos;ll calculate the hash of your file and check if it exists on the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader onFilesSelected={handleFileUpload} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Enter File Hash</CardTitle>
                <CardDescription>
                  Enter the SHA-256 hash of your file to verify its existence on the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHashVerify}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="hash">File Hash</Label>
                      <Input
                        id="hash"
                        placeholder="e.g., 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
                        value={hashInput}
                        onChange={(e) => setHashInput(e.target.value)}
                      />
                    </div>
                    <Button type="submit">
                      <Search className="w-4 h-4 mr-2" />
                      Verify Hash
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {verificationResult.status !== null && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {verificationResult.status === "success" ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Verification Successful
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      Verification Failed
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{verificationResult.message}</p>

                {verificationResult.details && (
                  <div className="grid gap-2 text-sm">
                    {verificationResult.details.fileName && (
                      <div className="grid grid-cols-3 gap-1 py-1 border-b">
                        <span className="font-medium">File Name:</span>
                        <span className="col-span-2">{verificationResult.details.fileName}</span>
                      </div>
                    )}
                    {verificationResult.details.fileType && (
                      <div className="grid grid-cols-3 gap-1 py-1 border-b">
                        <span className="font-medium">File Type:</span>
                        <span className="col-span-2">{verificationResult.details.fileType}</span>
                      </div>
                    )}
                    {verificationResult.details.fileSize && (
                      <div className="grid grid-cols-3 gap-1 py-1 border-b">
                        <span className="font-medium">File Size:</span>
                        <span className="col-span-2">{verificationResult.details.fileSize}</span>
                      </div>
                    )}
                    {verificationResult.details.timestamp && (
                      <div className="grid grid-cols-3 gap-1 py-1 border-b">
                        <span className="font-medium">Timestamp:</span>
                        <span className="col-span-2">{verificationResult.details.timestamp}</span>
                      </div>
                    )}
                    {verificationResult.details.txHash && (
                      <div className="grid grid-cols-3 gap-1 py-1">
                        <span className="font-medium">Hash:</span>
                        <span className="col-span-2 truncate">{verificationResult.details.txHash}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              {verificationResult.status === "success" && verificationResult.details?.etherscanTxHash && (
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(getBlockExplorerUrl(verificationResult.details!.etherscanTxHash!), '_blank')}
                  >
                    View on Blockchain Explorer
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
        </div>
      </main>
      <footer className="border-t py-4 px-6">
        <div className="container flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground">IP Shield.</p>
          <p className="text-xs text-muted-foreground">Powered by Blockchain Technology</p>
        </div>
      </footer>
    </div>
  )
}
```

```tsx
// client/components/asset-list.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FileText, Music, ImageIcon, File, ExternalLink, Info } from "lucide-react"
import { Web3Service } from "@/lib/web3"

interface Asset {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  status: "processing" | "verified" | "error"
  txHash?: string
  timestamp?: string
  etherscanTxHash?: string
}

interface AssetListProps {
  assets: Asset[]
}

export function AssetList({ assets }: AssetListProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [web3Service, setWeb3Service] = useState<Web3Service | null>(null)

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        const service = new Web3Service();
        await service.initialize();
        setWeb3Service(service);
      } catch (error: any) {
        console.error('Failed to initialize Web3:', error);
      }
    };

    initializeWeb3();
  }, []);

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return <ImageIcon className="w-4 h-4" />
    if (type.includes("audio")) return <Music className="w-4 h-4" />
    if (type.includes("pdf") || type.includes("document")) return <FileText className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }

  const getStatusBadge = (status: Asset['status']) => {
    switch (status) {
      case 'processing':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Processing
          </Badge>
        );
      case 'verified':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Verified
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Error
          </Badge>
        );
    }
  };

  const getBlockExplorerUrl = (txHash: string) => {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  };

  const handleViewOnExplorer = async (asset: Asset) => {
    if (!web3Service) return;

    try {
      const txHash = await web3Service.getHashTransactionHash(asset.txHash!);
      window.open(getBlockExplorerUrl(txHash), '_blank');
    } catch (error: any) {
      console.error('Failed to get transaction hash:', error);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No assets found. Upload your first file to get started.
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {getFileIcon(asset.type)}
                    <span className="truncate max-w-[150px]">{asset.name}</span>
                  </TableCell>
                  <TableCell>{asset.type.split("/")[1]?.toUpperCase() || asset.type}</TableCell>
                  <TableCell>{asset.size}</TableCell>
                  <TableCell>{asset.uploadDate}</TableCell>
                  <TableCell>
                    {getStatusBadge(asset.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedAsset(asset)}>
                      <Info className="w-4 h-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedAsset} onOpenChange={(open) => !open && setSelectedAsset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
            <DialogDescription>Information about your protected intellectual property</DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">File Name:</span>
                <span className="col-span-2 truncate">{selectedAsset.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">File Type:</span>
                <span className="col-span-2">{selectedAsset.type}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">File Size:</span>
                <span className="col-span-2">{selectedAsset.size}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">Upload Date:</span>
                <span className="col-span-2">{selectedAsset.uploadDate}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">Status:</span>
                <span className="col-span-2">
                  {getStatusBadge(selectedAsset.status)}
                </span>
              </div>

              {selectedAsset.status === "verified" && (
                <>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <span className="font-medium">Timestamp:</span>
                    <span className="col-span-2">{selectedAsset.timestamp}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <span className="font-medium">Transaction Hash:</span>
                    <span className="col-span-2 truncate">{selectedAsset.txHash}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => handleViewOnExplorer(selectedAsset)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Blockchain Explorer
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

```

```tsx
// client/components/file-uploader.tsx
"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void
}

export function FileUploader({ onFilesSelected }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files)
      setSelectedFiles(filesArray)
      onFilesSelected(filesArray)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles(filesArray)
      onFilesSelected(filesArray)
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)
  }

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return "🖼️"
    if (type.includes("audio")) return "🎵"
    if (type.includes("video")) return "🎬"
    if (type.includes("pdf")) return "📄"
    return "📁"
  }

  return (
    <div className="grid gap-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-4 ${
          dragActive ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-700"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-medium">Drag and drop your files here</p>
          <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
        </div>
        <input ref={inputRef} type="file" className="hidden" multiple onChange={handleChange} />
        <Button type="button" variant="outline" onClick={handleButtonClick}>
          Select Files
        </Button>
      </div>

      {selectedFiles.length > 0 && (
        <div className="grid gap-2">
          <p className="text-sm font-medium">Selected Files:</p>
          <div className="border rounded-lg divide-y">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getFileIcon(file.type)}</div>
                  <div>
                    <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {file.type || "Unknown type"} • {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


```

```ts
// client/lib/contract-config.ts
import HashStorageArtifact from '@/app/routes/artifacts/HashStorage.json';

export interface ContractConfig {
  address: string;
  abi: any;
  network: string;
}

export const getContractConfig = async (): Promise<ContractConfig> => {
  try {
    // Get the network ID from MetaMask
    const networkId = await window.ethereum.request({ method: 'net_version' });
    
    // Get the deployed address for this network from the contract artifact
    const networks = HashStorageArtifact.networks as Record<string, { address: string }>;
    console.log("network:", networks)
    const deployedNetwork = networks[networkId];
    console.log("deployed:", deployedNetwork.address)


    if (!deployedNetwork) {
      throw new Error(`Contract not deployed on network ${networkId}`);
    }

    return {
      address: deployedNetwork.address,
      abi: HashStorageArtifact.abi,
      network: networkId
    };
    
  } catch (error: any) {
    throw new Error(`Failed to get contract config: ${error.message}`);
  }
}; 
```

```ts
// client/lib/hash.ts
export async function generateFileHash(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to generate file hash');
  }
} 
```

```ts
// client/lib/web3.ts
import Web3 from 'web3';
import { getContractConfig, type ContractConfig } from './contract-config';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface HashData {
  hash: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  timestamp: number;
}

export class Web3Service {
  private web3: Web3;
  private contract: any;
  private contractConfig: ContractConfig | null = null;

  constructor() {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Please install MetaMask to use this application');
    }
    this.web3 = new Web3(window.ethereum);
  }

  async initialize(): Promise<void> {
    try {
      // Get contract configuration
      this.contractConfig = await getContractConfig();
      
      // Initialize contract
      this.contract = new this.web3.eth.Contract(
        this.contractConfig.abi,
        this.contractConfig.address
      );

      // Listen for network changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

    } catch (error: any) {
      throw new Error(`Failed to initialize Web3Service: ${error.message}`);
    }
  }

  async getContractAddress(): Promise<string> {
    if (!this.contractConfig) {
      throw new Error('Contract not initialized');
    }
    return this.contractConfig.address;
  }

  async getNetworkName(): Promise<string> {
    const networkId = await this.web3.eth.net.getId();
    const networks: Record<string, string> = {
      '1': 'Ethereum Mainnet',
      '5': 'Goerli Testnet',
      '11155111': 'Sepolia Testnet',
      '5777': 'Local Ganache'
    };
    return networks[networkId.toString()] || `Network ${networkId}`;
  }

  async connectWallet(): Promise<string[]> {
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      return accounts;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to connect wallet');
    }
  }

  async storeHash(
    hash: string, 
    fileName: string, 
    fileType: string,
    fileSize: string
  ): Promise<string> {
    this.ensureInitialized();
    try {
      const accounts = await this.connectWallet();
      const result = await this.contract.methods
        .storeHash(hash, fileName, fileType, fileSize)
        .send({
          from: accounts[0]
        });
      console.log("txhash:", result.transactionHash)

      return result.transactionHash;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to store hash');
    }
  }

  async getAllProtectedAssets(): Promise<HashData[]> {
    this.ensureInitialized();
    try {
      const hashes = await this.contract.methods.getAllHashes().call();
      const assets: HashData[] = [];

      for (const hash of hashes) {
        const data = await this.contract.methods.getHashData(hash).call();
        assets.push({
          hash: data[0],
          fileName: data[1],
          fileType: data[2],
          fileSize: data[3],
          timestamp: Number(data[4])
        });
      }

      return assets;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch protected assets');
    }
  }

  async verifyHash(hash: string): Promise<{
    exists: boolean;
    fileName?: string;
    fileType?: string;
    fileSize?: string;
    timestamp?: number;
    transactionHash?: string;
  }> {
    this.ensureInitialized();
    try {
      const exists = await this.contract.methods.hashExists(hash).call();
      if (exists) {
        const data = await this.contract.methods.getHashData(hash).call();
        console.log("hash",hash);
        return { 
          exists, 
          fileName: data[1],
          fileType: data[2],
          fileSize: data[3],
          timestamp: Number(data[4]),
          transactionHash: hash
        };
      }
      return { exists };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to verify hash');
    }
  }

  async getHashTransactionHash(hash: string): Promise<string> {
    this.ensureInitialized();
    try {
      // Get past events for the HashStored event (this is the event name from your smart contract)
      const events = await this.contract.getPastEvents('HashStored', {
        filter: { hash: hash },
        fromBlock: 0,
        toBlock: 'latest'
      });

      if (events.length === 0) {
        throw new Error('No transaction found for this hash');
      }

      // Return the transaction hash of the event
      return events[0].transactionHash;
    } catch (error: any) {
      throw new Error(`Failed to get transaction hash: ${error.message}`);
    }
  }

  // Add check for contract initialization
  private ensureInitialized() {
    if (!this.contract) {
      throw new Error('Contract not initialized. Call initialize() first.');
    }
  }
} 
```

2. download all the components use in the project from shadcnn: 
npx shadcn@latest add button
npx shadcn@latest add badge
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add table

We can get all the components from https://ui.shadcn.com/


3. let's run the project:
```
npm run dev 
```
![Network Name](/assets/ip-protec.png)


congratulation, you have completed the tutorial! Happy Coding!


## 4️⃣ Final Steps

### 1. Download All UI Components Used in the Project from Shadcn

Run these commands to fetch components used in this project:

```bash
npx shadcn@latest add button
```
```bash
npx shadcn@latest add badge
```
```bash
npx shadcn@latest add card
```
```bash

npx shadcn@latest add dialog
```
```bash

npx shadcn@latest add input
```
```bash

npx shadcn@latest add label
```
```bash

npx shadcn@latest add table
```

We can get all the components from [https://ui.shadcn.com/](Shadcn)

### 2. Run the Project

```bash
npm run dev
```

![Network Name](/assets/ip-protec.png)

---

🎉 **Congratulations, you have completed the tutorial! Happy Coding!**

---