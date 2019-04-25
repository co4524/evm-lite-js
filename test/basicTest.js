const api = require('../index.js')
const sleep = require('sleep');
const keythereum = require('keythereum');
const ethTx = require('ethereumjs-tx');

testBasicAPI();

function testBasicAPI() {
    api.getAccounts()
        .then((accounts) => {
            console.log('Get controlled accounts:');
            console.log(JSON.colorStringify(accounts, null, 4));
            console.log();

            accounts = accounts.accounts;

            let txObject = {
                from: accounts[0].address,
                to: accounts[1].address,
                value: 1
            }
            api.sendTx(txObject)
                .then((txHash) =>{
                    console.log('Send Transaction:');
                    console.log(JSON.colorStringify(txHash, null, 4));
                    console.log();

                    sleep.sleep(1);

                    api.getTxReceipt(txHash.txHash)
                        .then((txReceipt) => {
                            console.log('Get transaction receipt:');
                            console.log(JSON.colorStringify(txReceipt, null, 4));
                            console.log();

                            api.getAccount(accounts[0].address)
                                .then((account) => {
                                    console.log("Get any account (first controlled account as example):")
                                    console.log(JSON.colorStringify(account, null, 4));
                                    console.log();

                                    const datadir = '/home/john/.evm-lite/eth'
                                    const password = 'abc1234'

                                    api.getAccounts()
                                        .then((accounts) => {
                                            accounts = accounts.accounts;
                                            let fromAddr = accounts[0].address;
                                            let toAddr = accounts[1].address;
                                            let nonce = accounts[0].nonce;

                                            keythereum.importFromFile(fromAddr, datadir, function (keyObject) {
                                                keythereum.recover(password, keyObject, function (privateKey) {
                                                    const txParams = {
                                                        nonce: nonce,
                                                        to: toAddr,
                                                        gasLimit: '0x30000',
                                                        value: '0x01'
                                                    };
                                                    let tx = new ethTx(txParams);
                                                    tx.sign(privateKey);
                                                    let rawTx = '0x' + tx.serialize().toString('hex');

                                                    console.log('Send raw transaction:');
                                                    api.sendRawTx(rawTx)
                                                        .then((txHash) => {
                                                            console.log(JSON.colorStringify(txHash, null, 4))
                                                        })
                                                        .catch((err) => {
                                                            console.log(err.message);
                                                        });
                                                });
                                            });
                                        })
                                        .catch((err) => {
                                            console.log(err.message);
                                        });
                                })
                                .catch((err) => {
                                    console.log(err.message);
                                });
                        })
                        .catch((err) => {
                            console.log(err.message); 
                        });
                })
                .catch((err) => {
                    console.log(err.message);
                });
        })
        .catch((err) => {
            console.log(err.message);
        })
}
