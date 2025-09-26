const contractAddress = "0xb6F5599677EF309A515c60fd6782a26a8c90c2Ac";
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "GameStarted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "startGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPlayers",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "playerAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct ZenSnake.Player[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalGames",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "players",
		"outputs": [
			{
				"internalType": "address",
				"name": "playerAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalGames",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let provider, signer, contract, account;

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            account = await signer.getAddress();
            document.getElementById('walletAddress').textContent = `Wallet: ${account}`;
            document.getElementById('connectWallet').textContent = 'Disconnect';
            document.getElementById('connectWallet').onclick = disconnectWallet;
            document.getElementById('startGame').disabled = false;
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            updateGameInfo();
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            alert("Failed to connect wallet. Please try again.");
        }
    } else {
        alert("Please install an EVM-compatible wallet (e.g., MetaMask, Trust Wallet, Coinbase Wallet).");
    }
}

function disconnectWallet() {
    provider = null;
    signer = null;
    contract = null;
    account = null;
    document.getElementById('walletAddress').textContent = 'Wallet: Not connected';
    document.getElementById('connectWallet').textContent = 'Connect Wallet';
    document.getElementById('connectWallet').onclick = connectWallet;
    document.getElementById('startGame').disabled = true;
    document.getElementById('playersList').innerHTML = '';
    document.getElementById('totalGames').textContent = '0';
}

async function updateGameInfo() {
    if (contract) {
        try {
            const totalGames = await contract.getTotalGames();
            document.getElementById('totalGames').textContent = totalGames.toString();

            const players = await contract.getPlayers();
            const playersList = document.getElementById('playersList');
            playersList.innerHTML = '';
            players.slice(-5).forEach((player, index) => {
                const date = new Date(player.timestamp * 1000).toLocaleString('en-US');
                const li = document.createElement('li');
                li.textContent = `Player: ${player.playerAddress} at ${date}`;
                li.style.animationDelay = `${index * 0.1}s`;
                playersList.appendChild(li);
            });
        } catch (error) {
            console.error("Error fetching game info:", error);
        }
    }
}

async function startGame() {
    if (contract && account) {
        try {
            const tx = await contract.startGame();
            await tx.wait();
            window.location.href = 'game.html';
        } catch (error) {
            console.error("Error starting game:", error);
            alert("Failed to start game. Please try again.");
        }
    }
}

async function addNetwork() {
    try {
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: '8408',
                chainName: 'ZenChain Testnet',
                nativeCurrency: {
                    name: 'ZTC',
                    symbol: 'ZTC',
                    decimals: 18
                },
                rpcUrls: ['https://zenchain-testnet.api.onfinality.io/public'],
                blockExplorerUrls: ['https://zentrace.io']
            }]
        });
        alert('Network added successfully!');
    } catch (error) {
        console.error("Error adding network:", error);
        alert('Failed to add network. Please try again.');
    }
}

const canvas = document.getElementById('gameCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 0;
    let dy = 0;
    let score = 0;

    function drawGame() {
        ctx.fillStyle = '#2a5d4e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        snake.forEach(segment => {
            ctx.fillStyle = '#b4ff39';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });

        ctx.fillStyle = '#ff4d4d';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

        let head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            document.getElementById('score').textContent = score;
            food = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } else {
            snake.pop();
        }

        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
            alert('Game Over! Score: ' + score);
            window.location.href = 'index.html';
            snake = [{ x: 10, y: 10 }];
            food = { x: 15, y: 15 };
            score = 0;
            dx = 0;
            dy = 0;
            document.getElementById('score').textContent = score;
        }

        setTimeout(drawGame, 100);
    }

    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp':
                if (dy !== 1) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (dy !== -1) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (dx !== 1) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx !== -1) { dx = 1; dy = 0; }
                break;
        }
    });

    drawGame();
}

document.getElementById('connectWallet')?.addEventListener('click', connectWallet);
document.getElementById('startGame')?.addEventListener('click', startGame);
document.getElementById('addNetwork')?.addEventListener('click', addNetwork);