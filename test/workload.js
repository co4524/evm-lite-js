const api = require('/home/caideyi/evm-lite-js/index.js')
const sleep = require('sleep');
const keythereum = require('keythereum');
const ethTx = require('ethereumjs-tx');
const utils = require('/home/caideyi/evm-lite-js/test/utils.js');
const moment = require('moment');
const fs = require('fs');
const readline = require('readline');

// ethereum root directory (for retreive keystore) and keystore password
const source__AddressDir = '/home/caideyi/evm-lite-js//test/testAccount/address'
const source_privKeydir = '/home/caideyi/evm-lite-js/test/testAccount/pKey'
const ouput_dir = '/home/caideyi/evm-lite-js/test/txRequestTime'
var privKey = [];
var sendTime = [];
//const baseURL = 'http://localhost:8080';
var baseURL = [];
const iter = parseInt( process.argv[3] ,10) ; 
testBasicAPI()

async function testBasicAPI() {
    baseURL[0]= 'http://localhost:8080'
    let arr = await getAccount(source__AddressDir);
    console.log('Getting test account address');
    sleep.sleep(1);

    let key = await getKey( source_privKeydir );
    console.log('Getting test account privKey');
    sleep.sleep(1);

    let rawTxList = await genRawtx( arr , key , iter );
    console.log( 'Generate ' , iter , 'Rawtx' );
    sleep.sleep(1);

    console.log('Sending transaction ......');
    //let time = moment().valueOf();
    await workload ( rawTxList , iter ) ;
    //let time2 = moment().valueOf();

    await txRequestTime();

    //console.log(time);
    //console.log("ST: ", moment(time).format('YYYY-MM-DDTHH:mm:ss.SSSS'));
    //console.log("ET: ", moment(time2).format('YYYY-MM-DDTHH:mm:ss.SSSS'));

}

async function workload ( rawTx , iter ) {

    ll = baseURL.length;
    //console.log(ll);
    var interval = parseInt( process.argv[2] , 10 ) ;
    return new Promise((resolve, reject) => {
        for ( var i = 0 ; i < iter ; i++ ) {
            setTimeout( function (i) {
                if (i == iter - 1) {resolve();}
                api.sendRawTx( baseURL[i%ll] , rawTx[i] );
                //console.log("send",i);
                sendTime[i] = moment().valueOf();
            }, interval * i , i ) ;
        }

    });

}

async function genRawtx ( account , privateKey , iter ) {

    var rawTxList = [];
    var num = 0;
    let des = await api.getAccount( baseURL[0], account[0] );
    let to = des.address
    for ( var i = 0 ; i < iter ; i++ ){

        result = await api.getAccount(baseURL[0] , account[num] );
        //console.log(result);
        let txParams = {
            nonce: result.nonce ,//+ addValue,
            to: to,
            gasLimit: '0x30000',
            value: '0x01'
        };
        let tx = new ethTx(txParams);
        tx.sign(privateKey[num]);
        let rawTx = '0x' + tx.serialize().toString('hex');
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


async function getAccount(dir) { 

    var array = fs.readFileSync(dir).toString().split("\n");
    return array;

}


async function txRequestTime() { 

    for (var i = 0 ; i < sendTime.length ; i ++){

        if(i == 0){

            fs.writeFileSync( ouput_dir , sendTime[i] + "\n" , function (err) {
                if (err)
                    console.log(err);
            });

        }

        else{

            fs.appendFileSync( ouput_dir , sendTime[i] + "\n" , function (err) {
                if (err)
                    console.log(err);
                else
                    console.log('Write operation complete.');
            });
        }
    }

}