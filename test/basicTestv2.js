const api = require('../index.js')
const sleep = require('sleep');
const keythereum = require('keythereum');
const ethTx = require('ethereumjs-tx');
const utils = require('./utils.js');

// ethereum root directory (for retreive keystore) and keystore password
const datadir = '/home/john/.evm-lite/eth';
const password = 'abc1234';

testBasicAPI()

async function testBasicAPI() {
    let result;

    // Test getAccounts
    utils.testPrompt("Test get controlled accounts")
    result = await api.getAccounts();
    utils.log('Get controlled accounts:', result);
    let accounts = result.accounts;

    // Test sendTx
    utils.testPrompt("Test send transaction from controlled accounts")
    let txObject = {
        from: accounts[0].address,
        to: accounts[1].address,
        value: 1
    }
    utils.log('Send one wei from address[0] to address[1]', txObject);
    result = await api.sendTx(txObject);
    utils.log('Transaction sent:', result);
    let txHash = result.txHash;

    // Waiting for the transaction to be receive to a block
    sleep.sleep(1);

    // Get transaction receipt
    let txReceipt = await api.getTxReceipt(txHash);
    utils.log('Get transaction receipt:', txReceipt);

    result =  await api.getAccount(accounts[0].address);
    utils.log("Get any account (first controlled account as example):", result);

    // Test sendRawTx
    utils.testPrompt("Test send raw transaction")
    result = await api.getAccounts();
    accounts = result.accounts;
    let from = accounts[0].address;
    let to = accounts[1].address;
    let nonce = accounts[0].nonce;

    let txParams = {
        nonce: nonce,
        to: to,
        gasLimit: '0x30000',
        value: '0x01'
    };
    utils.log('Send one wei from address[0] to address[1]', txParams);

    console.log('Loading keystore files...');
    let keyObj = keythereum.importFromFile(from, datadir);
    let privKey = keythereum.recover(password, keyObj);
    console.log('Signing transaction...');
    let tx = new ethTx(txParams);
    tx.sign(privKey);
    let rawTx = '0x' + tx.serialize().toString('hex');
    utils.log('Encoded raw transaction:', rawTx);

    result = await api.sendRawTx(rawTx);
    utils.log('Send raw transaction:', result);

    sleep.sleep(1);
    result = await api.getAccounts();
    utils.log('Accounts', result);
}
