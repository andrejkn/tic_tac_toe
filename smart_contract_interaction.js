const NETWORK = 'ropsten';
const CONTRACT_ADDRESS = '0xa70Ad3cf15EF75C7c900186F69B2c89bC2598008'; // Might need to replace this with your own deployment of the smart contract.
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "ScoreMap",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "p1Score",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "p2Score",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getP1Score",
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
        "inputs": [],
        "name": "getP2Score",
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
        "inputs": [],
        "name": "incP1Score",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "incP2Score",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "sendRewards",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
];

const createContract = async () => {
    const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    await provider.send('eth_requestAccounts', []);

    const signer = provider.getSigner();
    
    const TicTacToeRewardsContract = new ethers.Contract(
        CONTRACT_ADDRESS,   // contract_address,
        CONTRACT_ABI,       // contract_abi
        signer,
    );

    return TicTacToeRewardsContract;
}

const sendReward = async () => {
    const TicTacToeRewardsContract = await createContract();
    const gasPrice = ethers.utils.parseUnits('1000', 'gwei');
    const gasLimit = 1000000;
    const nonce = 40;
    const options = { gasLimit, gasPrice, nonce, value: 0 };

    await TicTacToeRewardsContract.sendRewards(options);
};

const incP1Score = async () => {
    const TicTacToeRewardsContract = await createContract();

    await TicTacToeRewardsContract.incP1Score();
};

const incP2Score = async () => {
    const TicTacToeRewardsContract = await createContract();

    await TicTacToeRewardsContract.incP2Score();
};

const getScores = async () => {
    const TicTacToeRewardsContract = await createContract();
    const p1Score = await TicTacToeRewardsContract.getP1Score();
    const p2Score = await TicTacToeRewardsContract.getP2Score();

    return [
        p1Score.toNumber(),
        p2Score.toNumber(),
    ];
};
