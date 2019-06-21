const api = require('../index.js')
const sleep = require('sleep');
const keythereum = require('keythereum');
const ethTx = require('ethereumjs-tx');
const utils = require('./utils.js');
const moment = require('moment');
const fs = require('fs');
const readline = require('readline');

// ethereum root directory (for retreive keystore) and keystore password
const datadir = '/home/caideyi/.ethereum';
const privKeydir = 'controlPrivKey';
const privKeydir2 = 'privKey';
const datadir2 = '/home/caideyi/.evm-lite/eth';
const password = 'abc1234';
const ac_pirKeydir = 'account'
var privKey = [];
//const buf = new Buffer.from([0x8c, 0x3d, 0x71, 0x0e, 0xef, 0x05, 0x0e, 0xf3, 0xa1, 0x3d, 0x03, 0x5a, 0xd0, 0x05, 0xd0, 0x9e, 0x9d, 0x6b, 0xc7, 0x57, 0x6a, 0xf3, 0x5a, 0xd2, 0xf1, 0x3f, 0xf9, 0xde, 0xd3, 0x65, 0x29, 0x45]);
const iter = parseInt( process.argv[3] ,10) ; 
testBasicAPI()

async function testBasicAPI() {
    let arr = await getAccount();
    console.log('Getting 10000 account');
    sleep.sleep(1);
    let key = await getKey( ac_pirKeydir );
    console.log('Getting 10000 account privKey');
    sleep.sleep(1);
    let rawTxList = await genRawtx( arr , key , iter );
    console.log( 'Generate ' , iter , 'Rawtx' );
    sleep.sleep(1);
    console.log('Sending transaction ......');
    let time = moment().valueOf();
    await workload ( rawTxList , iter ) ;
    let time2 = moment().valueOf();
    console.log("ST: ", moment(time).format('YYYY-MM-DDTHH:mm:ss.SSSS'));
    console.log("ET: ", moment(time2).format('YYYY-MM-DDTHH:mm:ss.SSSS'));

}

async function workload ( rawTx , iter ) {

    // for ( var i = 0 ; i < iter ; i++ ){

    //     api.sendRawTx(rawTx[i]);
    //     //utils.log('Send raw transaction:' , i );
    //     //sleep.msleep(parseInt( process.argv[2] , 10 ));

    // }

    var interval = parseInt( process.argv[2] , 10 ) ;
    return new Promise((resolve, reject) => {
        for ( var i = 0 ; i < iter ; i++ ) {
            setTimeout( function (i) {
                if (i == iter - 1) {resolve();}
                api.sendRawTx(rawTx[i]);
            }, interval * i , i ) ;
        }
        //resolve();
    });

}

async function genRawtx ( account , privateKey , iter ) {

    var rawTxList = [];
    var num = 0;
    let des = await api.getAccount( account[0] );
    let to = des.address
    for ( var i = 0 ; i < iter ; i++ ){

        result = await api.getAccount( account[num] );
        //console.log(result);
        //num = i%account.length;
        //addValue = i/account.length;
        let txParams = {
            nonce: result.nonce ,//+ addValue,
            to: to,
            gasLimit: '0x30000',
            value: '0x01'
        };
        let tx = new ethTx(txParams);
        tx.sign(privateKey[num]);
        let rawTx = '0x' + tx.serialize().toString('hex');
        //utils.log('Encoded raw transaction:', rawTx);
        rawTxList[i] = rawTx;
        num+=1;
    }
    return rawTxList;
}

//Read privKey buf from [dir]
function getKey ( dir ){
    var arr;
    var str;
    var pk = [];
    arr = fs.readFileSync(dir).toString().split("\n");
    // -1是因為切割後陣列最後面會多出一個空位置
    for (var i =0; i < arr.length-1; i++ ){
        const buf = new Buffer.from([0x8c, 0x3d, 0x71, 0x0e, 0xef, 0x05, 0x0e, 0xf3, 0xa1, 0x3d, 0x03, 0x5a, 0xd0, 0x05, 0xd0, 0x9e, 0x9d, 0x6b, 0xc7, 0x57, 0x6a, 0xf3, 0x5a, 0xd2, 0xf1, 0x3f, 0xf9, 0xde, 0xd3, 0x65, 0x29, 0x45]);
        str = arr[i].split(" ");
        for(var j =0; j < buf.length; j++){
            buf[j] = str[j+1];
            //+1 因為dir裡面array第一個值是序列
        }

        pk[i] = buf;
    }

    return pk;
}

async function SendRawtx( from , to ) {
    let key = await get_10000_PrivKey(from);
    //console.log(key);
    let result = await api.getAccount(from);
    //let des = await api.getAccount(to);
    let txParams = {
        nonce: result.nonce ,
        to: '0x' + to,
        gasLimit: '0x30000',
        value: '0x01'
    };
    let tx = new ethTx(txParams);
    tx.sign(key);
    let rawTx = '0x' + tx.serialize().toString('hex');
    //utils.log('Encoded raw transaction:', rawTx);
    result = await api.sendRawTx(rawTx);
    utils.log('Send raw transaction:',result);
}

//give money by controled account

async function giveMoney( array , privateKey ) {  
    

    let result;
    result = await api.getAccounts();
    utils.log('Get controlled accounts:', result);
    let accounts = result.accounts;

    for (var i =0; i < 10000; i++ ){

        result = await api.getAccount(array[i]);
        //console.log(result);
        let to = result.address;
        num = i%accounts.length;
        addValue = i/accounts.length;
        let txParams = {
            nonce: accounts[num].nonce + addValue,
            to: to,
            gasLimit: '0x30000',
            value: '0x100'
        };
        let tx = new ethTx(txParams);
        tx.sign(privateKey[num]);
        let rawTx = '0x' + tx.serialize().toString('hex');
        //utils.log('Encoded raw transaction:', rawTx);
        result = await api.sendRawTx(rawTx);
        utils.log('Send raw transaction:',result);
        await sleep.msleep(200);
    }

    
}

async function getAccount() { 

    var array = fs.readFileSync('/home/caideyi/.ethereum/From').toString().split("\n");
    // for(i in array) {
    //     console.log(array[i]);
    // }
    return array;

}
