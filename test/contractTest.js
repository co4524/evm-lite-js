const solc = require('solc');
const fs = require('fs');
const sleep = require('sleep');
const Web3 = require('web3');
const path = require('path');
const api = require('../index');
const utils = require('./utils')
const fakeProvider = require('web3-fake-provider');

const web3 = new Web3(new fakeProvider());
const contractPath = './contract/test.sol';
const contractName = 'Send';

testContract();

async function testContract() {
    let filename = path.basename(contractPath);
    let output = compile(contractPath);
    let contract = output.contracts[filename][contractName];
    let abi = contract.abi;
    let bytecode = '0x' + contract.evm.bytecode.object;

    utils.testPrompt("Deploy contract");
    let result;
    result = await api.getAccounts();
    utils.log("Get controlled account:", result);

    let accounts = result.accounts;
    let txObj = {
        from: accounts[0].address,
        data: bytecode
    }
    utils.log("Deploy transaction:", txObj);

    result = await api.sendTx(txObj);
    utils.log("Transaction sent:", result);
    let txHash = result.txHash;

    utils.testPrompt("Get the transaction receipt to obtain the contract address");
    sleep.sleep(1);

    result = await api.getTxReceipt(txHash);
    utils.log("Transaction receipt:", result);
    let contractAddr = result.contractAddress;
    contract = new web3.eth.Contract(abi);

    utils.testPrompt("Call contract");
    txObj = {
        from: accounts[0].address, //not necessary
        to: contractAddr,
        data: contract.methods.x().encodeABI()
    }
    utils.log("transaction1", txObj);
    result = await api.call(txObj);
    utils.log("Call contract:", result);
}

// Solc inputs and outputs follow the JSON format in
// https://solidity.readthedocs.io/en/v0.5.0/using-the-compiler.html#compiler-input-and-output-json-description
// The function read frome the filepath and compile it to object as standard format.
function compile(filepath) {
    let source = fs.readFileSync(filepath, 'UTF-8');
    let input = {
        language: 'Solidity',
        sources: {
            [path.basename(filepath)]: {
                content: source
            }
        },
        settings: {
            evmVersion: "byzantium",
            outputSelection: {
                '*': {
                    '*': [ '*' ]
                }
            }
        }
    };

    output = JSON.parse(solc.compile(JSON.stringify(input)));
    return output;
}
