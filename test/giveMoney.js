const api = require('../index.js')
const sleep = require('sleep');
const keythereum = require('keythereum');
const ethTx = require('ethereumjs-tx');
const utils = require('./utils.js');
const moment = require('moment');
const fs = require('fs');
const readline = require('readline');

// ethereum root directory (for retreive keystore) and keystore password
const accountdir = '/home/caideyi/evm-lite-js/account/ethereum/From'
const privKeydir = 'controlPrivKey';
var privKey = [];
//const buf = new Buffer.from([0x8c, 0x3d, 0x71, 0x0e, 0xef, 0x05, 0x0e, 0xf3, 0xa1, 0x3d, 0x03, 0x5a, 0xd0, 0x05, 0xd0, 0x9e, 0x9d, 0x6b, 0xc7, 0x57, 0x6a, 0xf3, 0x5a, 0xd2, 0xf1, 0x3f, 0xf9, 0xde, 0xd3, 0x65, 0x29, 0x45]);
const baseURL = 'http://localhost:8080';
testBasicAPI()

async function testBasicAPI() {

    let arr = await getAccount();
    console.log('Getting 10000 account');
    sleep.sleep(1);

    let key = await getKey( privKeydir );
    console.log('Getting control account privKey');
    sleep.sleep(1);

    giveMoney( arr , key );
    
}

//Read privKey buf from [dir]
function getKey ( dir ){
    var arr;
    var str;
    var pk = [];
    arr = fs.readFileSync(dir).toString().split("\n");
    for (var i =0; i < arr.length-1; i++ ){
        const buf = new Buffer.from([0x8c, 0x3d, 0x71, 0x0e, 0xef, 0x05, 0x0e, 0xf3, 0xa1, 0x3d, 0x03, 0x5a, 0xd0, 0x05, 0xd0, 0x9e, 0x9d, 0x6b, 0xc7, 0x57, 0x6a, 0xf3, 0x5a, 0xd2, 0xf1, 0x3f, 0xf9, 0xde, 0xd3, 0x65, 0x29, 0x45]);
        str = arr[i].split(" ");
        for(var j =0; j < buf.length; j++){
            buf[j] = str[j];
        }

        pk[i] = buf;
    }

    return pk;
}


async function giveMoney( array , privateKey ) {  
    

    let result;
    result = await api.getAccounts(baseURL);
    utils.log('Get controlled accounts:', result);
    let accounts = result.accounts;

    for (var i =0; i < 10000; i++ ){

        result = await api.getAccount(baseURL , array[i]);
        //console.log(result);
        let to = result.address;
        num = i%accounts.length;
        addValue = i/accounts.length;
        let txParams = {
            nonce: accounts[num].nonce + addValue,
            to: to,
            gasLimit: '0x30000',
            value: '0x1000'
        };
        let tx = new ethTx(txParams);
        tx.sign(privateKey[num]);
        let rawTx = '0x' + tx.serialize().toString('hex');
        //utils.log('Encoded raw transaction:', rawTx);
        result = await api.sendRawTx(baseURL , rawTx);
        utils.log('Send raw transaction:',result);
        await sleep.msleep(200);
    }

    
}

async function getAccount() { 

    var array = fs.readFileSync(accountdir).toString().split("\n");
    // for(i in array) {
    //     console.log(array[i]);
    // }
    return array;

}