const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); // this one is uppercase because we are importing a constructor
const {abi, evm} = require('../compile');

// you can create an instance for different networks, usually we work with one
// Web3 always expect a provider
const web3 = new Web3(ganache.provider());

let accounts
let inbox
const INITIAL_MESSAGE = 'Hi there!!'

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts()

    // Use on of those account to deploy the contract
    // inbox is a js representation of our contract
    inbox = await new web3.eth.Contract(abi) // a js object must be passed 
        .deploy({ data: evm.bytecode.object, arguments: [INITIAL_MESSAGE]}) // arguments are the values that we specified in contract's constructor
        .send({ from: accounts[0], gas: '1000000'}) // this method sends the object created by deploy method
})


describe('Inbox contract', () => {
    it('deploys a contract', () => {
       assert.ok(inbox.options?.address) 
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call()
        assert.equal(message, INITIAL_MESSAGE)
    })

    it('sets new message', async () => {
        const newMessage = 'Bye!!'
        await inbox.methods.setMessage(newMessage).send({ from: accounts[0]})
        const message = await inbox.methods.message().call()
        assert.equal(message, newMessage )
    })
})


//https://goerli.infura.io/v3/2f54a2d57a38408fbe1e5574f7ebd13f  


