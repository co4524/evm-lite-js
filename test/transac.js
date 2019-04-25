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
    utils.testPrompt("Test send transaction from controlled accounts multiple times")

    let from = accounts[0].address;
    let to = accounts[1].address;
    let nonce = accounts[0].nonce;

    console.log('Loading keystore files...');
    let keyObj = keythereum.importFromFile(from, datadir);
    let privKey = keythereum.recover(password, keyObj);

    for (i = 0; i < 10; i++) {
        let txParams = {
            nonce: nonce + i,
            to: to,
            gasLimit: '0x30000',
            value: '0x01'
        };
        let tx = new ethTx(txParams);
        tx.sign(privKey);
        let rawTx = '0x' + tx.serialize().toString('hex');
        utils.log('Encoded raw transaction:', rawTx);
        result = await api.sendRawTx(rawTx);
        utils.log('Send raw transaction:', result);
    }

    sleep.sleep(1);
    result = await api.getAccounts();
    utils.log('Accounts', result);
}
