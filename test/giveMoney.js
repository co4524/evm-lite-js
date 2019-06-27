const api = require('../index.js')
const sleep = require('sleep');
const keythereum = require('keythereum');
const ethTx = require('ethereumjs-tx');
const utils = require('./utils.js');
const moment = require('moment');
const fs = require('fs');
const readline = require('readline');

// ethereum root directory (for retreive keystore) and keystore password
const des_AddressDir = '/home/caideyi/evm-lite-js/test/testAccount/address';
const source__AddressDir = '/home/caideyi/evm-lite-js/test/sourceAccount/address'
const source_privKeydir = '/home/caideyi/evm-lite-js/test/sourceAccount/pKey';
//const des_privKeydir = '/home/caideyi/evm-lite-js/test/account';
var privKey = [];
//const datadir = '/home/caideyi/.evm-lite/eth';
//const password = 'abc1234';
//const buf = new Buffer.from([0x8c, 0x3d, 0x71, 0x0e, 0xef, 0x05, 0x0e, 0xf3, 0xa1, 0x3d, 0x03, 0x5a, 0xd0, 0x05, 0xd0, 0x9e, 0x9d, 0x6b, 0xc7, 0x57, 0x6a, 0xf3, 0x5a, 0xd2, 0xf1, 0x3f, 0xf9, 0xde, 0xd3, 0x65, 0x29, 0x45]);
const baseURL = 'http://localhost:8080';
testBasicAPI()

async function testBasicAPI() {

    let arr = await getAccount(des_AddressDir);
    console.log('Getting des account(30000)');
    sleep.sleep(1);

    let acc = await getAccount(source__AddressDir);
    console.log('Getting source account(100)');
    sleep.sleep(1);

    let key = await getKey2( source_privKeydir );
    console.log('Getting control account privKey');
    sleep.sleep(1);


    giveMoney( acc , arr , key );

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

//get account pkey without control
function getKey2 ( dir ){
    var arr;
    var str;
    var pk = [];
    arr = fs.readFileSync(dir).toString().split("\n");
    for (var i =0; i < arr.length-1; i++ ){
        const buf = new Buffer.from([0x8c, 0x3d, 0x71, 0x0e, 0xef, 0x05, 0x0e, 0xf3, 0xa1, 0x3d, 0x03, 0x5a, 0xd0, 0x05, 0xd0, 0x9e, 0x9d, 0x6b, 0xc7, 0x57, 0x6a, 0xf3, 0x5a, 0xd2, 0xf1, 0x3f, 0xf9, 0xde, 0xd3, 0x65, 0x29, 0x45]);
        str = arr[i].split(" ");
        for(var j =0; j < buf.length; j++){
            buf[j] = str[j+1];
        }

        pk[i] = buf;
    }

    return pk;
}

async function giveMoney( acc , array , privateKey ) {  
    
    for (var i =0; i < array.length-1 ; i++ ){

        num = i%(acc.length-1);
        result = await api.getAccount(baseURL , array[i]);
        from = await api.getAccount( baseURL , acc[num]);

        let to = result.address;
        let txParams = {
            nonce: from.nonce ,
            to: to,
            gasLimit: '0x30000',
            value: '0x01'
        };
        let tx = new ethTx(txParams);
        tx.sign(privateKey[num]);
        let rawTx = '0x' + tx.serialize().toString('hex');
        //utils.log('Encoded raw transaction:', rawTx);
        result = await api.sendRawTx(baseURL , rawTx);
        utils.log('Send raw transaction to :',i);
        if(num==acc.length-2){
            console.log("wait sync")
            await sleep.msleep(2000);
        }
        
    }

    
}

async function getAccount(dir) { 

    var array = fs.readFileSync(dir).toString().split("\n");
    return array;

}