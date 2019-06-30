const api = require('/home/caideyi/evm-lite-js/index.js')
const sleep = require('sleep');
const keythereum = require('keythereum');
const ethTx = require('ethereumjs-tx');
const utils = require('/home/caideyi/evm-lite-js/test/utils.js');
const moment = require('moment');
const fs = require('fs');
const readline = require('readline');

// ethereum root directory (for retreive keystore) and keystore password
const URL_dir = '/home/caideyi/evm-lite-js/test/baseURL'
const source__AddressDir = '/home/caideyi/evm-lite-js//test/testAccount/address'
const des_address = '6666666666666666666666666666666666666666'
var baseURL = [];
const threadNum = 6 ;
const iter = parseInt( process.argv[2] ,10) ; 
const init_v = parseInt( process.argv[3] ,10) ;
testBasicAPI()

async function testBasicAPI() {

    baseURL = await getURL(URL_dir);
    await checksum( init_v ) ;

}
async function checksum ( init ) {

    cor = init + iter*6 ;
    for ( var i = 0 ; i < 100 ; i++ ){
        let result = await api.getAccount( baseURL[0], des_address );
        if (result.balance==cor){ break; }
        console.log("expect" , cor);
        console.log("now" , result.balance);
        console.log("wait tx done...");
        await sleep.sleep(2);
    }
    return true ;
}


async function getURL(dir) { 

    var array = fs.readFileSync(dir).toString().split("\n");
    array.splice(array.length-1,1);
    return array;

}
