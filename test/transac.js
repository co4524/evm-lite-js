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
var privKey = [];
//const buf = new Buffer.from([0x8c, 0x3d, 0x71, 0x0e, 0xef, 0x05, 0x0e, 0xf3, 0xa1, 0x3d, 0x03, 0x5a, 0xd0, 0x05, 0xd0, 0x9e, 0x9d, 0x6b, 0xc7, 0x57, 0x6a, 0xf3, 0x5a, 0xd2, 0xf1, 0x3f, 0xf9, 0xde, 0xd3, 0x65, 0x29, 0x45]);

testBasicAPI()

async function testBasicAPI() {

    // Test sendTx
    let arr = await getAccount();
    sleep.sleep(1);
    //await SendRawtx(array[1],array[2]);
    //let c_pk = await getPrivKey();
    //console.log(c_pk);
    let ac = await get_10000_PrivKey( arr , parseInt( process.argv[2] ,10) , parseInt( process.argv[3] ,10) );
    await WriteFile( ac , process.argv[4] );
    //let c_pk1 = await getKey();
    //console.log("Sec",c_pk1);
    //console.log(privKey);
    //await getKey();
    //privKey2[0] = buf;
    //privKey2[1] = buf;
    //console.log(privKey2);
    //await WriteFile(ac10000_privKey);
    //console.log(privKey);
    //const buf = new Buffer([0x8c, 0x3d, 0x71, 0x0e, 0xef, 0x05]);
    //console.log(buf);
    //await giveMoney();
    //let string = '<Buffer 8c 3d 71 0e ef 05 0e f3 a1 3d 03 5a d0 05 d0 9e 9d 6b c7 57 6a f3 5a d2 f1 3f f9 de d3 65 29 45>'
    //console.log(string.substr(8,95));
    //sleep.sleep(1);
    sleep.sleep(1);
    let result;
    result = await api.getAccount(arr[1]);//175f2126a6f280fe77d1f8fe8eea3e4cdb3f9713
    console.log(result);
    result = await api.getAccount(arr[2]);//175f2126a6f280fe77d1f8fe8eea3e4cdb3f9713
    console.log(result);
/*
    let time = moment().valueOf();
    for (i = 0; i < 10; i++) {
        console.log(i)
        api.sendRawTx(raw_tx[i]); 
    }
    //await api.sendRawTx(raw_tx[i]); 
    let time2 = moment().valueOf();
    console.log(moment(time).format('YYYY-MM-DDTHH:mm:ss.SSSS'));
    console.log(moment(time2).format('YYYY-MM-DDTHH:mm:ss.SSSS'));
    sleep.sleep(1);
    console.log("DEBUG")
    result1 = await api.getAccounts();
    utils.log('Accounts', result1);*/
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

async function giveMoney() {  
    

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
            value: '0x01'
        };
        let tx = new ethTx(txParams);
        tx.sign(privKey[num]);
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

async function getPrivKey() {
    let result;
    var arr = [];
    result = await api.getAccounts();
    utils.log('Get controlled accounts:', result);
    let accounts = result.accounts;

    for (i = 0; i < accounts.length; i++) {
        console.log('Loading keystore files...');
        let from = accounts[i].address;
        let keyObj = keythereum.importFromFile(from, datadir2);
        arr[i] = keythereum.recover(password, keyObj);
    }
    return arr;
}

async function get_10000_PrivKey( arr , begin , end ) {
    let result;
    let account = [];
    var num = 0 ; 
    //console.log(arr);
    /*
    
    result = await api.getAccounts();
    utils.log('Get controlled accounts:', result);
    let accounts = result.accounts;*/
    for (i = begin ; i < end ; i++ ) {
        console.log( "account : " , i , " " , arr[i]);
    }
    for (i = begin ; i < end ; i++ ) {
        console.log('Loading keystore files...');
        let keyObj = keythereum.importFromFile(arr[i], datadir);
        let key = keythereum.recover(password, keyObj);
        //console.log(key);
        //console.log(result);
        console.log("PK = ", key );
        account[num] = key;
        num+=1;
    }
    return account;
}

function WriteFile( array , name ) {
    var str = '';
    var buff 
    for (var i = 0 ; i < array.length ; i++ ) {
        str = '';
        buff = array[i];
        for (var ii = 0; ii < buff.length; ii++) {
            if (buff[ii].toString(16).length < 2)
                str +='0x0' + buff[ii].toString(16) + ' ' ;
            else
                str +='0x' + buff[ii].toString(16) + ' ' ;
        };
        if (i == 0){
            fs.writeFileSync( name , i + " " +str+ "\n" , function (err) {
                if (err)
                    console.log(err);
                else
                    console.log('Write operation complete.');
            });
        }
        else{
            fs.appendFileSync( name , i + " " + str+ "\n" , function (err) {
                if (err)
                    console.log(err);
                else
                    console.log('Write operation complete.');
            });
        }
    }

}
