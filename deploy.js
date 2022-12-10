const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {abi, evm} = require('./compile');
require('dotenv').config()

const METAMASK_SEED = process.env.METAMASK_SEED


const provider = new HDWalletProvider(
    METAMASK_SEED,
    'https://goerli.infura.io/v3/2f54a2d57a38408fbe1e5574f7ebd13f'
);

const web3 = new Web3(provider)

// this functions is just to give us the ability to use async/await syntax
const deploy = async () => {
    const accounts = await web3.eth.getAccounts()
 
    console.log('Attempting to de ploy from account', accounts[0])

    const contract = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object, arguments: ['My first deploy!!']})
        .send({ gas: '1000000', from: accounts[0]})

    console.log('Contract deployed to', contract.options.address)

    //prevent hanging deployment
    provider.engine.stop()
};

deploy()