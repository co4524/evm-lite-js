const api = require('../index.js')
const sleep = require('sleep');
const keythereum = require('keythereum');
const ethTx = require('ethereumjs-tx');
const utils = require('./utils.js');
const moment = require('moment');
const fs = require('fs');
const readline = require('readline');

// ethereum root directory (for retreive keystore) and keystore password
const ethdir = '/home/caideyi/.ethereum';
//keystore location
const accountdir = '/home/caideyi/.ethereum/From';
//10000 account address
const password = 'abc1234';
var privKey = [];
const baseURL = 'http://localhost:8080';

testBasicAPI()

async function testBasicAPI() {

    let arr = await getAccount();
    sleep.sleep(1);
    let ac = await get_10000_PrivKey( arr , parseInt( process.argv[2] ,10) , parseInt( process.argv[3] ,10) );
    await WriteFile( ac , process.argv[4] );

}



async function getAccount() { 

    var array = fs.readFileSync(accountdir).toString().split("\n");
    return array;

}


async function get_10000_PrivKey( arr , begin , end ) {
    let result;
    let account = [];
    var num = 0 ; 
    for (i = begin ; i < end ; i++ ) {
        console.log( "account : " , i , " " , arr[i]);
    }
    for (i = begin ; i < end ; i++ ) {
        console.log('Loading keystore files...');
        let keyObj = keythereum.importFromFile(arr[i], ethdir);
        let key = keythereum.recover(password, keyObj);
        console.log("Account :", arr[i] ," PK = ", key );
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
