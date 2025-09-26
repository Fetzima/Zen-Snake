# Zen-Snake: A Blockchain-Based Snake Game

Welcome to Zen-Snake, a fun and interactive snake game built on the ZenChain Testnet blockchain. This project integrates a smart contract to track games and players, a responsive frontend with animations and hover effects, and support for EVM-compatible wallets (e.g., MetaMask, Trust Wallet, Coinbase Wallet). The design features a green dark and light theme, and you can customize the background with an image later.

## Features
- Connect to any EVM-compatible wallet.
- Start a game and record it on the blockchain.
- Display total games played and the latest 5 players.
- Play a classic snake game with score tracking.
- Responsive design with animations and hover effects.
- Customizable background image support.

## Prerequisites
- Node.js and npm: Install from [nodejs.org](https://nodejs.org).
- EVM-Compatible Wallet: Install MetaMask, Trust Wallet, or Coinbase Wallet and add the ZenChain Testnet:
  - Network Name: ZenChain Testnet
  - RPC URL: https://zenchain-testnet.api.onfinality.io/public
  - Chain ID: 8408
  - Currency Symbol: ZTC
  - Explorer: https://zentrace.io
- Git (optional for GitHub upload).
- Remix IDE or Hardhat for deploying the smart contract.

## Installation

1. Clone or Download the Repository:
   - On Ubuntu, run this command to create the project structure:
     ```bash
     mkdir -p Zen-Snake/{images} && touch Zen-Snake/{index.html,game.html,style.css,script.js,ZenSnake.sol,package.json,README.md}
     ```
   - Copy the code from this document into the respective files.

2. Install Dependencies:
   - Navigate to the project directory:
     ```bash
     cd Zen-Snake
     ```
   - Install required packages:
     ```bash
     npm install
     ```

3. Deploy the Smart Contract:
   - Open [Remix IDE](https://remix.ethereum.org).
   - Copy ZenSnake.sol into a new file and compile it.
   - Deploy the contract to ZenChain Testnet using your wallet.
   - Save the contract address and ABI (from the Remix compile tab).

4. Configure the Frontend:
   - Open script.js and replace YOUR_CONTRACT_ADDRESS with your deployed contract address.
   - Replace the contractABI array with the ABI from Remix.

5. Run the Project:
   - Start the local server:
     ```bash
     npm start
     ```
   - Open your browser and go to http://localhost:8080.

6. Get Test Tokens:
   - Connect your wallet to ZenChain Testnet.
   - Visit [https://faucet.zenchain.io](https://faucet.zenchain.io) to request ZTC tokens.

## Usage

### Main Page (index.html)
- Connect Wallet: Click "Connect Wallet" to link your EVM wallet.
- Start Game: After connecting, click "Start Game" to record a game on the blockchain.
- View Stats: See the total number of games and the latest 5 players.

### Game Page (game.html)
- Play: Use arrow keys to control the snake.
- Score: Earn 10 points per food item; game ends on collision with walls or self.

### Customizing the Background
- Create an images folder in the project directory.
- Add your background image (e.g., background.jpg).
- Edit style.css and update the --background-image-url variable:
  ```css
  :root {
      --background-image-url: url('images/background.jpg');
  }